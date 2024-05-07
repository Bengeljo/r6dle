
//import operators from './operators.json' with {type:'json'}
import { weapons } from './logicFiles/helperFunctions.js';
import { getGuessedWeapons } from './main.js';
let lowerCaseGuessedWeapons
let matchingWeapons
window.addEventListener('guessedWeaponsLoaded', function () {
  // Now you can access the loaded guessedWeapons
  console.log('autocomplete is ready');

  // Get a list of weapons
  let availableWeapons = weapons;
  let usedWeapons = []; // List of used weapons
  window.addEventListener('clearUsedWeapons', function () {
    usedWeapons = [];
    return usedWeapons
  });
  const autoBox = document.querySelector(".auto-box");
  const inputBox = document.getElementById("inputField");

  // Get the input field and results container
  let inputField = document.getElementById('inputField');
  //let resultsContainer = document.getElementById('output');



  if (inputField !== '') {
    // Add an input event listener to the input field
    inputField.addEventListener('input', () => {
      // Get the current value of the input field
      let inputValue = inputField.value;

      // Clear the results container
      //resultsContainer.innerHTML = '';

      // Only display the matching weapons if the input field is not empty
      if (inputValue !== '') {
        // Filter the weapons based on the input value and exclude used weapons
        lowerCaseGuessedWeapons = getGuessedWeapons().map(weapon => weapon.toLowerCase());


        // Filter the weapons based on the input value and exclude used weapons
        matchingWeapons = availableWeapons.filter(weapon => {
          // Check if the operator has access to the weapon
          let operatorHasAccess = weapon.available_on.map(operator => operator.toLowerCase()).includes(inputValue.toLowerCase());

          return (
            (weapon.name.toLowerCase().includes(inputValue.toLowerCase()) || operatorHasAccess) &&
            !usedWeapons.includes(weapon.name.toLowerCase()) &&
            !lowerCaseGuessedWeapons.includes(weapon.name.toLowerCase())
          );
        });

        // Dynamically generate HTML elements for the matching weapons
        matchingWeapons.forEach(weapon => {
          let weaponElement = document.createElement('div');
          weaponElement.textContent = weapon.name;
          //resultsContainer.appendChild(weaponElement);
        });
        display(matchingWeapons);
      } else {
        // Clear the autoBox when the input field is empty
        autoBox.innerHTML = '';
      }
    });
  }

  function display(result) {
    const content = result.map(weapon => `<li class="operator-suggestion" onclick="selectInput(this)"><img src="../images/weapons/${weapon.name.toLowerCase().replace('.', '_')}.avif" class="weapon-image">${weapon.name}</li>`).join('');
    console.log(result.map(weapon => weapon.name))
    autoBox.innerHTML = `<ul>${content}</ul>`;
  }

  window.selectInput = function (list) {
    inputField.value = list.textContent; // Use textContent instead of innerHTML
    autoBox.innerHTML = '';
    usedWeapons.push(list.textContent.toLowerCase()); // Add the used name to the list
  }
});
