export let weapons
let guessedWeapons = []
let guessedWeaponsHmtl = []
let maxDamage = 135;
let maxMobility = 50;
let maxMagSize = 150;
let maxFireRate = 1270;
let guesses = 0;
let selectedWeapon
let hint = 1;

window.onload = async function () {
    const weaponsResponse = await fetch('./weapons.json')
    const weaponsData = await weaponsResponse.json()
    weapons = weaponsData
    selectedWeapon = await randomWeapon()
    setDmgBar(selectedWeapon);
    setMobBar(selectedWeapon);
    setFireRateBar(selectedWeapon);
    setMagSize(selectedWeapon)
    askForGuess();
    window.dispatchEvent(new Event('guessedWeaponsLoaded'));
}


function randomWeapon() {
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)]
    return randomWeapon
}

async function guessWeapon(weapon) {
    guesses++
    console.log(guesses)
    console.log(weapon === selectedWeapon.name)
    if (guesses == 3) {
        showHint1();
        hint++;
    } else if (guesses == 6) {
        showHint2();
    }
    if (weapon === selectedWeapon.name) {
        console.log('You won!')

        let gWeapon = await weapons.find(w => w.name === weapon)

        setHintDmgBar(gWeapon)
        setHintMobBar(gWeapon);
        setHintFireRateBar(gWeapon);
        setHintMagSize(gWeapon)
        displayWinningScreen();
        return true
    } else {
        // Add the guessed weapon to the array
        guessedWeaponsHmtl.push(weapon);

        let gWeapon = await weapons.find(w => w.name === weapon)

        //show hint bars
        setHintDmgBar(gWeapon)
        setHintMobBar(gWeapon);
        setHintFireRateBar(gWeapon);
        setHintMagSize(gWeapon)

        // Get the element where you want to display the guessed weapons
        let guessedWeaponsElement = document.getElementById('guessed_weapons');
        let nextHintElement = document.getElementById('nextHint')
        let weaponsName = document.createElement('div');
        guessedWeaponsElement.className = 'hints-colors'
        guessedWeaponsElement.innerHTML = 'Guessed Weapons: '
        guessedWeaponsElement.appendChild(weaponsName);
        nextHintElement.className = 'hints-colors';
        nextHintElement.innerHTML = `Wrong guesses until next hint: ${3 * hint - guesses}`
        // Update the innerHTML of the guessed weapons element with the guessed weapons
        weaponsName.innerHTML = guessedWeaponsHmtl.join(', ');
        guessedWeaponsElement.style.display = 'block'

        return false
    }
}

function showHint1() {
    let hints = document.getElementById('hints');
    let hint1 = document.createElement('div');
    hint1.className = 'hints-colors hint1'
    hint1.innerHTML = 'Hint 1: This weapon is a ' + selectedWeapon.type;
    hints.appendChild(hint1);
}

function showHint2() {
    let hints = document.getElementById('hints');
    let hint2 = document.createElement('div');
    hint2.innerHTML = 'Hint 2: This weapon is used by ';
    hint2.className = 'hint2 hints-colors'
    let squarecontainer = document.createElement('div');
    squarecontainer.className = 'square-container'


    // Iterate over the operators and create a new element for each one
    selectedWeapon.available_on.forEach(operator => {
        let operatorElement = document.createElement('div');
        operatorElement.className = 'square animate__animated animate__flipInY';
        let img = document.createElement('img');
        img.src = `../images/r6s-operators-badge-${operator.toLowerCase()}.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        operatorElement.appendChild(img);
        squarecontainer.appendChild(operatorElement);
    });

    hint2.appendChild(squarecontainer);
    hints.appendChild(hint2);
}


function askForGuess() {
    // Get the button element
    var submitButton = document.getElementById('submitButton');
    // Create an array of operator names
    var weaponNames = weapons.map(function (weapons) {
        return weapons.name;
    });
    // Get the input field element
    var autobox = document.querySelector(".auto-box");

    // Add a click event listener to the input field
    autobox.addEventListener('click', function () {
        // Get the input field element
        var inputField = document.getElementById('inputField');
        // Select the input field content
        inputField.select();

        // Get the input field value
        var userInput = inputField.value;

        // Check if the operator has already been guessed or empty or does not exist
        if (guessedWeapons.includes(userInput) || userInput === "") {
            console.log('This weapon has already been guessed.');
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!weaponNames.includes(userInput)) {
            console.log('This weapon does not exist.');
            return;
        }

        // Add the operator to the array of guessed operators
        guessedWeapons.push(userInput);
        console.log(userInput)
        // Now you can use the userInput value in your code
        guessWeapon(userInput);
    });

    // Add a click event listener to the button
    submitButton.addEventListener('click', function () {
        // Get the input field value
        var userInput = inputField.value;

        // Check if the operator has already been guessed or empty or does not exist
        if (guessedWeapons.includes(userInput) || userInput === "") {
            console.log('This weapon has already been guessed.');
            return; // Exit the function early
        } else if (userInput === "") {
            console.log('InputField was empty.');
            return;
        } else if (!weaponNames.includes(userInput)) {
            console.log('This weapon does not exist.');
            return;
        }

        // Add the operator to the array of guessed operators
        guessedWeapons.push(userInput);
        console.log(userInput)
        // Now you can use the userInput value in your code
        guessWeapon(userInput);
    });
}
function setDmgBar(selectedWeapon) {
    // Create div elements for the stats bar
    let statsBar = document.getElementById('stats_bar');
    let divBar = document.createElement('div');
    let divName = document.createElement('div');
    let progress = document.createElement('div');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create the damage bar
    divBar.id = 'damage_bar';
    divBar.className = 'stats_row';
    divName.className = 'stats_name';
    divName.innerHTML = 'Damage: ';
    progress.className = 'progress';
    progress.id = 'dmgProgress';
    progressValue.className = 'progress-value';
    let weaponValue = selectedWeapon.damage / maxDamage * 100;
    progressValue.innerHTML = selectedWeapon.damage
    progressStyle.innerHTML = '@keyframes dmgLoad {0% {width: 0;} 100% {width: ' + weaponValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'dmgLoad 3s normal forwards';
    progress.appendChild(progressValue);
    divBar.appendChild(divName);
    divBar.appendChild(progress);
    statsBar.appendChild(divBar);
}

function setHintDmgBar(guessedWeapon) {
    //check if there is an hint bar
    let exist = document.getElementById('dmgHint')
    if(exist){
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('dmgProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the damage bar
    if(guessedWeapon.damage > selectedWeapon.damage + 5){
        progressValue.className = 'progress-layer-bottom background-red';
    } else if(guessedWeapon.damage < selectedWeapon.damage - 5){
        progressValue.className = 'progress-layer-top background-red';
    } else if(guessedWeapon.damage > selectedWeapon.damage){
        progressValue.className = 'progress-layer-bottom background-yellow';
    } else if(guessedWeapon.damage < selectedWeapon.damage){
        progressValue.className = 'progress-layer-top background-yellow';
    } else {
        progressValue.className = 'progress-layer-top background-green';
    }
    
    let weaponValue = guessedWeapon.damage / maxDamage * 100;

    progressValue.innerHTML = guessedWeapon.damage
    progressValue.id = 'dmgHint'
    progressStyle.innerHTML = `@keyframes dmgLoadHint {0% {width: 0;} 100% {width: ${weaponValue}%;}}`;
    document.head.appendChild(progressStyle);
    progressValue.style.animation = `dmgLoadHint 3s normal forwards`;
    progress.appendChild(progressValue);
}

function setMobBar(selectedWeapon) {
    // Create div elements for the stats bar
    let statsBar = document.getElementById('stats_bar');
    let divBar = document.createElement('div');
    let divName = document.createElement('div');
    let progress = document.createElement('div');
    progress.id = 'mobProgress';
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');
    // Create the mobility bar
    divBar.id = 'mobility_bar';
    divBar.className = 'stats_row';
    divName.className = 'stats_name';
    divName.innerHTML = 'Mobility: ';
    progress.className = 'progress';
    progressValue.className = 'progress-value';
    let mobilityValue = selectedWeapon.mobility / maxMobility * 100;
    progressValue.innerHTML = selectedWeapon.mobility
    progressStyle.innerHTML = '@keyframes mobLoad {0% {width: 0;} 100% {width: ' + mobilityValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'mobLoad 3s normal forwards';
    progress.appendChild(progressValue);
    divBar.appendChild(divName);
    divBar.appendChild(progress);
    statsBar.appendChild(divBar);
}

function setHintMobBar(guessedWeapon) {
    //check if there is an hint bar
    let exist = document.getElementById('mobHint')
    if(exist){
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('mobProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the mobility bar
    if(guessedWeapon.mobility > selectedWeapon.mobility + 5){
        progressValue.className = 'progress-layer-bottom background-red';
    } else if(guessedWeapon.mobility < selectedWeapon.mobility - 5){
        progressValue.className = 'progress-layer-top background-red';
    } else if(guessedWeapon.mobility > selectedWeapon.mobility){
        progressValue.className = 'progress-layer-bottom background-yellow';
    } else if(guessedWeapon.mobility < selectedWeapon.mobility){
        progressValue.className = 'progress-layer-top background-yellow';
    } else {
        progressValue.className = 'progress-layer-top background-green';
    }

    // Create the mobility bar
    progressValue.id = 'mobHint';
    let mobilityValue = guessedWeapon.mobility / maxMobility * 100;
    progressValue.innerHTML = guessedWeapon.mobility
    progressStyle.innerHTML = '@keyframes mobLoadHint {0% {width: 0;} 100% {width: ' + mobilityValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'mobLoadHint 3s normal forwards';
    progress.appendChild(progressValue);
}

function setFireRateBar(selectedWeapon) {
    // Create div elements for the stats bar
    let statsBar = document.getElementById('stats_bar');
    let divBar = document.createElement('div');
    let divName = document.createElement('div');
    let progress = document.createElement('div');
    progress.id = 'fireRateProgress';
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');
    // Create the fire rate bar
    divBar.id = 'fireRate_bar';
    divBar.className = 'stats_row';
    divName.className = 'stats_name';
    divName.innerHTML = 'Fire Rate: ';
    progress.className = 'progress';
    progressValue.className = 'progress-value';
    let fireRateValue = selectedWeapon.fireRate / maxFireRate * 100;
    progressValue.innerHTML = selectedWeapon.fireRate
    progressStyle.innerHTML = '@keyframes fireRateLoad {0% {width: 0;} 100% {width: ' + fireRateValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'fireRateLoad 3s normal forwards';
    progress.appendChild(progressValue);
    divBar.appendChild(divName);
    divBar.appendChild(progress);
    statsBar.appendChild(divBar);
}

function setHintFireRateBar(guessedWeapon) {
    //check if there is an hint bar
    let exist = document.getElementById('fireRateHint')
    if(exist){
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('fireRateProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the fire rate bar
    if(guessedWeapon.fireRate > selectedWeapon.fireRate + 50){
        progressValue.className = 'progress-layer-bottom background-red';
    } else if(guessedWeapon.fireRate < selectedWeapon.fireRate - 50){
        progressValue.className = 'progress-layer-top background-red';
    } else if(guessedWeapon.fireRate > selectedWeapon.fireRate){
        progressValue.className = 'progress-layer-bottom background-yellow';
    } else if(guessedWeapon.fireRate < selectedWeapon.fireRate){
        progressValue.className = 'progress-layer-top background-yellow';
    } else {
        progressValue.className = 'progress-layer-top background-green';
    }


    // Create the fire rate bar
    progressValue.id = "fireRateHint";
    let fireRateValue = guessedWeapon.fireRate / maxFireRate * 100;
    progressValue.innerHTML = guessedWeapon.fireRate
    progressStyle.innerHTML = '@keyframes fireRateLoadHint {0% {width: 0;} 100% {width: ' + fireRateValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'fireRateLoadHint 3s normal forwards';
    progress.appendChild(progressValue);
}

function setMagSize(selectedWeapon) {
    // Create div elements for the stats bar
    let statsBar = document.getElementById('stats_bar');
    let divBar = document.createElement('div');
    let divName = document.createElement('div');
    let progress = document.createElement('div');
    progress.id = 'magSizeProgress';
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create the fire rate bar
    divBar.id = 'magSize_bar';
    divBar.className = 'stats_row';
    divName.className = 'stats_name';
    divName.innerHTML = 'Mag Size: ';
    progress.className = 'progress';
    progressValue.className = 'progress-value';
    let magSizeValue = selectedWeapon.magsize / maxMagSize * 100;
    progressValue.innerHTML = selectedWeapon.magsize
    progressStyle.innerHTML = '@keyframes magSizeLoad {0% {width: 0;} 100% {width: ' + magSizeValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'magSizeLoad 3s normal forwards';
    progress.appendChild(progressValue);
    divBar.appendChild(divName);
    divBar.appendChild(progress);
    statsBar.appendChild(divBar);
}

function setHintMagSize(guessedWeapon) {
    //check if there is an hint bar
    let exist = document.getElementById('magSizeHint')
    if(exist){
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('magSizeProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the fire rate bar
    if(guessedWeapon.magsize > selectedWeapon.magsize + 5){
        progressValue.className = 'progress-layer-bottom background-red';
    } else if(guessedWeapon.magsize < selectedWeapon.magsize - 5){
        progressValue.className = 'progress-layer-top background-red';
    } else if(guessedWeapon.magsize > selectedWeapon.magsize){
        progressValue.className = 'progress-layer-bottom background-yellow';
    } else if(guessedWeapon.magsize < selectedWeapon.magsize){
        progressValue.className = 'progress-layer-top background-yellow';
    } else {
        progressValue.className = 'progress-layer-top background-green';
    }

    // Create the fire rate bar
    progressValue.id = "magSizeHint";
    let magSizeValue = guessedWeapon.magsize / maxMagSize * 100;
    progressValue.innerHTML = guessedWeapon.magsize
    progressStyle.innerHTML = '@keyframes magSizeLoadHint {0% {width: 0;} 100% {width: ' + magSizeValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'magSizeLoadHint 3s normal forwards';
    progress.appendChild(progressValue);
}

function displayWinningScreen() {
    // Get the endId element
    let endId = document.getElementById('endId');

    // Create the finished div
    let finishedDiv = document.createElement('div');
    finishedDiv.className = 'finished';

    // Create the empty div
    let emptyDiv = document.createElement('div');

    // Create the background-end div
    let backgroundEndDiv = document.createElement('div');
    backgroundEndDiv.className = 'background-end';

    // Create the gg div
    let ggDiv = document.createElement('div');
    ggDiv.className = 'gg';
    ggDiv.innerHTML = 'gg wp';

    // Create the gg-answer div
    let ggAnswerDiv = document.createElement('div');
    ggAnswerDiv.className = 'gg-answer';

    // Create the first inner div
    let firstInnerDiv = document.createElement('div');
    // Create the img
    let img = document.createElement('img');
    img.width = 60;
    img.height = 60;
    img.className = "gg-icon";
    img.className = "gg-icon";
    var operatorName = selectedWeapon.name;
    img.src = `https://cdn.7tv.app/emote/661ad39445829b469d8d2975/4x.webp`;
    firstInnerDiv.appendChild(img);



    // Create the second inner div
    let secondInnerDiv = document.createElement('div');

    // Create the gg-you span
    let ggYouSpan = document.createElement('span');
    ggYouSpan.className = 'gg-you';
    ggYouSpan.innerHTML = 'You guessed';
    secondInnerDiv.appendChild(ggYouSpan); // Append the gg-you span to the second inner div

    // Create the br
    let br = document.createElement('br');
    secondInnerDiv.appendChild(br); // Append the br to the second inner div

    // Create the gg-name div
    let ggNameDiv = document.createElement('div');
    ggNameDiv.className = 'gg-name';
    ggNameDiv.innerHTML = selectedWeapon.name; // Replace with the actual operator name
    secondInnerDiv.appendChild(ggNameDiv); // Append the gg-name div to the second inner div


    // Create the nthtries div
    let nthTriesDiv = document.createElement('div');
    nthTriesDiv.className = 'nthtries';
    nthTriesDiv.innerHTML = 'Number of tries: ';

    // Create the nth span
    let nthSpan = document.createElement('span');
    nthSpan.className = 'nth';
    nthSpan.innerHTML = guesses


    let button = document.createElement('button')
    button.className = 'de_button'
    button.innerHTML = 'Restart'
    button.id = 'restartButton'

    // Append the elements to their parents
    ggAnswerDiv.appendChild(firstInnerDiv);
    ggAnswerDiv.appendChild(secondInnerDiv);
    backgroundEndDiv.appendChild(ggDiv);
    backgroundEndDiv.appendChild(ggAnswerDiv);
    backgroundEndDiv.appendChild(nthTriesDiv);
    backgroundEndDiv.appendChild(button)
    nthTriesDiv.appendChild(nthSpan);
    emptyDiv.appendChild(backgroundEndDiv);
    finishedDiv.appendChild(emptyDiv);
    endId.appendChild(finishedDiv);
    restartButton();
}
function restartButton() {
    // Get the button element
    var restartButton = document.getElementById('restartButton');

    // Check if the button exists
    if (restartButton) {
        // Add a click event listener to the button
        restartButton.addEventListener('click', function () {
            guessedWeapons = []
            selectedWeapon = randomWeapon()
            guesses = 0
            clear()
            console.log(selectedWeapon);
            setDmgBar(selectedWeapon);
            setMobBar(selectedWeapon);
            setFireRateBar(selectedWeapon);
            setMagSize(selectedWeapon)
            askForGuess();
            var event = new CustomEvent('clearUsedWeapons');
            window.dispatchEvent(event);
        });
    }
}
function clear() {
    let endId = document.getElementById('endId')
    let statsBar = document.getElementById('stats_bar')
    let hints = document.getElementById('hints')
    let guessedWeapons = document.getElementById('guessed_weapons')
    let guessedWeaponsElement = document.getElementById('guessed_weapons');
    statsBar.innerHTML = ''
    endId.innerHTML = ''
    hints.innerHTML = ''
    guessedWeapons.innerHTML = ''
    guessedWeapons = []
    guessedWeaponsHmtl = []
    guessedWeaponsElement.innerHTML = ''
    guessedWeaponsElement.style.display = 'contents'

}
export function getGuessedWeapons() {
    if (guessedWeapons === null) {
        guessedWeapons = [];
    }
    return guessedWeapons;
}   
