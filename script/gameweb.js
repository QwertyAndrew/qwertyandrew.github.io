async function loadGameWeb({
    dataPath,
    gallerySelector,
    imagePath
}) {
    const response = await fetch(dataPath);
    const items = await response.json();

    items.sort((a, b) => b.order - a.order);

    const gallery = document.querySelector(gallerySelector);

    items.forEach(item => {

        // Main container
        const container = document.createElement("div");
        container.classList.add("gameweb-container");


        // Project image
        const image = document.createElement("img");

        image.src = `${imagePath}/${item.image}`;
        image.alt = item.title;

        container.appendChild(image);


        // Project title
        const title = document.createElement("h1");

        title.textContent = item.title;

        container.appendChild(title);


        // Project description
        const description = document.createElement("p");

        description.innerHTML = item.description;

        container.appendChild(description);


        // Links
        const linkContainer = document.createElement("div");

        linkContainer.classList.add("link-container");


        item.links.forEach(link => {

            const anchor = document.createElement("a");

            anchor.href = link.url;
            anchor.textContent = link.text;

            // Open external links in a new tab
            if (link.url.startsWith("http")) {
                anchor.target = "_blank";
                anchor.rel = "noopener noreferrer";
            }

            linkContainer.appendChild(anchor);
        });


        container.appendChild(linkContainer);


        // Add card to gallery
        gallery.appendChild(container);
    });
}

// LOAD GAMES
loadGameWeb({
    dataPath: "assets/data/games.json",
    gallerySelector: ".games-gallery",
    imagePath: "assets/images/works/games"
});

// LOAD WEBSITES
loadGameWeb({
    dataPath: "assets/data/websites.json",
    gallerySelector: ".websites-gallery",
    imagePath: "assets/images/works/websites"
});