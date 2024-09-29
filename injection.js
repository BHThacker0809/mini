    let flyEnabled = false; // Track fly status
    let gameReady = false; // To check if the game is fully ready

    // Function to toggle fly on and off
    function toggleFly() {
        flyEnabled = !flyEnabled;
        // Update button text
        document.getElementById("flyButton").textContent = flyEnabled ? "Disable Fly" : "Enable Fly";
    }

    // Fly feature logic, modifies the player's movement
    function applyFlyFeature() {
        if (flyEnabled && player$1) {
            player$1.motion.x = 0;
            player$1.motion.z = 0;
            player$1.motion.y = keyPressedDump("space") ? 0.7 : (keyPressedDump("shift") ? -0.7 : 0);
        }
    }

    // Add Fly Toggle Button to the UI
    function addFlyButton() {
        let button = document.createElement("button");
        button.id = "flyButton";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.zIndex = 9999;
        button.style.padding = "10px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.textContent = "Enable Fly";
        button.onclick = toggleFly;
        document.body.appendChild(button);
    }

    // Ensure game is fully initialized
    function checkGameReady() {
        return typeof player$1 !== 'undefined' && player$1 !== null;
    }

    // Main function that waits for the game to be ready
    function initializeFlyFeature() {
        const observer = new MutationObserver(() => {
            if (checkGameReady()) {
                gameReady = true; // Mark game as ready
                observer.disconnect(); // Stop observing once the game is ready
                addFlyButton(); // Add the fly button to the UI

                // Hook into the game loop to apply fly logic
                setInterval(() => {
                    applyFlyFeature();
                }, 1000 / 60); // 60 FPS for smooth fly control
            }
        });

        // Observe for changes in the document to detect when the game is ready
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }

    // Start the fly feature initialization once the page has fully loaded
    window.addEventListener('load', initializeFlyFeature);
