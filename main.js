const fs = require('fs');

// Read the JSON file
fs.readFile('operators.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON data
    const operators = JSON.parse(data);

    // Select a random operator
    const operatorToGuess = operators[Math.floor(Math.random() * operators.length)];

    // The array to track the guessed letters
    let guessedOperator = Array(operatorToGuess.name.length).fill("_");

    // The number of guesses
    let guesses = 0;

    // Function to handle a new guess
    function guess(operatorName) {
        guesses++;

        // Find the operator in the list
        const operator = operators.find(op => op.name.toLowerCase() === operatorName.toLowerCase());

        // If the operator is not found, it's a wrong guess
        if (!operator) {
            console.log("🔴 Operator not found");
            return;
        }

        // Compare the operator data with the selected operator
        const keys = ["gender", "role", "side", "country", "Org", "Squad", "release_year"];
        keys.forEach(key => {
            if (operator[key] === operatorToGuess[key]) {
                console.log(`✅ ${key}: ${operator[key]}`);
            } else if (typeof operator[key] === 'string' && operator[key].includes(operatorToGuess[key])) {
                console.log(`🟠 ${key}: ${operator[key]}`);
            } else {
                console.log(`🔴 ${key}: ${operator[key]}`);
            }
        });

        // Check if the operator name is fully guessed
        if (operatorName.toLowerCase() === operatorToGuess.name.toLowerCase()) {
            console.log("You won! The operator was " + operatorToGuess.name + ". It took you " + guesses + " guesses.");
        }
    }

    // Start the game
    console.log("Guess the operator name");
});