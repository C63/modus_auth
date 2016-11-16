var Account = require('mongoose').model('Account'),
    config = require('./config'),
    jwt = require('jsonwebtoken');

exports.create = function(req, res, next) {
    var acc = new Account(req.body);
    acc.save(function(err) {
        if (err) {
            res.status(400).send({
                success: false,
                message: 'Account already existed!'
            });
        } else {
            res.json(acc);
        }
    });
};

exports.authenticate = function(req, res, next) {
    Account.findOne({
        email: req.body.email
    }, function(err, account) {
        if (err) throw err;
        if (!account) {
            res.status(401).send({
                success: false,
                message: 'Authentication failed.'
            });
        } else {
            account.validatePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign({
                        id: account._id,
                    }, config.secret, {
                      expiresIn: '1h'
                    });
                    res.status(200).json({
                        success: true,
                        "access-token": token
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        message: 'Authentication failed.'
                    });
                }
            });
        }
    });
}
