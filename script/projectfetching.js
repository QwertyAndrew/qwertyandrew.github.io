document.addEventListener("DOMContentLoaded", async () => {

    // CATEGORY CONFIGURATION
    const categories = [
        {
            container: "art-projects-container",
            source: "assets/data/arts.json"
        },
        {
            container: "photo-projects-container",
            source: "assets/data/photos.json"
        },
        {
            container: "game-projects-container",
            source: "assets/data/games.json"
        },
        {
            container: "website-projects-container",
            source: "assets/data/websites.json"
        }
    ];

    const DEFAULT_MEDIA = "assets/images/misc/placeholder.webp";


    // FETCH ALL CATEGORIES
    for (const category of categories) {

        const container = document.getElementById(category.container);

        // Skip categories that don't exist on this page
        if (!container) continue;

        try {

            const response = await fetch(category.source);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            // Generate every project
            data.projects.forEach(project => {

                // PROJECT SECTION
                const section = document.createElement("section");
                section.classList.add("project");

                // TITLE
                const title = document.createElement("h1");
                title.textContent = project.title;
                section.appendChild(title);

                // ROLE (OPTIONAL)
                if (project.role) {

                    const role = document.createElement("p");
                    role.className = "role";
                    role.innerHTML = project.role;

                    section.appendChild(role);

                }

                // DESCRIPTION
                const description = document.createElement("p");
                description.innerHTML = project.description;

                section.appendChild(description);


                // LINKS
                if (project.links?.length > 0) {

                    const linksContainer = document.createElement("div");
                    linksContainer.classList.add("project-links");

                    project.links.forEach(link => {

                        const anchor = document.createElement("a");

                        anchor.href = link.url;
                        anchor.textContent = link.label;

                        linksContainer.appendChild(anchor);

                    });

                    section.appendChild(linksContainer);
                }



                // MEDIA GALLERY
                const gallery = document.createElement("div");
                gallery.classList.add("scrollable-gallery");

                project.media?.forEach(media => {

                    const mediaContainer = document.createElement("div");
                    mediaContainer.classList.add("clickable-media");

                    let element;

                    // FALLBACK MEDIA
                    if (!media.src) {

                        element = document.createElement("img");
                        element.src = DEFAULT_MEDIA;
                        element.alt = media.alt || "Media placeholder";
                        element.loading = "lazy";
                        element.decoding = "async";

                    } else {

                        // MEDIA TYPE
                        switch (media.type) {

                            case "image":
                                element = document.createElement("img");
                                element.src = media.src;
                                element.alt = media.alt || "";
                                element.loading = "lazy";
                                element.decoding = "async";
                                break;

                            case "video":
                                element = document.createElement("video");
                                element.src = media.src;
                                element.autoplay = true;
                                element.muted = true;
                                element.loop = true;
                                element.playsInline = true;
                                element.setAttribute(
                                    "aria-label",
                                    media.alt || "Project video"
                                );
                                break;

                            default:
                                console.warn(`Unknown media type: ${media.type}`);
                                return;
                        }
                    }

                    // APPEND MEDIA
                    mediaContainer.appendChild(element);
                    gallery.appendChild(mediaContainer);

                });

                section.appendChild(gallery);

                // ADD TO PAGE
                container.appendChild(section);

            });

        } catch (error) {

            console.error(
                `Failed to load ${category.source}:`,
                error
            );

            container.textContent = "Failed to load projects >:[";

        }

    }

});