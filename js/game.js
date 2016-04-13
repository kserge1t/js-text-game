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
    console.log("JS started");

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
        var enemy = "&times;"; // × Enemy's location
        var teleporterOneWay = "&#9737;"; // ☉ Teleporter1
        var teleporterRandom = "&#1758;"; // ۞ Teleporter2
	var none = "&nbsp;"; // Blank location
	var gridSize = [25,25]; // Grid/Map dimensions
	var grid = []; // Map locations array

        // Generate map
	for (x=0;x<gridSize[0];x++) {
            grid[x] = [];
            for (y=0;y<gridSize[1];y++) {
                grid[x][y] = none; // Empty map pixel
		$("#map").append("<div id='pixel' class='pix"+x+"-"+y+"'>"+grid[x][y]+"</div>"); // Generate map location
            }
            $("#map").append("<br>");
	}
        
        var setMap = function(x,y,type) {
            grid[x][y] = type; // What to put on the map
            $(".pix"+x+"-"+y).replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+grid[x][y]+"</div>"); // Generate map location
        };
        
        // Crete blocked area loop
        for (i=0;i<grid[0].length;i++) {
            setMap(i,Math.ceil((grid[0].length-1)*0.15),blocked); // Block area proportionally to map size
        }
        setMap(Math.ceil((grid.length-1)*0.05),Math.floor((grid[0].length-1)*0.95),teleporterOneWay); // Set teleporter one way, proportionally to map size
        setMap(Math.floor((grid.length-1)*0.95),Math.ceil((grid[0].length-1)*0.05),teleporterRandom); // Set teleporter random, proportionally to map size
        $("#log").prepend("<div>You woke up to find yourself in an unknown area... You have to find your way out of here!</div>");
        
        
        // Weapons specifications
        var weaponSpecs = function(weapon) {
            // Weapon Name, [Min damage, Max Damage], Accuracy
            switch (weapon) {
                case "fists":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(3,5),rndMinMax(6,10)],rndMinMax(90,97)];
                    break;
                case "knife":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(11,15)],rndMinMax(85,95)];
                    break;
                case "pistol":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(15,20)],rndMinMax(65,80)];
                    break;
                case "rifle":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(10,15),rndMinMax(20,25)],rndMinMax(80,90)];
                    break;
                case "shotgun":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(5,10),rndMinMax(35,50)],rndMinMax(70,80)];
                    break;
                case "machinegun":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(15,20),rndMinMax(25,30)],rndMinMax(75,85)];
                    break;
                case "flamethrower":
                    return [weapon.capitalizeFirstLetter(),[rndMinMax(10,15),rndMinMax(30,40)],rndMinMax(80,90)];
                    break;
                default:
                    return [weapon.capitalizeFirstLetter()+"&nbsp;(untrained)",[rndMinMax(0,9),rndMinMax(10,20)],rns(30,59)];
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
        
        // Player constructor (main user and enemies)
	function Player(coordinates, hitPoints, aidKits, weapon) {
	  this.hitPoints = hitPoints; // Initial hitpoints
          this.aidKits = aidKits; // Initial aid kits
          this.weaponType; // weapon name
          this.weaponDamage; // weapon damage
          this.weaponAccuracy; // weapon accuracy
	  this.coordinates = [0,0]; // Temporary coordinates, to avoid undefined error on setCoordinates()
          
          this.setWeapon = function(weapon) {
              weapon = weaponSpecs(weapon); // get weapon specs into array
              this.weaponType = weapon[0];
              this.weaponDamage = weapon[1];
              this.weaponAccuracy = weapon[2];
              this.refreshStats(); // refresh player stats
          };
          this.setCustomWeapon = function(name,damage,accuracy) {
              this.weaponType = name;
              this.weaponDamage = damage;
              this.weaponAccuracy = accuracy;
              this.refreshStats(); // refresh player stats
          };
	  this.setCoordinates = function(x,y) {
		if (x>=0 && x<grid.length && y>=0 && y<grid[0].length && grid[x][y]!== blocked) {
			$(".pix"+this.coordinates[0]+"-"+this.coordinates[1]).replaceWith("<div id='pixel' class='pix"+this.coordinates[0]+"-"+this.coordinates[1]+"'>"+grid[this.coordinates[0]][this.coordinates[1]]+"</div>"); // Remove user mark from previous location
			$(".pix"+x+"-"+y).replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+user+"</div>"); // Add user mark to new location
			this.coordinates = [x,y]; // apply the new coordinates
			this.refreshStats(); // refresh player stats
			switch (grid[x][y]) {
				case visited:
					$("#log").prepend("<div>You previously visited this place.</div>");
					break;
				case unknown:
					$("#log").prepend("<div>You found a new location!</div>");
					break;
				case teleporterOneWay:
					$("#log").prepend("<div>You found a teleporter...</div>");
                                        if (confirm('Would you like to use the teleporter?')) {
                                            return this.setCoordinates(Math.floor((grid.length-1)*0.05),Math.floor((grid[0].length-1)*0.05)); // Teleport to top-left area in the blocked area
                                        }
					break;
				case teleporterRandom:
					$("#log").prepend("<div>You found another teleporter, this one looks damaged and unpredictable...</div>");
                                        if (confirm('Would you like to use the damaged teleporter?')) {
                                            var x, y;
                                            do {
                                                x = Math.round(Math.random()*(grid.length-1));
                                                y = Math.round(Math.random()*(grid[0].length-1));
                                                $("#log").prepend("<div>"+grid[x][y]+"</div>");
                                            } while (grid[x][y] !== none); // if randomly picked location is not empty, pick new location
                                            return this.setCoordinates(x,y); // Teleport to random empty location on the map
                                        }
					break;
			}
		}
		else {
			$("#log").prepend("<div>The path is blocked...</div>");
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
	  this.refreshStats = function() {
            $("#stats").replaceWith(
			"<div id='stats'>"+
			"<b><u>User Stats:</u></b>"+
			"<br>Hit Points: "+this.hitPoints+
			"<br>Aid Kits: "+this.aidKits+
			"<br>Weapon: "+this.weaponType+
			"<br>Damage: "+this.weaponDamage[0]+"-"+this.weaponDamage[1]+
			"<br>Accuracy: "+this.weaponAccuracy+"%"+
			"<br>Coordinates: "+this.coordinates+
			"</div>"
            );
	  };
          this.setWeapon(weapon); // Set initial weapon
          this.setCoordinates(coordinates[0],coordinates[1]); // Set initial coordinates
	};

	// Create the main User Player
        var User = new Player(
            [Math.round((grid.length-1)*0.9),Math.ceil((grid[0].length-1)*0.3)], // Initial location in proportion to map size
            100, // initial hit points
            1, // initial aid kits
            "fists" // initial weapon
        );
        
	$(document).keydown(function(e){
		switch (e.keyCode) {
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
	});
	
console.log("JS finished");
});
