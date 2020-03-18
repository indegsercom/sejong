import AWS from 'aws-sdk'
import awsService from './awsService'
import { db, sql, insert } from 'database'

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

  try {
    const { edition } = await db.one(sql`
      select * from choseh where id = ${id}
    `)

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
      edition: 0,
      modifiedAt: 0,
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

const chosehService = {
  get,
  write,
}

export default chosehService
