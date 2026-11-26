
const selectedBus = JSON.parse(
    localStorage.getItem("selectedBus")
);

const from = localStorage.getItem("from");
const to = localStorage.getItem("to");
const date = localStorage.getItem("date");

const seatLayout = document.getElementById("seat-layout");

const selectedSeatsElement =
    document.getElementById("selected-seats");

const totalPriceElement =
    document.getElementById("total-price");

const seatPriceElement =
    document.getElementById("seat-price");

// Check whether a bus was selected
if (!selectedBus) {

    alert("Please select a bus first!");
    window.location.href = "buses.html";

} else {

    document.getElementById("bus-name").textContent =
        selectedBus.name;

    document.getElementById("bus-type").textContent =
        selectedBus.type;

    document.getElementById("journey").textContent =
        `${from} to ${to}`;

    const price = selectedBus.price;

    seatPriceElement.textContent = price;

    // Create a unique key for each bus, route and date
    const tripKey = [
        from.toLowerCase(),
        to.toLowerCase(),
        date,
        selectedBus.name
    ].join("-");

    const storageKey = "bookedSeats-" + tripKey;

    // Generate different initial booked seats for each bus
    function generateInitialBookedSeats(busName) {

        let hash = 0;

        for (let i = 0; i < busName.length; i++) {
            hash = (hash * 31 + busName.charCodeAt(i)) >>> 0;
        }

        const booked = [];

        while (booked.length < 3) {

            hash = (hash * 1664525 + 1013904223) >>> 0;

            const seatNumber = (hash % 20) + 1;
            const seat = "S" + seatNumber;

            if (!booked.includes(seat)) {
                booked.push(seat);
            }
        }

        return booked;
    }

    // Get saved booked seats or create sample booked seats
    let bookedSeats = JSON.parse(
        localStorage.getItem(storageKey)
    );

    if (!bookedSeats) {
        bookedSeats = generateInitialBookedSeats(
            selectedBus.name + tripKey
        );
    }

    let selectedSeats = [];

    // Create 20 seats
    for (let i = 1; i <= 20; i++) {

        const seatNumber = "S" + i;

        const seat = document.createElement("button");

        seat.textContent = seatNumber;
        seat.classList.add("seat");

        if (bookedSeats.includes(seatNumber)) {

            seat.classList.add("occupied");
            seat.disabled = true;

        } else {

            seat.addEventListener("click", function () {

                if (selectedSeats.includes(seatNumber)) {

                    selectedSeats = selectedSeats.filter(
                        item => item !== seatNumber
                    );

                    seat.classList.remove("selected");

                } else {

                    if (selectedSeats.length >= 6) {
                        alert("You can select a maximum of 6 seats.");
                        return;
                    }

                    selectedSeats.push(seatNumber);
                    seat.classList.add("selected");
                }

                updateSummary();
            });
        }

        // Add an aisle after every two seats
        if (i % 4 === 3) {
            const aisle = document.createElement("div");
            aisle.classList.add("aisle");
            seatLayout.appendChild(aisle);
        }

        seatLayout.appendChild(seat);
    }

    function updateSummary() {

        selectedSeatsElement.textContent =
            selectedSeats.length > 0
                ? selectedSeats.join(", ")
                : "None";

        totalPriceElement.textContent =
            selectedSeats.length * price;
    }

    function continueBooking() {

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat!");
            return;
        }

        // Save selected seats
        localStorage.setItem(
            "selectedSeats",
            JSON.stringify(selectedSeats)
        );

        localStorage.setItem(
            "totalAmount",
            selectedSeats.length * price
        );

        // Save these seats as booked for this trip
        const updatedBookedSeats = [
            ...new Set([...bookedSeats, ...selectedSeats])
        ];

        localStorage.setItem(
            storageKey,
            JSON.stringify(updatedBookedSeats)
        );

        window.location.href = "passenger.html";
    }
}
