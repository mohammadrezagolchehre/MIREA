# میرآ (Mira)

میرآ یک دستیار فارسی‌زبان برای گفت‌وگو درباره احساسات و افزایش خودآگاهی است. رابط کاربری با Next.js و Glass UI ساخته شده، پاسخ‌ها از OpenRouter به‌صورت زنده دریافت می‌شوند و حساب‌ها و تاریخچه گفت‌وگو در Neon Postgres ذخیره می‌شوند.

> میرآ ابزار خودآگاهی است و جایگزین روان‌درمانی، تشخیص پزشکی یا خدمات اورژانسی نیست.

## پیش‌نیازها

- Node.js 20.9 یا جدیدتر
- دیتابیس Neon Postgres
- کلید OpenRouter
- حساب Kavenegar برای ارسال OTP در محیط production

## اجرای محلی

```bash
npm install
npm run db:migrate
npm run dev
```

سپس `http://localhost:3000` را باز کنید. برای تست OTP محلی می‌توانید `OTP_TEST_CODE` و `OTP_DEBUG` را فقط در `.env.local` تنظیم کنید.

## متغیرهای محیطی

فایل [env.example](./env.example) فهرست کامل متغیرها را دارد:

- `DATABASE_URL`: آدرس اتصال Neon Postgres
- `AUTH_SECRET`: یک مقدار تصادفی و طولانی برای هش OTP و نشست‌ها
- `SMS_PROVIDER`: در production برابر `kavenegar`
- `KAVENEGAR_API_KEY`: کلید محرمانه پیامک
- `KAVENEGAR_TEMPLATE`: نام الگوی VerifyLookup، پیش‌فرض `mira-otp`
- `OPENROUTER_API_KEY`: کلید OpenRouter
- `OPENROUTER_MODEL`: مدل اصلی رایگان
- `OPENROUTER_FALLBACK_MODELS`: مدل‌های جایگزین با کاما
- `OPENROUTER_SITE_URL`: دامنه نهایی برنامه
- `OPENROUTER_APP_NAME`: نام برنامه در OpenRouter

`OTP_TEST_CODE` و `OTP_DEBUG` فقط برای توسعه محلی هستند و نباید در Production یا Preview تعریف شوند.

## احراز هویت و امنیت

- ورود با شماره موبایل و OTP انجام می‌شود.
- نشست کاربر با توکن تصادفی در کوکی `httpOnly` نگهداری و فقط هش آن در Neon ذخیره می‌شود.
- OTP به‌صورت هش‌شده ذخیره می‌شود و محدودیت تعداد درخواست و تلاش دارد.
- API تاریخچه، شناسه کاربر را فقط از نشست سمت سرور می‌گیرد.
- عملیات تغییردهنده داده، درخواست‌های cross-origin را رد می‌کنند.

## دیتابیس

ساختار جداول در [database/neon-schema.sql](./database/neon-schema.sql) قرار دارد. برای اعمال migrationهای idempotent اجرا کنید:

```bash
npm run db:migrate
```

## بررسی قبل از انتشار

```bash
npm run lint
npm run build
npm audit --omit=dev
npm start
```

مراحل تنظیم Vercel، دامنه، پیامک و تست نهایی در [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) ثبت شده‌اند.
