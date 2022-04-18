const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('recipeMessage').classList.remove('hidden');
  };//handle error
  
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('recipeMessage').classList.add('hidden');
  
    if(result.error) {
      handleError(result.error);
    }

    if(result.redirect) {
      window.location = result.redirect;
    }

    if(handler)
    {
        handler(result);
    }
  
  };//send post

  
const hideError = () => {
    document.getElementById('recipeMessage').classList.add('hidden');
}; //hide error

module.exports = {
    handleError,
    sendPost,
    hideError,
};