/* =========================================================
   SITEAI — AI WEBSITE BUILDER
   MAIN JAVASCRIPT
   ========================================================= */

"use strict";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const websiteForm = document.getElementById("websiteForm");

const businessNameInput = document.getElementById("businessName");
const businessTypeInput = document.getElementById("businessType");
const businessDescriptionInput = document.getElementById("businessDescription");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

const logoInput = document.getElementById("logo");
const businessImagesInput = document.getElementById("businessImages");

const generateButton = document.querySelector(".generate-btn");


/* =========================================================
   FORM SUBMIT
   ========================================================= */

if (websiteForm) {
    websiteForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        try {
            const businessName = businessNameInput?.value.trim() || "";
            const businessType = businessTypeInput?.value || "other";
            const businessDescription =
                businessDescriptionInput?.value.trim() || "";

            const phone = phoneInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";

            /* -------------------------
               VALIDATION
            ------------------------- */

            if (!businessName) {
                showMessage("Please enter your business name.", "error");
                businessNameInput?.focus();
                return;
            }

            if (!businessDescription) {
                showMessage(
                    "Please enter a short description of your business.",
                    "error"
                );
                businessDescriptionInput?.focus();
                return;
            }

            /* -------------------------
               LOADING STATE
            ------------------------- */

            const originalButtonText = generateButton
                ? generateButton.innerHTML
                : "";

            if (generateButton) {
                generateButton.disabled = true;
                generateButton.innerHTML = "✦ Generating Website...";
            }

            showMessage("Your website is being generated...", "success");

            /* Small delay for better UX */
            await delay(1200);

            /* -------------------------
               LOGO
            ------------------------- */

            let logoData = "";

            if (logoInput && logoInput.files.length > 0) {
                logoData = await fileToDataURL(logoInput.files[0]);
            }

            /* -------------------------
               BUSINESS IMAGES
            ------------------------- */

            let imageData = [];

            if (businessImagesInput && businessImagesInput.files.length > 0) {
                const files = Array.from(businessImagesInput.files);

                imageData = await Promise.all(
                    files.map((file) => fileToDataURL(file))
                );
            }

            /* -------------------------
               WEBSITE DATA
            ------------------------- */

            const websiteData = {
                name: businessName,
                type: businessType,
                description: businessDescription,
                phone: phone,
                email: email,
                logo: logoData,
                images: imageData
            };

            /* -------------------------
               GENERATE WEBSITE
            ------------------------- */

            const websiteHTML = generateWebsite(websiteData);

            /* -------------------------
               OPEN GENERATED WEBSITE
            ------------------------- */

            const websiteBlob = new Blob(
                [websiteHTML],
                {
                    type: "text/html;charset=utf-8"
                }
            );

            const websiteURL = URL.createObjectURL(websiteBlob);

            const newWindow = window.open(
                websiteURL,
                "_blank"
            );

            if (!newWindow) {
                showMessage(
                    "Popup blocked! Please allow popups for SiteAI.",
                    "error"
                );
            } else {
                showMessage(
                    "Website generated successfully! 🚀",
                    "success"
                );
            }

            /* Restore button */

            if (generateButton) {
                generateButton.disabled = false;
                generateButton.innerHTML = originalButtonText;
            }

        } catch (error) {

            console.error("SiteAI Error:", error);

            showMessage(
                "Something went wrong while generating the website.",
                "error"
            );

            if (generateButton) {
                generateButton.disabled = false;
                generateButton.innerHTML = "✦ Generate My Website";
            }
        }
    });
}


/* =========================================================
   MAIN WEBSITE GENERATOR
   ========================================================= */

function generateWebsite(data) {

    const businessName = escapeHTML(
        data.name || "My Business"
    );

    const businessType = data.type || "other";

    const description = escapeHTML(
        data.description ||
        "We provide professional products and services for our customers."
    );

    const phone = escapeHTML(
        data.phone || "03100374046"
    );

    const email = escapeHTML(
        data.email || "aanassaleem8@gmmail.com"
    );

    const logo = data.logo || "";

    const images = Array.isArray(data.images)
        ? data.images
        : [];

    const safeBusinessName = safeFileName(
        data.name || "siteai-website"
    );

    const template = getBusinessTemplate(
        businessType,
        businessName,
        description
    );

    const logoHTML = logo
        ? `
            <img
                src="${encodeAttribute(logo)}"
                alt="${encodeAttribute(businessName)} logo"
                class="site-logo-image"
                data-site-logo
            >
        `
        : `
            <div class="site-logo-text">
                ${getInitials(data.name || "My Business")}
            </div>
        `;

    const heroLogoHTML = logo
        ? `
            <img
                src="${encodeAttribute(logo)}"
                alt="${encodeAttribute(businessName)}"
                class="hero-logo"
                data-site-logo
            >
        `
        : "";

    const galleryHTML = createGallery(images, businessName);

    const phoneClean = (data.phone || "").replace(
        /[^0-9+]/g,
        ""
    );

    const whatsappNumber = phoneClean.startsWith("0")
        ? "92" + phoneClean.substring(1)
        : phoneClean.replace("+", "");

    const whatsappURL = whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : "#";

    const callURL = phoneClean
        ? `tel:${phoneClean}`
        : "#";

    const emailURL = data.email
        ? `mailto:${data.email}`
        : "#";

    return `<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<meta
    name="description"
    content="${encodeAttribute(
        data.description || businessName
    )}"
>

<title>${businessName}</title>

<style>

:root {
    --accent: #8b5cf6;
    --accent-dark: #6d28d9;
    --accent-light: #a78bfa;

    --bg: #070711;
    --surface: #11111d;
    --surface-2: #181827;

    --text: #ffffff;
    --muted: #a7a7b7;

    --border: rgba(255,255,255,0.10);

    --site-font: Arial, sans-serif;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: var(--site-font);
    background:
        radial-gradient(
            circle at top right,
            rgba(139,92,246,0.14),
            transparent 35%
        ),
        var(--bg);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
}

a {
    color: inherit;
    text-decoration: none;
}

img {
    max-width: 100%;
    display: block;
}

button,
input,
select {
    font: inherit;
}

.container {
    width: min(1120px, calc(100% - 40px));
    margin: 0 auto;
}


/* =========================================================
   NAVBAR
   ========================================================= */

.site-nav {
    position: sticky;
    top: 0;
    z-index: 100;

    background: rgba(7,7,17,0.86);
    backdrop-filter: blur(18px);

    border-bottom: 1px solid var(--border);
}

.nav-inner {
    min-height: 76px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 25px;
}

.site-brand {
    display: flex;
    align-items: center;
    gap: 12px;

    font-size: 20px;
    font-weight: 800;
}

.site-logo-image {
    width: 46px;
    height: 46px;

    object-fit: contain;

    border-radius: 12px;
}

.site-logo-text {
    width: 46px;
    height: 46px;

    border-radius: 12px;

    display: grid;
    place-items: center;

    background:
        linear-gradient(
            135deg,
            var(--accent),
            var(--accent-dark)
        );

    color: #fff;
    font-weight: 900;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 25px;
}

.nav-links a {
    color: var(--muted);
    font-size: 14px;
    font-weight: 600;

    transition: 0.25s ease;
}

.nav-links a:hover {
    color: var(--text);
}

.nav-button {
    padding: 10px 17px;

    border-radius: 10px;

    background: var(--accent);
    color: white !important;
}


/* =========================================================
   HERO
   ========================================================= */

.hero {
    min-height: 650px;

    display: flex;
    align-items: center;

    padding: 90px 0 80px;

    position: relative;
}

.hero-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;

    align-items: center;

    gap: 70px;
}

.hero-content {
    position: relative;
    z-index: 2;
}

.hero-kicker {
    display: inline-flex;

    padding: 7px 13px;

    border-radius: 999px;

    background: rgba(139,92,246,0.12);
    border: 1px solid rgba(139,92,246,0.25);

    color: var(--accent-light);

    font-size: 13px;
    font-weight: 700;

    margin-bottom: 22px;
}

.hero h1 {
    font-size: clamp(42px, 6vw, 72px);

    line-height: 1.02;

    letter-spacing: -2px;

    margin-bottom: 22px;
}

.hero h1 span {
    color: var(--accent-light);
}

.hero-description {
    max-width: 650px;

    color: var(--muted);

    font-size: 18px;

    margin-bottom: 32px;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
}

.primary-button,
.secondary-button {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    min-height: 48px;

    padding: 0 21px;

    border-radius: 12px;

    font-weight: 800;

    transition: 0.25s ease;
}

.primary-button {
    background: var(--accent);
    color: #fff;
}

.primary-button:hover {
    background: var(--accent-dark);
    transform: translateY(-2px);
}

.secondary-button {
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.04);
}

.secondary-button:hover {
    background: rgba(255,255,255,0.08);
}

.hero-visual {
    display: flex;
    justify-content: center;
}

.hero-card {
    width: min(420px, 100%);

    padding: 30px;

    border-radius: 28px;

    background:
        linear-gradient(
            145deg,
            rgba(139,92,246,0.16),
            rgba(255,255,255,0.04)
        );

    border: 1px solid var(--border);

    box-shadow:
        0 30px 90px rgba(0,0,0,0.35);
}

.hero-logo {
    width: 130px;
    height: 130px;

    margin: 0 auto 24px;

    object-fit: contain;

    border-radius: 24px;

    background: rgba(255,255,255,0.06);

    padding: 15px;
}

.hero-card h3 {
    text-align: center;

    font-size: 26px;

    margin-bottom: 8px;
}

.hero-card p {
    text-align: center;

    color: var(--muted);
}


/* =========================================================
   SECTIONS
   ========================================================= */

.section {
    padding: 90px 0;
}

.section-heading {
    max-width: 700px;

    margin: 0 auto 45px;

    text-align: center;
}

.section-heading h2 {
    font-size: clamp(30px, 4vw, 46px);

    line-height: 1.1;

    margin-bottom: 13px;
}

.section-heading p {
    color: var(--muted);
}


/* =========================================================
   CARDS
   ========================================================= */

.card-grid {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 20px;
}

.card {
    padding: 28px;

    border: 1px solid var(--border);

    border-radius: 20px;

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.055),
            rgba(255,255,255,0.025)
        );

    transition: 0.25s ease;
}

.card:hover {
    transform: translateY(-5px);

    border-color:
        rgba(139,92,246,0.35);
}

.card-icon {
    width: 48px;
    height: 48px;

    display: grid;
    place-items: center;

    border-radius: 14px;

    background:
        rgba(139,92,246,0.15);

    margin-bottom: 20px;

    font-size: 22px;
}

.card h3 {
    margin-bottom: 8px;
}

.card p {
    color: var(--muted);
}


/* =========================================================
   ABOUT
   ========================================================= */

.about-box {
    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 35px;

    align-items: center;
}

.about-panel {
    padding: 35px;

    border-radius: 24px;

    background: var(--surface);

    border: 1px solid var(--border);
}

.about-panel h2 {
    font-size: 38px;

    margin-bottom: 18px;
}

.about-panel p {
    color: var(--muted);
}


/* =========================================================
   GALLERY
   ========================================================= */

.gallery-grid {
    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 18px;
}

.gallery-item {
    aspect-ratio: 1 / 0.8;

    overflow: hidden;

    border-radius: 18px;

    border: 1px solid var(--border);

    background: var(--surface);
}

.gallery-item img {
    width: 100%;
    height: 100%;

    object-fit: cover;

    transition: transform 0.35s ease;
}

.gallery-item:hover img {
    transform: scale(1.05);
}


/* =========================================================
   CONTACT
   ========================================================= */

.contact-section {
    padding-bottom: 110px;
}

.contact-box {
    padding: 45px;

    border-radius: 28px;

    background:
        linear-gradient(
            135deg,
            rgba(139,92,246,0.18),
            rgba(255,255,255,0.04)
        );

    border: 1px solid var(--border);

    text-align: center;
}

.contact-box h2 {
    font-size: 42px;

    margin-bottom: 12px;
}

.contact-box p {
    color: var(--muted);

    max-width: 650px;

    margin: 0 auto 28px;
}

.contact-actions {
    display: flex;

    justify-content: center;

    flex-wrap: wrap;

    gap: 12px;
}


/* =========================================================
   FOOTER
   ========================================================= */

.site-footer {
    padding: 30px 0;

    border-top: 1px solid var(--border);

    color: var(--muted);

    text-align: center;
}

.site-footer strong {
    color: var(--text);
}


/* =========================================================
   SITEAI EDITOR
   ========================================================= */

.siteai-editor {
    position: fixed;

    top: 0;
    right: 0;

    width: 320px;
    height: 100vh;

    z-index: 9999;

    padding: 22px;

    overflow-y: auto;

    background:
        rgba(10,10,20,0.97);

    border-left: 1px solid rgba(255,255,255,0.12);

    box-shadow:
        -20px 0 60px rgba(0,0,0,0.35);

    color: #fff;

    font-family: Arial, sans-serif;
}

.siteai-editor h3 {
    font-size: 20px;

    margin-bottom: 5px;
}

.siteai-editor-subtitle {
    color: #999;

    font-size: 12px;

    margin-bottom: 22px;
}

.editor-group {
    margin-bottom: 18px;
}

.editor-label {
    display: block;

    font-size: 12px;

    font-weight: 700;

    color: #bbb;

    margin-bottom: 8px;
}

.editor-control {
    width: 100%;

    min-height: 42px;

    border-radius: 10px;

    border: 1px solid rgba(255,255,255,0.12);

    background: #171725;

    color: #fff;

    padding: 8px 10px;

    outline: none;
}

.editor-control:focus {
    border-color: var(--accent);
}

.editor-color {
    width: 100%;
    height: 45px;

    padding: 3px;

    border: 1px solid rgba(255,255,255,0.12);

    border-radius: 10px;

    background: #171725;

    cursor: pointer;
}

.editor-button {
    width: 100%;

    min-height: 43px;

    margin-top: 8px;

    border: 0;

    border-radius: 10px;

    background: var(--accent);

    color: #fff;

    font-weight: 800;

    cursor: pointer;

    transition: 0.2s ease;
}

.editor-button:hover {
    background: var(--accent-dark);
    transform: translateY(-1px);
}

.editor-button.secondary {
    background: #242438;
}

.editor-button.danger {
    background: #3a2020;
}

.editor-divider {
    height: 1px;

    background: rgba(255,255,255,0.08);

    margin: 22px 0;
}

.editor-status {
    color: #9f9;

    font-size: 12px;

    line-height: 1.5;

    margin-top: 12px;
}

.editable.siteai-editing {
    outline:
        2px dashed var(--accent);

    outline-offset: 5px;

    cursor: text;
}

body.siteai-editor-open {
    padding-right: 320px;
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 950px) {

    body.siteai-editor-open {
        padding-right: 0;
    }

    .hero-grid {
        grid-template-columns: 1fr;

        text-align: center;
    }

    .hero-description {
        margin-left: auto;
        margin-right: auto;
    }

    .hero-actions {
        justify-content: center;
    }

    .card-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .about-box {
        grid-template-columns: 1fr;
    }

    .gallery-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .siteai-editor {
        width: min(340px, 90vw);
    }
}

@media (max-width: 700px) {

    .container {
        width:
            min(100% - 28px, 1120px);
    }

    .nav-inner {
        min-height: 68px;
    }

    .nav-links {
        display: none;
    }

    .hero {
        min-height: auto;

        padding: 65px 0;
    }

    .hero h1 {
        font-size: 42px;

        letter-spacing: -1.2px;
    }

    .hero-description {
        font-size: 16px;
    }

    .section {
        padding: 65px 0;
    }

    .card-grid {
        grid-template-columns: 1fr;
    }

    .gallery-grid {
        grid-template-columns: 1fr;
    }

    .contact-box {
        padding: 30px 20px;
    }

    .contact-box h2 {
        font-size: 32px;
    }

    .siteai-editor {
        width: 100%;

        max-width: 100%;

        height: auto;

        max-height: 82vh;

        top: auto;
        bottom: 0;

        border-left: 0;

        border-top: 1px solid rgba(255,255,255,0.12);

        border-radius: 22px 22px 0 0;
    }
}

@media (max-width: 420px) {

    .hero h1 {
        font-size: 35px;
    }

    .primary-button,
    .secondary-button {
        width: 100%;
    }

    .hero-actions,
    .contact-actions {
        width: 100%;
    }

    .hero-card {
        padding: 22px;
    }

    .siteai-editor {
        padding: 18px;
    }
}

</style>

</head>


<body>


<!-- =====================================================
     NAVBAR
===================================================== -->

<header class="site-nav">

    <div class="container nav-inner">

        <a
            href="#home"
            class="site-brand"
        >

            ${logoHTML}

            <span
                class="editable"
                data-editable="business-name"
            >
                ${businessName}
            </span>

        </a>


        <nav class="nav-links">

            <a href="#home">Home</a>

            <a href="#about">About</a>

            <a href="#services">Services</a>

            <a href="#gallery">Gallery</a>

            <a href="#contact">Contact</a>

            <a
                href="${encodeAttribute(whatsappURL)}"
                target="_blank"
                rel="noopener"
                class="nav-button"
            >
                WhatsApp
            </a>

        </nav>

    </div>

</header>



<!-- =====================================================
     HERO
===================================================== -->

<main>

<section
    class="hero"
    id="home"
>

    <div class="container hero-grid">

        <div class="hero-content">

            <div class="hero-kicker">
                ${formatBusinessType(businessType)}
            </div>

            <h1
                class="editable"
                data-editable="hero-title"
            >
                Welcome to
                <span>${businessName}</span>
            </h1>

            <p
                class="hero-description editable"
                data-editable="hero-description"
            >
                ${description}
            </p>

            <div class="hero-actions">

                <a
                    href="${encodeAttribute(whatsappURL)}"
                    target="_blank"
                    rel="noopener"
                    class="primary-button"
                >
                    Chat on WhatsApp
                </a>

                <a
                    href="#contact"
                    class="secondary-button"
                >
                    Contact Us
                </a>

            </div>

        </div>


        <div class="hero-visual">

            <div class="hero-card">

                ${heroLogoHTML}

                <h3
                    class="editable"
                    data-editable="hero-business-name"
                >
                    ${businessName}
                </h3>

                <p>
                    Professional,
                    reliable and customer-focused.
                </p>

            </div>

        </div>

    </div>

</section>



<!-- =====================================================
     ABOUT
===================================================== -->

<section
    class="section"
    id="about"
>

    <div class="container">

        <div class="about-box">

            <div class="about-panel">

                <div class="hero-kicker">
                    About Us
                </div>

                <h2
                    class="editable"
                    data-editable="about-title"
                >
                    About ${businessName}
                </h2>

                <p
                    class="editable"
                    data-editable="about-description"
                >
                    ${description}
                </p>

            </div>


            <div class="about-panel">

                <div class="card-icon">
                    ✦
                </div>

                <h3>
                    Why Choose Us?
                </h3>

                <p>
                    We focus on quality,
                    professionalism and
                    customer satisfaction.
                </p>

            </div>

        </div>

    </div>

</section>



<!-- =====================================================
     SERVICES
===================================================== -->

<section
    class="section"
    id="services"
>

    <div class="container">

        <div class="section-heading">

            <div class="hero-kicker">
                Our Services
            </div>

            <h2>
                What We Offer
            </h2>

            <p>
                Professional solutions
                designed for your needs.
            </p>

        </div>


        <div class="card-grid">

            ${template.services}

        </div>

    </div>

</section>



<!-- =====================================================
     BUSINESS SPECIAL SECTION
===================================================== -->

<section class="section">

    <div class="container">

        <div class="section-heading">

            <div class="hero-kicker">
                Our Business
            </div>

            <h2
                class="editable"
                data-editable="special-title"
            >
                ${template.title}
            </h2>

            <p
                class="editable"
                data-editable="special-description"
            >
                ${template.description}
            </p>

        </div>


        <div class="card-grid">

            ${template.features}

        </div>

    </div>

</section>



<!-- =====================================================
     GALLERY
===================================================== -->

${
    galleryHTML
        ? `
<section
    class="section"
    id="gallery"
>

    <div class="container">

        <div class="section-heading">

            <div class="hero-kicker">
                Gallery
            </div>

            <h2>
                Our Work
            </h2>

            <p>
                Take a look at our latest
                products, projects and work.
            </p>

        </div>

        <div class="gallery-grid">

            ${galleryHTML}

        </div>

    </div>

</section>
`
        : ""
}



<!-- =====================================================
     CONTACT
===================================================== -->

<section
    class="section contact-section"
    id="contact"
>

    <div class="container">

        <div class="contact-box">

            <div class="hero-kicker">
                Get In Touch
            </div>

            <h2>
                Let's Work Together
            </h2>

            <p
                class="editable"
                data-editable="contact-description"
            >
                Have a question or want to
                work with us? Contact us today.
            </p>


            <div class="contact-actions">

                ${
                    phoneClean
                        ? `
                <a
                    href="${encodeAttribute(callURL)}"
                    class="primary-button"
                >
                    📞 Call Us
                </a>
                `
                        : ""
                }


                ${
                    whatsappNumber
                        ? `
                <a
                    href="${encodeAttribute(whatsappURL)}"
                    target="_blank"
                    rel="noopener"
                    class="secondary-button"
                >
                    💬 WhatsApp
                </a>
                `
                        : ""
                }


                ${
                    data.email
                        ? `
                <a
                    href="${encodeAttribute(emailURL)}"
                    class="secondary-button"
                >
                    ✉ Email
                </a>
                `
                        : ""
                }

            </div>

        </div>

    </div>

</section>

</main>



<!-- =====================================================
     FOOTER
===================================================== -->

<footer class="site-footer">

    <div class="container">

        <p>
            ©
            <span id="siteYear"></span>
            <strong
                class="editable"
                data-editable="footer-name"
            >
                ${businessName}
            </strong>

            . All rights reserved.
        </p>

        <p style="margin-top:6px;">
            Built with SiteAI
        </p>

    </div>

</footer>



<!-- =====================================================
     SITEAI EDITOR
===================================================== -->

<aside
    class="siteai-editor"
    id="siteaiEditor"
>

    <h3>
        ✦ SiteAI Editor
    </h3>

    <p class="siteai-editor-subtitle">
        Customize your generated website.
    </p>


    <!-- THEME -->

    <div class="editor-group">

        <label
            class="editor-label"
            for="siteaiTheme"
        >
            Theme
        </label>

        <select
            id="siteaiTheme"
            class="editor-control"
        >

            <option value="purple">
                Purple
            </option>

            <option value="blue">
                Blue
            </option>

            <option value="green">
                Green
            </option>

            <option value="orange">
                Orange
            </option>

            <option value="pink">
                Pink
            </option>

            <option value="red">
                Red
            </option>

        </select>

    </div>



    <!-- ACCENT COLOR -->

    <div class="editor-group">

        <label
            class="editor-label"
            for="siteaiColor"
        >
            Custom Accent Color
        </label>

        <input
            type="color"
            id="siteaiColor"
            class="editor-color"
            value="#8b5cf6"
        >

    </div>



    <!-- FONT -->

    <div class="editor-group">

        <label
            class="editor-label"
            for="siteaiFont"
        >
            Font
        </label>

        <select
            id="siteaiFont"
            class="editor-control"
        >

            <option value="Arial, sans-serif">
                Arial
            </option>

            <option value="Verdana, sans-serif">
                Verdana
            </option>

            <option value="Georgia, serif">
                Georgia
            </option>

            <option value="'Trebuchet MS', sans-serif">
                Trebuchet MS
            </option>

            <option value="'Courier New', monospace">
                Courier New
            </option>

        </select>

    </div>



    <!-- EDIT MODE -->

    <div class="editor-group">

        <button
            type="button"
            id="siteaiEditMode"
            class="editor-button"
        >
            ✏️ Enable Edit Mode
        </button>

        <p
            id="siteaiEditStatus"
            class="editor-status"
        >
            Edit mode is currently off.
        </p>

    </div>



    <div class="editor-divider"></div>



    <!-- LOGO -->

    <div class="editor-group">

        <label
            class="editor-label"
            for="siteaiLogoInput"
        >
            Replace Logo
        </label>

        <input
            type="file"
            id="siteaiLogoInput"
            class="editor-control"
            accept="image/*"
        >

    </div>



    <!-- GALLERY -->

    <div class="editor-group">

        <label
            class="editor-label"
            for="siteaiImagesInput"
        >
            Add Images
        </label>

        <input
            type="file"
            id="siteaiImagesInput"
            class="editor-control"
            accept="image/*"
            multiple
        >

    </div>



    <div class="editor-divider"></div>



    <!-- DOWNLOAD -->

    <button
        type="button"
        id="siteaiDownload"
        class="editor-button"
    >
        📥 Download Website
    </button>


    <!-- RESET -->

    <button
        type="button"
        id="siteaiReset"
        class="editor-button secondary"
    >
        ↺ Reset Editor
    </button>


    <p class="siteai-editor-subtitle" style="margin-top:18px;">
        Your downloaded website will not contain
        the SiteAI editor panel.
    </p>

</aside>



<!-- =====================================================
     EDITOR SCRIPT
===================================================== -->

<script id="siteai-editor-script">

"use strict";


/* =====================================================
   YEAR
===================================================== */

const yearElement =
    document.getElementById("siteYear");

if (yearElement) {
    yearElement.textContent =
        new Date().getFullYear();
}


/* =====================================================
   ELEMENTS
===================================================== */

const editor =
    document.getElementById("siteaiEditor");

const editButton =
    document.getElementById("siteaiEditMode");

const editStatus =
    document.getElementById("siteaiEditStatus");

const colorPicker =
    document.getElementById("siteaiColor");

const themeSelect =
    document.getElementById("siteaiTheme");

const fontSelect =
    document.getElementById("siteaiFont");

const logoReplaceInput =
    document.getElementById("siteaiLogoInput");

const imagesInput =
    document.getElementById("siteaiImagesInput");

const downloadButton =
    document.getElementById("siteaiDownload");

const resetButton =
    document.getElementById("siteaiReset");


let editModeEnabled = false;


/* =====================================================
   EDIT MODE
===================================================== */

if (editButton) {

    editButton.addEventListener(
        "click",
        function () {

            editModeEnabled =
                !editModeEnabled;

            const editableElements =
                document.querySelectorAll(
                    ".editable"
                );

            editableElements.forEach(
                function (element) {

                    element.contentEditable =
                        editModeEnabled
                            ? "true"
                            : "false";

                    if (editModeEnabled) {

                        element.classList.add(
                            "siteai-editing"
                        );

                    } else {

                        element.classList.remove(
                            "siteai-editing"
                        );

                    }

                }
            );


            if (editModeEnabled) {

                editButton.innerHTML =
                    "✅ Disable Edit Mode";

                editStatus.textContent =
                    "Edit mode is ON. Click text to edit.";

            } else {

                editButton.innerHTML =
                    "✏️ Enable Edit Mode";

                editStatus.textContent =
                    "Edit mode is currently off.";

            }

        }
    );

}


/* =====================================================
   COLOR
===================================================== */

if (colorPicker) {

    colorPicker.addEventListener(
        "input",
        function () {

            const color =
                colorPicker.value;

            document.documentElement.style
                .setProperty(
                    "--accent",
                    color
                );

            document.documentElement.style
                .setProperty(
                    "--accent-light",
                    color
                );

            /* Slightly darker color */

            const darkColor =
                darkenColor(color, 20);

            document.documentElement.style
                .setProperty(
                    "--accent-dark",
                    darkColor
                );

        }
    );

}


/* =====================================================
   THEME PRESETS
===================================================== */

const themes = {

    purple: {
        accent: "#8b5cf6",
        dark: "#6d28d9"
    },

    blue: {
        accent: "#3b82f6",
        dark: "#1d4ed8"
    },

    green: {
        accent: "#22c55e",
        dark: "#15803d"
    },

    orange: {
        accent: "#f97316",
        dark: "#c2410c"
    },

    pink: {
        accent: "#ec4899",
        dark: "#be185d"
    },

    red: {
        accent: "#ef4444",
        dark: "#b91c1c"
    }

};


if (themeSelect) {

    themeSelect.addEventListener(
        "change",
        function () {

            const selected =
                themes[themeSelect.value];

            if (!selected) {
                return;
            }

            document.documentElement.style
                .setProperty(
                    "--accent",
                    selected.accent
                );

            document.documentElement.style
                .setProperty(
                    "--accent-light",
                    selected.accent
                );

            document.documentElement.style
                .setProperty(
                    "--accent-dark",
                    selected.dark
                );

            if (colorPicker) {
                colorPicker.value =
                    selected.accent;
            }

        }
    );

}


/* =====================================================
   FONT
===================================================== */

if (fontSelect) {

    fontSelect.addEventListener(
        "change",
        function () {

            document.documentElement.style
                .setProperty(
                    "--site-font",
                    fontSelect.value
                );

        }
    );

}


/* =====================================================
   REPLACE LOGO
===================================================== */

if (logoReplaceInput) {

    logoReplaceInput.addEventListener(
        "change",
        async function () {

            const file =
                logoReplaceInput.files[0];

            if (!file) {
                return;
            }

            try {

                const dataURL =
                    await readFile(file);

                const logos =
                    document.querySelectorAll(
                        "[data-site-logo]"
                    );

                logos.forEach(
                    function (logo) {

                        logo.src =
                            dataURL;

                    }
                );

                showEditorStatus(
                    "Logo updated successfully."
                );

            } catch (error) {

                console.error(error);

                showEditorStatus(
                    "Could not update logo."
                );

            }

        }
    );

}


/* =====================================================
   ADD / REPLACE IMAGES
===================================================== */

if (imagesInput) {

    imagesInput.addEventListener(
        "change",
        async function () {

            const files =
                Array.from(
                    imagesInput.files
                );

            if (!files.length) {
                return;
            }

            const gallery =
                document.querySelector(
                    ".gallery-grid"
                );

            if (!gallery) {

                showEditorStatus(
                    "This website does not currently have a gallery."
                );

                return;
            }

            try {

                const imageURLs =
                    await Promise.all(
                        files.map(
                            function (file) {
                                return readFile(file);
                            }
                        )
                    );

                imageURLs.forEach(
                    function (url) {

                        const item =
                            document.createElement(
                                "div"
                            );

                        item.className =
                            "gallery-item";

                        const image =
                            document.createElement(
                                "img"
                            );

                        image.src = url;

                        image.alt =
                            "Business image";

                        item.appendChild(image);

                        gallery.appendChild(item);

                    }
                );

                showEditorStatus(
                    "Images added successfully."
                );

            } catch (error) {

                console.error(error);

                showEditorStatus(
                    "Could not add images."
                );

            }

        }
    );

}


/* =====================================================
   DOWNLOAD CLEAN WEBSITE
===================================================== */

if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function () {

            try {

                /* -------------------------------------
                   CLONE ENTIRE DOCUMENT
                ------------------------------------- */

                const clonedDocument =
                    document.documentElement.cloneNode(
                        true
                    );


                /* -------------------------------------
                   REMOVE EDITOR
                ------------------------------------- */

                const clonedEditor =
                    clonedDocument.querySelector(
                        ".siteai-editor"
                    );

                if (clonedEditor) {
                    clonedEditor.remove();
                }


                /* -------------------------------------
                   REMOVE EDITOR SCRIPT
                ------------------------------------- */

                const editorScript =
                    clonedDocument.querySelector(
                        "#siteai-editor-script"
                    );

                if (editorScript) {
                    editorScript.remove();
                }


                /* -------------------------------------
                   REMOVE EDIT MODE ATTRIBUTES
                ------------------------------------- */

                clonedDocument
                    .querySelectorAll(
                        ".editable"
                    )
                    .forEach(
                        function (element) {

                            element.removeAttribute(
                                "contenteditable"
                            );

                            element.classList.remove(
                                "siteai-editing"
                            );

                        }
                    );


                /* -------------------------------------
                   REMOVE EDITOR-ONLY BODY CLASS
                ------------------------------------- */

                const clonedBody =
                    clonedDocument.querySelector(
                        "body"
                    );

                if (clonedBody) {

                    clonedBody.classList.remove(
                        "siteai-editor-open"
                    );

                }


                /* -------------------------------------
                   FINAL HTML
                ------------------------------------- */

                const finalHTML =
                    "<!DOCTYPE html>\\n" +
                    clonedDocument.outerHTML;


                /* -------------------------------------
                   CREATE DOWNLOAD
                ------------------------------------- */

                const blob =
                    new Blob(
                        [finalHTML],
                        {
                            type:
                                "text/html;charset=utf-8"
                        }
                    );

                const url =
                    URL.createObjectURL(blob);

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = url;

                link.download =
                    "website.html";

                document.body.appendChild(link);

                link.click();

                link.remove();

                URL.revokeObjectURL(url);


                showEditorStatus(
                    "Website downloaded successfully! 🚀"
                );

            } catch (error) {

                console.error(
                    "Download error:",
                    error
                );

                showEditorStatus(
                    "Download failed. Please try again."
                );

            }

        }
    );

}


/* =====================================================
   RESET EDITOR
===================================================== */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        function () {

            /* Reset color */

            document.documentElement.style
                .setProperty(
                    "--accent",
                    "#8b5cf6"
                );

            document.documentElement.style
                .setProperty(
                    "--accent-dark",
                    "#6d28d9"
                );

            document.documentElement.style
                .setProperty(
                    "--accent-light",
                    "#a78bfa"
                );


            /* Reset font */

            document.documentElement.style
                .setProperty(
                    "--site-font",
                    "Arial, sans-serif"
                );


            /* Reset inputs */

            if (colorPicker) {
                colorPicker.value =
                    "#8b5cf6";
            }

            if (themeSelect) {
                themeSelect.value =
                    "purple";
            }

            if (fontSelect) {
                fontSelect.value =
                    "Arial, sans-serif";
            }


            /* Disable edit mode */

            editModeEnabled = false;

            document
                .querySelectorAll(
                    ".editable"
                )
                .forEach(
                    function (element) {

                        element.contentEditable =
                            "false";

                        element.classList.remove(
                            "siteai-editing"
                        );

                    }
                );


            if (editButton) {
                editButton.innerHTML =
                    "✏️ Enable Edit Mode";
            }

            if (editStatus) {
                editStatus.textContent =
                    "Edit mode is currently off.";
            }


            showEditorStatus(
                "Editor settings reset."
            );

        }
    );

}


/* =====================================================
   STATUS MESSAGE
===================================================== */

function showEditorStatus(message) {

    if (!editStatus) {
        return;
    }

    editStatus.textContent =
        message;

}


/* =====================================================
   FILE READER
===================================================== */

function readFile(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();

            reader.onload =
                function () {
                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                function () {
                    reject(
                        reader.error
                    );
                };

            reader.readAsDataURL(file);

        }
    );

}


/* =====================================================
   DARKEN COLOR
===================================================== */

function darkenColor(hex, amount) {

    let color =
        hex.replace(
            "#",
            ""
        );

    if (color.length === 3) {

        color =
            color
                .split("")
                .map(
                    function (char) {
                        return char + char;
                    }
                )
                .join("");

    }

    let r =
        parseInt(
            color.substring(0, 2),
            16
        );

    let g =
        parseInt(
            color.substring(2, 4),
            16
        );

    let b =
        parseInt(
            color.substring(4, 6),
            16
        );

    r =
        Math.max(
            0,
            r - amount
        );

    g =
        Math.max(
            0,
            g - amount
        );

    b =
        Math.max(
            0,
            b - amount
        );

    return (
        "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0")
    );

}

</script>

</body>

</html>`;
}


/* =========================================================
   BUSINESS TEMPLATES
   ========================================================= */

function getBusinessTemplate(
    type,
    businessName,
    description
) {

    const templates = {

        /* =================================================
           CLOTHING
        ================================================= */

        clothing: {

            title:
                "Fashion That Matches Your Style",

            description:
                "Discover quality clothing, modern styles and products selected for every occasion.",

            services: `

                ${serviceCard(
                    "👕",
                    "Clothing Collection",
                    "Explore stylish clothing and quality products."
                )}

                ${serviceCard(
                    "✨",
                    "New Arrivals",
                    "Discover our latest styles and collections."
                )}

                ${serviceCard(
                    "🛍️",
                    "Easy Shopping",
                    "Simple and convenient way to choose your products."
                )}

            `,

            features: `

                ${serviceCard(
                    "⭐",
                    "Quality",
                    "We focus on reliable products and customer satisfaction."
                )}

                ${serviceCard(
                    "🔥",
                    "Modern Styles",
                    "Fresh and attractive styles for different preferences."
                )}

                ${serviceCard(
                    "💬",
                    "Customer Support",
                    "Contact us anytime for questions and assistance."
                )}

            `

        },


        /* =================================================
           RESTAURANT
        ================================================= */

        restaurant: {

            title:
                "Fresh Food. Great Taste.",

            description:
                "Enjoy delicious food, quality ingredients and a memorable dining experience.",

            services: `

                ${serviceCard(
                    "🍽️",
                    "Dine In",
                    "Enjoy a comfortable dining experience."
                )}

                ${serviceCard(
                    "🥡",
                    "Takeaway",
                    "Order your favorite meals for takeaway."
                )}

                ${serviceCard(
                    "🚗",
                    "Delivery",
                    "Get your favorite food delivered to your door."
                )}

            `,

            features: `

                ${serviceCard(
                    "🥗",
                    "Fresh Ingredients",
                    "Carefully selected ingredients for better taste."
                )}

                ${serviceCard(
                    "👨‍🍳",
                    "Expert Preparation",
                    "Meals prepared with care and attention."
                )}

                ${serviceCard(
                    "❤️",
                    "Customer First",
                    "Your satisfaction is always our priority."
                )}

            `

        },


        /* =================================================
           REAL ESTATE
        ================================================= */

        "real-estate": {

            title:
                "Find Your Perfect Property",

            description:
                "Explore properties, discover opportunities and find a place that feels like home.",

            services: `

                ${serviceCard(
                    "🏠",
                    "Residential Properties",
                    "Find homes and residential properties."
                )}

                ${serviceCard(
                    "🏢",
                    "Commercial Properties",
                    "Explore offices, shops and commercial spaces."
                )}

                ${serviceCard(
                    "📍",
                    "Property Guidance",
                    "Get help finding the right property."
                )}

            `,

            features: `

                ${serviceCard(
                    "🔎",
                    "Property Search",
                    "Search for properties according to your needs."
                )}

                ${serviceCard(
                    "🤝",
                    "Professional Support",
                    "Get guidance throughout the process."
                )}

                ${serviceCard(
                    "📈",
                    "Great Opportunities",
                    "Discover valuable property opportunities."
                )}

            `

        },


        /* =================================================
           SALON
        ================================================= */

        salon: {

            title:
                "Look Good. Feel Great.",

            description:
                "Professional beauty and grooming services designed to help you feel confident.",

            services: `

                ${serviceCard(
                    "💇",
                    "Hair Styling",
                    "Professional hair styling and grooming services."
                )}

                ${serviceCard(
                    "💅",
                    "Beauty Services",
                    "Beauty care services for your personal style."
                )}

                ${serviceCard(
                    "✨",
                    "Special Packages",
                    "Choose packages designed for your needs."
                )}

            `,

            features: `

                ${serviceCard(
                    "⭐",
                    "Professional Team",
                    "Friendly and professional service."
                )}

                ${serviceCard(
                    "🧴",
                    "Quality Products",
                    "We focus on quality products and care."
                )}

                ${serviceCard(
                    "❤️",
                    "Relaxing Experience",
                    "Enjoy a comfortable and welcoming environment."
                )}

            `

        },


        /* =================================================
           AGENCY
        ================================================= */

        agency: {

            title:
                "Grow Your Business With Us",

            description:
                "Creative digital solutions designed to help businesses build a stronger online presence.",

            services: `

                ${serviceCard(
                    "📱",
                    "Digital Marketing",
                    "Grow your brand and reach more customers online."
                )}

                ${serviceCard(
                    "💻",
                    "Web Development",
                    "Modern and responsive websites for businesses."
                )}

                ${serviceCard(
                    "🎨",
                    "Graphic Design",
                    "Creative visual designs that represent your brand."
                )}

            `,

            features: `

                ${serviceCard(
                    "🚀",
                    "Growth",
                    "Solutions focused on improving your online presence."
                )}

                ${serviceCard(
                    "💡",
                    "Creative Ideas",
                    "Fresh ideas designed around your goals."
                )}

                ${serviceCard(
                    "📊",
                    "Results",
                    "Professional work with a focus on real business needs."
                )}

            `

        },


        /* =================================================
           PORTFOLIO
        ================================================= */

        portfolio: {

            title:
                "Creative Work & Professional Skills",

            description:
                "A collection of professional projects, creative work and skills.",

            services: `

                ${serviceCard(
                    "🎨",
                    "Creative Design",
                    "Unique and professional visual design."
                )}

                ${serviceCard(
                    "💻",
                    "Web Projects",
                    "Modern websites and digital experiences."
                )}

                ${serviceCard(
                    "📱",
                    "Digital Projects",
                    "Creative projects built for modern platforms."
                )}

            `,

            features: `

                ${serviceCard(
                    "⚡",
                    "Fast",
                    "Efficient and organized project workflow."
                )}

                ${serviceCard(
                    "🎯",
                    "Professional",
                    "Focused on quality and clean results."
                )}

                ${serviceCard(
                    "💡",
                    "Creative",
                    "Ideas that help projects stand out."
                )}

            `

        },


        /* =================================================
           CLINIC
        ================================================= */

        clinic: {

            title:
                "Professional Care You Can Trust",

            description:
                "A welcoming environment focused on professional service and patient care.",

            services: `

                ${serviceCard(
                    "🩺",
                    "Consultation",
                    "Professional consultation and guidance."
                )}

                ${serviceCard(
                    "📋",
                    "Appointments",
                    "Convenient appointment scheduling."
                )}

                ${serviceCard(
                    "❤️",
                    "Patient Care",
                    "Friendly and professional customer care."
                )}

            `,

            features: `

                ${serviceCard(
                    "👨‍⚕️",
                    "Professional Service",
                    "Focused on quality and responsible service."
                )}

                ${serviceCard(
                    "🏥",
                    "Comfortable Environment",
                    "A welcoming environment for visitors."
                )}

                ${serviceCard(
                    "🔒",
                    "Trust",
                    "We value trust, respect and professionalism."
                )}

            `

        },


        /* =================================================
           ACADEMY
        ================================================= */

        academy: {

            title:
                "Learn Today. Build Your Future.",

            description:
                "Practical learning, useful skills and educational opportunities for your future.",

            services: `

                ${serviceCard(
                    "📚",
                    "Courses",
                    "Learn useful and practical skills."
                )}

                ${serviceCard(
                    "💻",
                    "Online Learning",
                    "Learn through flexible digital resources."
                )}

                ${serviceCard(
                    "🎓",
                    "Training",
                    "Skill-focused training for learners."
                )}

            `,

            features: `

                ${serviceCard(
                    "👨‍🏫",
                    "Experienced Learning",
                    "Learn with structured educational content."
                )}

                ${serviceCard(
                    "🧠",
                    "Practical Skills",
                    "Focus on skills that can be applied in real projects."
                )}

                ${serviceCard(
                    "🚀",
                    "Future Ready",
                    "Build knowledge for future opportunities."
                )}

            `

        },


        /* =================================================
           OTHER
        ================================================= */

        other: {

            title:
                "Professional Solutions For Your Needs",

            description:
                description,

            services: `

                ${serviceCard(
                    "⭐",
                    "Quality Service",
                    "Professional solutions designed around your needs."
                )}

                ${serviceCard(
                    "💡",
                    "Smart Solutions",
                    "Creative ideas and practical solutions."
                )}

                ${serviceCard(
                    "🤝",
                    "Customer Support",
                    "Friendly support whenever you need it."
                )}

            `,

            features: `

                ${serviceCard(
                    "🚀",
                    "Professional",
                    "Reliable and professional service."
                )}

                ${serviceCard(
                    "✨",
                    "Quality",
                    "We focus on quality and customer satisfaction."
                )}

                ${serviceCard(
                    "❤️",
                    "Customer First",
                    "Your needs and satisfaction matter to us."
                )}

            `

        }

    };


    return templates[type] ||
        templates.other;
}


/* =========================================================
   SERVICE CARD
   ========================================================= */

function serviceCard(
    icon,
    title,
    description
) {

    return `
        <article class="card">

            <div class="card-icon">
                ${icon}
            </div>

            <h3
                class="editable"
                data-editable="service-title"
            >
                ${escapeHTML(title)}
            </h3>

            <p
                class="editable"
                data-editable="service-description"
            >
                ${escapeHTML(description)}
            </p>

        </article>
    `;

}


/* =========================================================
   GALLERY CREATOR
   ========================================================= */

function createGallery(
    images,
    businessName
) {

    if (!images || !images.length) {
        return "";
    }

    return images
        .map(
            function (image, index) {

                return `
                    <div class="gallery-item">

                        <img
                            src="${encodeAttribute(image)}"
                            alt="${encodeAttribute(
                                businessName +
                                " image " +
                                (index + 1)
                            )}"
                        >

                    </div>
                `;

            }
        )
        .join("");

}


/* =========================================================
   FILE → DATA URL
   ========================================================= */

function fileToDataURL(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();

            reader.onload =
                function () {
                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                function () {
                    reject(
                        reader.error
                    );
                };

            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ATTRIBUTE ESCAPE
   ========================================================= */

function encodeAttribute(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );

}


/* =========================================================
   INITIALS
   ========================================================= */

function getInitials(name) {

    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (!words.length) {
        return "S";
    }

    if (words.length === 1) {
        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        words[0][0] +
        words[1][0]
    ).toUpperCase();

}


/* =========================================================
   BUSINESS TYPE LABEL
   ========================================================= */

function formatBusinessType(type) {

    const labels = {

        clothing: "Fashion & Clothing",

        restaurant: "Restaurant & Food",

        "real-estate": "Real Estate",

        salon: "Beauty & Salon",

        agency: "Digital Agency",

        portfolio: "Professional Portfolio",

        clinic: "Clinic & Healthcare",

        academy: "Education & Academy",

        other: "Professional Business"

    };

    return labels[type] ||
        "Professional Business";

}


/* =========================================================
   SAFE FILE NAME
   ========================================================= */

function safeFileName(name) {

    return String(name)
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        ) ||
        "siteai-website";

}


/* =========================================================
   DELAY
   ========================================================= */

function delay(ms) {

    return new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                ms
            );

        }
    );

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showMessage(
    message,
    type = "success"
) {

    let toast =
        document.getElementById(
            "siteai-toast"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "siteai-toast";

        toast.style.position =
            "fixed";

        toast.style.right =
            "20px";

        toast.style.bottom =
            "20px";

        toast.style.zIndex =
            "99999";

        toast.style.padding =
            "14px 18px";

        toast.style.borderRadius =
            "12px";

        toast.style.fontFamily =
            "Arial, sans-serif";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "700";

        toast.style.boxShadow =
            "0 15px 40px rgba(0,0,0,0.25)";

        document.body.appendChild(
            toast
        );

    }

    toast.textContent =
        message;

    toast.style.background =
        type === "error"
            ? "#dc2626"
            : "#16a34a";

    toast.style.color =
        "#ffffff";

    toast.style.opacity =
        "1";

    clearTimeout(
        toast._timer
    );

    toast._timer =
        setTimeout(
            function () {

                toast.style.opacity =
                    "0";

            },
            3500
        );

}
// ===============================
// SITEAI PRO CHECKOUT
// ===============================

function startProPlan() {
    const modal = document.getElementById("checkoutModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeCheckout() {
    const modal = document.getElementById("checkoutModal");

    if (modal) {
        modal.style.display = "none";
    }
}

async function continueToPayment() {
    try {
        const response = await fetch("http://localhost:3000/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                plan: "pro",
                amount: 19
            })
        });

        const data = await response.json();

        console.log("Payment response:", data);

        if (data.success) {
            showMessage(
                "Pro plan payment request created successfully!",
                "success"
            );
        } else {
            showMessage(
                "Payment request failed.",
                "error"
            );
        }

    } catch (error) {
        console.error("Payment error:", error);

        showMessage(
            "Payment server is not connected.",
            "error"
        );
    }
}
// ===============================
// SITEAI BUSINESS PLAN
// ===============================

function startBusinessPlan() {
    showMessage("Business plan selected — payment system is being connected...", "success");
}
