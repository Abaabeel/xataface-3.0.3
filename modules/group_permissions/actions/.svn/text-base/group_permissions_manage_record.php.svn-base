<?php
class actions_group_permissions_manage_record {
    function handle($params){
        $moduleBase = 'xataface/modules/group_permissions/';
        $jsPath = $moduleBase.'actions/manage_record.js';
        $templatePath = $moduleBase.'actions/manage_record.html';
        $moduleName = 'modules_group_permissions';
        $moduleTool = Dataface_ModuleTool::getInstance();
        $app = Dataface_Application::getInstance();
        
        $group_permissions = $moduleTool->loadModule($moduleName);
        $group_permissions->registerPaths();
        
        $uitk = $moduleTool->loadModule('modules_uitk');
        $uitk->registerPaths();
        
        Dataface_JavascriptTool::getInstance()
                ->import($jsPath);
        
        $context = array(
        );
        
        $record = $app->getRecord();
        if ( $record ){
        
            $app->addHeadContent(
                    sprintf('<meta id="group-permissions-record-id" name="group_permissions_record_id" value="%s"/>',
                            htmlspecialchars($record->getId())
                            )
                    );
        }
        df_display($context, $templatePath);
    }
}