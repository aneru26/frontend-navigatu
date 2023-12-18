import {
    backendURL,
    successNotification,
    errorNotification,
    showAdminPages,
   
  } from "../../utils/utils.js";
  
  //userforadmin
  showAdminPages();

  // Get All Appointment
getDatas();

async function getDatas() {
  //if the role is admin
  const isAdmin = localStorage.getItem("role") === "admin";

  // Choose the appropriate API endpoint based on the user's role
  const apiEndpoint = isAdmin ? "/api/allappointment" : "/api/appointment";
  
  //get Appointment
  const response = await fetch(backendURL + apiEndpoint, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();

    // Initialize DataTable
    $('#appointmentTable').DataTable().clear().draw();

    json.forEach((element) => {
      const date = element.created_at.substr(0, 10);
      const startTime = new Date(`${date}T${element.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
      const endTime = new Date(`${date}T${element.end_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

      const container = `
        <tr>
          <td>${element.appointment_no}</td>
          <td>${element.area}</td>
          <td>${element.event_date}</td>
          <td>${element.start_time}</td>
          <td>${element.end_time}</td>
          <td>${element.created_at}</td>
          <td style="min-width: 140px;"> 
            <div class="btn-group">
              <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Actions
              </button>
              <div class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="#" id="btn_edit" data-id="${element.appointment_no}">Edit</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" id="btn_delete" data-id="${element.appointment_no}">Delete</a>
                </li>
              </div>
            </div>
          </td>
        </tr>`;

      $('#appointmentTable').DataTable().row.add($(container)).draw();
    });

    // Add event listeners for edit and delete actions
    document.querySelectorAll("#btn_edit").forEach((element) => {
      element.addEventListener("click", editAction);
    });

    document.querySelectorAll("#btn_delete").forEach((element) => {
      element.addEventListener("click", deleteAction);
    });
  } else {
    errorNotification("HTTP-Error: " + response.status);
  }
}


 // Create/Update Appointment
 const appointment_form = document.getElementById("appointment_form");
 appointment_form.onsubmit = async (e) => {
   e.preventDefault();
 
 
   //Disable Button
   document.querySelector("#appointment_form button[type='submit']").disabled = true;
   document.querySelector("#appointment_form button[type='submit'").innerHTML = `<div class="spinner-border me-2" role="status">
   <span class="sr-only">Loading...</span>
 </div> <span> Loading...</span>`;


 // Get values from the form data
 const formData = new FormData(appointment_form);
 

 let response;

 //check for_update id if empty
 if(for_update_id == "") {
 
   //Fetch Api
      response = await fetch( backendURL + "/api/appointment",
       {
         method:"POST",
         headers: {
           Accept: "application/json",
           Authorization: "Bearer " + localStorage.getItem("token"),
         },
         body: formData,
       }
     );
 }
 //else for update
 else {
      //Fetch Api
      response = await fetch( backendURL + "/api/appointment/" + for_update_id,
       {
         method:"PUT",
         headers: {
           Accept: "application/json",
           Authorization: "Bearer " + localStorage.getItem("token"),
         },
         body: formData,
       }
     );

 }
 
 
 // Get response if 200-299 status code
   if (response.ok) {
     const json = await response.json();
     console.log(json);
    //reset form
     appointment_form.reset();

     //reset for_update_id
     for_update_id = "";

     successNotification(
      "Successfully " +
        (for_update_id == "" ? "created" : "updated") +
        " Appointment.",
      10
    );
  
    //reload page
     getDatas();
 
 
   } 
   // Get response if 422 status code
   else if (response.status == 422) {
     const json = await response.json();
     console.error(json);
     errorNotification(json.message, 10);
   }
 
  // Enable button
   document.querySelector("#appointment_form button").disabled = false;
   document.querySelector("#appointment_form button").innerHTML = "Submit";
 };
 

// Delete Appointment
const deleteAction = async (e) => {
  console.log("Delete action triggered");
  //confirmation
  if (confirm("Are you sure you want to delete?")) {

    //get id from data-id attribute within the delete
    const id = e.target.getAttribute("data-id");


      //Fetch Api
    const response = await fetch ( backendURL + "/api/appointment/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    // Get response if 200-299 status code
    if (response.ok) {
      // const json = await response.json();
      // console.log(json);

      successNotification("Successfully Deleted Appointment", 5);

      

      //remove the data
      document.querySelector(`.custom-class[data-id="${id}"]`).remove();
      

    } else {
      errorNotification(json.message, 5);
    }
  }
};

 // Update Message
 const editAction = async (e) => {
  const id = e.target.getAttribute("data-id");

  showData(id)

  document.getElementById("show_modal").click();
 
};
//to store appointment id
let for_update_id = "";

// Show Data
const showData = async (id) => {


  //feth api
  const response = await fetch(backendURL + "/api/appointment/" + id, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  //if response is 200
  if (response.ok) {
    const json = await response.json();
    console.log(json)

    //for the appointmen id
    for_update_id = json.appointment_no;
    //get the date by its ID
    document.getElementById("area").value = json.area;
    document.getElementById("start_time").value = json.start_time;
    document.getElementById("end_time").value = json.end_time;
    document.getElementById("event_date").value = json.event_date;  

    //change button to update
    document.querySelector("#appointment_form button[type='submit']").innerHTML = "Update Appointment";
  } 
  //if response is 422
  else {
    errorNotification("Unable to show!");
  }
};

