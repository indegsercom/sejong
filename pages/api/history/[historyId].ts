import historyService from '../../../src/services/historyService'
import handler from '../../../src/handler'

const responder = async (req, res) => {
  const { historyId } = req.query

  switch (req.method) {
    case 'DELETE': {
      const { id } = await historyService.remove(historyId)
      res.json({ history: { id } })
      break
    }
  }
}

export default handler()(responder)
