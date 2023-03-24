const express = require('express');
const {getTransactions, createTransaction,updateTransaction,deleteTransaction, getTransaction
} =require('./../controllers/transactions')
const router = express.Router();

//TODO: localhost/users GET, POST, DELETE, UPDATE

//Transacciones
router.get('/',getTransactions);
router.get('/detail', getTransaction);
router.post('/create',createTransaction);
router.put('/update', updateTransaction);
router.delete('/delete', deleteTransaction)




module.exports = router 