const fs = require('fs')
const mime = require('mime-types')
const { nanoid } = require('nanoid')

function saveFile(fileObject) {
  const tempPath = fileObject.path
  const ext = mime.extension(fileObject.mimetype)
  const name = `${Date.now().toString()}-${nanoid(5)}`
  const destinationPath = `.\\uploads\\${name}.${ext}`

  fs.rename(tempPath, destinationPath, (err) => {
    if (err)
      throw err
  })

  return destinationPath
}

function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err)
        throw err
    })
  }

  return true
}

module.exports = { saveFile, deleteFile }
