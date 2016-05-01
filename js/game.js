/* 
 * Copyright (C) 2016 Serj86 <github.com/serj86>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


$(document).ready(function() {

        // Html codes for special characters
        // "&#149;"; // •
        // "&#9737;"; // ☉
        // "&#9733;"; // ★
        // "&#1758;"; // ۞
        // "&#165;"; // ¥
        // "&nabla;"; // ∇
        // "&#9650;"; // ▲
        // "&#9660"; // ▼
        // "&#9658;"; // ►
        // "&#9668;"; // ◄
        // "&#2947;"; // ∴ (large)
        // "&loz;"; // ◊
        // "&diams;"; // ♦
        // "&there4;"; // ∴
        // "&#9618;"; // ▒
        // "&times;"; // ×
        
	var user = "&nabla;"; // ∇ User's location
	var explore = "&diams;"; // ♦ Unknown location
	var blocked = "&#9618;"; // ▒ Blocked location
        var enemy = "&#9733;"; // ★ Enemy's location
        var teleporterOneWay = "&#9737;"; // ☉ Teleporter one-way departure
        var teleporterArrival = "&there4;"; // ∴ Teleporter one-way arrival
        var teleporterRandom = "&#1758;"; // ۞ Teleporter random
	var none = "&nbsp;"; // Blank location
        var commonWeapon = ["Bow","Crossbow","Sword","Spear","Hummer","Mace","Club","Knife","Axe"]; // common weapons
        var tempWeapon;
	var gridSize = [40,40]; // Grid/Map dimensions
        var initX = Math.round((gridSize[0]-1)*0.9); // Initial user X coord in proportion to map size
        var initY = Math.ceil((gridSize[1]-1)*0.3); // Initial user Y coord in proportion to map size
	var grid = []; // Map locations array
        var enemyGrid = []; // enemies grid
        var enemies = []; // enemies array
        var guide = "<b>Guide for the JavaScript Tex Based Web Game by Serg86</b>\
            <p>Your hometown has been invaded by local marauders, and you are the only hope to set your town free again!</p>\
            <p>The goal is to defeat all the enemy invaders, marked '"+enemy+"' on the map, and save your hometown.\
            You are marked '<b>"+user+"</b>' on the map; you can move with the keyboard arrows or by using a virtual joystick at the bottom-right corner.\
            While fighting, both you and the enemy get more experienced with the equiped weapon and make more accurate strikes. You also get more accurate after winning a fight\
            Each round there is a chance to damage the equipped weapon, once weapon's durability reaches zero, the weapon cannot be used anymore.\
            When not in battle, both you and the enemies can use Aid-Kits to heal the missing hit-points,\
            activated by clicking on the center of the virtual joystick (each aid-kit will restore at least half of the missing hit-points).\
            Make sure to explore areas, marked '"+explore+"' on the map, you can find there Aid-Kits and even wapons.</p>\
            <p>Click on '<b>i</b>' at the corner of the virtual joystick to bring this guide back.</p>";
        
        
        // Proportional resize of game interface + calling recenter map
        var resizing = function() {
            var h = (($(window).height()-$("html").height()+$("#map").height())*0.98);
            var w = (($(window).width()-$("#main").width()+$("#map").width())*0.98);
            $("#map").css("max-height",h);
            $("#stats").css("height",$("#map").height());
            $("#map").css("max-width",w);
            $("#log").css("width",$("#map").width());
            User.mapScroll();
        };
        
        // Set object on grid
        var setGrid = function(x,y,type) {
            grid[x][y] = type; // Set object on grid
            setMap(x,y,type); // Set icon on map
        };
        
        // Set icon on map
        var setMap = function(x,y,type) {
            $(".pix"+x+"-"+y).replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+type+"</div>"); // Set icon on map
        };
        
        // Set weapons (higher the number, lesser the chance to get a special wepon)
        var newWeapon = function(number) {
            // Weapon Name, [Min damage, Max Damage], Accuracy range, Condition range
            switch (number) {
                case 0:
                    return ["Fists", [rndMinMax(3,5), rndMinMax(7,9)], rndMinMax(80,90), 100]; // Special weapon (default)
                    break;
                case 1:
                    return ["Pistol",[rndMinMax(8,12),rndMinMax(15,18)],rndMinMax(65,75),rndMinMax(45,85)]; // Special weapon
                    break;
                case 2:
                    return ["Rifle",[rndMinMax(10,15),rndMinMax(18,20)],rndMinMax(70,80),rndMinMax(35,70)]; // Special weapon
                    break;
                case 3:
                    return ["Shotgun",[rndMinMax(8,12),rndMinMax(20,25)],rndMinMax(70,80),rndMinMax(30,60)]; // Special weapon
                    break;
                case 4:
                    return ["Machinegun",[rndMinMax(10,15),rndMinMax(20,25)],rndMinMax(60,70),rndMinMax(25,50)]; // Special weapon
                    break;
                case 5:
                    return ["Flamethrower",[rndMinMax(10,15),rndMinMax(25,30)],rndMinMax(50,70),rndMinMax(20,40)]; // Special weapon
                    break;
                default:
                    return [commonWeapon[rndMinMax(0,commonWeapon.length-1)],[rndMinMax(6,12),rndMinMax(15,20)],rndMinMax(55,80),rndMinMax(30,90)]; // Common weapons
            }
        };
        
        // Capitalize first letter of a sting
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        
        // Min-Max randomizer
        var rndMinMax = function(min,max) {
            return Math.round(Math.random()*(max-min)+min);
        };
        
        var log = function(record) {
            var stamp = new Date(); // current time
            $("#log").prepend("<div><u><i>"+stamp.toLocaleString()+"</i></u>: "+record+"<hr></div>"); // update the log
        };
        
        // Adjust/resize game interface opon window's resize
        $( window ).resize(function() {
            resizing();
        });
        
        // Keybord keys navigation
	$(window).keypress(function(event){
            if ($("#dialog").css("display") === "none") {
		switch (event.keyCode) {
			case 37:
				User.moveLeft();
				break;
			case 38:
				User.moveUp();
				break;
			case 39:
				User.moveRight();
				break;
			case 40:
				User.moveDown();
				break;
			default:
				log("Invalid key");
				break;
		}
            }
	});
        
        // Virtual joystick navigation
        $("#controls").click(function(event){
            switch (event.target.id) {
                case "left":
                        User.moveLeft();
                        break;
                case "up":
                        User.moveUp();
                        break;
                case "right":
                        User.moveRight();
                        break;
                case "down":
                        User.moveDown();
                        break;
                case "center":
                        dialog("Aid-Kit will recover some of your healthYou have "+User.aidKits+" Aid-Kit(s)","Use Aid-Kit","Cancel","heal");
                        break;
                case "info":
                        dialog(guide,"Restart Game","Resume Game","restart");
                        break;
            }
        });
        
        // Player constructor (main user and enemies)
    function Player(hitPoints, aidKits, weapon) {
        this.hitPoints = hitPoints; // Initial hitpoints
        this.aidKits = aidKits; // Initial aid kits
        this.weaponType = weapon[0]; // weapon name
        this.weaponDamage = weapon[1]; // weapon damage
        this.weaponAccuracy = weapon[2]; // weapon accuracy
        this.weaponCondition = weapon[3]; // weapon durability
        this.coordinates = [0,0]; // initial coordinates (temporary)

          
        this.setWeapon = function(weapon) {
          this.weaponType = weapon[0];
          this.weaponDamage = weapon[1];
          this.weaponAccuracy = weapon[2];
          this.weaponCondition = weapon[3];
          this.refreshStats(); // refresh stats
        };

        this.mapScroll = function() {
              // Non-animated map scrolling
              //$("#map").scrollTop((this.coordinates[0]+1)*$("#pixel").height()-$("#map").height()/2);
              //$("#map").scrollLeft((this.coordinates[1]+1)*$("#pixel").width()-$("#map").width()/2);

              // Animated map scrolling
              $("#map").stop(true,true); // stop running animation and complete previous action
              $("#map").animate({
                  scrollTop: ((this.coordinates[0]+0.5)*$("#pixel").height()-$("#map").height()/2),
                  scrollLeft: ((this.coordinates[1]+0.5)*$("#pixel").width()-$("#map").width()/2)
              }, 300);
        };

        this.heal = function() {
            if (this.aidKits>0) {
              heal = rndMinMax((100-this.hitPoints)*0.5,(100-this.hitPoints));
              this.hitPoints += heal;
              this.aidKits --;
              this.refreshStats();
              if (this === User) {
                  dialog("You successfully recovered "+heal+" Hit-Points.","Close");
              }
            }
            else {
              if (this === User) {
                  dialog("You do not have any Aid-Kits left...","Close");
              }
            }
        };
          
        this.attack = function(enemy) {
            var userDamage = 0;
            var enemyDamage = 0;
            if (rndMinMax(0,100) <= this.weaponAccuracy) {
                userDamage = rndMinMax(this.weaponDamage[0],this.weaponDamage[1]);
  //                log("You made "+userDamage+" damage to the enemy with your "+this.weaponType); // update log
                enemy.hitPoints -= userDamage; // Deduct enemy's hit points
            }
            else {
                log("You missed the enemy with your "+this.weaponType); // update log
                this.accuracyGain(1,3); // increase accuracy by 0%-1%
            }

            this.weaponDegradation(1,3);

            if (enemy.hitPoints > 0) {
                if (rndMinMax(0,100) <= enemy.weaponAccuracy) {
                    enemyDamage = rndMinMax(enemy.weaponDamage[0],enemy.weaponDamage[1]);
                    this.hitPoints -= enemyDamage; // Deduct user's hit points
                    log("Enemy made "+enemyDamage+" damage to you with their "+enemy.weaponType); // update log
                }
                else {
                    log("The enemy missed you with their "+enemy.weaponType); // update log
                    enemy.accuracyGain(1,2); // increase enemy's accuracy by 0%-2%
                }
                
                enemy.weaponDegradation(1,3);
                
                if (this.hitPoints > 0) {
                    dialog("Round results:<br>You made "+userDamage+" damage to the enemy.<br>The enemy made "+enemyDamage+" damage to you.<br>"+User.statsString()+enemy.statsString(),"Continue attack!","Flee from battle","fight");
                }
                else {
                    this.hitPoints = 0;
                    dialog("Game Over:<br>The enemy made "+enemyDamage+" damage and killed you...<br>"+User.statsString()+enemy.statsString(),"Restart the game",undefined,"restart");
                }
            }
            else {
                enemy.hitPoints = 0;
                setGrid(this.coordinates[0],this.coordinates[1],explore);
                setMap(this.coordinates[0],this.coordinates[1],user);
                if (enemy.weaponType !== "Fists") {
                    tempWeapon = [enemy.weaponType,enemy.weaponDamage,enemy.weaponAccuracy-10,enemy.weaponCondition];
                    dialog("Fight is over, you made "+userDamage+" damage to the enemy and killed it!<br> The enemy had "+enemy.aidKits+" Aid-Kit(s)<br>"+User.statsString()+enemy.statsString()+"<br><i>* Since you are not as familiar with the enemy's weapon, <br>there will be 10% accuracy penality...</i>","Equip enemy's weapon","Discard enemy's weapon","equip");
                }
                else {
                    dialog("Fight is over, you made "+userDamage+" damage to the enemy and killed it!<br> The enemy had "+enemy.aidKits+" Aid-Kit(s)<br>"+User.statsString()+enemy.statsString(),"Close");
                }
                User.aidKits += enemy.aidKits; // get enemy's aid-kits
                enemies.splice(enemies.indexOf(enemy),1); // remove defeated enemy from array
                if (enemies.length <= 0) {
                    dialog("Game Over:<br>You have defeated all the enemy invaders, and freed your hometown!<br>"+User.statsString(),"Play Again",undefined,"restart");
                }
            }
            this.refreshStats();
        };
        
        this.accuracyGain = function(min,max) {
            this.weaponAccuracy += rndMinMax(min,max); // increase accuracy by min-max
            if  (this.weaponAccuracy > 95) {
                this.weaponAccuracy = 95; // Max accuracy 95%
            }
        };
        
        this.weaponDegradation = function(min,max) {
            if (this.weaponType !== "Fists") {
                this.weaponCondition -= rndMinMax(min,max); // decrease weapon condition by min-max
                if (this.weaponCondition <= 0) {
                    log(this.weaponType+" reached unusable condition and was discarded"); // update log
                    this.setWeapon(newWeapon(0)); // set fists as weapon
                }
            }
        };
          
        this.setCoordinates = function(x,y) {
            if (x>=0 && x<grid.length && y>=0 && y<grid[0].length && grid[x][y]!==blocked) {
                if (this === User) {
                    setMap(this.coordinates[0],this.coordinates[1],grid[this.coordinates[0]][this.coordinates[1]]); // Restore previous map location
                    setMap(x,y,user); // set user icon on new map location
                    this.coordinates = [x,y]; // apply the new coordinates
                    this.refreshStats(); // Refresh user stats
                    this.mapScroll(); // Center map

                    // Events on map
                    switch (grid[x][y]) {
                        case explore:
                                rnd = Math.random();
                                if (rnd > 0.5) {
                                    dialog("You found an Aid Kit!","Close");
                                    User.aidKits++;
                                    User.refreshStats();
                                }
                                else {
                                    if (rnd < 0.25) {
                                        dialog("You searched around, but did not find anything of value...","Close");
                                    }
                                    else {
                                        tempWeapon = newWeapon(rndMinMax(1,10)); // random weapon, exluding fists
                                        dialog("You found a weapon! <p>Type: "+tempWeapon[0]+"<br>Damage: "+tempWeapon[1][0]+"-"+tempWeapon[1][1]+"<br>Accuracy: "+tempWeapon[2]+"%<br>Condition: "+tempWeapon[3]+"%</p>","Equip","Discard","equip");
                                    }
                                }
                                setGrid(User.coordinates[0],User.coordinates[1],none);
                                setMap(User.coordinates[0],User.coordinates[1],user);
                                break;
                        case enemy:
                                dialog("You encountered an enemy!<br>"+User.statsString()+enemyGrid[x][y].statsString(),"Attack!","Escape...","fight");
                                break;
                        case teleporterOneWay:
                                dialog("You found a teleporter! Would you like to use the teleporter?","Use teleporter","Leave it alone","teleporterOneWay");
                                break;
                        case teleporterArrival:
                                dialog("You are standing on some sort of landing platform, apperantly it is a one-way teleporter's arriving point. Have to find some other way to return...","Close");
                                break;
                        case teleporterRandom:
                              dialog("You found abandoned teleporter, it is covered with dust and probably unstable... Would you like to use the teleporter?","Use teleporter","Leave it alone","teleporterRandom");
                              break;
                    }
                }
                else {
                    setGrid(this.coordinates[0],this.coordinates[1],none); // Set previous map location to none
                    setGrid(x,y,enemy); // set enemy icon on new map location
                    this.coordinates = [x,y]; // apply the new coordinates
                }
            }
              else {
                if (this === User) {
                    dialog("The path is blocked...","Close");
                }
              }
        };
        
        // Enemy random move
        this.randomMove = function() {
            x;
            y;
        if (this.hitPoints < 75) {
            this.heal(); // Use aid-Kit
        }
            
            // 8 directions
            switch (rndMinMax(0,7)) {
			case 0:
                            x = this.coordinates[0]+0;
                            y = this.coordinates[1]+1;
                            break;
			case 1:
                            x = this.coordinates[0]+1;
                            y = this.coordinates[1]+0;
                            break;
			case 2:
                            x = this.coordinates[0]+1;
                            y = this.coordinates[1]+1;
                            break;
			case 3:
                            x = this.coordinates[0]+0;
                            y = this.coordinates[1]-1;
                            break;
			case 4:
                            x = this.coordinates[0]-1;
                            y = this.coordinates[1]+0;
                            break;
			case 5:
                            x = this.coordinates[0]-1;
                            y = this.coordinates[1]-1;
                            break;
			case 6:
                            x = this.coordinates[0]+0;
                            y = this.coordinates[1]+0;
                            break;
			case 7:
                            x = this.coordinates[0]+0;
                            y = this.coordinates[1]+0;
                            break;
            }
            
            if (x>=0 && x<grid.length && y>=0 && y<grid[0].length && (grid[x][y] === none || grid[x][y] === explore)) {
                
                // Enemies have 3% chance to "drop" something while moving
                if (Math.random() > 0.03) {
                    setGrid(this.coordinates[0],this.coordinates[1],none); // Set previous map location to none
                }
                else {
                    setGrid(this.coordinates[0],this.coordinates[1],explore); // Set previous map location to explore
                }
                setGrid(x,y,enemy); // Move enemy to new grid location
                this.coordinates = [x,y]; // apply the new coordinates
                enemyGrid[x][y] = this; // Update enemy grid with new coordinates
                
                // Attack user on adjacent cell
                if (
                        (User.coordinates[0]===x   && User.coordinates[1]===y)   || 
                        (User.coordinates[0]===x   && User.coordinates[1]===y+1) || 
                        (User.coordinates[0]===x   && User.coordinates[1]===y-1) || 
                        (User.coordinates[0]===x+1 && User.coordinates[1]===y)   || 
                        (User.coordinates[0]===x+1 && User.coordinates[1]===y+1) || 
                        (User.coordinates[0]===x+1 && User.coordinates[1]===y-1) ||
                        (User.coordinates[0]===x-1 && User.coordinates[1]===y)   || 
                        (User.coordinates[0]===x-1 && User.coordinates[1]===y+1) || 
                        (User.coordinates[0]===x-1 && User.coordinates[1]===y-1)
                    ) 
                        {
                            setGrid(this.coordinates[0],this.coordinates[1],none); // Empty previous grid location
                            setGrid(User.coordinates[0],User.coordinates[1],enemy); // set enemy on user's grid location
                            this.coordinates = [User.coordinates[0],User.coordinates[1]]; // apply the new coordinates
                            enemyGrid[User.coordinates[0]][User.coordinates[1]] = this; // Update enemy grid with new coordinates
                            dialog("You have been attacked by a nearby enemy!<br>"+User.statsString()+enemyGrid[x][y].statsString(),"Defend!",undefined,"fight"); // Defend against enemy's attack no escape
                        }
            }
        };
          
        this.moveUp = function() {
                        this.setCoordinates(this.coordinates[0]-1,this.coordinates[1]);
        };
        this.moveDown = function() {
                        this.setCoordinates(this.coordinates[0]+1,this.coordinates[1]);
        };
        this.moveLeft = function() {
                        this.setCoordinates(this.coordinates[0],this.coordinates[1]-1);
        };
        this.moveRight = function() {
                        this.setCoordinates(this.coordinates[0],this.coordinates[1]+1);
        };
        
        this.randomLocation = function() {
            var x, y;
            do {
                x = rndMinMax(0,grid.length-1);
                y = rndMinMax(0,grid[0].length-1);
            } while (grid[x][y] !== none); // while randomly picked location is not empty, pick a new location
            return this.setCoordinates(x,y); // Set coordinates to random empty location on the map
        };
        
        // Refresh stats display
        this.refreshStats = function() {
            if (this === User) {
                $("#user").replaceWith(
                    "<div id='user'>"+
                    "<p><b><u>User Stats:</u></b>"+
                    "<br>Hit&nbsp;Points:&nbsp;"+this.hitPoints+
                    "<br>Aid&nbsp;Kits:&nbsp;"+this.aidKits+
                    "</p>"+
                    "<p><b><u>Weapon Specs:</u></b>"+
                    "<br>Weapon:&nbsp;"+this.weaponType+
                    "<br>Damage:&nbsp;"+this.weaponDamage[0]+"-"+this.weaponDamage[1]+
                    "<br>Accuracy:&nbsp;"+this.weaponAccuracy+"%"+
                    "<br>Condition:&nbsp;"+this.weaponCondition+"%"+
                    "</p>"+
                    "<p><b><u>Other Info:</u></b>"+
                    "<br>Coordinates:&nbsp;"+this.coordinates+
                    "<br>Enemies:&nbsp;"+enemies.length+
                    "</p>"+
                    "</div>"
                );
            }
        };
        
        // Stats to string
        this.statsString = function() {
            if (this === User) {
                name = "User";
            }
            else {
                name = "Enemy";
            }
            return      "<div id='statsString'><p><b><u>"+name+" Stats</u></b>"+
                        "<br>Hit&nbsp;Points:&nbsp;"+this.hitPoints+
                        //"<br>Aid&nbsp;Kits:&nbsp;"+this.aidKits+
                        "<br>Weapon:&nbsp;"+this.weaponType+
                        "<br>Damage:&nbsp;"+this.weaponDamage[0]+"-"+this.weaponDamage[1]+
                        "<br>Accuracy:&nbsp;"+this.weaponAccuracy+"%"+
                        "<br>Condition:&nbsp;"+this.weaponCondition+"%"+
                        //"<br>Coordinates:&nbsp;"+this.coordinates+
                        "</div>"
            ;
        };
        
        // Must be after all methods that are in use
        //this.setWeapon(weapon); // Set initial weapon
        this.refreshStats(); // refresh stats
    };
        
        function spawnEnemy(hitPoint,aidKits,weapon) {
            enemies.push(new Player(
                    hitPoint, // Enemy hit points
                    aidKits, // Enemy aid kits
                    weapon // random enemy weapon
                ));
                enemies[enemies.length-1].randomLocation(); // set enemy random location
                enemyGrid[enemies[enemies.length-1].coordinates[0]][enemies[enemies.length-1].coordinates[1]] = enemies[enemies.length-1]; // put enemy on enemy grid
        }
        
        // Randomly move 20% of enemies on the map every 2-3 seconds
        function enemyMove() {
            if ($("#dialog").css("display") === "none") {
                for (i=0;i<Math.ceil(enemies.length*0.2);i++) {
                    enemies[rndMinMax(0,enemies.length-1)].randomMove(); // randomly move current enemy
                }
            }
            setTimeout(enemyMove, rndMinMax(2000,3000)); // repeat at random intervals
        }
        
        // Dialog
        function dialog(mainText,acceptText,rejectText,setClass) {
            log(mainText); // update log
            $("#overlay, #dialog").stop(true,true); // stop unfinished animation and complete the action
            $("#inquiry").replaceWith("<div id='inquiry'>"+mainText+"<br></div>"); // main dialog text
            $("#accept").replaceWith("<div id='accept' class='"+setClass+"'>"+acceptText+"</div>"); // accept text
            $("#reject").replaceWith("<div id='reject' class='"+setClass+"'>"+rejectText+"</div>"); // reject text
            
            $("#accept, #reject").click (function(){
                    $("#overlay, #dialog").hide("fast"); // Hide dialog after clicking a button
            });
            
            if (rejectText === undefined) {
                $("#reject").hide(); // hide reject button
            }
            else {
                $("#reject").show(); // show reject button
            }
                
                $("#accept.equip").click (function(){
                    User.setWeapon(tempWeapon); // equip new weapon
                });

                $("#accept.fight").click (function(){
                    User.attack(enemyGrid[User.coordinates[0]][User.coordinates[1]]); // Attack enemy at user's coordinates
                });
                
                $("#reject.fight").click (function(){
                    //dialog("You have retreated from the enemy.","Close");
                    dialog("You have retreated from the enemy.","Use Aid-Kit","Close","heal");
                });
                
                $("#accept.teleporterRandom").click (function(){
                    User.randomLocation(); // Teleport to random location
                    dialog("You were able to start the old teleporter; it looks like it transported you to a random area!","Close");
                });
                
                $("#accept.restart").click (function(){
                    location.reload(); // reload page
                });

                $("#accept.teleporterOneWay").click (function(){
                    var x = Math.floor((grid.length-1)*0.05);
                    var y = Math.floor((grid[0].length-1)*0.05);
                    setGrid(x,y,teleporterArrival); // Create teleport landing platform;
                    User.setCoordinates(x,y); // Teleport to top-left area in the blocked section
                });
                
                $("#accept.heal").click (function(){
                    User.heal();
                });
                
            
            
            // Position show dialog
            $("#dialog").css("left",($(window).width()-parseFloat($("#dialog").css("width")))/2+"px"); // center dialog horizontally
            $("#dialog").css("top",($(window).height()-parseFloat($("#dialog").css("height")))/2.5+"px"); // center with shift on top dialog vertically
            $("#overlay, #dialog").show(400); // show dialog
            
        };
        

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Generate map
	for (x=0;x<gridSize[0];x++) {
            grid[x] = [];
            enemyGrid[x] = [];
            for (y=0;y<gridSize[1];y++) {
                var rnd = Math.random();
                if (rnd > 0.05) {
                    grid[x][y] = none; // Empty map pixel
                }
                else {
                    if (rnd > 0.015) {
                        grid[x][y] = blocked; // Blocked map pixel
                    }
                    else {
                        grid[x][y] = explore; // Unknown map location
                    }
                }
            
		$("#map").append("<div id='pixel' class='pix"+x+"-"+y+"'>"+grid[x][y]+"</div>"); // Generate map location
            }
            $("#map").append("<br>");
	}
         
	// Create the main User Player
        var User = new Player(
            100, // initial hit points
            1, // initial aid kits
            newWeapon(1) // initial weapon
        );
        setGrid(initX,initY,none); // empty initial coordinates
        User.setCoordinates(initX,initY); // Set initial coordinates, in proportion to map size
        resizing(); // initial resize (must run after User creation)

        // Crete blocked area
        for (i=0;i<grid[0].length;i++) {
            setGrid(i,Math.ceil((grid[0].length-1)*0.15),blocked); // Block area proportionally to map size
        }
        setGrid(Math.ceil((grid.length-1)*0.05),Math.floor((grid[0].length-1)*0.95),teleporterOneWay); // Set teleporter one way, proportionally to map size
        setGrid(Math.floor((grid.length-1)*0.95),Math.ceil((grid[0].length-1)*0.05),teleporterRandom); // Set teleporter random, proportionally to map size

        for (i=0;i<gridSize[0]*gridSize[1]*0.01;i++) {
            spawnEnemy(
                100, // Enemy hit points
                rndMinMax(0,2), // Enemy aid kits
                newWeapon(rndMinMax(0,enemies.length)) // random enemy weapon
            );
        }
        enemyMove();

        User.refreshStats(); // refresh user stats
        dialog(guide,"Start");
        
});
