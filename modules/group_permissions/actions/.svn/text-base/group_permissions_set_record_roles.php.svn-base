<?php
require 'modules/group_permissions/classes/RecordRoleEditor.php';

use \xataface\modules\group_permissions\RecordRoleEditor;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of group_permissions_set_record_roles
 *
 * @author shannah
 */
class actions_group_permissions_set_record_roles {
    //put your code here
    
    private $op, $type, $names, $roles, $record;
    
    function handle($params){
        $this->record = Dataface_Application::getInstance()
                ->getRecord();
        
        if ( !@$_POST['--roles'] ){
            throw new Exception("No roles provided", 500);
        }
        
        if ( !@$_POST['--op'] ){
            throw new Exception("No operation provided", 500);
        }
        
        if ( !@$_POST['--type'] ){
            throw new Exception("No type provided", 500);
        }
        
        if ( !@$_POST['--names'] ){
            throw new Exception("No name provided", 500);
        }
        
        $this->op = $_POST['--op'];
        $this->type = $_POST['--type'];
        $this->names = explode("\n", $_POST['--names']);
        $this->roles = explode("\n", $_POST['--roles']);
        
        
        
        switch ( $this->op ){
            case 'addRole':
                $this->addRole();
                break;
            
            case 'removeRole':
                $this->removeRole();
                break;
            
            case 'remove':
                $this->remove();
                break;
            
            default:
                throw new Exception("Unrecognized op", 500);
            
                
        }
        
        
    }
    
    function addRole(){
        if ( count($this->roles) === 0 ){
            throw new Exception("No roles specified to be added.", 500);
        }
        switch ( $this->type ){
            case 'group' :
                $this->addGroupRole();
                break;
            
            case 'user' :
                $this->addUserRole();
                break;
            
            default :
                throw new Exception("Unrecognized type", 500);
        }
    }
    
    function addGroupRole(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->roles as $role){
            foreach ( $this->names as $name){
                $editor->addGroupRole($name, $role);
            }
        }
        $editor->commit();
        
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully added group roles'
        ));
    }
    
    function addUserRole(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->roles as $role){
            foreach ( $this->names as $name){
                $editor->addUserRole($name, $role);
            }
            
        }
        $editor->commit();
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully added user roles'
        ));
    }
    
    
    function removeRole(){
        if ( count($this->roles) === 0 ){
            throw new Exception("No roles specified to be removed", 500);
        }
        switch ( $this->type ){
            case 'user' :
                $this->removeUserRole();
                break;
            
            case 'group' :
                $this->removeGroupRole();
                break;
            
            default :
                throw new Exception("Invalid type", 500);
        }
    }
    
    function removeUserRole(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->roles as $role ){
            foreach ( $this->names as $name ){
                $editor->removeUserRole($name, $role);
            }
        }
        $editor->commit();
        
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully removed user roles'
        ));
    }
    
    function removeGroupRole(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->roles as $role){
            foreach ( $this->names as $name){
                $editor->removeUserRole($name, $role);
            }
        }
        
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully removed group roles'
        ));
    }
    
    
    function remove(){
        switch ( $this->type ){
            case 'user' :
                $this->removeUser();
                break;
            
            case 'group' :
                $this->removeGroup();
                break;
            
            default :
                throw new Exception("Unknown type", 500);
        }
    }
    
    function removeUser(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->names as $name ){
            $editor->removeUser($name);
        }
        $editor->commit();
        
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully removed user.'
        ));
    }
    
    function removeGroup(){
        $editor = new RecordRoleEditor($this->record);
        foreach ($this->names as $name){
            $editor->removeGroup($name);
        }
        $editor->commit();
        
        df_write_json(array(
            'code' => 200,
            'message' => 'Successfully removed group'
        ));
    }
}
