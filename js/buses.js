
const from = localStorage.getItem("from");
const to = localStorage.getItem("to");
const date = localStorage.getItem("date");

const journey = document.getElementById("journey");
const travelDate = document.getElementById("travel-date");
const busList = document.getElementById("bus-list");

const busFilter = document.getElementById("bus-filter");
const sortBuses = document.getElementById("sort-buses");
const busCount = document.getElementById("bus-count");

// All TravelGo destinations
const destinations = [
    "Hyderabad",
    "Bangalore",
    "Chennai",
    "Tirupati",
    "Chittoor",
    "Pondicherry",
    "Goa",
    "Kerala"
];

// Approximate destination coordinates.
// Kerala uses Kochi as its representative location.
const cityCoordinates = {
    "hyderabad": [17.3850, 78.4867],
    "bangalore": [12.9716, 77.5946],
    "chennai": [13.0827, 80.2707],
    "tirupati": [13.6288, 79.4192],
    "chittoor": [13.2172, 79.1003],
    "pondicherry": [11.9416, 79.8083],
    "goa": [15.2993, 74.1240],
    "kerala": [9.9312, 76.2673]
};

// Bus operators
const operators = [
    "Orange Travels",
    "Sri Balaji Travels",
    "Royal Express",
    "GreenLine Travels",
    "National Travels",
    "City Link Travels",
    "SRS Travels",
    "Express Roadways"
];

// Bus types
const busTypes = [
    "AC Sleeper",
    "AC Seater",
    "Non-AC Seater",
    "AC Sleeper",
    "AC Seater"
];

// Departure timings
const departureTimes = [
    "06:00 AM",
    "08:00 AM",
    "09:00 AM",
    "06:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM"
];

// Normalize city names
function normalizeCity(city) {
    const name = city.trim().toLowerCase();

    const aliases = {
        "bengaluru": "bangalore",
        "tirupathi": "tirupati",
        "puducherry": "pondicherry"
    };

    return aliases[name] || name;
}

// Calculate approximate distance
function calculateDistance(city1, city2) {
    const point1 = cityCoordinates[city1];
    const point2 = cityCoordinates[city2];

    const toRadians = degrees => degrees * Math.PI / 180;

    const lat1 = toRadians(point1[0]);
    const lat2 = toRadians(point2[0]);

    const latDifference = toRadians(point2[0] - point1[0]);
    const lonDifference = toRadians(point2[1] - point1[1]);

    const a =
        Math.sin(latDifference / 2) ** 2 +
        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(lonDifference / 2) ** 2;

    const earthRadius = 6371;

    const straightDistance =
        earthRadius * 2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Approximate road distance
    return Math.round(straightDistance * 1.25);
}

// Convert time into minutes
function convertToMinutes(time) {
    const [clock, period] = time.split(" ");

    let [hours, minutes] = clock.split(":").map(Number);

    if (period === "AM" && hours === 12) {
        hours = 0;
    } else if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    return hours * 60 + minutes;
}

// Convert minutes into readable time
function formatTime(totalMinutes) {
    totalMinutes = totalMinutes % 1440;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const period = hours >= 12 ? "PM" : "AM";

    let displayHours = hours % 12;

    if (displayHours === 0) {
        displayHours = 12;
    }

    return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Generate five different sample buses for a route
function generateRouteBuses(source, destination) {
    const distance = calculateDistance(source, destination);

    // Estimated journey duration
    const duration = Math.max(2, Math.round(distance / 55));

   const sourceIndex = destinations.findIndex(
    city => city.toLowerCase() === source
);

const destinationIndex = destinations.findIndex(
    city => city.toLowerCase() === destination
);

const routeNumber =
    sourceIndex * destinations.length + destinationIndex;

    const buses = [];

    for (let i = 0; i < 5; i++) {
        const operatorIndex =
            (routeNumber + i) % operators.length;

        const type = busTypes[i];

        // Approximate sample fares
        let ratePerKm;

        if (type === "AC Sleeper") {
            ratePerKm = 2.2;
        } else if (type === "AC Seater") {
            ratePerKm = 1.7;
        } else {
            ratePerKm = 1.25;
        }

        const basePrice = Math.max(
            199,
            Math.round(distance * ratePerKm)
        );

        const priceVariation = [0, 40, 80, 120, 160];

        const price = basePrice + priceVariation[i];

        const departure = departureTimes[
            (routeNumber + i) % departureTimes.length
        ];

        const arrivalMinutes =
            convertToMinutes(departure) + duration * 60;

        buses.push({
            name: operators[operatorIndex],
            type: type,
            departure: departure,
            arrival: formatTime(arrivalMinutes),
            price: price,
            distance: distance
        });
    }

    return buses;
}

// Generate routes between all destinations
function generateAllRoutes() {
    const allRoutes = {};

    destinations.forEach(source => {
        destinations.forEach(destination => {

            // Do not create a route from a city to itself
            if (source === destination) {
                return;
            }

            const routeKey =
    `${source.toLowerCase()}-${destination.toLowerCase()}`;

allRoutes[routeKey] =
    generateRouteBuses(source.toLowerCase(), destination.toLowerCase());
        });
    });

    return allRoutes;
}

// Create all 56 one-way routes
const routeBuses = generateAllRoutes();

// Find buses for selected route
let buses = [];

if (from && to && date) {
    const source = normalizeCity(from);
    const destination = normalizeCity(to);

    const routeKey = `${source}-${destination}`;

    if (
        destinations.some(city =>
            city.toLowerCase() === source
        ) &&
        destinations.some(city =>
            city.toLowerCase() === destination
        ) &&
        source !== destination
    ) {
        buses = routeBuses[routeKey] || [];
    }
}

// Display journey information
if (!from || !to || !date) {

    journey.textContent = "No journey details found.";

    travelDate.textContent =
        "Please search for buses from the homepage.";

    busList.textContent = "";
    busCount.textContent = "";

    window.travelGoBuses = [];

} else {

    journey.textContent = `${from} → ${to}`;

    travelDate.textContent = `Journey Date: ${date}`;

    if (buses.length === 0) {

        busCount.textContent = "Showing 0 buses";

        busList.innerHTML = `
            <p class="no-buses">
                No sample buses available for this route.
                Please select another destination.
            </p>
        `;

        window.travelGoBuses = [];

    } else {

        displayBuses();

        busFilter.addEventListener("change", displayBuses);

        sortBuses.addEventListener("change", displayBuses);
    }
}

// Display, filter and sort buses
function displayBuses() {
    let filteredBuses = [...buses];

    const selectedType = busFilter.value;

    // AC and Non-AC filtering
    if (selectedType === "AC") {

        filteredBuses = filteredBuses.filter(
            bus => bus.type.startsWith("AC")
        );

    } else if (selectedType === "Non-AC") {

        filteredBuses = filteredBuses.filter(
            bus => bus.type.startsWith("Non-AC")
        );
    }

    // Sorting
    const sortValue = sortBuses.value;

    if (sortValue === "low-high") {

        filteredBuses.sort(
            (a, b) => a.price - b.price
        );

    } else if (sortValue === "high-low") {

        filteredBuses.sort(
            (a, b) => b.price - a.price
        );

    } else if (sortValue === "departure") {

        filteredBuses.sort(
            (a, b) =>
                convertToMinutes(a.departure) -
                convertToMinutes(b.departure)
        );
    }

    busList.innerHTML = "";

    busCount.textContent =
        `Showing ${filteredBuses.length} bus(es)`;

    if (filteredBuses.length === 0) {

        busList.innerHTML = `
            <p class="no-buses">
                No buses found for this filter.
                Please select another option.
            </p>
        `;

        window.travelGoBuses = [];

        return;
    }

    // Keep the displayed bus order for seat selection
    window.travelGoBuses = filteredBuses;

    filteredBuses.forEach((bus, index) => {

        busList.innerHTML += `
            <div class="bus-card">

                <div>
                    <h3>${bus.name}</h3>

                    <p>${bus.type}</p>

                    <p>Departure: ${bus.departure}</p>

                    <p>Arrival: ${bus.arrival}</p>

                    <p>Distance: Approx. ${bus.distance} km</p>
                </div>

                <div>
                    <p class="price">₹${bus.price}</p>

                    <button onclick="selectBus(${index})">
                        View Seats
                    </button>
                </div>

            </div>
        `;
    });
}

// Select bus and continue to seat selection
function selectBus(index) {
    const selectedBus = window.travelGoBuses[index];

    if (!selectedBus) {
        return;
    }

    selectedBus.from = from;
    selectedBus.to = to;

    localStorage.setItem(
        "selectedBus",
        JSON.stringify(selectedBus)
    );

    window.location.href = "seats.html";
}
