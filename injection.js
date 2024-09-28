let flyEnabled = false; // Track fly status
let flyModule;

// Function to toggle fly
function toggleFly() {
    if (!flyModule) return;
    flyEnabled = !flyEnabled;
    flyModule.enabled = flyEnabled;
    document.getElementById("flyButton").textContent = flyEnabled ? "Disable Fly" : "Enable Fly";
}

// Add Fly Toggle Button to the UI
function addFlyButton() {
    let button = document.createElement("button");
    button.id = "flyButton";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = 9999;
    button.textContent = "Enable Fly";
    button.onclick = toggleFly;
    document.body.appendChild(button);
}

// Initialize Fly Module and Button
(function() {
    'use strict';
    addFlyButton();

    flyModule = new Module("Fly", function(callback) {
        if (callback) {
            tickLoop["Fly"] = function() {
                const dir = getMoveDirection(0.39);
                player$1.motion.x = dir.x;
                player$1.motion.z = dir.z;
                player$1.motion.y = keyPressedDump("space") ? 0.7 : (keyPressedDump("shift") ? -0.7 : 0);
            };
        } else {
            delete tickLoop["Fly"];
            if (player$1) {
                player$1.motion.x = Math.max(Math.min(player$1.motion.x, 0.3), -0.3);
                player$1.motion.z = Math.max(Math.min(player$1.motion.z, 0.3), -0.3);
            }
        }
    });
})();
