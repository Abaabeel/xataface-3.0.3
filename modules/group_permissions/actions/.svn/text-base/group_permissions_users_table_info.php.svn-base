<?php
/**
 * Returns information about the users table in JSON format.  Specifically, the
 * name of the users table and the name of the username column. 
 * 
 * This is used by the AddRemoveGroupMemberPanelBuilder javascript class
 * to get information about the users table so that it can properly build
 * the users tables.
 * 
 * Permissions:
 * 
 * This action requires the group_permissions_users_info permission to be granted
 * either on a group (provided by the group_id parameter optionally), or
 * on the xataface__groups table (and, by extension, the application perms
 * will be fallback).
 *
 * @author shannah
 */
class actions_group_permissions_users_table_info {
    
    //put your code here
    
    function handle($params){
        try {
            $this->handle2($params);
        } catch (Exception $ex){
            error_log(__FILE__.'['.__LINE__.']: '.$ex->getMessage().' Code='.$ex->getCode());
            $this->out(array(
                'code' => $ex->getCode(),
                'message' => 'A server error occurred. Check error log for details.'
            ));
        }
        
    }
    
    function handle2($params){
        header('Connection: close');
        
        $app = Dataface_Application::getInstance();
        $query = $app->getQuery();
        
        $permission = 'group_permissions_users_info';
        
        $allowed = false;
        if ( @$query['group_id'] ){
            $group = df_get_record('xataface__groups', array('group_id'=>'='.$query['group_id']));
            if ( !$group ){
                error_log(__FILE__.'['.__LINE__.']: Group with ID '.$query['group_id'].' not found.');
                throw new Exception("Failed to get information.  Check error log.");
            }
            
            if ( $group->checkPermission($permission) ){
                $allowed = true;
            }
        }
        
        $table = Dataface_Table::loadTable('xataface__groups');
        if ( PEAR::isError($table) ){
            error_log(__FILE__.'['.__LINE__.'] Error loading groups table: '.$table->getMessage(), $table->getCode());
            throw new Exception("Failed to load groups table.");
        }
        
        $perms = $table->getPermissions();
        if ( @$perms[$permission]){
            $allowed = true;
        }
        
        $auth = Dataface_AuthenticationTool::getInstance();
        
        $usersTable = Dataface_Table::loadTable($auth->usersTable);
        if ( PEAR::isError($usersTable) ){
            throw new Exception($usersTable->getMessage(), $usersTable->getCode());
        }
        
        $perms = $usersTable->getPermissions();
        if ( @$perms['view'] ){
            $allowed = true;
        }
        
        
        if ( !$allowed ){
            throw new Exception("You don't have permission to perform this function", 400);
        }
        
        
        $this->out(array(
            'code' => 200,
            'message' => 'Successfully loaded info',
            'usersTable' => $auth->usersTable,
            'usernameColumn' => $auth->usernameColumn
        ));
        
    }
    
    function out($data){
        header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
        echo json_encode($data);
    }
}

