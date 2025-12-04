const button = document.getElementById('login-user-button');
const userInput = document.getElementById('id-usuario');

button.addEventListener('click', () => {
    const user_name =userInput.value.trim();
    if (user_name === "") {
        alert("Por favor ingresa un nombre de usuario.");
        return;
    }
    localStorage.setItem('userName', user_name);
    window.location.href = 'productos.html';
});

