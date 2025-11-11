// TODO:
// Refactor the script!
// Error prevention (the artwork page needs to be in a different javascript)
console.log("Script: I am activated")
// variablessss
const menu_button = document.getElementsByClassName("menuicon")[0];
const menu_text = document.getElementsByClassName("menutext")[0];
const bg_blur = document.getElementsByClassName("backgroundblur")[0];
const menu_part = document.getElementsByTagName("menu")[0];
const line1 = document.getElementsByClassName("line1")[0];
const line2 = document.getElementsByClassName("line2")[0];
const line3 = document.getElementsByClassName("line3")[0];
const about_me_section = document.getElementsByClassName("aboutme")[0];
const about_me_text = document.getElementsByClassName("aboutmetext")[0];
const learning_outcome_section =
    document.getElementsByClassName("learningoutcomes")[0];
const learning_outcome_title = document.getElementsByClassName("lotitle")[0];
const LOs_children = document.querySelectorAll(".loflexbox > *");
const contact_section = document.getElementsByClassName("contactsocial")[0];
const contact_children = document.querySelectorAll(".contactsocial > *");
const left_arrow_slideshow = document.getElementsByClassName("leftarrow")[0];
const right_arrow_slideshow = document.getElementsByClassName("rightarrow")[0];
const artwork_description =
    document.getElementsByClassName("artworkdescription")[0];
const childrenGradientLO = document.querySelectorAll(".LOdecobox");

var slideIndex = 1;

let artworkDescriptionDict = {
    art1: "This is for an song cover for SoundCloud. The song is about communication and it connects everyone around us together. Hence, the orb represent a node/connection. The song is Artcore, pretty chill.",
    art2: 'This is seriously inspired by Porter Robinson "dullscythe", so I tried to make a track that has similarity to it. Yes this is another song cover for SoundCloud.',
    art3: `I made this by following a tutorial from <a href="https://www.youtube.com/@maxhayart">Max Hay</a>, turns out looking great. The art is called "City Of Mistake", and so does the song. Because of the chaos in the scene, of course it's going to be breakcore. One of my friend said the middle object reminds him of Neon White!`,
    art4: "This is semester 2 stuff, I was experimenting with fracture objects, and play with lighting along the way. For me it's nothing special about it, to be honest.",
    art5: "I want to make a song that's related to a winter antagonist. The song is probably speedcore, too bad the mix sucks because I was rushing :[",
    art6: `Very simple art I made, it's called "Frame", as well as the song. Meaningless, but I need something for the song cover sooo yeah.`,
    art7: `I remembered I follow a specific tutorial on how to make fractals using Blender, and this is how I made. For the wide shot, it's from Max Hay tutorial on cameras. Gives me demoscene vibes.`,
    art8: "This is for my sister, she noticed that I created a bunch of 3D arts and she request me to make her a wallpaper for her laptop! Her collegues even noticed and ask where did she get it from haha.",
    art9: "This is where I played with terrains and grass. Nothing much to say about it, looks cool.",
    art10: `Based on what I have learned from Max Hay, I tried to make a cave with some structure inside it. Sadly it doesn't look right because the cave is a bit "void", but I like the structure. Geometry nodes are cool.`,
    art11: `Dystopian 3D art stuff during Semester 3, really fun to make after a long Blender hiatus, shout out to Chris Brunne for helping me making this better!`,
    art12: `I made this in Figma, to see if I can make cool graphic stuff in it, and it turns out okay actually! This is, officially, my lock screen wallpaper.`,
    art13: `After getting a denied from FORM in All Nighter Vol.10, I decided to create a cover art for my team. This is my first time doing mixed media, combining 3D art and digital painting. Kinda proud of this one!`,
    art14: `Semester 1 stuff, it's from a background animation for the portfolio, it's a bit old and some scenes aren't great.`,
    art15: `This is for the Semester 2 space week, took me a whole night to create this animation and compositing it before the deadline. You can check the animation with sound design <a href="https://youtu.be/NXbY_4QwO7k?si=zryOSRhf8PIiKHsU">here</a>!`,
    art16: `This is a background animation for Semester 2 Portfolio website, I use SheepIt to render this one animation at a time. You can check how it looks like in website <a href="https://www.youtube.com/watch?v=fh-6S7EmrOY">here</a>!`,
};

// specifically for the gradient boxes in lo
let marginTopValue = -20;
let marginRightValue = -20;

// make this one initial so it wont be a hassle
// yes, flag system
var isReachedLO = true;

const navlinks = document.querySelectorAll("nav a");

let ismenuopen = false;

// sub functionssssss
function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
    // source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
}

function closeMenu() {
    ismenuopen = false;
    // basically reset everything
    navlinks.forEach((link) => {
        link.style.marginRight = "";
        link.style.opacity = "0";
        link.style.pointerEvents = "none";
    });

    bg_blur.style.backdropFilter = "";
    bg_blur.style.backgroundColor = "";
    bg_blur.style.pointerEvents = "";
    document.body.style.overflowY = "";
    menu_button.style.scale = "";
    menu_button.style.boxShadow = "";
    menu_text.style.opacity = "";
    menu_text.style.transform = "";

    menu_part.style.width = "";
    menu_part.style.height = "";
    menu_part.style.opacity = "";

    line1.style.transform = "";
    line2.style.transform = "";
    line3.style.transform = "";
}

function openMenu() {
    ismenuopen = true;
    // a bunch of formating here
    // including the background blur, the menu button and all of the lines of the hamburger menu
    document.body.style.overflowY = "hidden";

    bg_blur.style.backdropFilter = "blur(1vmin)";
    bg_blur.style.backgroundColor = "rgba(242,250,250,0.5)";
    bg_blur.style.pointerEvents = "auto";
    menu_button.style.scale = 1.25;
    menu_button.style.boxShadow = "none";
    menu_text.style.opacity = "1";
    menu_text.style.transform = "translate(-11vmin, 0)";
    menu_part.style.width = "22vw";
    menu_part.style.height = "71.5vh";
    menu_part.style.opacity = "1";

    // flang or fling or whatever effect for the links
    // basically each moves in different delay and stufff
    navlinks.forEach((link, index) => {
        setTimeout(() => {
            link.style.marginRight = "-2vmin";
            link.style.opacity = "1";
            link.style.pointerEvents = "auto";

            // apparently this will ignore css hover function soo I have to write it here
            link.addEventListener("mouseover", function () {
                link.style.marginRight = "-1vmin";
                link.style.transition = "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
            });

            link.addEventListener("mouseleave", function () {
                link.style.marginRight = "-2vmin";
                link.style.transition = "";
            });

            link.addEventListener("mousedown", function () {
                link.style.boxShadow = "none";
                link.style.transform = "translate(0, 1vmin)";
                link.style.transition = "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
            });

            link.addEventListener("mouseup", function () {
                link.style.boxShadow = "";
                link.style.transform = "translate(0, 0vmin)";
                link.style.transition = "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
            });
        }, 50 * index);
    });

    // hamburger menu transformation
    // looks really cool
    line1.style.transform =
        "translate(-0.6vmin, 1.7vmin) rotate(45deg) scaleX(0.75)";
    line2.style.transform = "rotate(90deg) ";
    line3.style.transform =
        "translate(0.6vmin, -0.4vmin) rotate(135deg) scaleX(0.75)";
}

function plusDivs(n) {
    showDivs((slideIndex += n));
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("artwork");
    if (n > x.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = x.length;
    }
    for (i = 0; i < x.length; i++) {
        x[i].style.scale = "1.1";
        x[i].style.opacity = "0";
    }
    x[slideIndex - 1].style.opacity = "1";
    x[slideIndex - 1].style.scale = "1";
    console.log(x[slideIndex - 1].id);
    console.log(artworkDescriptionDict[x[slideIndex - 1].id]);
    artwork_description.innerHTML = artworkDescriptionDict[x[slideIndex - 1].id];
}


function addClickDetectorToArrows() {
    left_arrow_slideshow.addEventListener("click", function () {
        plusDivs(-1);
    });

    right_arrow_slideshow.addEventListener("click", function () {
        plusDivs(1);
    });
}
// source: https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_slideshow_self
// with some minor adjustment of course

// main functionssss
menu_button.addEventListener("click", function () {
    if (ismenuopen) {
        // the menu is already open, close it
        closeMenu();
    } else {
        // the menu is closed, open it
        openMenu();
    }
});

window.addEventListener("scroll", function () {
    var scrollValueTrigger = window.innerHeight * 0.5;
    var scrollValueTrigForContact = window.innerHeight * 0.75;
    var aboutMeSectionPosition = about_me_section.getBoundingClientRect().top;
    var learningOutcomeSectionPosition =
        learning_outcome_section.getBoundingClientRect().top;
    var contactPosition = contact_section.getBoundingClientRect().top;
    // source: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    // i want to activate when the top position of the element is at 50% of user screen
    // therefore, window.innerHeight * 0.5

    // activate when reach
    // for about me section
    if (aboutMeSectionPosition < scrollValueTrigger) {
        about_me_text.style.opacity = "1";
        about_me_text.style.marginRight = "25vw";
    }

    // for LO section
    if (learningOutcomeSectionPosition < scrollValueTrigger) {
        learning_outcome_title.style.opacity = "1";
        learning_outcome_title.style.transform = "translate(0,0)";

        if (isReachedLO) {
            // is reached, move the learning outcomes
            // set boolean to false, only active once
            LOs_children.forEach((lo, index) => {
                setTimeout(() => {
                    lo.style.transform = `translate(${getRandomNum(-38, -23)}vw,0)`;
                }, 50 * index);
            });

            childrenGradientLO.forEach((gradientBox, index) => {
                setTimeout(() => {
                    gradientBox.style.opacity = `1`;
                    gradientBox.style.marginTop = `${marginTopValue}vh`;
                    gradientBox.style.marginRight = `${marginRightValue}vw`;
                    marginTopValue += 20;
                    marginRightValue += 1;
                }, 50 * index);
            });

            isReachedLO = false;
        }
    }

    // for contact section
    if (contactPosition < scrollValueTrigForContact) {
        // if total of the current height and scroll y bigger than total then you are at the bottom
        // activate animation for contact/social
        contact_children.forEach((info, index) => {
            setTimeout(() => {
                info.style.opacity = 1;
                info.style.transform = "translate(0,0vh)";
            }, 50 * index);
        });
    }
});

// check if those arrows even exist
if (left_arrow_slideshow && right_arrow_slideshow) {
    console.log("Script: There are arrows! click functions added!");
    addClickDetectorToArrows()
} else {
    console.log("Script: There's no arrows! I'm not going to add click functions to them");
}

// Service Worker!
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  }