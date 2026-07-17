# چک‌لیست انتشار MVP میرآ

## آماده‌شده در کد

- [x] Next.js 16.2.10 و وابستگی‌ها بدون آسیب‌پذیری production شناخته‌شده
- [x] Neon Postgres و migration قابل تکرار با `npm run db:migrate`
- [x] ورود OTP با نشست امن `httpOnly` و ذخیره هش توکن در دیتابیس
- [x] هش OTP، محدودیت تلاش، انقضا و rate limit برای شماره و IP
- [x] اتصال Kavenegar برای OTP واقعی و جلوگیری از نمایش کد در production
- [x] دریافت هویت تاریخچه گفت‌وگو از نشست سمت سرور
- [x] کنترل مالکیت نشست‌ها و جلوگیری از جعل `userId`
- [x] rate limit برای chat، تشخیص احساس، تاریخچه و احراز هویت
- [x] OpenRouter با مدل رایگان اصلی و مدل‌های جایگزین
- [x] streaming پاسخ، توقف پاسخ و پیام خطای قابل‌فهم
- [x] پیام کاربر سمت راست و پاسخ میرآ سمت چپ
- [x] بهبود لحن فارسی و جلوگیری از ترکیب «تو» و «شما»
- [x] ورودی کم‌هزینه و تجمیع رندرهای streaming
- [x] هدرهای امنیتی پایه و حذف `X-Powered-By`
- [x] حذف صفحات، کامپوننت‌ها، dependencyها و logهای بلااستفاده
- [x] لوگو، favicon، metadata، RTL و پس‌زمینه متحرک

## کارهای لازم در سرویس‌ها

- [ ] رمز اتصال Neon که قبلاً افشا شده است rotate شود.
- [ ] `DATABASE_URL` جدید در Local، Preview و Production ثبت شود.
- [ ] الگوی `mira-otp` در Kavenegar ساخته و تأیید شود.
- [ ] `KAVENEGAR_API_KEY` و `KAVENEGAR_TEMPLATE` در Vercel ثبت شوند.
- [ ] دامنه نهایی در `OPENROUTER_SITE_URL` ثبت شود.
- [ ] متغیرهای `OTP_TEST_CODE` و `OTP_DEBUG` در Preview و Production وجود نداشته باشند.
- [ ] مخزن Git به Vercel متصل و یک Preview Deploy ساخته شود.
- [ ] دامنه در Vercel اضافه و رکوردهای DNS پیشنهادی Vercel اعمال شوند.

## متغیرهای Vercel

- `DATABASE_URL`
- `AUTH_SECRET`
- `SMS_PROVIDER=kavenegar`
- `KAVENEGAR_API_KEY`
- `KAVENEGAR_TEMPLATE=mira-otp`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free`
- `OPENROUTER_FALLBACK_MODELS=nousresearch/hermes-3-llama-3.1-405b:free,google/gemma-4-31b-it:free`
- `OPENROUTER_SITE_URL=https://YOUR_DOMAIN`
- `OPENROUTER_APP_NAME=Mira`

هیچ‌کدام از کلیدها نباید با پیشوند `NEXT_PUBLIC_` تعریف شوند. برای `AUTH_SECRET` یک مقدار تصادفی حداقل 32 بایتی بسازید.

## تست نهایی Preview

- [ ] صفحه مهمان در دسکتاپ و موبایل بدون خطای console باز شود.
- [ ] پس‌زمینه Grainient زنده باشد و پس از تشخیص احساس رنگ آن تغییر کند.
- [ ] ارسال OTP واقعی، ثبت‌نام کاربر جدید، ورود مجدد و خروج تست شود.
- [ ] نام و تاریخ تولد پس از ورود مجدد بازیابی شوند.
- [ ] ساخت، تغییر عنوان، بارگذاری و حذف گفت‌وگو تست شود.
- [ ] پیام فارسی ارسال و streaming، توقف، ویرایش و کپی تست شود.
- [ ] قطع اینترنت و خطای OpenRouter پیام فارسی قابل‌فهم نشان دهند.
- [ ] کوکی نشست در production دارای `Secure`، `HttpOnly` و `SameSite=Lax` باشد.
- [ ] هیچ کلید، رمز، فایل `.env.local` یا log در Git نباشد.

## بعد از انتشار

- [ ] مانیتور خطا و مصرف OpenRouter فعال شود.
- [ ] مصرف Neon و نرخ ورودهای ناموفق بررسی شود.
- [ ] نسخه پشتیبان و روش بازیابی دیتابیس مستند شود.
- [ ] سیاست حریم خصوصی و هشدار «جایگزین درمان نیست» در محصول نهایی در دسترس باشد.
