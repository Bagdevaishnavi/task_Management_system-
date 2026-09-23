
// These DOM nodes are populated with the authenticated user's profile information on page load.
const username1 = document.querySelector(".profile-name1");
const usergender1 = document.querySelector(".profile-gender-1");

const username2 = document.querySelector(".profile-name2");
const usergender2 = document.querySelector(".profile-gender-2");

const usermobilenumber = document.querySelector(".personal-mobile-number");
const useraddress = document.querySelector(".profile-Address");
const usercity = document.querySelector(".profile-city");
const userunivercity = document.querySelector(".profile-univercity");

const usergurdiansname = document.querySelector(".profile-gurdian-name");
const userguurdiansnumber = document.querySelector(".profile-gurdian-number");

const userimg = document.querySelector("#profile-image");

// Fetch the current profile and map the response into the user-facing fields on the page.
const profiledetails = async () => {

    try {

        const token = localStorage.getItem("accessToken");

        // Require an authenticated session before loading personal profile data.
        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            });

            window.location.href = '../../pages/auth/login.html'
            
        }

        // Retrieve the profile from the backend using the stored JWT for authorization.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/profile",
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        console.log("Profile API Response:", result);

        // Handle unsuccessful API responses before continuing with UI rendering.
        if (!response.ok) {

            if (response.status === 404) {

                window.location.href =
                    "../../pages/errors/404.html";

                return;
            }

            Swal.fire({
                icon: "error",
                title: "Failed!",
                text:
                    result.error ||
                    result.message ||
                    "Unable to fetch profile."
            });

            return;
        }

        // The API returns a single user object, which is then mapped to the relevant text fields.
        const user = result;

        console.log("Updated User Data:", user);

        // Populate the profile surface with the latest values returned by the backend.
        if (username1) {
            username1.textContent =
                user.fullName || "Not provided";
        }

        if (usergender1) {
            usergender1.textContent =
                user.gender || "Not provided";
        }

        if (username2) {
            username2.textContent =
                user.fullName || "Not provided";
        }

        if (usergender2) {
            usergender2.textContent =
                user.gender || "Not provided";
        }

        if (usermobilenumber) {
            usermobilenumber.textContent =
                user.personalMobileNumber || "Not provided";
        }

        if (useraddress) {
            useraddress.textContent =
                user.address || "Not provided";
        }

        if (usercity) {
            usercity.textContent =
                user.city || "Not provided";
        }

        if (userunivercity) {
            userunivercity.textContent =
                user.universityName || "Not provided";
        }

        if (usergurdiansname) {
            usergurdiansname.textContent =
                user.guardianName || "Not provided";
        }

        if (userguurdiansnumber) {
            userguurdiansnumber.textContent =
                user.guardianPhoneNumber || "Not provided";
        }

        // Use the backend-provided avatar URL when available; otherwise fall back to a default user placeholder.
        if (userimg) {

            userimg.src =
                user.profileUrl ||
                "https://static.sniffspot.com/packs/img/profile-256.3e170b1d3dde1148.png";
        }

    } catch (error) {

        console.error("Server Error:", error);

        window.location.href =
            "../../pages/errors/500.html";
    }
};

// Load the profile as soon as the page script runs so the user sees their information immediately.
profiledetails();
