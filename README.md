# Project: Order & User Services

## 1. How to Run Locally

Pastikan **Docker** dan **Docker Compose** sudah terinstall.  
Kemudian jalankan:

```bash
docker-compose up -d
```

Setelah itu, masuk ke folder user-service dan order-service (masing-masing service berada di folder terpisah).

Install dependency pada kedua service dengan perintah:
```bash
npm install
```

Jalankan masing-masing service:
```bash
npm run start
```

Untuk menjalankan testing:
```bash
npm run test
```

## 2. Architecture Overview
Project ini menggunakan modular & layered architecture untuk tiap service:

Presentation Layer: controller → menangani request HTTP.
Application Layer: service & DTO → menangani workflow bisnis.
Domain Layer: entity & repository interface → logika inti bisnis.
Infrastructure Layer: implementasi teknis (database, messaging, dll).

Setiap service (user-service & order-service) berdiri sendiri tetapi bisa saling berkomunikasi jika dibutuhkan.

## 2. Example API Request
Untuk contoh API Request bisa dilihat di link postman berikut:
https://web.postman.co/c22e4814-2a96-4fab-938f-542d1fd95e8d
