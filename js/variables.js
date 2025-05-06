console.log("this code is just a basic example of a javascript code");
let a=3;//gotta go to the html file to see the output
console.log(a);//and right click on the index.html on explorer tab and then right click on the broswer and tap inspect and see output on console.

const readline = require('readline');

// filepath: c:\MDX Theories\js\variables.js
function printPyramid(char) {
    if (char.length !== 1) {
        alert("Please enter a single character.");
        return;
    }
    const rows = 5; // Number of rows for the pyramid
    let pyramid = '';

    for (let i = 1; i <= rows; i++) {
        const spaces = ' '.repeat(rows - i);
        const chars = char.repeat(2 * i - 1);
        pyramid += spaces + chars + '\n';
    }

    // Display the pyramid in the console
    console.log(pyramid);

    // Optionally, display the pyramid on the webpage
    const outputDiv = document.createElement('pre');
    outputDiv.textContent = pyramid;
    document.body.appendChild(outputDiv);
}