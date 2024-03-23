import operators from './operators.json' assert{type:'json'}

    

// Get a list of operator names
let availableNames = operators.map(operator => operator.name);
const autoBox = document.querySelector(".auto-box");
const inputBox = document.getElementById("inputField");

// Get the input field and results container
let inputField = document.getElementById('inputField');
let resultsContainer = document.getElementById('output');
if(inputField !== ''){
    // Add an input event listener to the input field
    inputField.addEventListener('input', () => {
        // Get the current value of the input field
        let inputValue = inputField.value;

        // Clear the results container
        resultsContainer.innerHTML = '';
        // Only display the matching operators if the input field is not empty
        if (inputValue !== '') {
        // Filter the names based on the input value
        let matchingNames = availableNames.filter(name => 
            name.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        display(matchingNames);
        } else {
            // Clear the autoBox when the input field is empty
            autoBox.innerHTML = '';
        }
    });
}

function display(result){
    const content = result.map(name => `<li onclick="selectInput(this)">${name}</li>`).join('');
    autoBox.innerHTML = `<ul>${content}</ul>`;
}

window.selectInput = function(list) {
    inputField.value = list.innerHTML;
    autoBox.innerHTML = '';
}