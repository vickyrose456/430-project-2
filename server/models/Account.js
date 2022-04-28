const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

let AccountModel = {};

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  subscribed: {
    type: Boolean,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  subscribed: doc.subscribed,
  _id: doc._id,
});

// Helper function to hash a password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    const doc = await AccountModel.findOne({ username }).exec();
    if (!doc) {
      return callback();
    }

    const match = await bcrypt.compare(password, doc.password);
    if (match) {
      return callback(null, doc);
    }
    return callback();
  } catch (err) {
    return callback(err);
  }
};

AccountSchema.statics.updatePass = async (name, pass, subscribe, callback) => {
  const searchName = {
    username: name,
  };
  /* const newInfo = {
    username: name,
    password: pass,
    subscribed: subscribe
  } */
  const newInfo = {
    password: pass,
    subscribed: subscribe
  };

  try {
    // if the account does exist, update the password
    // the password should be sent as an encrypted password already
    const doc = await AccountModel.findOneAndUpdate(searchName, newInfo, { new: true });
    if (!doc) {
      // if no account w/ that name return the callback fns
      return callback();
    }// end if
    return callback(null, doc);
  } catch (err) {
    // send back the error that occured
    return callback(err);
  }// end catch
};// end update password

AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
