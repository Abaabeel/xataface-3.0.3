/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <xataface/model/ListModel.js>
//require <xataface/store/ResultSet.js>
//require <xataface/view/TableView.js>
//require <xataface/modules/group_permissions/GroupPermissions.js>
//require <xataface/modules/group_permissions/components/AddUserRoleForm.js>
//require <xataface/modules/group_permissions/lib/tag-it.js>
(function(){
    var $ = jQuery;
    var ListModel = xataface.model.ListModel;
    var ResultSet = xataface.store.ResultSet;
    var TableView = xataface.view.TableView;
    var GroupPermissions = xataface.modules.group_permissions.GroupPermissions;
    var AddUserRoleForm = xataface.modules.group_permissions.components.AddUserRoleForm;
    
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.ManageRecordRolesPanel = ManageRecordRolesPanel;
    
    /**
     * @class
     * @memberOf xataface.modules.group_permissions.components
     * @description A panel for managing the user and group permissions that are assigned
     * to a particular record.  This includes two sections:
     * <ol>
     *  <li>Manage Users</li>
     *  <li>Manage Groups</li>
     * </ol>
     * 
     * <p>Each section includes a table with one row per user/group and each row
     * including a tagger widget to allow adding and removing roles from the the user.</p>
     * <p>In addition, each section has an Add User/Group button that allows the user
     * to select a user or group that does not yet have any special privileges assigned
     * for this record and add it to the table.</p>
     * 
     * @param {Object} o Constructor parameters.
     * @param {String} o.recordId The record ID of the record whose permissions are being managed.
     * @param {String} o.el The <div> tag that wraps the panel.  If this is left 
     *  blank, then it just uses the #RecordRolesPanel div which is defined in the
     *  manage_record.html template.
     *
     */
    function ManageRecordRolesPanel(/*Object*/ o){
        var self = this;
        o = o || {};
        
        /**
         * Reference to the add user form which will be displayed when the user
         * clicks the "Add User" button, indicating that they want to add privileges
         * for a user who is not yet listed.
         * <p>This object is created after the GroupPermissions object is ready.  This
         * is because it needs to know the roles that are available in the system.</p>
         * @type AddUserRoleForm
         */
        this.addUserForm = null;
        
        /**
         * Whether the data is currently being loaded.
         * @type Boolean
         */
        this.isLoading = false;
        
        /**
         * The record ID of the record whose roles are being edited in this
         * panel.
         * @type String
         */
        this.recordId = o.recordId || null;
        
        /**
         * The <div> tag wrapping this panel.
         * @type HTMLElement
         */
        this.el = o.el || $('#RecordRolesPanel').get(0);
        if ( !this.el){
            throw {
                code : 500,
                message : 'Could not find record roles panel template'
            };
        }
        
        /**
         * The model data that is loaded from the group_permissions_get_record_roles
         * @type Object
         */
        this.data = null;
        
        
        // Set up the Users table ----------------------------------------------
        
        /**
         * Container for the view, model, and result set associated with the
         * users table.  The users table is the table that shows the users
         * who have been granted special roles for this record.
         * @type Object
         */
        this.usersTable = {};
        
        /**
         * The model for the users table.
         */
        this.usersTable.model = new ListModel();
        
        /**
         * The view for the users table.
         */
        this.usersTable.view = new TableView({
            
            // The model refers to the same model as we created above
            model : this.usersTable.model,
            
            // The <table> element
            el : $('table.user-permissions-tbl', this.el).get(0),
            
            /**
             * @description Overrides the _decorateRow() method of TableView so that
             * we can add the tagger widget functionality for adding and removing
             * roles.
             * @param {HTMLElement} rowView  The <tr> tag of a row.
             * @param {Object} rowModel The model for the row.
             * @returns {undefined}
             */
            _decorateRow : function(/*HTMLElement*/ rowView, /*Object*/ rowModel){
                
                TableView.prototype._decorateRow.call(this, rowView, rowModel);
                
                var $roleTags = $('ul.role-tags', rowView);
                // Create tagger widget for roles
                $roleTags.tagit({
                    afterTagRemoved : function(event, ui){
                        self.removeUserRoles({
                            noReload : true,
                            users : [rowModel.username],
                            roles : [ui.tagLabel],
                            callback : function(res){
                                if ( res && res.code >= 200 && res.code < 300  ){
                                    // success we don't need to do anything
                                } else {
                                    // Failed to remove tag, now we have to re add it
                                    $roleTags.tagit("createTag", ui.tagLabel);
                                }
                            } 
                        });
                    }
                });
                
                
               
                
                /*
                 * Attach a change listener to the role selector for the row
                 * to add a role and create the tag.
                 */
                $('select.role-selector', rowView).change(function(){
                    
                    var sel = this;
                    var val = $(this).val();
                    
                    // Kick the select list back to the 'Add Role...' option.
                    $(sel).val('');
                    
                    // If we were on the default option we do nothing
                    if ( !val ){
                        return;
                    }
                    
                    // Make sure that tag isn't already added
                    var $found = $roleTags.find('span.tagit-label').filter(function(){
                        return $(this).text() === val;
                    });
                    
                    // If this role is already listed we do nothing
                    if ( $found.length > 0 ){
                        return;
                    }
                    
                    // Actually add the roles in the database, and, only if it
                    // succeeds, add the tag
                    self.addUsers({
                        users : [rowModel.username],
                        roles : [val],
                        noReload : true,
                        callback : function(res){
                            if ( res && res.code >= 200 && res.code < 300 ){
                                $roleTags.tagit("createTag", val);
                                
                            }
                        }
                    });
                    
                    
                    
                });
                
            },
            
            /**
             * @description Overrides the _updateRow() method of TableView to populate
             * the roles in the tagit widget and to populate the roles drop-down.
             * @param {HTMLElement} rowView The <tr> tag for the row.
             * @param {Object} rowModel The row model.
             * @returns {undefined}
             */
            _updateRow : function(/*HTMLElement*/ rowView, /*Object*/ rowModel){
                TableView.prototype._updateRow.call(this, rowView, rowModel);
                var $roleTags = $('ul.role-tags', rowView);
                $.each(rowModel.roles, function(k,v){
                    //$roleTags.append($('<li>').text(v));
                    $roleTags.tagit("createTag", v);
                    
                });
                //$roleTags.tagit();
                if ( self.data ){
                    var options = $();
                    options = options.add($('<option>').attr('value','').text('Add Role...'));
                    //console.log(self.data.roles.roles);
                    $(self.data.roles.roles).each(function(k,v){
                        options = options.add($('<option>').attr('value', v).text(v));
                    });
                    $('select.role-selector', rowView)
                            .empty()
                            .append(options);
                }
                
            }
        });
        
        /**
         * The result set for the users table.  This handles the loading of data
         * for the users table from the data source.  We override the _load()
         * and handleLoadResponse() methods here to be able to load data directly
         * from the data model of this panel rather than making an independent 
         * request to the server.  This is done for efficiency reasons since we have
         * a single action (group_permissions_get_record_roles) that gets the data
         * for both the groups table and the users table and we don't want to 
         * make 2 server requests when we could just make one.
         */
        this.usersTable.resultSet = new ResultSet({
            model : this.usersTable.model,
            query : {
                '-action' : 'group_permissions_get_record_roles',
                '--recordid' : this.recordId
            },
            
            /**
             * @description Overrides the _load() method of the ResultSet class
             * to use the refreshData method instead of making a server request
             * directly.  It is set to only force a reload if the data is more than
             * 2 seconds old.  This prevents a double-network request when both 
             * the users table and the groups table are trying to load the data.
             * 
             * @param {function} callback Called when the data is ready and loaded.
             * @returns {undefined}
             */
            _load : function(callback){
                var rs = this;
                callback = callback || function(){};
                self.refreshData(2000, function(){
                    rs.handleLoadResponse(self.data);
                    rs._loading = false;
                    $(rs).trigger('loading', {
                            loading: false
                    });
                    $(rs).trigger('afterLoad', self.data);
                    callback.call(rs, self.data);
                });
            },
                    
            /**
             * @description Overrides the handleLoadResponse() method of the ResultSet
             * class to parse out all of the users and form a response that the
             * default handleLoadResponse() method expects.  In particular, it expects
             * to receive the rows in an array property named "rows".
             * @param {Object} res The response from the server.  
             * @returns {undefined}
             */
            handleLoadResponse : function(res){
                // Make a copy of the res object since this *could* be a reference
                // to the ManageRecordRoles.data# object that is shared by multiple
                // result sets - so we don't want to pollute it.
                res = $.extend({}, res);
                // The response of the get roles action won't quite
                // be in the format that the result set is expecting.
                // it needs the result to include a 'rows' property
                // which is an array of objects
                var rows = [];
                if ( res && res.code === 200 ){
                    //$(res.roles.users).each(function(k,v){
                    for ( var k in res.roles.users){
                        
                        var v = res.roles.users[k];
                        var row = {
                            username : k,
                            roles : v
                        };
                        rows.push(row);
                    //});
                    }
                    res.rows = rows;
                    
                }
                ResultSet.prototype.handleLoadResponse.call(this, res);
                
            }
        });
        
        // END Setting up the Users table --------------------------------------
        
        // Set up the Groups table ---------------------------------------------
        
        /**
         * Container for the model, view, and result set for the groups table.
         * The groups table is the HTML table that displays the groups that 
         * have been assigned roles for this record.
         * @type Object
         */
        this.groupsTable = {};
        
        /**
         * The model for the groups table.
         */
        this.groupsTable.model = new ListModel();
        
        /**
         * The view for the groups table.
         */
        this.groupsTable.view = new TableView({
            // Use the model we defined above
            model : this.groupsTable.model,
                    
            // The <table> tag for the groups table
            // from the template
            el : $('table.group-permissions-tbl', this.el).get(0)
        });
        
        /**
         * The result set for the groups table.  Like the users table, this has
         * overridden _load() and handleLoadResponse() methods so that we can
         * use the refreshData() method for loading the data rather than making
         * our own requests directly to the server.
         */
        this.groupsTable.resultSet = new ResultSet({
            // Use the model we defined above
            model : this.groupsTable.model,
           
           /**
            * @description Overrides the ResultSet._load() method to use the
            * refreshData() method instead of making an AJAX request.  It is set 
            * up to use the cache if it is more recent than 2 seconds old.
            * @param {function} callback Function called when data is loaded.
            * @returns {undefined}
            */
           _load : function(callback){
                var rs = this;
                callback = callback || function(){};
                self.refreshData(2000, function(){
                    rs.handleLoadResponse(self.data);
                    rs._loading = false;
                    $(rs).trigger('loading', {
                            loading: false
                    });
                    $(rs).trigger('afterLoad', self.data);
                    callback.call(rs, self.data);
                });
            },
            
            /**
             * @description Overrides ResultSet.handleLoadResponse() to parse
             * out the groups in a format that handleLoadResponse() expects.
             * @param {Object} res The response data.
             * @returns {undefined}
             */
            handleLoadResponse : function(res){
                
                // Make a copy of the response object since it could just be
                // a reference to the data object and we don't want to pollute it.
                res = $.extend({}, res);
                // The response of the get roles action won't quite
                // be in the format that the result set is expecting.
                // it needs the result to include a 'rows' property
                // which is an array of objects
                var rows = [];
                if ( res && res.code === 200 ){
                    $(res.groups).each(function(k,v){
                        var row = {
                            groupid : k,
                            roles : v
                        };
                        rows.push(row);
                    });
                    res.rows = rows;
                }
                ResultSet.prototype.handleLoadResponse.call(this, res);
            }
        });
        
        // END Setting up groups table -----------------------------------------
        
       
        
        
        // Set up the Add Users Form
        
        GroupPermissions.getInstance().ready(function(){
            // We load the GroupPermissions instance because we needed to 
            // load the name of the users table and username columns from the
            // server.
            var groupPerms = this;
            if ( self.addUserForm === null ){
                self.addUserForm = new AddUserRoleForm({
                    usersTableName : groupPerms.usersTable,
                    usernameColumn : groupPerms.usernameColumn,
                    roles : ['MEMBER','MANAGER']
                });
                
                $(self.addUserForm).bind('usersSelected', function(evt, data){
                    var usernames = [];
                    $(data.users).each(function(k,v){
                        usernames.push(v[groupPerms.usernameColumn]);
                    });
                    self.addUsers({
                        users : usernames,
                        roles : [data.role]
                    });
                });
            }


            self.addUserForm.refresh();
            
            
            


        });
    }
    
    /*
     * Public Methods: ---------------------------------------------------------
     */
    (function(){
        $.extend(ManageRecordRolesPanel.prototype, {
            refreshData : refreshData,
            refresh : refresh,
            addUsers : addUsers,
            removeUserRoles : removeUserRoles,
            addGroupd : addGroups,
            show : show,
            hide : hide
            
        });
        
        /**
         * @function
         * @name refreshData
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @param {int} ifOlderThanMs The max age (in milliseconds) that the data can
         * be before it will request a reload from the server.
         * @param {function} callback Callback function called when data is ready.
         * @returns {void}
         */
        function refreshData(ifOlderThanMs, callback){
            var self = this;
            ifOlderThanMs = ifOlderThanMs || 0;
            callback = callback || function(){};
            if ( this.data === null || this.data.timestamp < Date.now()-ifOlderThanMs ){
                if ( this.isLoading ){
                    $(this).bind('onRefresh', function onRefresh(){
                        $(self).unbind('onRefresh', onRefresh);
                        callback.call(self);
                    });
                }
                this.isLoading = true;
                var q = {
                    '--recordid' : this.recordId,
                    '-action' : 'group_permissions_get_record_roles',
                    '-table' : this.recordId.substr(0, this.recordId.indexOf('?'))
                };
                $.get(DATAFACE_SITE_HREF, q, function(res){
                    this.loading = false;
                    if ( res && res.code === 200 ){
                        self.data = res;
                        self.data.timestamp = Date.now();
                        callback.call(self);
                        $(self).trigger('onRefresh');
                    } else {
                        $(self).trigger('error', res);
                    }
                });
            } else {
                callback.call(self);
            }
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @description Refreshes the model of this panel and updates the UI.
         * @returns {undefined}
         */
        function refresh(){
            this.usersTable.resultSet.load();
            this.groupsTable.resultSet.load();
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @description Adds a set of users/roles to the record and refreshes the users
         * table when it is complete.
         * @param {Object} p The parameters
         * @param {String[]} p.users The usernames to add.
         * @param {String[]} p.roles The roles to add for each user.
         * @param {Boolean} p.noReload flag to prevent this from causing the form to reload.
         * @returns {void}
         */
        function addUsers(/*Object*/p){
            var self = this;
            GroupPermissions.getInstance().ready(function(){
                this.addRecordUserRoles({
                    usernames : p.users,
                    roles : p.roles,
                    recordId : self.recordId,
                    callback : function(res){
                        if ( res && res.code == 200 ){
                            $(self).trigger('message', res.message);
                            if ( !p.noReload ){
                                self.usersTable.resultSet.load();
                            }
                            
                        } else if ( res && res.code > 200 && res.code < 300 ) {
                            $(self).trigger('error', res);
                            if ( !p.noReload ){
                                self.usersTable.resultSet.load();
                            }
                        } else {
                            $(self).trigger('error', res);
                        }
                        if ( p.callback ){
                            p.callback.call(self, res);
                        }
                    }
                });
            });
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @description Removes a set of users/roles from the record and refreshes the users
         * table when it is complete.
         * @param {Object} p The parameters
         * @param {String[]} p.users The usernames to add.
         * @param {String[]} p.roles The roles to add for each user.
         * @param {Boolean} p.noReload flag to prevent this from causing the form to reload.
         * @returns {void}
         */
        function removeUserRoles(/*Object*/p){
            var self = this;
            GroupPermissions.getInstance().ready(function(){
                this.removeRecordUserRoles({
                    usernames : p.users,
                    roles : p.roles,
                    recordId : self.recordId,
                    callback : function(res){
                        if ( res && res.code == 200 ){
                            $(self).trigger('message', res.message);
                            if ( !p.noReload ){
                                self.usersTable.resultSet.load();
                            }
                            
                        } else if ( res && res.code > 200 && res.code < 300 ) {
                            $(self).trigger('error', res);
                            if ( !p.noReload ){
                                self.usersTable.resultSet.load();
                            }
                        } else {
                            $(self).trigger('error', res);
                        }
                        if ( p.callback ){
                            p.callback.call(self, res);
                        }
                    }
                });
            });
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @returns {void}
         */
        function show(){
            $(this.el).show();
            
        }
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @returns {void}
         */
        function hide(){
            $(this.el).hide();
        }
        
        /**
         * @function
         * @memberOf xataface.modules.group_permissions.components.ManageRecordRolesPanel#
         * @description Adds a set of groups/roles to the record and refreshes the users
         * table when it is complete.
         * @param {Object} p The parameters
         * @param {String[]} p.groups The group names to add.
         * @param {String[]} p.roles The roles to add for each user.
         * @param {Boolean} p.noReload flag to prevent this from causing the form to reload.
         * @returns {void}
         */
        function addGroups(/*Object*/ p){
            var self = this;
            GroupPermissions.getInstance().ready(function(){
                this.addRecordGroupRoles({
                    groupnames : p.groups,
                    roles : p.roles,
                    recordId : self.recordId,
                    callback : function(res){
                        if ( res && res.code == 200 ){
                            $(self).trigger('message', res.message);
                            if ( !p.noReload ){
                                self.groupsTable.resultSet.load();
                            }
                        } else if ( res && res.code > 200 && res.code < 300 ) {
                            $(self).trigger('error', res);
                            if ( !p.noReload ){
                                self.groupsTable.resultSet.load();
                            }
                        } else {
                            $(self).trigger('error', res);
                        }
                        
                        if ( p.callback ){
                            p.callback.call(self, res);
                        }
                    }
                });
            });
        }
        
        
    })();
})();

