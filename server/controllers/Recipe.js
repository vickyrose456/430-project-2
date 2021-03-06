const models = require('../models');
const RecipeModel = require('../models/Recipe');

const { Recipe } = models;

const appPage = (req, res) => res.render('app');

// render the page for subscribers
const paidProfilePage = (req, res) => res.render('paidPage');// paid page

const makeRecipe = async (req, res) => {
  if (!req.body.name || !req.body.category || !req.body.ingredients || !req.body.cookingTime) {
    return res.status(400).json({ error: 'Name, category, ingredients and cooking time are all required!' });
  }

  const recipeData = {
    name: req.body.name,
    ingredients: req.body.ingredients,
    cookingTime: req.body.cookingTime,
    category: req.body.category,
    owner: req.session.account._id,
  };

  try {
    const newRecipe = new Recipe(recipeData);
    await newRecipe.save();
    return res.status(201).json({
      name: newRecipe.name,
      category: newRecipe.category,
      ingredients: newRecipe.ingredients,
      cookingTime: newRecipe.cookingTime,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exist!' });
    }

    return res.status(400).json({ error: 'An error occured' });
  }
};// make Recipe

/**
 * This function will allow us to just get JSON responses of recipes for a user. This will
allow our client app to update dynamically using React. We can pair the data on
screen to the data from this function
 */
const getRecipes = (req, res) => RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  }// if error

  // no error, so return the recipes
  return res.json({ recipes: docs });
});// get recipe

// search for a recipe
const searchRecipe = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }
  // console.log(`Query name: ${req.query.name}`);
  return RecipeModel.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An error occured!' });
    }
    // if no doc found / empty doc
    if (!doc || doc.length === 0) {
      return res.json({ error: 'No recipes found ):' });
    }

    // we got the recipe data
    return res.json({ recipes: doc });
    // return res.render('app', {recipes: doc});
  });
};/// /end search recipe

module.exports = {
  appPage,
  paidProfilePage,
  makeRecipe,
  getRecipes,
  searchRecipe,
};
