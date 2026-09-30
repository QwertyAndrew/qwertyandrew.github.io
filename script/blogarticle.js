async function loadBlogArticle() {
    const response = await fetch("../assets/data/blog.json");
    const blogs = await response.json();

    const currentPage = window.location.pathname.split("/").pop();

    const blog = blogs.find(blog => {
        return blog.url.split("/").pop() === currentPage;
    });

    if (!blog) {
        console.error("Blog post not found:", currentPage);
        return;
    }

    // Title
    const title = document.querySelector(".articleBlog .title");
    title.textContent = `[ ${blog.title} ]`;

    // Date
    const date = document.querySelector(".articleBlog time");
    date.dateTime = blog.date;
    date.textContent = formatDate(blog.date);

    // Tags
    const tagContainer = document.querySelector(
        ".articleBlog .tagContainer"
    );

    blog.tags.forEach(tag => {
        const tagElement = document.createElement("li");
        tagElement.textContent = tag;

        tagContainer.appendChild(tagElement);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    const day = date.getDate();

    const month = date.toLocaleString("en-US", {
        month: "long"
    });

    const year = date.getFullYear();

    return `${getOrdinal(day)} ${month} ${year}`;
}


function getOrdinal(day) {
    if (day >= 11 && day <= 13) {
        return `${day}th`;
    }

    switch (day % 10) {
        case 1:
            return `${day}st`;
        case 2:
            return `${day}nd`;
        case 3:
            return `${day}rd`;
        default:
            return `${day}th`;
    }
}

function generateBlogNavigation() {
    const submenu = document.querySelector(".nav-submenu");
    const subheadings = document.querySelectorAll(
        ".articleBlog .subheading"
    );

    if (!submenu) return;

    // Clear existing navigation
    submenu.innerHTML = "";

    subheadings.forEach((heading, index) => {

        // Generate an ID if the heading doesn't have one
        if (!heading.id) {
            heading.id = `subheading-${index + 1}`;
        }

        // List item
        const listItem = document.createElement("li");

        // Link
        const link = document.createElement("a");
        link.classList.add("nav-sublink");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;

        // Indicator
        const indicator = document.createElement("div");
        indicator.classList.add("nav-sublink-indicator");

        const diamond = document.createElement("div");
        diamond.classList.add("diamond");

        indicator.appendChild(diamond);

        // Assemble
        listItem.appendChild(link);
        listItem.appendChild(indicator);

        submenu.appendChild(listItem);
    });
}


loadBlogArticle();
generateBlogNavigation();