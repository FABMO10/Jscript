
//let myFirstJob = 'programmer';
//console.log(myFirstJob);
//let myCurrentJob = "teacher";
//console.log(myCurrentJob);
//let isNotIsland = true;
//let language = "Bengali";
//const country = "Bangladesh";
//let population = 23525463632463463.456;
//console.log(typeof isNotIsland); 
//console.log(typeof language);
//console.log(typeof country);
//console.log(typeof population);
//console.log(population);
//true;
//console.log(true);
//console.log("'did anyone came?'"); let noOneCame = false;
//console.log(noOneCame);
//noOneCame = "why do you care?";
//console.log(noOneCame);
// console.log(typeof null);//object
//const baby = 'ayo';
//console.log(baby);
//baby = 'ayo3';
//console.log(baby); //wont show because const cant be changed
//var and let are quite same as both can be changed and output it but its quite different as well 
//var honey = 'pie';
//console.log(honey);
//honey = 'honey';
//console.log(honey);
//const ageMahir = 2025-2004;
//const ageGonna =2025-2006;
//console.log(ageMahir , ageGonna);//like this you can show multiple outputs
//console.log(ageMahir * 2 ,ageGonna / 2,2**3);//you can do operations as well //2**3 means 2 to the power of 3 
// let agePerson = 50;
// const ageBoy = agePerson - 30;
// const ageGirl = agePerson - 31;
// console.log(ageBoy , ageGirl);
// ageBoy = 40; //wont show because const cant be changed
//const firstName = 'Fabasshir';
//const lastName = 'Islam';
//console.log(firstName + lastName); //this will show FabasshirIslam concatenation.
//console.log(firstName + ' ' +lastName);//this will show Fabasshir Islam concatenation with space.
//let x = 10+5;// is 15
//x += 10;//means x = x + 10 = 25.
//x + 20;
//console.log(x);//will show 25 because x + 20 is not stored anywhere.
//x += 20;
//console.log(x);//will show 45 because x = x +20 =45.
//x *= 4;
//console.log(x);
//x++; //means x= x+1.
//x--;//means x = x-1.
// let y = 5;
// const z = 10;
//console.log(y>z);//will show false because 5 is not  > 10.
//we have got >, < , >= ,<= ,==,===,!=,!==
// let agePerson = 50;
// const ageBoy = agePerson - 30;
// const ageGirl = agePerson - 31;
//console.log(agePerson - 20 > agePerson - 30); // gives boolean value
//let x,y;
//x = y =25-15;// first the calculation be done then operation would continue from right to left 
//so y= 10 then x = y so x=10 // src mdn table of operator precedence 
//console.log(x,y);
//const averageAge = (ageBoy + ageGirl)/2;//use of parenthesis.
// console.log(averageAge);
//const firstName = 'Fab';
//const job = 'DEV';
//const birthYear = 2004;
//const now = 2025;
//const fab = "I'm " + firstName + ', a ' + ( now - birthYear) + ' years old ' + job + "!" ;
//console.log (fab);//old way of doing it 
//const fabasshir = `I'm ${firstName}. a ${now - birthYear} years old ${job}!`;
//console.log(fabasshir); // you can ouput variable ${...} inside this bracket .
//console.log('string with \n\
  //  multiple \n\
   // lines');//old way of doing it 
    //console.log(`string
     //   with
      //  multiple lines
       // new way`);//new way of doint it using backticks
// const age = 15 ;
// const isOldEnough = age >= 18 ;
// if (isOldEnough) {
//   console.log(`Fab can start driving license`);
//} 
// else {
//   const yearsLeft = 18 - age ;
//   console.log(`Fab is too young. wait another ${yearsLeft} years`);
//}
//if (age >= 18)  //also we can put arguement directly in if without storing it in a variable
//const birthYear = 2000;
//let century;
//if (birthYear <= 2000) {
// century = 20
//} else {
// century = 21
//}
//console.log(century); // 20 // also you cant use let inside if block and use it outside of it 
// error because century is functioning inside the (if) block wont do outside it
//to make it work we need to declare it outside the block 
//let century; (as above).
//challenge 2
// const massMark = 78;
// const heighMark = 1.69;
// const massJohn = 92;
// const heightJohn = 1.95;
// const BMIMark = massMark / (heighMark * heighMark);
// const BMIJohn = massJohn / (heightJohn * heightJohn);
// if (BMIMark > BMIJohn)
// {
  // console.log(`Mark's BMI ${BMIMark}`)
// }else{
  // console.log(`John's BMI ${BMIJohn}`)
// }
//const inputYear = '1991';
//console.log(Number(inputYear) );//will show 1991 because we converted the string into number using NUmber function
//console.log(Number(inputYear) + 18);//will show 2009 because we converted the string into number using Number function 
//console.log(inputYear + 18 );//will show 199118 bacause the inputYear has a value of string.
//console.log(Number('Fab'));//will show a NaN because Fab cant be converted into a number 
//console.log(typeof NaN);//will show number becaue NaN is a type of number 
//console.log(String(23),23);//will show 23 23 because we converted the number into string using String function 
//the conversion goes the same way for string to number
//type coercion
//console.log("I'm " + 23 + " years old");//23 is converted to string because of the + operator because of coercion
//console.log('23' - '10' - 3); //will show 10 because  - operator does the opposite of + operator through coercion 
//also multiplication and division does the same as the - operator
//let n = '1' + 1 ; //will show 11 because of + operator
//n = n - 1 ;
//console.log(n);//will show 10
//in jscript there is 5 falsy values : 0,'',undefined,null,NaN 
//console.log(Boolean(0));//will show false 
//console.log(Boolean(undefined));//will show false 
//console.log(Boolean('Fab'));//will show true
//console.log(Boolean({}));//will show true
//console.log(Boolean(''));//will show false
//const money = 0 ; 
//const money = 50;
//if (money){
//console.log("Dont spend it all ");
//} else {
//console.log(" EWWWW ");
//will show EWWWW because the money here indicates 0 which in boolean is a flase
//will show The if block because 50 is a truthy value

