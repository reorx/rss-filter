import { App, AppHandler, AppRes } from './app'

const app = new App()

const urlRoutes: {[key: string]: AppHandler} = {
  '/': app.home,
  '/favicon.ico': app.favicon,
  '/robots.txt': app.robots,
  '/filter': app.filter,
}

addEventListener('fetch', (event) => {
  const { request } = event
  const urlp = new URL(request.url)

  let res: AppRes
  if (urlp.pathname in urlRoutes) {
    try {
      res = urlRoutes[urlp.pathname](event)
    } catch (e) {
      res = new Response(`Error: ${e}`, {
        status: 500,
      })
    }
  } else {
    // 404
    res = app.notFound(event)
  }

  event.respondWith(res)
})
