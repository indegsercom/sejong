import joi from '@hapi/joi'
import { createError } from './errors'

export const validator = _schemaFn => async (req, res, next) => {
  let schema

  if (typeof _schemaFn !== 'function') {
    schema = _schemaFn[req.method](joi)
  } else {
    schema = _schemaFn(joi)
  }

  try {
    await schema.validateAsync(req.body)
    next()
  } catch (err) {
    throw new createError.NotAcceptable(err.message)
  }
}
