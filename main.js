    // Parse the JSON data
    //let operators = JSON.parse(operators);
    
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
        const keys = ["gender", "role", "side", "country", "Org", "Squad", "release_year"];
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
            const keys = ["gender", "role", "side", "country", "Org", "Squad", "release_year"];
            let sharedCriteria = false;
            let answerclassic = document.createElement('div');
            answerclassic.className = 'classic-answer'
            const container = document.getElementById('answercon')
            let squarecontainer = document.createElement('div');
            squarecontainer.className = 'square-container'
            container.style = "width: 60%; margin: 0px 0px 0px 20%;"
            keys.forEach(key => {
                let square = document.createElement('div');
                square.className = 'square';
        
                let content = document.createElement('div');
                content.className = 'square-content';

        
                if (key === 'release_year') {
                    // ... rest of your comparison logic ...
                    if (operator[key] < operatorToGuess[key]) {
                        square.classList.add('square-bad');
                        content.textContent = `⬆️ ${key}: ${operator[key]}`;
                    } else if (operator[key] > operatorToGuess[key]) {
                        square.classList.add('square-bad');
                        content.textContent = `⬇️ ${key}: ${operator[key]}`;
                    } else {
                        square.classList.add('square-good');
                        content.textContent = `✅ ${key}: ${operator[key]}`;
                        sharedCriteria = true;
                    }
                } else if (Array.isArray(operator[key]) && Array.isArray(operatorToGuess[key])) {
                    // ... rest of your comparison logic ...
                    if (JSON.stringify(operator[key]) === JSON.stringify(operatorToGuess[key])) {
                        square.classList.add('square-good');
                        content.textContent = `✅ ${key}: ${operator[key].join(", ")}`;
                        sharedCriteria = true;
                    } else {
                        const matchingRoles = operator[key].filter(role => operatorToGuess[key].includes(role));
        
                        if (matchingRoles.length > 0) {
                            square.classList.add('square-partial');
                            content.textContent = `🟠 ${key}: ${operator[key].join(", ")}`;
                            sharedCriteria = true;
                        } else {
                            square.classList.add('square-bad');
                            content.textContent = `🔴 ${key}: ${operator[key].join(", ")}`;
                        }
                    }
                } else if (typeof operator[key] === 'string' && operator[key].includes(operatorToGuess[key])) {
                    square.classList.add('square-good');
                    content.textContent = `✅ ${key}: ${operator[key]}`;
                    
                sharedCriteria = true;
            } else {
                square.classList.add('square-bad');
                content.textContent = `🔴 ${key}: ${operator[key]}`;
            }
        
            square.appendChild(content);
            squarecontainer.appendChild(square);
            answerclassic.appendChild(squarecontainer)
            container.appendChild(answerclassic)
            
            });
            document.body.appendChild(container);
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
    
        
    

    var guessedOperators = []; // Array to store guessed operators

    function askForGuess() {
        // Get the button element
        var submitButton = document.getElementById('submitButton');

        // Add a click event listener to the button
        submitButton.addEventListener('click', function() {
            // Get the input field value
            var userInput = document.getElementById('inputField').value;

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

    // Start the game
    askForGuess();
