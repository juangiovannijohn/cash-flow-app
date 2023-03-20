
const express = require('express');
const router = express.Router();
const { validatorCreateUser } = require('./../validators/users')
const { getUsers, getUserById, getUserByEmail, createUser, updateUser, changePassUser, deleteUser, renewUser }= require('./../controllers/users')

//TODO: localhost/users GET, POST, DELETE, UPDATE

router.get('/',getUsers);

router.get('/userId', getUserById );
router.get('/user', getUserByEmail );

router.post('/sing-up',validatorCreateUser, createUser);
router.put('/update-user', updateUser);
router.put('/update-pass', changePassUser);
router.delete('/delete-me', deleteUser);
router.post('/recuperar-me', renewUser);



module.exports = router 