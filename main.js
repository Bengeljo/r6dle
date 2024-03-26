// Parse the JSON data
    import operators from './operators.json' assert{type:'json'}
//console.log(operators)
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

// Append the keys container to the results container
//resultsContainer.appendChild(keysContainer);

    // The number of guesses
    let guesses = 0;

    // Function to handle a new guess
    function guess(operatorName) {
        guesses++;
        let streak = localStorage.getItem('streak');
        console.log('The current streak is' + streak)
        let img = document.createElement('img');
    
       // Debugging output
        //console.log("Operator name to find:"operatorToGuess[name]);
    

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
        } else {
            if (sharedCriteria) {
                console.log("🟠 The guessed operator shares some criteria with the operator to find."); 
            } else {
                console.log("🔴 The guessed operator does not share any criteria with the operator to find.");
            }
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
                    // ... rest of your comparison logic ...
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
                    // ... rest of your comparison logic ...
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
    problemSolved();
    // Disable the input
    let input = document.getElementById('inputField');
    input.disabled = true;

    // Get the body and append the winning screen
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(winningScreen);
}
    
        
    

    var guessedOperators = []; // Array to store guessed operators

    function askForGuess() {
        // Get the button element
        var submitButton = document.getElementById('submitButton');
        
        // Add a click event listener to the button
        submitButton.addEventListener('click', function() {
            // Get the input field value
            var userInput = document.getElementById('inputField').value;
            var userInputTest =  document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('inputField').addEventListener('click', function() {
                    this.select();
                });
            });
            console.log(userInputTest)
            // Check if the operator has already been guessed
            if (guessedOperators.includes(userInput)) {
                console.log('This operator has already been guessed.');
                return; // Exit the function early
            }

            // Add the operator to the array of guessed operators
            guessedOperators.push(userInput);

            // Now you can use the userInput value in your code
            guess(userInput)
    });
}

// When a user solves a problem
function problemSolved() {
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
}

// When the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the current streak from local storage
    let currentStreak = localStorage.getItem('streak');

    // If there's no current streak, this is the user's first visit
    if (!currentStreak) {
        currentStreak = 0;
    }

    // Display the current streak
    document.getElementById('streakDisplay').textContent = `You have solved it ${currentStreak} times already`;
});

    // Start the game
    askForGuess();
