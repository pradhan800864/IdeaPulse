import cron from "node-cron";
import { runIngestion } from "@/ingestion/ingest";

let isJobRunning = false;

export function initCronJobs() {
    console.log('Initializing cron jobs...');

    // Run every 30 minutes
    cron.schedule('*/120 * * * *', async () => {
        if (isJobRunning) {
            console.log('Skipping scheduled ingestion, job already running');
            return;
        }

        isJobRunning = true;
        try {
            await runIngestion();
        } catch (e) {
            console.error('Scheduled ingestion failed', e);
        } finally {
            isJobRunning = false;
        }
    });
}
