//require <jquery.packed.js>
(function(){

	var $ = jQuery;
	
	
	if ( typeof(window.xataface) == 'undefined' ) window.xataface = {};
	if ( typeof(window.xataface.modules) == 'undefined' ) window.xataface.modules = {};
	if ( typeof(window.xataface.modules.pdfreports) == 'undefined' ) window.xataface.modules.pdfreports = {};
	if ( typeof(window.xataface.modules.pdfreports.ui) == 'undefined' ) window.xataface.modules.pdfreports.ui = {};
	
	
	/**
	 * A properties panel for editing a portal's properties.
	 *
	 * @property {xataface.modules.pdfreports.Portal} portal
	 * @property {HTMLElement} el The DOM element of this panel that can be added to the dom.
	 * @property {Object} relationships An object with available relationships that can be selected.  Key/Value pairs
	 *
	 * @event {Object} relationshipChanged  Fired when the relationship selection has been changed.
	 *		Structure:
	 *			{
	 *				event: <jQuery event>
	 *				ui:    <jQuery ui object>
	 *				relationship: <String>  // The name of the relationship that it was changed to.
	 *			}
	 *
	 * @method update() Updates the UI to reflect the state of the model.
	 *
	 * @usage
	 *
	 * //Create new panel for portal
	 * var panel = new PortalPropertiesPanel({
	 *		portal: myPortal,
	 *		relationships: {'messages': 'Messages', 'duties': 'Duties'}
	 *	});
	 * panel.update();
	 */
	function PortalPropertiesPanel(/*Object*/ o){
		
		if ( typeof(o) == 'undefined' ) o = {};
		
		this.portal = null;
		this.relationships = {};
		
		this.el = $('<div></div>').get(0);
		this.relationshipSelector = $('<select>').get(0);
		this.template = @@(xataface/modules/pdfreports/ui/PortalPropertiesPanel.tpl.html);
		
		
		$.extend(this,o);
		
		
		$(this.el)
			.addClass('xf-PortalPropertiesPanel');
			
		$(this.relationshipSelector)
			.addClass('xf-PortalPropertiesPanel-relationshipSelector');
		
		this.initComponents();
		
	}
	
	PortalPropertiesPanel.prototype.initComponents = initComponents;
	PortalPropertiesPanel.prototype.update = update;
	
	/**
	 * Initializes the components when the panel is first created.
	 */
	function initComponents(){
		var self = this;
		$(this.el).html(this.template);
		
		$(this.relationshipSelector).change(function(event,ui){
			this.portal.setRelationship($(this).val());
			
			
			$(self).trigger('relationshipChanged', {event:event, ui:ui, relationship: this.portal.relationship});
			this.portal.update();
		});
		
		$('.relationshipSelector', this.el).append(this.relationshipSelector);
	}
	
	
	/**
	 * Updates the UI to reflect the latest state.  If there is no portal (i.e. portal is null)
	 * this this disables the drop-down list.  Otherwise it populates the dropdown list and selects
	 * the appropriate one.
	 */
	function update(){
	
		if ( this.portal == null ){
		
			$(this.relationshipSelector).attr('disabled', 'disabled');
			$(this.relationshipSelector).html('');
		} else {
			$(this.relationshipSelector).removeAttr('disabled');
			$.each(this.relationships, function(k,v){
				$(this.relationshipSelector).append(
					$('<option>')
						.val(k)
						.text(v)
				);
			});
			$(this.relationshipSelector).val(this.portal.relationship);
			
		
		}
	
	}
	
})();