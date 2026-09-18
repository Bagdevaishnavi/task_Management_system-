// Track the task form values in memory so the payload stays aligned with the latest user input.
const taskdata = document.querySelectorAll('.form-control');
const addtaskbtn = document.querySelector('.task-form');

let data = {};

// Update the in-memory task payload whenever a form field changes, keeping the latest values ready for submission.
const handlechange = (e) => {
    const { name, value } = e.target;

    data = {
        ...data,
        [name]: value
    };

    console.log("Task Data:", data);
};
handlechange

taskdata.forEach((input) => {
    input.addEventListener('input', handlechange);
});

// Validate the session and create the task only when the user is authenticated and the API accepts the payload.
addtaskbtn.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!addtaskbtn.checkValidity()) {
        loginsubmit.classList.add("was-validated");
        return;
    }

    console.log("Task Data:", data);

    try {

        // Retrieve the stored JWT to authorize creation requests against protected task endpoints.
        const token = localStorage.getItem('accessToken');

        // Redirect unauthenticated users to the login screen before attempting to create a task.
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            }).then(() => {
                window.location.href = '../../pages/auth/login.html';
            });

            return;
        }

        // Post the task payload to the backend so the new item is saved under the logged-in user.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/tasks",
            {
                method: "POST",

                headers: {  
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        console.log("API Response:", result);
        console.log("Status:", response.status);

        // Handle unsuccessful task creation responses and route obvious missing-resource cases to the 404 page.
        if (!response.ok) {
              if (response.status === 404) {
                window.location.href = '../../pages/errors/404.html';
                return;
            }

            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: result.error || "Unable to add task."
            });

            return;
        }

        // Inform the user of success and send them to the task list to confirm the new item is visible.
        Swal.fire({
            icon: "success",
            title: "Task Added!",
            text: "Task created successfully 🎉"
        }).then(() => {

            window.location.href =
                "../../pages/dashboard/task-details.html";

        });

    } catch (error) {

        console.error("Server Error:", error);

         window.location.href = '../../pages/errors/500.html'

    }
});