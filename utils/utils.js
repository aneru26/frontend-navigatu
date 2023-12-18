import { setRouter } from "../router/router.js";

// Set Router
setRouter();

// Backend URL
const backendURL = "http://127.0.0.1:8000";


function showAdminPages(){
  if(localStorage.getItem("role") == "admin"){
    document.getElementById(
      "nav_admin_pages"
      ).innerHTML = `<li class="nav-item">
    <a href="users.html" class="nav-link">User</a>
  </li>`;
  }
}

// Notifications
function successNotification(message, seconds = 0) {
  document.querySelector(".alert-success").classList.remove("d-none");
  document.querySelector(".alert-success").classList.add("d-block");
  document.querySelector(".alert-success").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-success").classList.remove("d-block");
      document.querySelector(".alert-success").classList.add("d-none");
    }, seconds * 1000);
  }
}

function errorNotification(message, seconds = 0) {
  document.querySelector(".alert-danger").classList.remove("d-none");
  document.querySelector(".alert-danger").classList.add("d-block");
  document.querySelector(".alert-danger").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-danger").classList.remove("d-block");
      document.querySelector(".alert-danger").classList.add("d-none");
    }, seconds * 1000);
  }
}

export { backendURL, showAdminPages , successNotification, errorNotification };