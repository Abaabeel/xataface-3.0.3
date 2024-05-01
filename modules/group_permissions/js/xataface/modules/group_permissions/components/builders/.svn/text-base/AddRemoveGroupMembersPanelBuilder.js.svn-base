/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <xataface/modules/group_permissions/components/AddRemoveGroupMembersPanel.js>
(function(){
    var $ = jQuery;
    var group_permissions = xataface.modules.group_permissions;
    
    var AddRemoveGroupMembersPanel = group_permissions.components.AddRemoveGroupMembersPanel;
    
    var pkg = XataJax.load('xataface.modules.group_permissions.components.builders');
    pkg.AddRemoveGroupMembersPanelBuilder = AddRemoveGroupMembersPanelBuilder;
    
    function AddRemoveGroupMembersPanelBuilder(/*Object*/ o){
        o = o || {};
        this.el = o.el;
        this.group = o.group || null;
        
    }
    
    (function(){
        $.extend(AddRemoveGroupMembersPanelBuilder.prototype, {
            build : build
        });
        
        function build(callback){
            callback = callback || function(){};
            var self = this;
            var q = {
                '-action' : 'group_permissions_users_table_info',
                '-table' : 'xataface__groups'
            };
            
            $.post(DATAFACE_SITE_HREF, q, function(res){
                console.log(res);
                if ( res && res.code === 200 ){
                    var panel = new AddRemoveGroupMembersPanel({
                        el : self.el,
                        usersTableName : res.usersTable,
                        usernameColumn : res.usernameColumn,
                        group : self.group
                    });
                    callback.call(self, panel);
                } else {
                    
                    $(self).trigger('error', res);
                }
                
                
            });
        }
    })();
})();

