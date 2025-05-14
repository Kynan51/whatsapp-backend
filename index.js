const venom = require('venom-bot');
const express = require('express');
const app = express();
app.use(express.json());

const adminNumber = '254768856680'; // change this if needed

venom
  .create({
    session: 'bejeweled-session',
    multidevice: true, // Required for Venom >= 5.x
    browserArgs: ['--headless=new'], // Use new headless mode for Chrome compatibility
  })
  .then((client) => start(client))
  .catch((err) => {
    console.error('Failed to start Venom bot:', err);
  });

function start(client) {
  console.log('✅ Venom bot is ready');

  // API endpoint to trigger order send
  app.post('/send-order', async (req, res) => {
    const { customerName, customerPhone, items } = req.body;

    const orderMsg = `🛍 New Order!\nCustomer: ${customerName}\nPhone: ${customerPhone}\nItems:\n${items.map(
      (item, i) => `${i + 1}. ${item}`
    ).join('\n')}`;

    try {
      await client.sendText(`${adminNumber}@c.us`, orderMsg);
      res.status(200).json({ status: 'sent' });
    } catch (err) {
      console.error('Failed to send order:', err);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
  });
}
