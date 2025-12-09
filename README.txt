LOGISTICS NODE + ADMIN PANEL

Çalıştırma adımları:

1) GEREKSİNİMLER
-----------------------
- Node.js (v18+ önerilir)
- NPM

2) KURULUM
-----------------------
Terminalde klasöre gir:

  cd logistics-node-admin
  npm install

Sonra localde çalıştır:

  npm start

Site adresleri:
- Ön yüz:  http://localhost:3000/
- Admin:   http://localhost:3000/admin/login

Varsayılan admin bilgileri:
- Kullanıcı: admin
- Şifre:    123456

İstersen app.js içindeki şu satırlarla environment üzerinden değiştirebilirsin:

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

3) VERİ SAKLAMA
-----------------------
Tüm içerik "data.json" dosyasında tutulur.
Admin panelde kaydettiğin her şey bu dosyaya yazılır.
Ekstra MySQL vs. gerektirmez.

4) DEPLOY MANTIĞI
-----------------------
Bu proje bir Node.js uygulamasıdır.
- GitHub: kod deposu olarak kullanılır.
- Çalıştırmak için: Render, Railway, VPS, Heroku benzeri bir Node sunucusunda host etmen gerekir.

Host ettikten sonra:
- Alan adını (Hostinger) bu Node uygulamasına yönlendirirsen,
  müşteri admin paneline girip içerikleri değiştirebilir.

İstersen:
- Public static kısmı GitHub Pages'e,
- Admin + Node.js API'yi Render/Railway'e kurup
  alan adı + subdomain ile bölebilirsin.
