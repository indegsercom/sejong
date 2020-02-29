import AWS from 'aws-sdk'

const { AWS_SECRET, AWS_ID } = process.env

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
})

export const upload = (
  config: Pick<AWS.S3.PutObjectRequest, 'Key' | 'ContentType' | 'Body'>
) => {
  return s3
    .upload({
      ...config,
      ACL: 'public-read',
      Bucket: 'cdn.indegser.com',
      CacheControl: 'max-age=31556952', // one year
    })
    .promise()
}

const create = (id: string, body: string) => {
  const Key = `choseh/${id}.md`

  return upload({
    Key,
    Body: body,
    ContentType: 'text/markdown; charset=UTF-8',
  })
}

const update = () => {}

const chosehService = {
  create,
  update,
}

export default chosehService
