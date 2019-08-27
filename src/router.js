import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import globalMiddlewares from './middlewares'

Vue.use(Router)

function chainMiddlewares (middlewares, appContext) {
  return async (to, from, next) => {
    for (const middleware of middlewares) {
      await middleware({
        to,
        from,
        next,
        ...appContext
      })
    }
  }
}

export function createRouter (appContext) {
  const finalRoutes = routes.map((route) => {
    const middlewares = route.middlewares
      ? [...globalMiddlewares, ...route.middlewares]
      : [...globalMiddlewares]

    route.beforeEnter = chainMiddlewares(middlewares, appContext)

    return route
  })

  return new Router({
    mode: 'history',
    routes: finalRoutes
  })
}
