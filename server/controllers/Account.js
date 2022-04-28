const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};// end login page

const editLoginPage = (req, res) => res.render('editLogin');// end login page

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};// end logout

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // both fields were entered, so check if pass matches username
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: './recipeSearch' });
  });
};// end login

const signup = async (req, res) => {
  // cast strings to gaurantee valid types and then check if its there and password matched
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const subscribed = `${req.body.subscribed}`;

  // if any fields not fille out, status error
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords need to match!' });
  }

  // no errors, so hash the password so that it is encyrpted
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account((
      {
        username,
        password: hash,
        subscribed,
      }
    ));

    // we can save to db b/c of how sendPost() in client.js handles requests
    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/recipeSearch' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) { // code 11000 is mongo's duplicate entry error
      return res.status(400).json({ error: 'Username already in use.' });
    }
    // some other error occurred
    return res.status(400).json({ error: 'An error occured.' });
  }// end catch
};// end signup

const editLogin = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const subscribed = `${req.body.subscribed}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords need to match!' });
  }

  try {
    // no errors so hash the password to be encrypted
    //console.dir(pass);
    const hash = await Account.generateHash(pass);
    //console.dir(hash);
    // find the user and update the subscription and password
    return Account.updatePass(username, hash, subscribed, (err, doc) => {
    // return callback if theres an error
      if (err || !doc) {
        return res.json({ err });
      }

      // redirect to logout page
      return res.json({ redirect: './recipeSearch' });
    });// end updatePassword
  } catch (err) {
    return res.status(400).json({ error: 'an error occured.' });
  }// end catch
};// edit login

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });// get Token

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  editLoginPage,
  editLogin,
  getToken,
};
