import og from 'open-graph-scraper'
import axios from 'axios'
import { createError } from '../errors'
import { insert, db, sql } from '../database'
import parisApi from '../apis/parisApi'
import iconv from 'iconv-lite'
import awsService from './awsService'

const crawl = async link => {
  try {
    axios.interceptors.response.use(response => {
      let ctype = response.headers['content-type']
      if (ctype.includes('EUC-KR')) {
        response.data = iconv.decode(response.data, 'EUC-KR')
      }
      return response
    })

    const { data: html } = await axios(link, {
      responseType: 'arraybuffer',
      headers: {
        'user-agent': 'Googlebot/2.1 (+http://www.googlebot.com/bot.html)',
      },
    })

    return html
  } catch (err) {
    const { data: html } = await axios(link)
    return html
  }
}

export const createHistory = async ({ link }) => {
  const html = await crawl(link)

  const { data: openGraph, success } = await og({ html })

  if (!success) {
    throw new createError.NotAcceptable(
      `Cannot parse open-graph of provided link. ${link}`
    )
  }

  const { ogTitle, ogDescription, ogImage } = openGraph
  const payload = {
    link,
    title: ogTitle,
    excerpt: ogDescription,
    cover: ogImage.url,
  }

  if (payload.cover) {
    payload.cover = await parisApi.resize(payload.cover, { width: 180 })
  }

  return insert({
    table: 'history',
    ...payload,
  })
}

export const getHistories = async () => {
  let histories = []
  try {
    histories = await db.many(
      sql`select * from history order by modified_at DESC`
    )
  } catch (err) {}
  return histories
}

const removeHistory = async (historyId: string) => {
  const { cover } = await db.one(sql`
    delete from history
    where id = ${historyId}
    returning history.cover;
  `)

  const coverSplit = cover.split('/')
  const Key = coverSplit[coverSplit.length - 1]

  await awsService.s3
    .deleteObject({
      Bucket: 'cdn.indegser.com',
      Key,
    })
    .promise()

  return true
}

const historyService = {
  createHistory,
  removeHistory,
}

export default historyService
