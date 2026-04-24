# CineBrain Pro - Database ve Envanter Yükleme Rehberi

Bu rehber, "onca envanteri tüm özellikleriyle" veritabanına güvenli şekilde yüklemek için hazırlanmıştır.

## 1) `.env` ayarı

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/.env` dosyasında en az şu alanlar olmalı:

- `DATABASE_URL`
- `DIRECT_URL` (opsiyonel ama önerilir)
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

## 6) Kamera/Lens kalite otomasyonu

Kamera ve lens bilgilerini otomatik iyileştirme + kontrat doğrulama:

```bash
npm run db:pipeline:quality
```

Bu pipeline:
- `db:fill:gaps`: coverage, lens_type, technicalData ve power_draw gibi doldurulabilir boşlukları tamamlar.
- `db:validate:contract:cam-lens`: kamera/lens için kritik alan kontratını denetler.

Detay rapor:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/reports/catalog-contract-report.json`

## 7) Supabase için not

Supabase kullanırken bağlantıyı panelden taze kopyala:

1. Supabase Dashboard -> Project Settings -> Database -> Connect -> Prisma
2. `DATABASE_URL` alanına panelde verilen PostgreSQL URL'i yapıştır
3. URL sonunda `sslmode=require` olduğundan emin ol

Örnek (şablon):

```bash
DATABASE_URL="postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres?sslmode=require"
```

### Bağlantı hatası hızlı teşhis

Eğer şu hata gelirse:

`Can't reach database server at ...`

- Host adı yanlış/eski olabilir (en sık neden)
- Proje pause durumda olabilir
- Ağ veya DNS problemi olabilir

Host çözümlemesini test et:

```bash
nslookup <HOST>
```

Çözümlemezse Supabase panelinden yeni URL alıp `.env` dosyasını güncelle.
