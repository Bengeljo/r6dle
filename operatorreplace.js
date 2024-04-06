export function scheduleOperatorReplacement() {
    fetch('serverTime.php')
        .then(response => response.text())
        .then(serverTime => {
            var now = new Date(serverTime);

            fetch('operator.json')
                .then(response => response.json())
                .then(operators => {
                    var operator = operators[0]; // Assuming the operator is the first item in the array

                    if (operator.nextChange) {
                        var nextChange = new Date(operator.nextChange);

                        if (now > nextChange) {
                            // The operator needs to be changed, call replaceOperator
                            replaceOperator();
                        } else {
                            // The operator is still valid, use it
                            //console.log('Operator:', operator);

                            // Calculate the delay until the nextChange time in milliseconds
                            var delay = nextChange - now;
                            //console.log('Delay until next change:', delay);

                            // Schedule the operator replacement
                            setTimeout(replaceOperator, delay);
                        }
                    } else {
                        // nextChange property doesn't exist, call replaceOperator
                        replaceOperator();
                    }
                });
        });
}
function replaceOperator() {
    // Get the server time
    fetch('serverTime.php')
        .then(response => response.text())
        .then(serverTime => {
            var now = new Date(serverTime);

            // Load the operators from the JSON file
            fetch('operators.json')
                .then(response => response.json())
                .then(operators => {
                    // Get a random operator
                    var newOperator = operators[Math.floor(Math.random() * operators.length)];

                    // Add a timestamp for the next change
                    var nextChange = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
                    if (now > nextChange) {
                        nextChange.setDate(nextChange.getDate() + 1);
                    }
                    newOperator.nextChange = nextChange;

                    console.log('New operator:', newOperator); // Add this line

                    // Wrap the new operator in an array
                    var newOperatorArray = [newOperator];

                    // Convert the new operator array to a JSON string
                    var jsonString = JSON.stringify(newOperatorArray);

                    // Send the JSON string to a server-side script to save it back to the JSON file
                    fetch('saveOperators.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: jsonString,
                    });
                });
        });
}
