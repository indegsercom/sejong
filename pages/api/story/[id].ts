import cors from 'micro-cors'

const handler = (req, res) => {
  res.json({ hello: 'bye' })
}

export default cors()(handler)
