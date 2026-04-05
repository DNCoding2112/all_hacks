import axios from 'axios';

export const sendTelegramAlert = async (message: string) => {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === 'your_bot_token_here' || token === '') {
    console.log('[Notifier] Telegram credentials missing, skipping alert.');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });
    console.log('[Notifier] Alert sent successfully.');
  } catch (error) {
    console.error('[Notifier] Failed to send alert:', error);
  }
};
