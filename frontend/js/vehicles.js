// =======================================
// Vehicle Module
// =======================================

async function loadVehicles() {

    const content = document.getElementById("content");

    content.innerHTML = `

        <div class="page-header">

            <h2>Vehicle Management</h2>

            <button class="btn btn-success" onclick="showVehicleForm()">
                + Add Vehicle
            </button>

        </div>

        <div id="vehicleForm"></div>
  <div class="table-toolbar">

    <input
        type="text"
        id="searchVehicle"
        placeholder="🔍 Search by plate, manufacturer or model..."
        onkeyup="filterVehicles()"
    >

    <select
        id="statusFilter"
        onchange="filterVehicles()">

        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="maintenance">Maintenance</option>
        <option value="in_trip">In Trip</option>

    </select>

    <button
        class="btn btn-primary"
        onclick="resetVehicleFilter()">

        Reset

    </button>

</div>

<p id="vehicleResults"></p>

        <table>
        

            <thead>

                <tr>

                    <th>Plate Number</th>
                    <th>Manufacturer</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody id="vehicleTableBody"></tbody>

        </table>

    `;

    await fetchVehicles();

}



// =======================================
// Fetch Vehicles
// =======================================


function filterVehicles(){

    const search =
        document.getElementById("searchVehicle")
            .value
            .toLowerCase();

    const status =
        document.getElementById("statusFilter")
            .value
            .toLowerCase();

    const rows =
        document.querySelectorAll("#vehicleTableBody tr");

    let visible = 0;

    rows.forEach(row=>{

        const plate =
            row.children[0].innerText.toLowerCase();

        const manufacturer =
            row.children[1].innerText.toLowerCase();

        const model =
            row.children[2].innerText.toLowerCase();

        const year =
            row.children[3].innerText.toLowerCase();

        const rowStatus =
            row.children[4].innerText.toLowerCase();

        const matchesSearch =

            plate.includes(search)

            ||

            manufacturer.includes(search)

            ||

            model.includes(search)

            ||

            year.includes(search);

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

    document.getElementById("vehicleResults").innerHTML =

        `${visible} vehicle(s) found`;

}

function resetVehicleFilter(){

    document.getElementById("searchVehicle").value="";

    document.getElementById("statusFilter").value="";

    filterVehicles();

}

async function fetchVehicles() {

    const response = await fetch(

        `${API_BASE_URL}/vehicles/`,

        {

            headers: {

                Authorization: `Token ${localStorage.getItem("token")}`

            }

        }

    );

    const vehicles = await response.json();

    const tbody = document.getElementById("vehicleTableBody");

    tbody.innerHTML = "";

    vehicles.forEach(vehicle => {

        tbody.innerHTML += `

            <tr>

                <td>${vehicle.plate_number}</td>

                <td>${vehicle.manufacturer}</td>

                <td>${vehicle.model}</td>

                <td>${vehicle.year}</td>

                <td>${vehicle.status}</td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editVehicle(${vehicle.id})">

                        Edit

                    </button>
 <button
        class="btn btn-primary"
        onclick="showInspectionForm(${vehicle.id})">

        Inspection

    </button>

    <button
        class="btn btn-success"
        onclick="loadInspections(${vehicle.id})">

        History

    </button>
                    <button
                        class="btn btn-danger"
                        onclick="deleteVehicle(${vehicle.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}



// =======================================
// Add Vehicle Form
// =======================================

function showVehicleForm() {

    document.getElementById("vehicleForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Add Vehicle</h3>

            <input
                id="plate"
                placeholder="Plate Number"
            >

            <input
                id="manufacturer"
                placeholder="Manufacturer"
            >

            <input
                id="model"
                placeholder="Model"
            >

            <input
                id="year"
                type="number"
                placeholder="Year"
            >

            <select id="status">

                <option value="available">
                    Available
                </option>

                <option value="maintenance">
                    Maintenance
                </option>

            </select>

            <br><br>

            <button
                class="btn btn-primary"
                onclick="saveVehicle()">

                Save Vehicle

            </button>

            <hr>

        </div>

    `;

}



// =======================================
// Save Vehicle
// =======================================

async function saveVehicle() {

    const response = await fetch(

        `${API_BASE_URL}/vehicles/`,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Token ${localStorage.getItem("token")}`

            },

            body: JSON.stringify({

                plate_number:
                    document.getElementById("plate").value,

                manufacturer:
                    document.getElementById("manufacturer").value,

                model:
                    document.getElementById("model").value,

                year:
                    document.getElementById("year").value,

                status:
                    document.getElementById("status").value

            })

        }

    );

    if (response.ok) {

        alert("Vehicle Added Successfully");

        loadCounts();

        loadVehicles();

    }

    else {

        const error = await response.json();

        console.log(error);

        alert("Failed to save vehicle.");

    }

}



// =======================================
// Placeholder
// =======================================

async function editVehicle(id) {

    const response = await fetch(
        `${API_BASE_URL}/vehicles/${id}/`,
        {
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
            }
        }
    );

    const vehicle = await response.json();

    document.getElementById("vehicleForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Edit Vehicle</h3>

            <input id="editPlate" value="${vehicle.plate_number}">
            <input id="editManufacturer" value="${vehicle.manufacturer}">
            <input id="editModel" value="${vehicle.model}">
            <input id="editYear" type="number" value="${vehicle.year}">

            <select id="editStatus">
                <option value="available" ${vehicle.status === "available" ? "selected" : ""}>Available</option>
                <option value="maintenance" ${vehicle.status === "maintenance" ? "selected" : ""}>Maintenance</option>
            </select>

            <br><br>

            <button
                class="btn btn-warning"
                onclick="updateVehicle(${id})">

                Update Vehicle

            </button>

        </div>

    `;
}



async function deleteVehicle(id) {

    if (!confirm("Are you sure you want to delete this vehicle?")) {
        return;
    }

    const response = await fetch(
        `${API_BASE_URL}/vehicles/${id}/`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
            }
        }
    );

    if (response.ok) {
        loadCounts();
        loadVehicles();
    } else {
        alert("Failed to delete vehicle.");
    }
}

async function updateVehicle(id) {

    const response = await fetch(
        `${API_BASE_URL}/vehicles/${id}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                plate_number: document.getElementById("editPlate").value,
                manufacturer: document.getElementById("editManufacturer").value,
                model: document.getElementById("editModel").value,
                year: document.getElementById("editYear").value,
                status: document.getElementById("editStatus").value
            })
        }
    );

    if (response.ok) {
        alert("Vehicle updated successfully.");
        loadCounts();
        loadVehicles();
    } else {
        alert("Failed to update vehicle.");
    }
}

function showInspectionForm(vehicleId){

    document.getElementById("vehicleForm").innerHTML = `

        <div class="vehicle-form">

            <h3>Upload Inspection</h3>

            <input
                type="file"
                id="inspectionPhoto"
            >

            <br><br>

            <textarea
                id="inspectionRemarks"
                placeholder="Remarks"
            ></textarea>

            <br><br>

            <button
                onclick="uploadInspection(${vehicleId})">

                Upload

            </button>

        </div>

    `;

}

async function uploadInspection(vehicleId){

    const formData = new FormData();

    formData.append(
        "vehicle",
        vehicleId
    );

    formData.append(
        "photo",
        document.getElementById("inspectionPhoto").files[0]
    );

    formData.append(
        "remarks",
        document.getElementById("inspectionRemarks").value
    );

    const response = await fetch(

        `${API_BASE_URL}/vehicle-inspections/`,

        {

            method:"POST",

            headers:{
                Authorization:`Token ${localStorage.getItem("token")}`
            },

            body:formData

        }

    );

    if(response.ok){

        alert("Inspection uploaded.");

        loadVehicles();

    }else{

        alert("Upload failed.");

    }

}

async function loadInspections(vehicleId){

    const response = await fetch(

        `${API_BASE_URL}/vehicle-inspections/`,

        {

            headers:{
                Authorization:`Token ${localStorage.getItem("token")}`
            }

        }

    );

    const inspections = await response.json();

    const vehicleInspections =
        inspections.filter(i => i.vehicle == vehicleId);

    let html = `

        <h3>Inspection History</h3>

        <table>

            <tr>

                <th>Date</th>

                <th>Remarks</th>

                <th>Photo</th>

            </tr>

    `;

    vehicleInspections.forEach(i=>{

        html += `

            <tr>

                <td>${i.inspection_date}</td>

                <td>${i.remarks}</td>

                <td>

                  

                    <a
        href="${i.photo}"
        target="_blank">

        View

    </a>

                </td>

            </tr>

        `;

    });

    html += "</table>";

    document.getElementById("vehicleForm").innerHTML = html;

}