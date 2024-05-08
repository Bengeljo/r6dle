// Parse the JSON data
let nextTime
let operator
export let operators
let countryToContinent = {};
//changes for a test
let guessedOperators = []
let lastSolvedTimestamp
window.onload = async function () {
    const operatorResponse = await fetch('./operator.json');
    const operatorData = await operatorResponse.json();
    operator = operatorData;
    nextTime = new Date(operator[0].nextChange);
    const operatorsResponse = await fetch('./operators.json')
    const operatorsData = await operatorsResponse.json();
    const continentsResponse = await fetch('./continents.json');
    const continentsData = await continentsResponse.json();
    operators = operatorsData
    lastSolvedTimestamp = localStorage.getItem('lastSolvedTimestamp')
    // Create a country to continent mapping
    for (let continent in continentsData) {
        continentsData[continent].forEach(country => {
            countryToContinent[country] = continent;
        });
    }
    console.log(operator)
    console.log(operators)
    loadTriedOperators()

    // Get the saved mode from localStorage
    let savedMode = localStorage.getItem('mode');
    let lastGuessedOp = localStorage.getItem('lastGuessedOp')


    // Get the last visit timestamp and streak count from localStorage
    let lastVisitTimestamp = localStorage.getItem('lastVisitTimestamp');
    let dailyStreakCount = parseInt(localStorage.getItem('dailyStreakCount')) || 0;
    var dateNow = new Date().getTime();
    // If the last visit was within the last 24 hours, increment the streak count
    console.log(dateNow >= lastSolvedTimestamp + 24 * 60 * 60 * 1000)
    if (dateNow <= lastSolvedTimestamp + 24 * 60 * 60 * 1000) {
        console.log('Daily streak reset');
        localStorage.setItem('dailyStreakCount', 0);
    }

    // Check if the last guessed Operator is equal to the current operator and if that is not true set dailyWon to false
    if (lastGuessedOp != operator[0].name || lastGuessedOp === null) {
        localStorage.setItem('dailyWon', 'false')

        if (guessedOperators.length > 0) {
            localStorage.setItem('guessedOperators', [])
            guessedOperators = localStorage.getItem('guessedOperators')
        }
    }

    // If a mode was saved, open that mode
    if (savedMode === 'daily') {
        dailyMode();
    } else if (savedMode === 'endless') {
        endlessMode();
    } else {
        // Disable the input
        let input = document.getElementById('inputField');
        if (input) {
            input.disabled = true;
        }
    }
    //console.log(localStorage.getItem('dailyWon'))
    // Call fetchDailyData once immediately, then every 5 seconds
    fetchDailyData();
    setInterval(fetchDailyData, 5000);
    fetchEndlessSolved()
    setInterval(fetchEndlessSolved, 5000);
    // Start the game
    askForGuess();
}

// Create a container for the keys
let keysContainer = document.createElement('div');
keysContainer.className = 'classic-answers-container';

// Create a row for the keys
let keysRow = document.createElement('div');
keysRow.className = 'answer-titles square-container animate__animated animate__fadeIn';

// Create boxes for the keys
let keys = ['name', 'gender', 'role', 'side', 'country', 'Org', 'Squad', 'release_year'];
keys.forEach(key => {
    let box = document.createElement('div');
    box.className = 'square square-title';
    box.style.flexBasis = 'calc(5% - 4px)';

    let content = document.createElement('div');
    content.className = 'square-content';
    content.textContent = key.charAt(0).toUpperCase() + key.slice(1);

    box.appendChild(content);
    keysRow.appendChild(box);
});

// Append the keys row to the keys container
keysContainer.appendChild(keysRow);

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
}

let dailyGuesses = 0;
let endlessGuesses = 0;
let operatorToGuess
let dailyResult = 0;
let endlessResult = 0;

window.endlessMode = function () {
    // Logic for endless mode
    updateModeIndicator('Endless');
    //console.log("Now endless mode")
    localStorage.setItem('mode', 'endless');
    displayStreak();
    endlessGuesses = setEndlessGuesses();
    operatorToGuess = setOperatorToGuess();
    loadTriedOperators()
    var event = new CustomEvent('clearUsedNames');
    window.dispatchEvent(event);
    // Find the winning screen and remove it if it exists
    clear();
    // Enable the input
    let input = document.getElementById('inputField');
    if (input) {
        input.disabled = false;
    }
}

window.dailyMode = function () {
    // Enable the input
    let input = document.getElementById('inputField');
    if (input) {
        input.disabled = false;
        if (localStorage.getItem('dailyWon') === 'true') {
            input.disabled = true
        }
    }
    // Logic for daily mode
    updateModeIndicator('Daily');
    //console.log("Now daily mode")
    localStorage.setItem('mode', 'daily');
    displayDailyStreak();
    dailyGuesses = setDailyGuesses();
    operatorToGuess = setOperatorToGuess();
    var event = new CustomEvent('clearUsedNames');
    window.dispatchEvent(event);
    clear();
    if (localStorage.getItem('dailyWon') === 'true') {
        displayWinningScreen()

    }

    //Use guess and askForGuess as needed
}
// numbers
let dailyStreakCount = localStorage.getItem('dailyStreakCount') || 0;

// Function to handle a new guess
function guess(operatorName) {

    if (localStorage.getItem('mode') === 'daily') {
        if (dailyGuesses == 0) {
            tutoButton()
        }
        dailyGuesses++
        localStorage.setItem('dailyGuesses', dailyGuesses)
    } else if (localStorage.getItem('mode') === 'endless') {
        if (endlessGuesses == 0) {
            tutoButton()
        }
        endlessGuesses++
        localStorage.setItem('endlessGuesses', endlessGuesses)
    }
    console.log('daily: ' + dailyGuesses + '  endless: ' + endlessGuesses)
    // Find the operator in the list
    const operator = operators.find(op => typeof op.name === 'string' && op.name.toLowerCase() === operatorName.toLowerCase());
    compareOperators(operator, operatorToGuess)
    // Debugging output
    console.log("Found operator:", operator);
    // If the operator is not found, it's a wrong guess
    if (!operator) {
        console.log("🔴 Operator not found");
        return askForGuess();
    }

    // Compare the operator data with the selected operator
    const keys = ["name", "gender", "role", "side", "country", "Org", "Squad", "release_year"];
    let sharedCriteria = false;

    const normalizeRoles = roles => roles.split(',').map(role => role.trim()).sort().join(', ');

    keys.forEach(key => {
        if (key === 'release_year') {
            if (operator[key] < operatorToGuess[key]) {
                console.log(`⬆️ ${key}: ${operator[key]}`);
            } else if (operator[key] > operatorToGuess[key]) {
                console.log(`⬇️ ${key}: ${operator[key]}`);
            } else {
                console.log(`✅ ${key}: ${operator[key]}`);
            }
        } else if (Array.isArray(operator[key]) && Array.isArray(operatorToGuess[key])) {
            const normalizedOperatorRole = normalizeRoles(operator[key].join(','));
            const normalizedOperatorToGuessRole = normalizeRoles(operatorToGuess[key].join(','));

            if (normalizedOperatorRole === normalizedOperatorToGuessRole) {
                console.log(`✅ ${key}: ${operator[key].join(", ")}`);
                sharedCriteria = true;
            } else {
                const matchingRoles = operator[key].filter(role => normalizedOperatorToGuessRole.includes(role));

                if (matchingRoles.length > 0) {
                    console.log(`🟠 ${key}: ${operator[key].join(", ")}`);
                    sharedCriteria = true;
                } else {
                    console.log(`🔴 ${key}: ${operator[key].join(", ")}`);
                }
            }
        } else if (key === 'country' && operator[key] !== operatorToGuess[key] && countryToContinent[operator[key]] === countryToContinent[operatorToGuess[key]]) {
            console.log(`🟠 ${key}: ${operator[key]}`);
            sharedCriteria = true;
        } else if (typeof operator[key] === 'string' && operator[key] === operatorToGuess[key]) {
            console.log(`✅ ${key}: ${operator[key]}`);
            sharedCriteria = true;
        } else {
            console.log(`🔴 ${key}: ${operator[key]}`);
        }
    });

    // Check if the operator name is fully guessed
    if (operatorName.toLowerCase() === operatorToGuess.name.toLowerCase()) {
        console.log("You won! The operator was " + operatorToGuess.name);
        if (localStorage.getItem('mode') === 'daily') {
            localStorage.setItem('dailyWon', 'true')
            localStorage.setItem('lastGuessedOp', operatorName)
        }
        problemSolved();

    } else {
        if (sharedCriteria) {
            console.log("🟠 The guessed operator shares some criteria with the operator to find.");
        } else {
            console.log("🔴 The guessed operator does not share any criteria with the operator to find.");
        }
        saveTriedOperators();
        askForGuess();
    }

function compareOperators(operator, operatorToGuess) {
        // Compare the operator data with the selected operator
        const keys = ["name", "gender", "role", "side", "country", "Org", "Squad", "release_year"];
        let sharedCriteria = false;
        let answerclassic = document.createElement('div');
        answerclassic.className = 'classic-answer'
        const container = document.getElementById('answercon')
        let squarecontainer = document.createElement('div');
        squarecontainer.className = 'square-container'

        // Create the image square first
        let imgSquare = document.createElement('div');
        imgSquare.className = 'square animate__animated animate__flipInY';

        let img = document.createElement('img');
        img.src = `../images/r6s-operators-badge-${operatorName.toLowerCase()}.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        imgSquare.appendChild(img);
        imgSquare.classList.add('square-title')
        squarecontainer.appendChild(imgSquare);

        keys.forEach(key => {
            let square = document.createElement('div');
            square.className = 'square animate__animated animate__flipInY';

            let content = document.createElement('div');
            content.className = 'square-content';


            if (key === 'release_year') {
                if (operator[key] < operatorToGuess[key]) {
                    square.classList.add('square-bad');
                    content.textContent = `⬆️ ${operator[key]}`;
                } else if (operator[key] > operatorToGuess[key]) {
                    square.classList.add('square-bad');
                    content.textContent = `⬇️ ${operator[key]}`;
                } else {
                    square.classList.add('square-good');
                    content.textContent = `✅ ${operator[key]}`;
                    sharedCriteria = true;
                }
            } else if (key === 'name') {
                square.classList.add('square-title');
                content.textContent = `${operator[key]}`;
            } else if (Array.isArray(operator[key]) && Array.isArray(operatorToGuess[key])) {
                const normalizedOperatorRole = operator[key].join(',').split(',').map(role => role.trim()).sort().join(', ');
                const normalizedOperatorToGuessRole = operatorToGuess[key].join(',').split(',').map(role => role.trim()).sort().join(', ');

                const normalizedOperatorRoleArray = normalizedOperatorRole.split(', ');
                const normalizedOperatorToGuessRoleArray = normalizedOperatorToGuessRole.split(', ');

                if (normalizedOperatorRoleArray.every(role => normalizedOperatorToGuessRoleArray.includes(role)) &&
                    normalizedOperatorToGuessRoleArray.every(role => normalizedOperatorRoleArray.includes(role))) {
                    square.classList.add('square-good');
                    content.textContent = `${operator[key].join(", ")}`;
                    sharedCriteria = true;
                } else {
                    const matchingRoles = operator[key].filter(role => normalizedOperatorToGuessRole.includes(role));

                    if (matchingRoles.length > 0) {
                        square.classList.add('square-partial');
                        content.textContent = `${operator[key].join(", ")}`;
                        sharedCriteria = true;
                    } else {
                        square.classList.add('square-bad');
                        content.textContent = `${operator[key].join(", ")}`;
                    }
                }
            } else if (key === 'country') {
                if (operator[key] === operatorToGuess[key]) {
                    square.classList.add('square-good');
                    content.textContent = `${operator[key]}`;
                    sharedCriteria = true;
                } else if (operator[key] !== operatorToGuess[key] && countryToContinent[operator[key]] === countryToContinent[operatorToGuess[key]]) {
                    square.classList.add('square-partial');
                    content.textContent = `${operator[key]}`;
                    sharedCriteria = true;
                } else {
                    square.classList.add('square-bad');
                    content.textContent = `${operator[key]}`;
                }
            } else if (typeof operator[key] === 'string' && operator[key].includes(operatorToGuess[key])) {
                square.classList.add('square-good');
                content.textContent = `${operator[key]}`;

                sharedCriteria = true;
            } else {
                square.classList.add('square-bad');
                content.textContent = `${operator[key]}`;
            }

            square.appendChild(content);
            squarecontainer.appendChild(square);

        });

        answerclassic.appendChild(squarecontainer)

        // Insert the new result before the first child
        let firstChild = container.firstChild;
        container.insertBefore(answerclassic, firstChild);
        if (operatorName.toLowerCase() === operatorToGuess.name.toLowerCase()) {
            // If the guessed operator is the right one, display the winning screen
            if (localStorage.getItem('mode') === 'daily') {
                dailyResult = dailyGuesses
                var date = new Date().getTime();
                localStorage.setItem('lastSolvedTimestamp', date);
                localStorage.setItem('dailyResult', dailyResult)
                localStorage.setItem('dailyGuesses', 0)
            } else if (localStorage.getItem('mode') === 'endless') {
                endlessResult = endlessGuesses
                localStorage.setItem('endlessGuesses', 0)
                let input = document.getElementById('inputField')
                input.disabled = true
            }
            displayWinningScreen();

        }
        return sharedCriteria;
    }


    // Get the first object from the output
    let result = operator;

    // Create a new row
    let row = document.createElement('div');
    row.className = 'resultRow';

    // Create boxes for the different keys
    keys.forEach(key => {
        let box = document.createElement('div');
        box.className = 'resultBox';
        box.textContent = result[key];
        row.appendChild(box);
    });

    // Append the row to the results container
    //resultsContainer.appendChild(row);

    // Clear the input field
    inputField.value = '';
};

function displayWinningScreen() {
    if (localStorage.getItem('mode') === 'daily') {
        if (localStorage.getItem('dailyWon') === 'true') {
            dailyResult = localStorage.getItem('dailyResult')
        }
    }

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
    img.width = 60;
    img.height = 60;
    img.className = "gg-icon";
    img.className = "gg-icon";
    var operatorName = operatorToGuess.name;
    img.src = `../images/r6s-operators-badge-${operatorName.toLowerCase()}.png`;
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
    ggNameDiv.innerHTML = operatorToGuess.name; // Replace with the actual operator name
    secondInnerDiv.appendChild(ggNameDiv); // Append the gg-name div to the second inner div

    // Create the nthtries div
    let nthTriesDiv = document.createElement('div');
    nthTriesDiv.className = 'nthtries';
    nthTriesDiv.innerHTML = 'Number of tries: ';

    // Create the nth span
    let nthSpan = document.createElement('span');
    nthSpan.className = 'nth';
    if (localStorage.getItem('mode') === 'daily') {
        nthSpan.innerHTML = dailyResult
    } else if (localStorage.getItem('mode') === 'endless') {
        nthSpan.innerHTML = endlessResult
    }

    let button = document.createElement('button')
    button.className = 'de_button'
    button.innerHTML = 'Restart'
    button.id = 'restartButton'

    // Create the countdown and append it to the DOM
    let countdown = document.createElement('div');
    countdown.className = 'next-operator next-operator';

    let nextTitle = document.createElement('div');
    nextTitle.className = 'next-title';
    countdown.appendChild(nextTitle);
    nextTitle.innerHTML = 'Next operator in:'

    let countdownTime = document.createElement('div');
    countdownTime.className = 'modal-time';
    countdownTime.id = 'countdown';
    countdown.appendChild(countdownTime);

    // Update the countdown every 1 second
    let countdownInterval = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = nextTime - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update the countdownTime innerHTML
        countdownTime.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

        // If the count down is finished, write some text 
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownTime.innerHTML = "Refresh the site to get the new operator";
        }
    }, 1000);

    // Append the elements to their parents
    ggAnswerDiv.appendChild(firstInnerDiv);
    ggAnswerDiv.appendChild(secondInnerDiv);
    backgroundEndDiv.appendChild(ggDiv);
    backgroundEndDiv.appendChild(ggAnswerDiv);
    backgroundEndDiv.appendChild(nthTriesDiv);
    if (localStorage.getItem('mode') === 'endless') {
        backgroundEndDiv.appendChild(button)
    }
    if (localStorage.getItem('mode') === 'daily') {
        backgroundEndDiv.appendChild(countdown)
    }
    nthTriesDiv.appendChild(nthSpan);
    emptyDiv.appendChild(backgroundEndDiv);
    finishedDiv.appendChild(emptyDiv);
    endId.appendChild(finishedDiv);
    restartButton();
}

function askForGuess() {
    // Get the button element
    var submitButton = document.getElementById('submitButton');
    // Create an array of operator names
    var operatorNames = operators.map(function (operator) {
        return operator.name;
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

        // Check if the operator has already been guessed or empty or does not exist
        if (guessedOperators.includes(userInput) || userInput === "") {
            console.log('This operator has already been guessed.');
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!operatorNames.includes(userInput)) {
            console.log('This operator does not exist.');
            return;
        }

        // Add the operator to the array of guessed operators
        guessedOperators.push(userInput);

        // Now you can use the userInput value in your code
        guess(userInput);
    });

    // Add a click event listener to the button
    submitButton.addEventListener('click', function () {
        // Get the input field value
        var userInput = inputField.value;

        // Check if the operator has already been guessed or empty or does not exist
        if (guessedOperators.includes(userInput) || userInput === "") {
            console.log('This operator has already been guessed.');
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!operatorNames.includes(userInput)) {
            console.log('This operator does not exist.');
            return;
        }

        // Add the operator to the array of guessed operators
        guessedOperators.push(userInput);

        // Now you can use the userInput value in your code
        guess(userInput);
    });
}

// When a user solves a problem
function problemSolved() {
    if (localStorage.getItem('mode') === 'endless') {
        // Get the current streak from local storage
        let currentStreak = localStorage.getItem('streak');

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
        document.getElementById('streakDisplay').textContent = `You solved R6dle already ${currentStreak} times`;
    } else if (localStorage.getItem('mode') === 'daily') {

        // Increment the daily streak
        dailyStreakCount++;
        // Save the new daily streak to local storage
        localStorage.setItem('dailyStreakCount', dailyStreakCount.toString())
        // Display the new streak
        document.getElementById('dailyStreakDisplay').textContent = `Your daily streak increased and is now at ${dailyStreakCount}`;
    }
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
    } else if (currentStreak == 1) {
        document.getElementById('streakDisplay').textContent = 'You have solved this r6dle 1 time already';
    } else if (currentStreak > 1) {
        document.getElementById('streakDisplay').textContent = `You have solved it ${currentStreak} times already`;
    }
    var dailyStreakDisplay = document.getElementById('dailyStreakDisplay');
    dailyStreakDisplay.style.display = 'none'
    dataDailyStreak.style.display = 'none'

    dataGlobalSolvedEndless.style.display = ''
    dataGlobalSolvedEndless.innerHTML = 'The endless mode was already solved times'


}

function displayDailyStreak() {
    // Get the daily streak from local storage
    let dailyStreak = localStorage.getItem('dailyStreakCount');
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
    } else if (dailyStreak == 1) {
        document.getElementById('dailyStreakDisplay').textContent = 'Your daily streak is: 1';
    } else if (dailyStreak > 1) {
        document.getElementById('dailyStreakDisplay').textContent = `Your daily streak is: ${dailyStreak}`;
    }
    // Get the 'streakDisplay' element
    var streakDisplay = document.getElementById('streakDisplay');

    // Hide the 'streakDisplay' element
    streakDisplay.style.display = 'none';
    dataGlobalSolvedEndless.style.display = 'none'
}

// Save the tried operators
function saveTriedOperators() {
    if (localStorage.getItem('mode') === 'daily') {
        localStorage.setItem('guessedOperators', JSON.stringify(guessedOperators));
    }
}

// Load the tried operators
function loadTriedOperators() {
    if (localStorage.getItem('mode') === 'daily') {
        const savedTriedOperators = localStorage.getItem('guessedOperators');

        if (savedTriedOperators) {
            guessedOperators = JSON.parse(savedTriedOperators);
        } else {
            guessedOperators = [];
        }
        // Dispatch a custom event when guessedOperators is loaded
        window.dispatchEvent(new Event('guessedOperatorsLoaded'));
    } else {
        guessedOperators = [];
        window.dispatchEvent(new Event('guessedOperatorsLoaded'));
    }
}

function clearGuessedOperators() {
    if (localStorage.getItem('mode') === 'daily') {
        localStorage.removeItem('guessedOperators');
    }
}

function checkWin() {
    var userHasWon = localStorage.getItem('dailyWon') === 'true'
    var dailyStreakCount = localStorage.getItem('dailyStreakCount')
    if (userHasWon) {
        clearGuessedOperators();
        localStorage.setItem('dailyWon', 'false')
        localStorage.setItem('dailyStreakCount', dailyStreakCount + 1)
    }
}

// Set initial guess count for daily and endless modes
function setGuesses() {
    let guesses = {
        daily: 0,
        endless: 0
    };

    if (localStorage.getItem('mode') === 'endless') {
        let endlessGuesses = localStorage.getItem('guesses.endless');
        if (!endlessGuesses) {
            localStorage.setItem('guesses.endless', guesses.endless);
        }
    } else if (localStorage.getItem('mode') === 'daily') {
        let dailyGuesses = localStorage.getItem('guesses.daily');
        if (!dailyGuesses) {
            localStorage.setItem('guesses.daily', guesses.daily);
        }
    }
}

// Select a random operator or take the daily
function setOperatorToGuess() {
    let operatorToGuess;

    if (localStorage.getItem('mode') === 'endless') {
        operatorToGuess = localStorage.getItem('operatorToGuess');
        if (!operatorToGuess || !operatorToGuess.length) {
            operatorToGuess = operators[Math.floor(Math.random() * operators.length)];
        }
    } else if (localStorage.getItem('mode') === 'daily') {
        operatorToGuess = operator[0];
    }

    return operatorToGuess;
}

// Set initial guess count for daily mode
function setDailyGuesses() {
    let storedDailyGuesses = localStorage.getItem('dailyGuesses');
    if (!storedDailyGuesses || isNaN(storedDailyGuesses)) {
        localStorage.setItem('dailyGuesses', dailyGuesses);
        dailyGuesses = localStorage.getItem('dailyGuesses')
    } else {
        dailyGuesses = parseInt(storedDailyGuesses);
    }
    return dailyGuesses
}

// Set initial guess count for endless mode
function setEndlessGuesses() {
    let storedEndlessGuesses = localStorage.getItem('endlessGuesses');
    if (!storedEndlessGuesses || isNaN(storedEndlessGuesses)) {
        localStorage.setItem('endlessGuesses', endlessGuesses);
        endlessGuesses = localStorage.getItem('endlessGuesses')
    } else {
        endlessGuesses = parseInt(storedEndlessGuesses);
    }
    return endlessGuesses
}

function restartButton() {
    // Get the button element
    var restartButton = document.getElementById('restartButton');

    // Check if the button exists
    if (restartButton) {
        // Add a click event listener to the button
        restartButton.addEventListener('click', function () {
            guessedOperators = []
            operatorToGuess = setOperatorToGuess()
            endlessGuesses = 0
            let input = document.getElementById('inputField')
            input.disabled = false
            clear()
            var event = new CustomEvent('clearUsedNames');
            window.dispatchEvent(event);
        });
    }
}

function tutoButton() {
    //Get the tuto element
    var tutoElement = document.getElementById('tuto')
    tutoElement.style.display = 'contents'

    var tutoButton = document.getElementById('close')
    if (tutoButton) {
        tutoButton.addEventListener('click', function () {
            tutoElement.style.display = 'none'
        })
    }
}

function clear() {
    let answercon = document.getElementById('answercon')
    answercon.innerHTML = ''
    let endId = document.getElementById('endId')
    endId.innerHTML = ''
}

// Call this function whenever a quiz is solved
function incrementSolvedCount() {
    fetch('../../server/datup.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchDailyData() {
    fetch('../../server/dailysolved.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('alreadyDailySolved').innerHTML = data + ' people already found the operator';
        })
        .catch(error => console.error('Error:', error));
}

function incrementGlobalSolved() {
    fetch('../../server/endlessup.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchEndlessSolved() {
    fetch('../../server/endlesssolved.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                document.getElementById('globalSolvedEndless').innerHTML = data.globalSolvedEndless + ' times was the Endless mode solved already';
            }
        })
        .catch(error => console.error('Error:', error));
}

export function getGuessedOperators() {
    if (guessedOperators === null) {
        guessedOperators = [];
    }
    return guessedOperators;
} 