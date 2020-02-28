import bookService from '../../src/services/bookService'

const responder = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const books = await bookService.getAll()
      res.json({ data: { books } })
    }
    case 'POST': {
      const book = await bookService.create(req.body)
      res.json({ data: { book } })
    }
  }
}

export default responder
