// Countdown Timer Interface
const countdownContainer = document.createElement('div');
countdownContainer.style.textAlign = 'center';
countdownContainer.style.marginTop = '50px';

const inputLabel = document.createElement('label');
inputLabel.textContent = 'Enter Time (Months, Days, Hours, Minutes, Seconds):';
inputLabel.style.display = 'block';
inputLabel.style.marginBottom = '10px';

const inputField = document.createElement('input');
inputField.type = 'text';
inputField.placeholder = 'e.g., 0, 10, 5, 30, 0';
inputField.style.marginBottom = '10px';

const startButton = document.createElement('button');
startButton.textContent = 'Start Countdown';
startButton.style.display = 'block';
startButton.style.margin = '10px auto';

const timerDisplay = document.createElement('div');
timerDisplay.style.fontSize = '24px';
timerDisplay.style.marginTop = '20px';

countdownContainer.appendChild(inputLabel);
countdownContainer.appendChild(inputField);
countdownContainer.appendChild(startButton);
countdownContainer.appendChild(timerDisplay);
document.body.appendChild(countdownContainer);

startButton.addEventListener('click', () => {
    const input = inputField.value.split(',').map(Number);
    if (input.length !== 5 || input.some(isNaN)) {
        alert('Please enter valid numbers for Months, Days, Hours, Minutes, and Seconds.');
        return;
    }

    const [months, days, hours, minutes, seconds] = input;
    let totalSeconds = seconds + minutes * 60 + hours * 3600 + days * 86400 + months * 2592000;

    const updateTimer = () => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Time is up!';
            return;
        }

        const remainingMonths = Math.floor(totalSeconds / 2592000);
        const remainingDays = Math.floor((totalSeconds % 2592000) / 86400);
        const remainingHours = Math.floor((totalSeconds % 86400) / 3600);
        const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;

        timerDisplay.textContent = `Time Left: ${remainingMonths} Months, ${remainingDays} Days, ${remainingHours} Hours, ${remainingMinutes} Minutes, ${remainingSeconds} Seconds`;
        totalSeconds--;
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
});