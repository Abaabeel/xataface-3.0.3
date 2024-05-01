//require <jquery.packed.js>
//require <jquery.jstree.js>
//require <xatajax.core.js>
(function(){
	
	/**
	 * @namespace
	 * @name ui
	 * @memberOf xataface.modules.pdfreports
	 */
	var ui = XataJax.load('xataface.modules.pdfreports.ui');
	ui.SchemaBrowser = SchemaBrowser;
	
	var $ = jQuery;
	$.jstree._themes = XATAFACE_MODULES_HTMLREPORTS_URL+'/css/jstree/themes/';
	
	
	
	
	/**
	 * @description A schema browser panel for browsing a schema.
	 * @class
	 * @constructor
	 * @memberOf xataface.modules.pdfreports.ui
	 * @name SchemaBrowser
	 *
	 * @param {Object} o Configuration parameters
	 * @param {xataface.modules.pdfreports.DataSchema} o.schema The schema that this panel will browse.
	 * @param {boolean} o.showFields
	 * @param {boolean} o.showSchemas
	 * @param {boolean} o.showFunctions
	 *
	 * @property {HTMLElement} el The element that contains the UI.
	 * @property {xataface.modules.pdfreports.DataSchema} schema The schema that is a model for this view.
	 * @property {boolean} showFields Whether to show fields in this schema.
	 * @property {boolean} showSchemas Whether to show subschemas in this view.
	 * @property {boolean} showFunctions Whether to show functions in this view.
	 * @property {String} dropTarget A jQuery selector string identifying elements into which nodes
	 *		of this browser can be dropped.
	 *
	 *
	 * @usage
	 *
	 * //Create a new schema browser for a particular data schema.
	 * var browser = new SchemaBrowser({schema: mySchema});
	 * browser.showFields = true;
	 * browser.update();
	 */
	function SchemaBrowser(/*Object*/ o){
	
		if ( typeof(o) == 'undefined' ) o = {};
		
		
		this.el = $('<div>').get(0);
		this.schema = null;
		this.treeEl = $('<ul>').get(0);
		this.showFields = false;
		this.showSchemas = false;
		this.showFunctions = false;
		this.dropTarget = 'div.xf-pdfreport-PagePanel';
		
		
		$.extend(this,o);
		
		$(this.el)
			.addClass('xf-pdfreports-SchemaBrowser');
			
		this.initComponents();
	}
	
	SchemaBrowser.prototype.initComponents = initComponents;
	SchemaBrowser.prototype.update = update;
	SchemaBrowser.prototype.schemaToDom = schemaToDom;
	SchemaBrowser.prototype.refreshTree = refreshTree;
	SchemaBrowser.prototype.initTree = initTree;
	
	
	/**
	 * @name schemaDropped 
	 * @event
	 * @memberOf xataface.modules.pdfreports.ui.SchemaBrowser#
	 *
	 * @description Event fired when a node from the schema browser is dragged and 
	 * dropped somewhere.
	 *
	 * 
	 * @param {jQuery.Event} event
	 * @param {Object} data
	 * @param {xataface.modules.pdfreports.DataSchema} data.schema The schema that was dropped.
	 * @param {HTMLElement} data.target The target element that it was dropped on.
	 * @param {Object} data.jsTreeData Event data object passed from jsTree
	 * @param {jQuery.Event} data.event jQuery event passed from jsTree event.
	 *
	 * @see <a href="http://api.jquery.com/category/events/event-object/">jQuery Event Object</a>
	 * @see <a href="http://www.jstree.com/documentation/dnd">jsTree Event Data</a> (see drop_finish event).
	 *
	 */
	
	
	/**
	 * For documentation purposes only.
	 * This defines the structure
	 */
	var SchemaBrowserDropCheckEvent = {
	
	
		/**
		 * The jQuery event that originated this... good for finding the exact location
		 * of the mouse event.
		 */
		event: /*jQuery Event*/ null,
			
		/**
		 * An "out" parameter that is used to affect the result of the drop check.  Changing
		 * the values of this object will affect whether or not the drop is allowed to take
		 * place.
		 */
		out: {
			/**
			 * Set to false to allow the drop.
			 */
			disallow: /*boolean*/ true,
			
			/**
			 * Set to true if the current drop location will accept a drop to be placed
			 * after it.
			 */
			after: /*boolean*/ false,
			
			/**
			 * Set to true if the current drop location will accept a drop to be placed
			 * before it.
			 */
			before: /*boolean*/ false,
			
			/**
			 * Set to true if the current drop location will accept a drop inside it.
			 */
			inside: /*boolean*/ false
		},
		
		
		/**
		 * The schema that was dropped.
		 */
		schema: /*DataSchema*/ null,
		
		/**
		 * The HTMLElement onto which the schema is being dropped (or might be dropped).
		 */
		target: /*HTMLElement*/ null,
		
		
		/**
		 * The event data as passed on by jsTree.
		 */
		jsTreeData: {
			
			/**
			 * The <li> element that is being dragged.
			 */
			o: /*HTMLElement*/ null,
			
			/**
			 * The html element that is being dragged over.
			 */
			r: /*HTMLElement*/ null,
			
			/**
			 * The jquery event
			 */
			e: /*jQuery Event*/ null
		
		}
		
	};
	
	
	/**
	 * For documentation purposes only.
	 *
	 * This defines the schema of the SchemaBrowserDropped event.  An object of this structure
	 * is passed to the schemaDropped.SchemaBrowser event.
	 */
	var SchemaBrowserDroppedEvent = {
	
		/**
		 * The jQuery event that originated this... good for finding the exact location
		 * of the mouse event.
		 */
		event: /*jQuery Event*/ null,
	
		
		/**
		 * The schema that was dropped.
		 */
		schema: /*DataSchema*/ null,
		
		/**
		 * The HTMLElement onto which the schema is being dropped (or might be dropped).
		 */
		target: /*HTMLElement*/ null,
		
		/**
		 * The event data as passed on by jsTree.
		 */
		jsTreeData: {
			
			/**
			 * The <li> element that is being dragged.
			 */
			o: /*HTMLElement*/ null,
			
			/**
			 * The html element that is being dragged over.
			 */
			r: /*HTMLElement*/ null,
			
			
			/**
			 * The jquery event
			 */
			e: /*jQuery Event*/ null
		
		}
		
	};
		
	
	/**
	 * @description Initializes the canvas and sub-components.
	 * @private
	 * @memberOf xataface.modules.pdfreports.ui.SchemaBrowser#
	 * @function
	 * @name initComponents
	 *
	 */
	function initComponents(){
		
		$(this.treeEl).append($(this.schemaToDom(this.schema)).children());
		$(this.el).append(this.treeEl);
		this.initTree();
		
	}
	
	function initTree(){
		$(this.el).jstree({
			plugins: ['themes', 'html_data', 'dnd'],
			dnd: {
				'drop_target': this.dropTarget,
				'drop_finish': function(data){
					//console.log($(data.o).get(0));
					//dispatchDroppedEvent($(data.o).get(0), {data:data});
					
					$($(data.o).get(0)).trigger('liDropped.SchemaBrowser', {data:data});
					
				},
				'drop_check': function(data){
					
					var out = {
						after: false,
						before: false,
						inside: false,
						disallow: true
					};
					
					//alert('here');
					$(data.o).trigger('liDropCheck.SchemaBrowser', {
						out: out,
						data: data
					});
					if ( out.disallow ) return false;
					return out;
				}
			
			}
		});
	}
	
	function refreshTree(){
		$(this.el).jstree('destroy');
		this.initTree();
	}
	
	/**
	 * @description Updates the UI based on the model schema's state.
	 * @name update
	 * @memberOf xataface.modules.pdfreports.ui.SchemaBrowser#
	 * @function
	 */
	function update(){
		
		$(this.el).jstree('destroy');
		$(this.el).empty();
		var newTreeEl = $('<ul>').get(0);
		
		$(this.el).append(newTreeEl);
		this.treeEl = newTreeEl;
		
		$(this.treeEl).append($(this.schemaToDom(this.schema)).children());
		console.log('tree now');
		console.log(this.treeEl);
		console.log(this.schema);
		this.initTree();
		
		/*
		$(this.el).empty();
		this.treeEl = $('<ul>').get(0);
		$(this.treeEl).append($(this.schemaToDom(this.schema)).children());
		$(this.el).append(this.treeEl);
		$(this.el).jstree('refresh');
		*/
	}
	
	
	
	
	/**
	 * @description Converts a Schema to a DOM node that can be then passed to the jstree.
	 *
	 * @name schemaToDom
	 * @memberOf xataface.modules.pdfreports.ui.SchemaBrowser#
	 * @function
	 *
	 * @param {xataface.modueles.pdfreports.DataSchema} schema The schema to convert.
	 * @param {HTMLElement} li If this schema is being added to a parent li tag, this is that tag.
	 * @returns {HTMLElement} The resulting ul tag.
	 *
	 */
	function schemaToDom(/*DataSchema*/ schema, /*HTMLElement*/ li){
	
		var self = this;
		var root = $('<ul>').get(0);
		if ( this.showFields ){
			
			$.each(schema.getFields(), function(){
				var li = $('<li>').get(0);
				
				$(root).append(li);
				self.schemaToDom(this, li);
			});
		}
		
		if ( this.showSchemas ){
			$.each(schema.getSubSchemas(), function(){
				var li = $('<li>').get(0);
				$(root).append(li);
				self.schemaToDom(this, li);
			});
		}
		
		if ( this.showFunctions ){
			$.each(schema.getFunctions(), function(){
				var li = $('<li>').get(0);
				$(root).append(li);
				self.schemaToDom(this, li);
			});
		}
		
		if ( typeof(li) != 'undefined' ){
			var link = $('<a>').attr('href','#').text(schema.getLabel());
			$(li).append(link);
			$(li).append(root);
		}
		
		
		if ( typeof(li) != 'undefined' ){
			var fieldSchema = schema;
			//console.log('Binding');
			//console.log(li);
			$(li)
				.bind('liDropCheck.SchemaBrowser', function(e,d){
					//alert('herenow');
					
					$(self).trigger('schemaDropCheck.SchemaBrowser', {
						out: d.out,
						schema: fieldSchema,
						target: d.data.r,
						jsTreeData: d.data,
						event: d.data.e
					});
					
					
					
				})
				
				.bind('liDropped.SchemaBrowser', function(e,d){
				
					var events = $(this).data('events').liDropped;
					//console.log(this);
					//console.log('before');
					$.each(events, function(k,v){
						//console.log(v.handler);
					});
					//console.log('after');
				
					$(self).trigger('schemaDropped', {
						schema: fieldSchema,
						target: d.data.r,
						jsTreeData: d.data,
						event: d.data.e
					});
					
					e.stopPropagation();
					
					
				})
				;
		}
		
		return root;
		
	}
	
	
	
	
	
})();