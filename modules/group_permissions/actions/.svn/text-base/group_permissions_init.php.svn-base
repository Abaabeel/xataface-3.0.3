<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Initializes a table to be able to use group_permissions.  Essentially it just
 * creates a __roles__ field in the table.
 *
 * @author shannah
 */
class actions_group_permissions_init {
    
    public function handle($params){
        try {
            $this->handle2($params);
        } catch (Exception $ex){
            error_log(__FILE__.'['.__LINE__.']: Failed to initialize table for group permissions: '.$ex->getMessage());
            df_write_json(array(
                'code' => $ex->getCode(),
                'message' => 'Failed to initialize table for group permissions.  Check server log for details.'
            ));
        }
    }
    
    public function handle2($params){
        $app = Dataface_Application::getInstance();
        $query = $app->getQuery();
        $mod = Dataface_ModuleTool::getInstance()
                ->loadModule('modules_group_permissions');
        
        $table = Dataface_Table::loadTable($query['-table']);
        
        $perms = $table->getPermissions(array());
        if ( !@$perms['group_permissions_manage_table_permissions']){
            throw new Exception("You don't have permission to perform this action.", 400);
        }
        
        if ( $table->hasField('__roles__')){
            df_write_json(array(
                'code' => 200,
                'message' => 'Table already initialized for group permissions.'
            ));
        } else {
            
            // Note!  This will add columns and clear caches (apc, views, and 
            // output cache.  It will also mark the table as changed so that 
            // other caches, such as scaler, which depend on the table 
            // modification times will work.
            if ( @$query['--activate-if-disabled'] ){
                $mod->addRolesColumnToTable($table->tablename);

                df_write_json(array(
                    'code' => 201,
                    'message' => 'Successfully initialized table for group permissions.'
                ));
            } else {
                df_write_json(array(
                    'code' => 202,
                    'message' => 'Group Permissions Not Activated for table.'
                ));
            }
        }
        
    }
}

