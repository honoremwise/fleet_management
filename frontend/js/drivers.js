// =======================================
// Driver Module
// =======================================

async function loadDrivers() {

    const content = document.getElementById("content");

    content.innerHTML = `

        <div class="page-header">

            <h2>Driver Management</h2>

            <button class="btn btn-success" onclick="showDriverForm()">
                + Register Driver
            </button>

        </div>

       <div id="driverForm"></div>

<div class="table-toolbar">

    <input
        type="text"
        id="searchDriver"
        placeholder="🔍 Search by name, username, phone or license..."
        onkeyup="filterDrivers()"
    >

    <select
        id="driverStatusFilter"
        onchange="filterDrivers()">

        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="on_trip">On Trip</option>
        <option value="off_duty">Off Duty</option>

    </select>

    <button
        class="btn btn-primary"
        onclick="resetDriverFilter()">

        Reset

    </button>

</div>

<p id="driverResults"></p>

<table>

        <table>

            <thead>

                <tr>

                    <th>Name</th>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>License</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody id="driverTableBody"></tbody>

        </table>

    `;

    fetchDrivers();

}



// =======================================
// Fetch Drivers
// =======================================

async function fetchDrivers() {

    const response = await fetch(

        `${API_BASE_URL}/drivers/`,

        {

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const drivers = await response.json();

    const tbody =
        document.getElementById("driverTableBody");

    tbody.innerHTML = "";

    drivers.forEach(driver => {

        tbody.innerHTML += `

            <tr>

                <td>${driver.driver_name}</td>

                <td>${driver.username ?? ""}</td>

                <td>${driver.phone}</td>

                <td>${driver.license_number}</td>

                <td>${driver.address}</td>

                <td>${driver.status}</td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editDriver(${driver.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteDriver(${driver.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}

function filterDrivers(){

    const search =
        document.getElementById("searchDriver")
            .value
            .toLowerCase();

    const status =
        document.getElementById("driverStatusFilter")
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll("#driverTableBody tr");

    let visible = 0;

    rows.forEach(row=>{

        const name =
            row.children[0].innerText.toLowerCase();

        const username =
            row.children[1].innerText.toLowerCase();

        const phone =
            row.children[2].innerText.toLowerCase();

        const license =
            row.children[3].innerText.toLowerCase();

        const rowStatus =
            row.children[5].innerText.toLowerCase();

        const matchesSearch =

            name.includes(search)

            ||

            username.includes(search)

            ||

            phone.includes(search)

            ||

            license.includes(search);

        const matchesStatus =

            status===""

            ||

            rowStatus===status;

        if(matchesSearch && matchesStatus){

            row.style.display="";

            visible++;

        }

        else{

            row.style.display="none";

        }

    });

    document.getElementById("driverResults").innerHTML=

        `${visible} driver(s) found`;

}



function resetDriverFilter(){

    document.getElementById("searchDriver").value="";

    document.getElementById("driverStatusFilter").value="";

    filterDrivers();

}

// =======================================
// Driver Registration Form
// =======================================

function showDriverForm() {

    document.getElementById("driverForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Register Driver</h3>

            <input
                id="username"
                placeholder="Username"
            >

            <input
                id="password"
                type="password"
                placeholder="Password"
            >

            <input
                id="first_name"
                placeholder="First Name"
            >

            <input
                id="last_name"
                placeholder="Last Name"
            >

            <input
                id="email"
                placeholder="Email"
            >

            <input
                id="phone"
                placeholder="Phone Number"
            >

            <input
                id="license_number"
                placeholder="License Number"
            >

            <input
                id="address"
                placeholder="Address"
            >
                        <select id="status">

                <option value="available">
                    Available
                </option>

                <option value="on_trip">
                    On Trip
                </option>

                <option value="off_duty">
                    Off Duty
                </option>

            </select>

            <br><br>

            <button
                class="btn btn-primary"
                onclick="saveDriver()">

                Save Driver

            </button>

            <hr>

        </div>

    `;

}



// =======================================
// Save Driver
// =======================================

async function saveDriver() {

    const response = await fetch(

        `${API_BASE_URL}/register-driver/`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                username:
                    document.getElementById("username").value,

                password:
                    document.getElementById("password").value,

                first_name:
                    document.getElementById("first_name").value,

                last_name:
                    document.getElementById("last_name").value,

                email:
                    document.getElementById("email").value,

                phone:
                    document.getElementById("phone").value,

                license_number:
                    document.getElementById("license_number").value,

                address:
                    document.getElementById("address").value

            })

        }

    );

    if (response.ok) {

        alert("Driver Registered Successfully");

        loadCounts();

        loadDrivers();

    }

 else {

    const error = await response.json();

    console.log(error);

    let message = "";

    for (const key in error) {

        message += `${key}: ${error[key].join(", ")}\n`;

    }

    alert(message);

}

}




// =======================================
// Edit Driver
// =======================================

// async function editDriver(id) {

//     const response = await fetch(

//         `${API_BASE_URL}/drivers/${id}/`,

//         {

//             headers: {

//                 Authorization:
//                     `Token ${localStorage.getItem("token")}`

//             }

//         }

//     );

//     const driver = await response.json();

//     document.getElementById("driverForm").innerHTML = `

//         <div class="vehicle-form">

//             <h3>Edit Driver</h3>

//             <input
//                 id="editPhone"
//                 value="${driver.phone}"
//             >

//             <input
//                 id="editLicense"
//                 value="${driver.license_number}"
//             >

//             <input
//                 id="editAddress"
//                 value="${driver.address}"
//             >
//                         <select id="editStatus">

//                 <option value="available"
//                     ${driver.status === "available" ? "selected" : ""}>
//                     Available
//                 </option>

//                 <option value="on_trip"
//                     ${driver.status === "on_trip" ? "selected" : ""}>
//                     On Trip
//                 </option>

//                 <option value="off_duty"
//                     ${driver.status === "off_duty" ? "selected" : ""}>
//                     Off Duty
//                 </option>

//             </select>

//             <br><br>

//             <button
//                 class="btn btn-warning"
//                 onclick="updateDriver(${id}, ${driver.user})">

//                 Update Driver

//             </button>

//         </div>

//     `;

// }

async function editDriver(id) {

    const response = await fetch(

        `${API_BASE_URL}/drivers/${id}/`,

        {

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const driver = await response.json();

    document.getElementById("driverForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Edit Driver</h3>

            <input
                id="editUsername"
                placeholder="Username"
                value="${driver.username}"
            >

            <input
                id="editFirstName"
                placeholder="First Name"
                value="${driver.first_name}"
            >

            <input
                id="editLastName"
                placeholder="Last Name"
                value="${driver.last_name}"
            >

            <input
                id="editEmail"
                placeholder="Email"
                value="${driver.email}"
            >

            <input
                id="editPhone"
                placeholder="Phone"
                value="${driver.phone}"
            >

            <input
                id="editLicense"
                placeholder="License Number"
                value="${driver.license_number}"
            >

            <input
                id="editAddress"
                placeholder="Address"
                value="${driver.address}"
            >

            <select id="editStatus">

                <option
                    value="available"
                    ${driver.status==="available"?"selected":""}>
                    Available
                </option>

                <option
                    value="on_trip"
                    ${driver.status==="on_trip"?"selected":""}>
                    On Trip
                </option>

                <option
                    value="off_duty"
                    ${driver.status==="off_duty"?"selected":""}>
                    Off Duty
                </option>

            </select>

            <button
                class="btn btn-warning"
                onclick="updateDriver(${driver.id})">

                Update Driver

            </button>

        </div>

    `;

}

// =======================================
// Update Driver
// =======================================

// async function updateDriver(id, userId) {

//     const response = await fetch(

//         `${API_BASE_URL}/drivers/${id}/`,

//         {

//             method: "PUT",

//             headers: {

//                 "Content-Type": "application/json",

//                 Authorization:
//                     `Token ${localStorage.getItem("token")}`

//             },

//             body: JSON.stringify({

//                 user: userId,

//                 phone:
//                     document.getElementById("editPhone").value,

//                 license_number:
//                     document.getElementById("editLicense").value,

//                 address:
//                     document.getElementById("editAddress").value,

//                 status:
//                     document.getElementById("editStatus").value

//             })

//         }

//     );

//     if (response.ok) {

//         alert("Driver Updated Successfully");

//         loadDrivers();

//     }

//     else {

//         const error = await response.json();

//         console.log(error);

//         alert("Failed to update driver.");

//     }

// }
async function updateDriver(id) {

    const response = await fetch(

        `${API_BASE_URL}/drivers/${id}/`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json",

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            },

            body:JSON.stringify({

                username:
                    document.getElementById("editUsername").value,

                first_name:
                    document.getElementById("editFirstName").value,

                last_name:
                    document.getElementById("editLastName").value,

                email:
                    document.getElementById("editEmail").value,

                phone:
                    document.getElementById("editPhone").value,

                license_number:
                    document.getElementById("editLicense").value,

                address:
                    document.getElementById("editAddress").value,

                status:
                    document.getElementById("editStatus").value

            })

        }

    );

    if(response.ok){

        alert("Driver updated successfully.");

        loadDrivers();

    }

    else{

        const error = await response.json();

        console.log(error);

        alert("Failed to update driver.");

    }

}
// =======================================
// Delete Driver
// =======================================

async function deleteDriver(id) {

    if (!confirm("Are you sure you want to delete this driver?")) {
        return;
    }

    const response = await fetch(

        `${API_BASE_URL}/drivers/${id}/`,

        {

            method: "DELETE",

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    if (response.ok) {

        alert("Driver Deleted Successfully");

        loadCounts();

        loadDrivers();

    }

    else {

        const error = await response.json();

        console.log(error);

        alert("Failed to delete driver.");

    }

}



// =======================================
// Driver Trip History
// =======================================

async function viewDriverTrips(driverId) {

    const response = await fetch(

        `${API_BASE_URL}/trips/?search=${driverId}`,

        {

            headers: {

                Authorization:
                    `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const trips = await response.json();

    let html = `

        <h3>Driver Trip History</h3>

        <table>

            <thead>

                <tr>

                    <th>Vehicle</th>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Status</th>

                </tr>

            </thead>

            <tbody>

    `;

    trips.forEach(trip => {

        html += `

            <tr>

                <td>${trip.vehicle_plate}</td>

                <td>${trip.route_name}</td>

                <td>${trip.departure_time}</td>

                <td>${trip.arrival_time}</td>

                <td>${trip.status}</td>

            </tr>

        `;

    });

    html += `

            </tbody>

        </table>

    `;

    document.getElementById("driverForm").innerHTML = html;

}