CSCI 4166: Visualization Assignment 1 README

General Notes:
    * I rarely use HTML/CSS, the practices done here work but are obviously not best practice
    * Both files named A are simply short for Assignment (A.html & A.css
    * The javascript files are numbered in their order of appearance from top to bottom

----------------------------------------------------------------------------------------------

Visualization Guide:

--> First Graph: (first_graph.js)
    > Trigger: Hover cursor over any vertical bar
    > Effect:  Bar will enlarge, change color, and a text box will show the value

--> Sideways Graph: (sideways.js)
    > Trigger: Click and hold mouse over any bar segment for up to 2 seconds
    > Effect:  The color will change for the legend and relevent segments of that type
	> Note 1: This color is chosen randomly within a central RGB range
	> Note 2: The legend box will slowly fill to indicate how far into the transition it is
	> Note 3: If the mouse is released prematurely, the color will stay at its current color 

--> Arc Displays: (semi_circles.js)
    > Trigger: Click any arc segment
    > Effect:  That arc will transition to 0 width, the text will move, and then the arc will recreate itself on the opposite side
	> Note 1: This is reversible by clicking the same arc again

--> Second Graph: (second_graph.js)
    > Trigger #1: Hover cursor over any vertical bar
    > Effect  #1: Bar will enlarge, change color, and a text box will show the value

    > Trigger #2: Click "Snoot" (Doodle jump image)
    > Effect  #2: A "Snoot Storm" will occur that permanently changes the background of the visualization

--> Dual Pie Charts (pie_2.js)
    > Trigger #1: Hover over any pie segment
    > Effect  #1: The segment and its text will enlarge 

    > Trigger #2: Hover over any legend color box or accompanying text
    > Effect  #2: The two corresponding segments and their text will enlarge

--> Single Pie Chart (pie_1.js)
    > Trigger #1: Click any segment on the pie chart
    > Effect  #2: The segments and text will transition to 0 and then recreate itself

    > Trigger #2: Hover over any legend color box or accompanying text
    > Effect  #2: The corresponding segment and its text will enlarge

