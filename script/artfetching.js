
document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("projects-container");

    // Fetch project data
    try {
        const response = await fetch("assets/data/arts.json");

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

            // DESCRIPTION
            const description = document.createElement("p");
            description.innerHTML = project.description;


            // ASSEMBLE PROJECT TEXT FIRST
            section.appendChild(title);
            section.appendChild(description);

            // LINKS
            if (project.links && project.links.length > 0) {

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

            // Generate media
            project.media.forEach(media => {

                const mediaContainer = document.createElement("div");
                mediaContainer.classList.add("clickable-media");

                let element;

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
                        element.setAttribute("aria-label", media.alt || "Project video");
                        break;

                    default:
                        console.warn(`Unknown media type: ${media.type}`);
                        return;
                }

                mediaContainer.appendChild(element);
                gallery.appendChild(mediaContainer);
            });

            // ASSEMBLE THE REST
            section.appendChild(gallery);

            // ADD TO PAGE
            container.appendChild(section);

        });

    } catch (error) {
        console.error("Failed to load projects:", error);
        container.textContent = "Failed to load projects >:[";
    }

});
