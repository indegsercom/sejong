import { NowResponse } from '@now/node'

export default (req, res: NowResponse) => {
  res.status(200).end()
}
