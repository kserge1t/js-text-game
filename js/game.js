$(document).ready(function() {$('header').prepend("JS Start!");
	player = "&nabla;"; // PLayer's location
	battle = "&otimes;"; // Battle
	unknown = "&loz;"; // Unknown location
	visited = "&there4;" // Visited location
	none = "&nbsp;" // Empty location
	gridSize = [25,25];
	grid = [[],[]];
	
	for (i0=0;i0<gridSize[0];i0++) {
		for (i1=0;i1<gridSize[1];i1++) {
			$("#map").append("<div id='pixel' class='pix"+i0+"-"+i1+"'>"+none+"</div>");
		}
	}
	/* Player.setCoordinates(Math.round(gridSize[0]*0.2),Math.round(gridSize[1]*0.5)); */
	
	// Player object
	var Player = {
	  coordinates: [], // position of the player
	  locationInfo: grid[[0],[0]],
	  health: 1, // health % (1 = 100%)
	  damage: [0.1,0.2], // from-to % (1 = 100%)
	  accuracy: 0.5, // hit accuracy % (1 = 100%)
	  aidKits: 1, // number of available aid kits
	  setCoordinates: function(x,y) {
		 switch (grid[[x][y]]) {
			case none:
				$("#log").append("<div>There is nothing here.</div>");
				break;
			case visited:
				$("#log").append("<div>You previously visited this place.</div>");
				break;
			case unknown:
				$("#log").append("<div>You found a new location! Explore it?</div>");
				break;
		 }
		this.coordinates = [x,y];
		this.getStats();
		$(".pix"+x+"-"+y).replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+player+"</div>");
		/* $(".pix0-0").replaceWith("<div id='pixel' class='pix"+x+"-"+y+"'>"+player+"</div>"); */
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
	
	Player.getStats();
	/* Player.setCoordinates(5,5); */
	
	
	
$('header').append("JS End!");});
