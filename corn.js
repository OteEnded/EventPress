const cron = require("node-cron");
const config = require("./config.json");

const NEXT_API_URL = config.api_endpoint + "/api/data/event/attendee/reminder";

cron.schedule("0 11 * * *", async () => {
    console.log(`[⏰] Cron triggered at ${new Date().toLocaleString()}`);

    try {
        const res = await fetch(
            NEXT_API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "api-key": config.api_key,
                },
            }
        );
        const data = await res.json();
        console.log(`[✅] API responded:`, data);
    } catch (err) {
        console.error(`[❌] API call failed:`, err);
    }
});

console.log(
    "[🟢] Daily cron script started. Will run at 11:00 AM every day...",
    new Date().toLocaleString(),
    config.api_endpoint,
    // config.api_key
);
