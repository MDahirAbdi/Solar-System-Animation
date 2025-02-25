document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-rotation');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const factSelector = document.getElementById('fact-selector');
    const solarSystem = document.querySelector('.solar-system');
    const containers = document.querySelectorAll('.mercury-container, .venus-container, .earth-container, .mars-container, .jupiter-container, .saturn-container, .uranus-container, .neptune-container');
    const planets = document.querySelectorAll('.sun, .mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune');
    const factContainer = document.querySelector('.fact-container');
    
    let isPaused = false;
    let scale = 1;
    let facts = {};

    // Fetch facts and initialize
    fetch('facts.json')
        .then(response => response.json())
        .then(data => {
            facts = data;
            populateFactSelector();
            createFactCards();
        });

    // Populate fact selector
    function populateFactSelector() {
        const factKeys = Object.keys(facts.sun); // Assuming all have same keys
        factKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            factSelector.appendChild(option);
        });
    }

    // Check if two rectangles overlap
    function doOverlap(card1, card2) {
        const rect1 = card1.getBoundingClientRect();
        const rect2 = card2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    // Create scattered fact cards without overlap
    function createFactCards() {
        const cardWidth = 200; // Width + padding/margin
        const cardHeight = 150; // Height + padding/margin
        const maxX = window.innerWidth - cardWidth;
        const maxY = window.innerHeight - cardHeight - 100; // Leave space for header
        const placedCards = [];

        Object.keys(facts).forEach((key, index) => {
            const card = document.createElement('div');
            card.classList.add('card', `${key}-fact`);
            card.innerHTML = `
                <h3>${key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p class="fact-display"></p>
            `;

            let x, y, overlap;
            do {
                x = Math.random() * maxX;
                y = Math.random() * maxY + 100; // Offset from header
                card.style.left = `${x}px`;
                card.style.top = `${y}px`;
                overlap = placedCards.some(existing => doOverlap(card, existing));
            } while (overlap);

            factContainer.appendChild(card);
            placedCards.push(card);
        });

        // Update facts on selector change
        factSelector.addEventListener('change', (e) => {
            const factKey = e.target.value;
            document.querySelectorAll('.fact-display').forEach(display => {
                const planet = display.closest('.card').classList[1].replace('-fact', '');
                display.textContent = factKey ? `${facts[planet][factKey] || 'N/A'}` : '';
            });
        });
    }

    // Toggle rotation
    toggleButton.addEventListener('click', () => {
        isPaused = !isPaused;
        toggleButton.textContent = isPaused ? 'Resume' : 'Pause';
        containers.forEach(container => container.classList.toggle('paused', isPaused));
    });

    // Zoom functionality
    zoomInButton.addEventListener('click', () => {
        scale = Math.min(scale + 0.2, 2);
        solarSystem.style.transform = `scale(${scale})`;
    });

    zoomOutButton.addEventListener('click', () => {
        scale = Math.max(scale - 0.2, 0.5);
        solarSystem.style.transform = `scale(${scale})`;
    });

    // Planet click to highlight fact card
    planets.forEach(planet => {
        planet.addEventListener('click', () => {
            const factClass = planet.dataset.fact;
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('active');
                if (card.classList.contains(`${factClass}-fact`)) {
                    card.classList.add('active');
                }
            });
        });
    });

    // Reset card opacity when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sun, .mercury, .venus, .earth, .mars, .jupiter, .saturn, .uranus, .neptune')) {
            document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
        }
    });
});