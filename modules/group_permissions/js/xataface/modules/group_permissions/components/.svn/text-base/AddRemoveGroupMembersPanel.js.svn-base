/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <xataface/modules/uitk/components/UITable.js>
//require <xataface/modules/uitk/components/UIForm.js>
(function(){
    var $ = jQuery;
    var UITable = xataface.modules.uitk.components.UITable;
    var UIForm = xataface.modules.uitk.components.UIForm;
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.AddRemoveGroupMembersPanel = AddRemoveGroupMembersPanel;
    
    /**
     * @class
     * @name AddRemoveGroupMembersPanel
     * @memberOf xataface.modules.group_permissions.components
     * 
     * @description A panel to allow adding and removing members from a group.
     * 
     * Note:  This component is designed to operate specifically on the the 
     * add-members-panel div in the xataface/modules/group_permissions/actions/manage_groups.html
     * template. If that template isn't in the DOM, this will fail.
     * 
     * @param {Object} o Settings
     * @param {HTMLElement} o.el The HTML Element that this class will decorate.
     * @param {Object} o.group The group that this panel will add and remove
     *  items for.
     * @param {Integer} o.group.group_id The group id.
     * @param {String} o.usersTableName The name of the users table in the app.
     * @param {String} o.usernameColumn The name of the column of the users table
     *  that stores the username.
     * 
     * @returns {xataface.modules.group_permissions.components.AddRemoveGroupMembersPanel}
     */
    function AddRemoveGroupMembersPanel(/*Object*/ o){
        
        /**
         * The element that is to be decorated by this panel.
         * @type {HTMLElement}
         */
        this.el = o.el;
        
        /**
         * 
         * @type {Object} The group (with property group_id) that is being edited.
         */
        this.group = o.group;
        
        /**
         * The name of the users table.
         * @type {String}
         */
        this.usersTableName = o.usersTableName;
        
        /**
         * The username column name.
         * @type {String}
         */
        this.usernameColumn = o.usernameColumn;
        
        
        /**
         * The UITable that shows the users in the system.
         * @type {xataface.modules.uitk.components.UITable}
         */
        this.usersTable = new UITable({
            tableName : this.usersTableName,
            columns : [
                {
                    name : this.usernameColumn,
                    label : 'Username'
                }
            ],
            fixedHeaders : true,
            height : '250px',
            width : '150px'
        });
        
        this.usersTable.registerSearchField($('input.user-search', this.el).get(0), this.usernameColumn);
        
        /**
         * The UITable that shows the members currently in this group.
         * @type {xataface.modules.uitk.components.UITable}
         */
        this.membersTable = new UITable({
            tableName : 'xataface__group_members',
            columns : [
                {
                    name : 'username',
                    label : 'Username'
                },
                {
                    name : 'role',
                    label : 'Role'
                }
            ],
            fixedHeaders : true,
            height : '250px',
            width : '150px'
        });
        
        this.membersTable.registerSearchField($('input.members-search', this.el).get(0), 'username');
        
        var groupId = 0;
        if ( this.group && this.group.group_id ){
            groupId = this.group.group_id;
        }
        this.membersTable.resultSet.query.group_id = '='+groupId;
        
        /**
         * The form to edit the "Role" of selected members.
         * @type {xataface.modules.uitk.components.UIForm}
         */
        this.memberForm = new UIForm({
            table : 'xataface__group_members',
            fields : ['role'],
            query : {
                group_id : groupId
            },
            showHeadings : false
        });
        
        // Link the member form to the members table so that it will be updated
        // when different members are selected.
        this.memberForm.startObservingTable(this.membersTable, { 
            username : 'username'
        });
        
        /**
         * The button to add users as members.
         * @type {HTMLElement} 
         */
        this.addMembersButton = $('button.add-user-button', this.el).get(0);
        
        /**
         * The button to remove members from the group.
         * @type {HTMLElement}
         */
        this.removeMembersButton = $('button.remove-user-button', this.el).get(0);
        
        
        // Add click handlers for the buttons.
        $(this.addMembersButton).click(this.addSelectedMembers.bind(this));
        $(this.removeMembersButton).click(this.removeSelectedMembers.bind(this));
        
        // Add components into the HTML template
        $('div.users-list-wrapper', this.el).append(this.usersTable.el);
        this.usersTable.refresh();
        
        $('div.members-list-wrapper', this.el).append(this.membersTable.el);
        this.membersTable.refresh();
        this.membersTable.update();
        
        $(this.memberForm.el).css({
           'border' : 'none',
           'height' : '300px',
           'width' : '200px'
        });
        
        $('div.edit-group-member-wrapper', this.el).append(this.memberForm.el);
        
        
    }
    
    (function(){
        $.extend(AddRemoveGroupMembersPanel.prototype, {
            addSelectedMembers : addSelectedMembers,
            removeSelectedMembers : removeSelectedMembers,
            refresh : refresh
        });
        
        /**
         * @function
         * @name addSelectedMembers
         * @memberOf xataface.modules.group_permissions.components.AddRemoveGroupMembersPanel#
         * @description Adds the currently selected users (in the users table) to be members
         * of the group.  Members are added with the MEMBER role by default.  The user can
         * then change members to different roles individually if desired.
         * 
         * This will trigger a 'message' event with a string message on success.  If it fails
         * it will trigger an 'error' event with {code: xxx, message: yyyy}.
         * 
         * @returns {void}
         */
        function addSelectedMembers(){
            console.log("here");
            var self = this;
            var selected = this.usersTable.model.selected;
            if ( selected.length === 0 ){
                $(this).trigger('error', {
                    code : 500,
                    message : 'No users currently selected'
                });
                return;
            }
            
            var usernames = [];
            $(selected).each(function(k,v){
                usernames.push(v.username);
            });
            
            var selectedStr = usernames.join('\n');
            
            var q = {
                '-action' : 'group_permissions_group_add_members',
                '--usernames' : selectedStr,
                '--role' : 'MEMBER',
                '-table' : 'xataface__groups',
                'group_id' : '='+self.group.group_id
            };
            console.log("Adding selected members");
            $.post(DATAFACE_SITE_HREF, q, function(res){
                console.log("response");
                console.log(res);
                if ( res && res.code >= 200 && res.code < 300){
                    $(self).trigger('message', res.message);
                    self.membersTable.refresh();
                } else {
                    console.log("here");
                    $(self).trigger('error', res);
                }
            });
        }
        
        /**
         * @function
         * @name removeSelectedMembers
         * @memberOf xataface.modules.group_permissions.components.AddRemoveGroupMembersPanel#
         * 
         * @description Removes selected members from the group.  It checks the members table
         * for the selected rows, and removes these from the group.
         * 
         * If there is an error, an 'error' event will be triggered with data {code: xxx, message: yyyy}.
         * If it succeeds, it will automatically refresh the members list, and trigger a 'message'
         * event with a string message as data.
         * 
         * @returns {void}
         */
        function removeSelectedMembers(){
            var self = this;
            var selected = this.membersTable.model.selected;
            if ( selected.length === 0 ){
                $(this).trigger('error', {
                    code : 500,
                    message : 'No members currently selected'
                });
            }
            
            var usernames = [];
            $(selected).each(function(k,v){
                usernames.push(v.username);
            });
            var selectedStr = usernames.join('\n');
            
            var q = {
                '-action' : 'group_permissions_group_remove_members',
                '-table' : 'xataface__groups',
                'group_id' : '='+self.group.group_id,
                '--usernames' : selectedStr
            };
            
            $.post(DATAFACE_SITE_HREF, q, function(res){
                if ( res && res.code >= 200 && res.code < 300){
                    $(self).trigger('message', res.message);
                    self.membersTable.refresh();
                } else {
                    $(self).trigger('error', res);
                }
            });
        }
        
        function refresh(){
            var groupId = this.group ? this.group.group_id : 0;
            this.membersTable.resultSet.query.group_id = '='+groupId;
            this.memberForm.query.group_id = groupId;
            
            this.membersTable.refresh();
            this.usersTable.refresh();
        }
    })();
    
})();
