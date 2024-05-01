//require <jquery.packed.js>
//require <xataface/modules/group_permissions/GroupPermissions.js>
(function(){
    var $ = jQuery;
    var GroupPermissions = xataface.modules.group_permissions.GroupPermissions;
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.ActivateGroupPermissionsPanel = ActivateGroupPermissionsPanel;
    
    /**
     * @class
     * @memberOf xataface.modules.group_permissions.components
     * @description A panel that explains to the user that group permissions
     * are not yet activated for the current table.  It contains a button that 
     * the user can click to activate permissions.  Upon completion it will trigger
     * the "groupPermissionsActivated" event, or the "error" event if there is 
     * a problem.
     * 
     * <p>This is set up to be used by the actions.manage_record.js class (which
     * is part of the group_permissions_manage_record action. It draws its UI
     * elements from the manage_record.html template.</p>
     * @param {Object} o Contructor parameters.
     * @param {String} o.table The name of the table to be activated by this panel.
     * @param {HTMLElement} o.el The HTMLElement (optional).  If omitted it will simply use
     *  the <div> with ID "RecordRolesErrorPanel" from the manage_record.html template.
     */
    function ActivateGroupPermissionsPanel(/*Object*/ o){
        var self = this;
        
        /**
         * The name of the table that this panel works with.
         * @type String
         */
        this.table = o.table;
        
        /**
         * The <div> tag that wraps this panel.
         * @type HTMLElement
         */
        this.el = o.el || $('#RecordRolesErrorPanel').get(0);
        
        /**
         * The <button> tag that the user should click to initiate activation.
         * @type HTMLElement
         */
        this.activateButton = $('#activate-group-permissions', this.el).get(0);
        
        // Add the click handler to the activate button.  This will initiate 
        // activation and, upon return, it will cause the ActivateGroupPermissionPanel
        // object to trigger a groupPermissionsActivated event.
        $(this.activateButton).click(function(){
            GroupPermissions.getInstance().ready(function(){
                this.activateGroupPermissionsForTable({
                    table : self.table,
                    callback : function(res){
                        if ( res && res.code >= 200 && res.code < 300 ){
                            $(self).trigger('groupPermissionsActivated');
                        } else {
                            $(self).trigger('error', res);
                        }
                    }
                });
            });
        });
    }
    
    (function(){
        $.extend(ActivateGroupPermissionsPanel.prototype, {
            show : show,
            hide : hide
        });
        
        /**
         * @function 
         * @description Shows the panel.
         * @memberOf xataface.modules.group_permissions.components.ActivateGroupPermissionsPanel#
         * @returns {void}
         */
        function show(){
            $(this.el).show();
        }
        
        /**
         * @function 
         * @description Hides the panel.
         * @memberOf xataface.modules.group_permissions.components.ActivateGroupPermissionsPanel#
         * @returns {void}
         */
        function hide(){
            $(this.el).hide();
        }
        
        /**
         * @event
         * @name groupPermissionsActivated
         * @memberOf xataface.modules.group_permissions.components.ActivateGroupPermissionsPanel#
         * @description Triggered when group permissions are activated.
         */
        
        /**
         * @event
         * @name error
         * @memberOf xataface.modules.group_permissions.components.ActivateGroupPermissionsPanel#
         * @description Triggered when an error occurs.
         * @param {int} e.code The error code.
         * @param {String} e.message The error message.
         */
    })();
})();

