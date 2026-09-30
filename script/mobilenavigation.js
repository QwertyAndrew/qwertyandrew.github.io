const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("nav");

const navLinks = document.querySelectorAll("nav a");

function setNavState(isOpen) {
    nav.classList.toggle("active", isOpen);
    menuButton.classList.toggle("active", isOpen);

    menuButton.querySelector("img").src = isOpen
        ? "/assets/images/icons/arrowdown.svg"
        : "/assets/images/icons/menu.svg";

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
}

menuButton.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("active");

    setNavState(isOpen);
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        setNavState(false);
    });
});