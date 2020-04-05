import AWS from 'aws-sdk'
import awsService from './aws'
import db from '../db/db'
import { sql } from 'slonik'

const upload = (
  config: Pick<AWS.S3.PutObjectRequest, 'ACL' | 'Key' | 'Bucket' | 'Body'>
) => {
  return awsService.s3
    .upload({
      Bucket: 'cdn.indegser.com',
      ACL: 'public-read',
      ContentType: 'text/markdown; charset=UTF-8',
      CacheControl: 'max-age=31556952', // one year
      ...config,
    })
    .promise()
}

const get = async ({ id }) => {
  const Key = id + '.md'
  let edition: number

  try {
    ;({ edition } = await db.one(sql`
      select * from choseh where id = ${id}
    `))
  } catch (err) {
    edition = 0
  }

  try {
    const data = await awsService.s3
      .getObject({
        Key,
        Bucket: 'choseh',
      })
      .promise()

    const modifiedAt = new Date(data.LastModified).getTime()
    const content = data.Body.toString()

    return {
      modifiedAt,
      edition,
      content,
    }
  } catch (err) {
    return {
      content: '',
      edition,
      modifiedAt: new Date().getTime(),
    }
  }
}

const write = async ({ id, content }) => {
  const Key = id + '.md'

  await db.query(sql`
    insert into choseh (id)
    values (${id})
    on conflict (id)
    do update
    set edition = choseh.edition + 1
  `)

  await upload({
    Key,
    Bucket: 'choseh',
    Body: content,
  })

  return true
}

const choseh = {
  get,
  write,
}

export default choseh
