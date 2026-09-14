const express = require("express");
const fs = require("fs");
const path = require("path");

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

app.use(express.json({ limit: "10mb" }));

// ===============================
// PUBLIC WEBSITE STORAGE
// ===============================

const sitesFolder = path.join(__dirname, "sites");

if (!fs.existsSync(sitesFolder)) {
    fs.mkdirSync(sitesFolder, { recursive: true });
}

// Create a safe website name
function makeSlug(name) {
    return String(name || "siteai-website")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50) || "siteai-website";
}

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.send("SiteAI payment + website server is running!");
});

// ===============================
// CREATE PUBLIC WEBSITE
// ===============================

app.post("/api/sites", (req, res) => {
    try {
        const { name, html } = req.body;

        if (!html) {
            return res.status(400).json({
                success: false,
                message: "Website HTML is required."
            });
        }

        let slug = makeSlug(name);

        // If same name already exists, add a unique number
        let filePath = path.join(sitesFolder, `${slug}.html`);
        let counter = 2;

        while (fs.existsSync(filePath)) {
            slug = `${makeSlug(name)}-${counter}`;
            filePath = path.join(sitesFolder, `${slug}.html`);
            counter++;
        }

        // Save website HTML
        fs.writeFileSync(filePath, html, "utf8");

        // Public URL
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const siteUrl = `${baseUrl}/sites/${slug}`;

        console.log("Website created:", siteUrl);

        res.json({
            success: true,
            message: "Website created successfully!",
            slug,
            url: siteUrl
        });

    } catch (error) {
        console.error("Website creation error:", error);

        res.status(500).json({
            success: false,
            message: "Could not create website."
        });
    }
});

// ===============================
// OPEN PUBLIC WEBSITE
// ===============================

app.get("/sites/:slug", (req, res) => {
    const slug = makeSlug(req.params.slug);
    const filePath = path.join(sitesFolder, `${slug}.html`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("Website not found.");
    }

    res.sendFile(filePath);
});

// ===============================
// PAYMENT
// ===============================

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

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.stdin.resume();
