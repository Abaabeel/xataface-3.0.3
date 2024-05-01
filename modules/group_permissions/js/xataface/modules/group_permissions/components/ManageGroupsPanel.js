/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <xataface/modules/uitk/components/UITable.js>
//require <xataface/modules/uitk/components/UIForm.js>
//require <xataface/modules/group_permissions/components/builders/AddRemoveGroupMembersPanelBuilder.js>
//require <jquery-ui.packed.js>
//require-css <jquery-ui/jquery-ui.css>
//require <xataface/IO.js>
(function(){
    var $ = jQuery;
    var modules = xataface.modules;
    var uitk = modules.uitk;
    var UITable = uitk.components.UITable;
    var UIForm = uitk.components.UIForm;
    var group_permissions = modules.group_permissions;
    var IO = xataface.IO;
   
    var AddRemoveGroupMembersPanelBuilder = group_permissions
                .components
                .builders
                .AddRemoveGroupMembersPanelBuilder;
        
    var pkg = XataJax.load('xataface.modules.group_permissions.components');
    pkg.ManageGroupsPanel = ManageGroupsPanel;
    
    function ManageGroupsPanel(/*Object*/ o){
        o = o || {};
        var self = this;
        this.el = $('#manage-groups-panel').get(0);
        
        this.selectedGroup = null;
        this.addRemoveGroupMembersPanel = null;
        
        this.groupsTable = new UITable({
            tableName : 'xataface__groups',
            columns : [
                {
                    name : 'group_name',
                    label : 'Group'
                },
                {
                    name : 'group_id',
                    label : 'Group ID'
                }
            ],
            displayColumns : ['group_name']
        });
        
        $(this.groupsTable.model).bind('selectionChanged', function(evt, data){
            
            if ( data.newValue.length === 0 ){
                $(self.el).addClass('no-group-selected');
                return;
            }
            $(self.el).removeClass('no-group-selected');
            self.selectedGroup = data.newValue[0];
            self.updateAddRemoveGroupMembersPanel();
            
            
        });
        
        this.groupsTable.registerSearchField($('input.group-search', this.el).get(0), '-search' );
        
        this.newGroupButton = $('button.new-group-btn', this.el).get(0);
        $(this.newGroupButton).click(function(){
            self.groupForm.isNew = true;
            self.groupForm.refresh();
        });
        
        this.deleteGroupButton = $('button.delete-group-btn', this.el).get(0);
        $(this.deleteGroupButton).click(function(){
            self.deleteSelectedGroup();
        });
        
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
            ]
        });
        
        this.membersTable.startObservingTable(
            this.groupsTable, 
            { group_id : 'group_id'}
        );
        
        
        this.groupForm = new UIForm({
            table : 'xataface__groups',
            showHeadings : false
        });
        $(this.groupForm.el)
            .css({
                'border-radius' : '10px',
                'border' : '1px solid #ccc',
                'padding' : '10px'
            })
            .height(150);
            
        
    
        $(this.groupForm).bind('afterSave', function(){
            self.groupsTable.refresh();
        });
        
        this.groupForm.startObservingTable(
            this.groupsTable, 
            { group_id : 'group_id'}
        );
        
            
        this.groupsTable.hideColumn('group_id');
       
        this.groupsTable.refresh();
        
        $('div.group-table-wrapper', this.el)
            .append(this.groupsTable.el);
    
        $('div.group-form-wrapper', this.el)
            .append(this.groupForm.el);
    
        $('div.group-members-table-wrapper', this.el)
            .append(this.membersTable.el);
    
        $('.tabs', this.el).tabs({
            show : function(evt, ui){
                if ( ui.panel.id === "add-members-panel" ){
                    self.updateAddRemoveGroupMembersPanel();
                }
            }
        });
        
        
        
        
    }
    
    (function(){
        $.extend(ManageGroupsPanel.prototype, {
            updateAddRemoveGroupMembersPanel : updateAddRemoveGroupMembersPanel,
            deleteSelectedGroup : deleteSelectedGroup
        });
        
        function updateAddRemoveGroupMembersPanel(){
            var self = this;
            if ( self.addRemoveGroupMembersPanel == null ){
                // Create a builder to build the add/remove members panel.
                var builder = new AddRemoveGroupMembersPanelBuilder({
                    el : $('div#add-members-panel', self.el).get(0),
                    group : self.selectedGroup
                });

                $(builder).bind('error', function(evt, data){
                    $(self).trigger('error', data);
                });

                // Build the panel... it will return the panel 
                // inside the callback if all is well.  If it fails,
                // then it will trigger an error event.
                builder.build(function(panel){
                    self.addRemoveGroupMembersPanel = panel;
                    panel.refresh();
                });
            } else {
               self.addRemoveGroupMembersPanel.group = self.selectedGroup;
               self.addRemoveGroupMembersPanel.refresh();
            }
        }
        
        
        function deleteSelectedGroup(approved){
            var self = this;
            if ( typeof(approved) === 'undefined' ){
                approved = false;
            }
            
            if ( !this.selectedGroup ){
                return; // no group is selected currently
            }
            if ( !approved ){
                var $content = $('<div>Are you sure you want to delete this group?</div>');
                $content.dialog({
                    buttons : [
                        {
                            text : 'Delete',
                            click : function(){
                                $(this).dialog('close');
                                self.deleteSelectedGroup(true);
                            }
                        },
                        {
                            text : 'Cancel',
                            click : function(){
                                $(this).dialog('close');
                            }
                        }
                    ]
                });
            } else {
                var id = 'xataface__groups?group_id='+this.selectedGroup.group_id;
                IO.remove(id, function(res){
                    if ( res && res.code === 200 ){
                        $(self).trigger('message', res.message);
                        self.groupsTable.refresh();
                    } else {
                        $(self).trigger('error', res);
                    }
                });
            }
        }
        
        
    })();
    
})();

