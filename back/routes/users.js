const express = require('express');
const router = express.Router();
const { validatorCreateUser } = require('./../validators/users')
const { getUsers, getUser, createUser }= require('./../controllers/users')

//TODO: localhost/users GET, POST, DELETE, UPDATE

router.get('/',getUsers);

router.get('/userId', getUser );

router.post('/',validatorCreateUser, createUser);



module.exports = router 