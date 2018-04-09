/*
__/\\\\\\\\\\\\\_____/\\\\\\\\\\\__/\\\\\\\\\\\\____        
 _\/\\\/////////\\\__\/////\\\///__\/\\\////////\\\__       
  _\/\\\_______\/\\\______\/\\\_____\/\\\______\//\\\_      
   _\/\\\\\\\\\\\\\/_______\/\\\_____\/\\\_______\/\\\_     
    _\/\\\/////////_________\/\\\_____\/\\\_______\/\\\_    
     _\/\\\__________________\/\\\_____\/\\\_______\/\\\_   
      _\/\\\___________/\\\___\/\\\_____\/\\\_______/\\\__  
       _\/\\\__________\//\\\\\\\\\______\/\\\\\\\\\\\\/___
        _\///____________\/////////_______\////////////_____
-> Name:  globals.js
-> Brief: Contains all global values and descriptions used in the project
-> Date: March 2018
-> Author: Paul Duchesne (B00332119)
-> Contact: pl332718@dal.ca
*/

// SVG Width and Height
var svg;
var node_tooltip;
var width = 3500;
var height = 2750;

// D3 Force Node Link strength and distances
var link_strength = 0.6
var link_distance_metric = 75
var middle_link_distance_metric = link_distance_metric*8

// Algebra calculation values related to D3 Force Node
var algebra_angle;
var algebra_hyp;

// String arrays used for output and iterating
var abilities_str = ["Str", "Dex", "Con", "Int", "Wis", "Cha"]
var tip_words = ["Ability Scores: ", "Skills: ", "Race: ", "Misc: "]
var tip_colors = ["blue", "brown", "violet", "black"]

// Array of feat categories, used to render values
var feat_categories = [ { name: "Root",
                          render: false }, // Always false to avoid throwing things off
                        { name: "General",
                          render: true },
                        { name: "Combat",
                          render: true },
                        { name: "Mythic",
                          render: true },
                        { name: "Metamagic",
                          render: true },
                        { name: "Story",
                          render: true },
                        { name: "Monster",
                          render: true },
                        { name: "Items",
                          render: true },
                        { name: "Other",
                          render: true } ]

// Array of simplified feat categories used to render values
var render_all = [true, true, true, true, true, true, true, true, true]
var render_none = [false, false, false, false, false, false, false, false, false]

// Flags and values related to cache
var first_click_flag = false;
var display_cache = []
var first_display_flag = false;
var using_cache_flag = false;

// Number of categories, excluding root
var num_categories = feat_categories.length - 1
var modular_num_categories = feat_categories.length - 1

var central_node_cache = []

// Primary data array for project, stores the values retrieved from CSV file
var csv_data_array;

// Primary node and link arrays used to create D3 Force Nodes and Links
var nodes = []
var links = []

// D3 Selectors for Simulation and actual nodes and links 
var simulation = undefined
var svg_nodes
var svg_links

// Various Maps for chaning data forms
  // Filled outright in format_baseline()
var featString_to_featID_map = new Map();
var featID_to_stringID_map = new Map();

  // Filled as nodes are created in create_dependencies()
var nodeID_to_featID_map = new Map();
var MAIN_featID_to_NodeID_map = new Map();  // Will list the one FINAL node associated with a given feat

// D3 Menu Values

var rect_width = 600
var rect_height = 800
var rect_offset = 10

var tau = 2*Math.PI

// Arcs used to create cache button
var myArc_outer = d3.arc()
    .innerRadius(20)
    .outerRadius(35)
    .startAngle(0.5*tau)
    .endAngle(-0.25*tau);

var myArc_inner = d3.arc()
    .innerRadius(0)
    .outerRadius(20)
    .startAngle(0.5*tau)
    .endAngle(-0.25*tau);

// Data for the tringle used in the cache button
var tri_start = {x: 31, y: 60}

var triangle_data = [{"x": tri_start.x - 12, "y": tri_start.y }, {"x": tri_start.x + 12, "y": tri_start.y },
                     {"x": tri_start.x, "y": tri_start.y + 15},  {"x": tri_start.x - 10, "y": tri_start.y }]

// Not sure why I didn't just use "stroke-width" on the rect itself, but this is here now.
var border_data = [{ "x": rect_offset, "y": rect_offset }, { "x": rect_offset + rect_width, "y": rect_offset},
                    { "x": rect_width + rect_offset, "y": rect_height + rect_offset }, { "x": rect_offset, "y": rect_height + rect_offset},
                    { "x": rect_offset, "y": rect_offset - 1} ]


