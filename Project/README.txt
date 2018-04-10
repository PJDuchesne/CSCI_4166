README.txt

> Note: To run this visualization, a simple http server must be run to serve the CSV data file

>> LAUNCH GUIDE <<

1) cd <your_directories>/Project/		// Go to project folder
2) python -m SimpleHTTPServer 8000		// Start Python server
3) http://localhost:8000/ 				// Go to server on any browser
4) Enter "Project.html"                 // Launch Project

>> VISUALIZATION USER INTERFACE GUIDE <<

Overview: This visualization displays nodes and links between pathfinder's
	many, many feats. In the center of the initial visualization, there is
	a ring of multicolored circles. Each of these represents a type of feat
	and corresponds to the 


Legend: (In decreasing order of size)
	>> Largest Central (Black) Circle: This is the root, click it to display ALL nodes
		>> WARNING: This is ~3000 individual feats and all their prerequisites. This
		>>			is difficult even for a decent computer to handle

	>> Larger Central (Colored) Circles: These each indicate a different type of feat.
	>>		Click on any one of them to show only feats of that type. 

	>> Medium Floating Circles: Each of these represents a node that has been renderd.
	>>		Each will either be linked directly to a feat category circle, or to prerequisites
	>>		nodes. Click on any of these to display on that node's dependencies

	>> Small Floating Circles (Prerequisite Nodes): Each of these represents a dependency for a
	>>		medium node. These can also be clicked to display only that node's dependency

Menu:
	>> Clear Button: Clears input fields
	>> Search Button: Searchs according to the entered search options. Part of this result is shown below the search value

	>> Search Options:
		>> Feat: Enter a string to search within the feats for any containing that string (Not case sensitive)
		>> Race: Enter a string, or list of strings to see what feats are available to that race
			>> NOTE: This includes any feats that have no racial prerequisites (Which is ~80% of feats)
		>> ID Range: Enter an int in either or both fields to filter within a range. These are the ID
					 values assigned to the dataset when it was read it.
		>> Feat Types: Tick any number of these boxes to filter by those feat types. If none are ticked, the type is
						not considered at all in the search.
            >> NOTE: The feat category words themselves can also be used to toggle the corresponding textbox

	>> Filter Button: Performs a search and render using the entered search options. This will update the nodes and links
					  in the simulation to show the newly found data. If no feats are found, the display will not update.

	>> Cache Button (Circular Arrow in Upper Left): Displays the previously shown list of feats, with a maximum depth of 8 stored datasets

