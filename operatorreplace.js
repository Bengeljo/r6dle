
export function scheduleOperatorReplacement() {
    // Get the current date and time
    var now = new Date();

    // Create a new date object for 23:08 today
    var targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 11, 0);

    // If it's already past 23:08, schedule for 23:08 tomorrow
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    // Calculate the delay until 23:08 in milliseconds
    var delay = targetTime - now;
    console.log('Delay until 23:09:', delay); // Add this line

    // Schedule the operator replacement
    setTimeout(replaceOperator, delay);
}
function replaceOperator() {
    // Load the operators from the JSON file
    fetch('operators.json')
        .then(response => response.json())
        .then(operators => {
            // Get a random operator
            var newOperator = operators[Math.floor(Math.random() * operators.length)];
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
}