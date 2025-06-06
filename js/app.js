document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    function getUsersFromLocalStorage() {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    }

    if (getUsersFromLocalStorage().length === 0) {
        const initialUsers = [{ username: 'admin', password: 'password123', role: 'admin' }];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value;

            const users = getUsersFromLocalStorage();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('loggedInUsername', user.username);
                window.location.href = 'admin.html';
            } else {
                showMessage(loginMessage, 'Credenciais inválidas.', 'error');
            }
        });
    }

    if (localStorage.getItem('isAuthenticated') === 'true' && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'admin.html';
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
