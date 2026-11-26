
const selectedBus = JSON.parse(
    localStorage.getItem("selectedBus")
);

const selectedSeats = JSON.parse(
    localStorage.getItem("selectedSeats") || "[]"
);

const totalAmount = Number(
    localStorage.getItem("totalAmount")
);

const from = localStorage.getItem("from");
const to = localStorage.getItem("to");
const date = localStorage.getItem("date");

// Check whether booking information exists
if (
    !selectedBus ||
    selectedSeats.length === 0 ||
    !from ||
    !to ||
    !date ||
    !Number.isFinite(totalAmount) ||
    totalAmount <= 0
) {
    alert("Booking details are missing. Please select a bus and seats first.");
    window.location.href = "index.html";
} else {

    document.getElementById("bus-name").textContent =
        selectedBus.name;

    document.getElementById("journey").textContent =
        `${from} to ${to} | Date: ${date}`;

    document.getElementById("seats").textContent =
        `Selected Seats: ${selectedSeats.join(", ")}`;

    document.getElementById("amount").textContent =
        `Total Amount: ₹${totalAmount}`;
}

// Handle passenger form submission
document.getElementById("passenger-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const age = Number(document.getElementById("age").value);
        const gender = document.getElementById("gender").value;
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();

        if (name.length < 2) {
            alert("Please enter a valid name.");
            return;
        }

        if (!Number.isInteger(age) || age < 1 || age > 100) {
            alert("Please enter a valid age.");
            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            alert("Please enter a valid 10-digit Indian mobile number.");
            return;
        }

        const passenger = {
            name: name,
            age: age,
            gender: gender,
            mobile: mobile,
            email: email
        };

        localStorage.setItem(
    "passengerDetails",
    JSON.stringify(passenger)
);

// Clear the previous booking confirmation
localStorage.removeItem("confirmationBooking");

alert("Passenger details saved successfully!");

window.location.href = "confirmation.html";
    });
