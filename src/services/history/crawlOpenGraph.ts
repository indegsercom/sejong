import iconv from 'iconv-lite'
import og from 'open-graph-scraper'
import axios from 'axios'
import { UserInputError } from 'apollo-server-micro'

const crawl = async (link) => {
  try {
    axios.interceptors.response.use((response) => {
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

const crawlOpenGraph = async (link: string) => {
  let html: string
  try {
    html = await crawl(link)
  } catch (err) {
    throw new UserInputError(`Cannot crawl provided link, ${link}`)
  }

  try {
    const { data, success } = await og({ html })
    if (!success) {
      throw Error
    }

    return data
  } catch (err) {
    throw new UserInputError(
      `Cannot parse open-graph of provided link. ${link}`
    )
  }
}

export default crawlOpenGraph
