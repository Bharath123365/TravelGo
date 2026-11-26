
const bookingList = document.getElementById("booking-list");

const bookings = JSON.parse(
    localStorage.getItem("myBookings") || "[]"
);

if (bookings.length === 0) {

    bookingList.innerHTML = `
        <div class="no-bookings">
            <h2>No Bookings Found</h2>
            <p>You have not booked any demo bus tickets yet.</p>
        </div>
    `;

} else {

    bookings.forEach((booking, index) => {

        const card = document.createElement("div");
        card.className = "booking-history-card";

        const heading = document.createElement("h3");
        heading.textContent = "Booking ID: " + booking.bookingId;

        const details = document.createElement("div");

        const information = [
            "Passenger: " + booking.passenger.name,
            "Bus: " + booking.bus.name,
            "Journey: " + booking.from + " to " + booking.to,
            "Date: " + booking.date,
            "Seats: " + booking.seats.join(", "),
            "Total Fare: ₹" + booking.totalAmount
        ];

        information.forEach((item) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = item;
            details.appendChild(paragraph);
        });

        const button = document.createElement("button");
        button.textContent = "View / Download Ticket";

        button.addEventListener("click", function () {

            localStorage.setItem(
                "confirmationBooking",
                JSON.stringify(bookings[index])
            );

            window.location.href = "confirmation.html";
        });

        card.appendChild(heading);
        card.appendChild(details);
        card.appendChild(button);

        bookingList.appendChild(card);
    });
}
