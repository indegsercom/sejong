import { makeWrapResolversPlugin } from 'postgraphile'
import crawlOpenGraph from '../services/history/crawlOpenGraph'
import resizeCover from '../services/history/resizeCover'

export default makeWrapResolversPlugin({
  Mutation: {
    createHistory: async (resolve, parent, args, context, info) => {
      const { link, comment } = args.input.history
      const { ogImage, ogDescription, ogTitle } = await crawlOpenGraph(link)
      const cover = await resizeCover(ogImage.url, link)
      const payload = {
        cover,
        title: ogTitle,
        excerpt: ogDescription,
      }
      const result = await resolve(
        parent,
        {
          input: {
            history: {
              ...payload,
              link,
              comment,
            },
          },
        },
        context,
        info
      )
      return result
    },
  },
})
