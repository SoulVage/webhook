import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// آرایه برای ذخیره پیام‌ها
let messages = [];

// قبل از route ها: فعال کردن CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// تنظیم OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// تابع برای تمیز کردن تکالیف و ساخت HTML
async function cleanHomework(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant that ONLY outputs HTML. Format the homework nicely using <div> with class names, do NOT write anything else outside HTML."
        },
        { role: "user", content: text }
      ],
      max_tokens: 1500
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI Error:", err);
    return "<div>خطا در پردازش تکالیف</div>";
  }
}

// مسیر POST برای Webhook تلگرام
app.post("/telegram_webhook", async (req, res) => {
  if (req.body.message && req.body.message.text) {
    const text = req.body.message.text;

    // فقط پیام‌هایی که شامل "تکالیف" هستند
    if (text.includes("تکالیف")) {
      console.log("Text:", text);

      // گرفتن HTML از AI
      const html = await cleanHomework(text);
      console.log("HTML Generated:", html);

      messages.push({
        id: req.body.message.message_id,
        text,
        html,
        date: req.body.message.date
      });
    } else {
      console.log("پیام شامل 'تکالیف' نیست، ذخیره نمی‌شود.");
    }
  }
  res.sendStatus(200);
});

// مسیر GET برای فرانت‌اند
app.get("/messages", (req, res) => {
  res.json(messages);
});

// پورت Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
