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
  const leftCards = document.querySelector(".left-cards");
  const rightCards = document.querySelector(".right-cards");

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

  // Create fixed fact cards on sides
  function createFactCards() {
    const leftPlanets = ["sun", "mercury", "venus", "earth", "mars"];
    const rightPlanets = ["jupiter", "saturn", "uranus", "neptune"];

    leftPlanets.forEach((key) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        `${key}-fact`,
        "p-4",
        "rounded-lg",
        "shadow-md",
        "opacity-70",
        "transition-all",
        "duration-300",
        "pointer-events-auto",
        "w-full",
        "max-h-[150px]",
        "overflow-y-auto",
        key === "uranus" ? "text-[#333]" : "text-white"
      );
      switch (key) {
        case "sun":
          card.classList.add("bg-[#ff9900]");
          break;
        case "mercury":
          card.classList.add("bg-[#666]");
          break;
        case "venus":
          card.classList.add("bg-[#e6b800]");
          break;
        case "earth":
          card.classList.add("bg-[#0066cc]");
          break;
        case "mars":
          card.classList.add("bg-[#cc3300]");
          break;
      }
      card.innerHTML = `
        <h3 class="m-0 text-base md:text-lg">${
          key.charAt(0).toUpperCase() + key.slice(1)
        }</h3>
        <p class="fact-display mt-2 text-xs md:text-sm">${
          facts[key].details
        }</p>
      `;
      leftCards.appendChild(card);
    });

    rightPlanets.forEach((key) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        `${key}-fact`,
        "p-4",
        "rounded-lg",
        "shadow-md",
        "opacity-70",
        "transition-all",
        "duration-300",
        "pointer-events-auto",
        "w-full",
        "max-h-[150px]",
        "overflow-y-auto",
        key === "uranus" ? "text-[#333]" : "text-white"
      );
      switch (key) {
        case "jupiter":
          card.classList.add("bg-[#8c5523]");
          break;
        case "saturn":
          card.classList.add("bg-[#d4a017]");
          break;
        case "uranus":
          card.classList.add("bg-[#99ebff]");
          break;
        case "neptune":
          card.classList.add("bg-[#3366ff]");
          break;
      }
      card.innerHTML = `
        <h3 class="m-0 text-base md:text-lg">${
          key.charAt(0).toUpperCase() + key.slice(1)
        }</h3>
        <p class="fact-display mt-2 text-xs md:text-sm">${
          facts[key].details
        }</p>
      `;
      rightCards.appendChild(card);
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
        card.classList.remove("opacity-100", "scale-110");
        card.classList.add("opacity-70");
        if (card.classList.contains(`${factClass}-fact`)) {
          card.classList.remove("opacity-70");
          card.classList.add("opacity-100", "scale-110");
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
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.remove("opacity-100", "scale-110");
        card.classList.add("opacity-70");
      });
    }
  });
});
