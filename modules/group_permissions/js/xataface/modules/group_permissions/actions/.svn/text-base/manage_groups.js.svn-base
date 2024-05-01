/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//require <xataface/modules/group_permissions/components/ManageGroupsPanel.js>
//require-css <xataface/modules/group_permissions/actions/manage_groups.css>
//require <xataface/modules/group_permissions/lib/jquery.layout.js>
(function(){
    var $ = jQuery;
    var group_permissions = xataface.modules.group_permissions;
    var ManageGroupsPanel = group_permissions.components.ManageGroupsPanel;
    
    $(document).ready(function(){
        var panel = new ManageGroupsPanel();
        $(panel).bind('error', function(evt, data){
            console.log(data);
        });
        
        
	$('#manage-groups-panel')
                .css({
                    height : $(window).height()-$('#manage-groups-panel').offset().top,
                    width : $(window).width()-$('#manage-groups-panel').offset().left
                })
                .layout();


    });
})();
