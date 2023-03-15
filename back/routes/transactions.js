const express = require('express');
const router = express.Router();

//TODO: localhost/users GET, POST, DELETE, UPDATE

router.get('/',(req, res)=>{
const data = ['chau', 'mundo'];
    res.send({data})
}) ;



module.exports = router 