//let numWins = 0;
//let numLosses = 0;

function main() {
  for (let i = 0; i < 20; i++) {
    oneGame();
  } 
}
  function throwDice() {
  return throwDie() + throwDie();
}

function throwDie() {
  // random integer 1..6
  return Math.floor(Math.random() * 6) + 1;
}

  //console.log("RUnning tha game 15000");
  //console.log("Number of times you win " + numWins);
  //console.log("Number of times you loose" + numLosses);
//}

function oneGame() {
  let yourThrow = throwDice();
  console.log("you threw " + yourThrow);

  if (isNatural(yourThrow)) {
   console.log("you win (natural)");
    //numWins++;
  } else if (isCraps(yourThrow)) {
    console.log("You loose (Craps)");
    //numLosses++;
  } else {
     console.log("point Established");
    const thepointValue = yourThrow;
    do {
      yourThrow = throwDice();
      console.log("You Threw" + yourThrow);
    } while (yourThrow !== 7 && yourThrow !== thepointValue);

    if (yourThrow === 7) {
      console.log("You loose! ");
      //numLosses++;
    }
    if (yourThrow === thepointValue) {
      console.log("You win !");
      //numWins++;
    }
  }
}

function isCraps(s) {
  switch (s) {
    case 2:
    case 3:
    case 12:
      return true;
    default:
      return false;
  }
}

function isNatural(s) {
  switch (s) {
    case 7:
    case 11:
      return true;
    default:
      return false;
  }
}
main();
