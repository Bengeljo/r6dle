//import operators from './operators.json' with {type:'json'}
import {operators} from './main.js';
import { getGuessedOperators } from './main.js';
let lowerCaseGuessedOperators
let matchingNames
window.addEventListener('guessedOperatorsLoaded', function() {
    // Now you can access the loaded guessedOperators
    console.log('autocomplete is ready');

// Get a list of operator names
let availableNames = operators.map(operator => operator.name);
let usedNames = []; // List of used names
window.addEventListener('clearUsedNames', function() {
  usedNames = [];
  return usedNames
}); 
const autoBox = document.querySelector(".auto-box");
const inputBox = document.getElementById("inputField");

var nameMapping = {
    'Jäger': 'Jager',
    'Nøkk': 'Nokk',
    'Capitão': 'Capitao',
    'Tubarão': 'Tubarao'
  };
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
      // Filter the names based on the input value and exclude used names
      
      lowerCaseGuessedOperators = getGuessedOperators().map(operator => operator.toLowerCase());
      matchingNames = availableNames.filter(name => {
        // Get the name without special characters
        var nameWithoutSpecialCharacters = nameMapping[name] || name;
  
        return (
          (name.toLowerCase().startsWith(inputValue.toLowerCase()) ||
          nameWithoutSpecialCharacters.toLowerCase().startsWith(inputValue.toLowerCase())) &&
          !usedNames.includes(name.toLowerCase()) &&
          !lowerCaseGuessedOperators.includes(name.toLowerCase())
        );
      });
  
      display(matchingNames);
    } else {
      // Clear the autoBox when the input field is empty
      autoBox.innerHTML = '';
    }
  });
}

function display(result){
    const content = result.map(name => `<li class="operator-suggestion" onclick="selectInput(this)"><img src="../images/r6s-operators-badge-${name.toLowerCase()}.png" class="operator-image">${name}</li>`).join('');
    autoBox.innerHTML = `<ul>${content}</ul>`;
}

window.selectInput = function(list) {
    inputField.value = list.textContent; // Use textContent instead of innerHTML
    autoBox.innerHTML = '';
    usedNames.push(list.textContent.toLowerCase()); // Add the used name to the list
}
});