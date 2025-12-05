import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(bodyParser.json());

let messages = [];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// تنظیم Gemini via OpenAI–compatible SDK
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,  // استفاده از کلید Gemini
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function cleanHomework(text) {
  try {
    const resp = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are an assistant that ONLY outputs HTML. Format the homework nicely using <div> and CSS classes. Do NOT output anything else outside HTML."
        },
        { role: "user", content: text }
      ],
      reasoning_effort: "low"  // یا مقدار مناسب
    });
    return resp.choices[0].message.content;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "<div>خطا در پردازش تکالیف</div>";
  }
}

app.post("/telegram_webhook", async (req, res) => {
  if (req.body.message && req.body.message.text) {
    const text = req.body.message.text;
    if (text.includes("تکالیف")) {
      console.log("Text:", text);
      const html = await cleanHomework(text);
      console.log("HTML from Gemini:", html);
      messages.push({ id: req.body.message.message_id, text, html, date: req.body.message.date });
    } else {
      console.log("پیام شامل 'تکالیف' نیست، ذخیره نمی‌شود.");
    }
  }
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  res.json(messages);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening on port", PORT));
