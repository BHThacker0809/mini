let flyEnabled = false; // Track fly status

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
    button.textContent = "Evnable Fly";
    button.onclick = toggleFly;
    document.body.appendChild(button);
}

// Toggle Fly Feature
function toggleFly() {
    flyEnabled = !flyEnabled;
    document.getElementById("flyButton").textContent = flyEnabled ? "Disable Fly" : "Enabdle Fly";
}

// Add Fly Logic to Existing Game Tick Loop
function applyFlyFeature() {
    if (flyEnabled) {
        if (player$1) {
            player$1.motion.x = 0;
            player$1.motion.z = 0;
            player$1.motion.y = keyPressedDump("space") ? 0.7 : (keyPressedDump("shift") ? -0.7 : 0);
        }
    }
}

// Hook into the game's existing tick loop without overriding it
(function() {
    'use strict';
    
    // Existing code replacements and game modifications
    // -----------------------------------------------
    // Original injection.js code that modifies various game functionalities
    // No changes here to maintain game functionality
    // -----------------------------------------------

    // Initialize the fly button after the game is loaded
    window.addEventListener('load', function() {
        addFlyButton();

        // Hook into existing game loop for fly functionality
        new MutationObserver(() => {
            // Ensure that game and player$1 are loaded and hook fly functionality
            if (typeof player$1 !== 'undefined') {
                // Fly logic executes as part of the game loop
                applyFlyFeature();
            }
        }).observe(document, {
            childList: true,
            subtree: true,
        });
    });
})();
