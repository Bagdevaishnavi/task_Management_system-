// Track the login form inputs so the submitted values can be captured as the user types.
const logindata = document.querySelectorAll('.form-control');
const loginsubmit = document.querySelector('#loginform');
console.log(loginsubmit);

// import { Baseurl } from "../config/api.js";

let data = {};

// Maintain the current form payload so the login request always sends the latest user input.
const handlechange = (e) => {
    const { name, value } = e.target
    data = {
        ...data,
        [name]: value
    }

    console.log(data);
}

logindata.forEach((input) => {
    input.addEventListener('input', handlechange);
})
handlechange;

// Submit the user's credentials and redirect to the dashboard only after a successful authentication response.
loginsubmit.addEventListener("submit", async (e) => {

    
    e.preventDefault();

     if (!loginsubmit.checkValidity()) {
        loginsubmit.classList.add("was-validated");
        return;
    }


    console.log("Login Data:", data);


    try {
            showLoader("Logging in...");
        // Send the authentication request and receive the JWT used for subsequent API calls.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        console.log("API Response:", result);
        console.log("Status:", response.status);

        // Handle unsuccessful login responses without exposing the user to a broken session state.
        if (!response.ok) {

                Swal.fire({
                    icon: "error",
                    title: "Login Failed!",
                    text: result.message || "Invalid email or password"
                });

            return;
        }

        // Persist the token so authenticated actions can use it across the application.
        localStorage.setItem(
            "accessToken",
            result.accessToken
        );

        Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back! 🎉"
        }).then(() => {

            window.location.href =
                "../../pages/dashboard/dashboard.html";

        });

    } catch (error) {

        console.error("Server Error:", error);
        window.location.href = '../../pages/errors/500.html'

    }finally{
            hideLoader();
    }

});
