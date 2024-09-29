let replacements = {};
let dumpedVarNames = {};
const storeName = "a" + crypto.randomUUID().replaceAll("-", "").substring(16);
const vapeName = crypto.randomUUID().replaceAll("-", "").substring(16);

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

function addReplacement(replacement, code, replaceit) {
	replacements[replacement] = [code, replaceit];
}

function addDump(replacement, code) {
	dumpedVarNames[replacement] = code;
}

function modifyCode(text) {
	for(const [name, regex] of Object.entries(dumpedVarNames)){
		const matched = text.match(regex);
		if (matched) {
			for(const [replacement, code] of Object.entries(replacements)){
				delete replacements[replacement];
				replacements[replacement.replaceAll(name, matched[1])] = [code[0].replaceAll(name, matched[1]), code[1]];
			}
		}
	}

	for(const [replacement, code] of Object.entries(replacements)){
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

	addDump('moveStrafeDump', 'strafe:this\.([a-zA-Z]*)');
	addDump('moveForwardDump', 'forward:this\.([a-zA-Z]*)');
	addDump('keyPressedDump', 'function ([a-zA-Z]*)\\(j\\)\{return keyPressed\\(j\\)');
	addDump('entitiesDump', 'this\.([a-zA-Z]*)\.values\\(\\)\\)nt instanceof EntityTNTPrimed');
	addDump('isInvisibleDump', 'ot\.([a-zA-Z]*)\\(\\)\\)&&\\(pt=new ([a-zA-Z]*)\\(new');
	addDump('attackDump', 'hitVec.z\}\\)\}\\)\\),player\\$1\.([a-zA-Z]*)');
	addDump('lastReportedYawDump', 'this\.([a-zA-Z]*)=this\.yaw,this\.last');
	addDump('windowClickDump', '([a-zA-Z]*)\\(this\.inventorySlots\.windowId');
	addDump('playerControllerDump', 'const ([a-zA-Z]*)=new PlayerController,');
	addDump('damageReduceAmountDump', 'ItemArmor&&\\(tt\\+\\=it\.([a-zA-Z]*)');
	addDump('boxGeometryDump', 'ot=new Mesh\\(new ([a-zA-Z]*)\\(1');
	addDump('syncItemDump', 'playerControllerMP\.([a-zA-Z]*)\\(\\),ClientSocket\.sendPacket');

	addReplacement('document.addEventListener("DOMContentLoaded",startGame,!1);', `
		setTimeout(function() {
			var DOMContentLoaded_event = document.createEvent("Event");
			DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(DOMContentLoaded_event);
		}, 0);
	`);

	addReplacement('Potions.jump.getId(),"5");', `
		let blocking = false;
		let sendYaw = false;
		let breakStart = Date.now();
		let noMove = Date.now();

		let enabledModules = {};
		let modules = {};

		let keybindCallbacks = {};
		let keybindList = {};

		let tickLoop = {};
		let renderTickLoop = {};

		let lastJoined, velocityhori, velocityvert, chatdisablermsg, textguifont, textguisize, textguishadow, attackedEntity, stepheight;
		let attackTime = Date.now();
		let chatDelay = Date.now();

		function getModule(str) {
			for(const [name, module] of Object.entries(modules)) {
				if (name.toLocaleLowerCase() == str.toLocaleLowerCase()) return module;
			}
		}

		let j;
		for (j = 0; j < 26; j++) keybindList[j + 65] = keybindList["Key" + String.fromCharCode(j + 65)] = String.fromCharCode(j + 97);
		for (j = 0; j < 10; j++) keybindList[48 + j] = keybindList["Digit" + j] = "" + j;
		window.addEventListener("keydown", function(key) {
			const func = keybindCallbacks[keybindList[key.code]];
			call$1(func, key);
		});
	`);

	addReplacement('VERSION$1," | ",', `"${vapeName} v1.0.5"," | ",`);
	addReplacement('if(!nt.canConnect){', 'nt.errorMessage = nt.errorMessage == "Could not join server. You are connected to a VPN or proxy. Please disconnect from it and refresh the page." ? "You\'re either using a detected VPN server or IP banned for cheating." : nt.errorMessage;');

	addReplacement('ut(this,"glintTexture");', `
		ut(this, "vapeTexture");
		ut(this, "v4Texture");
	`);
	addReplacement('skinManager.loadTextures(),', ',this.loadVape(),');
	addReplacement('async loadSpritesheet(){', `
		async loadVape() {
			this.vapeTexture = await this.loader.loadAsync("https://raw.githubusercontent.com/7GrandDadPGN/VapeForMiniblox/main/assets/logo.png");
			this.v4Texture = await this.loader.loadAsync("https://raw.githubusercontent.com/7GrandDadPGN/VapeForMiniblox/main/assets/logov4.png");
		}
		async loadSpritesheet(){
	`, true);

	addReplacement('player$1.setPositionAndRotation($.x,$.y,$.z,$.yaw,$.pitch),', `
		noMove = Date.now() + 500;
		player$1.setPositionAndRotation($.x,$.y,$.z,$.yaw,$.pitch),
	`, true);

	addReplacement('COLOR_TOOLTIP_BG,BORDER_SIZE)}', `
		function drawImage(ctx, img, posX, posY, sizeX, sizeY, color) {
			if (color) {
				ctx.fillStyle = color;
				ctx.fillRect(posX, posY, sizeX, sizeY);
				ctx.globalCompositeOperation = "destination-in";
			}
			ctx.drawImage(img, posX, posY, sizeX, sizeY);
			if (color) ctx.globalCompositeOperation = "source-over";
		}
	`);

	addReplacement('(this.drawSelectedItemStack(),this.drawHintBox())', `
		if (ctx$3 && enabledModules["TextGUI"]) {
			const colorOffset = (Date.now() / 4000);
			const posX = 15;
			const posY = 17;
			ctx$3.imageSmoothingEnabled = true;
			ctx$3.imageSmoothingQuality = "high";
			drawImage(ctx$3, textureManager.vapeTexture.image, posX, posY, 80, 21, \`HSL(\${(colorOffset % 1) * 360}, 100%, 50%)\`);
			drawImage(ctx$3, textureManager.v4Texture.image, posX + 81, posY + 1, 33, 18);

			let offset = 0;
			let stringList = [];
			for(const [module, value] of Object.entries(enabledModules)) {
				if (!value || module == "TextGUI") continue;
				stringList.push(module);
			}

			stringList.sort(function(a, b) {
				const compA = ctx$3.measureText(a).width;
				const compB = ctx$3.measureText(b).width;
				return compA < compB ? 1 : -1;
			});

			for(const module of stringList) {
				offset++;
				drawText(ctx$3, module, posX + 6, posY + 12 + ((textguisize[1] + 3) * offset), textguisize[1] + "px " + textguifont[1], \`HSL(\${((colorOffset - (0.025 * offset)) % 1) * 360}, 100%, 50%)\`, "left", "top", 1, textguishadow[1]);
			}
		}
	`);

	addReplacement('+=$*rt+_*nt}', `
		if (this == player$1) {
			for(const [index, func] of Object.entries(tickLoop)) if (func) func();
		}
	`);
	addReplacement('this.game.unleash.isEnabled("disable-ads")', 'true', true);
	addReplacement('$.render()})', '; for(const [index, func] of Object.entries(renderTickLoop)) if (func) func();');
	addReplacement('updateNameTag(){let$="white",et = 1;', 'this.entity.team = this.entity.profile.cosmetics.color;');
	addReplacement('connect(_,$=!1,et=!1){', 'lastJoined = _;');
	addReplacement('SliderOption("Render Distance ",2,8,3)', 'SliderOption("Render Distance ",2,64,3)', true);
	addReplacement('ClientSocket.on("CPacketDisconnect",$=>{', `
		if (enabledModules["AutoRejoin"]) {
			setTimeout(function() {
				j.connect(lastJoined);
			}, 400);
		}
	`);
	addReplacement('ClientSocket.on("CPacketMessage",$=>{', `
		if (player$1 && $.text && !$.text.startsWith(player$1.name) && enabledModules["ChatDisabler"] && chatDelay < Date.now()) {
			chatDelay = Date.now() + 1000;
			setTimeout(function() {
				ClientSocket.sendPacket(new SPacketMessage({text: Math.random() + ("\\n" + chatdisablermsg[1]).repeat(20)}));
			}, 50);
		}

		if ($.text && $.text.startsWith("\\\\bold\\\\How to play:")) {
			breakStart = Date.now() + 25000;
		}

		if ($.text && $.text.indexOf("Poll started") != -1 && $.id == undefined && enabledModules["AutoVote"]) {
			ClientSocket.sendPacket(new SPacketMessage({text: "/vote 2"}));
		}

		if ($.text && $.text.indexOf("won the game") != -1 && $.id == undefined && enabledModules["AutoQueue"]) {
			game$1.requestQueue();
		}
	`);
	addReplacement('ClientSocket.on("CPacketUpdateStatus",$=>{', `
		if ($.rank && $.rank != "" && RANK.LEVEL[$.rank].permLevel > 2) {
			game$1.chat.addChat({
				text: "STAFF DETECTED : " + $.rank + "\\n".repeat(10),
				color: "red"
			});
		}
	`);

	addReplacement('bindKeysWithDefaults("b",j=>{', 'bindKeysWithDefaults("semicolon",j=>{', true);
	addReplacement('bindKeysWithDefaults("i",j=>{', 'bindKeysWithDefaults("apostrophe",j=>{', true);

	addReplacement('at=keyPressedDump("shift")||touchcontrols.sprinting', '||enabledModules["Sprint"]');

	addReplacement('"CPacketEntityVelocity",$=>{const et=j.world.entitiesDump.get($.id);', `
		if (player$1 && $.id == player$1.id && enabledModules["Velocity"]) {
			if (velocityhori[1] == 0 && velocityvert[1] == 0) return;
			$.motion = new Vector3$1($.motion.x * velocityhori[1], $.motion.y * velocityvert[1], $.motion.z * velocityhori[1]);
		}
	`);
	addReplacement('"CPacketExplosion",$=>{', `
		if ($.playerPos && enabledModules["Velocity"]) {
			if (velocityhori[1] == 0 && velocityvert[1] == 0) return;
			$.playerPos = new Vector3$1($.playerPos.x * velocityhori[1], $.playerPos.y * velocityvert[1], $.playerPos.z * velocityhori[1]);
		}
	`);

	addReplacement('tt>0&&($.addVelocity(-Math.sin(this.yaw)*tt*.5,.1,-Math.cos(this.yaw)*tt*.5),this.motion.x*=.6,this.motion.z*=.6,this.setSprinting(!1)),', `
		if (tt > 0) {
			$.addVelocity(-Math.sin(this.yaw) * tt * .5, .1, -Math.cos(this.yaw) * tt * .5);
			if (this != player$1 || !enabledModules["KeepSprint"]) {
				this.motion.x *= .6;
				this.motion.z *= .6;
				this.setSprinting(!1);
			}
		}
	`, true);

	addReplacement('else player$1.isBlocking()?', 'else (player$1.isBlocking() || blocking)?', true);
	addReplacement('this.entity.isBlocking()', '(this.entity.isBlocking() || this.entity == player$1 && blocking)', true);
	addReplacement('const nt={onGround:this.onGround}', `, realYaw = sendYaw || this.yaw`);
	addReplacement('this.yaw-this.', 'realYaw-this.', true);
	addReplacement('nt.yaw=player.yaw', 'nt.yaw=realYaw', true);
	addReplacement('this.lastReportedYawDump=this.yaw,', 'this.lastReportedYawDump=realYaw,', true);
	addReplacement('this.neck.rotation.y=controls$1.yaw', 'this.neck.rotation.y=(sendYaw||controls$1.yaw)', true);

	addReplacement('const $=this.jumping,et=this.sneak,tt=-.8,rt=this.moveForwardDump<=tt;', `
		const slowdownCheck = this.isUsingItem() && !enabledModules["NoSlowdown"];
	`);
	addReplacement('updatePlayerMoveState(),this.isUsingItem()', 'updatePlayerMoveState(),slowdownCheck', true);
	addReplacement('it&&!this.isUsingItem()', 'it&&!slowdownCheck', true);
	addReplacement('0),this.sneak', ' && !enabledModules["NoSlowdown"]');

	addReplacement('et.y=this.stepHeight;', 'et.y=(enabledModules["Step"]?Math.max(stepheight[1],this.stepHeight):this.stepHeight);', true);

	addReplacement('this.dead||this.getHealth()<=0)return;', `
		if (enabledModules["WTap"]) player$1.serverSprintState = false;
	`);

	addReplacement('keyPressed(j)&&Game.isActive(!1)', 'keyPressed(j)&&(Game.isActive(!1)||enabledModules["InvWalk"]&&!game.chat.showInput)', true);

	addReplacement('MSPT=50,', '', true);
	addReplacement('MODE="production";', 'let MSPT = 50;');
	addReplacement('ut(this,"controller");', 'ut(this, "tickLoop");');
	addReplacement('setInterval(()=>this.fixedUpdate(),MSPT)', 'this.tickLoop=setInterval(()=>this.fixedUpdate(),MSPT)', true);

	addReplacement('calculateXOffset(ft,this.getEntityBoundingBox(),tt.x)', 'enabledModules["Phase"] ? tt.x : calculateXOffset(ft,this.getEntityBoundingBox(),tt.x)', true);
	addReplacement('calculateYOffset(ft,this.getEntityBoundingBox(),tt.y)', 'enabledModules["Phase"] && keyPressedDump("shift") ? tt.y : calculateYOffset(ft,this.getEntityBoundingBox(),tt.y)', true);
	addReplacement('calculateZOffset(ft,this.getEntityBoundingBox(),tt.z)', 'enabledModules["Phase"] ? tt.z : calculateZOffset(ft,this.getEntityBoundingBox(),tt.z)', true);
	addReplacement('pushOutOfBlocks(_,$,et){', 'if (enabledModules["Phase"]) return;');

	addReplacement('this.game.info.showSignEditor=null,exitPointerLock())', `
		if (this.showDeathScreen && enabledModules["AutoRespawn"]) {
			ClientSocket.sendPacket(new SPacketRespawn$1);
		}
	`);

	addReplacement(')&&(et.mesh.visible=this.shouldRenderEntity(et))', `
		if (enabledModules["Chams"] && et && et.id != player$1.id) {
			for(const mesh in et.mesh.meshes) {
				et.mesh.meshes[mesh].material.depthTest = false;
				et.mesh.meshes[mesh].renderOrder = 3;
			}

			for(const mesh in et.mesh.armorMesh) {
				et.mesh.armorMesh[mesh].material.depthTest = false;
				et.mesh.armorMesh[mesh].renderOrder = 4;
			}

			if (et.mesh.capeMesh) {
				et.mesh.capeMesh.children[0].material.depthTest = false;
				et.mesh.capeMesh.children[0].renderOrder = 5;
			}

			if (et.mesh.hatMesh) {
				for(const mesh of et.mesh.hatMesh.children[0].children) {
					if (!mesh.material) continue;
					mesh.material.depthTest = false;
					mesh.renderOrder = 4;
				}
			}
		}
	`);

	addReplacement('ClientSocket.on("CPacketSpawnPlayer",$=>{const et=j.world.getPlayerById($.id);', `
		if ($.socketId === player$1.socketId && enabledModules["AntiBan"]) {
			hud3D.remove(hud3D.rightArm);
			hud3D.rightArm = undefined;
			player$1.profile.cosmetics.skin = "GrandDad";
			$.cosmetics.skin = "GrandDad";
			$.cosmetics.cape = "GrandDad";
		}
	`);
	addReplacement('bob:{id:"bob",name:"Bob",tier:0,skinny:!1},', 'GrandDad:{id:"GrandDad",name:"GrandDad",tier:2,skinny:!1},');
	addReplacement('cloud:{id:"cloud",name:"Cloud",tier:2},', 'GrandDad:{id:"GrandDad",name:"GrandDad",tier:2},');
	addReplacement('async downloadSkin(_){', `
		if (_ == "GrandDad") {
			const $ = skins[_];
			return new Promise((et, tt) => {
				textureManager.loader.load("https://raw.githubusercontent.com/7GrandDadPGN/VapeForMiniblox/main/assets/skin.png", rt => {
					const nt = {
						atlas: rt,
						id: _,
						skinny: $.skinny,
						ratio: rt.image.width / 64
					};
					SkinManager.createAtlasMat(nt), this.skins[_] = nt, et();
				}, void 0, function(rt) {
					console.error(rt), et();
				});
			});
		}
	`);
	addReplacement('async downloadCape(_){', `
		if (_ == "GrandDad") {
			const $ = capes[_];
			return new Promise((et, tt) => {
				textureManager.loader.load("https://raw.githubusercontent.com/7GrandDadPGN/VapeForMiniblox/main/assets/cape.png", rt => {
					const nt = {
						atlas: rt,
						id: _,
						name: $.name,
						ratio: rt.image.width / 64,
						rankLevel: $.tier,
						isCape: !0
					};
					SkinManager.createAtlasMat(nt), this.capes[_] = nt, et();
				}, void 0, function(rt) {
					console.error(rt), et();
				});
			});
		}
	`);

	addReplacement('new SPacketLoginStart({requestedUuid:localStorage.getItem(REQUESTED_UUID_KEY)??void 0,session:localStorage.getItem(SESSION_TOKEN_KEY)??"",hydration:localStorage.getItem("hydration")??"0",metricsId:localStorage.getItem("metrics_id")??"",clientVersion:VERSION$1})', 'new SPacketLoginStart({requestedUuid:void 0,session:(enabledModules["AntiBan"] ? "" : (localStorage.getItem(SESSION_TOKEN_KEY) ?? "")),hydration:"0",metricsId:uuid$1(),clientVersion:VERSION$1})', true);

	addReplacement('Object.assign(keyMap,_)', '; keyMap["Semicolon"] = "semicolon"; keyMap["Apostrophe"] = "apostrophe";');

	addReplacement('player$1.getActiveItemStack().item instanceof', 'null == ', true);

	addReplacement('tryExecuteClientside(et,_))return;', `
		const str = $.toLocaleLowerCase();
		const args = str.split(" ");
		let chatString;
		switch (args[0]) {
			case ".bind": {
				const module = args.length > 2 && getModule(args[1]);
				if (module) module.setbind(args[2] == "none" ? "" : args[2], true);
				return;
			}
			case ".t":
			case ".toggle":
				if (args.length > 1) {
					const module = args.length > 1 && getModule(args[1]);
					if (module) {
						module.toggle();
						game$1.chat.addChat({
							text: module.name + (module.enabled ? " Enabled!" : " Disabled!"),
							color: module.enabled ? "lime" : "red"
						});
					}
					else if (args[1] == "all") {
						for(const [name, module] of Object.entries(modules)) module.toggle();
					}
				}
				return;
			case ".modules":
				chatString = "Module List\\n";
				for(const [name, module] of Object.entries(modules)) chatString += "\\n" + name;
				game$1.chat.addChat({text: chatString});
				return;
			case ".binds":
				chatString = "Bind List\\n";
				for(const [name, module] of Object.entries(modules)) chatString += "\\n" + name + " : " + (module.bind != "" ? module.bind : "none");
				game$1.chat.addChat({text: chatString});
				return;
			case ".setoption": {
				const module = args.length > 1 && getModule(args[1]);
				if (module) {
					if (args.length < 3) {
						chatString = module.name + " Options";
						for(const [name, value] of Object.entries(module.options)) chatString += "\\n" + name + " : " + value[0].name + " : " + value[1];
						game$1.chat.addChat({text: chatString});
						return;
					}

					let option;
					for(const [name, value] of Object.entries(module.options)) {
						if (name.toLocaleLowerCase() == args[2].toLocaleLowerCase()) option = value;
					}
					if (!option) return;
					if (option[0] == Number) option[1] = !isNaN(Number.parseFloat(args[3])) ? Number.parseFloat(args[3]) : option[1];
					else if (option[0] == Boolean) option[1] = args[3] == "true";
					else if (option[0] == String) option[1] = args.slice(3).join(" ");
					game$1.chat.addChat({text: "Set " + module.name + " " + option[2] + " to " + option[1]});
				}
				return;
			}
			case ".config":
			case ".profile":
				if (args.length > 1) {
					switch (args[1]) {
						case "save":
							globalThis.${storeName}.saveVapeConfig(args[2]);
							game$1.chat.addChat({text: "Saved config " + args[2]});
							break;
						case "load":
							globalThis.${storeName}.saveVapeConfig();
							globalThis.${storeName}.loadVapeConfig(args[2]);
							game$1.chat.addChat({text: "Loaded config " + args[2]});
							break;
						case "import":
							globalThis.${storeName}.importVapeConfig(args[2]);
							game$1.chat.addChat({text: "Imported config"});
							break;
						case "export":
							globalThis.${storeName}.exportVapeConfig();
							game$1.chat.addChat({text: "Config set to clipboard!"});
							break;
					}
				}
				return;
		}
		if (enabledModules["FilterBypass"] && !$.startsWith('/')) {
			const words = $.split(" ");
			let newwords = [];
			for(const word of words) newwords.push(word.charAt(0) + '‎' + word.slice(1));
			$ = newwords.join(' ');
		}
	`);

	addReplacement('document.addEventListener("contextmenu",j=>j.preventDefault());', `
		(function() {
			class Module {
				constructor(name, func) {
					this.name = name;
					this.func = func;
					this.enabled = false;
					this.bind = "";
					this.options = {};
					modules[this.name] = this;
				}
				toggle() {
					this.enabled = !this.enabled;
					enabledModules[this.name] = this.enabled;
					this.func(this.enabled);
				}
				setbind(key, manual) {
					if (this.bind != "") delete keybindCallbacks[this.bind];
					this.bind = key;
					if (manual) game$1.chat.addChat({text: "Bound " + this.name + " to " + (key == "" ? "none" : key) + "!"});
					if (key == "") return;
					const module = this;
					keybindCallbacks[this.bind] = function(j) {
						if (Game.isActive()) {
							module.toggle();
							game$1.chat.addChat({
								text: module.name + (module.enabled ? " Enabled!" : " Disabled!"),
								color: module.enabled ? "lime" : "red"
							});
						}
					};
				}
				addoption(name, typee, defaultt) {
					this.options[name] = [typee, defaultt, name];
					return this.options[name];
				}
			}

			
			let flyvalue, flyvert, flybypass;
			const fly = new Module("Fly", function(callback) {
				if (callback) {
					let ticks = 0;
					tickLoop["Fly"] = function() {
						ticks++;
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
			flybypass = fly.addoption("Bypass", Boolean, true);
			flyvalue = fly.addoption("Speed", Number, 2);
			flyvert = fly.addoption("Vertical", Number, 0.7);

			
		})();
	`);

	async function saveVapeConfig(profile) {
		if (!loadedConfig) return;
		let saveList = {};
		for(const [name, module] of Object.entries(unsafeWindow.globalThis[storeName].modules)) {
			saveList[name] = {enabled: module.enabled, bind: module.bind, options: {}};
			for(const [option, setting] of Object.entries(module.options)) {
				saveList[name].options[option] = setting[1];
			}
		}
		GM_setValue("vapeConfig" + (profile ?? unsafeWindow.globalThis[storeName].profile), JSON.stringify(saveList));
		GM_setValue("mainVapeConfig", JSON.stringify({profile: unsafeWindow.globalThis[storeName].profile}));
	};

	async function loadVapeConfig(switched) {
		loadedConfig = false;
		const loadedMain = JSON.parse(await GM_getValue("mainVapeConfig", "{}")) ?? {profile: "default"};
		unsafeWindow.globalThis[storeName].profile = switched ?? loadedMain.profile;
		const loaded = JSON.parse(await GM_getValue("vapeConfig" + unsafeWindow.globalThis[storeName].profile, "{}"));
		if (!loaded) {
			loadedConfig = true;
			return;
		}

		for(const [name, module] of Object.entries(loaded)) {
			const realModule = unsafeWindow.globalThis[storeName].modules[name];
			if (!realModule) continue;
			if (realModule.enabled != module.enabled) realModule.toggle();
			if (realModule.bind != module.bind) realModule.setbind(module.bind);
			if (module.options) {
				for(const [option, setting] of Object.entries(module.options)) {
					const realOption = realModule.options[option];
					if (!realOption) continue;
					realOption[1] = setting;
				}
			}
		}
		loadedConfig = true;
	};

	async function exportVapeConfig() {
		navigator.clipboard.writeText(await GM_getValue("vapeConfig" + unsafeWindow.globalThis[storeName].profile, "{}"));
	};

	async function importVapeConfig() {
		const arg = await navigator.clipboard.readText();
		if (!arg) return;
		GM_setValue("vapeConfig" + unsafeWindow.globalThis[storeName].profile, arg);
		loadVapeConfig();
	};

	let loadedConfig = false;
	async function execute(src, oldScript) {
		Object.defineProperty(unsafeWindow.globalThis, storeName, {value: {}, enumerable: false});
		if (oldScript) oldScript.type = 'javascript/blocked';
		await fetch(src).then(e => e.text()).then(e => modifyCode(e));
		if (oldScript) oldScript.type = 'module';
		await new Promise((resolve) => {
			const loop = setInterval(async function() {
				if (unsafeWindow.globalThis[storeName].modules) {
					clearInterval(loop);
					resolve();
				}
			}, 10);
		});
		unsafeWindow.globalThis[storeName].saveVapeConfig = saveVapeConfig;
		unsafeWindow.globalThis[storeName].loadVapeConfig = loadVapeConfig;
		unsafeWindow.globalThis[storeName].exportVapeConfig = exportVapeConfig;
		unsafeWindow.globalThis[storeName].importVapeConfig = importVapeConfig;
		loadVapeConfig();
		setInterval(async function() {
			saveVapeConfig();
		}, 10000);
	}

	const publicUrl = "scripturl";
	if (publicUrl == "scripturl") {
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			window.addEventListener("beforescriptexecute", function(e) {
				if (e.target.src.includes("https://miniblox.io/assets/index")) {
					e.preventDefault();
					e.stopPropagation();
					execute(e.target.src);
				}
			}, false);
		}
		else {
			new MutationObserver(async (mutations, observer) => {
				let oldScript = mutations
					.flatMap(e => [...e.addedNodes])
					.filter(e => e.tagName == 'SCRIPT')
					.find(e => e.src.includes("https://miniblox.io/assets/index"));

				if (oldScript) {
					observer.disconnect();
					execute(oldScript.src, oldScript);
				}
			}).observe(document, {
				childList: true,
				subtree: true,
			});
		}
	}
	else {
		execute(publicUrl);
	}
})();
