// Track the profile form inputs so the latest user edits are captured before submission.
const userdata = document.querySelectorAll(".form-control");
const profileImage = document.querySelector("#profileImage");
const editprofilebtn = document.querySelector("#sumbit-btn");

console.log(userdata);
console.log(editprofilebtn);

let data = {};

// Keep the form payload updated as the user edits personal and contact information.
const handlechange = (e) => {

    const { name, value } = e.target;

    data = {
        ...data,
        [name]: value
    };

    console.log("Form Data:", data);
};  

// Listen to both typing and change events so the state stays synchronized with the form.
userdata.forEach((input) => {

    input.addEventListener("input", handlechange);
    input.addEventListener("change", handlechange);

});

// Update the profile with validated input and optional image upload data for the authenticated user.
editprofilebtn.addEventListener("click", async (e) => {

    e.preventDefault();

    try {

        // Require a valid access token before sending any profile update request.
        const token = localStorage.getItem("accessToken");

        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            });

            return;
        }

        // Build a multipart payload so profile fields and the optional image are sent together.
        const formData = new FormData();

        formData.append("fullName", data.fullName);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append("city", data.city);
          console.log("Gender:", formData.get("gender"));

        formData.append(
            "universityName",
            data.universityName
        );

        formData.append(
            "personalMobileNumber",
            data.personalMobileNumber
        );

        formData.append(
            "guardianName",
            data.guardianName
        );

        formData.append(
            "guardianPhoneNumber",
            data.guardianPhoneNumber
        );

        // Validate and attach the profile image only when a file has been chosen by the user.
        const file = profileImage.files[0];

        if (file) {

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png"
            ];

            // Reject unsupported image formats before attempting the upload.
            if (!allowedTypes.includes(file.type)) {

                Swal.fire({
                    icon: "error",
                    title: "Invalid Image!",
                    text: "Only JPG, JPEG and PNG images are allowed."
                });

                return;
            }

            // Prevent oversized uploads that could slow the API and degrade the user experience.
            const maxSize = 2 * 1024 * 1024;

            if (file.size > maxSize) {

                Swal.fire({
                    icon: "error",
                    title: "Image Too Large!",
                    text: "Profile image must be less than 2 MB."
                });

                return;
            }

            // Attach the validated file to the multipart request.
            formData.append("profileImage", file);
        }

        // PATCH the authenticated profile resource with the serialized form data.
        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/profile",
            {
                method: "PATCH",

                headers: {
                    "Authorization": `Bearer ${token}`
                },

                body: formData
            }
        );

        // Parse the server response to surface any backend validation errors or success states.
        const result = await response.json();

        console.log("Update Response:", result);

        // Handle API failures and route clear missing-resource cases to the 404 page.
        if (!response.ok) {

            if (response.status === 404) {
                window.location.href = '../../pages/errors/404.html';
                return;
            }

            Swal.fire({
                icon: "error",
                title: "Update Failed!",
                text: result.message || "Unable to update profile."
            });

            return;
        }

        // Confirm the successful profile update and return the user to their profile page.
        Swal.fire({
            icon: "success",
            title: "Profile Updated!",
            text: "Your profile has been updated successfully."
        }).then(() => {

            window.location.href = "profile.html";

        });

    }

    catch (error) {

        console.error("Server Error:", error);

        window.location.href = "../../pages/errors/500.html";
    }

});