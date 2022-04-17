const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleRecipe = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#recipeName').value;
    const category = e.target.querySelector('#recipeCategory').value;
    const ingredients= e.target.querySelector('#recipeIngredients').value;
    const cookingTime = e.target.querySelector('#recipeCookingTime').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !category || !ingredients || !cookingTime)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, category, ingredients, cookingTime, _csrf}, loadRecipesFromServer);

    return false;

};//handle recipe

const RecipeForm = (props) => {
    return (
        <form id='recipeForm'
            onSubmit={handleRecipe}
            name = 'recipeForm'
            action='/paidProfilePage'
            method='POST'
            className='recipeForm'
        >            
            <label htmlFor='name'>Name: </label>
            <input id='recipeName' type='text' name='name' placeholder='Recipe Name' />

            <label htmlFor='recipeCategory'>Category: </label>
            <input id='recipeCategory' type='text' name='category' placeholder='Recipe Category' />

            <label htmlFor='recipeIngredients'>Ingredients: </label>
            <input id='recipeIngredients' type='text' name='ingredients' placeholder='Recipe ingredients'/>

            <label htmlFor='recipeCookingTime'>Cooking time (min): </label>
            <input id='recipeCookingTime' type='numebr' min='0' name='cookingTime' placeholder='Recipe Cooking Time (min)'/>

            <input id='_csrf' type='hidden' name='_csrf' value={props.csrf} />

            <input className='makeRecipeSubmit' type='submit' value='Make Recipe' />

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
const loadRecipesFromServer = async () => {
    const response = await fetch('/getRecipes');
    const data = await response.json();

    ReactDOM.render(
        <RecipeList recipes ={data.recipes} />,
        document.getElementById('myRecipes')
    );
};//end load recipes from server

//get csrf token to render the recipes to the page
const init = async() =>{
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <RecipeForm csrf ={data.csrfToken} />,
        document.getElementById('makeRecipe')
    );

    ReactDOM.render(
        <RecipeList recipes ={[]} />,
        document.getElementById('myRecipes')
    );

    loadRecipesFromServer();
};//init

window.onload = init;