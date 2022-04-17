const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleSearchRecipe = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#recipeSearchName').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, _csrf}, loadRecipeFromServer);

    return false;

};//handle recipe

const RecipeSearchForm = (props) => {
    return (
        <form id='recipeSearchForm'
            onSubmit={handleSearchRecipe}
            name = 'recipeSearchForm'
            action='/recipeSearch'
            method='GET'
            className='recipeSearchForm'
        >            
            <label htmlFor='name'>Name: </label>
            <input id='recipeSearchName' type='text' name='name' placeholder='Recipe Name' />

            <input className='searchRecipeSubmit' type='submit' value='Search Recipe' />

        </form>
    );
};//recipe form

//create component to display list of recipes

const RecipeList = (props) => {
    if(props.recipes.length === 0){
        return(
            <div className='recipeList'>
                <h3 className='emptyRecipe'>No Recipes yet!</h3>
            </div>
        );
    }

    const recipeNodes = props.recipes.map(recipe => {
        return(
            <div key={recipe._id} className='recipe'>
                <img src='assets/img/chef.png' alt ='chef face' className='chefFace' />
                <h3 className='recipeName'>Name: {recipe.name} </h3>
                <h3 className='recipeCategory'>Category: {recipe.category} </h3>
                <h3 className='recipeIngredients'>Ingredients: {recipe.ingredients} </h3>
                <h3 className='recipeCookingTime'>CookingTime: {recipe.cookingTime} </h3>
            </div>
        );
    });//recipe nodes

    return (
        <div className='recipeList'>
            {recipeNodes}
        </div>
    );

};//recipe list

//fns to load recipes from the server
const loadRecipeFromServer = async () => {
    const response = await fetch('/findByName');
    const data = await response.json();

    ReactDOM.render(
        <RecipeList recipes = {data.recipes} />,
        document.getElementById('recipes')
    );
};//end load recipes from server

//get csrf token to render the recipes to the page
const init = async() =>{
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <RecipeSearchForm csrf ={data.csrfToken} />,
        document.getElementById('searchRecipe')
    );

    ReactDOM.render(
        <RecipeList recipes ={[]} />,
        document.getElementById('recipes')
    );

    loadRecipeFromServer();
    
    /*ReactDOM.render(
        <RecipeForm csrf ={data.csrfToken} />,
        document.getElementById('makeRecipe')
    );

    ReactDOM.render(
        <RecipeList recipes ={[]} />,
        document.getElementById('recipes')
    );

    loadRecipesFromServer();*/

};//init

window.onload = init;
