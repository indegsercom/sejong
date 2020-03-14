import AWS from 'aws-sdk'
import awsService from './awsService'

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

const write = ({ id, content }) => {
  const Key = id + '.md'
  return upload({
    Key,
    Bucket: 'choseh',
    Body: content,
  })
}

const chosehService = {
  write,
}

export default chosehService
