
// Clear the active user session only after the logout confirmation is accepted by the user.
const logoutBtn = document.querySelector("#logout-btn");

logoutBtn.addEventListener("click", () => {

    Swal.fire({
        icon: "question",
        title: "Logout?",
        text: "Are you sure you want to logout?",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "Cancel"
    }).then((result) => {

        if (result.isConfirmed) {

             

            // Remove the stored JWT so future authenticated requests are rejected until the user logs in again.
            localStorage.removeItem("accessToken");

          

            // Inform the user that the session was terminated before routing them back to the login screen.
            Swal.fire({
                icon: "success",
                title: "Logged Out!",
                text: "You have been logged out successfully.",
                timer: 1500,
                showConfirmButton: false
                
            }).then(() => {

                // Redirect the user to the authentication flow after a successful sign-out.
                window.location.href = "../../pages/auth/login.html";

            });
        }

    });

});
