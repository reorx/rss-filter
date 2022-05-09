
export type AppRes = Response|Promise<Response>
export type AppHandler = (event: FetchEvent) => AppRes

export class App {
  home(event: FetchEvent): Response {
    console.log('home')
    return new Response('home')
  }

  favicon(event: FetchEvent): Response {
    return new Response('favicon')
  }

  robots(event: FetchEvent): Response {
    return new Response('robots')
  }

  async filter(event: FetchEvent): Promise<Response> {
    return new Response('filter')
  }

  notFound(event: FetchEvent): Response {
    return new Response('404', {
      status: 404,
    })
  }
}
