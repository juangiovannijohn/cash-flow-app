const {check} = require('express-validator');
const   validateResults  = require('./../helpres/handleValidator')
const validatorCreateUser = [
    check('email').exists().notEmpty().isLength({min:2, max:100}),
    check('pass').exists().notEmpty().isLength({min:2, max:60}),
    check('role').exists().optional(),
    check('name').exists().isLength({ max:100}),
    check('lastname').exists().isLength({ max:100}),
    check('birthday').exists().isLength({ max:100}),
    check('country').exists().isLength({ max:100}),
    check('city').exists().isLength({ max:100}),
    check('categories').exists().isArray().optional({ nullable: true, checkFalsy: true }),
    (req, res, next)=> {
        return validateResults(req, res, next);
         
    }
]

module.exports = {validatorCreateUser};