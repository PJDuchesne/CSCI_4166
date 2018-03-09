// TEMP MAIN

// Define margin, width and height for SVG canvas
var margin_fg = {top: 20, right: 20, bottom: 30, left:80};
var width_fg = 800 - margin_fg.left - margin_fg.right;
var height_fg = 500 - margin_fg.top - margin_fg.bottom;

// Attempt to read in data





d3.csv("/Data/pathfinder_feats.csv", function(data) {

	console.log(data.length)

	for (var x = 0; x < data.length; x++) {
		console.log(x)

		console.log(data[x])

	}

});