const fs = require('fs')
const mime = require('mime-types')
const { nanoid } = require('nanoid')

function saveFile(fileObject, folder = '.\\uploads') {
  const tempPath = fileObject.path
  const ext = mime.extension(fileObject.mimetype)
  const name = `${Date.now().toString()}-${nanoid(5)}`
  const destinationPath = `${folder}\\${name}.${ext}`

  fs.rename(tempPath, destinationPath, (err) => {
    if (err)
      throw err
  })

  return `${name}.${ext}`
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
