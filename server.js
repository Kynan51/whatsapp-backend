const express = require("express");
const { default: makeWASocket, useSingleFileAuthState } = require("@adiwajshing/baileys");
const { join } = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Baileys Auth Setup
const { state, saveState } = useSingleFileAuthState(join(__dirname, "auth.json"));
let sock;

async function startBot() {
  sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on("creds.update", saveState);
}
startBot();

app.use(express.json());

app.post("/checkout", async (req, res) => {
  const { items, total, userPhone } = req.body;

  if (!userPhone || !items || !total) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const message = `
🛍️ *New Order from BejeweledByJoy!*
From: ${userPhone}
Items:
${items.map(i => `- ${i.quantity}x ${i.name}`).join('\n')}
Total: Ksh ${total}
`;

  try {
    await sock.sendMessage("254768856680@s.whatsapp.net", { text: message });
    res.json({ message: "Order sent to seller via WhatsApp!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send order." });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
