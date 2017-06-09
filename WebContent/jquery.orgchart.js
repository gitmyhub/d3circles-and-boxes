(function($) {
	$.fn.orgChart = function(options) {
		var opts = $.extend({}, $.fn.orgChart.defaults, options);
		return new OrgChart($(this), opts);        
	}

	$.fn.orgChart.defaults = {
			data: [{id:1, title:'Root', name:'Root', phone:'000 000 0000', email:'Root@Root.com', image:'' ,parent: 0}],
			showControls: false,
			allowEdit: false,
			onAddNode: null,
			dragAndDrop: true,
			onDeleteNode: null,
			onClickNode: null,
			newNodeText: 'Add Child'
	};
	
	OrgChart.NODEHEIGHT = 110;
	OrgChart.NODEWIDTH = 265;
	OrgChart.NODEPADDING = 5;
	OrgChart.YGAPBETWEENNODES = 110;
	OrgChart.TREELINEWIDTH = 110;
	
	function OrgChart($container, opts){
		var data = opts.data;
		var nodes = {};
		var rootNodes = [];
		this.opts = opts;
		this.$container = $container;
		var self = this;

		this.draw = function(){
			debugger;
		//	$container.empty().append(rootNodes[0].createSVGDom(opts, "myTable")); 			
			//$container.empty().append(rootNodes[0].renderSVG(opts, "myTable")); 			
			$container.empty().append(rootNodes[0].render(opts, "myTable")); 
			$container.find('.node').click(function(){
				if(self.opts.onClickNode !== null){
					self.opts.onClickNode(nodes[$(this).attr('node-id')]);
				}
			});

			if(opts.allowEdit){
				$container.find('.node h2').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "title");
					e.stopPropagation();
				});

				$container.find('.name').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "name");
					e.stopPropagation();
				});

				$container.find('.noname').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "name");
					e.stopPropagation();
				});

				$container.find('.phone').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "phone");
					e.stopPropagation();
				});

				$container.find('.nophone').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "phone");
					e.stopPropagation();
				});

				$container.find('.email').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "email");
					e.stopPropagation();
				});

				$container.find('.noemail').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().parent().parent().attr('node-id');
					self.startEdit(thisId, "email");
					e.stopPropagation();
				});

				$container.find('.images').click(function(e){

					//var thisId = $(this).parent().attr('node-id');
					var thisId = $(this).parent().parent().attr('node-id');
					self.startEdit(thisId, "image");
					e.stopPropagation();
				});

				$(function(){
					$('input').change(function(e){

						var url = $(this).val();
						var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
						if (e.target.files && e.target.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
						{
							var reader = new FileReader();
							var nodeid = e.target.id;

							reader.onload = function (e) {

								$("img[node-id='"+nodeid+"']").attr('src', e.target.result);
							}
							reader.readAsDataURL(e.target.files[0]);
						}
						else
						{
							$('#img').attr('src', '/no_preview.png');
						}
					});
				});

			}

			// add "add button" listener
			$container.find('.org-add-button').click(function(e){

				var thisId = $(this).parent().attr('node-id');

				if(self.opts.onAddNode !== null){
					self.opts.onAddNode(nodes[thisId]);
				}
				else{
					self.newNode(thisId);
				}
				e.stopPropagation();
			});

			$container.find('.org-del-button').click(function(e){
				var thisId = $(this).parent().attr('node-id');

				if(self.opts.onDeleteNode !== null){
					self.opts.onDeleteNode(nodes[thisId]);
				}
				else{
					self.deleteNode(thisId);
				}
				e.stopPropagation();
			});

			if(opts.dragAndDrop){
				debugger;
				//	$(this).draggable();
				$('div.node').draggable({
					cursor      : 'move',
					distance    : 40,
					helper      : 'clone',
					opacity     : 0.8,
					revert      : 'invalid',
					revertDuration : 100,
					snap        : 'div.node.expanded',//'div.node.expanded',
					snapMode    : 'inner',
					stack       : 'div.node',
					//  disabled    : false
				});

				$('div.node').droppable({
					accept      : 'div.node',          
					activeClass : 'drag-active',
					hoverClass  : 'drop-hover',
					//disabled	: false
				});

				$('div.node').bind("dragstart", function handleDragStart( event, ui ){
					//debugger;
					var sourceNode = $(this);
					sourceNode.parentsUntil('.orgChart')
					.find('*')
					.filter('.node');
					//  .droppable('enable');

					debugger;
					var nodeId = this.attributes["node-id"].value;
					if(nodes[nodeId].children != ''){		
						for(i in nodes[nodeId].children){
							self.disableDroppable(nodes[nodeId].children[i].data.id);
						}

					}

				});


				$('div.node').bind("dragstop", function handleDragStop( event, ui ){

					/* reload the plugin */
					$container.children().remove();
					self.draw();
				});

				$('div.node').bind("drop", function handleDropEvent( event, ui ) {    
					//	var sourceNodeValue = event.srcElement.attributes["node-id"].value;   not working in Jquery UI 1.11.1
					var sourceNodeValue = $(ui.draggable).attr("node-id");
					var targetNodeValue = this.attributes["node-id"].value;
					var nodeId = parseInt(sourceNodeValue);
					var newParentId = parseInt(targetNodeValue);
					/*		if( ( nodes[nodeId].data.parent == parseInt(targetNodeValue) ) || nodes[newParentId].data.parent == nodeId){
						self.swap(nodeId, newParentId);
						self.draw();
						return;
					} */
					debugger;
					for ( var i = 1; i <= Object.keys(nodes).length; i++ ) {  
						if(nodes[i].data.id == nodeId) {
							var CurrentParent = nodes[i].data.parent;
							if(nodes[CurrentParent].children != ''){

								nodes[newParentId].addChild(nodes[nodeId]);
								nodes[CurrentParent].removeChild(nodeId);

							}

							nodes[i].data.parent = newParentId;
						}
					}
					for ( var i = 0; i < opts.data.length; i++ ) {  
						if(opts.data[i].id == nodeId) {
							opts.data[i].parent = data[i].parent = newParentId;
						}
					}
					self.draw();

				}); // handleDropEvent
			}
		}
		
		this.disableDroppable = function(nodeId){
			if(nodes[nodeId].children != ''){		
				for(i in nodes[nodeId].children){
					this.disableDroppable(nodes[nodeId].children[i].data.id);
				}
				$("div[node-id='"+nodeId+"']").droppable({
					disabled: true,
				});
				$("div[node-id='"+nodeId+"']").addClass("drop-disabled");
			}else {
				$("div[node-id='"+nodeId+"']").droppable({
					disabled: true,
				});
				$("div[node-id='"+nodeId+"']").addClass("drop-disabled");
				return;
			}
		}

		this.swap = function(sourceNodeId, targetNodeId){
			debugger;
			var temp = nodes[sourceNodeId].data.parent;
			//	var tempchildren = nodes[sourceNodeId].children;
			//	nodes[sourceNodeId].children = nodes[targetNodeId].children;
			//	nodes[targetNodeId].children = tempchildren;

			if(sourceNodeId == nodes[targetNodeId].data.parent){
				nodes[sourceNodeId].data.parent = targetNodeId;
				//	nodes[targetNodeId].removeChild(targetNodeId);
				//	nodes[targetNodeId].addChild(nodes[sourceNodeId]);
			}else if(targetNodeId == nodes[sourceNodeId].data.parent){
				nodes[sourceNodeId].data.parent = opts.data[sourceNodeId].parent = data[sourceNodeId].parent = nodes[targetNodeId].data.parent;
				//	nodes[sourceNodeId].removeChild(sourceNodeId);
				//	nodes[sourceNodeId].addChild(nodes[targetNodeId]);	
			}
			nodes[targetNodeId].data.parent = opts.data[targetNodeId].parent = data[targetNodeId].parent = temp;

		}

		this.startEdit = function(id,type){

			var inputElement = '';
			var nodeid = id+" "+type ;

			if (type == "title"){
				inputElement = $('<input class="org-input-title" placeholder="'+nodes[id].data.title+'" type="text" value=""/>');
				$container.find("div[node-id='"+nodeid+"'] h2").replaceWith(inputElement);

			}else if(type == "name"){
				inputElement = $('<input class="org-input-name" placeholder="'+nodes[id].data.name+'" type="text" value=""/>'); //'+nodes[id].data.name+'
				$container.find("span[node-id='"+nodeid+"']").replaceWith(inputElement);

			}else if(type == "phone"){
				inputElement = $('<input class="org-input-phone" placeholder="'+nodes[id].data.phone+'" type="number" value=""/>'); //'+nodes[id].data.name+'
				$container.find("span[node-id='"+nodeid+"']").replaceWith(inputElement);

			}else if(type == "email"){
				inputElement = $('<input class="org-input-email" placeholder="'+nodes[id].data.email+'" type="email" value=""/>'); //'+nodes[id].data.name+'
				$container.find("span[node-id='"+nodeid+"']").replaceWith(inputElement);	

			}else if(type == "image"){

				$("input[id='"+nodeid+"']").click();				
			}


			// $container.find('div[node-id='+id+'] h2').replaceWith(inputElement);
			var commitChange = function(){

				if(type == "title"){
					var h2Element = $('<h2>'+nodes[id].data.title+'</h2>');
				}else if(type == "name"){
					//var h2Element = $("<span class='name' node-id='"+nodeid+"'>"+nodes[id].data.name+"</span>");
					if(nodes[id].data.name == "Enter Name"){
						//$(".name").css("color","#C0C0C0");
						var h2Element = $("<span class='noname' node-id='"+nodeid+"'>"+nodes[id].data.name+"</span>");
					}else{
						//$(".name").css("color","#000000");
						var h2Element = $("<span class='name' node-id='"+nodeid+"'>"+nodes[id].data.name+"</span>");
					}

				}else if(type == "phone"){
					//var h2Element = $("<span class='name' node-id='"+nodeid+"'>"+nodes[id].data.name+"</span>");
					if(nodes[id].data.phone == "Enter Phone"){
						//$(".name").css("color","#C0C0C0");
						var h2Element = $("<span class='nophone' node-id='"+nodeid+"'>"+nodes[id].data.phone+"</span>");
					}else{
						//$(".name").css("color","#000000");
						var h2Element = $("<span class='phone' node-id='"+nodeid+"'>"+nodes[id].data.phone+"</span>");
					}

				}else if(type == "email"){
					//var h2Element = $("<span class='name' node-id='"+nodeid+"'>"+nodes[id].data.name+"</span>");
					if(nodes[id].data.email == "Enter Email"){
						//$(".name").css("color","#C0C0C0");
						var h2Element = $("<span class='noemail' node-id='"+nodeid+"'>"+nodes[id].data.email+"</span>");
					}else{
						//$(".name").css("color","#000000");
						var h2Element = $("<span class='email' node-id='"+nodeid+"'>"+nodes[id].data.email+"</span>");
					}

				}
				if(opts.allowEdit){
					h2Element.click(function(){
						self.startEdit(id,type);
					})
				}
				inputElement.replaceWith(h2Element);
			}  
			if(inputElement != ''){
				inputElement.focus();

				inputElement.keyup(function(event){

					if(event.which == 13){
						commitChange();
					}
					else{
						if(type == "title"){
							nodes[id].data.title = inputElement.val();
						}else if(type == "name"){
							nodes[id].data.name = inputElement.val();
						}else if(type == "phone"){
							nodes[id].data.phone = inputElement.val();
						}else if(type == "email"){
							nodes[id].data.email = inputElement.val();
						}
						if(nodes[id].data.name == ''){
							nodes[id].data.name = "Enter Name";
						}
						if(nodes[id].data.phone == ''){
							nodes[id].data.name = "Enter Phone";
						}else if(nodes[id].data.phone.length == 10){
							var phone = nodes[id].data.phone;
							nodes[id].data.phone = phone.substring(0,3)+" "+phone.substring(3,6)+" "+phone.substring(6,10);
						}
						if(nodes[id].data.email == ''){
							nodes[id].data.email = "Enter Email";
						}

					}
				});
				inputElement.blur(function(event){
					commitChange();
				})
			}
		}


		this.newNode = function(parentId){
			var nextId = Object.keys(nodes).length;
			while(nextId in nodes){
				nextId++;
			}

			self.addNode({id: nextId, title: '', name: '', phone: '', email: '', image: '', parent: parentId});
		}

		this.addNode = function(data){
			var newNode = new Node(data);
			nodes[data.id] = newNode;
			nodes[data.parent].addChild(newNode);
			$container.children().remove();
			self.draw();

			self.startEdit(data.id);
		}

		this.deleteNode = function(id){

			console.log("Delete Node Called");
			for(var i=0;i<nodes[id].children.length;i++){
				self.deleteNode(nodes[id].children[i].data.id);
			}
			nodes[nodes[id].data.parent].removeChild(id);
			delete nodes[id];
			self.draw();
		}

		this.getData = function(){
			var outData = [];
			for(var i in nodes){
				outData.push(nodes[i].data);
			}
			return outData;
		}

		// constructor
		for(var i in data){
			var node = new Node(data[i]);
			nodes[data[i].id] = node;
		}

		// generate parent child tree
		for(var i in nodes){
			if(nodes[i].data.parent == 0){
				rootNodes.push(nodes[i]);
			}
			else{
				nodes[nodes[i].data.parent].addChild(nodes[i]);
			}
		}

		// draw org chart
		$container.addClass('orgChart');
		self.draw();

	}

	function Node(data){
		this.data = data;
		this.children = [];
		var self = this;
		this.x1pos = 0;
		this.y1pos = 0;
		this.x2pos = 0;
		this.y2pos = 0;
		//var count = 0;

		this.addChild = function(childNode){
			this.children.push(childNode);
		}


		this.removeChild = function(id){
			for(var i=0;i<self.children.length;i++){
				if(self.children[i].data.id == id){
					self.children.splice(i,1);
					return;
				}
			}
		}
		
		this.createSVGDom = function(opts, tableId, height, width){
			var childLength = self.children.length, mainTable;
			         height = ( OrgChart.NODEHEIGHT * childLength ) + ( (childLength + 1) * OrgChart.YGAPBETWEENNODES);
			         width = OrgChart.NODEWIDTH + OrgChart.TREELINEWIDTH;
			if (height == null || height < 500) height = 500;
			if (width == null || width < 500) width = 500;
			
				mainTable = "<svg height='"+height+"' width='"+width+"' id='testsvg' style='background-color: white;'>";
				mainTable += this.renderSVG(opts, tableId, height);
				mainTable += '</svg>';
				return mainTable;	
			
		}
		
		this.renderSVG = function(opts, tableId, height, xpos, ypos){
			var childLength = self.children.length, mainTable;
			debugger;
			if(this.data.parent == 0){
				var x1pos = 0;
				var midHeight = height / 2;
				console.log("height is:",OrgChart.NODEHEIGHT);
				var y1pos = midHeight - ( (OrgChart.NODEHEIGHT/2) +  OrgChart.NODEPADDING)
				mainTable += self.DrawRootNode(x1pos, y1pos, opts);
				debugger;
			}
			
			if (childLength > 0){
				this.x1pos = this.x2pos; this.y1pos = this.y2pos;
				mainTable += self.DrawHorizontalLine(this.x1pos, this.y1pos);
				//mainTable 
			}
			
			debugger;
			//mainTable += "<line x1='0' y1='0' x2='800' y2='500' style='stroke:rgb(0,0,0);stroke-width:2' />"
			return mainTable;
		}
			
		this.DrawHorizontalLine = function(xpos, ypos){
			debugger;
			var x2pos = xpos + OrgChart.TREELINEWIDTH;
			var y2pos = ypos;
			mainTable += "<line x1='"+xpos+"' y1='"+ypos+"' x2='"+x2pos+"' y2='"+y2pos+"' style='stroke:rgb(0,0,0);stroke-width:2' />";
			this.x2pos = x2pos;
			this.y2pos = y2pos;
			return mainTable;
		}
		this.DrawRootNode = function(x1pos, y1pos, opts){
			debugger;
			mainTable = "<foreignObject x='"+x1pos+"' y='"+y1pos+"'>"+self.formatNode(opts)+"</foreignObject>";
			this.x2pos = x1pos + OrgChart.NODEWIDTH + OrgChart.NODEPADDING;
			this.y2pos = y1pos + (OrgChart.NODEHEIGHT/2) + OrgChart.NODEPADDING;
			return mainTable;

		}
		this.render = function(opts, tableId){
			debugger;
			var childLength = self.children.length,
			mainTable;
			if(tableId != ""){
				mainTable = "<table id="+tableId+" cellpadding='0' cellspacing='0' border='0'>";
			}else{
				mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
			}
			var nodeColspan = childLength>0?2*childLength:2;
			mainTable += "<tr><td colspan='"+nodeColspan+"'>"+self.formatNode(opts)+"</td></tr>";  // First row in table contains node

			if(childLength > 0){
				var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
				mainTable += "<tr class='lines'><td colspan='"+childLength*2+"'>"+downLineTable+'</td></tr>';  // Second row in table contains a line in middle hence two td's are placed with border-right as 1px for the first td

				var linesCols = '';
				for(var i=0;i<childLength;i++){
					if(childLength==1){
						linesCols += "<td class='line left half'></td>";    // keep vertical lines aligned if there's only 1 child
					}
					else if(i==0){
						linesCols += "<td class='line left'></td>";     // the first cell doesn't have a line in the top
					}
					else{
						linesCols += "<td class='line left top'></td>";
					}

					if(childLength==1){
						linesCols += "<td class='line right half'></td>";
					}
					else if(i==childLength-1){
						linesCols += "<td class='line right'></td>";
					}
					else{
						linesCols += "<td class='line right top'></td>";
					}
				}
				mainTable += "<tr class='lines v'>"+linesCols+"</tr>";

				mainTable += "<tr>";    // In the same Row all Children are added for that Parent node
				for(var i in self.children){
					debugger;
					mainTable += "<td colspan='2'>"+self.children[i].render(opts)+"</td>";
				}
				mainTable += "</tr>";  // adding Children ends
			}
			mainTable += '</table>';

			return mainTable;
		}

		this.formatNode = function(opts){

			var titleString = '',
			emailString = '',
			phoneString = '',
			nameString = '',
			nodeid = '',
			imageString = '',
			descString = '';
			if(typeof data.title !== 'undefined'){
				nodeid = this.data.id+" title";
				titleString = "<div class='Title' node-id='"+nodeid+"'><h2>"+self.data.title+"</h2></div>";//'<h2>'+self.data.title+'</h2>';
			}
			if(typeof data.name !== 'undefined'){
				if(data.name == ""){
					data.name = "Enter Name";
				}
				nodeid = this.data.id+" name";
				if(data.name == "Enter Name"){
					//$(".name").css("color","#C0C0C0");
					nameString = "<span class='noname' node-id='"+nodeid+"'>"+self.data.name+"</span>";//'<h2>'+self.data.title+'</h2>';
				}else{
					//$(".name").css("color","#000000");
					nameString = "<span class='name' node-id='"+nodeid+"'>"+self.data.name+"</span>";//'<h2>'+self.data.title+'</h2>';
				}
			}
			if(typeof data.phone !== 'undefined'){
				if(data.phone == ""){
					data.phone = "Enter Phone";
				}
				nodeid = this.data.id+" phone";
				if(data.phone == "Enter Phone"){
					//$(".name").css("color","#C0C0C0");
					phoneString = "<span class='nophone' node-id='"+nodeid+"'>"+self.data.phone+"</span>";//'<h2>'+self.data.title+'</h2>';
				}else{
					//$(".name").css("color","#000000");
					phoneString = "<span class='phone' node-id='"+nodeid+"'>"+self.data.phone+"</span>";//'<h2>'+self.data.title+'</h2>';
				}
			}
			if(typeof data.email !== 'undefined'){
				if(data.email == ""){
					data.email = "Enter Email";
				}
				nodeid = this.data.id+" email";
				if(data.email == "Enter Email"){
					//$(".name").css("color","#C0C0C0");
					emailString = "<span class='noemail' node-id='"+nodeid+"'>"+self.data.email+"</span>";//'<h2>'+self.data.title+'</h2>';
				}else{
					//$(".name").css("color","#000000");
					emailString = "<span class='email' node-id='"+nodeid+"'>"+self.data.email+"</span>";//'<h2>'+self.data.title+'</h2>';
				}
			}

			if(typeof data.image !== 'undefined'){
				if(data.image == ""){
					//data.email = "Enter Email";
				}
				nodeid = this.data.id+" image";

				imageString = "<img class ='images' node-id='"+nodeid+"' src='https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg' alt='' /><input type='file' id='"+nodeid+"' style='display: none;' onchange='readURL(this);'/>";
			}
			if(typeof data.description !== 'undefined'){
				//  descString = '<p>'+self.data.description+'</p>';
			}
			if(opts.showControls){
				var buttonsHtml = "<div class='org-add-button'>"+opts.newNodeText+"</div><div class='org-del-button'></div>";
			}
			else{
				buttonsHtml = '';
			}
			return "<div class='node' node-id='"+this.data.id+"' parent-id='"+this.data.parent+"'><div id='container'>"+imageString+"<div class='pattr'>"+titleString+"<div class='info'>"+nameString+"<br>"+phoneString+"<br>"+emailString+"</div></div></div>"+descString+buttonsHtml+"</div>";
			// return "<div class='node' node-id='"+this.data.id+"'>"+nameString+descString+buttonsHtml+"</div>";
		}
	}

})(jQuery);

