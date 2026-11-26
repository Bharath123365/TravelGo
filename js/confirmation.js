
const selectedBus = JSON.parse(
    localStorage.getItem("selectedBus")
);

const passenger = JSON.parse(
    localStorage.getItem("passengerDetails")
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

// Check whether all booking details are available
if (
    !selectedBus ||
    !passenger ||
    selectedSeats.length === 0 ||
    !from ||
    !to ||
    !date ||
    !Number.isFinite(totalAmount) ||
    totalAmount <= 0
) {
    alert("Booking information not found. Please book again.");
    window.location.href = "index.html";

} else {

    // Create a booking ID only once for this booking
    let booking = JSON.parse(
        localStorage.getItem("confirmationBooking")
    );

    if (!booking) {

        const bookingId = "TG" + Date.now();

        booking = {
            bookingId: bookingId,
            passenger: passenger,
            bus: selectedBus,
            from: from,
            to: to,
            date: date,
            seats: selectedSeats,
            totalAmount: totalAmount
        };

        localStorage.setItem(
            "confirmationBooking",
            JSON.stringify(booking)
        );

        // Save booking in booking history
        const bookings = JSON.parse(
            localStorage.getItem("myBookings") || "[]"
        );

        bookings.push(booking);

        localStorage.setItem(
            "myBookings",
            JSON.stringify(bookings)
        );
    }

    // Display booking information
    document.getElementById("booking-id").textContent =
        booking.bookingId;

    document.getElementById("passenger-name").textContent =
        booking.passenger.name;

    document.getElementById("passenger-age").textContent =
        booking.passenger.age;

    document.getElementById("passenger-gender").textContent =
        booking.passenger.gender;

    document.getElementById("passenger-mobile").textContent =
        booking.passenger.mobile;

    document.getElementById("passenger-email").textContent =
        booking.passenger.email;

    document.getElementById("bus-name").textContent =
        booking.bus.name;

    document.getElementById("bus-type").textContent =
        booking.bus.type;

    document.getElementById("from-city").textContent =
        booking.from;

    document.getElementById("to-city").textContent =
        booking.to;

    document.getElementById("journey-date").textContent =
        booking.date;

    document.getElementById("departure").textContent =
        booking.bus.departure;

    document.getElementById("arrival").textContent =
        booking.bus.arrival;

    document.getElementById("seat-numbers").textContent =
        booking.seats.join(", ");

    document.getElementById("total-fare").textContent =
        booking.totalAmount;
}
