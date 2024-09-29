let replacements = {};
let dumpedVarNames = {};
const storeName = "a" + crypto.randomUUID().replaceAll("-", "").substring(16);

// ANTICHEAT HOOK
function replaceAndCopyFunction(oldFunc, newFunc) {
    return new Proxy(oldFunc, {
        apply(orig, origIden, origArgs) {
            const result = orig.apply(origIden, origArgs);
            newFunc(result);
            return result;
        },
        get(orig) { return orig; }
    });
}

Object.getOwnPropertyNames = replaceAndCopyFunction(Object.getOwnPropertyNames, function(list) {
    if (list.indexOf(storeName) != -1) list.splice(list.indexOf(storeName), 1);
    return list;
});
Object.getOwnPropertyDescriptors = replaceAndCopyFunction(Object.getOwnPropertyDescriptors, function(list) {
    delete list[storeName];
    return list;
});

function modifyCode(text) {
    for (const [name, regex] of Object.entries(dumpedVarNames)) {
        const matched = text.match(regex);
        if (matched) {
            for (const [replacement, code] of Object.entries(replacements)) {
                delete replacements[replacement];
                replacements[replacement.replaceAll(name, matched[1])] = [code[0].replaceAll(name, matched[1]), code[1]];
            }
        }
    }

    for (const [replacement, code] of Object.entries(replacements)) {
        text = text.replaceAll(replacement, code[1] ? code[0] : replacement + code[0]);
    }

    var newScript = document.createElement("script");
    newScript.type = "module";
    newScript.crossOrigin = "";
    newScript.textContent = text;
    var head = document.querySelector("head");
    head.appendChild(newScript);
    newScript.textContent = "";
    newScript.remove();
}

(function() {
    'use strict';

    function getMoveDirection(moveSpeed) {
        let moveStrafe = player$1.moveStrafeDump;
        let moveForward = player$1.moveForwardDump;
        let speed = moveStrafe * moveStrafe + moveForward * moveForward;
        if (speed >= 1e-4) {
            speed = Math.sqrt(speed), speed < 1 && (speed = 1), speed = 1 / speed, moveStrafe = moveStrafe * speed, moveForward = moveForward * speed;
            const rt = Math.cos(player$1.yaw) * moveSpeed;
            const nt = -Math.sin(player$1.yaw) * moveSpeed;
            return new Vector3$1(moveStrafe * rt - moveForward * nt, 0, moveForward * rt + moveStrafe * nt);
        }
        return new Vector3$1(0, 0, 0);
    }

    // Fly module
    let flyvalue, flyvert;
    const fly = new Module("Fly", function(callback) {
        if (callback) {
            tickLoop["Fly"] = function() {
                const dir = getMoveDirection(0.39);
                player$1.motion.x = dir.x;
                player$1.motion.z = dir.z;
                player$1.motion.y = keyPressedDump("space") ? flyvert[1] : (keyPressedDump("shift") ? -flyvert[1] : 0);
            };
        }
        else {
            delete tickLoop["Fly"];
            if (player$1) {
                player$1.motion.x = Math.max(Math.min(player$1.motion.x, 0.3), -0.3);
                player$1.motion.z = Math.max(Math.min(player$1.motion.z, 0.3), -0.3);
            }
        }
    });
    flyvalue = fly.addoption("Speed", Number, 2);
    flyvert = fly.addoption("Vertical", Number, 0.7);

    new Module("NoSlowdown", function() {});
})();
