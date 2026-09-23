
// Track the profile form inputs so the latest user edits are captured before submission.
const userdata = document.querySelectorAll(".form-control");
const profileImage = document.querySelector("#profileImage");
const editprofilebtn = document.querySelector("#sumbit-btn");

console.log(userdata);
console.log(editprofilebtn);

let data = {};


// =====================================================
// GET CURRENT PROFILE DATA
// =====================================================

const getProfile = async () => {

    try {

        const token = localStorage.getItem("accessToken");

        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            });

            return;
        }


        const response = await fetch(
            "https://intern-crud-task-api.onrender.com/api/profile",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const result = await response.json();

        console.log("Profile Data:", result);


        if (!response.ok) {

            if (response.status === 404) {

                window.location.href = "../../pages/errors/404.html";

                return;
            }


            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: result.message || "Unable to load profile."
            });

            return;
        }


        // =============================================
        // SAVE EXISTING PROFILE DATA IN data
        // =============================================

        data = {
            fullName: result.fullName || "",
            gender: result.gender || "",
            address: result.address || "",
            city: result.city || "",
            universityName: result.universityName || "",
            personalMobileNumber: result.personalMobileNumber || "",
            guardianName: result.guardianName || "",
            guardianPhoneNumber: result.guardianPhoneNumber || ""
        };


        console.log("Pre-filled Data:", data);


        // =============================================
        // PRE-FILL HTML FORM
        // =============================================

        document.querySelector("[name='fullName']").value =
            data.fullName;

        document.querySelector("[name='gender']").value =
            data.gender;

        document.querySelector("[name='address']").value =
            data.address;

        document.querySelector("[name='city']").value =
            data.city;

        document.querySelector("[name='universityName']").value =
            data.universityName;

        document.querySelector("[name='personalMobileNumber']").value =
            data.personalMobileNumber;

        document.querySelector("[name='guardianName']").value =
            data.guardianName;

        document.querySelector("[name='guardianPhoneNumber']").value =
            data.guardianPhoneNumber;


    }

    catch (error) {

        console.error("Get Profile Error:", error);

        window.location.href = "../../pages/errors/500.html";
    }
};


// Load existing profile when page opens
getProfile();


// =====================================================
// TRACK FORM CHANGES
// =====================================================

const handlechange = (e) => {

    const { name, value } = e.target;

    data = {
        ...data,
        [name]: value
    };

    console.log("Form Data:", data);
};


userdata.forEach((input) => {

    input.addEventListener("input", handlechange);
    input.addEventListener("change", handlechange);

});


// =====================================================
// UPDATE PROFILE
// =====================================================

editprofilebtn.addEventListener("submit", async (e) => {

    e.preventDefault();
    if (!editprofilebtn.checkValidity()) {
        editprofilebtn.classList.add("was-validated");
        return;
    }

    try {

        const token = localStorage.getItem("accessToken");

        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Login Required!",
                text: "Please login first."
            });

            return;
        }


        // Build multipart payload
        const formData = new FormData();


        formData.append("fullName", data.fullName);
        formData.append("gender", data.gender);
        formData.append("address", data.address);
        formData.append("city", data.city);
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


        // =================================================
        // PROFILE IMAGE
        // =================================================

        const file = profileImage.files[0];

        if (file) {

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png"
            ];


            if (!allowedTypes.includes(file.type)) {

                Swal.fire({
                    icon: "error",
                    title: "Invalid Image!",
                    text: "Only JPG, JPEG and PNG images are allowed."
                });

                return;
            }


            const maxSize = 2 * 1024 * 1024;


            if (file.size > maxSize) {

                Swal.fire({
                    icon: "error",
                    title: "Image Too Large!",
                    text: "Profile image must be less than 2 MB."
                });

                return;
            }


            formData.append("profileImage", file);
        }


        // =================================================
        // PATCH PROFILE
        // =================================================

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


        const result = await response.json();

        console.log("Update Response:", result);


        if (!response.ok) {

            if (response.status === 404) {

                window.location.href =
                    "../../pages/errors/404.html";

                return;
            }


            Swal.fire({
                icon: "error",
                title: "Update Failed!",
                text: result.message || "Unable to update profile."
            });

            return;
        }


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

        window.location.href =
            "../../pages/errors/500.html";
    }

});
