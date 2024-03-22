    // Parse the JSON data
    //let operators = JSON.parse(operators);
    
    import operators from './operators.json' assert{type:'json'}
//console.log(operators)
    // Select a random operator
    const operatorToGuess = operators[Math.floor(Math.random() * operators.length)];

    

    // The number of guesses
    let guesses = 0;

    // Function to handle a new guess
    function guess(operatorName) {
        guesses++;
        
    
       // Debugging output
        console.log("Operator name to find:", operatorToGuess);
    

        // Find the operator in the list
        const operator = operators.find(op => typeof op.name[0] === 'string' && op.name[0].toLowerCase() === operatorName.toLowerCase());

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
            } else if (typeof operator[key] === 'string' && operator[key].includes(operatorToGuess[key])) {
                console.log(`🟠 ${key}: ${operator[key]}`);
                sharedCriteria = true;
            } else {
                console.log(`🔴 ${key}: ${operator[key]}`);
            }
        });
        
        

        // Check if the operator name is fully guessed
        if (operatorName.toLowerCase() === operatorToGuess.name[0].toLowerCase()) {
            console.log("You won! The operator was " + operatorToGuess.name[0] + ". It took you " + guesses + " guesses.");
        } else {
            if (sharedCriteria) {
                console.log("🟠 The guessed operator shares some criteria with the operator to find."); 
            } else {
                console.log("🔴 The guessed operator does not share any criteria with the operator to find.");
            }
            askForGuess();
        }
    }

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
