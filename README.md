<p align="center">
  <a href="https://github.com/alanhrc/personal-expenses-test" target="_blank"><img src="https://plus.unsplash.com/premium_vector-1731582097761-f87f0693cae5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV4cGVuc2VzJTIwaG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D" width="210" height="140" alt="Money image" /></a>
</p>

---

## 📦 Tech Stack

- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [Vitest](https://vitest.dev/) for testing

---

## 🚀 Getting Started

### Clone the repository

```bash
## Clone repo
git clone git@github.com:alanhrc/personal-expenses-test.git your-repo-name

## Open repo
cd your-repo-name

## Project setup
$ npm install
```

### 🐳 Setup environments and docker

```bash
## Clone .env
cp .env.test .env

## Run docker compose
docker compose up -d
```

### 🛠️ Setup the Database

```bash
## Run migrations
npx prisma migrate dev

## Prisma generate
npx prisma generate
```

### ▶️ Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### ✅ Running Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

<p align="center">
  <img src="./github/tests.png" alt="Swagger image" />
</p>

<p align="center">
  <img src="./github/tests_e2e.png" alt="Swagger image" />
</p>

### 📚 Documentation

```bash
# Docs url
http://localhost:3333/api
```
<p align="center">
  <img src="./github/swagger.png" alt="Swagger image" />
  <img src="./github/swagger2.png" alt="Swagger image" />
</p>