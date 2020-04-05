import parisApi from '../../utils/parisApi'

const resizeCover = async (cover: string, link: string) => {
  if (!cover) {
    return null
  }

  let url = cover
  if (url.slice(0, 1) === '/') {
    // it is relative url to origin
    url = new URL(link).origin + url
  }

  try {
    url = await parisApi.resize(url, { width: 180 })
  } finally {
    return url
  }
}

export default resizeCover
