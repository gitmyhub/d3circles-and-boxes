jQuery.sap.declare("OrgChart.sapui5-control-extension.controls.OrgChartControl");
jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend('sap.desidea.OrgChart', {
	metadata: {
		properties: {
			width: {type: 'int', defaultValue: 600},
			height: {type: 'int', defaultValue: 500}
		}
	},

	init : function() {
		this.root = {};
	},

	setRoot : function(root) {
		this.root = root;
	},

	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		//oRm.addClass("sap-dennisseah-orgchart");
		oRm.writeClasses();
		oRm.write('>');
		oRm.write("<div id=\"tree-container\"></div>");
		oRm.write("</div>");

	},

	onAfterRendering: function() {

		$('#createnode').click(function(){
			create_node();
		});

		$('#closecreatenode').click(function(){
			close_modal();
		});	

		$('#renamenode').click(function(){
			rename_node();
		});

		$('#closerenamenode').click(function(){
			close_modal();
		});

		$('.images').click(function(){
			var thisId = $(this).attr('id');
			if(thisId == "RenameNodeImage"){
				$("input[id='changepic']").click();
			}else{
				$("input[id='uploadpic']").click();
			}
		});

		$('#uploadpic').change(function(){
			var event = "create";
			readURL(this, event);
		});

		$('#changepic').change(function(){
			var event = "modify";
			readURL(this, event);
		});		

		function close_modal() {
			$(document).foundation('reveal', 'close');
		}

		function readURL(input, event) {
			var url = input.value;
			var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
			if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
				var reader = new FileReader();
				reader.onload = function (e) {
					if(event == "modify"){
						$('#RenameNodeImage').attr('src', e.target.result);
					}else{
						$('#image').attr('src', e.target.result);				    	
					}
				}
				reader.readAsDataURL(input.files[0]);
			}
			else{
				$('#image').attr('src', './no_preview.png');
				$('#RenameNodeImage').attr('src', './no_preview.png');

			}
		}		
		var tree_root;
		var create_node_modal_active = false;
		var rename_node_modal_active = false;
		var create_node_parent = null;
		var node_to_rename = null;

		function generateUUID(){
			/*	var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			}); */
			var uuid = Math.floor(100000000 + Math.random() * 900000000);
			return uuid;
		};

		function create_node() {
			if (create_node_parent && create_node_modal_active) {
				if (create_node_parent._children != null)  {
					create_node_parent.children = create_node_parent._children;
					create_node_parent._children = null;
				}
				if (create_node_parent.children == null) {
					create_node_parent.children = [];
				}
				id = generateUUID(); 
				name = $('#CreateNodeName').val();
				phone = $('#CreateNodePhone').val();
				title = $('#CreateNodeTitle').val();
				email = $('#CreateNodeEmail').val();
				image = $('#image').attr('src');

				new_node = { 'name': name,
						'uid' : id,
						'id' :  id,
						'phone': phone,
						'title': title,
						'email': email,
						'image': image,
						'depth': create_node_parent.depth + 1,                           
						'children': [], 
						'_children': undefined 		// Change from  '_children': null
				};
				new_node.parent = create_node_parent;
				console.log('Create Node name: ' + name);
				create_node_parent.children.push(new_node);
				create_node_modal_active = false;
				$('#CreateNodeName').val('');
				$('#CreateNodePhone').val('');
				$('#CreateNodeTitle').val('');
				$('#CreateNodeEmail').val('')
				$('#image').attr('src', './no_preview.png');
			}
			close_modal();
			outer_update(create_node_parent);
		}

		function rename_node() {
			if (node_to_rename && rename_node_modal_active) {
				name = $('#RenameNodeName').val();
				phone = $('#RenameNodePhone').val();
				title = $('#RenameNodeTitle').val();
				email = $('#RenameNodeEmail').val();
				image = $('#RenameNodeImage').attr('src');
				console.log('New Node name: ' + name);
				node_to_rename.name = name;
				node_to_rename.phone = phone;
				node_to_rename.title = title;
				node_to_rename.email = email;
				node_to_rename.image = image;
				rename_node_modal_active = false;

			}
			close_modal();
			outer_update(node_to_rename);
		}

		outer_update = null;

		// Calculate total nodes, max label length
		var totalNodes = 0;
		var maxLabelLength = 0;
		// variables for drag/drop
		var selectedNode = null;
		var draggingNode = null;
		// panning variables
		var panSpeed = 200;
		var panBoundary = 20; // Within 20px from edges will pan when dragging.		
		var width = $(document).width();
		var height = $(document).height();
		var i = 0;
		var duration = 750;

		var root = this.root;
		/*   	var margin = {top: 20, right: 120, bottom: 20, left: 120},
    	width = 960 - margin.right - margin.left,
    	height = 500 - margin.top - margin.bottom; */

		function zoom() {
			svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		}


		// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
		var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

		function initiateDrag(d, domNode) {
			draggingNode = d;
			if(d.type == "Rectangle"){
				d3.select(domNode).select('.ghostRect').attr('pointer-events', 'none');
				d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
				d3.selectAll('.ghostRect').attr('class', 'ghostRect show');
				d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
				d3.select(domNode).attr('class', 'rect activeDrag');

				svg.selectAll("g").sort(function(a, b) { // select the parent and sort the path's
					if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
					else return -1; // a is the hovered element, bring "a" to the front
				});	


			}else{
				d3.select(domNode).select('.ghostRect').attr('pointer-events', 'none');
				d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
				d3.selectAll('.ghostRect').attr('class', 'ghostRect show');
				d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
				d3.select(domNode).attr('class', 'node activeDrag');
				svg.selectAll("g").sort(function(a, b) { // select the parent and sort the path's
					if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
					else return -1; // a is the hovered element, bring "a" to the front
				});
				
			}
			// if nodes has children, remove the links and nodes
			if (nodes.length > 1) {
			
				// remove link paths
				links = tree.links(nodes);
				nodePaths = svg.selectAll("path.link")
				.data(links, function(d) {
					return d.target.id;
				}).remove();
				// remove child nodes
//				if(d.type == "Rectangle"){
					rectsExit = svg.selectAll("g.rect")
					.data(nodes, function(d) {
						return d.id;
					}).filter(function(d, i) {
						if (d.id == draggingNode.id) {
							return false;
						}
						return true;
					}).remove();
//				}else{
					nodesExit = svg.selectAll("g.node")
					.data(nodes, function(d) {
						return d.id;
					}).filter(function(d, i) {
						if (d.id == draggingNode.id) {
							return false;
						}
						return true;
					}).remove();
//				}
			}
			// remove parent link
			parentLink = tree.links(tree.nodes(draggingNode.parent));
			svg.selectAll('path.link').filter(function(d, i) {
				if (d.target.id == draggingNode.id) {
					return true;
				}
				return false;
			}).remove();

			dragStarted = null;
		}

		var baseSvg = d3.select("#tree-container").append("svg")
		.attr("width", width)
		.attr("height", height);

		baseSvg.append("rect")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("fill", "white")

		baseSvg.call(zoomListener);

		// Define the drag listeners for drag/drop behaviour of nodes.
		dragListener = d3.behavior.drag()
		.on("dragstart", function(d) {
			if (d == root) {
				return;
			}
			dragStarted = true;
			nodes = tree.nodes(d);
			d3.event.sourceEvent.stopPropagation();
			// it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
		})
		.on("drag", function(d) {
			if (d == root) {
				return;
			}
			if (dragStarted) {
				domNode = this;
				initiateDrag(d, domNode);
			}

			// get coords of mouseEvent relative to svg container to allow for panning
			relCoords = d3.mouse($('svg').get(0));
			if (relCoords[0] < panBoundary) {
				panTimer = true;
				pan(this, 'left');
			} else if (relCoords[0] > ($('svg').width() - panBoundary)) {

				panTimer = true;
				pan(this, 'right');
			} else if (relCoords[1] < panBoundary) {
				panTimer = true;
				pan(this, 'up');
			} else if (relCoords[1] > ($('svg').height() - panBoundary)) {
				panTimer = true;
				pan(this, 'down');
			} else {
				try {
					clearTimeout(panTimer);
				} catch (e) {

				}
			}

			d.x0 += d3.event.dy;
			d.y0 += d3.event.dx;
			var node = d3.select(this);
			node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
			updateTempConnector();
		}).on("dragend", function(d) {
			if (d == root) {
				return;
			}
			domNode = this;
			if (selectedNode) {
				// now remove the element from the parent, and insert it into the new elements children
				var index = draggingNode.parent.children.indexOf(draggingNode);
				if (index > -1) {
					draggingNode.parent.children.splice(index, 1);
				}
				/* code added */
				if(selectedNode._children == null){
					selectedNode._children = undefined;
				}
				if(selectedNode.children == null){
					selectedNode.children = undefined;
				}
				/* Code Ends*/
				if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
					if (typeof selectedNode.children !== 'undefined') {
						selectedNode.children.push(draggingNode);
					} else {
						selectedNode._children.push(draggingNode);
					}
				} else {
					selectedNode.children = [];
					selectedNode.children.push(draggingNode);
				}
				// Make sure that the node being added to is expanded so user can see added node is correctly moved
				expand(selectedNode);
				sortTree();
				endDrag();
			} else {
				endDrag();
			}
		});

		function endDrag() {
//			debugger;
			selectedNode = null;
			if(draggingNode != null && draggingNode.type == "Rectangle"){
				d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
				d3.selectAll('.ghostRect').attr('class', 'ghostRect');
				d3.select(domNode).attr('class', 'rect');
				d3.select(domNode).select('.ghostRect').attr('pointer-events', '');

			}else if(draggingNode != null){
				d3.selectAll('.ghostRect').attr('class', 'ghostRect');
				d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
				d3.select(domNode).attr('class', 'node');
				d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');

			}

			// now restore the mouseover event or we won't be able to drag a 2nd time
			updateTempConnector();
			if (draggingNode !== null) {
				update(root);
				centerNode(draggingNode);
				draggingNode = null;
			}
		}

		var overCircle = function(d) {
			selectedNode = d;
			updateTempConnector();
		};
		var outCircle = function(d) {
			selectedNode = null;
			updateTempConnector();
		};

		// Function to update the temporary connector indicating dragging affiliation
		var updateTempConnector = function() {
			var data = [];
			if (draggingNode !== null && selectedNode !== null) {
				// have to flip the source coordinates since we did this for the existing connectors on the original tree
				data = [{
					source: {
						x: selectedNode.y0,
						y: selectedNode.x0
					},
					target: {
						x: draggingNode.y0,
						y: draggingNode.x0
					}
				}];
			}
			var link = svg.selectAll(".templink").data(data);

			link.enter().append("path")
			.attr("class", "templink")
			.attr("d", d3.svg.diagonal())
			.attr('pointer-events', 'none');

			link.attr("d", d3.svg.diagonal());

			link.exit().remove();
		};

		outer_update = update;

		var svg = baseSvg.append("g");

		// Define the root
		root.x0 = height / 2;
		root.y0 = 0; 

		var tree = d3.layout.tree()
		.size([height, width]);

		var diagonal = d3.svg.diagonal()
		.projection(function(d) { return [d.y, d.x]; });

		var menu = [
		            {
		            	title: 'Edit node',
		            	action: function(elm, d, i) {
		            		console.log('Edit node');
		            		$("#RenameNodeName").val(d.name);
		            		$('#RenameNodePhone').val(d.phone);
		            		$('#RenameNodeTitle').val(d.title);
		            		$('#RenameNodeEmail').val(d.email);
		            		$('#RenameNodeImage').attr('src', d.image);
		            		rename_node_modal_active = true;
		            		node_to_rename = d
		            		$("#RenameNodeName").focus();
		            		$('#RenameNodeModal').foundation('reveal', 'open');
		            	}
		            },
		            {
		            	title: 'Delete node',
		            	action: function(elm, d, i) {
		            		console.log('Delete node');
		            		delete_node(d);
		            	}
		            },
		            {
		            	title: 'Create child node',
		            	action: function(elm, d, i) {
		            		console.log('Create child node');
		            		create_node_parent = d;
		            		create_node_modal_active = true;
		            		$('#CreateNodeModal').foundation('reveal', 'open');
		            		$('#CreateNodeName').focus();
		            	}
		            }
		            ]

		// A recursive helper function for performing some setup by walking through all nodes

		function visit(parent, visitFn, childrenFn) {
			if (!parent) return;

			visitFn(parent);

			var children = childrenFn(parent);
			if (children) {
				var count = children.length;
				for (var i = 0; i < count; i++) {
					visit(children[i], visitFn, childrenFn);
				}
			}
		}

		// Call visit function to establish maxLabelLength
		visit(this.root, function(d) {
			totalNodes++;
			maxLabelLength = Math.max(d.name.length, maxLabelLength);

		}, function(d) {
			return d.children && d.children.length > 0 ? d.children : null;
		});

		function delete_node(d) {

			if (d.parent && d.parent.children){
				console.log('removing ' + d.name);
				var nodeToDelete = _.where(d.parent.children, {name: d.name});
				if (nodeToDelete){
					d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
				}
			}
			update(root);
		}

		// Sort the tree initially incase the JSON isn't in a sorted order.
		sortTree();

		function pan(domNode, direction) {
			var speed = panSpeed;
			if (panTimer) {
				clearTimeout(panTimer);
				translateCoords = d3.transform(svg.attr("transform"));
				if (direction == 'left' || direction == 'right') {
					translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
					translateY = translateCoords.translate[1];
				} else if (direction == 'up' || direction == 'down') {
					translateX = translateCoords.translate[0];
					translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
				}
				scaleX = translateCoords.scale[0];
				scaleY = translateCoords.scale[1];
				scale = zoomListener.scale();
				svg.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
				d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
				zoomListener.scale(zoomListener.scale());
				zoomListener.translate([translateX, translateY]);
				panTimer = setTimeout(function() {
					pan(domNode, speed, direction);
				}, 50);
			}
		}

		//root = treeData[0];
		root.children.forEach(collapse);  
		update(root);
		centerNode(root);
		tree_root = root;

		//svg.selectAll(".node").on("click", function(d) { nodeClick(d) });
		// sort the tree according to the node names

		function sortTree() {
			tree.sort(function(a, b) {
				return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
			});
		}

		function update(source) {
//			debugger;
			// Compute the new tree layout.			
			var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

			// Normalize for fixed-depth.
			nodes.forEach(function(d) { d.y = d.depth * 300; });

			// Declare the nodesâ€¦
			var node = svg.selectAll("g.node")
			.data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});

			var rect = svg.selectAll("g.rect")
			.data(nodes, function(d) {
				return d.id || (d.id = ++i);
			});



			// Enter the nodes.
			/*			var nodeEnter = node.enter().append("g")
			.call(dragListener)
			.attr("class", function(d){
				var classtype;
				if(d.type == "Rectangle"){
					classtype = "rect";
				}else{
					classtype = "node";
				}
				return classtype;
				})
			.attr("transform", function(d) { 
				return "translate(" + source.y0 + "," + source.x0 + ")"; })
				.on('click', click); */
			var nodeEnter = node.enter().append("g")
			.filter(function(d) {
				return d.type != "Rectangle";
			}) 
			.call(dragListener)
			.attr("class", "node")
			.attr("transform", function(d) { 
				return "translate(" + source.y0 + "," + source.x0 + ")"; })
				.on('click', click);

			nodeEnter
			.append('defs')
			.append('pattern')
			.attr('id', function(d,i){
				return 'pic_' + d.uid;
			})
			.attr('height','100%')
			.attr('width','100%')
			.attr('x','0%')
			.attr('y','0%')
			.attr('viewBox', '0 0 90 90')
			.append('image')
			.attr('xlink:href',function(d,i){
				if(d.image == undefined){
					d.image = "./no_preview.png";
					return d.image;
				}else{
					return d.image;
				}
			})
			.attr('height','90')
			.attr('width','90')
			.attr('x','0%')
			.attr('y','0%'); 

			var rectEnter = rect.enter().append("g")
			.filter(function(d) {
				return d.type == "Rectangle";
			})
			.call(dragListener)
			.attr("class", "rect")
			.attr("transform", function(d) { 
				var modX = source.x0 - 25;
				return "translate(" + source.y0 + "," + modX + ")"; })
				.on('click', click); 

			rectEnter
			.append('defs')
			.append('pattern')
			.attr('id', function(d,i){
				return 'pic_' + d.uid;
			})
			.attr('height','100%')
			.attr('width','100%')
			.attr('x','0%')
			.attr('y','0%')
			.attr('viewBox', '0 0 90 90')
			.append('image')
			.attr('xlink:href',function(d,i){
				if(d.image == undefined){
					d.image = "./no_preview.png";
					return d.image;
				}else{
					return d.image;
				}
			})
			.attr('height','90')
			.attr('width','90')
			.attr('x','0%')
			.attr('y','0%'); 
			/********Modified Code For rects**************/
			nodeEnter.append("circle")
			.attr("r", 30)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

			rectEnter.append("rect")
			.attr("width", 50)
			.attr("height", 50)
			.attr("stroke", "black")
			.attr("stroke-width", 1);	 	

			/*		   	 svg.selectAll(".node").append("circle")
			.attr("r", 30)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; }); 

		     svg.selectAll(".rect").append("rect")
			.attr("width", 200)
			.attr("height", 100)
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });   */
			/********Modified Code Ends**************/


			/*			var g = nodeEnter.append("g");	  

			g.append("text")
			.attr("x", function(d) { 
				return d.children || d._children ? -33 : 33; })     // -13
				// return 33; })     // -13
				.attr("dy", "-1.0em")
				.attr("text-anchor", function(d) { 
					return d.children || d._children ? "end" : "start"; })
					//return "start"; })
					.text(function(d) { return d.name; })
					.style("fill-opacity", 1)
					.on('click', nameClick)
					.attr('id',"name");

			g.append("text")
			.attr("x", function(d) { 
				return d.children || d._children ? -33 : 33; })
				.attr("dy", "0.0em")
				.attr("text-anchor", function(d) { 
					return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.phone; })
					.style("fill-opacity", 1)
					.attr('id',"phone");

			g.append("text")
			.attr("x", function(d) { 
				return d.children || d._children ? -33 : 33; })
				.attr("dy", "1.0em")
				.attr("text-anchor", function(d) { 
					return d.children || d._children ? "end" : "start"; })
					.text(function(d) { return d.email; })
					.style("fill-opacity", 1)
					.attr('id',"email"); */

			// phantom node to give us mouseover in a radius around it
			nodeEnter.append("circle")
			.attr('class', 'ghostCircle')
			.attr("r", 50)
			.attr("opacity", 0.2) // change this to zero to hide the target area
			.style("fill", "red")
			.attr('pointer-events', 'mouseover')
			.on("mouseover", function(node) {
				overCircle(node);
			})
			.on("mouseout", function(node) {
				outCircle(node);
			});

			rectEnter.append("rect")
			.attr('class', 'ghostRect')
			.attr("width", 50)
			.attr("height", 50)			
			.attr("opacity", 0.2) // change this to zero to hide the target area
			.style("fill", "red")
			.attr('pointer-events', 'mouseover')
			.on("mouseover", function(rect) {
				overCircle(rect);
			})
			.on("mouseout", function(rect) {
				outCircle(rect);
			});
			/*
			// Update the text to reflect whether node has children or not.
			node.select('#name')
			.attr("x", function(d) {
				return d.children || d._children ? -33 : 33;
			})
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
				return d.name;
			});

			node.select('#phone')
			.attr("x", function(d) {
				return d.children || d._children ? -33 : 33;
			})
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
				return d.phone;
			});

			node.select('#email')
			.attr("x", function(d) {
				return d.children || d._children ? -33 : 33;
			})
			.attr("text-anchor", function(d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function(d) {
				return d.email;
			}); */






			// Add a context menu
			node.on('contextmenu', d3.contextMenu(menu)); 
			rect.on('contextmenu', d3.contextMenu(menu)); 


			/* Code to transition collapsed nodes to their parents position */
			// Transition nodes to their new position.
			var nodeUpdate = node.transition()
			.filter(function(d) {
				return d.type != "Rectangle";
			}) 
			.duration(duration)
			.attr("transform", function(d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

			var rectUpdate = rect.transition()
			.filter(function(d) {
				return d.type == "Rectangle";
			}) 			
			.duration(duration)
			.attr("transform", function(d) {
				var modX = d.x - 25;
				return "translate(" + d.y + "," + modX + ")";
			});

			nodeUpdate.select("circle")
			.attr("r", 30)					  
			.style("fill", function(d,i){
				var url = ("url(#pic_".concat(d.uid)).concat(")");
				return url;
			});

			rectUpdate.select("rect")
			.attr("width", 50)
			.attr("height", 50)					  
			.style("fill", function(d,i){
				var url = ("url(#pic_".concat(d.uid)).concat(")");
				return url;
			});

			// Fade the text in
			nodeUpdate.select("text")
			.style("fill-opacity", 1);

			rectUpdate.select("text")
			.style("fill-opacity", 1);

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
			.filter(function(d) {
				return d.type != "Rectangle";
			})
			.duration(duration)
			.attr("transform", function(d) {
				return "translate(" + source.y + "," + source.x + ")";
			})
			.remove();

			var rectExit = rect.exit().transition()
			.filter(function(d) {
				return d.type == "Rectangle";
			})			
			.duration(duration)
			.attr("transform", function(d) {
				var modX = source.x - 25;
				return "translate(" + source.y + "," + modX + ")";
			})
			.remove();

			nodeExit.select("circle")
			.attr("r", 0);

			rectExit.select("rect")
			.attr("width", 0)
			.attr("height", 0);

			nodeExit.select("text")
			.style("fill-opacity", 0); 

			rectExit.select("text")
			.style("fill-opacity", 0); 
			/* Code to transition collapsed nodes to their parents position Ends*/

			// Declare the linksâ€¦
			var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

			// Enter the links.
			link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {
						x: source.x0,
						y: source.y0
				};
				return diagonal({
					source: o,
					target: o
				});
			});

			/* Code to transition collapsed Links */
			// Transition links to their new position.
			link.transition()
			.duration(duration)
			.attr("d", diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = {
						x: source.x,
						y: source.y
				};
				return diagonal({
					source: o,
					target: o
				});
			})
			.remove();
			/* Code to transition collapsed Links Ends */

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});

		}

		// Helper functions for collapsing and expanding nodes.
		function collapse(d) {
			if (d.children) {
				d._children = d.children;
				d._children.forEach(collapse);
				d.children = null;
			}
		}

		function expand(d) {
			if (d._children) {
				d.children = d._children;
				d.children.forEach(expand);
				d._children = null;
			}
		}

		function centerNode(source) {
			scale = zoomListener.scale();
			x = -source.y0;
			y = -source.x0;			
			x = x * scale + width / 2;
			y = y * scale + height / 2;
			d3.select('g').transition()
			.duration(duration)
			.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
			zoomListener.scale(scale);
			zoomListener.translate([x, y]);
		}

		// Toggle children function
		function toggleChildren(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else if (d._children) {
				d.children = d._children;
				d._children = null;
			}
			return d;
		}

		// Toggle children on click.

		function click(d) {
			debugger;
			if (d3.event.defaultPrevented) return; // click suppressed
			d = toggleChildren(d);
			update(d);
			centerNode(d);
		}

		function nameClick(d) {
			var win = window.open(d.url, '_blank');
			win.focus();

			// Stop events or else it gets de-selected
			event.stopPropagation();
		}

	},

});