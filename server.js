import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// آرایه برای ذخیره پیام‌ها
let messages = [];
// قبل از route ها
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // اجازه دادن به همه اوریجین‌ها
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  
// مسیر POST برای Webhook تلگرام
app.post("/telegram_webhook", (req, res) => {
  console.log("New Telegram Message:", req.body);

  if (req.body.message) {
    console.log("Text:", req.body.message.text);

    // ذخیره پیام برای فرانت‌اند
    messages.push({
      id: req.body.message.message_id,
      text: req.body.message.text,
      date: req.body.message.date
    });
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