// Call this function whenever a quiz is solved
function incrementSolvedCount() {
    fetch('../../server/datWeaponUp.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchDailyData() {
    fetch('../../server/dailyWeaponSolved.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('alreadyDailySolved').innerHTML = data + ' people already found the operator';
        })
        .catch(error => console.error('Error:', error));
}
function incrementGlobalSolved() {
    fetch('../../server/endlessWeaponUp.php')
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function fetchEndlessSolved() {
    fetch('../../server/endlessWeaponSolved.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                document.getElementById('globalSolvedEndless').innerHTML = data.globalSolvedEndless + ' times was the Endless mode solved already';
            }
        })
        .catch(error => console.error('Error:', error));
}

export { fetchDailyData, fetchEndlessSolved, incrementGlobalSolved, incrementSolvedCount }