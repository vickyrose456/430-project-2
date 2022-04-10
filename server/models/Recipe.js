const mongoose = require('mongoose');
const _ = require('underscore');

let RecipeModel = {};

const setName = (name) => _.escape(name).trim();

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },  
  ingredients: {
    type: String,
    min: 0,
    require: true,
  },
  cookingTime: {
    type: Number,
    min: 0,
    require: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  category: doc.category,
  ingredients: doc.ingredients,
  cookingTime: doc.cookingTime,
});

RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerID to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return RecipeModel.find(search).select('name category ingredients cookingTime').lean().exec(callback);
};

// finding a specific recipe by category
RecipeSchema.statics.findByName = (category, callback) => {
  const search = { category,};

  return RecipeModel.findOne(search, callback);
};

RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = RecipeModel;
