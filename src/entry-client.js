import { createApp } from './app'
import Cookie from 'js-cookie'

const appContext = {
  cookies: Cookie.get() || {}
}
const { app, router, store } = createApp(appContext)

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  app.$mount('#app')
})
