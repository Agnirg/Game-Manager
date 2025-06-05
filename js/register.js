// public/js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newUsername = registerForm.newUsername.value;
            const newPassword = registerForm.newPassword.value;
            const confirmPassword = registerForm.confirmPassword.value;

            function getUsersFromLocalStorage() {
                const usersJson = localStorage.getItem('users');
                return usersJson ? JSON.parse(usersJson) : [];
            }

            function saveUsersToLocalStorage(users) {
                localStorage.setItem('users', JSON.stringify(users));
            }

            const users = getUsersFromLocalStorage();

            if (newPassword !== confirmPassword) {
                showMessage(registerMessage, 'As senhas não coincidem.', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showMessage(registerMessage, 'A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }

            const userExists = users.some(user => user.username === newUsername);
            if (userExists) {
                showMessage(registerMessage, 'Nome de usuário já existe. Escolha outro.', 'error');
                return;
            }

            const newUser = {
                username: newUsername,
                password: newPassword,
                role: 'user'
            };
            users.push(newUser);
            saveUsersToLocalStorage(users);

            showMessage(registerMessage, 'Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }

    function showMessage(element, message, type) {
        element.textContent = '';
        element.className = '';
        element.textContent = message;
        element.classList.add(`${type}-message`);
        
        setTimeout(() => {
            element.textContent = '';
            element.classList.remove(`${type}-message`);
        }, 4000);
    }
});