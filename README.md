# 🎓 SkillNova

**منصة تعليمية ثنائية اللغة احترافية | Professional Bilingual E-learning Platform**

---

## 📋 نظرة عامة | Overview

SkillNova هي منصة تعليمية شاملة توفر:
- ✅ كورسات مجانية ومدفوعة
- ✅ نظام إدارة متقدم للمدربين والطلاب
- ✅ شات AI ذكي للرد على استفسارات العملاء
- ✅ تطبيق موبايل متكامل (iOS و Android)
- ✅ واجهة ويب احترافية ثنائية اللغة

---

## 🏗️ البنية الهندسية | Architecture

```
SkillNova/
│
├── src/                      # Backend API
│   ├── models/              # Database Models
│   ├── routes/              # API Routes
│   ├── controllers/          # Business Logic
│   ├── middleware/           # Authentication & Validation
│   ├── utils/               # Helper Functions
│   └── server.ts            # Main Server File
│
├── web/                     # Frontend Web (Next.js)
│   ├── pages/              # Pages & Routes
│   ├── components/         # React Components
│   ├── styles/             # CSS & Tailwind
│   ├── public/             # Static Files
│   └── next.config.js      # Next.js Config
│
├── mobile/                  # Mobile App (React Native)
│   ├── app/                # App Navigation
│   ├── components/         # React Native Components
│   ├── screens/            # App Screens
│   └── app.json           # Expo Config
│
└── docs/                    # Documentation
```

---

## 🛠️ التكنولوجيا المستخدمة | Tech Stack

| الجزء | التكنولوجيا |
|-------|-----------|
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB |
| **Frontend Web** | Next.js + React + Tailwind CSS |
| **Mobile** | React Native + Expo |
| **AI Chat** | Google Gemini API |
| **Payments** | Stripe |
| **Hosting** | Vercel (Web) + Railway (API) |

---

## ⚙️ الإعدادات المسبقة | Prerequisites

- Node.js 16+ و npm
- MongoDB (Cloud: Atlas)
- Google Gemini API Key
- Git

---

## 🚀 البدء السريع | Quick Start

### 1️⃣ استنساخ المستودع
```bash
git clone https://github.com/masyrabie-code/SkillNova.git
cd SkillNova
```

### 2️⃣ إعداد متغيرات البيئة
```bash
cp .env.example .env
```

### 3️⃣ تثبيت الحزم
```bash
npm install
cd web && npm install
cd ../mobile && npm install
```

### 4️⃣ تشغيل التطبيق
```bash
npm run dev
```

---

## 🎓 الميزات الرئيسية | Main Features

### للطلاب
- ✅ التسجيل والدخول
- ✅ استعراض الكورسات
- ✅ الشات مع AI

### للمدربين
- ✅ طلب الانضمام
- ✅ إنشاء الكورسات
- ✅ إدارة الطلاب

### للمسؤولين
- ✅ إدارة المدربين
- ✅ إدارة الكورسات والمدفوعات
- ✅ التقارير والإحصائيات

---

## 🔐 الأمان | Security

- 🔒 تشفير كلمات المرور
- 🔑 JWT Authentication
- ✅ CORS Configuration
- ✅ Input Validation

---

## 📞 التواصل | Contact

- 📧 Email: support@skillnova.com
- 🐙 GitHub: [@masyrabie-code](https://github.com/masyrabie-code)

---

**Made with ❤️ by SkillNova Team**
