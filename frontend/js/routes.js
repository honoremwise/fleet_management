// =======================================
// Route Module
// =======================================

async function loadRoutes() {

    const content = document.getElementById("content");

    content.innerHTML = `

        <div class="page-header">

            <h2>Route Management</h2>

            <button class="btn btn-success" onclick="showRouteForm()">
                + Add Route
            </button>

        </div>

        <div id="routeForm"></div>

        <div id="routeForm"></div>

<div class="table-toolbar">

    <input
        type="text"
        id="searchRoute"
        placeholder="🔍 Search by origin or destination..."
        onkeyup="filterRoutes()"
    >

    <button
        class="btn btn-primary"
        onclick="resetRouteFilter()">

        Reset

    </button>

</div>

<p id="routeResults"></p>

<table>

        <table>

            <thead>

                <tr>

                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Distance (KM)</th>
                    <th>Estimated Duration</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody id="routeTableBody"></tbody>

        </table>

    `;

    fetchRoutes();

}



// =======================================
// Fetch Routes
// =======================================

async function fetchRoutes() {

    const response = await fetch(

        `${API_BASE_URL}/routes/`,

        {

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const routes = await response.json();

    const tbody =
        document.getElementById("routeTableBody");

    tbody.innerHTML = "";

    routes.forEach(route => {

        tbody.innerHTML += `

            <tr>

                <td>${route.origin}</td>

                <td>${route.destination}</td>

                <td>${route.distance_km}</td>

                <td>${route.estimated_duration}</td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editRoute(${route.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteRoute(${route.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}



// =======================================
// Route Form
// =======================================

function showRouteForm() {

    document.getElementById("routeForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Add Route</h3>

            <input
                id="origin"
                placeholder="Origin"
            >

            <input
                id="destination"
                placeholder="Destination"
            >

            <input
                id="distance"
                type="number"
                step="0.01"
                placeholder="Distance (KM)"
            >

            <input
                id="duration"
                placeholder="Estimated Duration"
            >

            <br><br>

            <button
                class="btn btn-primary"
                onclick="saveRoute()">

                Save Route

            </button>

        </div>

    `;

}
// =======================================
// Save Route
// =======================================

async function saveRoute() {

    const response = await fetch(

        `${API_BASE_URL}/routes/`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                origin:
                    document.getElementById("origin").value,

                destination:
                    document.getElementById("destination").value,

                distance_km:
                    document.getElementById("distance").value,

                estimated_duration:
                    document.getElementById("duration").value

            })

        }

    );

    if (response.ok) {

        alert("Route Added Successfully");

        loadCounts();

        loadRoutes();

    }

    else {

        const error = await response.json();

        console.log(error);

        alert("Failed to save route.");

    }

}



// =======================================
// Edit Route
// =======================================

async function editRoute(id) {

    const response = await fetch(

        `${API_BASE_URL}/routes/${id}/`,

        {

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const route = await response.json();

    document.getElementById("routeForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Edit Route</h3>

            <input
                id="editOrigin"
                value="${route.origin}"
            >

            <input
                id="editDestination"
                value="${route.destination}"
            >

            <input
                id="editDistance"
                type="number"
                step="0.01"
                value="${route.distance_km}"
            >

            <input
                id="editDuration"
                value="${route.estimated_duration}"
            >

            <br><br>

            <button
                class="btn btn-warning"
                onclick="updateRoute(${id})">

                Update Route

            </button>

        </div>

    `;

}
// =======================================
// Update Route
// =======================================

async function updateRoute(id) {

    const response = await fetch(

        `${API_BASE_URL}/routes/${id}/`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                origin:
                    document.getElementById("editOrigin").value,

                destination:
                    document.getElementById("editDestination").value,

                distance_km:
                    document.getElementById("editDistance").value,

                estimated_duration:
                    document.getElementById("editDuration").value

            })

        }

    );

    if (response.ok) {

        alert("Route Updated Successfully");

        loadCounts();

        loadRoutes();

    }

    else {

        const error = await response.json();

        console.log(error);

        alert("Failed to update route.");

    }

}



// =======================================
// Delete Route
// =======================================

async function deleteRoute(id) {

    if (!confirm("Are you sure you want to delete this route?")) {

        return;

    }

    const response = await fetch(

        `${API_BASE_URL}/routes/${id}/`,

        {

            method: "DELETE",

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    if (response.ok) {

        alert("Route Deleted Successfully");

        loadCounts();

        loadRoutes();

    }

    else {

        const error = await response.json();

        console.log(error);

        alert("Failed to delete route.");

    }
    function filterRoutes(){

    const search =
        document.getElementById("searchRoute")
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll("#routeTableBody tr");

    let visible = 0;

    rows.forEach(row=>{

        const origin =
            row.children[0].innerText.toLowerCase();

        const destination =
            row.children[1].innerText.toLowerCase();

        const distance =
            row.children[2].innerText.toLowerCase();

        const duration =
            row.children[3].innerText.toLowerCase();

        const matches =

            origin.includes(search)

            ||

            destination.includes(search)

            ||

            distance.includes(search)

            ||

            duration.includes(search);

        if(matches){

            row.style.display="";

            visible++;

        }

        else{

            row.style.display="none";

        }

    });

    document.getElementById("routeResults").innerHTML =

        `${visible} route(s) found`;

}

}