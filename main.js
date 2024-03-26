// Parse the JSON data
import operators from './operators.json' assert{type:'json'}

window.onload = function() {
    loadTriedOperators()

    // Get the saved mode from localStorage
    let savedMode = localStorage.getItem('mode');

    // Get the last visit timestamp and streak count from localStorage
    let lastVisitTimestamp = localStorage.getItem('lastVisitTimestamp');
    let dailyStreakCount = parseInt(localStorage.getItem('dailyStreakCount')) || 0;
       
    // If the last visit was within the last 24 hours, increment the streak count
    if (lastVisitTimestamp && Date.now() - parseInt(dailyStreakCount) >= 24 * 60 * 60 * 1000) {
        dailyStreakCount = 0;
    }
  
    // If a mode was saved, open that mode
    if (savedMode === 'daily') {
      dailyMode();
      
    } else if (savedMode === 'endless') {
      endlessMode();
    }
    console.log(localStorage.getItem('dailyWon'))
    
    // Start the game
    askForGuess();
  }
// Select a random operator
const operatorToGuess = operators[Math.floor(Math.random() * operators.length)];
    
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
    if (mode == 'Daily'){
        let button = document.createElement('button')
        button.className = 'de_button'
        button.innerHTML = 'Endless Mode'
        button.onclick = function() {
            endlessMode()
        }
        modeIndicator.appendChild(button)
        
    }else if( mode == 'Endless'){
        let button = document.createElement('button')
        button.className = 'de_button'
        button.innerHTML = 'Daily Mode'
        button.onclick = function() {
            dailyMode()
        }
        modeIndicator.appendChild(button)
    }
  }
    window.endlessMode = function() {
    // Logic for endless mode
    updateModeIndicator('Endless');
    console.log("Now endless mode")
    localStorage.setItem('mode', 'endless');
    displayStreak(); 
     // Find the winning screen and remove it if it exists
    let winningScreen = document.querySelector('.winning-screen');
    if (winningScreen) {
        winningScreen.remove();
    }
    // Enable the input
    let input = document.getElementById('inputField');
    if (input) {
        input.disabled = false;
    }
}
    window.dailyMode = function() {
    // Logic for daily mode
    updateModeIndicator('Daily');
    console.log("Now daily mode")
    localStorage.setItem('mode', 'daily');
    displayDailyStreak();
    if(localStorage.getItem('dailyWon') === 'true'){
        displayWinningScreen()
    }
   
    //Use guess and askForGuess as needed
}
    // numbers
    let guesses = 0;
    let dailyStreakCount = localStorage.getItem('dailyStreakCount') || 0;

    // Function to handle a new guess
    function guess(operatorName) {
        guesses++;
        let streak = localStorage.getItem('streak');
        //console.log('The current streak is' + streak)
        let img = document.createElement('img');
    
        
    

        // Find the operator in the list
        const operator = operators.find(op => typeof op.name === 'string' && op.name.toLowerCase() === operatorName.toLowerCase());
        compareOperators(operator,operatorToGuess)
        // Debugging output
        console.log("Found operator:", operator);
        // If the operator is not found, it's a wrong guess
        if (!operator) {
            console.log("🔴 Operator not found");
            return askForGuess();
        }

        // Compare the operator data with the selected operator
        const keys = ["name","gender", "role", "side", "country", "Org", "Squad", "release_year"];
        let sharedCriteria = false;
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
                // Check if the arrays are equal
                if (JSON.stringify(operator[key]) === JSON.stringify(operatorToGuess[key])) {
                    console.log(`✅ ${key}: ${operator[key].join(", ")}`);
                    sharedCriteria = true;
                } else {
                    // Find the matching roles
                    const matchingRoles = operator[key].filter(role => operatorToGuess[key].includes(role));

                    if (matchingRoles.length > 0) {
                        console.log(`🟠 ${key}: ${operator[key].join(", ")}`);
                        sharedCriteria = true;
                    } else {
                        console.log(`🔴 ${key}: ${operator[key].join(", ")}`);
                    }
                }
            } else if (typeof operator[key] === 'string' && operator[key] === operatorToGuess[key]) {
                console.log(`✅ ${key}: ${operator[key]}`);
                sharedCriteria = true;
            } else {
                console.log(`🔴 ${key}: ${operator[key]}`);
            }
        });

        // Check if the operator name is fully guessed
        if (operatorName.toLowerCase() === operatorToGuess.name.toLowerCase()) {
            console.log("You won! The operator was " + operatorToGuess.name + ". It took you " + guesses + " guesses.");
            if(localStorage.getItem('mode') === 'daily'){
                localStorage.setItem('dailyWon', 'true')
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
            const keys = ["name","gender", "role", "side", "country", "Org", "Squad", "release_year"];
            let sharedCriteria = false;
            let answerclassic = document.createElement('div');
            answerclassic.className = 'classic-answer'
            const container = document.getElementById('answercon')
            let squarecontainer = document.createElement('div');
            squarecontainer.className = 'square-container'
            container.style = "width: 180%; margin: 0px 0px 0px 35%;"
        
            // Create the image square first
            let imgSquare = document.createElement('div');
            imgSquare.className = 'square animate__animated animate__flipInY';
        
            let img = document.createElement('img');
            img.src = `images/r6s-operators-badge-${operatorName.toLowerCase()}.png`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        
            imgSquare.appendChild(img);
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
                } else if (Array.isArray(operator[key]) && Array.isArray(operatorToGuess[key])) {
                    if (JSON.stringify(operator[key]) === JSON.stringify(operatorToGuess[key])) {
                        square.classList.add('square-good');
                        content.textContent = `${operator[key].join(", ")}`;
                        sharedCriteria = true;
                    } else {
                        const matchingRoles = operator[key].filter(role => operatorToGuess[key].includes(role));
        
                        if (matchingRoles.length > 0) {
                            square.classList.add('square-partial');
                            content.textContent = `${operator[key].join(", ")}`;
                            sharedCriteria = true;
                        } else {
                            square.classList.add('square-bad');
                            content.textContent = `${operator[key].join(", ")}`;
                        }
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
    // Create the winning screen
    let winningScreen = document.createElement('div');
    winningScreen.className = 'winning-screen';
    winningScreen.textContent = 'Congratulations! You guessed the right operator.';
    // Disable the input
    let input = document.getElementById('inputField');
    input.disabled = true;
    // Find the marked div
    let markedDiv = document.querySelector('.copywrite');
    // Insert the winning screen before the marked div
    markedDiv.parentNode.insertBefore(winningScreen, markedDiv);
}
     
    

    

function askForGuess() {
    // Get the button element
    var submitButton = document.getElementById('submitButton');
    
    // Get the input field element
    var autobox = document.querySelector(".auto-box");

    // Add a click event listener to the input field
    autobox.addEventListener('click', function() {
            // Get the input field element
            var inputField = document.getElementById('inputField');
             // Select the input field content
             inputField.select();
 
             // Get the input field value
             var userInput = inputField.value;
 
             // Check if the operator has already been guessed
             if (guessedOperators.includes(userInput)) {
                 console.log('This operator has already been guessed.');
                 return; // Exit the function early
             }
 
             // Add the operator to the array of guessed operators
             guessedOperators.push(userInput);
 
             // Now you can use the userInput value in your code
             guess(userInput);
    });

    // Add a click event listener to the button
    submitButton.addEventListener('click', function() {
        // Get the input field value
        var userInput = inputField.value;

        // Check if the operator has already been guessed
        if (guessedOperators.includes(userInput)) {
            console.log('This operator has already been guessed.');
            return; // Exit the function early
        }

        // Add the operator to the array of guessed operators
        guessedOperators.push(userInput);

        // Now you can use the userInput value in your code
        guess(userInput);
    });
}

// When a user solves a problem
function problemSolved() {
    if(localStorage.getItem('mode') === 'endless'){
        // Get the current streak from local storage
        let currentStreak = localStorage.getItem('streak');

        // If there's no current streak, this is the first problem the user has solved
        if (!currentStreak) {
            currentStreak = 0;
        }

        // Increment the streak
        currentStreak++;

        // Save the new streak to local storage
        localStorage.setItem('streak', currentStreak);

        // Display the new streak
        document.getElementById('streakDisplay').textContent = `Your streak: ${currentStreak}`;
    } else if (localStorage.getItem('mode') === 'daily'){

        // Increment the daily streak
        dailyStreakCount + 1;
        // Save the new daily streak to local storage
        localStorage.setItem('dailyStreakCount', dailyStreakCount.toString())
        // Display the new streak
        document.getElementById('dailyStreakDisplay').textContent = dailyStreakCount;


    }
}

function displayStreak() {
    // Get the current streak from local storage
    let currentStreak = localStorage.getItem('streak');
    // Get the 'streakDisplay' element
    var streakDisplay = document.getElementById('streakDisplay');

    // Show the 'streakDisplay' element
    streakDisplay.style.display = '';
    // If there's no current streak, this is the user's first visit
    if (!currentStreak) {
        currentStreak = 0;
    }
    // Display the current streak
    if (currentStreak == 0){
        document.getElementById('streakDisplay').textContent = 'You have never solved R6dle';
    } else if (currentStreak == 1){
        document.getElementById('streakDisplay').textContent = 'You have solved this r6dle 1 time already';
    } else if (currentStreak > 1){
        document.getElementById('streakDisplay').textContent = `You have solved it ${currentStreak} times already`;
    }
    var dailyStreakDisplay = document.getElementById('dailyStreakDisplay');
    dailyStreakDisplay.style.display = 'none'
}

function displayDailyStreak() {
    // Get the daily streak from local storage
    let dailyStreak = localStorage.getItem('dailyStreakCounter');
    var dailyStreakDisplay = document.getElementById('dailyStreakDisplay');
    dailyStreakDisplay.style.display = '';
    // If there's no daily streak, this is the user's first visit
    if (!dailyStreak) {
        dailyStreak = 0;
    }
    // Display the daily streak
    if (dailyStreak == 0){
        document.getElementById('dailyStreakDisplay').textContent = 'You have no daily streak';
    } else if (dailyStreak == 1){
        document.getElementById('dailyStreakDisplay').textContent = 'Your daily streak is: 1';
    } else if (dailyStreak > 1){
        document.getElementById('dailyStreakDisplay').textContent = `Your daily streak is: ${dailyStreak}`;
    }
    // Get the 'streakDisplay' element
    var streakDisplay = document.getElementById('streakDisplay');

    // Hide the 'streakDisplay' element
    streakDisplay.style.display = 'none';
}

// Define guessedOperators in the global scope
let guessedOperators = [];

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
  }else{
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

export function getGuessedOperators() {
    return guessedOperators;
  }
    
