# Menggunakan image node sebagai base image
FROM node:20.10-alpine

# Tentukan working directory di dalam container
WORKDIR /usr/src/app

# Salin semua file ke dalam container
COPY . .

# Install dependencies
RUN npm install

# Prisma migrate
RUN npx prisma migrate

# Run Seed: node prisma/seed.js
RUN node prisma/seed.js

# Ekspos port aplikasi
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "dist/final.js"]
