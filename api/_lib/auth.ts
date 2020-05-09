import { NowRequest } from '@now/node'
import jsonwebtoken from 'jsonwebtoken'

export const authenticate = (req: NowRequest) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    const [prefix, token] = authHeader.split(' ')

    if (prefix === 'Bearer') {
      try {
        jsonwebtoken.verify(token, process.env.JWT_SECRET)
        return true
      } catch (err) {}
    }
  }

  return false
}
