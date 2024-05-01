//require <xataface/modules/pdfreports/pdfrenderer.js>
//require-css <xataface/modules/pdfreports/PDFReport.css>
//require <xatajax.core.js>
/**
 * @scope xataface.modules.reports
 */
(function(){

	// A flag used for instantiating classes for prototypical inheritance.
	// We only set this true to instantiate a class that will be used
	// as a prototype.
	var initialize = false;
	
	var $ = jQuery;
	/**
	 * @name xataface.modules.pdfreports
	 * @namespace
	 */
	var pdfreports = XataJax.load('window.xataface.modules.pdfreports');
	pdfreports.ReportViewer = ReportViewer;
	pdfreports.PagePanel = PagePanel;
	pdfreports.PageElement = PageElement;
	pdfreports.Portal = Portal;



	var PDFDocument = pdfreports.PDFDocument;
	var PDFPage = pdfreports.PDFPage;

	/**
	 * Constructor for a report viewer.
	 * @class Encapsulates a PDF report.
	 * @constructor
	 * @memberOf xataface.modules.pdfreports
	 * @name ReportViewer
	 * @param {float} o.width The width of the viewer in pixels.
	 * @param {float} o.height The height of the viewer in pixels.
	 * @param {float} o.zoom The zoom of the PDF (this will cause the width and height to be multiplied
	 *		by this factor.
	 * @param {int} o.currentPage The page number of the current page to view.  (0 is the first page).
	 * @param {String} o.pdfUrl The URL to the PDF that is used as a background for this report.
	 *
	 * @property {String} pdfUrl The URL to the PDF that this report is build upon.
	 * @property {float} zoom The Zoom factor for viewing the report.
	 * @property {HTMLElement} el The HTML DOM element that houses the report.
	 * @property {float} width The width of the report
	 * @property {float} height The height of the report
	 * @property {int} currentPage The current page of the report in view.
	 * @property {boolean} editable Whether the report is in editable mode or not.
	 * @property {int} numPages The number of pages of this report.  This is read only.  It will be calculated based on the PDF that is loaded.
	 * @property {String} reportId The ID of the report (for loading purposes).  Only needs to make sense to the container.
	 * @property {String} schemaId The ID of the schema for this report.  Only needs to make sense to the container.
	 *
	 * 
	 */
	function ReportViewer(/**Object*/o) {
		if ( typeof(o) == 'undefined' ) o = {};
		this.pdfUrl = null;
		this.pages = [];
		this.zoom = 1.0;
		this.el = $('<div></div>')
			.addClass('xf-pdfreport-ReportViewer');
			
		
		this.width = 72.0*8.5;
		this.height = 72.0*11.0;
		
		this.currentPage = 0;
		this.editable = false;
		this.schemaId = null;
		this.reportId = null;
		this.name = null;
		
		$.extend(this, o);
		
		this.numPages = 0;
		this.updatePdfUrl = true;
		this.updatePages = true;
		
		
		
		
	}
	
	
	ReportViewer.prototype.setZoom = ReportViewer_setZoom;
	
	
	ReportViewer.prototype.update = ReportViewer_update;
	ReportViewer.prototype.newPage = ReportViewer_newPage;
	ReportViewer.prototype.addPage = ReportViewer_addPage;
	ReportViewer.prototype.removePage = ReportViewer_removePage;
	ReportViewer.prototype.setWidth = ReportViewer_setWidth;
	ReportViewer.prototype.setHeight = ReportViewer_setHeight;
	ReportViewer.prototype.setPdfUrl = ReportViewer_setPdfUrl;
	ReportViewer.prototype.getCurrentPage = ReportViewer_getCurrentPage;
	ReportViewer.prototype.setEditable = ReportViewer_setEditable;
	ReportViewer.prototype.getPageElements = ReportViewer_getPageElements;
	ReportViewer.prototype.getSelectedElements = ReportViewer_getSelectedElements;
	ReportViewer.prototype.serialize = ReportViewer_serialize;
	ReportViewer.prototype.unserialize = ReportViewer_unserialize;
	ReportViewer.prototype.getPageElementConstructor = ReportViewer_getPageElementConstructor;
	ReportViewer.prototype.newPageElement = ReportViewer_newPageElement;
	ReportViewer.prototype.newPortal = ReportViewer_newPortal;
	
	
	/**
	 * @description Creates a new page element for this report.
	 *
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @name newPageElement
	 * @function
	 * @see xataface.modules.pdfreports.PageElement For rull parameter descriptions.
	 * @param {Function} type The constructor for the type of page element to build.
	 * @returns {xataface.modules.pdfreport.PageElement} The page element for this report.
	 * 
	 */
	function ReportViewer_newPageElement(/*Object*/ o, /*Function*/ type){
		if ( typeof(o) == 'undefined' ){
			o = {};
		}	
		if ( typeof(type) == 'undefined' ) type = PageElement;
		var newO = $.extend({}, o);
		newO.reportViewer = this;
		return new type(newO);
	
	}
	
	/**
	 * @description Creates a new Portal for this report.
	 * @name newPortal
	 * @function 
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @see xataface.modules.pdfreports.Portal for information on the allowed input parameters.
	 * @returns {xataface.modules.pdfreport.Portal} The portal that was built.
	 */
	function ReportViewer_newPortal(/*Object*/ o){
		return this.newPageElement(o, Portal);
	}


	/**
	 * @description Obtains the constructor for the PageElement that is defined by
	 * the given DOM element.  This DOM element is in a format produced by PageElement#serialize
	 * @function 
	 * @param {HTMLElement} el The HTML element that was serialized.
	 * @returns {Function} The constructor for the type of page element.
	 * 
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @name getPageElementConstructor
	 */
	function ReportViewer_getPageElementConstructor(/*HTMLElement*/ el){
		if ( $(el).hasClass('xf-ReportViewer-Portal') ) return Portal;
		else return PageElement;
		
	}
	/**
	 * @description Serializes the Report as an HTML data structure, maintaining all information
	 * so that it can be reloaded at a later date.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name serialize
	 *
	 * @return {HTMLElement} The DOMElement that contains all of the data.
	 * @see xataface.modules.pdfreports.ReportViewer#unserialize
	 */
	function ReportViewer_serialize(){
		
		var self = this;
		var pre = 'data-xf-reportviewer-';
		var reportViewerDiv = $('<div></div>')
			.addClass('xf-ReportViewer')
			.get(0);
		$.each(['pdfUrl', 'width', 'height', 'schemaId', 'reportId', 'name'], function(){
			$(reportViewerDiv).attr(pre+this, self[this]);
		});

		$.each(this.pages, function(){
		
			$(reportViewerDiv).append(this.serialize());
		});
		
		
		$(this).trigger('afterSerialize.ReportViewer', {out:reportViewerDiv});
		return reportViewerDiv;
		
	}
	
	
	/**
	 * @description Loads report data from an HTML data structure that was exported using serialize().
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name unserialize 
	 * @param {HTMLElement} el The serialized DOM element from which the report will be unserialized.
	 * @returns {boolean} true on success
	 * @see xataface.modules.pdfreports.ReportViewer#serialize
	 */
	function ReportViewer_unserialize(/*HTMLElement*/ el){
		var self = this;
		var pre = 'data-xf-reportviewer-';
		this.setPdfUrl($(el).attr(pre+'pdfUrl'));
		this.width = parseFloat($(el).attr(pre+'width'));
		this.height = parseFloat($(el).attr(pre+'height'));
		this.schemaId = $(el).attr(pre+'schemaId');
		this.reportId = $(el).attr(pre+'reportId');
		this.name = $(el).attr(pre+'name');
		
		var pages = $.merge([], this.pages);
		$.each(pages, function(){
			self.removePage(this);
		});
		
		$(el).children('.xf-ReportViewer-PagePanel').each(function(){
			var page = self.newPage();
			page.unserialize(this);
			self.addPage(page);
		
		});
		
		this.updatePdfUrl = true;
		this.updatePages = true;
		
		$(this).trigger('afterUnserialize.ReportViewer', {'in':el});
		
		return true;
		
	}



	/**
	 * @description Gets the current page of the report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name getCurrentPage
	 * @returns {xataface.modules.pdfreports.PagePanel} The current page encapsulated.
	 */
	function ReportViewer_getCurrentPage(){
		if ( typeof(this.pages[this.currentPage]) == 'undefined' ) return null;
		return this.pages[this.currentPage];
	}
	
	/**
	 * @description Gets all of the page elements of this report as one big array.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name getPageElements
	 * @returns {xataface.modules.pdfreports.PageElement[]} All page elements in the report.
	 */
	function ReportViewer_getPageElements(){
		var out = [];
		$.each(this.pages, function(){
			$.each(this.children, function(){
				out.push(this);
				if ( this.children ){
					$.each(this.children, function(){
						out.push(this);
					});
				}
			});
		});
		return out;
	}
	
	/**
	 * @description Returns the selected page elements in this report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @name getSelectedElements
	 * @function
	 *
	 * @returns {xataface.modules.pdfreports.PageElement[]} Array of PageElement objects (possibly empty).
	 */
	function ReportViewer_getSelectedElements(){
		var out = [];
		$.each(this.getPageElements(), function(){
			if ( this.isSelected() ) out.push(this);
		});
		return out;
	}
	
	/**
	 * @description Makes the report editable.  This adds some listeners to respond to mouse events, and 
	 * displays different content than when it is in preview mode.
	 * @name setEditable
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @param {boolean} editable True if the report should be editable.  False otherwise.
	 * @returns {void}
	 */
	function ReportViewer_setEditable(/*boolean*/ e){
		var self = this;
		if ( e != this.editable ){
			this.editable = e;
			if ( e ){
				/*
				 * If this has been made editable, then we need to apply some extra event handlers
				 * to it.
				 */
				
				// We add the editable CSS class to change the appearance.
				$(this.el).addClass('editable');
				
				$('.xf-pdfreport-PagePanel', this.el).bind('click.editable', function(e,ui){
					if ( !e.shiftKey && !e.metaKey ){
						$('.xf-pdfreport-PageElement.selected', self.el).each(function(){
							$(this).removeClass('selected');
							$(this).trigger('elementDeselected', {event:e,ui:ui});
							$(self).trigger('selectionChanged', {event:e, ui:ui});
						});
					}
				});
				
				
				
				$('.xf-pdfreport-PageElement', this.el)
				
					// We make the element draggable
					.draggable({
						stop: function(event,ui){
							$(this).trigger('elementMoved', {event:event, ui:ui});
						
						}
					})
					
					// We make the element resizable
					.resizable({
						stop: function(event,ui){
							$(this).trigger('elementResized', {event:event, ui:ui});
						}
					})
					
					// We trigger the editableActivated event that can perform
					// some initialization in the element itself.
					.trigger('editableActivated')
					
					// We add a double click handler
					.bind('dblclick.editable', function(event,ui){
						$(this).trigger('elementDoubleClicked', {event:event,ui:ui});
						event.stopPropagation();
					})
					
					.bind('click.editable', function(event,ui){
						
						if ( !event.metaKey && !event.shiftKey ){
							$('.xf-pdfreport-PageElement.selected', self.el).not(this).removeClass('selected');
							if ( !$(this).hasClass('selected') ){
								$(this).addClass('selected');
								$(this).trigger('elementSelected', {event:event, ui:ui});
								$(self).trigger('selectionChanged', {event:e, ui:ui});
							}
						} else {
							if ( $(this).hasClass('selected') ){
								$(this).removeClass('selected');
								$(this).trigger('elementDeselected', {event:event, ui:ui});
								$(self).trigger('selectionChanged', {event:e, ui:ui});
							} else {
								$(this).addClass('selected');
								$(this).trigger('elementSelected', {event:event, ui:ui});
								$(self).trigger('selectionChanged', {event:e, ui:ui});
							}
						}
						event.stopPropagation();
						
						
					})
					
					;
				
				
			} else {
				$(this.el).removeClass('editable');
				$('.xf-pdfreport-PageElement', this.el)
					.draggable('destroy')
					.resizable('destroy')
					.trigger('editableDeactivated')
					.unbind('dblclick.editable')
					.unbind('click.editable')
					;
					
				$('.xf-pdfreport-PagePanel', this.el)
					.unbind('click.editable')
					;
			}
		}
	}
	

	
	/**
	 * @description Creates a new PagePanel that can be added to this report viewer.  NOTE: This method only
	 * creates the page panel.  It does not add it to the report.  You must pass the resulting
	 * PagePanel to the ReportViewer.addPage() method in order to add the page to the report.
	 *
	 * This is similar to creating a node for the DOM vs appending the node to the DOM.
	 *
	 * You cannot add a PagePanel that was created by a different ReportViewer to the 
	 * report viewer.
	 *
	 * @name newPage
	 * @function
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @returns {xataface.modules.pdfreports.PagePanel} The page panel that was created.
	 *
	 *  @see xataface.modules.pdfreports.ReportViewer#addPage
	 */
	function ReportViewer_newPage(){
		var panel = new PagePanel({
			reportViewer: this,
			zoom: this.zoom,
			width: this.width,
			height: this.height
			
		});
		return panel;
		
	}
	
	
	
	
	/**
	 * @description Adds a page to the report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @name addPage
	 * @function
	 * @param {xataface.modules.pdfreports.PagePanel} pagePanel The page panel to add.
	 * @param {int} pageNum The page number to add this at.  0 is the first page.
	 * @returns {void}
	 *
	 * @see xataface.modules.pdfreports.ReportViewer#newPage
	 */
	function ReportViewer_addPage(/*PagePanel*/ pagePanel, /*int*/ pageNum){
		if ( pagePanel.reportViewer != this ){
			throw "Cannot add pagepanel from a different report viewer.";
		}
		pagePanel.width = this.width;
		pagePanel.height = this.height;
		pagePanel.zoom = this.zoom;
		if ( typeof(pageNum) == 'undefined' ){
			
			this.pages.push(pagePanel);
			pageNum = this.pages.length-1;
			
		} else {
			
			this.pages[pageNum] = pagePanel;
		}
		this.updatePages = true;
		pagePanel.setPageNum(pageNum);
	}
	
	
	/**
	 * @description Removes a page from the report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name removePage
	 *
	 * @param {xataface.modules.pdfreports.PagePanel} pagePanel The pagePanel object to remove.
	 * @returns {boolean} True if the page was found and removed.  False if it wasn't found.
	 *
	 *  @see xataface.modules.pdfreports.ReportViewer#addPage
	 */
	function ReportViewer_removePage(/*PagePanel*/ pagePanel){
		var idx = this.pages.indexOf(pagePanel);
		if ( idx >= 0 ){
			this.updatePages = true;
			this.pages.splice(idx,1);
			return true;
		} 
		return false;
	}
	
	
	
	
	/**
	 * @description Sets the zoom factor of the report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name setZoom
	 * @param {float} zoom The zoom factor of the report
	 */
	function ReportViewer_setZoom(/**float*/ zoom){
		this.zoom = zoom;
		$.each(this.pages, function(){
			this.setZoom(zoom);
		});
	}
	
	/**
	 * @description Sets the height of this report.
	 * @name setHeight
	 * @function
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 *
	 */
	function ReportViewer_setHeight(/*float*/ h){
		this.height = h;
		$.each(this.pages, function(){
			this.setHeight(h);
		});
	}
	
	
	/**
	 * @description Sets the width of this report.
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @function
	 * @name setWidth
	 * 
	 */
	function ReportViewer_setWidth(/*float*/ w){
		this.width = w;
		$.each(this.pages, function(){
			this.setWidth(w);
		});
	}
	
	
	/**
	 * @description Sets the PDF URL.   It is best to use this method instead
	 * of setting the pdfUrl property directly so that the update() method knows
	 * to update the PDF the next time it is called.
	 * 
	 * @name setPdfUrl
	 * @function
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 *
	 * @param {String} url The URL to the PDF.
	 */
	function ReportViewer_setPdfUrl(/*String*/ url){
		if ( url != this.pdfUrl ){
			this.pdfUrl = url;
			this.updatePdfUrl = true;
		}
	}
	
	/**
	 * @description Updates the viewer view to reflect the current settings.  This should be called
	 * after making any changes to what is viewed (e.g. zoom, width, height, currentPage).
	 *
	 * @memberOf xataface.modules.pdfreports.ReportViewer#
	 * @name update
	 * @function
	 */
	function ReportViewer_update(){
		var self = this;
		this.setZoom(this.zoom);
		$(this.el).css({
			width: Math.floor(this.width*this.zoom),
			height: Math.floor(this.height*this.zoom)
		});
		
		if ( this.updatePages ){
			
			$(this.el).children('.xf-pdfreport-PagePanel').detach();
			$.each(this.pages, function(){
				$(self.el).append(this.el);
			});
			this.updatePages = false;
		
		}
		
		
		$.each(this.pages, function(){
			$(this.el).hide();
		});
		
		if ( typeof(this.pages[this.currentPage]) != 'undefined' ){

			$(this.pages[this.currentPage].el).show();
			this.pages[this.currentPage].update();
		}
		if ( this.updatePdfUrl ){
			this.updatePdfUrl = false;
			if ( this.pdfUrl ){
				var doc = new PDFDocument({
					url: this.pdfUrl
				});
				doc.load(function(){
					self.numPages = doc.numPages;
					self.setWidth(doc.baseWidth);
					self.setHeight(doc.baseHeight);
					for ( var i=0; i<self.numPages; i++){
						
						var pg = self.pages[i];
						if ( !pg ){
							pg = self.newPage();


							self.addPage(pg, i);
						}

					}
					if ( self.numPages > 0 ){
						self.update();
						$(self).trigger('pdfLoaded');
					}
				});
			} else {
				this.numPages = 0;
			}
			
		}
	}
	
	

	/**
	 * @description Constructor for a page panel.  You shouldn't use this constructor directly.
	 * It is better to use PDFReport.newPage()
	 *
	 * @memberOf xataface.modules.pdfreports
	 * @class
	 * @constructor
	 *
	 * @param {float} o.zoom The zoom of this page.
	 * @param {float} o.width The width of the page.
	 * @param {float} o.height The height of the page.
	 * @param {int} o.pageNum The page number that this page occupies within the report.
	 *
	 * @property {HTMLElement} el The DOM element that contains the view of this PagePanel.
	 * @property {xataface.modules.pdfreports.ReportViewer} reportViewer Reference to the report viewer that houses this page.
	 * @property {float} width The width of the page. (read only)
	 * @property {float} height The height of the page. (read only)
	 * @property {int} pageNum The page number of the page.  (read only)
	 * @property {HTMLElement} backgroundImage The img tag that contained the PDF backdrop.
	 *
	 *
	 */
	function PagePanel(/* Object */o){
		if ( initialize ) return;
		if ( typeof(o) == 'undefined' ) o = {};
		this.reportViewer = null;
		this.zoom = 1.0;
		this.backgroundImage = $('<img/>')
			.addClass('xf-pdfreport-PagePanel-background')
			.get(0);
			
		
		this.el = $('<div></div>')
			.addClass('xf-pdfreport-PagePanel')
			.addClass('xf-pdfreport-Container')
			.attr('tabindex', -1)
			;
			
	
			
		$(this.el).append(this.backgroundImage);
			
		this.children = [];
		
		this.width = 72.0*8.5;
		this.height = 72.0*11.0;
		this.pageNum = 0;
		$.extend(this, o);
		
		for ( var i=0; i<this.children.length; i++){
			this.children[i] = new PageElement(this.children[i]);
		}
		
		
		this.backgroundRequiresUpdate = true;

	
	}
	
	
	PagePanel.prototype.update = PagePanel_update;
	PagePanel.prototype.addElement = PagePanel_addElement;
	PagePanel.prototype.removeElement = PagePanel_removeElement;
	PagePanel.prototype.setZoom = PagePanel_setZoom;
	PagePanel.prototype.setWidth = PagePanel_setWidth;
	PagePanel.prototype.setHeight = PagePanel_setHeight;
	PagePanel.prototype.setPageNum = PagePanel_setPageNum;
	PagePanel.prototype.serialize = PagePanel_serialize;
	PagePanel.prototype.unserialize = PagePanel_unserialize;
	
	/**
	 * @name afterSerialize
	 * @description Event fired after a PagePanel has been serialized.
	 *
	 * @event
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @param {jQuery.Event} jQuery event object
	 * @param {Object} data The event data.
	 * @param {HTMLElement} data.out The DOM element that was serialized.
	 *
	 * @see <a href="http://api.jquery.com/category/events/event-object/"> Description of the jQuery 
	 *	event object.</a>
	 *
	 */
	
	
	/**
	 * @description Serializes the page to a DOM element for export or persistence.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name serialize
	 * @function
	 *
	 * @returns {HTMLElement} The DOM element that contains all of the information necessary
	 * 	to rebuild this PagePanel.
	 * 
	 * @see xataface.modules.pdfreports.ReportViewer#serialize
	 * @see xataface.modules.pdfreports.PagePanel#unserialize
	 */
	function PagePanel_serialize(){
		var pre = 'data-xf-reportviewer-';
		var out = $('<div></div>')
			.addClass('xf-ReportViewer-PagePanel')
			.attr({
				
			
				
			})
			.get(0);
		
		$.each(this.children, function(){
			$(out).append(this.serialize());
		});
		$(this).trigger('afterSerialize.PagePanel', {out:out});
		return out;
	}
	
	/**
	 * @description Unserializes the page from a DOM element that was serialized previously.
	 *
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name unserialize
	 * @function
	 *
	 * @param {HTMLElement} el The DOM element that contains all of the information necessary
	 * 	to rebuild this PagePanel.
	 * 
	 * @see xataface.modules.pdfreports.ReportViewer#unserialize
	 * @see xataface.modules.pdfreports.PagePanel#serialize
	 */
	function PagePanel_unserialize(/*HTMLElement*/ el){
		var self = this;
		var pre = 'data-xf-reportviewer-';
		var children = $.merge([], this.children);
		$.each(children, function(){
			self.removeElement(this);
		});
		
		$(el).children('.xf-ReportViewer-PageElement').each(function(){
			
			var pel = self
				.reportViewer
					.newPageElement(
						{}, 
						self
							.reportViewer
							.getPageElementConstructor(this)
					);
			pel.page = self;
			
			pel.unserialize(this);
			
			self.addElement(pel);
			
			
		});
		$(this).trigger('afterUnserialize.PagePanel', {'in':el});
		
	}
	
	/**
	 * @name afterUnserialize
	 * @description Event fired after a PagePanel has been unserialized.
	 *
	 * @event
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @param {jQuery.Event} jQuery event object
	 * @param {Object} data The event data.
	 * @param {HTMLElement} data.in The DOM element that it was loaded from.
	 *
	 * @see <a href="http://api.jquery.com/category/events/event-object/"> Description of the jQuery 
	 *	event object.</a>
	 *
	 */
	
	
	/**
	 * @description Sets the page number of this page.  This will flag the page
	 * to update the background image the next time update() is called.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @function
	 * @name setPageNum
	 *
	 * @param {int} pageNum The page number of the PDF that this page represents. (zero based)
	 * @returns {void}
	 */
	function PagePanel_setPageNum(/*int*/ pageNum){
		if ( pageNum != this.pageNum ){
			this.pageNum = pageNum;
			this.backgroundRequiresUpdate = true;
		}
	}
	
	/**
	 * @description Sets the zoom factor of this page.  Changes will be visible the next
	 * time update() is called.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @function
	 * @name setZoom
	 * @param {float} zoom
	 * @returns {void}
	 */
	function PagePanel_setZoom(/*float*/ zoom){
		if ( zoom != this.zoom ){
			this.zoom = zoom;
			this.backgroundRequiresUpdate = true;
		}
	}
	
	/**
	 * @description Gets the zoom factor of this page.  Changes will be visible the next
	 * time update() is called.
	 * 
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @function
	 * @name getZoom
	 * @returns {float} The zoom factor of the page.
	 */
	function PagePanel_getZoom(){
		return this.zoom;
	
	}
	
	
	/**
	 * @description Sets the width of the page.  Changes will be visible the next time update()
	 * is called.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name setWidth
	 * @function
	 * @returns {void}
	 */
	function PagePanel_setWidth(/*float*/ w){
		if ( w != this.width ){
			this.width = w;
			this.backgroundRequiresUpdate = true;
		}
	}
	
	/**
	 * @description Sets the height of the page.  Changes will be visible the next time update()
	 * is called.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name setHeight
	 * @function
	 * 
	 * @param {float} h The height
	 * @returns {void}
	 */
	function PagePanel_setHeight(/*float*/ h){
		if ( h != this.height ){
			this.height = h;
			this.backgroundRequiresUpdate = true;
		}
	}
	
	
	/**
	 * @description Updates the view of the page.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name update
	 * @function
	 * @returns {void}
	 */
	function PagePanel_update(){
		var self = this;
		if ( this.backgroundRequiresUpdate ){
			
			var pdfPage = new PDFPage({
				url: this.reportViewer.pdfUrl,
				el: this.backgroundImage,
				width: this.width*this.zoom,
				page: this.pageNum
			});
			
			pdfPage.render();
			this.backgroundRequiresUpdate = false;
		}
		
		$(this.el).css({
			width: this.width,
			height: this.height
		});
		
		
		
		$.each(this.children, function(){
		
			this.update();

			
			
			
		});
	}
	
	
	/**
	 * @description Adds a page element to the page.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name addElement
	 * @function
	 * 
	 * @param {xataface.modules.pdfreports.PageElement} pe  The element to add.  This should have been created
	 *	by the report's newPageElement or newPortal method.
	 * @returns {boolean} True if the element was added.  False otherwise.
	 */
	function PagePanel_addElement(/**PageElement*/ pe){
		var index = this.children.indexOf(pe);
		if ( index < 0 ){
			
			if ( pe.page != null ){
				if ( pe.parent != null ){
					pe.parent.removeElement(pe);
				} else {
					pe.page.removeElement(pe);
				}
					// this may throw an exception to cancel the add
					
				
			}
			pe.page = this;
			this.children.push(pe);
			pe.zIndex = this.children.length-1;
			
			$(this.el).append(pe.el);
			return true;
			
		} else {
			return false;
		}
	}
	
	/**
	 * @description Removes a page element from the page.
	 * @memberOf xataface.modules.pdfreports.PagePanel#
	 * @name removeElement
	 * @function
	 * 
	 * @param {xataface.modules.pdfreports.PageElement} pe The page element to remove.
	 * @returns {boolean} True if the element was removed. False otherwise.
	 */
	function PagePanel_removeElement(/*PageElement*/ pe){
	
		var index = this.children.indexOf(pe);
		if ( index >= 0 ){
			this.children.splice(index,1);
			pe.page = null;
			pe.parent = null;
			$(pe.el).detach();
			return true;
		} else {
			return false;
		}
	}
	
	
	
	/**
	 * @class
	 * @name PageElement
	 * @memberOf xataface.modules.pdfreports
	 * @constructor
	 *
	 * @description Encapsulates a page element that can be added to a page of a report.
	 *
	 * @property {xataface.modules.pdfreports.ReportViewer} reportViewer The report that this element is part of.
	 * @property {xataface.modules.pdfreports.PagePanel} page The page that this element
	 *		currently resides on.
	 * @property {float} x The x position of the element on the page (or parent).
	 * @property {float} y The y position of the element on the page (or parent).
	 * @property {float} width The width of the element.
	 * @property {float} height The height of the element.
	 * @property {HTMLElement} el The DOM element that serves as the view for the element.
	 * @property {HTMLElement} contentEl The DOM element into which content is drawn.
	 * @property {float} fontSize The font size of text in this element (in pixels).
	 * @property {String} fontFamily The font family for text in this element.
	 * @property {float} lineHeight The line height of text.  (in em)
	 * @property {boolean} isBold Whether the text should be bold.
	 * @property {boolean} isItalic Whether the text should be italic.
	 * @property {boolean} isUnderlined Whether the text should be underlined.
	 * @property {float} zIndex The z-index of this element.
	 *
	 */
	function PageElement(/* Object */o){
		if (initialize) return;
		this.reportViewer = null;
		this.page = null;
		this.x = 0.0;
		this.y = 0.0;
		this.textAlign = 'left';
		this.color = 'black';
		this.backgroundColor = 'transparent';
		
		this.width = 72.0;
		this.height = 36.0;
		var self = this;
		
		this.el = $('<div></div>')
			.attr('tabindex', -1)
			.addClass('xf-pdfreport-PageElement')
			
			/*
			 * Event fired when element is finished being moved by a drag
			 */
			.bind('elementMoved', function(e, d){
				
				self.x = parseFloat($(this).css('left'))/self.page.zoom;
				self.y = parseFloat($(this).css('top'))/self.page.zoom;

			})
			
			/*
			 * Event fired when the element is finished resizing.
			 */
			.bind('elementResized', function(e,d){
				self.width = parseFloat($(this).css('width'))/self.page.zoom;
				self.height = parseFloat($(this).css('height'))/self.page.zoom;
			})
			
			/*
			 * Event fired when the element is made active (when edit mode is entered)
			 */
			.bind('editableActivated', function(e,d){
				//alert(self.x+','+self.y+' - '+$(this).css('left')+','+$(this).css('top'));
				$(this).css('position', 'absolute'); // this is necessary to fix a bug
					// with ui.draggable.  It seemed to change the position to relative.  boooo
				//self.update();
			})
			
			/*
			 * Event that is fired when the element is double clicked.
			 * This will call the showDialog() method of the element if
			 * it is defined.
			 */
			.bind('elementDoubleClicked', function(e,d){
				if ( typeof(self.showDialog) == 'function' ){
					self.showDialog();
					e.stopPropagation();
				}
			})
			
			.bind('elementSelected', function(e,d){
				//alert('focused');
				this.focus();
				e.stopPropagation();
			})
			.keydown(function(e){
				if ( e.keyCode == 8 || e.keyCode == 46 ){
					try {
						$.each(self.reportViewer.getSelectedElements(), function(){
							if ( this.parent ) this.parent.removeElement(this);
							else if ( this.page ) this.page.removeElement(this);
							
						});
					} catch (e){
						try {
							console.log(e);
						} catch (e){}
					}
				
					e.preventDefault();
				} else if ( e.keyCode == 37 /* Left arrow */ ){
					$.each(self.reportViewer.getSelectedElements(), function(){
						this.x -= 1.0;
						this.update();
					});
					e.preventDefault();
					$(this).focus();
					return false;
				} else if ( e.keyCode == 38 /* Up arrow */ ){
					$.each(self.reportViewer.getSelectedElements(), function(){
						this.y -= 1.0;
						this.update();
					});
					e.preventDefault();
					$(this).focus();
					return false;
				} else if ( e.keyCode == 39 /* Right arrow */ ){
					$.each(self.reportViewer.getSelectedElements(), function(){
						this.x += 1.0;
						this.update();
					});
					e.preventDefault();
					$(this).focus();
					return false;
				} else if ( e.keyCode == 40 /*Down arrow */ ){
					$.each(self.reportViewer.getSelectedElements(), function(){
						this.y += 1.0;
						this.update();
					});
					e.preventDefault();
					$(this).focus();
					return false;
				}
			})
			
			
		;
		
		
		this.contentEl = $('<div>')
			.addClass('xf-pdfreport-PageElement-contentEl')
			.get(0);
		$(this.el).append(this.contentEl);
		
		$(this.el).data('pageElementObject', this);
		this.fontSize = 12.0;
		this.fontFamily = 'helvetica';
		this.lineHeight = 1.4;
		this.isBold = false;
		this.isItalic = false;
		this.isUnderlined = false;
		this.content = '';
		
		this.zIndex = 0;
		
		$.extend(this, o);
	
	}
	
	
	PageElement.prototype.update = PageElement_update;
	PageElement.prototype.setX = PageElement_setX;
	PageElement.prototype.setY = PageElement_setY;
	PageElement.prototype.setWidth = PageElement_setWidth;
	PageElement.prototype.setHeight = PageElement_setHeight;
	PageElement.prototype.setSelected = PageElement_setSelected;
	PageElement.prototype.isSelected = PageElement_isSelected;
	PageElement.prototype.serialize = PageElement_serialize;
	PageElement.prototype.unserialize = PageElement_unserialize;
	PageElement.prototype.setText = PageElement_setText;
	PageElement.prototype.getText = PageElement_getText;
	PageElement.serializableFields = ['x','y','width','height','fontSize','fontFamily','lineHeight','isItalic','isUnderlined','isBold','zIndex','textAlign','color', 'backgroundColor'];
	PageElement.serializePrefix = 'data-xf-reportviewer-pageelement-';
	
	
	/**
	 * @description Serializes the PageElement to a DOM element that can be exported or saved.
	 * @name serialize
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 *
	 * @function
	 *
	 * @returns {HTMLElement} The serialized version of this page element as a DOM element.
	 * @see xataface.modules.pdfreports.PageElement#unserialize
	 * @see xataface.modules.pdfreports.PagePanel#serialize
	 * @see xataface.modules.pdfreports.ReportViewer#serialize
	 */
	function PageElement_serialize(){
		var self = this;
		var pre = PageElement.serializePrefix;
		
		var out = $('<div></div>')
			.addClass('xf-ReportViewer-PageElement')
			.get(0);
		
		$.each(PageElement.serializableFields, function(){
			$(out).attr(pre+this, self[this]);
		});
		var contentPanel = $('<div>')
			.addClass('xf-ReportViewer-PageElement-contentEl')
			.html($(this.contentEl).html())
			.get(0);
		$(out).append(contentPanel);
		//$(out).html($(this.el).html());
		$(this).trigger('afterSerialize.PageElement', {out:out});
		return out;
			
		
	}
	
	/**
	 * @name afterSerialize
	 * @description Event fired after a PageElement has been serialized.
	 *
	 * @event
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @param {jQuery.Event} jQuery event object
	 * @param {Object} data The event data.
	 * @param {HTMLElement} data.out The DOM element that was serialized.
	 *
	 * @see <a href="http://api.jquery.com/category/events/event-object/"> Description of the jQuery 
	 *	event object.</a>
	 *
	 */
	
	
	/**
	 * @description Unserializes the page element based on a serialized version.
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @name unserialize
	 * @function
	 *
	 * @param {HTMLElement} el The serialized version of this element.
	 *
	 * @see xataface.modules.pdfreports.PageElement#afterUnserialize
	 *
	 */
	function PageElement_unserialize(/*HTMLElement*/ el){
	
		var pre = PageElement.serializePrefix;
		this.x = parseFloat($(el).attr(pre+'x')||0);
		this.y = parseFloat($(el).attr(pre+'y')||0);
		this.width = parseFloat($(el).attr(pre+'width')||100);
		this.height = parseFloat($(el).attr(pre+'height')||25);
		this.fontSize = parseFloat($(el).attr(pre+'fontSize')||12);
		this.fontFamily = $(el).attr(pre+'fontFamily')||'helvetica';
		this.lineHeight = parseFloat($(el).attr(pre+'lineHeight')||1.4);
		this.isItalic = ($(el).attr(pre+'isItalic')=='true')?true:false;
		this.isBold = ($(el).attr(pre+'isBold')=='true')?true:false;
		this.isUnderlined = ($(el).attr(pre+'isUnderlined')=='true')?true:false;
		this.zIndex = parseInt($(el).attr(pre+'zIndex')||0);
		this.backgroundColor = $(el).attr(pre+'backgroundColor')||'transparent';
		this.color = $(el).attr(pre+'color') || 'black';
		this.textAlign = $(el).attr(pre+'textAlign') || 'left';
		
		$(this.contentEl).html($(el).children('.xf-ReportViewer-PageElement-contentEl').html());
		
		
		$(this).trigger('afterUnserialize.PageElement', {'in':el});
		// Todo finish this method.
	
	}
	
	
	/**
	 * @name afterUnserialize
	 * @description Event fired after a PageElement has been unserialized.
	 *
	 * @event
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @param {jQuery.Event} jQuery event object
	 * @param {Object} data The event data.
	 * @param {HTMLElement} data.in The DOM element that was unserialized from.
	 *
	 * @see <a href="http://api.jquery.com/category/events/event-object/"> Description of the jQuery 
	 *	event object.</a>
	 *
	 */
	
	
	/**
	 * @description Sets the text to appear in this element directly.
	 * @name setText
	 * @function
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @param {String} txt The text to be set.  HTML will be encoded.
	 */
	function PageElement_setText(txt){
		$(this.contentEl).text(txt);
	}
	
	/**
	 * @description Gets the text that is appearing in the element.
	 * @name getText
	 * @function
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @returns {String} The text currently displayed in the page element.
	 */
	function PageElement_getText(){
		return $(this.contentEl).text();
	}
	
	
	/**
	 * @description Updates the view of this page element according to its properties.
	 * @name update
	 * @function
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * 
	 * @returns {void}
	 */
	function PageElement_update(){
	
		
		$(this.el).css({
			left: this.x*this.page.zoom,
			top: this.y*this.page.zoom,
			width: this.width*this.page.zoom,
			height: this.height*this.page.zoom,
			'font-size': this.fontSize*this.page.zoom,
			'font-family': this.fontFamily,
			'font-weight': this.isBold ? 'bold':'normal',
			'font-style': this.isItalic ? 'italic':'normal',
			'text-decoration': this.isUnderlined ? 'underline':'none',
			'background-color' : this.backgroundColor || 'transparent',
			'z-index': this.zIndex,
			'text-align': this.textAlign,
			'color': this.color
		});
	}
	
	
	/**
	 * @description Checks if the element is currently selected.
	 * @name isSelected
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 *
	 * @returns {boolean} True if the element is currently selected.
	 */
	function PageElement_isSelected(){
		return $(this.el).hasClass('selected');
	}
	
	/**
	 * @description Sets the selected status of the element.
	 * 
	 * @name setSelected
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 * 
	 * @param {boolean} s True if the element should be selected.  False otherwise.
	 * @returns {void}
	 */
	function PageElement_setSelected(s){
		if ( s ){
			$(this.el).addClass('selected');
		} else {
			$(this.el).removeClass('selected');
		}
	}
	
	
	/**
	 * @description Sets the x position of the element with respect to the page
	 * or its parent element.
	 *
	 * @name setX
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 *
	 * @param {float} x The x position
	 * @returns {void}
	 */
	function PageElement_setX(x){
		if ( x != this.x ) this.x = x;
	}
	
	/**
	 * @description Sets the y position of the element with respect to the page
	 * or its parent element.
	 *
	 * @name setY
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 *
	 * @param {float} y The y position
	 * @returns {void}
	 */
	function PageElement_setY(y){
		if ( y != this.y ) this.y = y;
	}
	
	
	/**
	 * @description Sets the width of the element.
	 * @name setWidth
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 *
	 * @param {float} w The width
	 * @returns {void}
	 */
	function PageElement_setWidth(w){
		if ( w != this.width ) this.width = w;
	}
	
	
	/**
	 * @description Sets the height of the element
	 * @name setHeight
	 * @memberOf xataface.modules.pdfreports.PageElement#
	 * @function
	 * @param {float} h
	 * @returns {void}
	 */
	function PageElement_setHeight(h){
		if ( h != this.height ) this.height = h;
	}
	
	
	
	
	/**
	 * @description A special type of page element that can contain other page
	 * elements.
	 *
	 * @class
	 * @constructor
	 * @memberOf xataface.modules.pdfreports
	 * @extends xataface.modules.pdfreports.PageElement
	 *
	 */
	function Portal(/*Object*/ o){
		if ( initialize ) return;
		PageElement.prototype.constructor.call(this, o);
		this.childrenPane = $('<div>')
			.addClass('xf-pdfreport-Portal-childrenPane')
			
			;
		
		
		
		$(this.el)
			.addClass('xf-pdfreport-Container')
			.append(this.childrenPane);
		
		this.children = [];
		
		//$.extend(this, o);  -- No need for this because PageElement's constructor 
		// handled it.
	}
	
	// Perform necessary work to allow Portal to extend
	// PageElement
	initialize = true;
	Portal.prototype = new PageElement();
	initialize = false;
	
	$.extend(Portal.prototype, {
		
			update: Portal_update,
			serialize: Portal_serialize,
			unserialize: Portal_unserialize,
			addElement: Portal_addElement,
			removeElement: Portal_removeElement
		
	});
	
	
	Portal.prototype.constructor = Portal;
	
	// End Portal inheritance stuff.
	
	/**
	 * @description Updates the UI for the element.  This will recursively 
	 * update the children of this element if a child has 
	 * been added or removed.
	 *
	 * @name update
	 * @memberOf xataface.modules.pdfreports.Portal#
	 * @function
	 *
	 * @returns {void}
	 */
	function Portal_update(){
		// Call the super class's update method.
		PageElement.prototype.update.call(this);
		$(this.childrenPane).css({
			height: this.height*this.page.zoom,
			width: this.width*this.page.zoom
		});
		$.each(this.children, function(){
			
			this.update();
			
		});
		
		
	}
	
	/**
	 * @description Serializes the portal to a DOM element.  This extends the 
	 * serialization for the PageElement class and adds serialization
	 * for the child elements.
	 *
	 * @memberOf xataface.modules.pdfreports.Portal#
	 * @name serialize
	 * @function
	 *
	 * @returns {HTMLElement} dom element serialized. 
	 */
	function Portal_serialize(){
		// Call the superclass's serialize() method.
		var out = PageElement.prototype.serialize.call(this);
		$(out).addClass('xf-ReportViewer-Portal');
		var outContentPane = $('<ul>')
			.addClass('xf-ReportViewer-Portal-childrenPane')
			.append($('<li>'))
			;
		if ( this.relationship ) $(outContentPane).attr('relationship', this.relationship);
		$(out).append(outContentPane);
		$.each(this.children, function(){
			$(outContentPane).children('li').append(this.serialize());
		});
		return out;
	}
	
	/**
	 * @description Unserializes a dom element into a Portal record.
	 *
	 * @memberOf xataface.modules.pdfreports.Portal#
	 * @name unserialize
	 * @function
	 *
	 * @param {HTMLElement} el The HTML element that is a serialization
	 * of this element.
	 * @returns {void}
	 *
	 */
	function Portal_unserialize(/*HTMLElement*/ el){
		// Call the superclass's unserialize() method.
		PageElement.prototype.unserialize.call(this, el);
		var self = this;
		$(this.childrenPane).children().detach();
		$.each(this.children, function(){
			self.removeElement(this);
		});
		$(el).children('.xf-ReportViewer-Portal-childrenPane').children('li').children('.xf-ReportViewer-PageElement').each(function(){
			var pe = self.reportViewer.newPageElement({}, self.reportViewer.getPageElementConstructor(this));
			pe.page = self.page;
			pe.parent = self;
			pe.unserialize(this);
			self.addElement(pe);
		});
		this.relationship = $(el).children('.xf-ReportViewer-Portal-childrenPane').attr('relationship');
		
		$(this).trigger('afterUnserialize.Portal', {'in':el});
		
		
	}
	
	/**
	 * @description Adds a child element ot the portal.
	 * @name addElement
	 * @memberOf xataface.modules.pdfreports.Portal#
	 * @function
	 * @param {xataface.modules.pdfreports.PageElement} pe The element to add.
	 * @returns {boolean} True if the element was added.  False otherwise.
	 */
	function Portal_addElement(/*PageElement*/ pe){
		var index = this.children.indexOf(pe);
		if ( index < 0 ){
			
			if ( pe.page != null ){
				
				if ( pe.parent != null ){
					pe.parent.removeElement(pe);
				} else {
					pe.page.removeElement(pe);
				}
					// this may throw an exception to cancel the add
					
				
			}
			pe.page = this.page;
			pe.parent = this;
			this.children.push(pe);
			pe.zIndex = this.children.length-1;
			
			$(this.childrenPane).append(pe.el);
			return true;
			
		} else {
			return false;
		}
	}
	
	
	/**
	 * @description Removes a child element from the portal.
	 * @name removeElement
	 * @memberOf xataface.modules.pdfreports.Portal#
	 * @function
	 * @param {xataface.modules.pdfreports.PageElement} pe The page element to remove.
	 * @returns {boolean} True if the element was removed.  False otherwise.
	 */
	function Portal_removeElement(/*PageElement*/ pe){
	
		var index = this.children.indexOf(pe);
		if ( index >= 0 ){
			this.children.splice(index,1);
			pe.page = null;
			pe.parent = null;
			$(pe.el).detach();
			return true;
		} else {
			return false;
		}
	}
	
	
	
	
	
	
	
	
	
	

	
	

})();