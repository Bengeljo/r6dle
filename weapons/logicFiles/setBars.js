import { getSelectedWeapon } from "../main.js";
import { maxDamage, maxFireRate, maxMagSize, maxMobility } from "./maxStats.js"

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
    progress.className = 'myProgress';
    progress.id = 'dmgProgress';
    progressValue.className = 'myProgress-value';
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
    const selectedWeapon = getSelectedWeapon()

    //check if there is an hint bar
    let exist = document.getElementById('dmgHint')
    if (exist) {
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('dmgProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the damage bar
    if (guessedWeapon.damage > selectedWeapon.damage + 5) {
        progressValue.className = 'myProgress-layer-bottom background-red';
    } else if (guessedWeapon.damage < selectedWeapon.damage - 5) {
        progressValue.className = 'myProgress-layer-top background-red';
    } else if (guessedWeapon.damage > selectedWeapon.damage) {
        progressValue.className = 'myProgress-layer-bottom background-yellow';
    } else if (guessedWeapon.damage < selectedWeapon.damage) {
        progressValue.className = 'myProgress-layer-top background-yellow';
    } else {
        progressValue.className = 'myProgress-layer-top background-green';
    }

    let weaponValue = (guessedWeapon.damage / maxDamage * 100);
    if (weaponValue > 95) {
        weaponValue *= .962
    }

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
    progress.className = 'myProgress';
    progressValue.className = 'myProgress-value';
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
    const selectedWeapon = getSelectedWeapon()

    //check if there is an hint bar
    let exist = document.getElementById('mobHint')
    if (exist) {
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('mobProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the mobility bar
    if (guessedWeapon.mobility > selectedWeapon.mobility + 5) {
        progressValue.className = 'myProgress-layer-bottom background-red';
    } else if (guessedWeapon.mobility < selectedWeapon.mobility - 5) {
        progressValue.className = 'myProgress-layer-top background-red';
    } else if (guessedWeapon.mobility > selectedWeapon.mobility) {
        progressValue.className = 'myProgress-layer-bottom background-yellow';
    } else if (guessedWeapon.mobility < selectedWeapon.mobility) {
        progressValue.className = 'myProgress-layer-top background-yellow';
    } else {
        progressValue.className = 'myProgress-layer-top background-green';
    }

    // Create the mobility bar
    progressValue.id = 'mobHint';
    let mobilityValue = (guessedWeapon.mobility / maxMobility * 100);
    if (mobilityValue > 95) {
        mobilityValue *= .962
    }
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
    progress.className = 'myProgress';
    progressValue.className = 'myProgress-value';
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
    const selectedWeapon = getSelectedWeapon()

    //check if there is an hint bar
    let exist = document.getElementById('fireRateHint')
    if (exist) {
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('fireRateProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the fire rate bar
    if (guessedWeapon.fireRate > selectedWeapon.fireRate + 50) {
        progressValue.className = 'myProgress-layer-bottom background-red';
    } else if (guessedWeapon.fireRate < selectedWeapon.fireRate - 50) {
        progressValue.className = 'myProgress-layer-top background-red';
    } else if (guessedWeapon.fireRate > selectedWeapon.fireRate) {
        progressValue.className = 'myProgress-layer-bottom background-yellow';
    } else if (guessedWeapon.fireRate < selectedWeapon.fireRate) {
        progressValue.className = 'myProgress-layer-top background-yellow';
    } else {
        progressValue.className = 'myProgress-layer-top background-green';
    }


    // Create the fire rate bar
    progressValue.id = "fireRateHint";
    let fireRateValue = (guessedWeapon.fireRate / maxFireRate * 100);
    if (fireRateValue > 95) {
        fireRateValue *= .962;
    }
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
    progress.className = 'myProgress';
    progressValue.className = 'myProgress-value';
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
    const selectedWeapon = getSelectedWeapon()

    //check if there is an hint bar
    let exist = document.getElementById('magSizeHint')
    if (exist) {
        exist.remove();
    }

    // Create div elements for the stats bar
    let progress = document.getElementById('magSizeProgress');
    let progressStyle = document.createElement('style');
    let progressValue = document.createElement('div');

    // Create style for the fire rate bar
    if (guessedWeapon.magsize > selectedWeapon.magsize + 5) {
        progressValue.className = 'myProgress-layer-bottom background-red';
    } else if (guessedWeapon.magsize < selectedWeapon.magsize - 5) {
        progressValue.className = 'myProgress-layer-top background-red';
    } else if (guessedWeapon.magsize > selectedWeapon.magsize) {
        progressValue.className = 'myProgress-layer-bottom background-yellow';
    } else if (guessedWeapon.magsize < selectedWeapon.magsize) {
        progressValue.className = 'myProgress-layer-top background-yellow';
    } else {
        progressValue.className = 'myProgress-layer-top background-green';
    }

    // Create the fire rate bar
    progressValue.id = "magSizeHint";
    let magSizeValue = (guessedWeapon.magsize / maxMagSize * 100);
    if (magSizeValue > 95) {
        magSizeValue *= .962
    }
    progressValue.innerHTML = guessedWeapon.magsize
    progressStyle.innerHTML = '@keyframes magSizeLoadHint {0% {width: 0;} 100% {width: ' + magSizeValue + '%;}}';
    document.head.appendChild(progressStyle);
    progressValue.style.animation = 'magSizeLoadHint 3s normal forwards';
    progress.appendChild(progressValue);
}

export { setDmgBar, setHintDmgBar, setFireRateBar, setHintFireRateBar, setMobBar, setHintMobBar, setMagSize, setHintMagSize}