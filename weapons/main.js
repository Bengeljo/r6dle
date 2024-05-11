import { setDmgBar, setFireRateBar, setHintDmgBar, setHintFireRateBar, setHintMobBar, setMagSize, setMobBar, setHintMagSize } from "./logicFiles/setBars.js"
//import { fetchDailyData, fetchEndlessSolved, incrementGlobalSolved, incrementSolvedCount } from "./logicFiles/serverFunctions.js"
import { clear, randomWeapon, setDailyGuesses, setEndlessGuesses, showHint1, showHint2, getDailyGuesses, getEndlessGuesses, setWeapons, weapons, guessedWeaponsHtml } from "./logicFiles/helperFunctions.js"

let guessedWeapons = []
let guesses = 0;
let selectedWeapon
let hint = 1;
let checkbox
let weaponToGuess;
let dailyWeaponToGuess = null;
let dailyStreakCount = localStorage.getItem('dailyWeaponStreakCount') || 0;
let mode 
let lastSolvedTimestamp


window.onload = async function () {
    const weaponsResponse = await fetch('./weapons.json')
    const dailyWeaponResponse = await fetch('./dweapon.json')
    const weaponsData = await weaponsResponse.json()
    const dailyWeapon = await dailyWeaponResponse.json();
    dailyWeaponToGuess = dailyWeapon[0]
    setWeapons(weaponsData)
    askForGuess();
    window.dispatchEvent(new Event('guessedWeaponsLoaded'));
    let input = document.getElementById('inputField')
    input.disabled = true

    let savedMode = localStorage.getItem('mode');
    lastSolvedTimestamp = localStorage.getItem('lastSolvedWeaponTimeStamp')
    checkDailyStreak()

    let lastDailyWeapon = localStorage.getItem('lastDailyWeapon')
    if (!lastDailyWeapon != dailyWeaponToGuess.name) {
        localStorage.setItem('dailyWeaponWon', false)
    }

    // If a mode was saved, open that mode
    if (savedMode === 'daily') {
        dailyMode();
        mode = 'daily'
    } else if (savedMode === 'endless') {
        endlessMode();
        mode = 'endless'
    } else {
        // Disable the input
        let input = document.getElementById('inputField');
        if (input) {
            input.disabled = true;
        }
    }
    // Call fetchDailyData once immediately, then every 5 seconds
    fetchDailyData();
    setInterval(fetchDailyData, 5000);
    fetchEndlessSolved()
    setInterval(fetchEndlessSolved, 5000);
}
function checkDailyStreak() {
    // If the last visit was more than 24 hours, set the streak count to 0
    let dateNow = new Date().getTime();

    if ((dateNow >= (lastSolvedTimestamp + 24 * 60 * 60 * 1000)) && new Date().getUTCHours() > 18) {
        console.log('Daily weapon streak reset');
        localStorage.setItem('dailyWeaponStreakCount', 0);
    }
}

window.dailyMode = function () {
    let dailyGuesses = getDailyGuesses()
    resetValues()
    // Enable the input
    let input = document.getElementById('inputField');
    if (input) {
        input.disabled = false;
        if (localStorage.getItem('dailyWeaponWon') === 'true') {
            input.disabled = true
        }
    }
    mode = 'daily'
    // Logic for daily mode
    updateModeIndicator('Daily');
    localStorage.setItem('mode', 'daily');
    displayDailyStreak();
    dailyGuesses = setDailyGuesses();

    if (dailyWeaponToGuess == null) {
        dailyWeaponToGuess = randomWeapon();
    }

    selectedWeapon = dailyWeaponToGuess;

    setDmgBar(dailyWeaponToGuess);
    setMobBar(dailyWeaponToGuess);
    setFireRateBar(dailyWeaponToGuess);
    setMagSize(dailyWeaponToGuess)

    var event = new CustomEvent('clearUsedNames');
    window.dispatchEvent(event);

    if (localStorage.getItem('dailyWeaponWon') === 'true') {
        displayWinningScreen()
    }
}

window.endlessMode = function () {
    let endlessGuesses = getEndlessGuesses()
    resetValues()
    // Logic for endless mode
    updateModeIndicator('Endless');
    localStorage.setItem('mode', 'endless');
    displayStreak();
    endlessGuesses = setEndlessGuesses();
    weaponToGuess = randomWeapon();

    selectedWeapon = weaponToGuess;
    mode = 'endless'
    setDmgBar(weaponToGuess);
    setMobBar(weaponToGuess);
    setFireRateBar(weaponToGuess);
    setMagSize(weaponToGuess)

    loadTriedWeapons()
    var event = new CustomEvent('clearUsedNames');
    window.dispatchEvent(event);

    // Enable the input
    let input = document.getElementById('inputField');
    if (input) {
        input.disabled = false;
    }
}

// Load the tried operators
function loadTriedWeapons() {
    if (localStorage.getItem('mode') === 'daily') {
        const savedTriedWeapons = localStorage.getItem('guessedWeapons');

        if (savedTriedWeapons) {
            guessedWeapons = JSON.parse(savedTriedWeapons);
        } else {
            guessedWeapons = [];
        }
        // Dispatch a custom event when guessedOperators is loaded
        window.dispatchEvent(new Event('guessedOperatorsLoaded'));
    } else {
        guessedWeapons = [];
        window.dispatchEvent(new Event('guessedOperatorsLoaded'));
    }
}

function updateModeIndicator(mode) {
    const modeIndicator = document.getElementById('mode-indicator');
    modeIndicator.textContent = `Current mode: ${mode}`;
    if (mode == 'Daily') {
        let button = document.createElement('button')
        button.className = 'de_button'
        button.innerHTML = 'Endless Mode'
        button.onclick = function () {
            endlessMode()
        }
        modeIndicator.appendChild(button)

    } else if (mode == 'Endless') {
        let button = document.createElement('button')
        button.className = 'de_button'
        button.innerHTML = 'Daily Mode'
        button.onclick = function () {
            dailyMode()
        }
        modeIndicator.appendChild(button)
    }

    clear()
}

function displayDailyStreak() {
    // Get the daily streak from local storage
    let dailyStreak = localStorage.getItem('dailyWeaponStreakCount');
    var dailyStreakDisplay = document.getElementById('dailyStreakDisplay');
    var dataGlobalSolvedEndless = document.getElementById('globalSolvedEndless');
    var dataDailyStreak = document.getElementById('alreadyDailySolved');
    dailyStreakDisplay.style.display = '';

    // If there's no daily streak, this is the user's first visit
    if (dailyStreak === null) {
        dailyStreak = 0;
    }

    // Display the daily streak
    if (dailyStreak == 0) {
        document.getElementById('dailyStreakDisplay').textContent = 'You have no daily streak';
    } else if (dailyStreak >= 1) {
        document.getElementById('dailyStreakDisplay').textContent = `Your daily streak is: ${dailyStreak}`;
    }

    // Get the 'streakDisplay' element
    var streakDisplay = document.getElementById('streakDisplay');

    // Hide the 'streakDisplay' element
    streakDisplay.style.display = 'none';
    dataGlobalSolvedEndless.style.display = 'none'
    dataDailyStreak.style.display = ''
}

function displayStreak() {
    // Get the current streak from local storage
    let currentStreak = localStorage.getItem('streak');
    // Get the 'streakDisplay' element
    var streakDisplay = document.getElementById('streakDisplay');
    var dataDailyStreak = document.getElementById('alreadyDailySolved');
    var dataGlobalSolvedEndless = document.getElementById('globalSolvedEndless');

    // Show the 'streakDisplay' element
    streakDisplay.style.display = '';

    // If there's no current streak, this is the user's first visit
    if (!currentStreak) {
        currentStreak = 0;
    }

    // Display the current streak
    if (currentStreak == 0) {
        document.getElementById('streakDisplay').textContent = 'You have never solved R6dle';
    } else if (currentStreak > 1) {
        document.getElementById('streakDisplay').textContent = `You have solved it ${currentStreak} times already`;
    }

    var dailyStreakDisplay = document.getElementById('dailyStreakDisplay');
    dailyStreakDisplay.style.display = 'none'
    dataDailyStreak.style.display = 'none'

    dataGlobalSolvedEndless.style.display = ''
    dataGlobalSolvedEndless.innerHTML = 'The endless mode was already solved times'
}

async function guessWeapon(weapon) {
    checkbox.checked = false;
    guesses++

    if (guesses == 3) {
        showHint1();
        hint++;
    } else if (guesses == 6) {
        showHint2();
    }

    if (weapon === selectedWeapon.name) {
        let input = document.getElementById('inputField')
        input.disabled = true
        console.log('You won!')
        problemSolved();
        const weaponsArr = weapons
        let gWeapon = await weaponsArr.find(w => w.name === weapon)
        if (mode = 'daily') {
            let lastSolvedTimestamp = new Date()
            localStorage.setItem('lastSolvedWeaponTimeStamp', lastSolvedTimestamp)
            localStorage.setItem('dailyWeaponWon', true)
            localStorage.setItem('dailyWeaponGuessed', guesses)
            localStorage.setItem('lastDailyWeapon', selectedWeapon.name)
        }
        setHintDmgBar(gWeapon)
        setHintMobBar(gWeapon);
        setHintFireRateBar(gWeapon);
        setHintMagSize(gWeapon)
        displayWinningScreen();
        resetValues()
        return true
    } else {
        // Add the guessed weapon to the array
        guessedWeaponsHtml.push(weapon);

        const weaponsArr = weapons
        let gWeapon = await weaponsArr.find(w => w.name === weapon)

        //show hint bars
        setHintDmgBar(gWeapon)
        setHintMobBar(gWeapon);
        setHintFireRateBar(gWeapon);
        setHintMagSize(gWeapon)

        // Get the element where you want to display the guessed weapons
        let guessedWeaponsElement = document.getElementById('guessed_weapons');
        let nextHintElement = document.getElementById('nextHint')

        guessedWeaponsElement.className = 'hints-colors'
        guessedWeaponsElement.innerHTML = 'Guessed Weapons:'


        nextHintElement.className = 'hints-colors';
        nextHintElement.innerHTML = `${3 * hint - guesses} more guesses until next hint`
        if (3 * hint - guesses > 0) {
            nextHintElement.style.display = ''
        }
        else { nextHintElement.style.display = 'none' }
        // Create a new div for the weapon boxes
        let weaponBoxes = document.createElement('div');

        // Set the display of weaponBoxes to grid
        weaponBoxes.style.display = 'grid';
        weaponBoxes.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        weaponBoxes.style.gap = '30px';
        weaponBoxes.style.justifyItems = 'center';
        // Iterate over each guessed weapon
        for (let i = 0; i < guessedWeaponsHtml.length; i++) {
            let weaponDiv = document.createElement('div');
            let weaponName = document.createElement('div');
            let weaponImage = document.createElement('img');

            // Set the innerHTML of the weaponName to the guessed weapon's name
            weaponName.innerHTML = guessedWeaponsHtml[i].replace('.', '_');

            // Set the src of the weaponImage to the guessed weapon's image
            // Replace 'path_to_images' with the actual path to your images
            weaponImage.src = `../images/weapons/${guessedWeaponsHtml[i].toLowerCase().replace('.', '_')}.avif`;

            // Add CSS styles to weaponDiv, weaponName, and weaponImage
            weaponDiv.style.display = 'flex';
            weaponDiv.style.flexDirection = 'column';
            weaponDiv.style.alignItems = 'center';
            weaponDiv.style.justifyContent = 'center';
            weaponDiv.style.margin = '10px';
            weaponDiv.style.width = '220px'

            weaponImage.style.width = '220px';

            // Append the weaponName and weaponImage to the weaponDiv
            weaponDiv.appendChild(weaponName);
            weaponDiv.appendChild(weaponImage);

            // Append the weaponDiv to the guessedWeaponsElement
            weaponBoxes.appendChild(weaponDiv);
        }
        guessedWeaponsElement.appendChild(weaponBoxes);

        guessedWeaponsElement.style.display = 'block'

        return false
    }
}

function askForGuess() {
    // Get the button element
    var submitButton = document.getElementById('submitButton');
    // Create an array of operator names
    const weaponsArr = weapons
    var weaponNames = weaponsArr.map(function (weapons) {
        return weapons.name;
    });
    // Get the input field element
    var autobox = document.querySelector(".auto-box");

    // Add a click event listener to the input field
    autobox.addEventListener('click', function () {
        // Get the input field element
        var inputField = document.getElementById('inputField');
        // Select the input field content
        inputField.select();

        // Get the input field value
        var userInput = inputField.value;
        inputField.value = '';
        // Check if the operator has already been guessed or empty or does not exist
        if (guessedWeapons.includes(userInput) || userInput === "") {
            console.log('This weapon has already been guessed.');
            inputField.value = '';
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!weaponNames.includes(userInput)) {
            console.log('This weapon does not exist.');
            inputField.value = '';
            return;
        }

        // Add the operator to the array of guessed operators
        guessedWeapons.push(userInput);
        console.log(userInput)
        // Now you can use the userInput value in your code
        guessWeapon(userInput);
    });

    // Add a click event listener to the button
    submitButton.addEventListener('click', function () {
        // Get the input field value
        var userInput = inputField.value;
        inputField.value = '';

        // Check if the operator has already been guessed or empty or does not exist
        if (guessedWeapons.includes(userInput) || userInput === "") {
            console.log('This weapon has already been guessed.');
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!weaponNames.includes(userInput)) {
            console.log('This weapon does not exist.');
            return;
        }

        // Add the operator to the array of guessed operators
        guessedWeapons.push(userInput);
        console.log(userInput)
        // Now you can use the userInput value in your code
        guessWeapon(userInput);
    });
}

function displayWinningScreen() {
    // Get the endId element
    let endId = document.getElementById('endId');

    // Create the finished div
    let finishedDiv = document.createElement('div');
    finishedDiv.className = 'finished';

    // Create the empty div
    let emptyDiv = document.createElement('div');

    // Create the background-end div
    let backgroundEndDiv = document.createElement('div');
    backgroundEndDiv.className = 'background-end';

    // Create the gg div
    let ggDiv = document.createElement('div');
    ggDiv.className = 'gg';
    ggDiv.innerHTML = 'gg wp';

    // Create the gg-answer div
    let ggAnswerDiv = document.createElement('div');
    ggAnswerDiv.className = 'gg-answer';

    // Create the first inner div
    let firstInnerDiv = document.createElement('div');
    // Create the img
    let img = document.createElement('img');
    img.width = 200;
    img.className = "gg-icon";
    img.className = "gg-icon";
    var operatorName = selectedWeapon.name;
    img.src = `../images/weapons/${selectedWeapon.name.toLowerCase().replace('.', '_')}.avif`;
    firstInnerDiv.appendChild(img);

    // Create the second inner div
    let secondInnerDiv = document.createElement('div');

    // Create the gg-you span
    let ggYouSpan = document.createElement('span');
    ggYouSpan.className = 'gg-you';
    ggYouSpan.innerHTML = 'You guessed';
    secondInnerDiv.appendChild(ggYouSpan); // Append the gg-you span to the second inner div

    // Create the br
    let br = document.createElement('br');
    secondInnerDiv.appendChild(br); // Append the br to the second inner div

    // Create the gg-name div
    let ggNameDiv = document.createElement('div');
    ggNameDiv.className = 'gg-name';
    ggNameDiv.innerHTML = selectedWeapon.name; // Replace with the actual operator name
    secondInnerDiv.appendChild(ggNameDiv); // Append the gg-name div to the second inner div

    // Create the nth-tries div
    let nthTriesDiv = document.createElement('div');
    nthTriesDiv.className = 'nthtries';
    nthTriesDiv.innerHTML = 'Number of tries: ';

    // Create the nth span
    let nthSpan = document.createElement('span');
    nthSpan.className = 'nth';
    if (mode == 'daily') {
        let dailyGuessed = localStorage.getItem('dailyWeaponGuessed')
        nthSpan.innerHTML = dailyGuessed
    } else {
        nthSpan.innerHTML = guesses
    }

    // Create restart button
    let button = document.createElement('button')
    button.className = 'de_button'
    button.innerHTML = 'Restart'
    button.id = 'restartButton'

    // Append the elements to their parents
    ggAnswerDiv.appendChild(firstInnerDiv);
    ggAnswerDiv.appendChild(secondInnerDiv);
    backgroundEndDiv.appendChild(ggDiv);
    backgroundEndDiv.appendChild(ggAnswerDiv);
    backgroundEndDiv.appendChild(nthTriesDiv);
    nthTriesDiv.appendChild(nthSpan);

    if (localStorage.getItem('mode') == 'endless') {
        backgroundEndDiv.appendChild(button)
    }

    emptyDiv.appendChild(backgroundEndDiv);
    finishedDiv.appendChild(emptyDiv);
    endId.appendChild(finishedDiv);
    if (localStorage.getItem('mode') == 'endless') {
        restartButton();
    }
}

function restartButton() {
    // Get the button element
    var restartButton = document.getElementById('restartButton');

    // Check if the button exists
    if (restartButton) {
        // Add a click event listener to the button
        restartButton.addEventListener('click', function () {
            selectedWeapon = randomWeapon()
            resetValues()
            clear()
            setDmgBar(selectedWeapon);
            setMobBar(selectedWeapon);
            setFireRateBar(selectedWeapon);
            setMagSize(selectedWeapon)
            askForGuess();
            var event = new CustomEvent('clearUsedWeapons');
            window.dispatchEvent(event);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkbox = document.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', function () {
        var magSizeHint = document.getElementById('magSizeHint');
        var fireRateHint = document.getElementById('fireRateHint');
        var dmgHint = document.getElementById('dmgHint');
        var mobHint = document.getElementById('mobHint');

        if (this.checked) {
            magSizeHint.style.display = 'none';
            fireRateHint.style.display = 'none';
            dmgHint.style.display = 'none';
            mobHint.style.display = 'none';
        } else {
            magSizeHint.style.display = 'block';
            fireRateHint.style.display = 'block';
            dmgHint.style.display = 'block';
            mobHint.style.display = 'block';
        }
    });
});

// When a user solves a problem
function problemSolved() {
    if (localStorage.getItem('mode') === 'endless') {
        // Get the current streak from local storage
        let currentStreak = localStorage.getItem('weaponStreak');
        incrementGlobalSolved();

        // If there's no current streak, this is the first problem the user has solved
        if (!currentStreak) {
            currentStreak = 0;
        }
        console.log('before solved: ' + currentStreak)
        // Increment the streak
        currentStreak++;
        console.log('after solved: ' + currentStreak)
        // Save the new streak to local storage
        localStorage.setItem('streak', currentStreak);

        // Display the new streak
        document.getElementById('streakDisplay').textContent = `You solved Weapon-R6dle already ${currentStreak} times`;
    } else if (localStorage.getItem('mode') === 'daily') {
        incrementSolvedCount();
        // Increment the daily streak
        dailyStreakCount++;
        // Save the new daily streak to local storage
        localStorage.setItem('dailyWeaponStreakCount', dailyStreakCount.toString())
        // Display the new streak
        document.getElementById('dailyStreakDisplay').textContent = `Your daily streak increased and is now at ${dailyStreakCount}`;
    }
}

function resetValues() {
    guesses = 0
    guessedWeapons = []
    hint = 1
}

function getGuessedWeapons() {
    if (!guessedWeapons) {
        guessedWeapons = [];
    }
    return guessedWeapons;
}

function getSelectedWeapon() {
    return selectedWeapon;
}

// Call this function whenever a quiz is solved
function incrementSolvedCount() {
    fetch('../../server/datWeaponUp.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchDailyData() {
    fetch('../../server/dailyWeaponSolved.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('alreadyDailySolved').innerHTML = data + ' people already found the weapon';
        })
        .catch(error => console.error('Error:', error));
}
function incrementGlobalSolved() {
    fetch('../../server/endlessWeaponUp.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchEndlessSolved() {
    fetch('../../server/endlessWeaponSolved.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                document.getElementById('globalSolvedEndless').innerHTML = data.globalSolvedEndless + ' times was the Endless mode already solved';
            }
        })
        .catch(error => console.error('Error:', error));
}

export { getGuessedWeapons, getSelectedWeapon, selectedWeapon, dailyWeaponToGuess, mode }
