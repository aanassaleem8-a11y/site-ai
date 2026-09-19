const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

/* =====================================================
   CORS
===================================================== */

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

app.use(express.json({ limit: "20mb" }));

/* =====================================================
   GENERATED WEBSITES FOLDER
===================================================== */

const websitesFolder = path.join(
    __dirname,
    "websites"
);

if (!fs.existsSync(websitesFolder)) {
    fs.mkdirSync(websitesFolder, {
        recursive: true
    });
}

/* =====================================================
   HOME
===================================================== */

app.get("/", (req, res) => {
    res.send("SiteAI server is running!");
});

/* =====================================================
   PAYMENT
===================================================== */

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

/* =====================================================
   CREATE PUBLIC WEBSITE
===================================================== */

app.post("/create-website", (req, res) => {

    try {

        const {
            name,
            html
        } = req.body;

        if (!name || !html) {
            return res.status(400).json({
                success: false,
                message: "Website name and HTML are required."
            });
        }

        /* Create safe URL name */

        let slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        if (!slug) {
            slug = "my-website";
        }

        /* Prevent duplicate names */

        let finalSlug = slug;
        let counter = 2;

        while (
            fs.existsSync(
                path.join(
                    websitesFolder,
                    finalSlug + ".html"
                )
            )
        ) {

            finalSlug = `${slug}-${counter}`;

            counter++;
        }

        /* Save website */

        const filePath = path.join(
            websitesFolder,
            finalSlug + ".html"
        );

        fs.writeFileSync(
            filePath,
            html,
            "utf8"
        );

        console.log(
            "Website created:",
            finalSlug
        );

        res.json({
            success: true,
            message: "Website created successfully!",
            slug: finalSlug,
            url: `/site/${finalSlug}`
        });

    } catch (error) {

        console.error(
            "Create website error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Could not create website."
        });
    }
});

/* =====================================================
   OPEN PUBLIC WEBSITE
===================================================== */

app.get("/site/:slug", (req, res) => {

    const slug = req.params.slug;

    /* Security check */

    if (!/^[a-z0-9-]+$/i.test(slug)) {
        return res.status(400).send(
            "Invalid website address."
        );
    }

    const filePath = path.join(
        websitesFolder,
        slug + ".html"
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).send(
            "Website not found."
        );
    }

    res.sendFile(filePath);
});

/* =====================================================
   SERVER
===================================================== */

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});

process.stdin.resume();
