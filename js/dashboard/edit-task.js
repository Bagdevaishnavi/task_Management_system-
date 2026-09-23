
// ==========================================
// EDIT TASK JS
// ==========================================

console.log("EDIT TASK JS LOADED");

// ==========================================
// DOM ELEMENTS
// ==========================================

const updateForm = document.querySelector("#updateTaskForm");
const formInputs = updateForm.querySelectorAll(".form-control");
const cancel = document.querySelector('.btn-light-cancel');
// console.log(cancel);

// ==========================================
// API URL
// ==========================================

const API_URL = "https://intern-crud-task-api.onrender.com/api/tasks";

// ==========================================
// GET TASK ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);
const taskId = params.get("id");

console.log("Task ID:", taskId);

// ==========================================
// TOKEN
// ==========================================

const token = localStorage.getItem("accessToken");

// ==========================================
// TASK DATA
// ==========================================

let data = {
    description: "",
    priority: "",
    status: ""
};

// ==========================================
// VALIDATE PAGE
// ==========================================


if (cancel && taskId) {
    cancel.href =
        `../../pages/dashboard/task-details.html?id=${taskId}`;
}

const validatePage = () => {

    // Check Task ID
    if (!taskId) {

        Swal.fire({
            icon: "error",
            title: "Task ID Missing!",
            text: "Unable to find the requested task."
        }).then(() => {
            window.location.href = "dashboard.html";
        });

        return false;
    }

    // Check Token
    if (!token) {

        Swal.fire({
            icon: "error",
            title: "Login Required!",
            text: "Please login first."
        }).then(() => {
            window.location.href = "../auth/login.html";
        });

        return false;
    }

    return true;
};

// ==========================================
// HANDLE INPUT CHANGE
// ==========================================

const handleChange = (event) => {

    const { name, value } = event.target;

    data[name] = value;

    console.log("Updated Data:", data);
};

// ==========================================
// ADD INPUT EVENTS
// ==========================================

formInputs.forEach((input) => {

    input.addEventListener("input", handleChange);

    input.addEventListener("change", handleChange);

});

// ==========================================
// GET CURRENT TASK
// ==========================================

const getCurrentTask = async () => {

    try {

        console.log("Getting current task...");

        const response = await fetch(API_URL, {
            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // ======================================
        // CHECK RESPONSE
        // ======================================

        if (!response.ok) {

            throw new Error(
                `Failed to load tasks. Status: ${response.status}`
            );
        }

        // ======================================
        // GET JSON
        // ======================================

        const result = await response.json();

        console.log("All Tasks:", result);

        // ======================================
        // VALIDATE ARRAY
        // ======================================

        if (!Array.isArray(result)) {

            throw new Error(
                "Invalid task data received from server."
            );
        }

        // ======================================
        // FIND CURRENT TASK
        // ======================================

        const currentTask = result.find(
            (task) =>
                task._id === taskId ||
                task.id === taskId
        );

        console.log("Current Task:", currentTask);

        // ======================================
        // TASK NOT FOUND
        // ======================================

        if (!currentTask) {

            Swal.fire({
                icon: "error",
                title: "Task Not Found!",
                text: "The requested task does not exist."
            }).then(() => {

                window.location.href =
                    "../../pages/dashboard/dashboard.html";

            });

            return;
        }

        // ======================================
        // STORE TASK DATA
        // ======================================

        data = {
            description: currentTask.description || "",
            priority: currentTask.priority || "",
            status: currentTask.status || ""
        };

        console.log("Form Data:", data);

        // ======================================
        // FILL FORM
        // ======================================

        formInputs.forEach((input) => {

            if (data[input.name] !== undefined) {

                input.value = data[input.name];

            }

        });

    } catch (error) {

        console.error("Get Current Task Error:", error);

        Swal.fire({
            icon: "error",
            title: "Unable to Load Task!",
            text: error.message || "Something went wrong."
        });

    }
};

// ==========================================
// UPDATE TASK
// ==========================================

updateForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // ======================================
    // FORM VALIDATION
    // ======================================

    if (!updateForm.checkValidity()) {

        updateForm.classList.add("was-validated");

        return;
    }

    // ======================================
    // TOKEN CHECK
    // ======================================

    const currentToken =
        localStorage.getItem("accessToken");

    if (!currentToken) {

        Swal.fire({
            icon: "error",
            title: "Login Required!",
            text: "Please login first."
        }).then(() => {

            window.location.href =
                "../auth/login.html";

        });

        return;
    }

    // ======================================
    // DISABLE SUBMIT BUTTON
    // ======================================

    const submitButton =
        updateForm.querySelector("button[type='submit']");

    if (submitButton) {
        submitButton.disabled = true;
    }

    try {

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`
        };

        // ======================================
        // STEP 1
        // UPDATE DESCRIPTION + PRIORITY
        // ======================================

        console.log("Updating task details...");

        const updateDetailsResponse = await fetch(
            `${API_URL}/${taskId}`,
            {
                method: "PATCH",
                headers: headers,

                body: JSON.stringify({
                    description: data.description,
                    priority: data.priority
                })
            }
        );

        // ======================================
        // CHECK DETAILS RESPONSE
        // ======================================

        if (!updateDetailsResponse.ok) {

            throw new Error(
                `Failed to update task details. Status: ${updateDetailsResponse.status}`
            );
        }

        console.log("Task details updated.");

        // ======================================
        // STEP 2
        // UPDATE STATUS
        // ======================================

        console.log("Updating task status...");

        const updateStatusResponse = await fetch(
            `${API_URL}/${taskId}/status`,
            {
                method: "PATCH",
                headers: headers,

                body: JSON.stringify({
                    status: data.status
                })
            }
        );

        // ======================================
        // CHECK STATUS RESPONSE
        // ======================================

        if (!updateStatusResponse.ok) {

            throw new Error(
                `Failed to update task status. Status: ${updateStatusResponse.status}`
            );
        }

        console.log("Task status updated.");

        // ======================================
        // SUCCESS
        // ======================================

        await Swal.fire({
            icon: "success",
            title: "Task Updated!",
            text: "Task updated successfully.",
            timer: 1500,
            showConfirmButton: false
        });

        // ======================================
        // REDIRECT WITH TASK ID
        // ======================================

        window.location.href =
            `../../pages/dashboard/task-details.html?id=${taskId}`;

    } catch (error) {

        console.error("Update Task Error:", error);

        // ======================================
        // ERROR ALERT
        // ======================================

        Swal.fire({
            icon: "error",
            title: "Update Failed!",
            text: error.message ||
                "Unable to update the task."
        });

    } finally {

        // ======================================
        // ENABLE BUTTON AGAIN
        // ======================================

        if (submitButton) {
            submitButton.disabled = false;
        }

    }

});

// ==========================================
// PAGE INITIALIZATION
// ==========================================

if (validatePage()) {

    getCurrentTask();

}
