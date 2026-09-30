// ============================================================
// MUSIC PLAYER STATE
// ============================================================

let currentAudio = new Audio();
currentAudio.volume = 0.05;

let currentTrack = null;
let currentTemplate = null;


// ============================================================
// MUSIC LOADING
// ============================================================

async function loadMusic() {
    const response = await fetch("assets/data/music.json");
    const music = await response.json();

    // Newest order first
    music.sort((a, b) => b.order - a.order);

    const trackList = document.querySelector(".trackList");

    if (!trackList) return;

    music.forEach(track => {
        createTrackElement(track, trackList);
    });
}


// ============================================================
// CREATE TRACK ELEMENT
// ============================================================

function createTrackElement(track, trackList) {

    // Main template
    const template = document.createElement("div");
    template.classList.add("trackTemplate");


    // Track name button
    const button = document.createElement("button");
    button.classList.add("trackButton");

    button.innerHTML = `<span class="trackTitle">${track.title}</span><span class="trackArtist">${track.artist}</span>`;


    // Track controls
    const controls = document.createElement("div");
    controls.classList.add("trackControls");

    controls.innerHTML = `
        <button class="playpause-song">
            <img src="assets/images/icons/playSong.svg" alt="Play">
        </button>

        <input
            class="slider-song"
            type="range"
            min="0"
            max="100"
            value="0"
        >

        <input
            class="volume-song"
            type="range"
            min="0"
            max="100"
            value="5"
        >
    `;


    // Add everything to the page
    template.appendChild(button);
    template.appendChild(controls);
    trackList.appendChild(template);


    // Get controls
    const playButton = controls.querySelector(".playpause-song");
    const slider = controls.querySelector(".slider-song");
    const volumeSlider = controls.querySelector(".volume-song");


    // --------------------------------------------------------
    // SELECT TRACK
    // --------------------------------------------------------

    button.addEventListener("click", () => {
        selectTrack(track, template);
    });


    // --------------------------------------------------------
    // PLAY / PAUSE
    // --------------------------------------------------------

    playButton.addEventListener("click", () => {

        // Selecting a different track
        if (currentTrack !== track) {
            selectTrack(track, template);
            return;
        }

        togglePlayPause();
    });


    // --------------------------------------------------------
    // TIMELINE / SEEK
    // --------------------------------------------------------

    slider.addEventListener("input", () => {

        if (!currentAudio.duration) return;

        currentAudio.currentTime =
            (slider.value / 100) * currentAudio.duration;
    });


    // --------------------------------------------------------
    // VOLUME
    // --------------------------------------------------------

    volumeSlider.addEventListener("input", () => {

        const volume = Number(volumeSlider.value);

        currentAudio.volume = volume / 100;

        updateVolumeUI(volume);
    });
}


// ============================================================
// SELECT TRACK
// ============================================================

function selectTrack(track, template) {

    // Stop previous audio
    currentAudio.pause();


    // Deactivate previous track
    if (currentTemplate) {
        currentTemplate.classList.remove("active");
    }


    // Activate new track
    template.classList.add("active");

    currentTrack = track;
    currentTemplate = template;


    // Activate CD
    const cd = document.querySelector(".cd");

    if (cd) {
        cd.classList.add("active");

        // Flash CD when changing tracks
        flashCD();
    }


    // Load audio
    currentAudio.src = `assets/audio/${track.audio}`;
    currentAudio.currentTime = 0;


    // Change CD artwork
    const cdCover = document.querySelector(".cdCover");

    if (cdCover) {
        cdCover.src =
            `assets/images/works/music/${track.image}`;

        cdCover.alt =
            `${track.title} cover`;
    }


    // Reset timeline
    const slider =
        template.querySelector(".slider-song");

    slider.value = 0;


    // Start playing
    currentAudio.play().catch(error => {
        console.error("Could not play audio:", error);
    });
}


// ============================================================
// STOP MUSIC
// ============================================================

function stopMusic(deactivate = false) {

    currentAudio.pause();


    // Completely close the current track
    if (deactivate && currentTemplate) {

        currentTemplate.classList.remove("active");

        currentTrack = null;
        currentTemplate = null;


        // Hide CD
        const cd = document.querySelector(".cd");

        if (cd) {
            cd.classList.remove("active");
        }
    }


    updateCDState();
    updatePlayButton();
}


// ============================================================
// PLAY / PAUSE
// ============================================================

function togglePlayPause() {

    if (!currentTrack) return;

    if (currentAudio.paused) {
        currentAudio.play().catch(error => {
            console.error("Could not play audio:", error);
        });
    } else {
        currentAudio.pause();
    }
}


// ============================================================
// CD STATE
// ============================================================

function updateCDState() {

    const cd = document.querySelector(".cd");

    if (!cd) return;

    cd.classList.toggle(
        "playing",
        !currentAudio.paused
    );
}


// ============================================================
// CD FLASH
// ============================================================

function flashCD() {

    const cd = document.querySelector(".cd");

    if (!cd) return;


    // Remove existing animation
    cd.classList.remove("track-switch");


    // Force browser to restart animation
    void cd.offsetWidth;


    // Start animation again
    cd.classList.add("track-switch");
}


// ============================================================
// PLAY BUTTON ICON
// ============================================================

function updatePlayButton() {

    if (!currentTemplate) return;


    const playButton =
        currentTemplate.querySelector(".playpause-song");

    if (!playButton) return;


    const icon =
        playButton.querySelector("img");

    if (!icon) return;


    if (currentAudio.paused) {

        icon.src = "assets/images/icons/playSong.svg";
        icon.alt = "Play";

    } else {

        icon.src = "assets/images/icons/pauseSong.svg";
        icon.alt = "Pause";
    }
}


// ============================================================
// TIMELINE
// ============================================================

currentAudio.addEventListener("timeupdate", () => {

    if (!currentTemplate) return;
    if (!currentAudio.duration) return;


    const slider =
        currentTemplate.querySelector(".slider-song");

    if (!slider) return;


    slider.value =
        (currentAudio.currentTime /
            currentAudio.duration) * 100;
});


// ============================================================
// AUDIO EVENTS
// ============================================================

// Audio starts playing
currentAudio.addEventListener("play", () => {

    updateCDState();
    updatePlayButton();
});


// Audio is paused
currentAudio.addEventListener("pause", () => {

    updateCDState();
    updatePlayButton();
});


// Audio reaches the end
currentAudio.addEventListener("ended", () => {

    updateCDState();
    updatePlayButton();


    if (!currentTemplate) return;


    const slider =
        currentTemplate.querySelector(".slider-song");

    if (slider) {
        slider.value = 100;
    }
});


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener("keydown", event => {

    // Spacebar → Play / Pause
    if (event.code === "Space") {

        event.preventDefault();

        togglePlayPause();
    }


    // Escape → Stop + Close
    if (event.key === "Escape") {

        stopMusic(true);
    }
});


// ============================================================
// BACKGROUND CLICK
// ============================================================

const trackList =
    document.querySelector(".trackList");

if (trackList) {

    trackList.addEventListener("click", event => {

        if (event.target === trackList) {
            stopMusic(true);
        }
    });
}


// ============================================================
// NAVIGATION
// ============================================================

document
    .querySelectorAll(".nav-sublink")
    .forEach(link => {

        link.addEventListener("click", () => {
            stopMusic(true);
        });
    });


// ============================================================
// VOLUME UI
// ============================================================

function updateVolumeUI(volume) {

    document
        .querySelectorAll(".volume-song")
        .forEach(slider => {

            slider.value = volume;

            slider.style.setProperty(
                "--volume-ring",
                `${(volume / 100) * 7}px`
            );
        });
}


// ============================================================
// START MUSIC PLAYER
// ============================================================

loadMusic();
