// =====================================
// Authentication
// =====================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("username").textContent =
    localStorage.getItem("username") || "User";

const headers = {
    "Authorization": `Token ${token}`,
    "Content-Type": "application/json"
};


// =====================================
// Dashboard Statistics
// =====================================

async function loadCounts() {

    try {

        const [
            vehiclesResponse,
            driversResponse,
            routesResponse,
            tripsResponse
        ] = await Promise.all([

            fetch(`${API_BASE_URL}/vehicles/`, { headers }),
            fetch(`${API_BASE_URL}/drivers/`, { headers }),
            fetch(`${API_BASE_URL}/routes/`, { headers }),
            fetch(`${API_BASE_URL}/trips/`, { headers })

        ]);

        const vehicles = await vehiclesResponse.json();
        const drivers = await driversResponse.json();
        const routes = await routesResponse.json();
        const trips = await tripsResponse.json();

        document.getElementById("vehicleCount").textContent = vehicles.length;
        document.getElementById("driverCount").textContent = drivers.length;
        document.getElementById("routeCount").textContent = routes.length;
        document.getElementById("tripCount").textContent = trips.length;

    }
    catch (error) {

        console.error("Dashboard Error:", error);

    }

}


// =====================================
// Logout
// =====================================

function logout() {

    localStorage.clear();

    window.location.href = "login.html";

}


// =====================================
// Navigation
// =====================================

// function loadPage(page) {

//     switch (page) {

//         case "dashboard":

//             document.getElementById("content").innerHTML = `

//                 <div class="welcome-box">

//                     <h2>Dashboard</h2>

//                     <p>
//                         Welcome to Fleet Management System.
//                     </p>

//                 </div>

//             `;

//             break;


//         case "vehicles":

//             loadVehicles();

//             break;


//         case "drivers":

//             loadDrivers();

//             break;


//         case "routes":

//             loadRoutes();

//             break;


//         case "trips":

//             loadTrips();

//             break;


//         default:

//             document.getElementById("content").innerHTML =
//                 "<h2>Page Not Found</h2>";

//     }

// }
function loadPage(page) {

    switch (page) {

        case "dashboard":
            document.getElementById("content").innerHTML = `
                <h2>Dashboard</h2>
                <p>Welcome to Fleet Management System.</p>
            `;
            break;

        case "vehicles":
            loadVehicles();
            break;

        case "drivers":
            loadDrivers();
            break;

        case "routes":
            loadRoutes();
            break;

        case "trips":
            loadTrips();
            break;

        default:
            document.getElementById("content").innerHTML = `
                <h2>Page Not Found</h2>
            `;
    }
}


// =====================================
// Initialize Dashboard
// =====================================

loadCounts();

loadPage("dashboard");