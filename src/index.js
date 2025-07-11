export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(sendPriceUpdate(env));
  },
};

async function sendPriceUpdate(env) {
  const API_URL = "https://api.p3p.repl.co/api/?vs=usd";
  let message = "";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API down: ${response.status}`);

    const data = await response.json();

    message = `
✅ **نرخ ها  HeydasX**

🇺🇸 دلار آمریکا تهران : **${data.usd_buy.toLocaleString('fa-IR')}**
🇺🇸 دلار آمریکا حواله : **${data.usd_sell.toLocaleString('fa-IR')}**
🇪🇺 یورو اروپا : **${data.eur.toLocaleString('fa-IR')}**
🇬🇧 پوند انگلیس : **${data.gbp.toLocaleString('fa-IR')}**
🇦🇪 درهم امارات : **${data.aed.toLocaleString('fa-IR')}**

---

🌕 سکه امامی : **${data.sekee.toLocaleString('fa-IR')}**
🟡 سکه بهار : **${data.sekeb.toLocaleString('fa-IR')}**
🟡 نیم سکه : **${data.nim.toLocaleString('fa-IR')}**
🟡 ربع سکه : **${data.rob.toLocaleString('fa-IR')}**

---

✳️ طلای 18 عیار هرگرم : **${data.geram18.toLocaleString('fa-IR')}**

📅 ${new Date().toLocaleDateString('fa-IR-u-nu-latn', { timeZone: 'Asia/Tehran' })}
⏰ ${new Date().toLocaleTimeString('fa-IR', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit' })}
`;

  } catch (error) {
    console.error("Error fetching prices:", error);
    message = `⚠️ **خطا در دریافت قیمت‌ها**\n\nربات نتوانست به سرور قیمت‌ها متصل شود. لطفاً دقایقی دیگر دوباره تلاش کنید.\n\n${error.message}`;
  }

  // Send the message to Telegram
  const telegramApiUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
  await fetch(telegramApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.CHANNEL_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}
