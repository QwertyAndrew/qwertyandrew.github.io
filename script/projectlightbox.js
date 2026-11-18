
document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("media-lightbox");
    const content = lightbox.querySelector(".lightbox-content");
    const closeButton = lightbox.querySelector(".lightbox-close");


    // OPEN LIGHTBOX
    function openLightbox(originalMedia) {

        // Clone the original image/video
        const media = originalMedia.cloneNode(true);

        // Remove gallery-specific styling
        media.removeAttribute("loading");
        media.removeAttribute("decoding");

        // VIDEO SETTINGS
        if (media.tagName === "VIDEO") {
            media.controls = true;
            media.autoplay = true;
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
        }

        content.replaceChildren(media);

        // Open fullscreen dialog
        lightbox.showModal();

        // Start video playback
        if (media.tagName === "VIDEO") {
            media.play().catch(error => {
                console.warn("Video playback failed:", error);
            });
        }
    }


    // CLOSE LIGHTBOX
    function closeLightbox() {
        lightbox.close();
    }


    // CLICK ON PROJECT MEDIA
    // Event delegation supports dynamically generated projects.

    document.addEventListener("click", event => {

        const mediaContainer = event.target.closest(".clickable-media");

        if (!mediaContainer) return;

        const media = mediaContainer.querySelector("img, video");

        if (!media) return;

        openLightbox(media);

    });


    // CLOSE BUTTON
    closeButton.addEventListener("click", closeLightbox);


    // CLICK OUTSIDE MEDIA
    content.addEventListener("click", event => {

        const clickedMedia = event.target.closest("img, video");

        if (!clickedMedia) {
            closeLightbox();
        }

    });


    // CLEAN UP WHEN CLOSED
    lightbox.addEventListener("close", () => {

        // Removing the video stops its playback.
        content.replaceChildren();

    });

});
