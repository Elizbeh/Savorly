// cronJob.js
import cron from 'node-cron';
import db from './config/db.js';

// Cron job to clean up expired tokens every hour
cron.schedule('0 * * * *', async () => {
    try {
        const query = 'DELETE FROM users WHERE verification_token_expires_at < NOW()';
        await db.query(query);
        console.log('Expired tokens cleaned up.');
    } catch (err) {
        console.error('Error cleaning up expired tokens:', err);
    }
});
