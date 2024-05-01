/**
 * Example:
 * <div id="report-designer"></div>
 * <script type="text/javascript">
 * var c = new xataface.reports.Canvas({
 *	background: 'http://example.com/background.jpg',
 *  el: 'report-designer'
 * });
 * </script>
 */

if (typeof(xataface) == 'undefined' ) var xataface = {};
xataface.extend = function(parent, child){
	for ( var key in parent ) {
		if ( !child[key] ) child[key] = parent[key];
		child['parent__'+key] = parent[key];
	}
};

xataface.reports = {


	tools : {
	
		getTool : function(canvas, elem){
			if ( $(elem).is('.xataface-reports-canvas-element-field') ){
				return new xataface.reports.tools.FieldTool(canvas);
			} else if ( $(elem).is('.xataface-reports-canvas-element-table') ){
				return new xataface.reports.tools.TableTool(canvas);
			} else {
				return null;
			}
		},
	
		BaseTool : function(canvas){
		
			this.canvas = canvas;
			
		},
	
	
		/**
		 * The tool resposible for adding a field to the canvas.
		 */
		FieldTool : function(canvas){
			xataface.extend(new xataface.reports.tools.BaseTool(canvas), this);
			
		},
		
		TableTool : function(canvas){
			xataface.extend(new xataface.reports.tools.BaseTool(canvas), this);
		},
		
		PointerTool : function(canvas){
			xataface.extend(new xataface.reports.tools.BaseTool(canvas), this);
		}
	
	},
	
	Canvas : function(o){
		// Initialize variables
		
		if ( typeof(DATAFACE_URL) != 'undefined' ) this.baseURL = DATAFACE_URL+'/modules/Reports';
		else this.baseURL = '';
		
		/**
		 * Associative array of fields that can be used in this canvas.
		 * This associative array should be in the form:
		 * {fieldname: {name: 'fieldname', label: 'Field Name'}, ...}
		 */
		this.fields = {};
		
		/**
		 * Associative array of relationship definitions used in this canvas.
		 * This associative array should be in the form:
		 * {relationshipname: {name: 'relationshipname', label: 'Relationship Name', fields: { fields associative array }, ...}
		 */
		this.relationships = {};
		
		/**
		 * The current background image url for this canvas.
		 */
		this.background = null;
		
		/**
		 * The full width of the canvas (in pixels);
		 */
		this.width = null;	// The width of the canvas' scroll panel
		
		/**
		 * The full height of the canvas (in pixels)
		 */
		this.height = null; // the height of the canvas' scroll panel
		
		/**
		 * The width of the canvas' document (in pixels).
		 */
		this.docWidth = null; // The width of the document
		
		/**
		 * The height of the canvas' document (in pixels).
		 */
		this.docHeight = null; // the height of the document
		
		/**
		 * The document's DOM element.
		 */
		this.docEl = null;	// Reference to the dom element for the document
		
		/**
		 * The canvas' wrapper DOM element.
		 */
		this.el = null; // Reference to the dom element to the parent container
		
		/**
		 * The scrollPanel DOM element that allows us to scroll the document.
		 */
		this.scrollPanel = null;  // The reference to the dom element for the scrollpanel
		
		/**
		 * The toolbar's DOM element
		 */
		this.toolbarEl = null; // Reference to the dom element for the toolbar
		
		
		/**
		 * Referernce to the current selection tool.
		 * @type xataface.reports.tools.BaseTool
		 */
		this.currentTool = null;
		
		/**
		 * Array of pages in this canvas.  Each page essentially represents
		 * a single document element.  Changing a page essentially changes the
		 * docEl and background.
		 */
		this.pages = [];
		
		
		/**
		 * Status marker to indicate if this document is dirty or not.  dirty
		 * means that changes have been made since the last save.
		 */
		this.dirty = false;
		
		
		// Load values from parameters
		// Load values from parameters
		for ( var i in o ){
			if ( i == 'el' && typeof(o.el) == 'string' ) this.el = document.getElementById(o.el);
			else this[i] = o[i];
		}
		
		
		
		
		// Create the elements and lay them out
		this.toolbarEl = document.createElement('div');
		this.toolbarEl.className = 'xataface-reports-toolbar';
		
		this.el.appendChild(this.toolbarEl);
		var thisCanvas = this;
		$(this.toolbarEl).load(this.baseURL+'/lib/html/toolbar.html', null, function(){
			
			// Configure the toolbar
			$(this).find(".fg-button:not(.ui-state-disabled)")
			.hover(
				function(){ 
					$(this).addClass("ui-state-hover"); 
				},
				function(){ 
					$(this).removeClass("ui-state-hover"); 
				}
			)
			.mousedown(function(){
					$(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
					if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
					else { $(this).addClass("ui-state-active"); }	
			})
			.mouseup(function(){
				if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
					$(this).removeClass("ui-state-active");
				}
			});
			
			$(this).find(".xataface-reports-toolbar-tool-selector-pointer")
			.click(function(){
				thisCanvas.currentTool = new xataface.reports.tools.PointerTool(thisCanvas);
				//alert('Selected the field tool');
			});
			
			$(this).find(".xataface-reports-toolbar-tool-selector-field")
			.click(function(){
				thisCanvas.currentTool = new xataface.reports.tools.FieldTool(thisCanvas);
				//alert('Selected the field tool');
			});
			
			$(this).find(".xataface-reports-toolbar-tool-selector-table")
			.click(function(){
				thisCanvas.currentTool = new xataface.reports.tools.TableTool(thisCanvas);
				//alert('Selected the table tool');
			});
			
			$(this).find(".xataface-reports-toolbar-save").click(function(){
				thisCanvas.saveDocument();
				
			});
			
			$(this).find(".xataface-reports-toolbar-new").click(function(){
				thisCanvas.newDocument();
				
			});
			
			$(this).find(".xataface-reports-toolbar-load").click(function(){
				//alert("here");
				thisCanvas.loadDocument();
			});
			
			
			$(this).find('.xataface-reports-toolbar-font-bold').mouseup(function(){
				thisCanvas.setDirty(true);
				if ( $(this).is('.ui-state-active') ){
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('font-weight', 'bold');
				} else {
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('font-weight', 'normal');
				}
			});
			
			$(this).find('.xataface-reports-toolbar-font-italic').mouseup(function(){
				thisCanvas.setDirty(true);
				if ( $(this).is('.ui-state-active') ){
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('font-style', 'italic');
				} else {
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('font-style', 'normal');
				}
			});
			
			$(this).find('.xataface-reports-toolbar-font-underline').mouseup(function(){
				thisCanvas.setDirty(true);
				if ( $(this).is('.ui-state-active') ){
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('text-decoration', 'underline');
				} else {
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('text-decoration', 'none');
				}
			});
			
			$(this).find('.xataface-reports-toolbar-font-size').change(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('font-size', $(this).val()+'px');
			});
			
			$(this).find('.xataface-reports-toolbar-font-family').change(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('font-family', $(this).val());
			});
			
			
			var colorChooser = $(this).find('.xataface-reports-toolbar-font-color').get(0);
			$(colorChooser).ColorPicker({
				onChange: function(hsb, hex, rgb){
					$(colorChooser).css('background-color', '#'+hex);
					$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
						.css('color', '#'+hex);
				}
			
			});
			
			$(this).find('.xataface-reports-toolbar-text-align-left').mouseup(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('text-align', 'left');
			});
			
			$(this).find('.xataface-reports-toolbar-text-align-center').mouseup(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('text-align', 'center');
			});
			$(this).find('.xataface-reports-toolbar-text-align-right').mouseup(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('text-align', 'right');
			});
			
			$(this).find('.xataface-reports-toolbar-text-align-justify').mouseup(function(){
				thisCanvas.setDirty(true);
				$(thisCanvas.docEl).find('.xataface-reports-canvas-element-selected')
					.css('text-align', 'justify');
			});
			
			
			
			
		});
		
		
		this.scrollPanel = document.createElement('div');
		this.scrollPanel.className = 'xataface-reports-canvas-scrollpanel';
		
		
		
		
		this.el.appendChild(this.scrollPanel);
		
		if ( this.data ){
			this.loadDocument(this.data);
		} else {
			this.newDocument();
		}
		
		
	}
	
	
};


xataface.reports.Canvas.prototype = {

	selectTool: function(name){
		$(this.toolbarEl).find('.xataface-reports-toolbar-tool-selector .fg-button').removeClass('ui-state-active');
		
		$(this.toolbarEl).find('.xataface-reports-toolbar-tool-selector-'+name).addClass('ui-state-active');
		
		switch (name){
			case 'field':
				this.currentTool = new xataface.reports.tools.FieldTool(this);
				break;
			case 'table':
				this.currentTool = new xataface.reports.tools.TableTool(this);
			default:
				this.currentTool = new xataface.reports.tools.PointerTool(this);
				break;
			
		}
	},

	
	/**
	 * Method meant to be overridden that converts a background id
	 * into a URL.  This helps to decouple the report builder front-end
	 * from any future back-end so that backgrounds can be stored using
	 * IDs and then converted into URLs by the implementation.
	 * @param string id The id of the background image.
	 * @return string URL
	 */
	getBackgroundURL: function(id){
		return id;
	},
	
	
	
	/**
	 * Method that can be overridden to allow the user to select a background.
	 * This might be as simple as presenting the user with a dialog to enter a
	 * URL to an image, or it could involve him selecting a file from his local
	 * machine to upload.
	 * @param progress  An object with which to pass the results of selecting the
	 * background.  This uses the Pipeline Decorator design pattern as a workaround
	 * for javascript not truly supporting modal dialogs.
	 * 
	 * When overriding you can pass your results by adding the following attributes
	 * to the progress parameter:
	 *
	 * backgroundids :  An array of background ids which the getBackgroundURL() method
	 *		knows how to convert into URLs of images.
	 *
	 * documentid : The id of the document (PDF) file that has been selected.
	 *
	 * @return void
	 * getBackgroundURL()
	 */
	selectBackground: function(progress){
		var imgURL = prompt('Please enter the URL to the background image you wish to use');
		progress.backgroundids = [imgURL];
		this.callNext(progress);
		
	
	},
	
	/**
	 * Method that can be overridden to allow the user to load an existing
	 * report into the designer.   This, like the selectBackground() method uses the 
	 * Pipeline Decorator design pattern as a workaround for javascript not truly
	 * supporting modal dialogs.
	 *
	 * @param progress  An object with which to pass the results of selecting the
	 * 	report to load.  You are meant to pass the data to be loaded by adding an
	 *	attribute of this name to the progress object.
	 *
	 */
	selectReportToLoad: function(progress){
		var thisCanvas = this;
		if ( !progress.data ){
			var dialog = document.createElement('div');
			dialog.setAttribute('title', 'Load Report...');
			this.el.appendChild(dialog);
			$(dialog).load(this.baseURL+'/lib/html/dialogs/select-report-to-load.html');
			$(dialog).dialog({
				modal: true,
				buttons: {
					'OK': function(){
						var dataField = $(this).find('textarea.load_data').get(0);
						if ( !$(dataField).val() ){
							$(dataField).css('border','1px solid red');
							alert('The Metadata field is required');
							return;
						}
						
						var data = null;
						try {
							data = $.secureEvalJSON($(dataField).val());
						} catch (e){
							$(dataField).css('border','1px solid red');
							alert('There was a syntax error in the document data you provided.  Please check the document and try again.');
							return;
						}
						$(this).dialog("close");
						progress.data = data;
						thisCanvas.callNext(progress);

						return;
					
					},
					
					'Cancel': function(){
						$(this).dialog("close");
						return;
					}
				}
			});
			
		}
		
		return;
		
	},
	
	setDirty: function(val){
		this.dirty = val;
		if ( val ){
			$(this.toolbarEl).find('.xataface-reports-toolbar-save').removeClass('ui-state-disabled');
		} else {
			$(this.toolbarEl).find('.xataface-reports-toolbar-save').addClass('ui-state-disabled');
		}
	},
	
	newProgress: function(){
		return {
			stack: []
		};
	},
	
	callNext: function(progress){
		if ( progress.stack.length > 0 ){
			var next = progress.stack.pop();
			next(progress);
		}
	},
	
	
	closeDocument: function(progress){
		var thisCanvas = this;
		// The progress parameter is an object that tracks the progress with respect
		// to the required user input for this function to operate properly.
		
		if ( !progress ) progress = this.newProgress();
		if ( this.docEl && this.dirty && !progress.discard){
			// If there is an existing document and it is dirty,
			// then we should warn the user and give them the opportunity
			// to save it.
			
			var dialog = document.createElement('div');
			dialog.setAttribute('title', 'Save changes?');
			thisCanvas.el.appendChild(dialog);
			//alert(elem.xfparams['table']);
			
			$(dialog).load(this.baseURL+'/lib/html/dialogs/save-changes.html');
			$(dialog).dialog({
				modal: true,
				buttons: {
					'Yes': function(){
						$(this).dialog('close');
						
						// We should save the original document first
						progress.stack.push(function(){
							thisCanvas.closeDocument(progress);
						});
						thisCanvas.saveDocument(progress);
						return true;
					},
					'No': function(){
						$(this).dialog('close');
						
						progress.discard = true;
						thisCanvas.closeDocument(progress);
						return true;
					},
					'Cancel': function(){
						$(this).dialog('close');
						return true;
					}
				}
			});
			
			return;
			
		}
		
		// Now remove the opened pages from the document.
		$(this.scrollPanel).find('.xataface-reports-canvas-document').remove();
		this.pages = [];
		this.docEl = null;
		this.callNext(progress);
	
	},
	
	saveDocument: function(){
		this.setDirty(false);
		this.serialize();
	},
	
	
	
	
	/**
	 * Loads a new document from the data given.
	 *
	 * This uses the progress tracker so that if an existing document is already
	 * opened it will give the user the opportunity to save it or discard it.
	 *
	 * @param object data The data that defines the document.
	 * @param object progress The progress tracker for tracking the progress of loading.
	 */
	loadDocument: function(data, progress){
		var thisCanvas = this;
		if ( !progress ) progress = this.newProgress();
		if ( this.docEl ){
			// We have a document open already.  Close it first
			progress.stack.push(function(){
				thisCanvas.loadDocument(data, progress);
			});
			this.closeDocument(progress);
			return;
		}
		
		if ( !data && !progress.data ){
			// No data supplied yet
			progress.stack.push(function(){
				thisCanvas.loadDocument(null, progress);
			});
			this.selectReportToLoad(progress);
			return;
		}
		
		if ( !data ) data = progress.data;
		
		
		// Now that we have the data, we can proceed to load our
		// document for editing.
		
		this.xfparams = {};
		if ( data.documentid ) this.xfparams.documentid = data.documentid;
		var pages = [];
		for ( var i=0; i<data.pages.length; i++ ){
			var backgroundid = data.pages[i].backgroundid;
			// Load the background image of the document, and set the
			// document size to match the image background.
			var img = new Image();
			img.src = this.getBackgroundURL(backgroundid);
			img.canvas = this;
			
			
			var docEl = document.createElement('div');
			$(docEl).addClass('xataface-reports-canvas-document');
			$(docEl).addClass('xataface-reports-canvas-document-'+i);
			docEl.xfparams = {};
			for ( var j in data.pages[i] ){
				docEl.xfparams[j] = data.pages[i][j];
			}
			this.scrollPanel.appendChild(docEl);
			pages[pages.length] = docEl;
			
			img.onload = function(){
				//alert('here');
				this.canvas.docWidth = this.width;
				this.canvas.docHeight = this.height;
				docEl.style.width = this.width+'px';
				docEl.style.height = this.height+'px';
				docEl.xfparams.width = this.width;
				docEl.xfparams.height = this.height;
				docEl.style.backgroundImage = 'url('+this.src+')';
				$(thisCanvas.el).css('height', (this.height+100)+'px');
			};
			
			
			$(docEl).click(function(eventObj){
				if ( thisCanvas.currentTool && typeof(thisCanvas.currentTool.click) == 'function'){
					return thisCanvas.currentTool.click(eventObj);
				}
			});
			
			// Now add the elements to the page.
			for ( var j=0; j<data.pages[i].elements.length; j++){
				var elProperties = data.pages[i].elements[j];
				var tool = null;
				switch ( elProperties.type ){
					case 'field':
						tool = new xataface.reports.tools.FieldTool(this);
						break;
					case 'table':
						tool = new xataface.reports.tools.TableTool(this);
						break;
				}
				
				var el = tool.createElement(elProperties);
				docEl.appendChild(el);
				
				
			}
			//alert('adding page');
			//pages.push(docEl);
		}
		
		this.pages = null;
		this.pages = pages;
		this.docEl = this.pages[0];
		$(this.scrollPanel).find('.xataface-reports-canvas-document').css('display','none');
		$(this.scrollPanel).find('.xataface-reports-canvas-document-0').css('display','');
			
		this.setDirty(false);
		this.callNext(progress);
		
		
		
		
		
	},
	
	
	newDocument: function(progress){
		var thisCanvas = this;
		if ( !progress ) progress = this.newProgress();
		if ( this.docEl ){
			// We have a document open already.  Close it first
			progress.stack.push(function(){
				thisCanvas.newDocument(progress);
			});
			this.closeDocument(progress);
			return;
		}
		
		var backgroundids = null;
		if ( typeof(progress.backgroundids) == 'undefined' ){
			progress.stack.push(function(){
				thisCanvas.newDocument(progress);
			});
			this.selectBackground(progress);
			return;
		}
		
		backgroundids = progress.backgroundids;
		
		
		
		// Now that we have taken care of saving, etc.. we can proceed
		// to set up a new document.
		var pages = [];
		
		
		
		for ( var i=0; i<backgroundids.length; i++ ){
			// Load the background image of the document, and set the
			// document size to match the image background.
			var img = new Image();
			img.src = this.getBackgroundURL(backgroundids[i]);
			img.canvas = this;
			
			
			var docEl = document.createElement('div');
			$(docEl).addClass('xataface-reports-canvas-document');
			$(docEl).addClass('xataface-reports-canvas-document-'+i);
			docEl.xfparams = {};
			docEl.xfparams.backgroundid = backgroundids[i];
			this.scrollPanel.appendChild(docEl);
			pages[pages.length] = docEl;
			
			img.onload = function(){
				//alert('here');
				this.canvas.docWidth = this.width;
				this.canvas.docHeight = this.height;
				docEl.style.width = this.width+'px';
				docEl.style.height = this.height+'px';
				docEl.xfparams.width = this.width;
				docEl.xfparams.height = this.height;
				docEl.style.backgroundImage = 'url('+this.src+')';
				$(thisCanvas.el).css('height', (this.height+100)+'px');
			};
			
			
			$(docEl).click(function(eventObj){
				if ( thisCanvas.currentTool && typeof(thisCanvas.currentTool.click) == 'function'){
					return thisCanvas.currentTool.click(eventObj);
				}
			});
		}
		
		
		this.pages = pages;
		this.docEl = this.pages[0];
		$(this.scrollPanel).find('.xataface-reports-canvas-document').css('display','none');
		$(this.scrollPanel).find('.xataface-reports-canvas-document-0').css('display','');
			
		this.setDirty(false);
		this.callNext(progress);
			
		
	},
	
	
	
	
	/**
	 * Serializes the canvas document for saving.
	 */
	serialize: function(){
	
		var out = {};
		out.pages = [];
		for ( var i=0; i<this.pages.length; i++){
			var page = {
				backgroundid: this.pages[i].xfparams['backgroundid'],
				width: this.pages[i].xfparams.width,
				height: this.pages[i].xfparams.height,
				elements: []
			};
			
			$(this.pages[i]).find('.xataface-reports-canvas-element').each(function(i){
				var el = {};
				for ( var j in this.xfparams ){
					el[j] = this.xfparams[j];
				}
				var props = {
					'font-size': $(this).css('font-size').replace(/[a-zA-Z]+/,''),
					'font-family': $(this).css('font-family'),
					'font-weight': $(this).css('font-weight'),
					'font-style': $(this).css('font-style'),
					'text-decoration': $(this).css('text-decoration'),
					'color': $(this).css('color')
				};
				for ( var p in props ) el[p] = props[p];
				
				page.elements.push(el);
			});
			
			out.pages.push(page);
			
		}
		
		alert($.toJSON(out));
		return $.toJSON(out);
		
	},
	
	applyToolbar: function(elem){
		var thisCanvas = this;
		
		
		// First let's set the alignment of our element.
		var alignButton = $(thisCanvas.toolbarEl).find('.xataface-reports-toolbar-group-align .fg-button.ui-state-active');
		if ( alignButton.size() > 0 ) alignButton = alignButton.get(0);
		else {
			alignButton = $(thisCanvas.toolbarEl).find('xataface-reports-toolbar-text-align-left').addClass('ui-state-active').get(0);
		}

		if ( $(alignButton).is('.xataface-reports-toolbar-text-align-justify') ){
			$(elem).css('text-align', 'justify');
		} else if ( $(alignButton).is('.xataface-reports-toolbar-text-align-center') ){
			$(elem).css('text-align', 'center');
		} else if ( $(alignButton).is('.xataface-reports-toolbar-text-align-right') ){
			$(elem).css('text-align', 'right');
		} else {
			$(elem).css('text-align', 'left');
			
		}
		
		
		// Now let's set the style of our element
		if ( $(this.toolbarEl).find('.xataface-reports-toolbar-font-italic').is('.ui-state-active') ){
			$(elem).css('font-style', 'italic');
		} else {
			$(elem).css('font-style', 'normal');
		}
		if ( $(this.toolbarEl).find('.xataface-reports-toolbar-font-bold').is('.ui-state-active') ){
			$(elem).css('font-weight', 'bold');
		} else {
			$(elem).css('font-weight', 'normal');
		}
		if ( $(this.toolbarEl).find('.xataface-reports-toolbar-font-underline').is('.ui-state-active') ){
			$(elem).css('text-decoration', 'underline');
		} else {
			$(elem).css('text-decoration', 'none');
		}
		
		//Now let's set the font size and family
		$(elem).css('font-size', $(this.toolbarEl).find('.xataface-reports-toolbar-font-size').val()+'px');
		$(elem).css('font-family', $(this.toolbarEl).find('.xataface-reports-toolbar-font-family').val());
		
		
		// Now let's set the font color
		$(elem).css('color', $(this.toolbarEl).find('.xataface-reports-toolbar-font-color').css('background-color'));
		
			
		
	},
	
	updateToolbar: function(elem){
	
		// Update the toolbar's text alignment
		$(this.toolbarEl).find('.xataface-reports-toolbar-group-align .fg-button')
			.removeClass('ui-state-active');
			
		switch ( $(elem).css('text-align')){
			
			case 'center':
				$(this.toolbarEl).find('.xataface-reports-toolbar-text-align-center')
					.addClass('ui-state-active');
				break;
			case 'right':
				$(this.toolbarEl).find('.xataface-reports-toolbar-text-align-right')
					.addClass('ui-state-active');
				break;
				
			case 'justify':
				$(this.toolbarEl).find('.xataface-reports-toolbar-text-align-justify')
					.addClass('ui-state-active');
				break;
			default:
				$(this.toolbarEl).find('.xataface-reports-toolbar-text-align-left')
					.addClass('ui-state-active');
				break;
					
		}
		
		// Update the toolbar's style buttons
		$(this.toolbarEl).find('.xataface-reports-toolbar-group-style .fg-button')
			.removeClass('ui-state-active');
			
		if ( $(elem).css('font-style') == 'italic' ){
			$(this.toolbarEl).find('.xataface-reports-toolbar-font-italic')
				.addClass('ui-state-active');
		}
		
		if ( $(elem).css('font-weight') == 'bold' ){
			$(this.toolbarEl).find('.xataface-reports-toolbar-font-bold')
				.addClass('ui-state-active');
		}
		
		if ( $(elem).css('text-decoration') == 'underline' ){
			$(this.toolbarEl).find('.xataface-reports-toolbar-font-underline')
				.addClass('ui-state-active');
		}
		
		
		$(this.toolbarEl).find('.xataface-reports-toolbar-font-size')
			.val($(elem).css('font-size').replace(/px/,''));
			
		$(this.toolbarEl).find('.xataface-reports-toolbar-font-family')
			.val($(elem).css('font-family').toLowerCase());
			
		$(this.toolbarEl).find('.xataface-reports-toolbar-font-color')
			.ColorPickerSetColor($(elem).css('color'))
			.css('background-color', $(elem).css('color'));
	}
	

};

xataface.reports.tools.BaseTool.prototype = {
	
	createElement: function(properties){
		var el = document.createElement('div');
		$(el).html('<div class="xataface-reports-canvas-element-content"/>');
		
		$(el).addClass('xataface-reports-canvas-element');
		$(el).css('width',"100px");
		$(el).css('height',"20px");
		el.xfparams = {
			width: 100,
			height: 20
		};
		
		for (var pname in properties){
			el.xfparams[pname] = properties[pname];
		}
		
		if ( typeof(properties.width) =='number' ){
			$(el).css('width', properties.width+'px');
		}
		if ( typeof(properties.height) == 'number' ){
			$(el).css('height', properties.height+'px');
		}
		if ( typeof(properties.top) == 'number' ){
			$(el).css('top', properties.top+'px');
		}
		if ( typeof(properties.left) == 'number' ){
			$(el).css('left', properties.left+'px');
		}
		if (properties['font-family'] ){
			$(el).css('font-family', properties['font-family']);
		}
		if ( properties['font-size'] ){
			$(el).css('font-size', properties['font-size']+'px');
		}
		if ( properties['color'] ){
			$(el).css('color', properties['color']);
		}
		if ( properties['font-style'] ){
			$(el).css('font-style', properties['font-style']);
		}
		if ( properties['font-weight'] ){
			$(el).css('font-weight', properties['font-weight']);
		}
		if ( properties['text-decoration'] ){
			$(el).css('text-decoration', properties['text-decoration']);
		}
		
		
		$(el).addClass('ui-resizable');
		
		var thisCanvas = this.canvas;
		var currTool = this;
		$(el).click(function(eventObj){
			//alert('1');
			if ( thisCanvas.currentTool && typeof(thisCanvas.currentTool.click)=='function'){
				return thisCanvas.currentTool.click(eventObj, this);
			}
		});
		
		$(el).dblclick(function(eventObj){
			//alert(currTool);
			if ( thisCanvas.currentTool && typeof(thisCanvas.currentTool.dblclick)=='function'){
				return thisCanvas.currentTool.dblclick(eventObj, this);
			}
		});
		
		
		$(el).resizable({
			handles: 'n,e,s,w,ne,nw,se,sw',
			start: function(event, ui){
				thisCanvas.setDirty(true);
			},
			stop: function(event, ui){
				this.xfparams.top = $(this).offset().top - $(thisCanvas.docEl).offset().top;
				this.xfparams.left = $(this).offset().left - $(thisCanvas.docEl).offset().left;
				this.xfparams.width = $(this).width();
				this.xfparams.height = $(this).height();
				
			}
		});
		$(el).draggable({
			start: function(event, ui){
				thisCanvas.setDirty(true);
			},
			stop: function(event, ui){
				this.xfparams.top = $(this).offset().top - $(thisCanvas.docEl).offset().top;
				this.xfparams.left = $(this).offset().left - $(thisCanvas.docEl).offset().left;
			}
		});
		return el;
	},
	
	click: function(eventObj, elem){
		if ( typeof(elem) == 'undefined' ) return this.canvasClick(eventObj);
		else return this.elementClick(eventObj,elem);
	},
	
	canvasClick: function(eventObj){
		var properties = {};
		$(this.canvas.docEl).find('.xataface-reports-canvas-element').removeClass('xataface-reports-canvas-element-selected');
		
		
		// Check to see if this element is being created inside a table
		if ( eventObj ){
			var table = $(eventObj.target).parents().filter('.xataface-reports-canvas-element-table');
			if ( table.size() > 0 ) properties['table'] = table.get(0).xfparams['tableid'];
		}
		
		var x = eventObj.pageX - $(this.canvas.docEl).offset().left;
		var y = eventObj.pageY - $(this.canvas.docEl).offset().top;
		
		
		var el = this.createElement(properties);
		//if ( !el ) return;
		this.canvas.docEl.appendChild(el);
		$(el).addClass('xataface-reports-canvas-element-selected');
		
		
		this.canvas.setDirty(true);
		$(el).css('top',y+'px');
		$(el).css('left',x+'px');
		//$(el).css('background-color', 'red');
		el.xfparams.top = y;
		el.xfparams.left = x;
		
		
		this.showDialog(el);
		this.canvas.applyToolbar(el);
		this.canvas.selectTool('pointer');
		//this.canvas.updateToolbar(el);
		
		
		
	},
	
	elementClick: function(eventObj, elem){
		$(this.canvas.docEl).find('.xataface-reports-canvas-element').removeClass('xataface-reports-canvas-element-selected');
		$(elem).addClass('xataface-reports-canvas-element-selected');
		this.canvas.updateToolbar(elem);
		
		
		eventObj.stopPropagation();
	},
	
	dblclick: function(eventObj, elem){
		if ( typeof(elem) != 'undefined' ){
			var tool = xataface.reports.tools.getTool(this.canvas, elem);
			if ( tool) tool.showDialog(elem);
		}
	},
	
	showDialog: function(elem){
		
	}
	

};

xataface.reports.tools.FieldTool.prototype = {

	createElement: function(properties){
		//var baseTool = new xataface.reports.tools.BaseTool(this.canvas);
		var el = this.parent__createElement(properties);
		el.xfparams['type'] = 'field';
		$(el).addClass('xataface-reports-canvas-element-field');
		$(el).find('.xataface-reports-canvas-element-content').html('<span class="xataface-reports-canvas-element-field-span"></span>');
		
		if ( el.xfparams['field'] ){
			$(el).find('.xataface-reports-canvas-element-field-span').html(el.xfparams['field']);
		}
		// Check to see if this element is being created inside a table
		//if ( eventObj ){
		//	var table = $(eventObj.target).parents().filter('.xataface-reports-canvas-element-table');
		//	if ( table.size() > 0 ) el.xfparams['table'] = table.get(0).xfparams['tableid'];
		//}
		
		return el;
	
	},
	
	showDialog: function(elem){
		var dialog = document.createElement('div');
		dialog.setAttribute('title', 'Edit Field Properties...');
		this.canvas.el.appendChild(dialog);
		var thisCanvas = this.canvas;
		var thisElem = elem;
		//alert(elem.xfparams['table']);
		$(dialog).dialog();
		$(dialog).load(thisCanvas.baseURL+'/lib/html/dialogs/field-editor.html', function(){
			
			var select = $(this).find('.xataface-reports-dialog-field-selector');
			var fields = null;
			if ( thisElem.xfparams.table ){
				//alert('we have a table');
				var table = $(thisCanvas.docEl).find('.xataface-reports-canvas-element-table-'+thisElem.xfparams.table);
				if ( table.size()>0 ){
					//alert("size more than 0");
					var relationship = table.get(0).xfparams['relationship'];
					//alert(relationship);
					if ( relationship ){
						relationship = thisCanvas.relationships[relationship];
						if ( relationship && relationship.fields ){
							fields = relationship.fields;
						}
					}
				}
			}
			
			if ( !fields ){
				fields = thisCanvas.fields;
			}
			$.each(fields, function(key, value){   
				select.append($("<option></option>").attr("value",key).text(value.label)); 
			});
			if ( thisElem.xfparams.field ){
				select.val(thisElem.xfparams.field);
			}
			select.change(function(eventObj){
				$(thisElem).find('.xataface-reports-canvas-element-field-span').html(
					$(this).val()
				);
				thisElem.xfparams['field'] = $(this).val();
				thisCanvas.setDirty(true);
				
			});
		});
	
	},
	
	// If we are clicking inside a table, then we have to override the default
	// elementClick() method so that it propagates down to the canvas so that
	// the element will be added.
	elementClick: function(eventObj, elem){
		
		if ( !$(elem).is('.xataface-reports-canvas-element-table') ){
			return this.parent__elementClick(eventObj, elem);
		}
	}
	
	
	

};
xataface.reports.tools.TableTool.nextId = 1;
xataface.reports.tools.TableTool.prototype = {
	createElement: function(properties){
		
		var el = this.parent__createElement(properties);
		el.xfparams['type'] = 'table';
		$(el).addClass('xataface-reports-canvas-element-table');
		
		$(el).find('.xataface-reports-canvas-element-content').html(this.getTableHtml(2));
		if ( !el.xfparams.tableid ) el.xfparams['tableid'] = xataface.reports.tools.TableTool.nextId++;
		$(el).addClass('xataface-reports-canvas-element-table-'+el.xfparams['tableid']);
		
		
		return el;
	},
	
	getTableHtml: function(numRows, rowsOnly){
		var html = '';
		if ( !rowsOnly )  html += '<table class="xataface-reports-canvas-element-table-tag" width="100%" cellspacing="0" cellpadding="0"><tbody>';
		for ( var i=0; i<numRows; i++){
			html += '<tr><td><img src="'+this.canvas.baseURL+'/images/pixel.png"/></td></tr>';
		}
		if ( !rowsOnly) html += '</tbody></table>';
		return html;
	},
	
	
	showDialog: function(elem){
		var dialog = document.createElement('div');
		dialog.setAttribute('title', 'Table Properties');
		this.canvas.el.appendChild(dialog);
		var thisCanvas = this.canvas;
		var thisElem = elem;
		var thisTool = this;
		$(dialog).dialog();
		$(dialog).load(thisCanvas.baseURL+'/lib/html/dialogs/table-editor.html', function(){
			var rows = $(thisElem).find('tr').size();
			var numRowsField = $(this).find('.xataface-reports-dialog-table-numRows');
			numRowsField.val(rows);
			numRowsField.change(function(eventObj){
				var numRows = parseInt($(this).val());
				$(thisElem).find('table').html(thisTool.getTableHtml(numRows, true));
				thisCanvas.setDirty(true);
			});
			
			
			var relationshipSelector = $(this).find('.xataface-reports-dialog-table-relationship-selector').get(0);
			for ( var rel in thisCanvas.relationships ){
				var opt = new Option(thisCanvas.relationships[rel].label, rel);
				relationshipSelector.options[relationshipSelector.options.length] = opt;
			}
			
			$(relationshipSelector).change(function(){
				thisElem.xfparams['relationship'] = $(this).val();
			});
			
			
		});
	
	},
	
	elementClick: function(eventObj, elem){}
};

xataface.reports.tools.PointerTool.prototype = {
	canvasClick: function(eventObj){
		$(this.canvas.docEl).find('.xataface-reports-canvas-element-selected').removeClass('xataface-reports-canvas-element-selected');
	}
	
};