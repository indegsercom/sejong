import * as yup from 'yup'
import { createError } from './errors'

export const validator = _schemaFn => async (req, res, next) => {
  let schema

  if (typeof _schemaFn !== 'function') {
    schema = _schemaFn[req.method](yup)
  } else {
    schema = _schemaFn(yup)
  }

  try {
    await schema.validate(req.body)
    next()
  } catch (err) {
    throw new createError.NotAcceptable(err.message)
  }
}
