//require <jquery.packed.js>
//require <colorpicker/colorpicker.js>
//require-css <xataface/modules/pdfreports/ui/PageElementPropertiesPanel.css>
(function(){

	var $ = jQuery;

	if ( typeof(xataface) == 'undefined' ) xataface = {};
	if ( typeof(xataface.modules) == 'undefined') xataface.modules ={};
	if ( typeof(xataface.modules.pdfreports) == 'undefined' ) xataface.modules.pdfreports = {};
	if ( typeof(xataface.modules.pdfreports.ui) == 'undefined' ) xataface.modules.pdfreports.ui = {};
	
	xataface.modules.pdfreports.ui.PageElementPropertiesPanel = PageElementPropertiesPanel;
	
	
	/**
	 * @class
	 * @name PageElementPropertiesPanel
	 * @memberOf xataface.modules.pdfreports.ui
	 *
	 * @description The PageElementPropertiesPanel class encapsulates a properties panel that allows the 
	 * user to edit a page element.
	 *
	 * @property {xataface.modules.pdfreports.PageElement} pageElement  The PageElement subject of this object.
	 * @property {HTMLElement} el The DOM element that displays this panel.
	 * @event {Object} contentChanged Fired when the content field is changed by the user.
	 * @event {Object} fontSizeChanged Fired when a different font size is selected.
	 * @event {Object} fontFaceChanged Fired when a different font family is selected.
	 * @event {Object} italicChanged Fired when the italic setting is changed.
	 * @event {Object} boldChanged Fired when the bold setting is changed.
	 * @event {Object} underlineChanged Fired when the underline setting is changed.
	 *
	 * @method update Updates the UI to reflect the current page element.
	 *
	 * @example
	 *
	 * var panel = new PageElementPropertiesPanel({pageElement: el});
	 * // put it in a dialog
	 * var dlg = $('<div></div>').append(panel.el).dialog();
	 *
	 * // assign a different page element to edit and update the dialog
	 * panel.pageElement = otherPageElement;
	 * panel.update();
	 * 
	 * // Add binding to be notified when content changes
	 * $(panel).bind('contentChanged', function(){
	 *     alert('The content was changed to '+$(this.contentEditor).val());
	 * });
	 *
	 */
	function PageElementPropertiesPanel(/*Object*/ o){
		if ( typeof(o) == 'undefined' ) o = {};
		this.pageElement = null;
		
		this.el = $('<div></div>').get(0);
		this.contentEditor = $('<textarea></textarea>').get(0);
		this.fontSizeSelector = $('<select></select>').get(0);
		this.fontFaceSelector = $('<select></select>').get(0);
		this.boldToggle = $('<input type="checkbox"/>').get(0);
		this.italicToggle = $('<input type="checkbox"/>').get(0);
		this.underlineToggle = $('<input type="checkbox"/>').get(0);
		this.fieldSelectorButton = $('<a href="#"></a>').get(0);
		this.template = @@(xataface/modules/pdfreports/ui/PageElementPropertiesPanel.tpl.html);
		
	
		
		
		$.extend(this,o);
		
		$(this.el)
			.addClass('xf-PageElementPropertiesPanel')
			;
			
		$(this.contentEl)
			.addClass('xf-PageElementPropertiesPanel-contentEditor')
			;
			
		$(this.fontSizeSelector)
			.addClass('xf-PageElementPropertiesPanel-fontSizeSelector')
			;
			
		$(this.fontFaceSelector)
			.addClass('xf-PageElementPropertiesPanel-fontFaceSelector')
			;
			
		$(this.boldToggle)
			.attr('id', 'bold')
			.addClass('xf-PageElementPropertiesPanel-boldToggle')
			;
		
		$(this.italicToggle)
			.attr('id', 'italic')
			.addClass('xf-PageElementPropertiesPanel-italicToggle')
			;
			
		$(this.underlineToggle)
			.attr('id', 'underline')
			.addClass('xf-PageElementPropertiesPanel-underlineToggle')
			;
		
		$(this.fieldSelectorButton)
			.addClass('xf-PageElementPropertiesPanel-fieldSelectorButton')
			;
			
			
		this.leftBtn = null;
		this.centerBtn = null;
		this.rightBtn = null;
		
			
		this.initComponents();
			
			
		
		
	}
	
	
	PageElementPropertiesPanel.prototype.initComponents = initComponents;
	PageElementPropertiesPanel.prototype.update = update;
	
	function initComponents(){
		var self = this;
		$(this.el).html(this.template);
		
		
		this.leftBtn = $('button.left', this.el);
		this.centerBtn = $('button.center', this.el);
		this.rightBtn = $('button.right', this.el);
		
		$('.textAlign button', this.el).click(function(){
			if ( !$(this).hasClass('selected') ){
				$('.textAlign button', self.el).removeClass('selected');
				$(this).addClass('selected');
				self.pageElement.textAlign = $(this).attr('data-xf-text-align');
				self.pageElement.update();
			} else {
				// do nothing
			}
		});
		
		
		$(this.contentEditor)
			.change(function(){
				
				$(self.pageElement.contentEl).text($(this).val());
				$(self.pageElement).trigger('contentChanged');
				$(self).trigger('contentChanged');
				
				self.pageElement.update();
			
			});
		
		$('.contentEditor', this.el)
			
			.append(this.contentEditor);
		
		for ( var i=0; i< 100; i++){
			$(this.fontSizeSelector).append($('<option></option>').val(i).text(i));
		}
		$(this.fontSizeSelector)
			.change(function(){
				try {
					self.pageElement.fontSize = parseInt($(this).val());
					$(self.pageElement).trigger('fontSizeChanged');
					
					$(self).trigger('fontSizeChanged');
					
					self.pageElement.update();
				} catch (e){
					$(this).val(self.pageElement.fontSize);
				}
			
			});
			
		$('.fontSizeSelector', this.el).append(this.fontSizeSelector);
		
		
		$.each(['courier','helvetica','times'], function(key,val){
			$(self.fontFaceSelector).append($('<option></option>').val(val).text(val));
		});
		
		$(this.fontFaceSelector)
			.change(function(){
				self.pageElement.fontFamily = $(this).val();
				
				$(self.pageElement).trigger('fontFamilyChanged');
				$(self).trigger('fontFaceChanged');
				self.pageElement.update();
				
			});
		
		$('.fontFaceSelector', this.el).append(this.fontFaceSelector);
		
		$(this.boldToggle)
			.click(function(){
				if ( $(this).is(':checked') ){
					self.pageElement.isBold = true;
				} else {
					self.pageElement.isBold = false;
				}
				
				$(self.pageElement).trigger('boldChanged');
				$(self).trigger('boldChanged');
				self.pageElement.update();
				
			});
		
		$('.boldToggle', this.el).append(this.boldToggle);
		
		
		$(this.italicToggle)
			.click(function(){
				if ( $(this).is(':checked') ){
					self.pageElement.isItalic = true;
				} else {
					self.pageElement.isItalic = false;
				}
				
				$(self.pageElement).trigger('italicChanged');
				$(self).trigger('italicChanged');
				self.pageElement.update();
				
			});
		
		$('.italicToggle', this.el).append(this.italicToggle);
		
		$(this.underlineToggle)
			.click(function(){
				if ( $(this).is(':checked') ){
					self.pageElement.isUnderlined = true;
				} else {
					self.pageElement.isUnderlined = false;
				}
				
				$(self.pageElement).trigger('underlineChanged');
				$(self).trigger('underlineChanged');
				self.pageElement.update();
				
			});
		$('.underlineToggle', this.el).append(this.underlineToggle);
		
		
		$('.fieldSelectorButton', this.el).append(this.fieldSelectorButton);
		
		
		$('.foreground-color, .background-color', this.el)
			.ColorPicker({
				onSubmit: function(hsb, hex, rgb, el) {
					$(el).val(hex);
					$(el).ColorPickerHide();
					if ( $(el).hasClass('foreground-color') ){
						self.pageElement.color = '#'+hex;
					} else if ( $(el).hasClass('background-color') ){
						self.pageElement.backgroundColor = '#'+hex;
					}
					
				},
				onBeforeShow: function () {
					$(this).ColorPickerSetColor(this.value);
				}
			})
			.bind('keyup', function(){
				$(this).ColorPickerSetColor(this.value);
			})
			.change(function(){
				var col = $(this).val();
				
				if ( $(this).hasClass('foreground-color') ){
					if ( col ){
						self.pageElement.color = '#'+col;
					} else {
						self.pageElement.color = 'black';
					}
				} else if ( $(this).hasClass('background-color') ){
					//alert("setting background");
					if ( col ){
						self.pageElement.backgroundColor = '#'+col;
					} else {
						self.pageElement.backgroundColor = 'transparent';
					}
				}
				self.pageElement.update();
			});
	
		
		
	}
	
	/**
	 * Sets the checked status of a checkbox.
	 *
	 * @param {HTMLElement} checkbox The checkbox to select/deselect.
	 * @param {boolean} checked Whether to check it or deselect it.
	 */
	function setCheckbox(/*HTMLElement*/ checkbox, /*boolean*/ checked){
		if ( !checked ){
			$(checkbox).removeAttr('checked');
		} else {
			$(checkbox).attr('checked','checked');
		}
	}
	
	/**
	 * Updates the UI
	 */
	function update(){
	
		if ( this.pageElement ){
			$('input, textarea, button', this.el).removeAttr('disabled');
			setCheckbox( this.italicToggle, this.pageElement.isItalic);
			setCheckbox( this.boldToggle, this.pageElement.isBold);
			setCheckbox( this.underlineToggle, this.pageElement.isUnderlined);
			$('.textAlign button', this.el).removeClass('selected');
			$('.textAlign button.'+this.pageElement.textAlign, this.el).addClass('selected');
			
			$(this.fontSizeSelector).val(this.pageElement.fontSize);
			$(this.fontFaceSelector).val(this.pageElement.fontFamily);
			$(this.contentEditor).val($(this.pageElement.contentEl).text());
			if ( this.pageElement.color != 'black' ){
				$('.foreground-color', this.el).val(this.pageElement.color.substr(1));
			} else {
				$('.foreground-color', this.el).val('');
			}
			
			if ( this.pageElement.backgroundColor != 'transparent' ){
				$('.background-color', this.el).val(this.pageElement.backgroundColor.substr(1));
				
			} else {
				$('.background-color', this.el).val('');
			}
			
		} else {
			$('input, textarea, button', this.el).attr('disabled', 1);
			setCheckbox( this.italicToggle, false);
			setCheckbox( this.boldToggle, false);
			setCheckbox( this.underlineToggle, false);
			$(this.contentEditor).val('');
			
		}
	}
	
	
	
	
	
	
	
	
})();