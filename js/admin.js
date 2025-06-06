const gamesTableBody = document.getElementById('gamesTableBody');
const gameForm = document.getElementById('gameForm');
const gameIdInput = document.getElementById('gameId');
const titleInput = document.getElementById('title');
const genreInput = document.getElementById('genre');
const releaseYearInput = document.getElementById('releaseYear');
const platformInput = document.getElementById('platform');
const saveGameButton = document.getElementById('saveGameButton');
const formMessage = document.getElementById('formMessage');
const listMessage = document.getElementById('listMessage');
const logoutButton = document.getElementById('logoutButton');
const welcomeMessageSpan = document.getElementById('welcomeMessage');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const playedGameTitleInput = document.getElementById('playedGameTitle');
const ratingInput = document.getElementById('rating');
const addPlayedGameButton = document.getElementById('addPlayedGameButton');
const playedGameMessage = document.getElementById('playedGameMessage');
const playedGamesTableBody = document.getElementById('playedGamesTableBody');
const gameTitlesList = document.getElementById('gameTitlesList');
const noPlayedGamesMessage = document.getElementById('noPlayedGamesMessage');


function getAllUsersGamesData() {
    const allUsersGamesJson = localStorage.getItem('userGames');
    return allUsersGamesJson ? JSON.parse(allUsersGamesJson) : {};
}

function saveAllUsersGamesData(allUsersGames) {
    localStorage.setItem('userGames', JSON.stringify(allUsersGames));
}

function getGamesFromLocalStorage() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    if (!loggedInUsername) {
        console.error("Usuário não logado ao tentar obter jogos.");
        return [];
    }
    const allUsersGames = getAllUsersGamesData();
    return allUsersGames[loggedInUsername] || [];
}

function saveGamesToLocalStorage(games) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    if (!loggedInUsername) {
        console.error("Usuário não logado ao tentar salvar jogos.");
        return;
    }
    const allUsersGames = getAllUsersGamesData();
    allUsersGames[loggedInUsername] = games;
    saveAllUsersGamesData(allUsersGames);
}

if (!getAllUsersGamesData()['admin']) {
    const initialGamesAdmin = [
        { id: '1', title: 'Super Mario Bros.', genre: 'Plataforma', releaseYear: 1985, platform: 'NES' },
        { id: '2', title: 'The Legend of Zelda: Ocarina of Time', genre: 'Aventura', releaseYear: 1998, platform: 'Nintendo 64' }
    ];
    const currentUsername = localStorage.getItem('loggedInUsername');
    localStorage.setItem('loggedInUsername', 'admin');
    saveGamesToLocalStorage(initialGamesAdmin);
    if(currentUsername) {
        localStorage.setItem('loggedInUsername', currentUsername);
    } else {
        localStorage.removeItem('loggedInUsername');
    }
}

function getPlayedGamesFromLocalStorage() {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    if (!loggedInUsername) {
        console.error("Usuário não logado ao tentar obter jogos jogados.");
        return [];
    }
    const allUsersPlayedGamesJson = localStorage.getItem('userPlayedGames');
    const allUsersPlayedGames = allUsersPlayedGamesJson ? JSON.parse(allUsersPlayedGamesJson) : {};
    return allUsersPlayedGames[loggedInUsername] || [];
}

function savePlayedGamesToLocalStorage(playedGames) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    if (!loggedInUsername) {
        console.error("Usuário não logado ao tentar salvar jogos jogados.");
        return;
    }
    const allUsersPlayedGamesJson = localStorage.getItem('userPlayedGames');
    const allUsersPlayedGames = allUsersPlayedGamesJson ? JSON.parse(allUsersPlayedGamesJson) : {};
    allUsersPlayedGames[loggedInUsername] = playedGames;
    localStorage.setItem('userPlayedGames', JSON.stringify(allUsersPlayedGames));
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

function loadGames() {
    const games = getGamesFromLocalStorage();
    gamesTableBody.innerHTML = '';

    if (games.length === 0) {
        showMessage(listMessage, 'Nenhum jogo cadastrado.', 'info');
        return;
    } else {
        listMessage.textContent = '';
    }

    games.forEach(game => {
        const row = gamesTableBody.insertRow();
        row.innerHTML = `
            <td>${game.id}</td>
            <td>${game.title}</td>
            <td>${game.genre}</td>
            <td>${game.releaseYear}</td>
            <td>${game.platform}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${game.id}">Editar</button>
                <button class="delete-btn" data-id="${game.id}">Excluir</button>
            </td>
        `;
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => editGame(e.target.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => deleteGame(e.target.dataset.id));
    });
}

gameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gameData = {
        title: titleInput.value,
        genre: genreInput.value,
        releaseYear: parseInt(releaseYearInput.value),
        platform: platformInput.value
    };

    if (gameIdInput.value) {
        updateGameInList(gameIdInput.value, gameData);
        showMessage(formMessage, 'Jogo atualizado com sucesso!', 'success');
    } 
    else {
        addGameToList(gameData);
        showMessage(formMessage, 'Jogo adicionado com sucesso!', 'success');
    }
    gameForm.reset();
    gameIdInput.value = ''; 
    saveGameButton.textContent = 'Adicionar Jogo';
    loadGames(); 
    populateGameTitlesDatalist();
});

function addGameToList(newGame) {
    const games = getGamesFromLocalStorage();
    const newId = (games.length > 0 ? Math.max(...games.map(g => parseInt(g.id))) + 1 : 1).toString();
    const gameWithId = { ...newGame, id: newId };
    games.push(gameWithId);
    saveGamesToLocalStorage(games);
}

function editGame(id) {
    const games = getGamesFromLocalStorage();
    const game = games.find(g => g.id === id);
    if (game) {
        gameIdInput.value = game.id;
        titleInput.value = game.title;
        genreInput.value = game.genre;
        releaseYearInput.value = parseInt(game.releaseYear);
        platformInput.value = game.platform;
        saveGameButton.textContent = 'Salvar Edição';
        showMessage(formMessage, 'Preencha os campos para editar e clique em "Salvar Edição".', 'info');
    }
}

function updateGameInList(id, updatedGameData) {
    let games = getGamesFromLocalStorage();
    const index = games.findIndex(g => g.id === id);
    if (index !== -1) {
        games[index] = { ...games[index], ...updatedGameData, id: id }; 
        saveGamesToLocalStorage(games);
    }
}

function deleteGame(id) {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
        let games = getGamesFromLocalStorage();
        games = games.filter(game => game.id !== id);
        saveGamesToLocalStorage(games);
        showMessage(listMessage, 'Jogo excluído com sucesso!', 'success');
        loadGames();
        populateGameTitlesDatalist();
    }
}

function loadPlayedGames() {
    const playedGames = getPlayedGamesFromLocalStorage();
    playedGamesTableBody.innerHTML = '';

    if (playedGames.length === 0) {
        noPlayedGamesMessage.textContent = 'Você ainda não adicionou nenhum jogo jogado.';
        noPlayedGamesMessage.classList.add('info-message');
        return;
    } else {
        noPlayedGamesMessage.textContent = '';
        noPlayedGamesMessage.classList.remove('info-message');
    }

    playedGames.forEach(game => {
        const row = playedGamesTableBody.insertRow();
        row.innerHTML = `
            <td>${game.title}</td>
            <td>${game.rating} / 10</td>
            <td class="actions">
                <button class="delete-played-game-btn" data-id="${game.id}">Remover</button>
            </td>
        `;
    });

    document.querySelectorAll('.delete-played-game-btn').forEach(button => {
        button.addEventListener('click', (e) => deletePlayedGame(e.target.dataset.id));
    });
}

addPlayedGameButton.addEventListener('click', () => {
    const title = playedGameTitleInput.value.trim();
    const rating = parseInt(ratingInput.value);

    if (!title || isNaN(rating) || rating < 1 || rating > 5) {
        showMessage(playedGameMessage, 'Por favor, preencha o título do jogo e uma nota válida (1-10).', 'error');
        return;
    }

    const playedGames = getPlayedGamesFromLocalStorage();
    const newId = 'pg' + (playedGames.length > 0 ? Math.max(...playedGames.map(g => parseInt(g.id.replace('pg', '')))) + 1 : 1).toString();
    
    const newPlayedGame = { id: newId, title, rating };
    playedGames.push(newPlayedGame);
    savePlayedGamesToLocalStorage(playedGames);

    showMessage(playedGameMessage, 'Jogo adicionado à sua lista de jogados!', 'success');
    playedGameTitleInput.value = '';
    ratingInput.value = '';
    loadPlayedGames();
});

function deletePlayedGame(id) {
    if (confirm('Tem certeza que deseja remover este jogo da sua lista de jogados?')) {
        let playedGames = getPlayedGamesFromLocalStorage();
        playedGames = playedGames.filter(game => game.id !== id);
        savePlayedGamesToLocalStorage(playedGames);
        showMessage(playedGameMessage, 'Jogo removido da lista!', 'success');
        loadPlayedGames();
    }
}

function populateGameTitlesDatalist() {
    const games = getGamesFromLocalStorage();
    gameTitlesList.innerHTML = '';

    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.title;
        gameTitlesList.appendChild(option);
    });
}

function openTab(tabName) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');

    document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');

    if (tabName === 'playedGames') {
        loadPlayedGames();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const loggedInUsername = localStorage.getItem('loggedInUsername'); 

    if (isAuthenticated !== 'true' || !loggedInUsername) {
        window.location.href = 'index.html';
        return;
    }

    if (welcomeMessageSpan) {
        welcomeMessageSpan.textContent = ` (Bem-vindo, ${loggedInUsername}!)`; 
    }
    
    const allUsersPlayedGames = localStorage.getItem('userPlayedGames') ? JSON.parse(localStorage.getItem('userPlayedGames')) : {};
    if (!allUsersPlayedGames[loggedInUsername]) {
        allUsersPlayedGames[loggedInUsername] = [
            { id: 'pg1', title: 'The Witcher 3', rating: 5 },
            { id: 'pg2', title: 'Cyberpunk 2077', rating: 4 }
        ];
        localStorage.setItem('userPlayedGames', JSON.stringify(allUsersPlayedGames));
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            openTab(tabName);
        });
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loggedInUsername'); 
        window.location.href = 'index.html';
    });

    openTab('manageGames'); 
    populateGameTitlesDatalist(); 
});
