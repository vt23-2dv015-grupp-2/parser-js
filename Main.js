import fs from 'fs'
import path from 'path'
import { Tokeniser } from './Tokeniser.js'

 function main() {
  getPaths()
    .then(async paths => {
      const tokeniser = new Tokeniser(paths)
      const documents = await tokeniser.getDocuments()
      console.log(documents)
    })
    .catch((err) => {
      console.log('Error getting paths:', err)
    })
}

function getPaths() {
  const directoryPath = path.join(new URL('.', import.meta.url).pathname, 'docs')
  const fileExtensions = ['.doc', '.docx']

  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const filePaths = files
          .filter((file) => fileExtensions.includes(path.extname(file)))
          .map((file) => path.join(directoryPath, file))

        resolve(filePaths)
      }
    })
  })
}

main()
