import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mi_token_seguro_123";
const WHATSAPP_TOKEN = EAFyKs5Y5LgEBQxaATr5K3s5LzjHi2txkC8m2HJTj9vuCzLaelytBOJWBTgAItfZCp7lVt99AJ338H0kZAPo5a573zieqHZAgakF2bG01QJxTHglWAxdY3DNmb4vRkXTzvD56pi3ns4tZCNCgAxpZBUkqVOZCtDDSgrZAnG0ntibKg9QRqDSVpgQdOq3h25fgJ2ZAy3ZBXH30cYelvfJaf7vKQUejfMZA5vVzS02UL0Ed7o5IjdgcmlJZAZCfrug5mdaLz2GoRZAUZCJxZC29xRQXFJz6UOhtxld
const PHONE_NUMBER_ID = 964082273463562
// Verificación webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Recibir mensajes
app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: "Recibí: " + text }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  }

  res.sendStatus(200);
});

app.listen(3000);
