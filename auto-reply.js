const CONFIG = {
    // true  = safe test mode, sends reply only to TEST_EMAIL
    // false = live mode, replies inside the original Gmail thread
    TEST_MODE: false,
    TEST_EMAIL: '1seoglobal1@gmail.com',

    MICHAEL_EMAIL: 'mike@withoutatrace.com',
    SHIPPING_URL: 'https://www.withoutatrace.com/shipping/',

    MAIN_LABEL: 'Web Requests',
    ERROR_LABEL: 'AI Auto Reply Error',

    MODEL: 'gpt-4o-mini',

    MAX_EMAILS_TO_SEND_PER_RUN: 2,
    MAX_THREADS_TO_CHECK: 30
};

/**
 * Emergency stop.
 * Run this immediately if anything loops.
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
 * Run this after saving the code.
 * It resets the start time, clears old processing flags,
 * and creates the 1-minute trigger.
 */
function setupAiAutoReplySystem() {
    emergencyStopAiAutoReplySystem();

    getOrCreateLabel_(CONFIG.MAIN_LABEL);
    getOrCreateLabel_(CONFIG.ERROR_LABEL);

    clearOldAiProperties_();

    const props = PropertiesService.getScriptProperties();

    // Emails received before this time are ignored.
    props.setProperty('START_TIME_MS', String(Date.now()));

    ScriptApp.newTrigger('autoSendAiRepliesForNewWebRequests')
        .timeBased()
        .everyMinutes(1)
        .create();

    Logger.log('AI auto-reply system is ready. Old emails will not be processed.');
}

/**
 * Main function. Trigger runs this every minute.
 */
function autoSendAiRepliesForNewWebRequests() {
    const lock = LockService.getScriptLock();

    if (!lock.tryLock(1000)) {
        Logger.log('Another run is active. Skipping.');
        return;
    }

    try {
        const props = PropertiesService.getScriptProperties();
        const apiKey = props.getProperty('OPENAI_API_KEY');

        if (!apiKey) {
            throw new Error('Missing OPENAI_API_KEY in Script Properties.');
        }

        const startTimeMs = Number(props.getProperty('START_TIME_MS') || Date.now());
        const errorLabel = getOrCreateLabel_(CONFIG.ERROR_LABEL);

        const threads = getCandidateThreads_();
        Logger.log('Candidate thread count: ' + threads.length);

        let sentCount = 0;

        for (const thread of threads) {
            if (sentCount >= CONFIG.MAX_EMAILS_TO_SEND_PER_RUN) break;

            let processingKey = '';

            try {
                if (thread.isInTrash()) continue;

                const messages = thread.getMessages();
                const latestMessage = getLatestOriginalWebRequestMessage_(messages, startTimeMs);

                if (!latestMessage) {
                    Logger.log('No safe original Web Request message found in thread.');
                    continue;
                }

                const messageId = latestMessage.getId();
                const processedKey = 'processed_' + messageId;
                processingKey = 'processing_' + messageId;

                if (props.getProperty(processedKey) === '1') {
                    Logger.log('Already processed message: ' + messageId);
                    continue;
                }

                if (props.getProperty(processingKey) === '1') {
                    Logger.log('Already processing message: ' + messageId);
                    continue;
                }

                props.setProperty(processingKey, '1');

                const parsed = parseWebRequest_(latestMessage);

                Logger.log('Subject: ' + parsed.subject);
                Logger.log('Customer name: ' + parsed.customerName);
                Logger.log('Customer email: ' + parsed.customerEmail);
                Logger.log('Customer message: ' + parsed.customerMessage);

                if (!parsed.customerEmail || !isValidEmail_(parsed.customerEmail)) {
                    throw new Error('Could not find valid customer email.');
                }

                if (parsed.customerEmail.toLowerCase().includes('@withoutatrace.com')) {
                    throw new Error('Parsed customer email is business email. Not sending.');
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

                const finalReply = appendRequiredBusinessInfo_(
                    cleanBadAiPhrases_(
                        cleanReply_(aiReply)
                    )
                );

                if (CONFIG.TEST_MODE) {
                    const testSubject = 'AI Auto Reply Test - ' + (parsed.customerName || 'Customer');
                    const testBody =
                        'TEST MODE ONLY\n' +
                        'Real customer email would be: ' + parsed.customerEmail + '\n\n' +
                        finalReply;

                    GmailApp.sendEmail(CONFIG.TEST_EMAIL, testSubject, testBody, {
                        name: 'Michael Ehrlich - Without A Trace',
                        replyTo: CONFIG.MICHAEL_EMAIL
                    });

                    Logger.log('TEST MODE: sent test reply to ' + CONFIG.TEST_EMAIL);
                } else {
                    // LIVE MODE:
                    // This replies inside the original Gmail thread.
                    // Contact Form 7 Mail 1 must have: Reply-To: [your-email]
                    latestMessage.reply(finalReply, {
                        name: 'Michael Ehrlich - Without A Trace',
                        replyTo: CONFIG.MICHAEL_EMAIL
                    });

                    Logger.log('LIVE MODE: replied inside thread for ' + parsed.customerEmail);
                }

                // Keep the thread under Web Requests.
                addLabelToThread_(thread, CONFIG.MAIN_LABEL);

                // Do not add the old AI Auto Replied label anymore.
                removeLabelFromThread_(thread, 'AI Auto Replied');

                props.setProperty(processedKey, '1');
                sentCount++;

            } catch (error) {
                thread.addLabel(errorLabel);
                Logger.log('Error processing thread: ' + error);

            } finally {
                if (processingKey) {
                    props.deleteProperty(processingKey);
                }
            }
        }

        Logger.log('Run finished. Sent count: ' + sentCount);

    } finally {
        lock.releaseLock();
    }
}

/**
 * Finds possible Web Request threads.
 * This searches broadly because some Web Request emails may be archived,
 * labeled, or not in Inbox.
 */
function getCandidateThreads_() {
    const results = [];
    const seen = {};

    const queries = [
        'newer_than:1d "Without A Trace CONTACT FORM" -in:sent -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"',
        'newer_than:1d "Web Request" -in:sent -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"',
        'newer_than:1d from:contact@withoutatrace.com -in:sent -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"',
        'newer_than:1d from:mike@withoutatrace.com "Without A Trace CONTACT FORM" -in:sent -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"',
        'newer_than:1d "New submission from Garment Service Request" -in:sent -subject:"AI Auto Reply Test" -subject:"[TEST]" -subject:"Re:"'
    ];

    queries.forEach(query => {
        const threads = GmailApp.search(query, 0, CONFIG.MAX_THREADS_TO_CHECK);

        threads.forEach(thread => {
            if (!seen[thread.getId()]) {
                seen[thread.getId()] = true;
                results.push(thread);
            }
        });
    });

    const labelsToCheck = [
        'Web Requests',
        'Web Request',
        'web requests',
        'web request',
        'GARMENT SERVICE REQUEST',
        'Garment Service Request',
        'garment service request'
    ];

    labelsToCheck.forEach(labelName => {
        const label = GmailApp.getUserLabelByName(labelName);
        if (!label) return;

        const threads = label.getThreads(0, CONFIG.MAX_THREADS_TO_CHECK);

        threads.forEach(thread => {
            if (!seen[thread.getId()]) {
                seen[thread.getId()] = true;
                results.push(thread);
            }
        });
    });

    return results;
}

/**
 * Finds the newest original Web Request message inside a thread.
 * This avoids replying to AI/test/reply messages.
 */
function getLatestOriginalWebRequestMessage_(messages, startTimeMs) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];

        if (isSafeOriginalWebRequest_(message, startTimeMs)) {
            return message;
        }
    }

    return null;
}

/**
 * Safety checks.
 */
function isSafeOriginalWebRequest_(message, startTimeMs) {
    const messageDateMs = message.getDate().getTime();
    if (messageDateMs < startTimeMs) return false;

    const subject = message.getSubject() || '';
    const body = message.getPlainBody() || '';

    if (/^\s*re:/i.test(subject)) return false;
    if (/^\s*fwd?:/i.test(subject)) return false;
    if (subject.includes('[TEST]')) return false;
    if (/AI Auto Reply Test/i.test(subject)) return false;

    if (/TEST MODE ONLY/i.test(body)) return false;
    if (/Thank you,\s*Michael\s*Without A Trace/i.test(body)) return false;
    if (/AI Auto Reply/i.test(body)) return false;

    const looksLikeWebRequest =
        /Without A Trace CONTACT FORM/i.test(subject) ||
        /Web Request/i.test(subject) ||
        /Garment Service Request/i.test(subject) ||
        /New submission from Garment Service Request/i.test(subject) ||
        /From:\s*/i.test(body);

    if (!looksLikeWebRequest) return false;

    if (!/From:\s*/i.test(body) && !/<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}>/i.test(subject)) {
        return false;
    }

    return true;
}

/**
 * Parses customer info from the Web Request email.
 */
function parseWebRequest_(message) {
    const subject = message.getSubject() || '';
    const rawBody = normalizeLineBreaks_(message.getPlainBody() || '');
    const body = stripQuotedText_(rawBody);

    return {
        subject: subject,
        body: body,
        customerEmail: extractCustomerEmail_(body, subject),
        customerName: extractCustomerName_(body, subject),
        customerMessage: extractCustomerMessage_(body)
    };
}

/**
 * OpenAI prompt.
 * Updated to be more positive/confident and avoid hesitant language.
 */
function generateReplyWithOpenAI_({ apiKey, customerName, customerEmail, subject, customerMessage }) {
    const systemPrompt = `
  You write automatic customer email replies for Michael Ehrlich at Without A Trace.
  
  Your job:
  Read the customer's message carefully. Identify important keywords and phrases. Understand what they are asking about. Write a personalized reply.
  
  Do not send the exact same response every time.
  Vary wording naturally from email to email, but stay within the approved business rules.
  
  Business:
  Without A Trace works with purses, designer handbags, leather jackets, fur coats, reweaving, cleaning, repairs, alterations, and restoration.
  
  Michael's real writing style:
  - Direct
  - Simple
  - Helpful
  - Confident
  - Positive
  - Not too formal
  - Not too polished
  - Sounds like a real person, not a generic autoresponder
  - Short paragraphs
  - Push the customer to bring in or ship the item
  
  Very important tone rule:
  The reply must give the customer confidence.
  Do not sound unsure, negative, or hesitant.
  
  Do NOT use phrases like:
  - "tricky situation"
  - "maybe we can help"
  - "we might be able to help"
  - "I don't know if we can"
  - "we can definitely take a look"
  - "we may be able to"
  - "it might work"
  - "not sure"
  - "possibly"
  
  Better phrases to use:
  - "We can help with this."
  - "We handle this type of work."
  - "We can work on this type of item."
  - "We need to see the item first so we can give you the best repair options."
  - "Once we inspect it, we can go over the work and give you an accurate estimate."
  - "Bring it in or ship it to us."
  
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
  - Do not give prices.
  - Do not invent repair methods, timelines, guarantees, or exact pricing.
  - Do not say "AI", "automatic reply", or "system".
  - Do not say the job is impossible.
  - Do not make the customer feel uncertain.
  - Be positive and confident, but still say the item needs to be inspected before giving a final quote or final repair plan.
  - Encourage the customer to bring the item in or ship it.
  - If shipping, tell them to use the shipping page, print the form, fill it out, sign it, and include it with the item.
  
  How to personalize:
  Use the customer's exact request to guide the answer.
  
  If they mention purse, bag, handbag, Gucci, Chanel, Louis Vuitton, Prada, lining, or hardware:
  Write a confident handbag/purse-related reply. If they ask about branded hardware, explain that branded hardware may not be available, but repair or replacement options can be reviewed after seeing the item.
  
  If they mention leather jacket, leather coat, sleeves, zipper, cuffs, shortening, fitting, or alteration:
  Write a confident leather garment/alteration-related reply. Mention that Michael needs to see it, and fitting or inspection may be needed.
  
  If they mention hole, moth hole, tear, rip, sweater, knit, reweaving, or damage:
  Write a confident repair/reweaving-related reply. Say Without A Trace handles this type of work and needs to inspect it to choose the best repair or reweaving option.
  
  If they mention fur, fur coat, mink, storage, cleaning, or repair:
  Write a confident fur-related reply. Mention fur cleaning, repair, or storage if relevant, and say inspection is needed.
  
  If they mention stain, odor, smell, cat pee, pet urine, smoke, water, cleaning, or restoration:
  Write a confident cleaning/restoration-related reply. Say Without A Trace can help with this type of item, but it needs to be inspected.
  
  If the customer asks "can you help?" or asks a general question:
  Give a general but personal reply and push them to bring it in or ship it.
  
  Required response style:
  - Start with: Hi customer first name,
  - Keep the reply short, usually 2 to 4 short paragraphs.
  - Make it specific to the customer's item.
  - Mention the item they asked about.
  - Be positive and confident.
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
  Make the reply positive and confident.
  Do not use hesitant language.
  `;

    const payload = {
        model: CONFIG.MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.35,
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
 * Adds shipping URL, locations, and clean signature every time.
 */
function appendRequiredBusinessInfo_(reply) {
    let text = reply.trim();

    text = text.replace(/\n*\s*Shipping page:[\s\S]*$/i, '').trim();
    text = text.replace(/\n*\s*Bryn Mawr location:[\s\S]*$/i, '').trim();
    text = text.replace(/\n*\s*Walton location:[\s\S]*$/i, '').trim();

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
 * Removes unwanted AI wording and hesitant phrases.
 */
function cleanBadAiPhrases_(text) {
    return text
        .replace(/That sounds like a tricky situation,?\s*/gi, '')
        .replace(/This sounds like a tricky situation,?\s*/gi, '')
        .replace(/maybe we can help/gi, 'we can help')
        .replace(/we might be able to help/gi, 'we can help')
        .replace(/we may be able to help/gi, 'we can help')
        .replace(/I don't know if we can/gi, 'we need to inspect it first')
        .replace(/not sure if we can/gi, 'we need to inspect it first')
        .replace(/we can definitely take a look at it/gi, 'we can help with this type of work')
        .replace(/we can take a look at it/gi, 'we can help with this type of work')
        .replace(/might work/gi, 'can be reviewed after inspection')
        .replace(/possibly/gi, 'after inspection')
        .trim();
}

function removeAiClosings_(text) {
    let result = text.trim();

    const patterns = [
        /\n+\s*(Looking forward to helping you!?|Looking forward to hearing from you\.?|Hope this helps\.?|Let me know if you have any questions about the process!?|Let me know if you have any questions\.?)\s*$/i,
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
    if (match && match[1]) return firstNameOnly_(match[1].trim());

    match = body.match(/From:\s*([^<\n\r]+)/i);
    if (match && match[1]) return firstNameOnly_(match[1].trim());

    return '';
}

function firstNameOnly_(name) {
    return name.replace(/["']/g, '').trim().split(/\s+/)[0];
}

function extractCustomerMessage_(body) {
    const cleanBody = stripQuotedText_(body).trim();

    let match = cleanBody.match(/Message:\s*([\s\S]*)/i);
    if (match && match[1]) {
        return match[1].trim().substring(0, 4000);
    }

    match = cleanBody.match(/From:[^\n\r]*(?:\r?\n){1,3}([\s\S]*)/i);
    if (match && match[1]) {
        return match[1].trim().substring(0, 4000);
    }

    const lines = cleanBody.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length > 1 && /^From:/i.test(lines[0])) {
        return lines.slice(1).join('\n').trim().substring(0, 4000);
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

function addLabelToThread_(thread, labelName) {
    const label = GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
    thread.addLabel(label);
}

function removeLabelFromThread_(thread, labelName) {
    const label = GmailApp.getUserLabelByName(labelName);
    if (label) {
        thread.removeLabel(label);
    }
}

function clearOldAiProperties_() {
    const props = PropertiesService.getScriptProperties();
    const all = props.getProperties();

    Object.keys(all).forEach(key => {
        if (
            key.indexOf('processed_') === 0 ||
            key.indexOf('processing_') === 0 ||
            key.indexOf('error_') === 0
        ) {
            props.deleteProperty(key);
        }
    });

    Logger.log('Old AI processing properties cleared.');
}

/**
 * Optional OpenAI API test.
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