const multer = require('multer')
const path = require('path')

const imageStorage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, "public/images/users")
    },
    filename: function (req, file, callback){
        callback(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png)$/)){
            return cb(new Error("Arquivos permitidos: png ou jpg"))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload }