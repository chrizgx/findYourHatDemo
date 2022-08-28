import { Field, hat, hole, fieldCharacter, pathCharacter } from './gameLogic.js';

/* App Configuration */
const moveOptions = ['u', 'r', 'd', 'l'];

const displayMessage = document.getElementById('displayMessage');
const displayResult = document.getElementById('displayResult');
const gameGrid = document.getElementById('gameGrid')

//Set grid cell size in pixels
const gridPixels = 25;
document.querySelector(':root').style.setProperty('--grid-px', `${gridPixels}px`);

let myField;
let gameActive;
let colorTableInterval;

/* Old Version of createTable that does NOT animate table creation. Could be used in future versions.

function createTable() {
    let output = '';

    for (let i = 0; i < length; i++) {
        gameGrid.innerHTML += '<tr>';
        for (let j = 0; j < length; j++) {
            gameGrid.innerHTML += `<td id="_${i}_${j}">${myField.field[i][j]}</td>`;
        }
        gameGrid.innerHTML += '</tr>';
    }
    return output;
}*/

//Generate table based on myField.field
//This function includes animation
function createTable() {
    for (let i = 0; i < length; i++) {
        gameGrid.innerHTML += `<tr id="_${i}"></tr>`
        for (let j = 0; j < length; j++) {
            setTimeout(() => {document.getElementById(`_${i}`).innerHTML += `<td><span id="${i}_${j}">${myField.field[i][j]}</span></td>`;}, 40*i + 20*j)
        }
    }
    //console.log(myField.print())
}

function removeTable() {
    for (let i = length - 1; i >= 0; i--) {
        for (let j = 0; j < length ; j++) {
            setTimeout(() => {document.getElementById(`${i}_${j}`).parentNode.classList.add('transparent')}, 40*i + 20*j);
            setTimeout(() => {document.getElementById(`${i}_${j}`).parentNode.remove()},  70*length + 20*i + 10*j);
        }
    }
}

/*function colorTable(className, spanClassName) {
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            setTimeout(() => {
                document.getElementById(`${i}_${j}`).parentElement.classList.add(className)

                if (i == myField.location.y && j == myField.location.x) {
                    document.getElementById(`${i}_${j}`).classList.add(spanClassName);
                }
            }, 40*i + 20*j)
        }
    }
}*/

function colorTable(className, spanClassName, time=100) {

    let removeClassName, addClassName;

    function mainProcess(i, j, addClassName, removeClassName) {
        document.getElementById(`${i}_${j}`).parentElement.classList.remove(`${removeClassName}-border`);
        document.getElementById(`${i}_${j}`).parentElement.classList.add(`${addClassName}-border`);

        if (i == myField.location.y && j == myField.location.x) {
            document.getElementById(`${i}_${j}`).classList.remove(addClassName)
            document.getElementById(`${i}_${j}`).classList.add(removeClassName);
        }
    }

    if (document.getElementById(`0_0`).parentElement.classList.contains(`${className}-border`)) {
        removeClassName = `${className}`;
        addClassName = `${className}-alt`;
    } else {
        removeClassName = `${className}-alt`;
        addClassName = `${className}`;
    }

    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
            setTimeout(mainProcess, time*i + time/2*j, i, j, addClassName, removeClassName)
        }
    }
}

function play(key) {
    myField.updateLocationLand(fieldCharacter); //Reset current set to empty
    myField.updateLocation(key); //Move to new location based on which arrow button was pressed

    let message; //Message to display
    let result; //Won or Lost
    let className; //class to be added based on action's result (Green for Win, Red for Loss)
    let locationLandName = myField.getLocationLandName()

    switch (locationLandName) {
        case 'available':
            myField.updateLocationLand(pathCharacter);
            break;
        case 'hole':
            console.log('Oh no... you fell in a hole!');
            message = 'Oh no... you fell in a hole!';
            result = 'You lost.';
            className = 'loss';
            gameActive = false;
            break;
        case 'outside':
            console.log('You stepped in enemy\' s territory! Be careful next time.');
            message = 'You stepped in enemy\' s territory! Be careful next time.';
            result = 'You lost.';
            className = 'loss';
            gameActive = false;
            break;
        case 'hat':
            console.log('Great! You found the special hat!');
            message = 'Great! You found the special hat!';
            result = 'You Won!';
            className = 'win';
            gameActive = false;
            break;
    }


    if (!gameActive) {
        document.removeEventListener("keydown", respondToArrowClick);
        displayMessage.innerText = message;
        displayResult.innerText = result;

        displayResult.classList.add(className);

        colorTableInterval = setInterval(colorTable, length*150, className, className, 100);

        setTimeout(() => {$('#displayMessage').slideToggle(700)}, 200 + length*50 + 200);
        setTimeout(() => {$('#displayResult').slideToggle(400)}, 0 + length*50 + 200);

        document.addEventListener("keydown", respondToSpaceClick);

        //document.getElementById(`${myField.location.y}_${myField.location.x}`).classList.add(className);
    }
}

function respondToArrowClick(event) {
    console.log(event)
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) {
        play(event.key);
    }
}

function respondToSpaceClick(event) {
    console.log(event);

    if (event.key === " ") {
        gameRestart();
    }
}

function gameSetup() {
    length = Number(prompt('Set field size (5-20)', '5'));

    $("#displayMessage").hide();
    $("#displayResult").hide();

    if (!length || length < 5 || length > 40) {
        location.reload();
    } else {
        gameActive = true;
        myField = new Field(Field.fieldGenerator(length));
        createTable();
        document.addEventListener("keydown", respondToArrowClick);
    }
}

function gameRestart() {
    document.removeEventListener("keydown", respondToSpaceClick)
    clearInterval(colorTableInterval)
    setTimeout(removeTable, 500);

    setTimeout(gameSetup, 2800)
}

gameSetup()