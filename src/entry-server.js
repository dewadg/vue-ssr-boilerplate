import { createApp } from './app'

export default function (context) {
  return new Promise((resolve, reject) => {
    const {
      app,
      router,
      store
    } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        reject({ status: 404 })
      }

      context.rendered = () => {
        context.state = store.state
      }

      resolve(app)
    }, reject)
  })
}
