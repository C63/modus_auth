var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

var AccountSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        validate: [
            function(password) {
                return password && password.length > 3 && password.length < 16
            },
            'Password length should be between 4-15 character'
        ]
    },
    displayName: {
        type: String,
        trim: true,
        index: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

AccountSchema.pre('save', function(next) {
    var acc = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(acc.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                acc.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

AccountSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {      
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

AccountSchema.methods.toJSON = function() {
    var acc = this.toObject();
    delete acc.password;
    return acc;
}

mongoose.model('Account', AccountSchema);
