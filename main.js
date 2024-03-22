const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define operators outside of fs.readFile
let operators;

// Read the JSON file
fs.readFile('operators.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data
    operators = JSON.parse(data);

    // Select a random operator
    const operatorToGuess = operators[Math.floor(Math.random() * operators.length)];

    // The array to track the guessed letters
    let guessedOperator = Array(operatorToGuess.name.length).fill("_");

    // The number of guesses
    let guesses = 0;

    // Function to handle a new guess
    function guess(operatorName) {
        guesses++;
        guessedOperator.push(operatorName);
    
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
            if (Array.isArray(operator[key]) && Array.isArray(operatorToGuess[key])) {
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
            rl.close();
        } else {
            if (sharedCriteria) {
                console.log("🟠 The guessed operator shares some criteria with the operator to find."); 
            } else {
                console.log("🔴 The guessed operator does not share any criteria with the operator to find.");
            }
            askForGuess();
        }
    }

    // Function to ask for a new guess
    function askForGuess() {
        if (guessedOperator.length > 0){
            console.log("Guessed operator so far: " + guessedOperator.join(" "));
        }
        rl.question('Guess the operator name: ', guess);
    }

    // Start the game
    askForGuess();
});