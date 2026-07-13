function moveOldWebRequestsEmailsToTrash() {
    const searchQuery = 'label:"Web Requests" older_than:20d';
    const batchSize = 100;
    const maxBatchesPerRun = 10;

    let totalTrashed = 0;

    for (let i = 0; i < maxBatchesPerRun; i++) {
        const threads = GmailApp.search(searchQuery, 0, batchSize);

        if (threads.length === 0) {
            Logger.log('Finished. No more old Web Requests emails found.');
            break;
        }

        GmailApp.moveThreadsToTrash(threads);
        totalTrashed += threads.length;

        Logger.log('Moved to Trash: ' + totalTrashed + ' old threads.');

        Utilities.sleep(500);
    }

    Logger.log('Run finished. Total moved to Trash this run: ' + totalTrashed);
}