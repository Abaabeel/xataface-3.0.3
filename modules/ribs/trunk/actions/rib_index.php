<?php
class actions_rib_index {
    function handle($params){
        $mod = Dataface_ModuleTool::getInstance()
            ->loadModule('modules_rib');
            
        $ribRoot = $mod->getBaseURL();
        if ( !$ribRoot ){
            $ribRoot = '/';
        }
        if ( $ribRoot{strlen($ribRoot)-1} != '/' ){
            $ribRoot .= '/';
        }
        
        $context = array(
            'RIB_ROOT' => $ribRoot
        );
        
        $mod->registerPaths();
        
        df_display($context, 'xataface/modules/rib/actions/rib_index.html');
    }
}