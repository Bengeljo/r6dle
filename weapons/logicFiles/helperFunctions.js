import { getDailyGuesses, getEndlessGuesses } from "../main";

let guessedWeaponsHtml = []

function showHint1() {
    let hints = document.getElementById('hints');
    let hint1 = document.createElement('div');
    hint1.className = 'hints-colors hint1'
    hint1.innerHTML = 'Hint 1: This weapon is a ' + selectedWeapon.type;
    hints.appendChild(hint1);
}

function showHint2() {
    let hints = document.getElementById('hints');
    let hint2 = document.createElement('div');
    hint2.innerHTML = 'Hint 2: This weapon is used by ';
    hint2.className = 'hint2 hints-colors'
    let squareContainer = document.createElement('div');
    squareContainer.className = 'square-container'

    // Iterate over the operators and create a new element for each one
    selectedWeapon.available_on.forEach(operator => {
        let operatorElement = document.createElement('div');
        operatorElement.className = 'square animate__animated animate__flipInY';
        let img = document.createElement('img');
        img.src = `../images/r6s-operators-badge-${operator.toLowerCase()}.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        operatorElement.appendChild(img);
        squareContainer.appendChild(operatorElement);
    });

    hint2.appendChild(squareContainer);
    hints.appendChild(hint2);
}

function clear() {
    let endId = document.getElementById('endId')
    let statsBar = document.getElementById('stats_bar')
    let hints = document.getElementById('hints')
    let guessedWeapons = document.getElementById('guessed_weapons')
    let guessedWeaponsElement = document.getElementById('guessed_weapons');
    statsBar.innerHTML = ''
    endId.innerHTML = ''
    hints.innerHTML = ''
    guessedWeapons.innerHTML = ''
    guessedWeapons = []
    guessedWeaponsHtml = []
    guessedWeaponsElement.innerHTML = ''
    guessedWeaponsElement.style.display = 'contents'
}

function randomWeapon() {
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)]
    return randomWeapon
}

// Set initial guess count for daily mode
function setDailyGuesses() {
    let dailyGuesses = getDailyGuesses()
    let storedDailyGuesses = localStorage.getItem('dailyWeaponGuesses');
    if (!storedDailyGuesses || isNaN(storedDailyGuesses)) {
        localStorage.setItem('dailyWeaponGuesses', dailyGuesses);
        dailyGuesses = localStorage.getItem('dailyWeaponGuesses')
    } else {
        dailyGuesses = parseInt(storedDailyGuesses);
    }
    return dailyGuesses
}

// Set initial guess count for endless mode
function setEndlessGuesses() {
    let endlessGuesses = getEndlessGuesses()
    let storedEndlessGuesses = localStorage.getItem('endlessWeaponGuesses');
    if (!storedEndlessGuesses || isNaN(storedEndlessGuesses)) {
        localStorage.setItem('endlessWeaponGuesses', endlessGuesses);
        endlessGuesses = localStorage.getItem('endlessWeaponGuesses')
    } else {
        endlessGuesses = parseInt(storedEndlessGuesses);
    }
    return endlessGuesses
}

export { clear, randomWeapon, setDailyGuesses, setEndlessGuesses, showHint1, showHint2 }