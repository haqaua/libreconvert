'use strict';

const { basename, join } =  require('path')
const { promises: fs } = require('fs')
const CONSTANTS = require('./constants')

let { convertAsync, convert } = require('libreoffice-convert')
convertAsync = require('util').promisify(convert)

async function convertFile(path) {
    if (!path) return false;
    
    const fileName = basename(path)
    console.log(fileName)
    const nameWithoutExt = fileName.split('.')[0]
    const inputPath = join(__dirname,  `/${CONSTANTS.UPLOAD_DIR}/${fileName}`)
    const outputPath = join(__dirname, `/${CONSTANTS.OUTPUT_DIR}/${nameWithoutExt}.${CONSTANTS.OUTPUT_EXT}`)

    // Read file
    const docxBuf = await fs.readFile(inputPath)

    // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
    let pdfBuf = await convertAsync(docxBuf, CONSTANTS.OUTPUT_EXT, undefined)
    
    // Here in done you have pdf file which you can save or transfer in another stream
    // await fs.writeFile(outputPath, pdfBuf)
    return pdfBuf;
}

convertFile().catch(function (err) {
    console.log(`Error converting file: ${err}`)
    return err
});

module.exports.convert = convertFile