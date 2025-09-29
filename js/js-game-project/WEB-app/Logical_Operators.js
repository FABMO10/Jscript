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
const scoreDolphins = (96 + 108 + 89)/3;
const scoreKoalas = (88 + 91 + 110)/3;
if(scoreDolphins > scoreKoalas){
    console.log("Dolphins win the trophy");
}else if(scoreKoalas > scoreDolphins){
    console.log("Koalas win the trophy");
}else{
    console.log("Both win the trophy");
}