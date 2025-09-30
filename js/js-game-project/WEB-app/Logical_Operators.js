//const hasGoodVision = true;
//const hasDriversLicense = true;
// console.log(hasGoodVision && hasDriversLicense); //true
// console.log(hasGoodVision || hasDriversLicense); //true
// console.log(!hasDriversLicense);
// if (hasDriversLicense&&hasGoodVision){
//     console.log("you can drive");
// }
// else{
//     console.log("someone else should drive");
// }
// const isTired = true;
// console.log(hasDriversLicense && hasGoodVision && isTired);
// if (hasDriversLicense&&hasGoodVision&& !isTired){
//     console.log("you can drive");
// }
// else{
//     console.log("someone else should drive");
// }
//challenge 3
// const scoreDolphins = (96 + 108 + 89)/3;
// const scoreKoalas = (88 + 91 + 110)/3;
// if(scoreDolphins > scoreKoalas){
//     console.log("Dolphins win the trophy");
// }else if(scoreKoalas > scoreDolphins){
//     console.log("Koalas win the trophy");
// }else{
//     console.log("Both win the trophy");
// }
// switch statement
// const day = 'monday';
// switch (day) {
//     case 'monday':
//         console.log('plan course structure');
//         console.log('go to coding meetup');
//         break;//without break it immediately goes to next case
//     case 'tuesday':
//         console.log('prepare theory videos');
//         break;
//     case 'wednesday':
//     case 'thursday':
//          console.log('write code examples');
//          break;
//     case 'friday':
//         console.log('record videos');
//         break;
//     case 'saturday':
//     case 'sunday':
//         console.log('enjoy the weekend :D');
//         break;
//     default:
//         console.log ('not a valid day!');                    

// }
// //works perfectly
// if (day === 'monday') {
// console.log('plan course structure');
//         console.log('go to coding meetup');
// } 
// else if (day === 'tuesday'){
// console.log('prepare theory videos');
// }
// else if (day === 'wednesday' || day === 'thursday'){
// console.log('write code examples');
// }
// else if ( day === 'friday'){
// console.log('record videos');
// }
// else if (day === 'saturday' || day === 'sunday'){
// console.log('enjoy the weekend :D');
// }
// else {
//     console.log ('not a valid day!');
// }