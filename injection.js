let flyEnabled = false; // Track the fly status
    let flyInterval; // Interval to control the fly loop

    // Function to toggle fly on and off
    function toggleFly() {
        flyEnabled = !flyEnabled;

        // Update button text
        document.getElementById("flyButton").textContent = flyEnabled ? "Disable Fly" : "Enable Fly";

        if (flyEnabled) {
            startFly();  // Start flying
        } else {
            stopFly();   // Stop flying
        }
    }

    // Start the fly feature by setting player movement
    function startFly() {
        flyInterval = setInterval(() => {
            if (player$1) {
                player$1.motion.x = 0;
                player$1.motion.z = 0;
                player$1.motion.y = keyPressedDump("space") ? 0.7 : (keyPressedDump("shift") ? -0.7 : 0);
            }
        }, 1000 / 60); // 60 times per second for smooth motion
    }

    // Stop the fly feature by clearing the interval
    function stopFly() {
        clearInterval(flyInterval);
        if (player$1) {
            player$1.motion.x = 0; // Reset horizontal motion
            player$1.motion.z = 0;
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

    // Initialize the script
    window.addEventListener('load', function() {
        addFlyButton();
    });
