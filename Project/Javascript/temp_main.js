// TEMP MAIN


// Quick array sum methods

function add(x, y) { return x + y; }

// Define margin, width and height for SVG canvas
var margin_fg = {top: 20, right: 20, bottom: 30, left:80};
var width_fg = 800 - margin_fg.left - margin_fg.right;
var height_fg = 500 - margin_fg.top - margin_fg.bottom;

var length_array = new Array(16).fill(0)

console.log(length_array)

// Read in data and play with it
d3.csv("/Data/pathfinder_feats.csv", function(data) {

	console.log(data.length)

	var pre_req_cnt = 0;

	console.log("------------------------------------")

	for (var x = 0; x < data.length; x++) {
		console.log(x)

		// console.log(data[x])

		if (data[x].prerequisite_feats != "") 
		{

			console.log(String(data[x].prerequisite_feats))

			console.log("Length is: ", data[x].prerequisite_feats.split(",").length)

			pre_req_cnt++;

			length_array[data[x].prerequisite_feats.split(",").length]++

		}
		else length_array[0]++

	}

	console.log("------------------------------------")

	console.log(pre_req_cnt)

	console.log(length_array)

	console.log(length_array.reduce(add, 0))

});