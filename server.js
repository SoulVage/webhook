import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// آرایه برای ذخیره پیام‌ها
let messages = [];

// قبل از route ها: فعال کردن CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // اجازه دادن به همه اوریجین‌ها
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// مسیر POST برای Webhook تلگرام
app.post("/telegram_webhook", (req, res) => {
  console.log("New Telegram Message:", req.body);

  if (req.body.message && req.body.message.text) {
    const text = req.body.message.text;

    // فقط پیام‌هایی که شامل "تکالیف" هستند ذخیره شوند
    if (text.includes("تکالیف")) {
      console.log("Text:", text);

      messages.push({
        id: req.body.message.message_id,
        text: text,
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
