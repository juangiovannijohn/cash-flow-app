const express = require('express');
const router = express.Router();
const { getCategories, createCategory }= require('./../controllers/categories')

//TODO: localhost/users GET, POST, DELETE, UPDATE

router.get('/',getCategories);

router.post('/', createCategory);



module.exports = router 