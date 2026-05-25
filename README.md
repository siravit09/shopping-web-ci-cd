# Simple Shop Login Demo

A small shopping web app for CI/CD practice. It uses fixed login credentials and has no third-party dependencies.

## Fixed Login

- Username: `demo`
- Password: `password123`

## Run Locally

```bash
npm start
```

Open:

```text
http://localhost:3000
```

You can also set another port:

```bash
PORT=4000 npm start
```

## App Features

- Fixed username and password login
- Product list
- Add products to cart
- Increase or decrease item quantity
- Mock checkout
- Logout

## Suggested CI/CD Practice

You can add your own tests later with tools such as Playwright, Cypress, Selenium, or simple Node test scripts. The `package.json` already has a `test` script placeholder:

```bash
npm test
```

