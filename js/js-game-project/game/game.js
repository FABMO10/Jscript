// const names = ["alice","babe","ayo",2,false];
// names.push("David");
// names.splice(1,1);
// console.log(names);

// function sayHello(names){
    // console.log("hello"+names);
// }

// let myfunction = (name)=>{
    // console.log("Inside function" + name);
// }
// console.log(myfunction);
// const person = {
    // someone: "sam",
    // age : 33,
    // pets:[
        // {species:"dog", age:2},    
//  ]|
// };
// const personJSON = JSON.stringify(person);
// const 
const suits = ["clubs","diamonds","hearts","spades"];
const ranks = ["ace", 1,2,3,4,5,6,7,"jack" ];
const cards =[];

function buildDeck(){
    for (let suit of suits);{
        for (let rank of ranks){
            cards.push({
                suit: suit,
                rank:rank,
                image : `${rank}_of_$suits `

            })
        }
    }
}