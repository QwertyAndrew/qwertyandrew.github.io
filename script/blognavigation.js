const sublinks = document.querySelectorAll(".nav-sublink");
const indicators = document.querySelectorAll(".nav-sublink-indicator");
const article = document.querySelector(".articleBlog");
const headings = document.querySelectorAll(".articleBlog .subheading");


function setActiveHeading(id) {
    indicators.forEach(indicator => {
        indicator.classList.remove("active");
    });

    const link = document.querySelector(
        `.nav-sublink[href="#${id}"]`
    );

    if (!link) return;

    const indicator = link.parentElement.querySelector(
        ".nav-sublink-indicator"
    );

    if (indicator) {
        indicator.classList.add("active");
    }
}


// Clicking a navigation link
sublinks.forEach(link => {
    link.addEventListener("click", () => {
        const targetID = link.getAttribute("href").substring(1);

        setActiveHeading(targetID);
    });
});


// Detect active heading while scrolling
article.addEventListener("scroll", () => {
    const articleTop = article.getBoundingClientRect().top;

    let activeHeading = headings[0];

    headings.forEach(heading => {
        const headingTop = heading.getBoundingClientRect().top;

        // Heading has passed the reading position
        if (headingTop <= articleTop + 100) {
            activeHeading = heading;
        }
    });

    if (activeHeading) {
        setActiveHeading(activeHeading.id);
    }
});