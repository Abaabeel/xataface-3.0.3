/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <jquery.packed.js>
//require <xataface/modules/group_permissions/components/ManageRecordRolesPanel.js>
//require <xataface/modules/group_permissions/GroupPermissions.js>
//require <xataface/modules/group_permissions/components/ActivateGroupPermissionsPanel.js>
(function(){
    
    var $ = jQuery;
    var GroupPermissions = xataface.modules.group_permissions.GroupPermissions;
    var ManageRecordRolesPanel = xataface.modules.group_permissions.components.ManageRecordRolesPanel;
    var ActivateGroupPermissionsPanel = xataface.modules.group_permissions.components.ActivateGroupPermissionsPanel;
    var recordId = $('#group-permissions-record-id').attr('value');
    var tableName = recordId.substr(0, recordId.indexOf('?'));
    GroupPermissions.getInstance().checkStatus({
        table : tableName,
        callback : function(res){
            $('#group-permissions-loading').hide();
            if ( res ){
                // Group permissions are active for this table so we can
                // show the ManageRecordRolesPanel to allow the user to
                // manage the permissions.
                showManageRecordsPanel();
                
            } else {
                // Group permissions are not active for this table so we'll just
                // show the activation form.
                showActivationPanel();
                
            }
        }
    });
    
    function showManageRecordsPanel(){
        var rootPanel = new ManageRecordRolesPanel({
            recordId : recordId
        });
        rootPanel.show();
        rootPanel.refresh();
    }
    
    function showActivationPanel(){
        var activationPanel = new ActivateGroupPermissionsPanel({
            table : tableName
        });
        activationPanel.show();
        $(activationPanel).bind('groupPermissionsActivated', function(){
            this.hide();
            showManageRecordsPanel();
        });
    }
    
    
})();

