document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-rotation");
  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  const factSelector = document.getElementById("fact-selector");
  const solarSystem = document.querySelector(".solar-system");
  const containers = document.querySelectorAll(
    ".mercury-container, .venus-container, .earth-container, .mars-container, .jupiter-container, .saturn-container, .uranus-container, .neptune-container"
  );
  const planets = document.querySelectorAll(
    ".sun, .mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune"
  );
  const factContainer = document.querySelector(".fact-container");

  let isPaused = false;
  let scale = 1;
  let facts = {};

  // Fetch facts and initialize
  fetch("facts.json")
    .then((response) => response.json())
    .then((data) => {
      facts = data.solar_system;
      populateFactSelector();
      createFactCards();
    });

  // Populate fact selector
  function populateFactSelector() {
    const factKeys = Object.keys(facts.sun);
    factKeys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key;
      factSelector.appendChild(option);
    });
    factSelector.value = "details";
    updateFactDisplays("details");
  }

  // Check if two rectangles overlap
  function doOverlap(card1, card2) {
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  // Create scattered fact cards on sides with arrows
  function createFactCards() {
    const cardWidth = 220;
    const cardHeight = 220;
    const solarRect = solarSystem.getBoundingClientRect();
    const solarLeft = solarRect.left;
    const solarRight = solarRect.right;
    const maxY = window.innerHeight - cardHeight - 100; // Space for header
    const leftSideMaxX = solarLeft - cardWidth - 20; // Buffer from solar system
    const rightSideMinX = solarRight + 20; // Buffer from solar system
    const rightSideMaxX = window.innerWidth - cardWidth;
    const placedCards = [];

    Object.keys(facts).forEach((key, index) => {
      const card = document.createElement("div");
      card.classList.add("card", `${key}-fact`);
      card.innerHTML = `
                <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p class="fact-display">${facts[key].details}</p>
            `;

      const arrow = document.createElement("div");
      arrow.classList.add("arrow");

      let x, y, overlap, side;
      do {
        // Randomly choose left or right side (roughly half on each)
        side = index % 2 === 0 ? "left" : "right";
        if (side === "left") {
          x = Math.random() * leftSideMaxX;
        } else {
          x = rightSideMinX + Math.random() * (rightSideMaxX - rightSideMinX);
        }
        y = Math.random() * maxY + 100; // Offset from header
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        overlap = placedCards.some((existing) => doOverlap(card, existing));
      } while (overlap);

      // Position arrow
      const cardRect = card.getBoundingClientRect();
      const planet = document.querySelector(`.${key}`);
      const planetRect = planet.getBoundingClientRect();
      const arrowX = side === "left" ? cardRect.right : cardRect.left - 16; // 16px for arrow width
      const arrowY = cardRect.top + cardRect.height / 2 - 8; // Center vertically
      arrow.style.left = `${arrowX}px`;
      arrow.style.top = `${arrowY}px`;
      if (side === "left") {
        arrow.style.borderLeftColor = getComputedStyle(card).backgroundColor;
        arrow.style.transform = "translateX(8px)"; // Point right
      } else {
        arrow.style.borderRightColor = getComputedStyle(card).backgroundColor;
        arrow.style.transform = "translateX(-8px)"; // Point left
      }

      factContainer.appendChild(card);
      factContainer.appendChild(arrow);
      placedCards.push(card);
    });

    // Update facts on selector change
    factSelector.addEventListener("change", (e) => {
      const factKey = e.target.value;
      updateFactDisplays(factKey);
    });
  }

  // Update all fact displays
  function updateFactDisplays(factKey) {
    document.querySelectorAll(".fact-display").forEach((display) => {
      const planet = display.closest(".card").classList[1].replace("-fact", "");
      const value = facts[planet][factKey];
      display.textContent = factKey
        ? typeof value === "number"
          ? value
          : value || "N/A"
        : "";
    });
  }

  // Toggle rotation
  toggleButton.addEventListener("click", () => {
    isPaused = !isPaused;
    toggleButton.textContent = isPaused ? "Resume" : "Pause";
    containers.forEach((container) =>
      container.classList.toggle("paused", isPaused)
    );
  });

  // Zoom functionality
  zoomInButton.addEventListener("click", () => {
    scale = Math.min(scale + 0.2, 2);
    solarSystem.style.transform = `scale(${scale})`;
  });

  zoomOutButton.addEventListener("click", () => {
    scale = Math.max(scale - 0.2, 0.5);
    solarSystem.style.transform = `scale(${scale})`;
  });

  // Planet click to highlight fact card
  planets.forEach((planet) => {
    planet.addEventListener("click", () => {
      const factClass = planet.dataset.fact;
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("active");
        if (card.classList.contains(`${factClass}-fact`)) {
          card.classList.add("active");
        }
      });
    });
  });

  // Reset card opacity when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(
        ".sun, .mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune"
      )
    ) {
      document
        .querySelectorAll(".card")
        .forEach((card) => card.classList.remove("active"));
    }
  });
});
