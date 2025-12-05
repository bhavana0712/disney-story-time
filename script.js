// Character catalog with display styling helpers
const princesses = [
    {
        name: "Ariel",
        movie: "The Little Mermaid",
        image: "images/ariel.png",
        cardGradient: "linear-gradient(135deg, #1ac8db 0%, #147fb7 100%)",
        detailGradient: "linear-gradient(160deg, #20c1c6 0%, #0d6d9d 100%)",
        description: "Ariel is a spirited mermaid who longs to explore the surface world, driven by curiosity, courage, and a deep love for discovery.",
        clipColors: ["#c6f1f8", "#9fdeeb", "#7ac8dc", "#5cb3ce"]
    },
    {
        name: "Belle",
        movie: "Beauty and the Beast",
        image: "images/belle.png",
        cardGradient: "linear-gradient(135deg, #f3d86b 0%, #d88d1f 100%)",
        detailGradient: "linear-gradient(160deg, #f5c74b 0%, #cf8615 100%)",
        description: "Belle sees beyond appearances, embracing adventure and knowledge with a compassionate heart that changes the world around her.",
        clipColors: ["#f9edc5", "#f4d993", "#efc46f", "#e3aa48"]
    },
    {
        name: "Rapunzel",
        movie: "Tangled",
        image: "images/rapunzel.png",
        cardGradient: "linear-gradient(135deg, #d9a7ff 0%, #b066fe 100%)",
        detailGradient: "linear-gradient(160deg, #d69fff 0%, #9a4df4 100%)",
        description: "Rapunzel brings optimism and creativity to every challenge, pairing her resourcefulness with an unwavering belief in the good in others.",
        clipColors: ["#f0dcff", "#dab6ff", "#c69bff", "#b581ff"]
    },
    {
        name: "Cinderella",
        movie: "Cinderella",
        image: "images/cinderella.png",
        cardGradient: "linear-gradient(135deg, #9ad6ff 0%, #67a4ff 100%)",
        detailGradient: "linear-gradient(160deg, #a7dbff 0%, #5f9fff 100%)",
        description: "Cinderella remains kind and hopeful through adversity, proving that grace, resilience, and courage can transform any destiny.",
        clipColors: ["#d5edff", "#b6dbff", "#94c5ff", "#6eafff"]
    },
    {
        name: "Jasmine",
        movie: "Aladdin",
        image: "images/jasmine.png",
        cardGradient: "linear-gradient(135deg, #5ed5c0 0%, #25a6a5 100%)",
        detailGradient: "linear-gradient(160deg, #63d7c6 0%, #1d8e99 100%)",
        description: "Jasmine charts her own course, fearless and compassionate, determined to ensure freedom for herself and those she loves.",
        clipColors: ["#c4f5ec", "#9ae7dd", "#74d4cb", "#4bbeb5"]
    },
    {
        name: "Moana",
        movie: "Moana",
        image: "images/moana.png",
        cardGradient: "linear-gradient(135deg, #f7ad7c 0%, #d77a61 100%)",
        detailGradient: "linear-gradient(160deg, #f7aa73 0%, #c75a45 100%)",
        description: "Moana sails beyond the reef with fearless curiosity, guided by her connection to her people, her ancestry, and the vast ocean itself.",
        clipColors: ["#fee0cd", "#fdc6a5", "#f9a47c", "#ed7b5a"]
    }
];

// --- Core layout elements ---
const appShell = document.querySelector(".app-shell");
const track = document.getElementById("cardsTrack");
const sliderWindow = document.getElementById("sliderWindow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const mainView = document.getElementById("mainView");
const detailView = document.getElementById("detailView");

// Detail view nodes
const detailName = document.getElementById("detailName");
const detailMovie = document.getElementById("detailMovie");
const detailDescription = document.getElementById("detailDescription");
const detailImage = document.getElementById("detailImage");
const detailMedia = document.getElementById("detailMedia");
const detailVerticalLabel = document.getElementById("detailVerticalLabel");
const clipGrid = document.getElementById("clipGrid");
const closeDetailBtn = document.getElementById("closeDetailBtn");

// --- Slider state ---
let currentIndex = 0;
let cardsPerView = 4;
let cardWidth = 0;
let cardGap = 24;
let lastFocusedCard = null;
let resizeTimer = null;

renderCards();
updateLayout();
attachEventListeners();
mainView.setAttribute("aria-hidden", "false");

// Builds the carousel track from the character data
function renderCards() {
    princesses.forEach((princess, index) => {
        const card = document.createElement("article");
        card.className = "character-card";
        card.dataset.index = index;
        card.setAttribute("role", "listitem");
        card.tabIndex = 0;
        card.style.background = princess.cardGradient;

        const image = document.createElement("img");
        image.className = "character-image";
        image.src = princess.image;
        image.alt = princess.name;
        image.loading = "lazy";

        const textWrap = document.createElement("div");
        textWrap.className = "card-text";

        const heading = document.createElement("h3");
        heading.textContent = princess.name;

        const subheading = document.createElement("p");
        subheading.textContent = `Movie: ${princess.movie}`;

        textWrap.append(heading, subheading);
        card.append(image, textWrap);

        card.addEventListener("click", () => {
            lastFocusedCard = card;
            showDetail(princess);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                lastFocusedCard = card;
                showDetail(princess);
            }
        });

        track.append(card);
    });
}

// Binds slider controls and detail view interactions
function attachEventListeners() {
    prevBtn.addEventListener("click", () => slideTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => slideTo(currentIndex + 1));

    closeDetailBtn.addEventListener("click", hideDetail);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && detailView.classList.contains("is-active")) {
            hideDetail();
        }
    });

    window.addEventListener("resize", () => {
        track.classList.add("is-resizing");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateLayout();
            track.classList.remove("is-resizing");
        }, 150);
    });
}

// Determines how many cards belong on screen for the current viewport
function getCardsPerView() {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 900) return 2;
    if (width <= 1180) return 3;
    return 4;
}

// Recalculates card sizing and clamps the slider to the available items
function updateLayout() {
    const computedGap = parseFloat(getComputedStyle(track).gap) || 24;
    cardGap = computedGap;

    const newCardsPerView = getCardsPerView();
    cardsPerView = newCardsPerView;
    document.documentElement.style.setProperty("--cards-per-view", cardsPerView);

    setCardDimensions();

    const maxIndex = Math.max(0, princesses.length - cardsPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    applyTransform();
    updateButtons();
}

function setCardDimensions() {
    const containerWidth = sliderWindow.clientWidth;
    const totalGap = cardGap * (cardsPerView - 1);
    cardWidth = (containerWidth - totalGap) / cardsPerView;

    const cardElements = Array.from(track.children);
    cardElements.forEach((card) => {
        card.style.width = `${Math.max(cardWidth, 0)}px`;
    });
}

function slideTo(targetIndex) {
    const maxIndex = Math.max(0, princesses.length - cardsPerView);
    currentIndex = Math.min(Math.max(targetIndex, 0), maxIndex);
    applyTransform();
    updateButtons();
}

function applyTransform() {
    const offset = currentIndex * (cardWidth + cardGap);
    track.style.transform = `translateX(-${offset}px)`;
}

function updateButtons() {
    const maxIndex = Math.max(0, princesses.length - cardsPerView);
    const noScrollNeeded = maxIndex === 0;

    prevBtn.disabled = currentIndex === 0 || noScrollNeeded;
    nextBtn.disabled = currentIndex >= maxIndex || noScrollNeeded;
}

// Populates the detail view and shows it
function showDetail(princess) {
    detailName.textContent = princess.name;
    detailMovie.textContent = `Movie: ${princess.movie}`;
    detailDescription.textContent = princess.description;
    detailMedia.style.background = princess.detailGradient || princess.cardGradient;
    detailImage.src = princess.image;
    detailImage.alt = princess.name;
    detailVerticalLabel.textContent = princess.name;

    populateClips(princess);

    mainView.classList.remove("is-active");
    mainView.setAttribute("aria-hidden", "true");

    detailView.classList.add("is-active");
    detailView.setAttribute("aria-hidden", "false");

    if (appShell) {
        appShell.classList.add("detail-mode");
    }

    closeDetailBtn.focus();
}

function populateClips(princess) {
    clipGrid.innerHTML = "";
    const colors = princess.clipColors && princess.clipColors.length
        ? princess.clipColors
        : ["rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.55)", "rgba(255, 255, 255, 0.45)", "rgba(255, 255, 255, 0.35)"];

    colors.slice(0, 4).forEach((color, index) => {
        const thumb = document.createElement("div");
        thumb.className = "clip-thumb";
        thumb.style.background = color;
        thumb.textContent = `Clip ${index + 1}`;
        clipGrid.append(thumb);
    });
}

// Restores the carousel view and returns focus
function hideDetail() {
    detailView.classList.remove("is-active");
    detailView.setAttribute("aria-hidden", "true");

    mainView.classList.add("is-active");
    mainView.setAttribute("aria-hidden", "false");

    if (appShell) {
        appShell.classList.remove("detail-mode");
    }

    if (lastFocusedCard) {
        lastFocusedCard.focus();
    }
}
