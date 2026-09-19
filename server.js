const express = require("express");

const app = express();

// Allow requests from your local website
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SiteAI payment server is running!");
});

app.post("/create-payment", (req, res) => {
    const { plan, amount } = req.body;

    console.log("Payment request received:", {
        plan,
        amount
    });

    res.json({
        success: true,
        message: "Payment request received successfully!",
        plan,
        amount
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
process.stdin.resume();