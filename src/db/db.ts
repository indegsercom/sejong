import { MongoClient } from 'mongodb'

let db: MongoClient

export const createPool = (callback: () => void) => {
  MongoClient.connect(
    'mongodb://localhost:27017/sejong',
    { useUnifiedTopology: true },
    function(err, database) {
      if (err) {
        console.error(`Could not connect to Mongodb client`)
        console.error(err)
        return
      }

      db = database

      callback()
    }
  )
}

export default db
