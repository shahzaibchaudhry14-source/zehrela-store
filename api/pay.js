export default async function handler(req, res) {
  const { amount, email } = req.query;

  if (!amount || !email) {
    return res.status(400).send("Missing data");
  }

  try {
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        pay_currency: "btc",
        order_id: "Zehrela-" + Date.now(),
        order_description: "Payment from " + email
      })
    });

    const data = await response.json();

    if (data.invoice_url) {
      res.writeHead(302, { Location: data.invoice_url });
      res.end();
    } else {
      res.status(500).send("Invoice error");
    }

  } catch (err) {
    res.status(500).send("Server error");
  }
}
