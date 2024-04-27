
//import operators from './operators.json' with {type:'json'}
import {weapons} from './guessWeapon.js';
import { getGuessedWeapons } from './guessWeapon.js';
let lowerCaseGuessedWeapons
let matchingWeapons
window.addEventListener('guessedWeaponsLoaded', function() {
    // Now you can access the loaded guessedWeapons
    console.log('autocomplete is ready');

// Get a list of weapons
let availableWeapons = weapons.map(weapon => weapon.name);
let usedWeapons = []; // List of used weapons
window.addEventListener('clearUsedWeapons', function() {
  usedWeapons = [];
  return usedWeapons
}); 
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
  
    // Only display the matching weapons if the input field is not empty
    if (inputValue !== '') {
      // Filter the weapons based on the input value and exclude used weapons
      
      lowerCaseGuessedWeapons = getGuessedWeapons().map(weapon => weapon.toLowerCase());
      matchingWeapons = availableWeapons.filter(weapon => {
        // Get the weapon without special characters
        
  
        return (
          (weapon.toLowerCase().startsWith(inputValue.toLowerCase())) &&
          !usedWeapons.includes(weapon.toLowerCase()) &&
          !lowerCaseGuessedWeapons.includes(weapon.toLowerCase())
        );
      });
  
      display(matchingWeapons);
    } else {
      // Clear the autoBox when the input field is empty
      autoBox.innerHTML = '';
    }
  });
}

function display(result){
  const content = result.map(weapon => `<li class="operator-suggestion" onclick="selectInput(this)"><img src="../images/weapons/${weapon.toLowerCase()}.avif" class="weapon-image">${weapon}</li>`).join('');
    autoBox.innerHTML = `<ul>${content}</ul>`;
}

window.selectInput = function(list) {
    inputField.value = list.textContent; // Use textContent instead of innerHTML
    autoBox.innerHTML = '';
    usedWeapons.push(list.textContent.toLowerCase()); // Add the used name to the list
}
});
