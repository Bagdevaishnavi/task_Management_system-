// Capture the signup form values as the user enters them so the payload stays current before submission.
const logindata = document.querySelectorAll('.form-control');
const signup = document.querySelector('#signupForm');
console.log(signup);

// import { Baseurl } from "../config/api.js";

let data = {};

// Build the payload object used by the registration request, keeping both the latest values and previous fields intact.
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

// Register the new account and immediately sign the user in once the backend returns a valid access token.
signup.addEventListener("submit", async (e) => {

    e.preventDefault();
    if (!signup.checkValidity()) {
        signup.classList.add("was-validated");
        return;
    }

    console.log("Login Data:", data);

    try {

        showLoader("Account is creating....");
        // Send the signup request to create the user account and receive the JWT for the app session.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/auth/signup",
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

        // Surface validation failures from the API without redirecting the user to a successful state.
        if (!response.ok) {

            Swal.fire({
                icon: "error",
                title: "sign up Failed!",
                text: result.error || "Invalid email or password"
            });

            return;
        }

        // Store the newly issued token so the user can access protected task and profile endpoints.
        localStorage.setItem(
            "accessToken",
            result.accessToken
        );

        Swal.fire({
            icon: "success",
            title: "sign up Successful!",
            text: "congtatulation 🎉"
        }).then(() => {

            window.location.href =
                "../../pages/auth/login.html";

        });

    } catch (error) {

        console.error("Server Error:", error);

           window.location.href = '../../pages/errors/500.html'

    }finally{
        hideLoader();
    }

});
