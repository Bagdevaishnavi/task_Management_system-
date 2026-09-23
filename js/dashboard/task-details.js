// This container is where every task card is rendered for the task details page.
const task_container = document.querySelector("#task-detail-container");

console.log(task_container);

// Fetch the authenticated user's tasks, render them as cards, and attach delete actions via event delegation.
const getalltasks = async () => {

    try {

        const token = localStorage.getItem("accessToken");

        // Redirect unauthenticated users before they can access task data.
        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            }).then(() => {
                window.location.href = "../../pages/auth/login.html";
            });

            return;
        }

        // Request the full task list for the logged-in user so the page can display every active item.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/tasks",
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        console.log("All Tasks:", result);

        // Surface backend failures early to avoid rendering a broken task list.
        if (!response.ok) {
            if (response.status === 404) {
                window.location.href = '../../pages/errors/404.html';
                return;
            }
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: result.message || "Unable to fetch tasks."
            });

            return;
        }

        // The API returns an array of task objects; this is the data source for the dashboard cards.
        const tasks = result;

        console.log("Tasks Array:", tasks);

        // Guard against malformed responses before attempting to render the page.
        if (!tasks || !Array.isArray(tasks)) {

            console.log("Tasks data is not an array:", tasks);

            Swal.fire({
                icon: "error",
                title: "Invalid Data!",
                text: "Tasks data was not found."
            });

            return;
        }

        // Clear stale content before inserting the latest task list from the API.
        task_container.innerHTML = "";

        // Render each task as a self-contained card with status, priority, description, and actions.
        // Show an empty-state message when the user has not created any tasks.
        if (tasks.length === 0) {

            task_container.innerHTML = `
        <div class="no-tasks-container text-center py-5">

            <div class="no-tasks-icon mb-3">
                <i class="bi bi-clipboard-x"></i>
            </div>

            <h3 class="fw-semibold">
                No Tasks Created Yet
            </h3>

            <p class="text-muted mb-4">
                You haven't created any tasks yet.
                Create your first task to get started.
            </p>

            <a
                href="../../pages/dashboard/add-task.html"
                class="btn btn-brand"
            >
                <i class="bi bi-plus-lg me-2"></i>
                Create Task
            </a>

        </div>
    `;

            return;
        } else {
            tasks.forEach((element) => {

                const {
                    title,
                    status,
                    priority,
                    description,
                    id
                } = element;

                // Map backend status values to the icon and CSS class expected by the UI.
                const statusValue = String(status || '')
                    .toLowerCase()
                    .replace(/[_-]/g, ' ');

                let statusIcon = 'bi-clock';
                let statusClass = 'pending';

                if (statusValue.includes('progress')) {

                    statusIcon = 'bi-arrow-repeat';
                    statusClass = 'in-progress';

                }
                else if (
                    statusValue.includes('complete') ||
                    statusValue === 'done'
                ) {

                    statusIcon = 'bi-check-circle';
                    statusClass = 'completed';

                }

                task_container.innerHTML += `

                <div class="card m-3 p-4">

                    <div class="task-details-heading">

                        <div class="task-title-wrap">

                            <span class="detail-icon">
                                <i class="bi bi-clipboard-check"></i>
                            </span>

                            <div>

                                <p class="date mb-1">
                                    TASK
                                </p>

                                <h2>
                                    ${title}
                                </h2>

                            </div>

                        </div>

                        <span class="status-badge ${statusClass}">

                            <i class="bi ${statusIcon}"></i>

                            ${status}

                        </span>


                    </div>


                    <div class="task-details-grid simple-task-details">

                        <div class="detail-block">

                            <span class="detail-label">

                                <i class="bi bi-bar-chart"></i>

                                Priority

                            </span>

                            <strong class="priority-value medium">

                                ${priority}

                            </strong>

                        </div>

                    </div>


                    <div class="task-description">

                        <h3>
                            Description
                        </h3>

                        <p>
                            ${description}
                        </p>

                    </div>


                    <div class="task-detail-actions">

                        <a 
                            href="../../pages/dashboard/edit-task.html?id=${id}"
                            class="btn btn-brand"
                        >

                            <i class="bi bi-pencil"></i>

                            Edit task

                        </a>


                        <button 
                            type="button"
                            class="btn btn-light-cancel deletebtn"
                            data-id="${id}"
                        >

                            <i class="bi bi-trash"></i>

                            DELETE

                        </button>

                    </div>

                </div>

            `;

            });
        }


    } catch (error) {

        console.error("Server Error:", error);

        window.location.href = '../../pages/errors/500.html'

    }

};
getalltasks();

// Handle task actions using event delegation so delete buttons work even when cards are re-rendered.
task_container.addEventListener('click', async (e) => {
    const deleteButton = e.target.closest(".deletebtn");

    if (!deleteButton) return;

    const taskId = deleteButton.dataset.id;
    console.log("Task id :", taskId);

    // Ask the user for confirmation before permanently deleting the task and its data.
    const reson = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (!reson.isConfirmed) {
        return;
    }
    try {

        const token = localStorage.getItem("accessToken");

        // Prevent unauthorized deletion attempts by checking for an active session token.
        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            }).then(() => {
                window.location.href = "../../pages/auth/login.html";
            });

            return;

        }


        // Delete the selected task through the API endpoint identified by its task ID.
        const response = await fetch(
            `https://intern-crud-task-api.onrender.com/api/tasks/${taskId}`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        // ===================================================== // HANDLE 204 NO CONTENT // =====================================================
        if (response.status === 204) { Swal.fire({ icon: "success", title: "Task Deleted!", text: "Task has been deleted successfully." }).then(() => { window.location.href = "../../pages/dashboard/dashboard.html"; }); return; }

        const result = await response.json();

        console.log("DELETE RESPONSE:", result);

        // =========================
        // CHECK RESPONSE
        // =========================

        if (!response.ok) {
            if (response.status === 404) {
                window.location.href = '../../pages/errors/404.html';
                return;
            }

            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: result.message || "failed to delete task."
            });

            return;
        }

        Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Task deleted successfully.",
            timer: 1500,
            showConfirmButton: false
        });

        getalltasks();

    } catch (error) {
        console.error("Delete Error:", error);
        window.location.href = '../../pages/errors/500.html'

    }

})


