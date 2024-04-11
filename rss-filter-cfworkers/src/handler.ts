/*
TODO:
- [ ] fork rss-parser
  - [ ] remove http dependency
  - [ ] enhance atom parse
- [ ] consider replace 'rss-parser' with https://github.com/fent/feedme.js or https://github.com/danmactough/node-feedparser (they both use sax js)
*/

import { Feed, Item } from 'feed'
import Parser from 'rss-parser'

/*
 * Docs:
 * https://github.com/rbren/rss-parser
 * https://github.com/jpmonette/feed
 */

const parser = new Parser()

export async function handleRequest(request: Request): Promise<Response> {
  const url = 'https://v2ex.com/feed/programmer.xml'
  const include = '程序员'

  // get from kv
  let feedString = await MY_KV.get(url)
  if (feedString === null) {
    feedString = await generateFeedString(url, include)

    // write to kv
    await MY_KV.put(url, feedString, {
      expirationTtl: 60,
    })
  } else {
    console.log('use feed from kv')
  }

  return new Response(feedString, {
    headers: {
      'Content-Type': 'application/atom+xml',
    }
  })
}

async function generateFeedString(url: string, include: string): Promise<string> {
  // get content
  const init = {
    headers: {},
  }
  const res = await fetch(url, init)
  const body = await res.text()

  // parse content
  const source = await parser.parseString(body)
  const link = source.link || ''

  // create feed
  const feedData = {
    title: source.title || '',
    description: source.description || '',
    id: link,
    link,
    image: source.image?.url,
    copyright: link,
  }
  const feed = new Feed(feedData)

  // define add item function
  // TODO use original date string
  const now = new Date()
  const addItem = (item: Parser.Item) => {
    const itemData: Item = {
      title: item.title || '',
      id: item.guid || '',
      link: item.link || '',
      description: item.link || '',
      date: item.isoDate ? new Date(item.isoDate) : now,
    }
    if (item.content) {
      itemData.content = item.content
    }
    feed.addItem(itemData)
  }

  // filter items
  const includeRegex = new RegExp(include)
  source.items.forEach(item => {
    console.log('item', item.title)
    const title = item.title || ''
    if (includeRegex.test(title)) {
      addItem(item)
    }
  })

  return feed.atom1()
}
