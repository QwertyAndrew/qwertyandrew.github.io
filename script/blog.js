async function loadBlogPosts() {
    const response = await fetch("assets/data/blog.json");
    const blogs = await response.json();

    // Sort newest → oldest 
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const blogContainer = document.querySelector(".blogContainer");

    blogs.forEach((blog, index) => {

        // Blog link
        const blogElement = document.createElement("a");
        blogElement.classList.add("blog");
        blogElement.href = blog.url;

        // Thumbnail
        const image = document.createElement("img");
        image.src = blog.image;
        image.alt = blog.title;

        // Text container
        const textContent = document.createElement("div");
        textContent.classList.add("textContent");

        // Title
        const title = document.createElement("h1");
        title.textContent = blog.title;

        // Date
        const date = document.createElement("time");
        date.dateTime = blog.date;
        date.textContent = formatDate(blog.date);

        // Tags
        const tagContainer = document.createElement("ul");
        tagContainer.classList.add("tagContainer");

        blog.tags.forEach(tag => {
            const tagElement = document.createElement("li");
            tagElement.textContent = tag;

            tagContainer.appendChild(tagElement);
        });

        // Assemble text
        textContent.appendChild(title);
        textContent.appendChild(date);
        textContent.appendChild(tagContainer);

        // Assemble blog
        blogElement.appendChild(image);
        blogElement.appendChild(textContent);

        // Add to page
        blogContainer.appendChild(blogElement);

        // Divider
        if (index < blogs.length - 1) {
            const divider = document.createElement("div");
            divider.classList.add("blogDivider");

            blogContainer.appendChild(divider);
        }
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


loadBlogPosts();