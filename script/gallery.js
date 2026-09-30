function createGalleryItem(item, imagePath) {
    let media;

    if (item.type === "video") {
        media = document.createElement("video");

        media.src = `${imagePath}/${item.media}`;

        media.autoplay = true;
        media.loop = true;
        media.muted = true;
        media.playsInline = true;

    } else {
        media = document.createElement("img");

        media.src = `${imagePath}/${item.media}`;
        media.alt = item.title;
    }

    media.classList.add(`format-${item.format}`);

    return media;
}

async function loadGallery({
    dataPath,
    gallerySelector,
    detailedSelector,
    imagePath
}) {
    const response = await fetch(dataPath);
    const items = await response.json();

    items.sort((a, b) => b.order - a.order);

    const gallery = document.querySelector(gallerySelector);
    const detailed = document.querySelector(detailedSelector);

    const closeButton = detailed.querySelector(".detailed-close");
    const detailedContainer = detailed.querySelector(".content-container");
    const mediaContainer = detailed.querySelector(".media-container");
    const detailedTitle = detailed.querySelector("h1");
    const detailedDescription = detailed.querySelector("p");

    function openDetailed(item, media) {
        // Clear previous media
        mediaContainer.innerHTML = "";

        let detailedMedia;

        if (item.type === "video") {
            detailedMedia = document.createElement("video");

            detailedMedia.src = media.src;
            detailedMedia.autoplay = true;
            detailedMedia.loop = true;
            detailedMedia.muted = true;
            detailedMedia.playsInline = true;
        } else {
            detailedMedia = document.createElement("img");

            detailedMedia.src = media.src;
            detailedMedia.alt = item.title;
        }

        mediaContainer.appendChild(detailedMedia);

        // Set text
        detailedTitle.textContent = item.title;
        detailedDescription.innerHTML = item.description;

        // Set format
        detailedContainer.className = "content-container";

        if (item.format) {
            detailedContainer.classList.add(item.format);
        }

        // Show detailed view
        detailed.classList.add("active");
    }

    function closeDetailed() {
        detailed.classList.remove("active");
    }

    items.forEach(item => {
        const media = createGalleryItem(item, imagePath);

        media.addEventListener("click", () => {
            openDetailed(item, media);
        });

        gallery.appendChild(media);
    });

    // Close when clicking the background
    detailed.addEventListener("click", event => {
        if (event.target === detailed) {
            closeDetailed();
        }
    });

    // Close with Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeDetailed();
        }
    });

    // Close with close button
    closeButton.addEventListener("click", closeDetailed);

    // Close when switching navigation
    const navLinks = document.querySelectorAll(".nav-sublink");

    navLinks.forEach(link => {
        link.addEventListener("click", closeDetailed);
    });
}

// LOAD ARTS
loadGallery({
    dataPath: "assets/data/arts.json",
    gallerySelector: ".art-gallery",
    detailedSelector: "#art .detailed",
    imagePath: "assets/images/works/arts"
});

// LOAD PHOTOS
loadGallery({
    dataPath: "assets/data/photos.json",
    gallerySelector: ".photos-gallery",
    detailedSelector: "#photos .detailed",
    imagePath: "assets/images/works/photos"
});
