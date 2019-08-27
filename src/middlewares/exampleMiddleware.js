/**
 * We can retrieve appContext here. appContext in middleware will contain:
 * - to
 * - from,
 * - next
 * - store
 * - cookies
 *
 * @param object appContext
 */
export default function exampleMiddleware (appContext) {
  appContext.next()
}
