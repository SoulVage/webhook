import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/telegram_webhook", (req, res) => {
  console.log("New Telegram Message:", req.body);

  // اگر پیام متنی باشد
  if (req.body.message) {
    console.log("Text:", req.body.message.text);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
