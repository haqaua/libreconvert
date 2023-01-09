const express = require("express")
const multer = require('multer')
const path = require('path')
const { convert } = require('./convert')
const CONSTANTS = require('./constants')
const app = express()

const storage = multer.diskStorage({
    destination: CONSTANTS.UPLOAD_DIR + '/', filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })
const PORT = 8182
app.use(express.static(path.resolve(__dirname, './client/build')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.get('/api/ping', (req, res) => {
    res.send('pong')
})


app.post('/api/convert', upload.single('file'), (req, res) => {
    convert(req.file.path).then((response) => {
        if(!response) res.sendStatus(500);
        res.status(200).send(response);
    })
})

app.listen(PORT, () => {
    console.log('listening on port:' + PORT)
})