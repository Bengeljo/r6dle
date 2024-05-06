let randomMap
let randomFloor
let randomRoom
let zIndex = 1;
async function selectRandomImage() {
    // Get the list of maps
    const mapsResponse = await fetch('https://organic-dollop-pq76pjpvg99f4p5-3000.app.github.dev/mapMode/maps.json');
    const maps = await mapsResponse.json();

    // Select a random map
    const randomMapIndex = Math.floor(Math.random() * maps.length);
    randomMap = maps[randomMapIndex];

    // Select a random floor
    const floors = randomMap.floors;
    const randomFloorIndex = Math.floor(Math.random() * floors.length);
    randomFloor = floors[randomFloorIndex];

    // Select a random room from the selected floor
    const rooms = randomMap[randomFloor.toLowerCase().replace(' ','')].filter(room => room !== 'Background');
    const randomRoomIndex = Math.floor(Math.random() * rooms.length);
    randomRoom = rooms[randomRoomIndex];
    const image = `${randomFloor.toLowerCase().replace(' ','')}.${randomRoom.toLowerCase().replace(' ','_').replace(' ','_').replace(' ','_')}.png`;

    console.log(`Selected map: ${randomMap.name}`);
    console.log(`Selected floor: ${randomFloor}`);
    console.log(`Selected room: ${randomRoom}`);
    
    // In Ihrem JavaScript:
    let box = document.getElementById('mapImageBox');
    let img = document.createElement('img');
    img.src = `https://organic-dollop-pq76pjpvg99f4p5-3000.app.github.dev/images/maps/${randomMap.name.toLowerCase()}/${image}`;
    img.style.filter = 'sepia(100%) saturate(600%) hue-rotate(107deg)';
    img.style.position = 'relative';
    img.style.zIndex = 100;
    img.className = 'mapImages'
    box.appendChild(img);
}   
async function fillDropdowns() {
    // Get the list of maps
    const mapsResponse = await fetch('https://organic-dollop-pq76pjpvg99f4p5-3000.app.github.dev/mapMode/maps.json');
    const maps = await mapsResponse.json();

    const mapSelect = document.getElementById('mapSelect');
    const floorSelect = document.getElementById('floorSelect');
    const roomSelect = document.getElementById('roomSelect');

    // Set initial option text
    mapSelect.innerHTML = '<option value="">Pick a map</option>';
    floorSelect.innerHTML = '<option value="">Pick a floor</option>';
    roomSelect.innerHTML = '<option value="">Pick a room</option>';

    // Fill the map dropdown
    maps.forEach(map => {
        const option = document.createElement('option');
        option.value = map.name;
        option.text = map.name;
        mapSelect.appendChild(option);
    });

    // When a map is selected, fill the floor dropdown
    mapSelect.addEventListener('change', () => {
        // Clear the floor and room dropdowns
        floorSelect.innerHTML = '<option value="">Pick a floor</option>';
        roomSelect.innerHTML = '<option value="">Pick a room</option>';

        const selectedMap = maps.find(map => map.name === mapSelect.value);

        // Fill the floor dropdown
        selectedMap.floors.forEach(floor => {
            const option = document.createElement('option');
            option.value = floor;
            option.text = floor;
            floorSelect.appendChild(option);
        });
    });

    // When a floor is selected, fill the room dropdown
    floorSelect.addEventListener('change', () => {
        // Clear the room dropdown
        roomSelect.innerHTML = '<option value="">Pick a room</option>';

        const selectedMap = maps.find(map => map.name === mapSelect.value);
        const selectedFloor = floorSelect.value.toLowerCase().replace(' ', '');
        const selectedFloorRooms = selectedMap[selectedFloor];

        // Fill the room dropdown
        selectedFloorRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room;
            option.text = room;
            roomSelect.appendChild(option);
        });
    });
}
function checkSelections() {
    // Get the selected values from the dropdown menus
    const mapSelect = document.getElementById('mapSelect');
    const floorSelect = document.getElementById('floorSelect');
    const roomSelect = document.getElementById('roomSelect');
    let box = document.getElementById('mapImageBox');
    let img = document.createElement('img');
    img.src = `https://organic-dollop-pq76pjpvg99f4p5-3000.app.github.dev/images/maps/${randomMap.name.toLowerCase()}/${randomFloor.toLowerCase().replace(' ','')}.background.png`;
    img.className = 'mapImages'
    img.style.zIndex = zIndex;
    img.style.position = 'absolute';
    let button = document.getElementById('checkButton');

    // Check if the selected map matches the random map
    if (mapSelect.value === randomMap.name) {
        console.log("The selected map matches the random map!");
        mapSelect.disabled = true; // Lock the map select
        if(floorSelect.value === randomFloor){
            console.log("The selected floor matches the random floor!");
            floorSelect.disabled = true; // Lock the floor select
            if(roomSelect.value === randomRoom){
                console.log("The selected room matches the random room!");
                roomSelect.disabled = true; // Lock the room select
                console.log('Congratulations! You have won!')
                button.disabled = true;
                button.className = "btn btn-success"
                button.innerHTML = "You won!"
                box.appendChild(img);
                let background = document.getElementById('backgroundImg')
                background.style.backgroundColor = 'rgb(0 152 0 / 70%)'
            } else {
                console.log("The selected room does not match the room we are looking for!");
                selectRandomHint().catch(console.error);
            }
        } else {
            console.log("The selected floor does not match the floor we are looking for!");
            selectRandomHint().catch(console.error);
        }
    } else {
        console.log("The selected map does not match the map we are looking for!");
        selectRandomHint().catch(console.error);
    }

    // Log the selected values
    console.log(`Selected map: ${mapSelect.value}`);
    console.log(`Selected floor: ${floorSelect.value}`);
    console.log(`Selected room: ${roomSelect.value}`);
}
let selectedRooms = new Set();
async function selectRandomHint(){
    /// Select a random room from the selected floor
    let image
    const rooms = randomMap[randomFloor.toLowerCase().replace(' ','')].filter(room => room !== 'Background');
    let hintRandomRoomIndex = Math.floor(Math.random() * rooms.length);
    let hintRandomRoom = rooms[hintRandomRoomIndex];
    console.log(selectedRooms.size)
    console.log(rooms.length)
    console.log(selectedRooms.size != (rooms.length - 1) )
    if (selectedRooms.size != (rooms.length - 1) ){
        while (hintRandomRoom === randomRoom || selectedRooms.has(hintRandomRoom)){
            hintRandomRoomIndex = Math.floor(Math.random() * rooms.length);
            hintRandomRoom = rooms[hintRandomRoomIndex];
        }
        selectedRooms.add(hintRandomRoom);
        image = `${randomFloor.toLowerCase().replace(' ','')}.${hintRandomRoom.toLowerCase().replace(' ','_').replace(' ','_').replace(' ','_')}.png`;
    } else {
        image = `${randomFloor.toLowerCase().replace(' ','')}.background.png`;
    }
    
    

    console.log(`Selected map: ${randomMap.name}`);
    console.log(`Selected floor: ${randomFloor}`);
    console.log(`Selected room: ${randomRoom}`);
    
    // In Ihrem JavaScript:
    let box = document.getElementById('mapImageBox');
    let img = document.createElement('img');
    img.src = `https://organic-dollop-pq76pjpvg99f4p5-3000.app.github.dev/images/maps/${randomMap.name.toLowerCase()}/${image}`;
    img.className = 'mapImages'
    img.style.zIndex = zIndex;
    img.style.position = 'absolute';
    zIndex++;
    box.appendChild(img);
}

// Attach the function to the button click event
window.onload = async function () {
    selectRandomImage().catch(console.error);
    fillDropdowns().catch(console.error);
    await document.getElementById('checkButton').addEventListener('click', checkSelections);
}