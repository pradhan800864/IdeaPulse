export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Lazy load to prevent bundling issues in edge or browser
        const { initCronJobs } = await import('@/jobs/cron');
        initCronJobs();
    }
}
