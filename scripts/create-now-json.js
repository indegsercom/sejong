const fs = require('fs')

console.log('>>> Creating now.json with github env variables.')
const { DATABASE_URL, NOW_NAME } = process.env
const json = JSON.parse(fs.readFileSync('now.json', 'utf-8'))
json.env.DATABASE_URL = DATABASE_URL
json.name = NOW_NAME

fs.writeFileSync('now.json', JSON.stringify(json), 'utf-8')

console.log('>>> Finish updating now.json with env variables.')
