<?php
import('modules/group_permissions/repositories/GroupRepository.php');
class actions_group_permissions_manage_groups {
    function handle($params){
        $moduleBase = 'xataface/modules/group_permissions/';
        $jsPath = $moduleBase.'actions/manage_groups.js';
        $templatePath = $moduleBase.'actions/manage_groups.html';
        $moduleName = 'modules_group_permissions';
        $moduleTool = Dataface_ModuleTool::getInstance();
        
        
        $group_permissions = $moduleTool->loadModule($moduleName);
        $group_permissions->registerPaths();
        
        $uitk = $moduleTool->loadModule('modules_uitk');
        $uitk->registerPaths();
        
        Dataface_JavascriptTool::getInstance()
                ->import($jsPath);
        
        $context = array(
        );
        
        
        df_display($context, $templatePath);
        
    }
}