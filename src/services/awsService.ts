import AWS from 'aws-sdk'

const { AWS_SECRET, AWS_ID } = process.env

console.log('AWS_ID: ', AWS_ID)

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
})

const awsService = {
  s3,
}

export default awsService
