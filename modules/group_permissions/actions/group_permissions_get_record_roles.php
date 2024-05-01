<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of group_permissions_get_record_roles
 *
 * @author shannah
 */
class actions_group_permissions_get_record_roles {
    //put your code here
    
    function handle($params){
        try {
            $this->handle2($params);
        } catch (Exception $ex){
            error_log(__FILE__.'['.__LINE__.']:'.$ex->getMessage().' code='.$ex->getCode());
            df_write_json(array(
                'code' => $ex->getCode(),
                'message' => $ex->getMessage()
            ));
        }
    }
    
    function handle2($params){
        $record = Dataface_Application::getInstance()
                ->getRecord();
        
        if ( !$record ){
            throw new Exception("Record not found", 404);
        }
        
        if ( !$record->checkPermission('group_permissions_manage_record_permissions')){
            throw new Exception("You don't have permission to manage this record's permissions", 400);
        }
        
        //print_r($record->vals());
        $roles = $record->getGroupRoleMetadata();
        //print_r($roles);
        //exit;
         
        if ( !$roles ){
            $roles = new StdClass;
            $roles->users = array();
            $roles->groups = array();
            
        }
        
        $roles->roles = Dataface_ModuleTool::getInstance()
                ->loadModule('modules_group_permissions')
                ->assignableRoles();
        
        df_write_json(array(
            'code' => 200,
            'roles' => $roles,
            'message' => 'Successfully loaded record roles'
        ));
    }
    
    
}

