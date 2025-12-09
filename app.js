const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();

// ---------- CONFIG ----------
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";
const DATA_FILE = path.join(__dirname, "data.json");

// ---------- HELPERS ----------
function loadContent() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("data.json okunamadı:", e);
    return null;
  }
}

function saveContent(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getDefaultContent() {
  return {
    hero_title: "Nova Lojistik & Taşımacılık",
    hero_subtitle:
      "Karayolu, denizyolu ve havayolu taşımacılığında güvenilir çözüm ortağınız.",
    hero_cta: "Teklif Al",
    about_title: "Hakkımızda",
    about_text:
      "Nova Lojistik, yurtiçi ve yurtdışı taşımacılık hizmetleri ile işletmelere uçtan uca lojistik çözümler sunar. Depolama, dağıtım ve gümrükleme süreçlerinde deneyimli ekibimizle yanınızdayız.",
    services_title: "Hizmetlerimiz",
    service1_title: "Karayolu Taşımacılığı",
    service1_text:
      "Türkiye genelinde parsiyel ve komple taşımacılık hizmetleri, zamanında teslimat garantisiyle.",
    service2_title: "Uluslararası Lojistik",
    service2_text:
      "İthalat ve ihracat yükleriniz için denizyolu ve havayolu çözümleri.",
    service3_title: "Depolama & Dağıtım",
    service3_text:
      "Modern depolama alanlarımız ve dağıtım ağımız ile esnek çözüm modelleri.",
    contact_title: "İletişim",
    contact_text:
      "Projeleriniz için en uygun lojistik çözümlerini birlikte planlayalım. Aşağıdaki iletişim kanallarımızdan bize ulaşabilirsiniz.",
    company_phone: "+90 (532) 000 00 00",
    company_email: "info@novalojistik.com",
    company_address: "Mersin, Türkiye"
  };
}

// ---------- INITIAL DATA ----------
if (!fs.existsSync(DATA_FILE)) {
  saveContent(getDefaultContent());
}

// ---------- APP SETUP ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false
  })
);

// ---------- AUTH MIDDLEWARE ----------
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/admin/login");
  }
  next();
}

// ---------- ROUTES ----------

// Public landing page
app.get("/", (req, res) => {
  const content = loadContent() || getDefaultContent();
  res.render("index", { content });
});

// Login form
app.get("/admin/login", (req, res) => {
  if (req.session.user) return res.redirect("/admin");
  res.render("login", { error: null });
});

// Login submit
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.user = { username };
    return res.redirect("/admin");
  }
  return res.render("login", { error: "Kullanıcı adı veya şifre hatalı." });
});

// Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// Admin panel
app.get("/admin", requireLogin, (req, res) => {
  const content = loadContent() || getDefaultContent();
  res.render("admin", { user: req.session.user, content, message: null });
});

// Save changes
app.post("/admin", requireLogin, (req, res) => {
  const fields = [
    "hero_title",
    "hero_subtitle",
    "hero_cta",
    "about_title",
    "about_text",
    "services_title",
    "service1_title",
    "service1_text",
    "service2_title",
    "service2_text",
    "service3_title",
    "service3_text",
    "contact_title",
    "contact_text",
    "company_phone",
    "company_email",
    "company_address"
  ];

  const newContent = loadContent() || getDefaultContent();

  fields.forEach((field) => {
    if (typeof req.body[field] === "string") {
      newContent[field] = req.body[field];
    }
  });

  saveContent(newContent);
  res.render("admin", {
    user: req.session.user,
    content: newContent,
    message: "Değişiklikler kaydedildi."
  });
});

// ---------- START ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Logistics site running at http://localhost:${PORT}`);
});
