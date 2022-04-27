const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleEditLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const subscribed = e.target.querySelector('#subscribedVal').checked;

    if(!pass || !pass2)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2)
    {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, subscribed});
    return false;

};//end handle sign up clicks



const EditLoginWindow = (props) => {
    return(
        <form id = 'editLoginForm'
            name = 'editLoginForm'
            onSubmit = {handleEditLogin}
            action = '/editLogin'
            method = "POST"
            className = 'mainForm'>
        
        <label htmlFor='pass'>Password: </label>
        <input id='pass' type='password' name='pass' placeholder='password' />

        <label htmlFor='pass2'>Retype Password: </label>
        <input id='pass2' type='password' name='pass2' placeholder='retype password' />

        <label htmlFor='subscribed'>Subscribe? </label>
        <input id='subscribedVal' type='checkbox' name='subscribed' />

        <input className='formSubmit' type='submit' value='Update' />
        
        </form>
    );
};//sign up window

//initialize the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    //Render the Edit profile window
    ReactDOM.render(
        <EditLoginWindow csrf = {data.csrfToken}/>,
        document.getElementById('content')
    );

};//init

window.onload = init;