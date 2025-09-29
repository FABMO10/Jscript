//const age = '18';
//if ( age === 18)//Dont need a else block because there is only one thing to check 
//console.log(`You just became an adult ${age} (strict)`);//will not do type coercion
//here === is a strict equality operator it checks for value and type
//if ( age == 18)//will do a type coercion after typing loose in console log 
//console.log(`You just became an adult ${age} (loose)`);//turns string into number 
const favourite = Number(prompt("how old are you?"));//the input is always a string 
console.log(favourite);
console.log(typeof favourite);
if (favourite === 23) //loose operator turns it string into numbers
{ console.log("you are an adult ");}
else if (favourite === 7 ){ 
    console.log("you are an adult of 7");
}
else if (favourite === 9 ){ 
    console.log("you are an adult of 9 ");
}else{ 
    console.log("you are not in the range");
}
if (favourite !== 23)
    console.log("why not 23");
