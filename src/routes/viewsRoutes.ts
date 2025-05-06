import { Router } from "express";

const router = Router();

// ROUTES FOR DIFFRENT PAGES

router.get("/signup", (_req, res) => {
  res.render("pages/signupUser", { layout: false });
});

router.get("/signin", (req, res) => {
  const errorType = req.query.error;
  let errorMessage = "";

  if (errorType === "login_required") {
    errorMessage = "login_required";
  }
  res.render("pages/loginUser", { layout: false, errorMessage });
});

router.get("/buildestate", (_req, res) => {
  res.render("pages/home", {
    page: "home",
    styles: `
    <link href="/assets/styles/pages/home.css" rel="stylesheet" type="text/css"/>`,
    scripts: `
    <script type="module" src="/assets/js/pages/home.js" defer></script>`,
  });
});

router.get("/buildestate/properties", (_req, res) => {
  res.render("pages/propertiesListing", {
    page: "properties",
    styles: `
    <link href="/assets/styles/pages/properties.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    <script type="module" src="/assets/js/pages/properties.js" defer></script>`,
  });
});

export default router;
