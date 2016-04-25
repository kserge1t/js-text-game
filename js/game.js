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
	var visited = "&loz;"; // ◊ Visited location
	var unknown = "&diams;"; // ♦ Unknown location
	var blocked = "&#9618;"; // ▒ Blocked location
        var enemy = "&#9733;"; // ★ Enemy's location
        var rip = "&times;"; // × Defeated enemy
        var teleporterOneWay = "&#9737;"; // ☉ Teleporter one-way departure
        var teleporterArrival = "&there4;"; // ∴ Teleporter one-way arrival
        var teleporterRandom = "&#1758;"; // ۞ Teleporter -random
	var none = "&nbsp;"; // Blank location
        var weapons = ["Fists","Bow","Sword","Spear","Hummer","Mace","Club","Knife","Pistol","Rifle","Shotgun","Machinegun","Flamethrower"]; // wepons
	var gridSize = [50,50]; // Grid/Map dimensions
	var grid = []; // Map locations array
        var enemyGrid = []; // enemies grid
        var enemies = []; // enemies array
        
        
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
        
        // Weapons specifications
        var weaponSpecs = function(weapon) {
            // Weapon Name, [Min damage, Max Damage], Accuracy
            switch (weapon) {
                case weapons[0]:
                    return [weapon.capitalizeFirstLetter(), [rndMinMax(3,5), rndMinMax(6,10)], rndMinMax(90,97)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[1]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(11,15)],rndMinMax(85,95)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[2]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(15,20)],rndMinMax(65,80)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[3]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(10,15),rndMinMax(20,25)],rndMinMax(80,90)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[4]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(35,50)],rndMinMax(70,80)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[5]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(15,20),rndMinMax(25,30)],rndMinMax(75,85)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                case weapons[6]:
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(10,15),rndMinMax(30,40)],rndMinMax(80,90)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
                    break;
                default:
                    return [weapon.capitalizeFirstLetter()+"&nbsp;(untrained)",[rndMinMax(1,9),rndMinMax(10,20)],rndMinMax(25,59)]; // [Weapon's name, [Minimum damage range, Maximum damage range], Accuracy range]
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
				$("#log").prepend("<div>Invalid key</div>");
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
                                dialog("Game paused... Continue or Restart?","Restart","Continue","restart");
				break;
            }
        });
        
        // Player constructor (main user and enemies)
    function Player(hitPoints, aidKits, weapon) {
        this.hitPoints = hitPoints; // Initial hitpoints
        this.aidKits = aidKits; // Initial aid kits
        this.weaponType; // weapon name
        this.weaponDamage; // weapon damage
        this.weaponAccuracy; // weapon accuracy
        this.coordinates = [0,0]; // initial coordinates (temporary)

          
          this.setWeapon = function(weapon) {
            weapon = weaponSpecs(weapon); // get weapon specs into array
            this.weaponType = weapon[0];
            this.weaponDamage = weapon[1];
            this.weaponAccuracy = weapon[2];
            this.refreshStats(); // refresh stats
          };
          
          this.setCustomWeapon = function(name,damage,accuracy) {
            this.weaponType = name;
            this.weaponDamage = damage;
            this.weaponAccuracy = accuracy;
            this.refreshStats(); // refresh stats
          };
          
          this.mapScroll = function() {
//                // Non-animated map scrolling
//                $("#map").scrollTop((this.coordinates[0]+1)*$("#pixel").height()-$("#map").height()/2);
//                $("#map").scrollLeft((this.coordinates[1]+1)*$("#pixel").width()-$("#map").width()/2);
//                
                // Animated map scrolling
                $("#map").stop(true,true); // stop running animation and complete previous action
                $("#map").animate({
                    scrollTop: ((this.coordinates[0]+0.5)*$("#pixel").height()-$("#map").height()/2),
                    scrollLeft: ((this.coordinates[1]+0.5)*$("#pixel").width()-$("#map").width()/2)
                }, 300);
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
                        case visited:
                                dialog("You previously visited this place.","close");
                                break;
                        case unknown:
                                dialog("You found remains of previous exploer.","Explore","Leave","explore");
                                break;
                        case enemy:
                                dialog("You encountered an enemy!"+enemyGrid[x][y].statsString(),"Attack!","Escape...","fight");
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
                    setGrid(this.coordinates[0],this.coordinates[1],none); // Restore previous map location
                    setGrid(x,y,enemy); // set user icon on new map location
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
            
            // 8 directions
            switch (Math.round(Math.random()*7)) {
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
            
            if (x>=0 && x<grid.length && y>=0 && y<grid[0].length && grid[x][y] === none) {
                setGrid(this.coordinates[0],this.coordinates[1],none); // Clear previous grid location
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
                            dialog("You have been attacked by a nearby enemy!"+enemyGrid[x][y].statsString(),"Defend!","Retreat...","fight");
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
                x = Math.round(Math.random()*(grid.length-1));
                y = Math.round(Math.random()*(grid[0].length-1));
            } while (grid[x][y] !== none); // while randomly picked location is not empty, pick a new location
            return this.setCoordinates(x,y); // Set coordinates to random empty location on the map
        };
        
        // Refresh stats display
        this.refreshStats = function() {
            if (this === User) {
                $("#user").replaceWith(
                    "<div id='user'>"+
                    "<b><u>User Stats:</u></b>"+
                    "<br>Hit&nbsp;Points:&nbsp;"+this.hitPoints+
                    "<br>Aid&nbsp;Kits:&nbsp;"+this.aidKits+
                    "<br>Weapon:&nbsp;"+this.weaponType+
                    "<br>Damage:&nbsp;"+this.weaponDamage[0]+"-"+this.weaponDamage[1]+
                    "<br>Accuracy:&nbsp;"+this.weaponAccuracy+"%"+
                    "<br>Coordinates:&nbsp;"+this.coordinates+
                    "<br>Enemies:&nbsp;"+enemies.length+
                    "</div>"
                );
            }
        };
        
        // Stats to string
        this.statsString = function() {
            return      "<br><br><b><u>Enemy Stats:</u></b>"+
                        "<br>Hit&nbsp;Points:&nbsp;"+this.hitPoints+
                        "<br>Aid&nbsp;Kits:&nbsp;"+this.aidKits+
                        "<br>Weapon:&nbsp;"+this.weaponType+
                        "<br>Damage:&nbsp;"+this.weaponDamage[0]+"-"+this.weaponDamage[1]+
                        "<br>Accuracy:&nbsp;"+this.weaponAccuracy+"%"+
                        "<br>Coordinates:&nbsp;"+this.coordinates
            ;
        };
        
        // Must be after all methods that are in use
        this.setWeapon(weapon); // Set initial weapon
        //this.setCoordinates(coordinates[0],coordinates[1]); // Set initial coordinates
    };
        
        // Randomly move 15% of enemies on the map every 2-3 seconds
        function enemyMove() {
            if ($("#dialog").css("display") === "none") {
                for (i=0;i<Math.ceil(enemies.length*0.15);i++) {
                    enemies[Math.round(Math.random()*(enemies.length-1))].randomMove(); // randomly move current enemy
                }
            }
            setTimeout(enemyMove, rndMinMax(2000,3000)); // repeat at random intervals
        }
        
        // Dialog
        dialog = function (mainText,acceptText,rejectText,setClass) {
            var stamp = new Date(); // current time
            $("#log").prepend("<div><u><i>"+stamp.toLocaleString()+"</i></u>: "+mainText+"<hr></div>"); // update log
            $("#overlay, #dialog").stop(true,true); // stop unfinished animation and complete the action
            $("#inquiry").replaceWith("<div id='inquiry'>"+mainText+"<br></div>");
            $("#accept").replaceWith("<div id='accept' class='"+setClass+"'>"+acceptText+"</div>");
            $("#reject").replaceWith("<div id='reject' class='"+setClass+"'>"+rejectText+"</div>");
            
            $("#accept, #reject").click (function(){
                    $("#overlay, #dialog").hide("fast"); // Hide dialog after clicking a button
            });
            
            if (rejectText === undefined) {
                $("#reject").hide();
            }
            else {
                $("#reject").show();

                $("#accept.explore").click (function(){
                    dialog("You searched around, but did not find anything of value...","Close");
                });

                $("#accept.fight").click (function(){
                    dialog("Fight function not yet implemented, sorry...","Close");
                });
                
                $("#reject.fight").click (function(){
                    dialog("You have retreated from the enemy.","Close");
                });
                
                $("#accept.teleporterRandom").click (function(){
                    User.randomLocation(); // Teleport to random location
                    dialog("You were able to start the old teleporter; it looks like it transported you to a random area!","Close");
                });

                $("#accept.teleporterOneWay").click (function(){
                    var x = Math.floor((grid.length-1)*0.05);
                    var y = Math.floor((grid[0].length-1)*0.05);
                    setGrid(x,y,teleporterArrival); // Create teleport landing platform;
                    User.setCoordinates(x,y); // Teleport to top-left area in the blocked section
                });
                
                $("#accept.restart").click (function(){
                    dialog("Game restart functionality not yet implemented, but you can refresh the browser's window to start fresh...","Close");
                });
                
            }
            
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
                if (rnd > 0.06) {
                    grid[x][y] = none; // Empty map pixel
                }
                else {
                    if (rnd > 0.025) {
                        grid[x][y] = blocked; // Blocked map pixel
                    }
                    else {
                        if (rnd > 0.01) {
//                            enemyGrid[x][y] = new Player(
//                                [x,y], // Enemy coordinates
//                                100, // Enemy hit points
//                                1, // Enemy aid kits
//                                "Fists" // Enemy weapon
//                            );
//                            enemies.push(enemyGrid[x][y]);
                            grid[x][y] = none; // Empty map pixel
                        }
                        else {
                            grid[x][y] = unknown; // Unknown map location
                        }
                    }
                }
            
		$("#map").append("<div id='pixel' class='pix"+x+"-"+y+"'>"+grid[x][y]+"</div>"); // Generate map location
            }
            $("#map").append("<br>");
	}
        
	// Create the main User Player
        var User = new Player(
            //[Math.round((grid.length-1)*0.9),Math.ceil((grid[0].length-1)*0.3)], // Initial user location in proportion to map size
            100, // initial hit points
            1, // initial aid kits
            "Fists" // initial weapon
        );
        User.setCoordinates(Math.round((grid.length-1)*0.9),Math.ceil((grid[0].length-1)*0.3)); // Set initial coordinates, in proportion to map size
        resizing(); // initial resize (must run after User creation)

        // Crete blocked area
        for (i=0;i<grid[0].length;i++) {
            setGrid(i,Math.ceil((grid[0].length-1)*0.15),blocked); // Block area proportionally to map size
        }
        setGrid(Math.ceil((grid.length-1)*0.05),Math.floor((grid[0].length-1)*0.95),teleporterOneWay); // Set teleporter one way, proportionally to map size
        setGrid(Math.floor((grid.length-1)*0.95),Math.ceil((grid[0].length-1)*0.05),teleporterRandom); // Set teleporter random, proportionally to map size

        for (i=0;i<gridSize[0]*gridSize[1]*0.025;i++) {
            enemies[i] = new Player(
                //[0,0], // Enemy coordinates
                100, // Enemy hit points
                1, // Enemy aid kits
                "Fists" // Enemy weapon
            );
            enemies[i].randomLocation();
            enemyGrid[enemies[i].coordinates[0]][enemies[i].coordinates[1]] = enemies[i];
        }
        enemyMove();

        dialog(
                "While escaping from space marauders, your spaceship has been shot and you had to perform emergency landing on a deserted planet. During the emergency landing your ship caught on fire and explode! You were lucky enough to escape just before the explosion, but you were able to reclaim only an Aid-Kit, and a long range radio. Unfortunately, the radio's power source was damaged during the crush. The deserted planet you are on, was abandoned long time ago, and the only inhabitants left here are hiding criminals, lurking marauders, and space pirates. Try to explore the area, and find some weapon to protect yourself! The damaged radio, seems to be your only way to contact somebody for help, but you need to find a compatible power source to power it..."
        ,"Close");
        
});
