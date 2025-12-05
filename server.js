import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/telegram_webhook", (req, res) => {
  console.log("New Telegram Message:", req.body);

  if (req.body.message) {
    console.log("Text:", req.body.message.text);
  }

  res.sendStatus(200);
});

// ❗ مهم برای Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
