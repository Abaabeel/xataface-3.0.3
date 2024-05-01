/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function(){
    var $ = jQuery;
    var pkg = XataJax.load('xataface.modules.group_permissions');
    pkg.GroupPermissions = GroupPermissions;
    
    /**
     * @class
     * @memberOf xataface.modules.group_permissions
     * @param {Object} o The constructor parameters
     */
    function GroupPermissions(/*Object*/ o){
        
        this.usersTable = null;
        this.usernameColumn = null;
        this.isLoading = false;
        
    }
    
    GroupPermissions.instance = null;
    
    /**
     * @function
     * @memberOf xataface.modules.group_permissions.GroupPermissions
     * @description Static method to get the default group permissions object.
     * @returns {xataface.modules.group_permissions.GroupPermissions}
     * 
     */
    function getInstance(){
        if ( GroupPermissions.instance === null ){
            GroupPermissions.instance = new GroupPermissions();
        }
        return GroupPermissions.instance;
    }
    
    GroupPermissions.getInstance = getInstance;
    
    /*
     * Public Methods: ----------------------------------------------------------
     */
    (function(){
        $.extend(GroupPermissions.prototype, {
            ready : ready,
            setRecordRoles : setRecordRoles,
            addRecordRoles : addRecordRoles,
            addRecordUserRoles : addRecordUserRoles,
            addRecordGroupRoles : addRecordGroupRoles,
            removeRecordRoles : removeRecordRoles,
            removeRecordUserRoles : removeRecordUserRoles,
            removeRecordGroupRoles : removeRecordGroupRoles,
            activateGroupPermissionsForTable : activateGroupPermissionsForTable,
            checkStatus : checkStatus
        });
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description A wrapper around the ajax request to the 
         * group_permissions_set_record_roles action.  This is used to add
         * and remove user and group roles to and from records.
         * 
         * @param {Object} p The input parameters
         * @param {String} p.op The ultimate input to the --op parameter of the 
         *  group_permissions_set_record_roles action.
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String} p.type Either 'group' or 'user'
         * @param {String[]} p.names The names (either group names or user names) 
         *      of the users/groups to which we are adding roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the users/group specified in the names parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function setRecordRoles(/*Object*/ p){
        
            var self = this;
            p.callback = p.callback || function(){};
            var q = {
                '--op' : p.op,
                '-table' : p.recordId.substr(0, p.recordId.indexOf('?')),
                '-action' : 'group_permissions_set_record_roles',
                '--type' : p.type,
                '--roles' : p.roles.join('\n'),
                '--names' : p.names.join('\n')
            };
            $.post(DATAFACE_SITE_HREF, q, function(res){
                if ( res && res.code >= 200 && res.code < 300 ){
                    p.callback.call(self, res);
                } else {
                    p.callback.call(self, res);
                    $(self).trigger('error', res);
                }
            });
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Adds a set of roles for a set of users or groups (depending
         * on the "type" parameter).
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String} p.type Either 'group' or 'user'
         * @param {String[]} p.names The names (either group names or user names) 
         *      of the users/groups to which we are adding roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the users/group specified in the names parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function addRecordRoles(/*Object*/ p){
            p.op = 'addRole';
            this.setRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Removes a set of roles for a set of users or groups (depending
         * on the "type" parameter).
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String} p.type Either 'group' or 'user'
         * @param {String[]} p.names The names (either group names or user names) 
         *      of the users/groups to which we are adding roles.
         * @param {String[]} p.roles The names of roles that are to be removed from each
         *  of the users/group specified in the names parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function removeRecordRoles(/*Object*/ p){
            p.op = 'removeRole';
            this.setRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Adds a set of roles for a set of users.  This wraps the
         * addRecordRoles() method but specifies the appropriate "type" and "names"
         * parameters.
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String[]} p.usernames The usernames of the users to which we are adding roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the users specified in the usernames parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function addRecordUserRoles(/*Object*/ p){
            p.type = 'user';
            p.names = p.usernames;
            this.addRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Removes a set of roles for a set of users.  This wraps the
         * removeRecordRoles() method but specifies the appropriate "type" and "names"
         * parameters.
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String[]} p.usernames The usernames of the users from which we are removing roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the users specified in the usernames parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function removeRecordUserRoles(/*Objects*/ p){
            p.type = 'user';
            p.names = p.usernames;
            this.removeRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Adds a set of roles for a set of groups.  This wraps the
         * addRecordRoles() method but specifies the appropriate "type" and "names"
         * parameters.
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String[]} p.groupnames The group names of the groups to which we are adding roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the users specified in the groupnames parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function addRecordGroupRoles(/*Object*/ p){
            p.type = 'group';
            p.names = p.groupnames;
            this.addRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Removes a set of roles for a set of groups.  This wraps the
         * removeRecordRoles() method but specifies the appropriate "type" and "names"
         * parameters.
         * 
         * @param {Object} p The input parameters
         * @param {String} p.recordId The record ID of the record to which roles
         * are being assigned.
         * @param {String[]} p.groupnames The names of the groups from which we are removing roles.
         * @param {String[]} p.roles The names of roles that are to be added to each
         *  of the groups specified in the groupnames parameter.
         * @param {Function} p.callback Callback function is called when adding
         *  is complete.  The parameter
         *  is expected to be an object of the following format:
         *  {
         *      code : 200
         *      message : 'Success'
         *  }
         * @returns {void}
         */
        function removeRecordGroupRoles(/*Object*/ p){
            p.type = 'group';
            p.names = p.groupnames;
            this.removeRecordRoles(p);
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Checks the status of group permissions for a specific
         *  table.
         * 
         * @param {Object} p The parameters
         * @param {String} p.table The name of the table to check.
         * @param {Function} p.callback A callback function to be called when
         * the response is received from the server.  It will take one boolean 
         * parameter indicating whether it is already activated.
         * @returns {void}
         */
        function checkStatus(/*Object*/ p){
            var self = this;
            p.callback = p.callback || function(){};
            var q = {
                '-action' : 'group_permissions_init',
                '-table' : p.table
            };
            $.post(DATAFACE_SITE_HREF, q, function(res){
                if ( res && res.code == 200 ){
                    p.callback.call(self, true);
                } else {
                    p.callback.call(self, false);
                }
            });
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Activates the group permissions for a particular table.
         * 
         * @param {Object} p The parameters
         * @param {String} p.table The name of the table to activate.
         * @param {Function} p.callback A callback function to be called when 
         *  the response is received from the server.  The response object will 
         *  have the form:
         *  {
         *      code : int
         *      message : string
         *  }
         *  where code may be:
         *    - 200 : signifies that the table was already initialized.
         *    - 201 : signifies that the table has been successfully initialized.
         *    - Anything else signifies failure.
         * @returns {void}
         */
        function activateGroupPermissionsForTable(/*Object*/p){
            var self = this;
            p.callback = p.callback || function(){};
            var q = {
                '-action' : 'group_permissions_init',
                '-table' : p.table,
                '--activate-if-disabled' : 1
            };
            $.post(DATAFACE_SITE_HREF, q, function(res){
                if ( res && res.code >= 200 && res.code < 300 ){
                    p.callback.call(self, res);
                } else {
                    $(self).trigger('error', res);
                    p.callback.call(self, res);
                }
            });
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.GroupPermissions#
         * @description Loads the necessary information to be able to process
         * group permissions (e.g. the users table name etc..), and calls the 
         * provided callback when ready.  If it is already ready, it will 
         * simply fire the callback function immediately.
         * @param {Function} callback
         * @returns {void}
         */
        function ready(callback){
            var self = this;
            callback = callback || function(){};
            if ( self.isLoading ){
                $(self).bind('onReady', function onReady(){
                    callback.call(self);
                    $(self).unbind('onReady', onReady);
                });
                return;
            }
            self.isLoading = true;
            var q = {
                '-action' : 'group_permissions_users_table_info',
                '-table' : 'xataface__groups'
            };
            
            $.post(DATAFACE_SITE_HREF, q, function(res){
                self.isLoading = false;
                if ( res && res.code === 200 ){
                    self.usersTable = res.usersTable;
                    self.usernameColumn = res.usernameColumn;
                    callback.call(self);
                    $(self).trigger('onReady');
                } else {
                    
                    $(self).trigger('error', res);
                }
                
                
            });
            
        }
    })();
})();

