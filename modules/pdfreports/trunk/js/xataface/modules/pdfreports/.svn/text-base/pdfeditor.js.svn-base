//require <xataface/modules/pdfreports/PDFReport.js>
//require <xataface/ui/UploadDialog.js>
//require <xataface/ui/ComponentPalette.js>
//require <jquery-ui.min.js>
//require-css <jquery-ui/jquery-ui.css>
//require <xataface/modules/pdfreports/ui/PageElementPropertiesPanel.js>
//require <xataface/modules/pdfreports/ui/SchemaBrowser.js>
//require <xataface/modules/pdfreports/DataSchema.js>
//require <xatajax.form.core.js>
//require <xataface/modules/pdfreports/ReportContainer.js>
(function(){
	var pdfreports = XataJax.load('xataface.modules.pdfreports');
	pdfreports.PDFEditor = PDFEditor;
	PDFEditor.Action = Action;
	PDFEditor.actions = {};

	var $ = jQuery;
	var ReportViewer = xataface.modules.pdfreports.ReportViewer;
	var UploadDialog = xataface.ui.UploadDialog;
	var ComponentPalette = xataface.ui.ComponentPalette;
	var PageElementPropertiesPanel = xataface.modules.pdfreports.ui.PageElementPropertiesPanel;
	var SchemaBrowser = XataJax.load('xataface.modules.pdfreports.ui.SchemaBrowser');
	var DataSchema = XataJax.load('xataface.modules.pdfreports.DataSchema');
	var ReportContainer = XataJax.load('xataface.modules.pdfreports.ReportContainer');
	// A PDF Editor should contain the following elements:
	// 1. ReportViewer
	// 2. Menubar
	// 3. Toolbar
	
	/**
	 * @description Constructor for a PDF Editor component.  The PDF editor includes a menu bar, toolbar, 
	 * and a PDF Report Viewer.  The menu and tool bars store actions that can be added to allow
	 * the user to manipulate the PDF.  
	 *
	 * @class
	 *
	 * @memberOf xataface.modules.pdfreports
	 *
	 * @property {xataface.modules.pdfreports.DataSchema} dataSchema The schema that is used for this editor.
	 * @property {HTMLElement} el The DOM element that contains the view for this editor.
	 * @property {HTMLElement} menuBar The DOM element that contains the menu bar for this editor.
	 * @property {HTMLElement} toolBar The DOM element that contains the toolbar for this editor.
	 * @property {xataface.modules.pdfreports.ReportViewer} viewer The report that is currently being edited.
	 * @property {xataface.modules.pdfreports.ReportContainer} container The reference to the container.
	 * @property {int} saveVersion The version number that was last saved.
	 * @property {int} editVersion The verson currently edited.  If this is greater than saveVersion then there 
	 *		are unsaved changes.
	 *
	 * @see xataface.modules.pdfreports.ReportViewer
	 * @see xataface.modules.pdfreports.PDFDocument
	 * @see xataface.modules.pdfreports.PDFPagePanel
	 *
	 * @example
	 *  var editor = new PDFEditor();
     *	editor.viewer.setPdfUrl(/path/to/test.pdf');
     *	$('#pdf-editor-demo-wrapper').append(editor.el);
     *	
	 */
	function PDFEditor(o){
		if ( typeof(o) == 'undefined' ) o = {};
		var self = this;
		this.actions = [];
		
		this.dataSchema = null;
		this.schemaBrowser = null;
		
		this.container = new ReportContainer();
		
		this.pageElementPanel = null;
		
		this.titleBar = $('<div></div>')
			.addClass('xf-pdfeditor-titlebar')
			.get(0);
			
		this.titleBarLabel = $('<div>')
			.addClass('xf-pdfeditor-titlebar-label')
			.text('Untitled Report')
			.get(0);
			
		this.titleBarStatus = $('<div>')
			.addClass('xf-pdfeditor-titlebar-status')
			.get(0);
			
		$(this.titleBar)
			.append(this.titleBarStatus)
			.append(this.titleBarLabel);
		
		this.el = $('<div></div>')
			.addClass('xf-pdfeditor-window')
			.addClass('fullscreen')
			.get(0);
		
		
		this.menuBar = $('<div></div>')
			.addClass('xf-pdfeditor-menubar')
			.append($('<ul></ul>'))
			.get(0);
			
		this.toolBar = $('<div></div>')
			.addClass('xf-pdfeditor-toolbar')
			.get(0);
			
		$(this.toolBar).append('<div class="xf-pdfeditor-toolbar-actions"><ul></ul></div>');
			
		this.viewer = new ReportViewer();
		
		$(this.viewer).bind('selectionChanged', function(){
			// handler to handle when the selected elements change
			// In particular we want to update the pageElementPanel
			var pep = self.getPageElementPanel();
			var els = self.viewer.getSelectedElements();
			if ( els.length > 0 ){
				pep.pageElement = els[0];
			} else {
				pep.pageElement = null;
			}
			pep.update();
			
		});
		
		this.reportBody = $('<div>')
			.addClass('xf-pdfeditor-report-body')
			.append(this.viewer.el)
			.get(0);
		
		this.editorBody = $('<div>')
			.addClass("xf-pdfeditor-body")
			.append(this.toolBar)
			.append(this.reportBody)
			.get(0);
		
		$(this.el)
			.append(this.titleBar)
			.append(this.editorBody)
			//.append(this.menuBar)
			//.append(this.toolBar)
			//.append(this.viewer.el);
			;
		
		this.uploadUrl = null;
		
		$.extend(this, o);
		this.updateActions = true;
		
		this.saveVersion = 0;
		this.editVersion = 0;
		
		$(this.el).mousemove(function(){
			userActive(self);
		});
		
		$(this.el).keydown(function(){
			userActive(self);
		});
		
		setInterval(function(){ autoSave(self);}, 10000);
		$(window).resize(function(){
			if ( $(self.el).hasClass('fullscreen') ){
				//$(self.el).width($(window).width());
				//$(self.el).height($(window).height());
				self.update();
			}
		});
		
	}
	
	PDFEditor.prototype.newAction = PDFEditor_newAction;
	PDFEditor.prototype.newMenuItem = PDFEditor_newMenuItem;
	PDFEditor.prototype.newTool = PDFEditor_newTool;
	PDFEditor.prototype.addAction = PDFEditor_addAction;
	PDFEditor.prototype.removeAction = PDFEditor_removeAction;
	PDFEditor.prototype.update = PDFEditor_update;
	PDFEditor.prototype.getActions = PDFEditor_getActions;
	PDFEditor.prototype.getPageElementPanel = PDFEditor_getPageElementPanel;
	PDFEditor.prototype.setDataSchema = PDFEditor_setDataSchema;
	PDFEditor.prototype.newPageElement = PDFEditor_newPageElement;
	PDFEditor.prototype.getSchemaBrowser = PDFEditor_getSchemaBrowser;
	PDFEditor.prototype.newPortal = PDFEditor_newPortal;
	PDFEditor.prototype.loadReportById = PDFEditor_loadReportById;
	PDFEditor.prototype.loadSchemaById = PDFEditor_loadSchemaById;
	PDFEditor.prototype.save = PDFEditor_save;
	PDFEditor.prototype.preview = PDFEditor_preview;
	
	
	function userActive(/**PDFEditor*/ editor){
		editor.lastActive = new Date();
	}
	
	function autoSave(/**PDFEditor*/ editor){
		if ( !editor.lastSave || (editor.lastActive && (editor.lastActive.getTime() > editor.lastSave.getTime()))){
			if ( editor.viewer.reportId ){
				editor.save();
			}
		}
	
	}
	
	
	
	
	/**
	 * @name LoadReportCallback
	 * @function
	 * @description The callback function to pass to the loadReportById method of PDFEditor.
	 *
	 * Notice that this callback is run with the 'this' context being the PDFEditor object.
	 *
	 * @example
	 * editor.loadReportById('my report', function(){
	 * 		alert(this.viewer.reportId+' has been loaded');
	 * });
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#loadReportById
	 *
	 */
	 
	 /**
	 * @name LoadReportFailCallback
	 * @function
	 * @description The callback function to pass to the loadReportById method of PDFEditor
	 *		to handle failure.
	 *
	 * Notice that this callback is run with the 'this' context being the PDFEditor object.
	 *
	 * @param {String} msg The error message.
	 *
	 * @example
	 * editor.loadReportById('my report', 
	 *		function(){
	 * 			alert(this.viewer.reportId+' has been loaded');
	 * 		},
	 *		function(msg){
	 *			alert('An error occurred trying to load: '+msg);
	 *		}
	 *	);
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#loadReportById
	 *
	 */
	 
	
	/**
	 * @function
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @name loadReportById
	 *
	 * @description Loads a report by an ID.  The ID is dependent on the container (i.e.
	 *	only the container needs to understand the id.
	 *
	 * @param {String} id The ID of the report to load.
	 * @param {LoadReportCallback} callback A callback function to be called when the report is successfully loaded.
	 * @param {LoadReportFailCallback} failCallback A callback function to be called upon failure.
	 * @returns {void}
	 */
	function PDFEditor_loadReportById(id, callback, failCallback){
		if ( typeof(callback) == 'undefined' ) callback = function(){};
		if ( typeof(failCallback) == 'undefined' ) failCallback = function(){};
		var editor = this;
		editor.container.load({
			id: id,
			callback: function(params){
				
				if ( params.code == 200 ){
					editor.viewer.unserialize(params.serializedReport);
					
					editor.viewer.update();
					if ( editor.viewer.editable ){
						// We need to add the listeners to all of the page elements.
						editor.viewer.setEditable(false);
						editor.viewer.setEditable(true);
						
					}
					$.each(editor.viewer.getPageElements(), function(){
						installDialog(editor, this);
					});
					editor.lastSave = new Date();
					editor.update();
					
					editor.loadSchemaById(editor.viewer.schemaId, callback, failCallback);
					editor.saveVersion = params.version;
					editor.editVersion = params.version;
					
				} else {
					failCallback.call(editor, params);
				}
			}
		});
		
		
	}
	
	
	function PDFEditor_preview(){
	
		var editor = this;
		var tpl = $(editor.viewer.serialize()).clone().wrap('<div>').parent().html();
		editor.container.preview({
			serializedReport: tpl,
			schemaId: editor.viewer.schemaId
		});
		
	
	}
	
	/**
	 * @name LoadSchemaByIdCallback
	 * @function
	 * @description The callback function to pass to the loadSchemaById method of PDFEditor.
	 *
	 * Notice that this callback is run with the 'this' context being the PDFEditor object.
	 *
	 * @example
	 * editor.loadReportById('my schema', function(){
	 * 		alert(this.viewer.schemaId+' has been loaded');
	 * });
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#loadSchemaById
	 *
	 */
	 
	 /**
	 * @name LoadSchemaByIdFailCallback
	 * @function
	 * @description The callback function to pass to the loadSchemaById method of PDFEditor
	 *		to handle failure.
	 *
	 * Notice that this callback is run with the 'this' context being the PDFEditor object.
	 *
	 * @param {String} msg The error message.
	 *
	 * @example
	 * editor.loadSchemaById('my schema', 
	 *		function(){
	 * 			alert(this.viewer.schemaId+' has been loaded');
	 * 		},
	 *		function(msg){
	 *			alert('An error occurred trying to load: '+msg);
	 *		}
	 *	);
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#loadSchemaById
	 *
	 */
	 
	
	/**
	 * @function
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @name loadSchemaById
	 *
	 * @description Loads a report by an ID.  The ID is dependent on the container (i.e.
	 *	only the container needs to understand the id.
	 *
	 * @param {String} id The ID of the report to load.
	 * @param {LoadSchemaByIdCallback} callback A callback function to be called when the report is successfully loaded.
	 * @param {LoadSchemaByIdFailCallback} failCallback A callback function to be called upon failure.
	 * @returns {void}
	 */
	function PDFEditor_loadSchemaById(id, callback, failCallback){
		if ( typeof(callback) == 'undefined' ) callback = function(){};
		if ( typeof(failCallback) == 'undefined' ) failCallback = function(){};
		var editor = this;
		editor.container.loadSchema({
		
			id: id,
			callback: function(params){
				
				if ( params.code == 200 ){
					var tempSchema = new DataSchema();
					tempSchema.unserialize(params.serializedSchema);
					editor.setDataSchema(tempSchema);
					//editor.getSchemaBrowser().update();
					callback.call(editor);
					
				} else {
					failCallback.call(editor, params);
				}
			}
		});
	}
	
	/**
	 * @name save
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 * @description Saves the contents of the editor.  If the current report is already 
	 * 	saved then it will just silently save.  Otherwise it will open a dialog
	 *  and allow the user to enter details of the save.
	 *
	 * @param {xataface.modules.pdfreports.ReportContainer.SaveCallback} callback Callback function to be called on success.
	 * @param {xataface.modules.pdfreports.ReportContainer.SaveCallback} failCallback Callback function to be called on failure.
	 */
	function PDFEditor_save(callback, failCallback){
		if ( typeof(callback) == 'undefined' ) callback = function(){};
		if ( typeof(failCallback) == 'undefined' ) failCallback = function(){};
		var editor = this;
		
		var params = {};
		if ( editor.viewer.reportId ){
			params.id = editor.viewer.reportId;
			params.template = $('<div>').append(editor.viewer.serialize()).html();
		}
		params.version = editor.editVersion;
		
		params.callback = function(res){
						
			if ( !res || !res.id || res.error){
				failCallback.call(editor, res);
				return;
			}
			
			if ( !editor.viewer.reportId ) editor.viewer.reportId = res.id;
			if ( !editor.viewer.name ) editor.viewer.name = res.name || 'Untitled Report';
			editor.saveVersion = res.version;
			
			editor.lastSave = new Date();
			editor.update();
			callback.call(editor, res);
			
		};
		editor.container.save(params);
	
	}
	
	/**
	 * @description Sets the schema that is used for editing this report.
	 * @name setDataSchema
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 * @param {xataface.modules.pdfreports.DataSchema} schema The Schema to set.
	 * @returns {void}
	 */
	function PDFEditor_setDataSchema(/*DataSchema*/ schema){
	
		if ( schema != this.dataSchema ){
			this.dataSchema = schema;
			this.getSchemaBrowser().schema = this.dataSchema;
			this.getSchemaBrowser().update();
			
			
			$(this).trigger('dataSchemaUpdated');
		}
	}
	
	function installDialog(/**PDFEditor*/ editor, /**PageElement*/ pel){
		pel.showDialog = function(){
			var propertiesPanel = editor.getPageElementPanel();
			propertiesPanel.pageElement = pel;
			propertiesPanel.update();
			
			var dlg = $('<div></div>')
				.append(propertiesPanel.el)
				.dialog({
					title: 'Element Properties'
				});
				
		};
		
	}
	
	
	/**
	 * @description Creates a new page element for this report.
	 * @name newPageElement
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 * 
	 * @param {Object} o The configuration parameters.  @see xataface.modules.pdfreports.PageElement for available options.
	 * @param {Function} type The (optional) constructor for the type of PageElemnet that shoudl be built.
	 * @returns {xataface.modules.pdfreports.PageElement} The page element built  and ready to add.
	 */
	function PDFEditor_newPageElement(/*Object*/ o, /*Function*/ type){
		var viewer = this.viewer;
		var pel = viewer.newPageElement(o, type);
		var editor = this;
		installDialog(editor, pel);
		
		
		//$(pel.el).append('<div class="preview-content"></div><div class="edit-content">Double Click To Set Field</div>');
		return pel;
	
	}
	
	/**
	 * @description Creates a new portal to be added to the editor.
	 * @name newPortal
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 * @param {Object} The parameters to pass to the page element.
	 *
	 * @returns {xataface.modules.pdfreports.Portal} The portal ready to be added.
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#newPageElement
	 */
	function PDFEditor_newPortal(/*Object*/ o){
		return this.newPageElement(o, pdfeditor.Portal);
	}
	
	
	
	/**
	 * @description Gets the schema browser panel that should be used
	 * to select fields for editing this report.
	 *
	 * @name getSchemaBrowser
	 * @memberOf xataface.modules.pdfreports.ui.SchemaBrowser
	 * @function
	 *
	 * @returns {xataface.modules.pdfreports.ui.SchemaBrowser}
	 */
	function PDFEditor_getSchemaBrowser(){
		var editor = this;
		
		 if ( this.schemaBrowser == null ){
		 	this.schemaBrowser = new SchemaBrowser({
		 		schema: this.dataSchema,
		 		showFields: true,
		 		showSchemas: true,
		 		showFunctions: false
		 	});
		 	
		 	$(this.schemaBrowser)
		 		/**
		 		 * Handle event when a schema is dropped somewhere
		 		 */
		 		.bind('schemaDropped.SchemaBrowser', function(e,d){
					// If the schema we're dropping is a field or a function,
					// we'll drop a regular page element.
					//var editor = d.component.palette.action.editor;
					var viewer = editor.viewer;
					
					var containerEl = $(d.event.target).parents('.xf-pdfreport-Container').get(0);
					if ( !containerEl ) return;
					
					//alert(containerEl.html());
					
					var container = viewer.getCurrentPage();
					if ( $(containerEl).data('pageElementObject') ){
						container = $(containerEl).data('pageElementObject');
						
					}
					
					var opts = {
						x: (d.event.pageX-$(containerEl).offset().left)/viewer.zoom,
						y: (d.event.pageY-$(containerEl).offset().top)/viewer.zoom,
						width: 150,
						height: 24
					};
					
					if ( d.schema.isSchema ){
						$.extend(opts, {
							relationship: d.schema.getPath(),
							width: 400/viewer.zoom,
							height: 100/viewer.zoom
						});
					}
					

					var pel = editor.newPageElement(
						opts,
						d.schema.isSchema ? pdfreports.Portal : pdfreports.PageElement
					);
				
				
					pel.setText(d.schema.getMacro());
					container.addElement(pel);
					
					if ( viewer.editable ){
						// We need to add the dragging handlers to this element if in edit mode.  The easiest way
						// is to toggle editing off and on as the handlers are added on the on switch.
						viewer.setEditable(false);
						viewer.setEditable(true);
					}
					viewer.update();
		 		})
		 		.bind('schemaDropCheck.SchemaBrowser', function(e,d){
		 			if ( $(d.target).parents('div.xf-pdfreport-PagePanel').size() > 0 ){
						d.out.disallow = false;
						d.out.inside = true;
					}
		 		})
		 		;
		 	

		 }
		return this.schemaBrowser;	
	
	}

	
	
	
	/**
	 * @description Gets the panel that allows the user to edit the currently selected
	 * page element's properties.
	 * @name getPageElementPanel
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 * @returns {xataface.modules.pdfreports.ui.PageElementPropertiesPanel}
	 */
	function PDFEditor_getPageElementPanel(){
	
		if ( this.pageElementPanel == null ){
		
			this.pageElementPanel = new PageElementPropertiesPanel();
			
			
		}
		return this.pageElementPanel;
	}
	

	
	
	
	
	/**
	 * @description Creates a new action for this editor.  It doesn't yet add the action
	 * to the editor.
	 * @name newAction
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 *
	 * @param {Object} o Parameters to override properties of the action.
	 * @returns {xataface.modules.pdfreports.PDFEditor.Action}
	 *
	 * @see xataface.modules.pdfreports.PDFEditor.Action for available parameters.
	 * @see xataface.modules.pdfreports.PDFEditor#addAction
	 *
	 * @example
	 * var showComponentPaletteAction = editor.newAction({
     *		label: 'Components',
     *		category: 'tools',
     *		handler: function(){
     *			var self = this;
     *			
     *			var cp = componentPalette;
     *			cp.action = this;
     *			cp.update();
     *			
     *			var dlg = $('&lt;div&gt;&lt;/div&gt;')
     *				.append(componentPalette.el)
     *				.get(0);
     *			$(dlg).dialog();
     *			
     *		}
     *	
     *	});
     * editor.addAction(showComponentPaletteAction);
	 * 
	 */
	function PDFEditor_newAction(o){
		var newO = $.extend({}, o);
		newO.editor = this;
		return new Action(newO);
	}
	
	/**
	 * @description Creates a new menu item for this editor.  It doesn't yet add the menu item to the
	 * editor.
	 * @name newMenuItem
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 *
	 * @param {Object} o Parameters to override properties of the action.
	 * @see xataface.modules.pdfreports.PDFEditor.Action for available parameters.
	 *
	 * @returns {xataface.modules.pdfreports.PDFEditor.Action} The action for the menu item.
	 * @see xataface.modules.pdfreports.PDFEditor#newAction
	 * @see @see xataface.modules.pdfreports.PDFEditor#addAction
	 *
	 */
	function PDFEditor_newMenuItem(o){
		var newO = $.extend({}, o);
		newO.category='menus';
		return this.newAction(newO);
	}
	
	/**
	 * @description Creates a new tool for this editor.  Tools are placed on the toolbar.  It doesn't yet
	 * add the tool to the editor.
	 * @name newTool
	 * @function
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 *
	 * @param {Object} o Parameters to override properties of the action.
	 * @see xataface.modules.pdfreports.PDFEditor.Action for available parameters.
	 * @see xataface.modules.pdfreports.PDFEditor#newAction
	 * @see @see xataface.modules.pdfreports.PDFEditor#addAction
	 *
	 * @returns {xataface.modules.pdfreports.PDFEditor.Action} The action for the tool.
	 *
	 */
	function PDFEditor_newTool(o){
		var newO = $.extend({}, o);
		newO.category='tools';
		return this.newAction(newO);
	}
	
	
	/**
	 * @description Adds an action to the editor.
	 * @name addAction
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 * @param {xataface.modules.pdfreports.PDFEditor.Action} action The action to add.
	 * @throws {String} If action is not for this editor.
	 * @returns {boolean} True if the action was added successfully.  False otherwise.  It will return 
	 *	false if the action was already added to this editor too - so failure doesn't necessarily mean
	 *  complete failure.
	 * @example
	 * var showComponentPaletteAction = editor.newAction({
     *		label: 'Components',
     *		category: 'tools',
     *		handler: function(){
     *			var self = this;
     *			
     *			var cp = componentPalette;
     *			cp.action = this;
     *			cp.update();
     *			
     *			var dlg = $('&lt;div&gt;&lt;/div&gt;')
     *				.append(componentPalette.el)
     *				.get(0);
     *			$(dlg).dialog();
     *			
     *		}
     *	
     *	});
     * editor.addAction(showComponentPaletteAction);
	 *
	 * @see xataface.modules.pdfreports.PDFEditor#newAction
	 */
	function PDFEditor_addAction(/*Action*/ action){
		if ( action.editor != this ) throw new Exception("Cannot add action to this editor because it was created for a different editor.");
		var idx = this.actions.indexOf(action);
		if ( idx < 0 ){
			this.actions.push(action);
			this.updateActions = true;
			$.each(this.actions, function(){
				if ( this.subcategory ){
					this.updateSubActions = true;
				}
			});
			return true;
		} else {
			return false;
		}
	}
	
	
	/**
	 * @description Updates the editor's UI.  This should be called after making any significant changes
	 * such as adding or removing actions.
	 * @name update
	 * @function
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 *
	 * @returns {void}
	 */
	function PDFEditor_update(){
		var self = this;
		if ( this.updateActions ){
			$('ul', this.menuBar).children().detach();
			$('ul', this.toolBar).children().detach();
			this.actions.sort(function(a,b){
				if ( a.order < b.order ) return -1;
				else if ( a.order > b.order ) return 1;
				else return 0;
			});
			$.each(this.getActions('menus'), function(){
				$('ul', self.menuBar).append(
					$('<li></li>')
						.append(this.el)
				);
			});
			
			$.each(this.getActions('tools'), function(){
				$('ul', self.toolBar).append(this.wrapperEl);
				this.update();
			});
			this.updateActions = false;
		}
		$(this.titleBarLabel).text(this.viewer.name||'Untitled Report');
		if ( this.lastSave ){
			$(this.titleBarStatus).text('Last Saved '+this.lastSave);
		} else {
			$(this.titleBarStatus).text('Unsaved');
		}
		if( $(this.el).hasClass('fullscreen') ){
			$(this.el).height($(window).height());
			$(this.reportBody).height($(window).height()-56);
		}
		//this.viewer.update();
		
		
	}
	
	/**
	 * @description Removes an action from the editor.
	 * @name removeAction
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 * @param {xataface.modules.pdfreports.PDFEditor.Action} action The action to remove.
	 * @returns {boolean} True if the action was removed.  False otherwise.
	 */
	function PDFEditor_removeAction(/*Action*/ action){
		var idx = this.actions.indexOf(action);
		if ( idx < 0 ){
			return false;
		} else {
			this.actions.splice(idx,1);
			this.updateActions = true;
			$.each(this.actions, function(){
				if ( this.subcategory ){
					this.updateSubActions = true;
				}
			});
			return true;
		}
	}
	
	/**
	 * @description Gets the actions in this editor in a particular category.
	 * @name getActions
	 * @memberOf xataface.modules.pdfreports.PDFEditor#
	 * @function
	 *
	 * @param {String} category  The category of action to return.
	 * @returns {xataface.modules.pdfreports.PDFEditor.Action[]} Array of actions.
	 */
	function PDFEditor_getActions(category){
		var out = [];
		$.each(this.actions, function(){
			if ( this.category == category ) out.push(this);
		});
		return out;
	}
	
	/**
	 * Constructor for an Action
	 * @class
	 * @constructor
	 * @memberOf xataface.modules.pdfreports.PDFEditor
	 * @name Action
	 *
	 * @param {Object} o Configuration parameters.
	 * @param {PDFEditor} o.editor (optional) The editor that this action is associated with.
	 * @param {String} o.label The label for the action.
	 * @param {Function} o.handler The handler function that is called with this action is invoked.
	 * @param {String} o.description The help text for this action.
	 * @param {String} o.category The Category for this action.  This determines where the action will
	 * 		be used in the UI.  E.g. Category="menus" means it will be a menu in the menu bar.  
	 */
	function Action(o){
		this.editor = null;
		this.label = 'f';
		this.handler = function(){};
		this.description = '';
		this.category = 'tools';
		this.icon = null;
		this.selectable = false;
		this.selected = false;
		
		$.extend(this, o);
		
		this.subcategory = null;
		this.subEl = $('<ul></ul>').get(0);
		this.wrapperEl = $('<li></li>').get(0);
		var self = this;
		this.el = $('<a></a>')
			.attr('href','#')
			.text(this.label)
			.attr('title', this.description)
			.addClass('xf-pdfeditor-action')
			.addClass(this.cssClass)
			.click(function(e,d){
				if ( self.selectable ){
					if ( self.selected ){
						self.selected = false;
						$(self.el).removeClass('selected');
					} else {
						self.selected = true;
						$(self.el).addClass('selected');
					}
				}
			
				if ( typeof(self.handler) == 'function' ){
					self.handler(e,d);
				}
				
				return false;
			})
			.get(0);
		$(this.wrapperEl).append(this.el);
		this.updateSubActions = true;
		
	}
	
	
	Action.prototype.update = Action_update;
	
	
	/**
	 * @description Updates the UI for an action.  This renders any sub-actions - and updates the action's
	 * text label and title.
	 * @name update
	 * @memberOf xataface.modules.pdfreports.PDFEditor.Action#
	 * @function
	 *
	 * returns {void}
	 */
	function Action_update(){
		var self = this;
		
		$(this.el)
			.text(this.label)
			.attr('title', this.description)
			;
			
		if ( this.updateSubActions ){
			$(this.subEl).detach();
			if ( this.subcategory != null ){
				$(this.wrapperEl).append(this.subEl);
				$(this.subEl).children().detach();
				var subActions = this.editor.getActions(this.subcategory);
				if ( subActions.length > 0 ){
					$.each(subActions, function(){
						$(self.subEl).append(this.wrapperEl);
						this.update();
					});
				}
			}
			
			this.updateSubActions = false;
		}
		
	}
	
	
	
	
	
	// Individual Actions
	
	/**
	 * An action to go to the next page.
	 */
	var nextPageAction = new Action({
		label: 'Next',
		description: 'Next Page',
		category: 'tools',
		handler: function(){
			if ( this.editor.viewer.currentPage < this.editor.viewer.numPages-1 ){
				this.editor.viewer.currentPage++;
				this.editor.update();
			}
		}
	});
	
	/**
	 * An action to go to the previous page.
	 */
	var prevPageAction = new Action({
		label: 'Prev',
		description: 'Previous Page',
		category: 'tools',
		handler: function(){
			if ( this.editor.viewer.currentPage > 0 ){
				this.editor.viewer.currentPage--;
				this.editor.update();
			}
		}
	});
	
	/**
	 * An action to zoom to a particular zoom level.  This requires the additional zoom property
	 * to be set after instantiation.
	 */
	var zoomAction = new Action({
		label: 'Zoom',
		description: 'Zoom',
		category: 'view-menu-actions',
		handler: function(){
			this.editor.viewer.setZoom(this.zoom);
			this.editor.viewer.update();
			this.editor.update();
		}
	});
	
	
	var zoomInAction = new Action({
	
		label: 'Zoom In',
		description: 'Zoom In',
		category: 'tools',
		handler: function(){
			var editor = this.editor;
			this.editor.viewer.setZoom(this.editor.viewer.zoom+0.3);
			$('.xf-pdfeditor-body', this.editor.el).each(function(){
				$(editor.el).width($(editor.el).width());
				//$(this).width($(this).width()+20);
			
			});
			this.editor.viewer.update();
			this.editor.update();
		}
	});
	
	
	
	var zoomOutAction = new Action({
	
		label: 'Zoom Out',
		description: 'Zoom Out',
		category: 'tools',
		handler: function(){
			var newz = this.editor.viewer.zoom-0.3;
			if ( newz < 0 ) newz = this.editor.viewer.zoom;
			this.editor.viewer.setZoom(newz);
			this.editor.viewer.update();
			this.editor.update();
		}
	});
	
	
	PDFEditor.actions.zoomIn = zoomInAction;
	PDFEditor.actions.zoomOut = zoomOutAction;
	
	
	/**
	 * Action to zoom to 50%
	 */
	var zoomAction50 = $.extend({zoom: 0.5, label: 'Zoom 50%'}, zoomAction);
	
	/**
	 * Action to zoom to 100%
	 */
	var zoomAction100 = $.extend({zoom: 1.0, label: 'Zoom 100%'}, zoomAction);
	
	/**
	 * Action to zoom to 150%
	 */
	var zoomAction150 = $.extend({zoom: 1.5, label: 'Zoom 150%'}, zoomAction);
	
	/**
	 * Action to zoom to 200%
	 */
	var zoomAction200 = $.extend({zoom: 2.0, label: 'Zoom 200%'}, zoomAction);
	
	
	/**
	 * Action to change the background PDF for the editor.
	 */
	var changeBackgroundAction = new Action({
	
		label: 'Change Background',
		description: 'Select or upload a different PDF to use in the background of this report.',
		category: 'tools',
		handler: function(){
			var self = this;
			var dialog = new UploadDialog({
				action: this.editor.uploadUrl,
				allowedExtensions: ['pdf']
				
			});
			$(dialog).bind('uploadComplete', function(){
				self.editor.viewer.setPdfUrl(dialog.url);
				self.editor.update();
			});
			$(dialog).bind('uploadFailed', function(e, msg){
				alert('Upload failed: '+msg);
			});
			dialog.display();
		}
	});
	
	PDFEditor.actions.changeBackground = changeBackgroundAction;
	
	
	var editableToggleAction = new Action({
	
		label: 'Editable',
		category: 'tools',
		selectable: true,
		handler: function(){
			var self = this;
			self.editor.viewer.setEditable(self.selected);
		}
	});
	
	
	
	PDFEditor.actions.editable = editableToggleAction;
	
	
	
	var serializeAction = new Action({
	
		label: 'Serialize',
		category: 'tools',
		handler: function(){
			var self = this;
			alert($(self.editor.viewer.serialize()).clone().wrap('<div>').parent().html());
		}
	});
	
	PDFEditor.actions.serialize = serializeAction;
	
	/**
	 * An action to preview the report output given the current state of the template.
	 */
	var previewAction = new Action({
		label: 'Preview',
		category: 'tools',
		handler: function(){
			this.editor.preview();
			
		}
	});
	
	PDFEditor.actions.preview = previewAction;
	
	/**
	 * Action to show the component palette - a palette to drop page elements, and other components
	 * onto the report template.
	 */
	var showComponentPaletteAction = new Action({
		label: 'Components',
		category: 'tools',
		handler: function(){
			var self = this;
			
			var cp = componentPalette;
			cp.action = this;
			cp.update();
			
			var dlg = $('<div></div>')
				.append(componentPalette.el)
				.get(0);
			$(dlg).dialog();
			
		}
	
	});
	PDFEditor.actions.showComponentPalette = showComponentPaletteAction;
	

	var loadReportAction = new Action({
	
		label: 'Open...',
		category: 'tools',
		handler: function(){
		
			var self = this;
			this.editor.loadReportById(0);
			/*
			this.editor.container.load({
			
				callback: function(params){
					
					if ( params.code == 200 ){
						
						//self.editor.viewer = new ReportViewer();

						self.editor.viewer.unserialize(params.serializedReport);
						
						self.editor.viewer.update();
						
						// We also need to reload the schema.
						
						
						self.editor.container.loadSchema({
						
							id: self.editor.viewer.schemaId,
							callback: function(params){
							
								// handle the callback from loading the schema.

								var tempSchema = new DataSchema();
								tempSchema.unserialize(params.serializedSchema);
								self.editor.setDataSchema(tempSchema);
								
							}
						});
						
						
						
					} else {
						alert(params.error);
					}
				}
			});
			*/
		}
	});
	PDFEditor.actions.loadReport = loadReportAction;
	
	
	var settingsAction = new Action({
	
	
		label: 'Report Properties',
		category: 'tools',
		handler: function(){
			var self = this;
			this.editor.container.settingsDialog({
			
				callback: function(res){
				
					if ( res.schemaId != self.editor.viewer.schemaId ){
						self.editor.loadSchemaById(res.schemaId);
					}
					
					self.editor.viewer.setPdfUrl(res.pdfUrl);
					self.editor.viewer.update();
				},
				id: self.editor.viewer.reportId
			});
		}
	});
	PDFEditor.actions.settingsAction = settingsAction;
	
	
	var saveAction = new Action({
	
		label: 'Save',
		category: 'tools',
		handler: function(){
			var self = this;
			this.editor.save();
		}
	});
	
	PDFEditor.actions.save = saveAction;
	
	
	
	/**
	 * Action to show the component palette - a palette to drop page elements, and other components
	 * onto the report template.
	 */
	var showSchemaBrowserAction = new Action({
		label: 'Schema',
		category: 'tools',
		handler: function(){
			var self = this;
			if ( self.editor.dataSchema == null ){
				alert('There is no schema loaded yet.');
			}
			/*
			var schema = new DataSchema();
			schema.add(new DataSchema({
				isField: true,
				name: 'testfield',
				label: 'Test Field'
			}));
			
			var phones = new DataSchema({
				isSchema: true,
				name: 'phones',
				label: 'Phones'
			});
			
			schema.add(phones);
			
			phones.add(new DataSchema({
				isField: true,
				name: 'location',
				label: 'Location'
			}));
			phones.add(new DataSchema({
				isField: true,
				name: 'number',
				label: 'Number'
			}));
			
			
			this.editor.setDataSchema(schema);
			*/
			var panel = this.editor.getSchemaBrowser();
			
			
			panel.update();
			
			var dlg = $('<div></div>')
				.append(panel.el)
				.get(0);
			$(dlg).dialog();
			
		}
	
	});
	PDFEditor.actions.showSchemaBrowser = showSchemaBrowserAction;
	
	
	
	/**
	 * Create the Component Palette
	 */
	var componentPalette = new ComponentPalette({
		title: ''
	});
	
	/**
	 * Component for adding text to the report.
	 */
	var staticFieldComponent = componentPalette.newComponent({
		title: 'Add database field as static text',
		icon: XATAFACE_MODULES_PDFREPORTS_URL+'/images/static_field_component_icon.png'
	});
	
	
	/**
	 * Event fired when the component is dropped onto the canvas.
	 */
	$(staticFieldComponent).bind('componentDropped', function(e,d){
	
		var editor = d.component.palette.action.editor;
		var viewer = editor.viewer;
		var pel = editor.newPageElement({
			x: (d.event.pageX-$(viewer.el).offset().left)/viewer.zoom,
			y: (d.event.pageY-$(viewer.el).offset().top)/viewer.zoom,
			width: 150,
			height: 24
		});
		
		//pel.update();
		viewer.getCurrentPage().addElement(pel);
		if ( viewer.editable ){
			// We need to add the dragging handlers to this element if in edit mode.  The easiest way
			// is to toggle editing off and on as the handlers are added on the on switch.
			viewer.setEditable(false);
			viewer.setEditable(true);
		}
		viewer.update();
		//alert(d.event.pageX+','+d.event.pageY+' vs '+$(viewer.el).offset().left+','+$(viewer.el).offset().top);
	});
	
	
	
	componentPalette.addComponent(staticFieldComponent);
	
	// END STATIC FIELD COMPONENT
	
	
	
	
	function newPortal(/*PDFReport*/viewer, /*Object*/ o){
		
		return viewer.newPortal(o);
	}
	
	
	var portalComponent = componentPalette.newComponent({
		title: 'Add a portal to show related records on the report.',
		icon: XATAFACE_MODULES_PDFREPORTS_URL+'/images/portal_component_icon.png'
	});
	
	$(portalComponent).bind('componentDropped', function(e,d){
		var editor = d.component.palette.action.editor;
		var viewer = editor.viewer;
		var portal = newPortal(viewer, {
			x: (d.event.pageX-$(viewer.el).offset().left)/viewer.zoom,
			y: (d.event.pageY-$(viewer.el).offset().top)/viewer.zoom,
			width: 400,
			height: 200
		
		});
		
		
		portal.showDialog = function(){
			var panel = new PortalPropertiesPanel({
				portal: portal,
				relationships: editor.relationships
				
			});
			
			panel.update();
			
			var dlg = $('<div>')
				.append(panel.el)
				.dialog({
					title: 'Portal Properties'
				});
				
				
		};
	});
	
	
	
	
	
	
	
	
	
	
	

})();