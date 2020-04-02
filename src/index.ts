import { send } from 'micro'
import { ServerResponse, IncomingMessage } from 'http'

export default (req: IncomingMessage, res: ServerResponse) => {
  send(res, 200)
}
