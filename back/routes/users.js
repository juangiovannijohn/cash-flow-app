
const express = require('express');
const router = express.Router();
const { validatorCreateUser } = require('./../validators/users')
const { login, getUsers, getUserById, getUserByEmail, createUser, updateUser, changePassUser, deleteUser, renewUser }= require('./../controllers/users')
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory} = require('./../controllers/categories')
//TODO: localhost/users GET, POST, DELETE, UPDATE

//Usuarios
router.post('/login', login );
router.get('/',getUsers);
router.get('/userId', getUserById );
router.get('/user', getUserByEmail );
router.post('/sing-up',validatorCreateUser, createUser);
router.put('/update-user', updateUser);
router.put('/update-pass', changePassUser);
router.delete('/delete-me', deleteUser);
router.post('/recuperar-me', renewUser);

//Categorias
router.get('/categories/',getCategories);
router.get('/categories/categoryId', getCategory );
router.post('/categories/new-category', createCategory);
router.put('/categories/update-category', updateCategory);
router.delete('/categories/delete-category', deleteCategory);

module.exports = router 