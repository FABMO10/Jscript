// Live clock updater
function updateClock() {
    var now = new Date();
    var clock = document.getElementById("clock");
    if (clock) {
        clock.innerHTML = now.toLocaleTimeString();
    }
}

// Call updateClock every second
setInterval(updateClock, 1000);
window.onload = function () {
    updateClock(); // Initialize immediately

    // Default to-do items
    var todos = [
        "Finish homework",
        "Buy groceries",
        "Call a friend",
        "Exercise for 30 minutes",
        "Read a chapter of a book"
    ];

    var list = document.getElementById("todoList");

    // Populate the list with default items
    for (var i = 0; i < todos.length; i++) {
        var li = document.createElement("li");
        li.innerText = todos[i];
        list.appendChild(li);
    }

    // Add event listener to button
    var addButton = document.getElementById("addButton");
    addButton.onclick =
