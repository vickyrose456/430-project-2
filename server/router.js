const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // connect routes
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.get('/findByName', mid.requiresLogin, controllers.Recipe.searchRecipe);

  // want to make sure login/signup is secure and logged out
  // so they cant try to login when logged in
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // need to be logged in already to change password
  app.get('/editLogin', mid.requiresSecure, mid.requiresLogin, controllers.Account.editLoginPage);
  app.post('/editLogin', mid.requiresSecure, mid.requiresLogin, controllers.Account.editLogin);

  // make sure theyre logged in and cant logout if they arent logged in
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // make sure theyre logged in. otherwise they cannot reach page
  app.get('/recipeSearch', mid.requiresLogin, controllers.Recipe.appPage);
  // app.post('/recipeSearch', mid.requiresLogin, controllers.Recipe.searchRecipe);

  // make sure theyre logged in. otherwise they cannot reach page
  app.get('/paidProfilePage', mid.requiresLogin, mid.requiresSubscription, controllers.Recipe.paidProfilePage);
  app.post('/paidProfilePage', mid.requiresLogin, mid.requiresSubscription, controllers.Recipe.makeRecipe);

  // app.get('/', controllers.Account.loginPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
