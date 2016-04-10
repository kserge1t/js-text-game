$(document).ready(function() {$('#log').append("<i>Debug info: JS started</i>");
	player = "&nabla;"; // PLayer's location
	battle = "&otimes;"; // Battle
	unknown = "&loz;"; // Unknown location
	visited = "&there4;" // Visited location
	none = "&nbsp;" // Empty location
	gridSize = [25,25];
	grid = [[],[]];
	
	for (i0=0;i0<gridSize[0];i0++) {
		for (i1=0;i1<gridSize[1];i1++) {
			grid[[i0],[i1]] = none;
			$("#map").append("<div id='pixel' class='pix"+i0+"-"+i1+"'>"+grid[[i0],[i1]]+"</div>"); // Generate map
		}
	}
	/* Player.setCoordinates(Math.round(gridSize[0]*0.2),Math.round(gridSize[1]*0.5)); */
	
	// Player object
	var Player = {
	  coordinates: [], // position of the player
	  //locationInfo: grid[[0],[0]], 
	  health: 1, // health % (1 = 100%)
	  damage: [0.1,0.2], // from-to % (1 = 100%)
	  accuracy: 0.8, // hit accuracy % (1 = 100%)
	  aidKits: 1, // number of available aid kits
	  setCoordinates: function(x,y) {
		if (x>=0 && x<gridSize[0] && y>=0 && y<gridSize[1]) {
			switch (grid[[x][y]]) {
				case none:
					$("#log").prepend("<div>There is nothing here.</div>");
					break;
				case visited:
					$("#log").prepend("<div>You previously visited this place.</div>");
					break;
				case unknown:
					$("#log").prepend("<div>You found a new location! Explore it?</div>");
					break;
			}
			$(".pix"+this.coordinates[0]+"-"+this.coordinates[1]).replaceWith("<div id='pixel' class='pix"+this.coordinates[0]+"-"+this.coordinates[1]+"'>"+grid[[this.coordinates[0]],[this.coordinates[1]]]+"</div>");
			$(".pix"+x+"-"+y).replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+player+"</div>");
			this.coordinates = [x,y];
			this.getStats();
		}
		else {
			$("#log").prepend("<div>The path is blocked...</div>");
		}
	  },
	  moveUp: function() {
			  this.setCoordinates(this.coordinates[0]-1,this.coordinates[1])
	  },
	  moveDown: function() {
			  this.setCoordinates(this.coordinates[0]+1,this.coordinates[1])
	  },
	  moveLeft: function() {
			  this.setCoordinates(this.coordinates[0],this.coordinates[1]-1)
	  },
	  moveRight: function() {
			  this.setCoordinates(this.coordinates[0],this.coordinates[1]+1)
	  },
	  getStats: function() {
		 $("#stats").replaceWith(
			"<div id='stats'>"+
			"<b>Stats:</b>"+
			"<br>Health: "+this.health*100+"%"+
			"<br>Aid Kits: "+this.aidKits+
			"<br>Accuracy: "+this.accuracy*100+"%"+
			"<br>Damage: "+this.damage[0]*100+"-"+this.damage[1]*100+
			"<br>Coordinates: "+this.coordinates+
			"</div>"
		 );
	  }
	};
	Player.setCoordinates(Math.round(gridSize[0]*0.85),Math.floor(gridSize[1]*0.5));
	
	// Enemy object constructor
	function Enemy(coordinates, hitPoints, damage) {
	  this.coordinates = coordinates;
	  this.hitPoints = hitPoints;
	  this.damage = damage;
	};
	
	// Random enemy spawn
	function EnemyRand() {
	  this.coordinates = coordinates;
	  this.hitPoints = hitPoints;
	  this.damage = damage;
	};
	
	/* Player.getStats(); */
	$(document).keydown(function(e){
		switch (e.keyCode) {
			case 37:
				Player.moveLeft();
				break;
			case 38:
				Player.moveUp();
				break;
			case 39:
				Player.moveRight();
				break;
			case 40:
				Player.moveDown();
				break;
			default:
				$("#log").prepend("<div>Invalid key</div>");
				break;
		}
	});
	
$('#log').prepend("<i>Debug info: JS finished</i>");});
