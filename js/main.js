
// Get homepage input elements
const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");
const dateInput = document.getElementById("date");

// Set today's date as the minimum journey date
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const todayDate = `${year}-${month}-${day}`;

dateInput.min = todayDate;

// Swap source and destination cities
function swapCities() {
    const temp = fromInput.value;

    fromInput.value = toInput.value;
    toInput.value = temp;
}

// Search buses
function searchBuses() {

    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    const date = dateInput.value;

    // Check empty fields
    if (from === "" || to === "" || date === "") {
        alert("Please enter all journey details!");
        return;
    }

    // Prevent same source and destination
    if (from.toLowerCase() === to.toLowerCase()) {
        alert("Source and destination cannot be the same!");
        return;
    }

    // Prevent past journey dates
    if (date < todayDate) {
        alert("Please select today or a future journey date!");
        return;
    }

    // Save journey details
    localStorage.setItem("from", from);
    localStorage.setItem("to", to);
    localStorage.setItem("date", date);

    // Open bus results page
    window.location.href = "buses.html";
}
