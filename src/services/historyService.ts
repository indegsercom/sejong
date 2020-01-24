import og from 'open-graph-scraper'
import { createError } from '../errors'
import { insert, db, sql } from '../database'

export const createHistory = async ({ link }) => {
  const { data, success } = await og({
    url: link,
    headers: { 'user-agent': 'Googlebot' },
  })
  if (!success) {
    throw new createError.NotAcceptable(`Can not crawl provided link: ${link}`)
  }

  const { ogTitle, ogDescription, ogImage } = data
  const payload = {
    link,
    title: ogTitle,
    excerpt: ogDescription,
    cover: ogImage.url,
  }

  return insert('history', payload)
}

export const getHistories = async () => {
  let histories = []
  try {
    histories = await db.many(sql`select * from history`)
  } catch (err) {}
  return histories
}
