// ==========================================
// GLOBAL LOADER
// ==========================================

// Create and show loader
const showLoader = (message = "Please wait...") => {

    // Prevent duplicate loaders
    if (document.querySelector("#global-loader")) {
        return;
    }

    const loader = document.createElement("div");

    loader.id = "global-loader";

    loader.innerHTML = `
        <div class="loader-content">

            <div class="spinner-border text-primary"
                 role="status">
            </div>

            <p class="mt-3 mb-0">
                ${message}
            </p>

        </div>
    `;

    document.body.appendChild(loader);
};


// Hide loader
const hideLoader = () => {

    const loader = document.querySelector("#global-loader");

    if (loader) {
        loader.remove();
    }

};
