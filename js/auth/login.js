
import {
  backendURL,
  successNotification,
  errorNotification,
} from "../../utils/utils.js";

// Form Login
document.addEventListener("DOMContentLoaded", function() {

const form_login = document.getElementById("form_login");
form_login.onsubmit = async (e) => {
  e.preventDefault();

  // Disable button
  document.querySelector("#form_login button").disabled = true;
  document.querySelector("#form_login button").innerHTML = `<div class="spinner-border me-2" role="status">
  <span class="sr-only">Loading...</span>
</div> <span> Loading...</span>`;

  // Get values of form
  const formData = new FormData(form_login);

  // Fetch api user register
  const response = await fetch(backendURL + "/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();

    //Store Token
    localStorage.setItem("token", json.token);

    //store Role
    localStorage.setItem("role", json.user.role);

    form_login.reset();

    successNotification("Successfully login account.");

    //Redirect Page
      window.location.pathname = "dashboard.html";

  // // Check user role and redirect accordingly
  // if (json.user.role === "admin") {
  //   window.location.pathname = "admin_dashboard.html";
  // } else if (json.user.role === "customer") {
  //   window.location.pathname = "customer_dashboard.html";
  // } else {
  //   // Handle other roles or scenarios
  //   console.error("Unknown role: ", json.role);
  // }

//Get Response if 422 status code
  } else if (response.status == 422) {
    const json = await response.json();

    errorNotification(json.message, 5);
  }

  // Enable button
  document.querySelector("#form_login button").disabled = false;
  document.querySelector("#form_login button").innerHTML = `Sign In`;
};

});
