import {
    backendURL,
    successNotification,
    errorNotification,
    showAdminPages,
   
  } from "../../utils/utils.js";

  //show user for admin
  showAdminPages();



  getUser();
  async function getUser() {
    // Get user data
    const response = await fetch(backendURL + "/api/user", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
  
    if (response.ok) {
      const json = await response.json();
  
      // Initialize DataTable
      $('#userTable').DataTable().clear().draw();
  
      json.forEach((element) => {
        const date = element.created_at.substr(0, 10);
        const startTime = new Date(`${date}T${element.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const endTime = new Date(`${date}T${element.end_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  
        const container = `
          <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.phone}</td>
            <td>${element.organization}</td>
            <td>${element.email}</td>
            <td>${element.created_at}</td>
            <td style="min-width: 140px;"> 
              <div class="btn-group">
                <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Actions
                </button>
                <div class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#" id="btn_edit" data-id="${element.id}">Edit</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" id="btn_delete" data-id="${element.id}">Delete</a>
                  </li>
                </div>
              </div>
            </td>
          </tr>`;

          $('#userTable').DataTable().row.add($(container)).draw();
      });
  
      document.getElementById("get_data").innerHTML = container;
  
      // Add event listeners for edit and delete actions
      document.querySelectorAll("#btn_edit").forEach((element) => {
        element.addEventListener("click", editAction);
      });
  
      document.querySelectorAll("#btn_delete").forEach((element) => {
        element.addEventListener("click", deleteAction);
      });
  
      // Initialize DataTable
      $(document).ready(function() {
        $('#userTable').DataTable();
      });
    } else {
      errorNotification("HTTP-Error: " + response.status);
    }
  }
  
  