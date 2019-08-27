# vue-ssr-boilerplate

I made this Vue.js boilerplate for learning purpose. Currently equipped with:

- Server-Side Rendering (with Fastify as server)
- Cookies injection to server renderer context
- Development server rebuilds on file changes
- Docker ready

## Coding Standard

I use [Standard JS](https://standardjs.com)

## How to use

Development:

```
yarn dev
```

Dev server will rebuild on file changes.

Production:

```
yarn build
yarn start
```

## Routes

Routes are defined on `~/routes/index.js` and will be automatically injected to Vue Router.

## Middlewares

Middlewares are defined under `~/middlewares` directory. Any middleware exported on `~/middlewares/index.js` will be **global middleware**. We can create middleware like this:

```js
// ~/middlewares/fetchLoggedUser.js
export default async function fetchLoggedUser (appContext) {
  const { store, next } = appContext

  await store.dispatch('fetchLoggedUser')

  next()
}
```

Then specify it on the route object:

```js
{
  name: 'profile',
  component: Profile,
  middlewares: [
    fetchLoggedUser
  ]
}
```

## `appContext`

`appContext` is a parameter that middleware functions receive. It will contain:

- `store` (Vuex Store)
- `cookies` Object of cookies (automatically injected either it's in server/client)
- `to` Target route object
- `from` Origin route object
- `next` Vue Router `next` function

We can do some logic on the middleware before entering the route.
