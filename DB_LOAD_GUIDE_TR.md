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

### C) CSV ile toplu envanter import (kamera/lens odaklı)

Kendi envanter dosyanı güvenli `upsert` ile içeri almak için:

1. Şablon dosyayı kopyala ve doldur:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/imports/inventory-template.csv`

TR Excel (nokta-binlik, virgül-ondalık) için alternatif:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/imports/inventory-template-tr.csv`

2. Önce dry-run:

```bash
npm run db:import:csv:template:dry
```

TR şablon dry-run:

```bash
npm run db:import:csv:template:tr:dry
```

veya kendi dosyanla:

```bash
npm run db:import:csv -- --file ./imports/my-inventory.csv --dry-run
```

Hazir CSV preview (my-inventory + cam/lens):

```bash
npm run db:import:csv:preview
```

3. Sadece kamera/lens import etmek için:

```bash
npm run db:import:csv -- --file ./imports/my-inventory.csv --only-cam-lens
```

4. Gerçek import (upsert):

```bash
npm run db:import:csv -- --file ./imports/my-inventory.csv
```

Opsiyonel:
- `--status PENDING` (import edilenleri onay beklemeye alır)
- `--batch-size 25` (büyük dosyalarda batch boyutu)

Import raporu:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/reports/inventory-import-report.json`

Preview tablo raporu (CSV):

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/reports/inventory-import-preview.csv`

Sadece degisenler (insert/update) CSV:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/reports/inventory-import-preview-changes.csv`

Raporda ayrıca şunlar görünür:
- `preview.inserts`
- `preview.updates`
- `preview.unchanged`
- `preview.changedFieldFrequency`

Ilk 20 oncelikli CAM/LNS guncelleme listesini almak icin:

```bash
npm run db:priority:cam-lens
```

Cikti:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/reports/cam-lens-priority-updates.csv`

Not: Import scripti `,`, `;` ve `TAB` ayraçlarını otomatik algılar.

### D) Tek Komut Güvenli Sync (önerilen günlük akış)

Bu akış sırayla şunları yapar:
1. Mevcut DB’den full backup CSV alır (`imports/backups/`)
2. Senin CSV için dry-run yapar
3. Hata yoksa gerçek import yapar
4. Kamera/lens kalite pipeline çalıştırır

```bash
npm run db:sync:inventory
```

Sadece dry-run + backup için:

```bash
npm run db:sync:inventory:dry
```

Not: sync dry-run adımında terminalde otomatik preview özeti yazılır (`insert/update/unchanged`).

Guard (esik) ile dry-run:

```bash
npm run db:sync:inventory:safe:dry
```

Opsiyonel esik parametreleri:
- `--max-total-changes <N>`
- `--max-inserts <N>`
- `--max-updates <N>`
- `--max-change-ratio <0-1>`
- `--force` (esik blokunu bilerek bypass eder)

### E) Backup'tan geri yükleme (rollback)

En son backup dosyasını otomatik bulup restore dry-run:

```bash
npm run db:restore:latest:dry
```

Guard'lı restore dry-run:

```bash
npm run db:restore:latest:safe:dry
```

Bir onceki backup'a donmek icin:

```bash
npm run db:restore:previous:dry
npm run db:restore:previous
```

Tum backup listesini gormek icin:

```bash
npm run db:backups:list
```

`db:restore:latest*` komutlarinda ekstra secenekler:
- `--offset <N>`: 0 = latest, 1 = previous, 2 = iki onceki...
- `--list`: restore yapmadan backup listesini yazdirir

En son backup dosyasını gerçek restore:

```bash
npm run db:restore:latest
```

## 4) Doğrulama

```bash
npm run db:studio
```

Prisma Studio'da `EquipmentItem` tablosunda kayıtları ve alanları kontrol et:
- `category`, `subcategory`
- `mount`, `sensor_size`, `coverage`
- `technicalData`, `labMetrics`, `recordingFormats`

## CSV Nereden Geliyor?

CSV iki kaynaktan gelebilir:

1. Manuel: `imports/inventory-template*.csv` şablonunu doldurursun.
2. Otomatik export: Mevcut DB kayıtlarından CSV üretiriz.

Kamera+lens odaklı export:

```bash
npm run db:export:csv
```

Çıktı:

`/Users/arasdemiray/.gemini/antigravity/scratch/cine-brain-pro/imports/my-inventory.csv`

Not: Bu komut varsayılan olarak **editable CSV** üretir (Excel'de kolay düzenleme için JSON kolonları sadeleştirilir).

JSON detaylarıyla full export:

```bash
npm run db:export:csv:full
```

Tüm kategoriler + private + pending dahil:

```bash
npm run db:export:csv:all
```

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
