import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// ROUTES FOR DIFFRENT PAGES

// ADMIN PAGES

router.get("/admin/signin", (_req, res) => {
  res.render("pages/admin/signin", { layout: false });
});

router.get("/admin/dashboard", (_req, res) => {
  res.render("pages/admin/dashboard", {
    layout: "layouts/adminLayout",
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: ``,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

router.get("/admin/users", (_req, res) => {
  res.render("pages/admin/userListing", {
    layout: "layouts/adminLayout",
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="/assets/js/admin/userlisting.js"></script>`,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

router.get("/admin/users/:id", (req, res) => {
  res.render("pages/admin/userView", {
    layout: "layouts/adminLayout",
    userId: req.params.id,
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="/assets/js/admin/userView.js"></script>`,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

router.get("/admin/properties", (_req, res) => {
  res.render("pages/admin/propertyListing", {
    layout: "layouts/adminLayout",
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="/assets/js/admin/propertyListing.js"></script>`,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

router.get("/admin/properties/add", (_req, res) => {
  res.render("pages/admin/addProperty", {
    layout: "layouts/adminLayout",
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
        <script src="/assets/js/admin/addProperty.js"></script>
    `,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

router.get("/admin/properties/edit/:id", (_req, res) => {
  res.render("pages/admin/editProperty", {
    layout: "layouts/adminLayout",
    styles: `<link href="/assets/styles/admin/datatables.bundle.css" rel="stylesheet" type="text/css" />`,
    scripts: `
    `,
    vendor: `
        <script src="/assets/js/admin/datatables.bundle.js"></script>`,
  });
});

// USER ROUTES
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

router.get("/buildestate/properties", verifyToken, (_req, res) => {
  res.render("pages/propertiesListing", {
    page: "properties",
    styles: `
    <link href="/assets/styles/pages/propertiesListing.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    <script type="module" src="/assets/js/pages/propertiesListing.js" defer></script>`,
  });
});

router.get("/buildestate/property/:id", verifyToken, (_req, res) => {
  res.render("pages/property", {
    page: "properties",
    styles: `
    <link href="/assets/styles/pages/property.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    <script type="module" src="/assets/js/pages/property.js" defer></script>`,
  });
});

router.get("/buildestate/properties/search", verifyToken, (_req, res) => {
  res.render("pages/searchProperties", {
    page: "searchproperties",
    styles: `
    <link href="/assets/styles/pages/propertiesListing.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    <script type="module" src="/assets/js/pages/searchProperties.js" defer></script>`,
  });
});

router.get("/buildestate/myprofile", verifyToken, (_req, res) => {
  res.render("pages/userProfile", {
    page: "userprofile",
    styles: `
    <link href="/assets/styles/pages/userProfile.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    `,
  });
});

router.get("/buildestate/about", verifyToken, (_req, res) => {
  res.render("pages/about", {
    page: "about",
    styles: `
    <link href="/assets/styles/pages/about.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    `,
  });
});

router.get("/buildestate/contact", verifyToken, (_req, res) => {
  res.render("pages/contact", {
    page: "about",
    styles: `
    <link href="/assets/styles/pages/contact.css" rel="stylesheet" type="text/css"/>
    `,
    scripts: `
    `,
  });
});

export default router;
