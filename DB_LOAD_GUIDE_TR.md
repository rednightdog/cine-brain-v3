# CineBrain Pro - Database ve Envanter Yükleme Rehberi

Bu rehber, "onca envanteri tüm özellikleriyle" veritabanına güvenli şekilde yüklemek için hazırlanmıştır.

## 1) `.env` ayarı

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/.env` dosyasında en az şu alanlar olmalı:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Not: Örnek şablon için `.env.example` dosyasını kullan.

## 2) Şema kurulumu (DB yapısını oluştur)

İlk kez kuruyorsan:

```bash
npm ci
npm run db:generate
npm run db:push
```

Migration temelli prod akışında:

```bash
npm run db:migrate:deploy
```

## 3) Envanteri yükleme (2 mod)

### A) Güvenli mod (önerilen) - veri silmeden yükler

Bu mod, katalogu `upsert` ile günceller ve kullanıcı/proje/kit verilerini silmez.

```bash
npm run db:seed:catalog
```

Bu komut:
- `lib/seed-data.ts` içindeki büyük katalogu
- `prisma/seed-lighting.ts`
- `prisma/seed-lenses.ts`
- `prisma/seed-vantage.ts`
- `prisma/seed-vintage.ts`
- `prisma/seed-support.ts`

dosyalarını çalıştırır.

### B) Tam reset seed (dikkat)

Bu mod bazı tabloları temizleyip baştan yazar.

```bash
npm run db:seed
```

Sadece temiz başlangıç istiyorsan kullan.

## 4) Doğrulama

```bash
npm run db:studio
```

Prisma Studio'da `EquipmentItem` tablosunda kayıtları ve alanları kontrol et:
- `category`, `subcategory`
- `mount`, `sensor_size`, `coverage`
- `technicalData`, `labMetrics`, `recordingFormats`

## 5) Sık kullanılan tek satır komutlar

İlk kurulum + güvenli katalog yükleme:

```bash
npm ci && npm run db:generate && npm run db:push && npm run db:seed:catalog
```

## 6) Supabase için not

`DATABASE_URL` olarak Supabase PostgreSQL connection string kullan.
`sslmode=require` olduğundan emin ol.

