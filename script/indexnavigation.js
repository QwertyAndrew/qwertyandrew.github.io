// Variables
const sublinks = document.querySelectorAll(".nav-sublink");
const pages = document.querySelectorAll(".page");

// Functions
function switchPage(targetID) {
    const targetPage = document.querySelector(targetID);

    if (!targetPage) return;

    // Hide all pages
    pages.forEach(page => {
        page.classList.remove("active");
    });

    // Show target page
    targetPage.classList.add("active");

    // Remove all active indicators
    document.querySelectorAll(".nav-sublink-indicator").forEach(indicator => {
        indicator.classList.remove("active");
    });

    // Activate correct indicator
    const link = document.querySelector(
        `.nav-sublink[href="${targetID}"]`
    );

    if (link) {
        const indicator = link.parentElement.querySelector(
            ".nav-sublink-indicator"
        );

        indicator.classList.add("active");
    }
}

// Main script
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", event => {
        const targetID = link.getAttribute("href");

        // Ignore links that aren't internal section links
        if (!targetID || !targetID.startsWith("#")) return;

        event.preventDefault();

        switchPage(targetID);

        history.pushState(null, "", targetID);
    });
});

window.addEventListener("popstate", () => {
    switchPage(window.location.hash || "#art");
});

switchPage(window.location.hash || "#art");