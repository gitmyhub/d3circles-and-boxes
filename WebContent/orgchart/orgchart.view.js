sap.ui.localResources('sapui5-control-extension');
jQuery.sap.require("sapui5-control-extension.controls.OrgChartControl");
sap.ui.jsview("orgchart.orgchart", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf orgchart.orgchart
	 */ 
	getControllerName : function() {
		return "orgchart.orgchart";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf orgchart.orgchart
	 */ 
	createContent : function(oController) {
		var org_chart = new sap.desidea.OrgChart();
		org_chart.setRoot({
			"uid": "1",
			"name": "Rachel Rogers",
			"phone": "9086428413",
			"image": "http://lorempixel.com/1920/1920/",
			"title": "President",
			"email": "ajayreddy_2211@yahoo.com",
			"url":  "https://www.google.com",
			"parent": "null",
			"children": [
			             {
			     			 "uid": "11",
			            	 "name": "Bob Smith",
			            	 "phone": "9086428413",
			            	 "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	 "title": "Vice President",
			            	 "type": "Rectangle",
			            	 "email": "ajayreddy_2212@yahoo.com",
			            	 "url":  "https://www.google.com",
			            	 "parent": "1",
			            	 "children": [
			            	              {
			      			     			  "uid": "21",
			            	            	  "name": "Mary Jane",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "CEO",
			     			            	  "type": "Rectangle",
			            	            	  "email": "ajayreddy_2227@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "11",
			            	            	  "children": [
			            	            	               {
			      			      			     			   "uid": "31",
			            	            	            	   "name": "Nathan Ringwald",
			            	            	            	   "phone": "9086428413",
			            	            	            	   "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	            	   "title": "COO",
			            	            	            	   "email": "ajayreddy_2230@yahoo.com",
			            	            	            	   "url":  "https://www.google.com",
			            	            	            	   "parent": "21"
			            	            	               },
			            	            	               {
			      			      			     			   "uid": "32",
			            	            	            	   "name": "Bill August",
			            	            	            	   "phone": "9086428413",
			            	            	            	   "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	            	   "title": "CFO",
			            	            	            	   "email": "ajayreddy_2231@yahoo.com",
			            	            	            	   "url":  "https://www.google.com",
			            	            	            	   "parent": "21"
			            	            	               }
			            	            	               ]
			            	              },
			            	              {
			      			     			  "uid": "22",
			            	            	  "name": "Sam Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2220@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },
			            	              {
			      			     			  "uid": "23",
			            	            	  "name": "Nathan Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2221@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },
			            	              {
			      			     			  "uid": "24",
			            	            	  "name": "West Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2222@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },
			            	              {
			      			     			  "uid": "25",
			            	            	  "name": "North Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2223@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },
			            	              {
			      			     			  "uid": "26",
			            	            	  "name": "South Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
				     			              "type": "Rectangle",
			            	            	  "email": "ajayreddy_2224@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level",
			            	            	  "children": [
				            	            	               {
				      			      			     			   "uid": "33",
				            	            	            	   "name": "Nathan Ringwald",
				            	            	            	   "phone": "9086428413",
				            	            	            	   "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
				            	            	            	   "title": "COO",
				            	            	            	   "email": "ajayreddy_2230@yahoo.com",
				            	            	            	   "url":  "https://www.google.com",
				            	            	            	   "parent": "26"
				            	            	               },
				            	            	               {
				      			      			     			   "uid": "34",
				            	            	            	   "name": "Bill August",
				            	            	            	   "phone": "9086428413",
				            	            	            	   "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
				            	            	            	   "title": "CFO",
				            	            	            	   "email": "ajayreddy_2231@yahoo.com",
				            	            	            	   "url":  "https://www.google.com",
				            	            	            	   "parent": "26"
				            	            	               }
				            	            	               ]	  
			            	              },
			            	              {
			      			     			  "uid": "27",
			            	            	  "name": "Sam Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2225@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },
			            	              {
			      			     			  "uid": "28",
			            	            	  "name": "East Duke",
			            	            	  "phone": "9086428413",
			            	            	  "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
			            	            	  "title": "Developer",
			            	            	  "email": "ajayreddy_2226@yahoo.com",
			            	            	  "url":  "https://www.google.com",
			            	            	  "parent": "Top Level"
			            	              },

			            	              ]
			             }
			             ]
		});
		this.addContent(org_chart);

	}

});
