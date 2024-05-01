/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//require <xataface/modules/uitk/components/UITable.js>
(function(){
    var $ = jQuery;
    var UITable = xataface.modules.uitk.components.UITable;
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.AddUserRoleForm = AddUserRoleForm;
    
    /**
     * @class
     * @name AddUserRoleForm
     * @description A form to add users to a record's privileged user list.  It
     * provides the user with a form to select a username from a filterable list
     * and specify a role to assign to the user.
     * 
     * <p>This is used by the ManageRecordRolesPanel class to handle cases where
     * additional users need to be added.</p>
     * 
     * @memberOf xataface.modules.group_permissions.components
     * @param {Object} o Parameters
     * @param {HTMLElement} o.el The <div> tag that wraps the form.  Leave this 
     * empty to use the default <div> tag defined by the 'add-user-form' class
     * in the manage_record.html template.
     * @param {String} o.usersTableName The name of the users table.  This is used
     * to load the users for the select lookup.
     * @param {String} o.usernameColumn The name of the column in the users table
     * that stores the username of the user.
     * @param {Array} o.roles An array of role names that can be selected for a 
     * user.
     */
    function AddUserRoleForm(/*Object*/ o){
        var self = this;
        
        /**
         * The <div> tag that wraps the form.
         * @type HTMLElement
         */
        this.el = o.el || $('.add-user-form').get(0);
        
        /**
         * The name of the users table.
         * @type String
         */
        this.usersTableName = o.usersTableName;
        
        /**
         * The name of the username column in the users table.
         * @type String
         */
        this.usernameColumn = o.usernameColumn;
        
        /**
         * An array of names of roles that can be selected when adding users to 
         * the form.
         * @type String[]
         */
        this.roles = o.roles;
        
        /**
         * The UI table with a list of users that can be added.  Users are added
         * by selecting a username in this table then clicking the "Add User" button.
         * @type xataface.modules.uitk.components.UITable
         */
        this.usersTable = new UITable({
            tableName : this.usersTableName,
            columns : [
                {
                    name : this.usernameColumn,
                    label : 'Username'
                }
            ]
        });
        
        $('.users-list-wrapper', this.el).append(this.usersTable.el);
        
        /**
         * The <select> tag with options to select a role.  Used when adding users
         * .
         * @type HTMLElement
         */
        this.roleList = $('.role-list', this.el).get(0);
        
        
        /**
         * The <button> tag that the user clicks to add the currently selected
         * users.
         * @type HTMLElement
         */
        this.addUserButton = $('.add-user-button', this.el).get(0);
        
        /**
         * Click handler for the add user button.  Fires a usersSelected trigger
         * on the AddUserRoleForm object so that the object owner can handle the
         * event.
         */
        $(this.addUserButton).click(function(){
            var listModel = self.usersTable.model;
            if ( listModel.selected && listModel.selected.length > 0 ){
                $(self).trigger('usersSelected', {
                        users : listModel.selected,
                        role : $(self.roleList).val()
                });
            }
        });
        
        
        
    }
    
    /*
     * Public Methods:----------------------------------------------------------     
     */
    (function(){
        $.extend(AddUserRoleForm.prototype, {
            refresh : refresh
        });
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.AddUserRoleForm#
         * @description Refreshes the users list and updates the roles select list.
         * @returns {void}
         */
        function refresh(){
            this.usersTable.refresh();
            
            var options = $();
            $(this.roles).each(function(k,v){
                options = options.add($('<option>').attr('value', v).text(v));
            });
            $(this.roleList)
                    .empty()
                    .append(options);
            
        }
    })();
})();

