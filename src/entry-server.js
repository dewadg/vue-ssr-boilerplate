import { createApp } from './app'

export default function (context) {
  return new Promise((resolve, reject) => {
    const appContext = {
      cookies: context.cookies
    }
    const {
      app,
      router,
      store
    } = createApp(appContext)

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ status: 404 })
      }

      context.rendered = () => {
        context.state = store.state
      }

      resolve(app)
    }, reject)
  })
}
