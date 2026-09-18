// ==========================================
// EDIT TASK JS
// ==========================================

console.log("EDIT JS LOADED");


// ==========================================
// DOM ELEMENTS
// ==========================================

const updateForm = document.querySelector("#updateTaskForm");

const formInputs = document.querySelectorAll(".form-control");


// ==========================================
// GET TASK ID FROM URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const taskId = params.get("id");

console.log("Task ID:", taskId);


// ==========================================
// CHECK TASK ID
// ==========================================

if (!taskId) {

    Swal.fire({
        icon: "error",
        title: "Task ID Missing!",
        text: "Unable to find the task."
    }).then(() => {
        window.location.href = "dashboard.html";
    });

}


// ==========================================
// TOKEN
// ==========================================

const token = localStorage.getItem("accessToken");

if (!token) {

    Swal.fire({
        icon: "error",
        title: "Login Required!",
        text: "Please login first."
    }).then(() => {
        window.location.href = "../auth/login.html";
    });

}


// ==========================================
// DATA OBJECT
// ==========================================

let data = {};


// ==========================================
// HANDLE INPUT CHANGE
// ==========================================

const handleChange = (e) => {

    const { name, value } = e.target;

    data = {
        ...data,
        [name]: value
    };

    console.log("Updated Data:", data);
};


// ==========================================
// ADD INPUT EVENT
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

        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/tasks",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "content-type": "application/json"
                }
            }
        );


        // ======================================
        // CHECK RESPONSE
        // ======================================

        if (!response.ok) {

            const errorText = await response.text();

            console.log("Server Error:", errorText);

            throw new Error(
                `Failed to get tasks: ${response.status}`
            );
        }


        // ======================================
        // JSON
        // ======================================

        const result = await response.json();

        console.log("All Tasks:", result);


        // ======================================
        // API RETURNS ARRAY DIRECTLY
        // ======================================

        const tasks = result;


        if (!Array.isArray(tasks)) {

            throw new Error(
                "Tasks data is not an array."
            );
        }


        // ======================================
        // FIND CURRENT TASK
        // ======================================

        const currentTask = tasks.find(
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
                window.location.href = "../../pages/dashboard/dashboard.html";
            });

            return;
        }


        // ======================================
        // SET DATA
        // ======================================

        data = {
            title: currentTask.title || "",
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

        console.error(
            "Get Current Task Error:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error!",
            text: error.message
        });

    }

};


// ==========================================
// RUN GET CURRENT TASK
// ==========================================

getCurrentTask();


// ==========================================
// UPDATE TASK
// ==========================================

// ==========================================
// UPDATE TASK (DESCRIPTION, PRIORITY & STATUS)
// ==========================================

updateForm.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Login Required!",
            text: "Please login first."
        });
        return;
    }

    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        // 1. UPDATE DESCRIPTION & PRIORITY
        // Uses PATCH /api/tasks/{id} (title is immutable and omitted)
        const updateDetailsResponse = await fetch(
            `https://intern-crud-task-api.onrender.com/api/tasks/${taskId}`,
            {
                method: "PATCH",
                headers,
                body: JSON.stringify({
                    description: data.description,
                    priority: data.priority
                })
            }
        );

        if (!updateDetailsResponse.ok) {
            throw new Error(`Failed to update details: ${updateDetailsResponse.status}`);
        }

        // 2. UPDATE STATUS
        // Uses dedicated status endpoint PATCH /api/tasks/{id}/status
        if (data.status) {
            const updateStatusResponse = await fetch(
                `https://intern-crud-task-api.onrender.com/api/tasks/${taskId}/status`,
                {
                    method: "PATCH",
                    headers,
                    body: JSON.stringify({
                        status: data.status
                    })
                }
            );

            if (!updateStatusResponse.ok) {
                throw new Error(`Failed to update status: ${updateStatusResponse.status}`);
            }
        }

        // SUCCESS ALERTS & REDIRECT
        Swal.fire({
            icon: "success",
            title: "Task Updated!",
            text: "Task details and status updated successfully.",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "../../pages/dashboard/task-details.html";
        });

    } catch (error) {
        console.error("Update Error:", error);
        window.location.href = '../../pages/errors/500.html';
    }
});