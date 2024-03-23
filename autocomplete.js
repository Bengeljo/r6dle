import operators from './operators.json' assert{type:'json'}


//const operator = operators.find(op => typeof op.name[0] === 'string' && op.name[0].toLowerCase() === operatorName.toLowerCase());
//let availableNames = operator.name;

const autoBox = document.querySelector(".auto-box");
const inputBox = document.getElementById("inputField");

inputField.onkeyup = function(){
    let result = []
    let input = inputField.value;
    if(input.length){
        const operator = operators.find(op => typeof op.name[0] === 'string' && op.name[0].toLowerCase() === input.toLowerCase());
        //const availableNames = operator.name;
        operator.filter((name)=>{
           return name.toLowerCase().includes(input.toLowerCase())
    })
    }
}