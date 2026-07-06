const CONFIG = {
    // Keep true while testing.
    // When true, AI replies go only to TEST_EMAIL, not real customers.
    TEST_MODE: false,
    TEST_EMAIL: '1seoglobal1@gmail.com',

    MICHAEL_EMAIL: 'mike@withoutatrace.com',
    BUSINESS_NAME: 'Without A Trace',
    SHIPPING_URL: 'https://www.withoutatrace.com/shipping/',

    PROCESSED_LABEL: 'AI Auto Replied',
    ERROR_LABEL: 'AI Auto Reply Error',

    // These must match Gmail labels exactly.
    LABELS_TO_CHECK: [
        'Web Requests',
        'web requests',
        'GARMENT SERVICE REQUEST',
        'Garment Service Request',
        'garment service request'
    ],

    MODEL: 'gpt-4o-mini',

    // Keep this as 1 while testing.
    MAX_THREADS_PER_RUN: 1
};

/**
 * Emergency stop.
 * Run this if emails start looping.
 */
function emergencyStopAiAutoReplySystem() {
    ScriptApp.getProjectTriggers().forEach(trigger => {
        if (trigger.getHandlerFunction() === 'autoSendAiRepliesForNewWebRequests') {
            ScriptApp.deleteTrigger(trigger);
        }
    });

    Logger.log('AI auto-reply trigger stopped.');
}

/**
 * Setup.
 * Run this once after saving the code.
 * It resets the start time so old emails are ignored.
 */
function setupAiAutoReplySystem() {
    emergencyStopAiAutoReplySystem();

    getOrCreateLabel_(CONFIG.PROCESSED_LABEL);
    getOrCreateLabel_(CONFIG.ERROR_LABEL);

    const props = PropertiesService.getScriptProperties();

    // Ignore all emails before this setup time.
    props.setProperty('START_TIME_MS', String(Date.now()));

    ScriptApp.newTrigger('autoSendAiRepliesForNewWebRequests')
        .timeBased()
        .everyMinutes(1)
        .create();

    Logger.log('AI auto-reply system is ready. Old emails will not be processed.');
}

/**
 * Main function.
 * Trigger runs this every minute.
 */
function autoSendAiRepliesForNewWebRequests() {
    const lock = LockService.getScriptLock();

    // Prevent two runs from happening at the same time.
    if (!lock.tryLock(1000)) {
        Logger.log('Another run is already active. Skipping this run.');
        return;
    }

    try {
        const props = PropertiesService.getScriptProperties();
        const apiKey = props.getProperty('OPENAI_API_KEY');

        if (!apiKey) {
            throw new Error('Missing OPENAI_API_KEY in Script Properties.');
        }

        const startTimeMs = Number(props.getProperty('START_TIME_MS') || Date.now());
        const processedLabel = getOrCreateLabel_(CONFIG.PROCESSED_LABEL);
        const errorLabel = getOrCreateLabel_(CONFIG.ERROR_LABEL);

        const threads = getCandidateThreads_();

        threads.forEach(thread => {
            try {
                if (threadHasLabel_(thread, CONFIG.PROCESSED_LABEL)) return;
                if (threadHasLabel_(thread, CONFIG.ERROR_LABEL)) return;
                if (thread.isInTrash()) return;

                const messages = thread.getMessages();
                const latestMessage = messages[messages.length - 1];
                if (!latestMessage) return;

                if (!isSafeOriginalWebRequest_(latestMessage, startTimeMs)) return;

                const messageId = latestMessage.getId();
                const processedKey = 'processed_' + messageId;
                const processingKey = 'processing_' + messageId;

                if (props.getProperty(processedKey) === '1') return;
                if (props.getProperty(processingKey) === '1') return;

                props.setProperty(processingKey, '1');

                const parsed = parseWebRequest_(latestMessage);

                if (!parsed.customerEmail || !isValidEmail_(parsed.customerEmail)) {
                    throw new Error('Could not find valid customer email.');
                }

                if (parsed.customerEmail.toLowerCase().includes('@withoutatrace.com')) {
                    throw new Error('Customer email looks like business email. Skipping.');
                }

                if (!parsed.customerMessage || parsed.customerMessage.length < 5) {
                    throw new Error('Customer message is empty or too short.');
                }

                const aiReply = generateReplyWithOpenAI_({
                    apiKey: apiKey,
                    customerName: parsed.customerName || 'there',
                    customerEmail: parsed.customerEmail,
                    subject: parsed.subject,
                    customerMessage: parsed.customerMessage
                });

                const finalReply = appendRequiredBusinessInfo_(cleanReply_(aiReply));

                let sendTo = parsed.customerEmail;
                let emailSubject = 'Re: Your request to Without A Trace';
                let emailBody = finalReply;

                if (CONFIG.TEST_MODE) {
                    sendTo = CONFIG.TEST_EMAIL;
                    emailSubject = 'AI Auto Reply Test - ' + (parsed.customerName || 'Customer');
                    emailBody =
                        'TEST MODE ONLY\n' +
                        'Real customer email would be: ' + parsed.customerEmail + '\n\n' +
                        finalReply;
                }

                GmailApp.sendEmail(sendTo, emailSubject, emailBody, {
                    name: 'Michael Ehrlich - Without A Trace',
                    replyTo: CONFIG.MICHAEL_EMAIL
                });

                thread.addLabel(processedLabel);
                props.setProperty(processedKey, '1');
                props.deleteProperty(processingKey);

                Logger.log('AI reply sent to: ' + sendTo);

            } catch (error) {
                thread.addLabel(errorLabel);
                Logger.log('Error processing thread: ' + error);
            }
        });

    } finally {
        lock.releaseLock();
    }
}

/**
 * Finds only likely new web request threads.
 */
function getCandidateThreads_() {
    const results = [];
    const seen = {};

    CONFIG.LABELS_TO_CHECK.forEach(labelName => {
        const label = GmailApp.getUserLabelByName(labelName);
        if (!label) return;

        const threads = label.getThreads(0, CONFIG.MAX_THREADS_PER_RUN);

        threads.forEach(thread => {
            if (!seen[thread.getId()]) {
                seen[thread.getId()] = true;
                results.push(thread);
            }
        });
    });

    const searchQuery =
        'newer_than:1d in:inbox subject:"Without A Trace CONTACT FORM" -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"';

    const searchThreads = GmailApp.search(searchQuery, 0, CONFIG.MAX_THREADS_PER_RUN);

    searchThreads.forEach(thread => {
        if (!seen[thread.getId()]) {
            seen[thread.getId()] = true;
            results.push(thread);
        }
    });

    return results.slice(0, CONFIG.MAX_THREADS_PER_RUN);
}

/**
 * Strong safety check to prevent loops.
 */
function isSafeOriginalWebRequest_(message, startTimeMs) {
    const messageDateMs = message.getDate().getTime();

    if (messageDateMs < startTimeMs) return false;

    const subject = message.getSubject() || '';
    const body = message.getPlainBody() || '';

    // Do not process replies, forwards, or test emails.
    if (/^\s*re:/i.test(subject)) return false;
    if (/^\s*fwd?:/i.test(subject)) return false;
    if (subject.includes('[TEST]')) return false;
    if (/AI Auto Reply Test/i.test(subject)) return false;

    // Do not process AI-generated emails.
    if (/TEST MODE ONLY/i.test(body)) return false;
    if (/Thank you,\s*Michael\s*Without A Trace/i.test(body)) return false;
    if (/AI Auto Reply/i.test(body)) return false;

    // Must look like a website form notification.
    const looksLikeContactForm =
        /Without A Trace CONTACT FORM/i.test(subject) ||
        /Web Request/i.test(subject) ||
        /Garment Service Request/i.test(subject) ||
        /From:\s*/i.test(body);

    if (!looksLikeContactForm) return false;

    // The original website email body should contain customer info.
    if (!/From:\s*/i.test(body)) return false;

    return true;
}

/**
 * Parse customer info from Contact Form 7 email.
 */
function parseWebRequest_(message) {
    const subject = message.getSubject() || '';
    const rawBody = normalizeLineBreaks_(message.getPlainBody() || '');
    const body = stripQuotedText_(rawBody);

    const customerEmail = extractCustomerEmail_(body, subject);
    const customerName = extractCustomerName_(body, subject);
    const customerMessage = extractCustomerMessage_(body);

    return {
        subject: subject,
        body: body,
        customerEmail: customerEmail,
        customerName: customerName,
        customerMessage: customerMessage
    };
}

function generateReplyWithOpenAI_({ apiKey, customerName, customerEmail, subject, customerMessage }) {
    const systemPrompt = `
  You write automatic customer email replies for Michael Ehrlich at Without A Trace.
  
  Your job:
  Read the customer's message carefully, identify the important keywords and phrases, understand what service they are asking about, and write a personalized reply.
  
  Do NOT send the same style of response every time.
  Vary the wording naturally from email to email, but stay within the approved business rules.
  
  Business:
  Without A Trace works with purses, designer handbags, leather jackets, fur coats, reweaving, cleaning, repairs, alterations, and restoration.
  
  Michael's real writing style:
  - Direct
  - Simple
  - Helpful
  - Confident
  - Not too formal
  - Not too polished
  - Sounds like a real person, not a generic autoresponder
  - Short paragraphs
  - Push the customer to bring in or ship the item
  
  Examples of Michael's style:
  - "We need the purse before we can give you a quote."
  - "We can help."
  - "Bring it in."
  - "Ship it to us."
  - "Go to our website, look for shipping, print the form, fill it out, sign it, and include it with the item."
  - "Once we receive and inspect it, we will contact you."
  
  Important business rules:
  - Do not give a final estimate by email.
  - Do not give a final estimate from photos.
  - Do not promise that the work can definitely be done unless it is very general.
  - Do not give prices unless the customer is asking about something very simple and Michael has clearly provided a price range before. In general, avoid prices.
  - In most cases, say the item needs to be inspected before Michael can give a quote or final answer.
  - Encourage the customer to bring the item in or ship it.
  - If shipping, tell them to use the shipping page, print the form, fill it out, sign it, and include it with the item.
  - Do not invent repair methods, timelines, guarantees, or exact pricing.
  - Do not say "AI", "automatic reply", or "system".
  
  How to personalize:
  Use the customer's exact request to guide the answer.
  
  If they mention purse, bag, handbag, Gucci, Chanel, Louis Vuitton, Prada, lining, or hardware:
  Write a handbag/purse-related reply. If they ask about branded hardware, explain that branded hardware may not be available, but Michael can review repair or replacement options after seeing the item.
  
  If they mention leather jacket, leather coat, sleeves, zipper, cuffs, shortening, fitting, or alteration:
  Write a leather garment/alteration-related reply. Mention that Michael needs to see it, and fitting may be needed.
  
  If they mention hole, moth hole, tear, rip, sweater, knit, reweaving, or damage:
  Write a repair/reweaving-related reply. Say Michael needs to inspect it to see what repair or reweaving option is possible.
  
  If they mention fur, fur coat, mink, storage, cleaning, or repair:
  Write a fur-related reply. Mention inspection and fur cleaning/repair/storage if relevant.
  
  If they mention stain, odor, smell, cat pee, pet urine, smoke, water, cleaning, or restoration:
  Write a cleaning/restoration-related reply. Say Michael can take a look, but the item needs inspection.
  
  If the customer asks "can you help?" or asks a general question:
  Give a general but personal reply and push them to bring it in or ship it.
  
  Required response style:
  - Start with: Hi customer first name,
  - Keep the reply short, usually 2 to 4 short paragraphs.
  - Make it specific to the customer's item.
  - Mention the item they asked about.
  - Do not sound too perfect or corporate.
  - Do not use "I can definitely help."
  - Do not use "Looking forward to helping you."
  - Do not include Best, Regards, Thank you, Michael, or Without A Trace.
  - Do not include the full location block.
  - Do not include the shipping URL.
  - The system will add shipping URL, locations, and signature automatically.
  
  Write only the main personalized email body.
  `;
  
    const userPrompt = `
  Customer name: ${customerName}
  Customer email: ${customerEmail}
  Original email subject: ${subject}
  
  Customer message:
  ${customerMessage}
  
  Write a personalized reply based on the customer's message.
  Do not make it generic.
  Use the customer's keywords and item type to shape the response.
  `;
  
    const payload = {
      model: CONFIG.MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.45,
      max_tokens: 350
    };
  
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  
    const code = response.getResponseCode();
    const text = response.getContentText();
  
    if (code < 200 || code >= 300) {
      throw new Error('OpenAI API error: ' + text);
    }
  
    const json = JSON.parse(text);
    return json.choices[0].message.content;
  }

/**
 * Always adds shipping URL, both locations, and one clean signature.
 */
function appendRequiredBusinessInfo_(reply) {
    let text = reply.trim();

    // Remove accidental duplicate shipping/location blocks if AI adds them.
    text = text.replace(/\n*\s*Shipping page:[\s\S]*$/i, '').trim();
    text = text.replace(/\n*\s*Bryn Mawr location:[\s\S]*$/i, '').trim();
    text = text.replace(/\n*\s*Walton location:[\s\S]*$/i, '').trim();

    // Remove AI-created endings/signatures.
    text = removeAiClosings_(text);

    const requiredInfo =
        `\n\nShipping page:
  ${CONFIG.SHIPPING_URL}
  
  Bryn Mawr location:
  3344 W. Bryn Mawr
  Chicago, IL
  Hours: Monday through Thursday, 7:00 AM – 4:00 PM
  Phone: 773-588-4922
  
  Walton location:
  100 E. Walton
  Chicago, IL
  Hours: Tuesday through Friday, 9:30 AM – 5:30 PM
  Saturday, 9:30 AM – 3:00 PM
  Phone: 312-787-9922
  
  Thank you,
  Michael
  Without A Trace`;

    return text + requiredInfo;
}

/**
 * Removes unwanted AI closing lines from the end.
 */
function removeAiClosings_(text) {
    let result = text.trim();

    const patterns = [
        /\n+\s*(Looking forward to helping you!?|Looking forward to hearing from you\.?|Hope this helps\.?)\s*$/i,
        /\n+\s*(Best|Regards|Thanks|Thank you|Sincerely),?\s*\n\s*Michael\s*(?:\n\s*Without A Trace)?\s*$/i,
        /\n+\s*(Best|Regards|Thanks|Thank you|Sincerely),?\s*$/i,
        /\n+\s*Michael\s*(?:\n\s*Without A Trace)?\s*$/i
    ];

    let changed = true;
    let count = 0;

    while (changed && count < 10) {
        changed = false;
        count++;

        patterns.forEach(pattern => {
            const before = result;
            result = result.replace(pattern, '').trim();
            if (before !== result) changed = true;
        });
    }

    return result.trim();
}

function extractCustomerEmail_(body, subject) {
    const sources = [subject, body];

    for (const source of sources) {
        let match = source.match(/<([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})>/i);
        if (match && match[1]) return match[1].trim();

        match = source.match(/Email:\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
        if (match && match[1]) return match[1].trim();

        match = source.match(/From:\s*.*?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
        if (match && match[1]) return match[1].trim();
    }

    const anyEmail = body.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return anyEmail ? anyEmail[0].trim() : '';
}

function extractCustomerName_(body, subject) {
    let match = subject.match(/CONTACT FORM\s*-\s*([^<]+)/i);
    if (match && match[1]) return match[1].trim();

    match = body.match(/From:\s*([^<\n\r]+)/i);
    if (match && match[1]) return match[1].trim();

    return '';
}

function extractCustomerMessage_(body) {
    let cleanBody = stripQuotedText_(body).trim();

    let match = cleanBody.match(/Message:\s*([\s\S]*)/i);
    if (match && match[1]) {
        return match[1].trim().substring(0, 4000);
    }

    // Handles format:
    // From: Name
    //
    // Customer message here
    match = cleanBody.match(/From:[^\n\r]*(?:\r?\n){1,3}([\s\S]*)/i);
    if (match && match[1]) {
        return match[1].trim().substring(0, 4000);
    }

    return cleanBody.substring(0, 4000);
}

function stripQuotedText_(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/On\s.+wrote:[\s\S]*$/i, '')
        .replace(/-{2,}\s*Forwarded message\s*-{2,}[\s\S]*$/i, '')
        .trim();
}

function normalizeLineBreaks_(text) {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function cleanReply_(text) {
    return text
        .replace(/^Subject:.*$/gim, '')
        .replace(/```/g, '')
        .trim();
}

function isValidEmail_(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getOrCreateLabel_(name) {
    return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function threadHasLabel_(thread, labelName) {
    return thread.getLabels().some(label => label.getName() === labelName);
}

/**
 * Optional API test.
 * Run this after adding OPENAI_API_KEY.
 */
function testOpenAiApiKey() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');

    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY in Script Properties.');
    }

    const payload = {
        model: CONFIG.MODEL,
        messages: [
            { role: 'user', content: 'Say API test successful.' }
        ],
        max_tokens: 20
    };

    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post',
        contentType: 'application/json',
        headers: {
            Authorization: 'Bearer ' + apiKey
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    });

    Logger.log(response.getResponseCode());
    Logger.log(response.getContentText());
}