const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const user = require('../models/user');
/////middelware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.all(
    '/',
    function(req, res) {
        return res.json({
            status: true,
            message: 'user Controller working...'
        });
    }
);

router.post(
    '/createNew', [
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail()

    ],
    function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form validation error..',
                errors: errors.array()
            });
        }


        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        var temp = new user({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        temp.save(function(error, result) {
            if (error) {
                return res.json({
                    status: false,
                    message: 'DB Connection fail',
                    error: error
                });
            }
            return res.json({
                status: true,
                message: 'success....',
                result: result
            });
        });

    }
);
router.get(
    '/allData',
    function(req, res) {
        user.find(function(error, result) {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Data not found',
                    error: error
                });
            }
            return res.json({
                status: true,
                message: 'success....',
                result: result
            });
        });
    }
);

router.put(
    '/update/:email',
    function(req, res) {
        if (req.params.email) {
            user.update({ email: req.params.email }, { $set: { username: req.body.username, password: req.body.password } }, function(error, result) {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Data is not found',
                        error: error
                    });
                }
                return res.json({
                    status: true,
                    message: 'success...',
                    result: result
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'Email is not found...'
            });
        }
    }
);

router.delete(
    '/remove/:email',
    function(req, res) {
        if (req.params.email) {
            user.remove({ email: req.params.email }, function(error, result) {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Data is not found..',
                        error: error
                    });
                }
                return res.json({
                    status: true,
                    message: 'success....',
                    result: result
                });
            });
        } else {
            return res.json({
                status: false,
                message: 'Email is not found...'
            });
        }
    }
);
                module.exports=router;
