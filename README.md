# Custonomy DApp Boilerplate

This example dApp demonstrates how you may use a paymant gateway of your choice to work together with Custonomy's API to execute an NFT mint.

### Features

✅ Custonomy Widget Integration
<br />
✅ Custonomy Mint API
<br />
✅ Mint NFT using Crypto
<br />
✅ Mint NFT using Credit Card via Stripe
<br />
✅ View NFT Collection
<br />
✅ Transfer NFT
<br />

### Setup

Clone the repository and install the dependencies.

```
yarn install
```

Once installed, enter your secrets to the `.env` files, one for the frontend, at path `packages/react-app` and one for the backend, at path `packages/backend`.

To run the app, start both the frontend and the backend.

```
yarn react-app:start
```

```
yarn backend:dev
```

### Adding Stripe

To begin, create an account at Stripe and go to the test [dashboard](https://dashboard.stripe.com/test/apikeys) to generate two API Keys. In our case, we have setup our listener at localhost:4242/webhook. In this example, the listener's main function will be to listen to successful purchases and record the pruchase into the DB. Follow [this guide](https://stripe.com/docs/webhooks/test) to use the Stripe CLI to forward the events to our localhost. For more information on this, please check out the official documentation by Stripe [here](https://stripe.com/docs/webhooks).

```
./stripe listen --forward-to localhost:4242/webhook
```

### DB Schema Migration

To setup a PostgreSQL DB. Please find the necessary DB model and Knex migration files in `packages/backend/models`

Please check out [this guide](https://www.heady.io/blog/knex-migration-for-schema-and-seeds-with-postgresql) on Knex migration.
