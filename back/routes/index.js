const express = require('express');
const fs = require('fs');
const router = express.Router();

const PATH_ROUTES = __dirname; //nos da la ruta de donde se encuentra este archivo

const removeExtension = (fileName) => {
    // [index, transactions, users]
    return fileName.split('.').shift() //trae el nombre del archivo sin extension
}

fs.readdirSync(PATH_ROUTES).filter( file => {
    const name = removeExtension(file); //users, transactions, index
    if (name !== 'index') {
        router.use(`/${name}`, require(`./${file}`)); //se llama dinamincamente a cada ruta creada en la carpeta segun el archivo
    }

})




module.exports = router