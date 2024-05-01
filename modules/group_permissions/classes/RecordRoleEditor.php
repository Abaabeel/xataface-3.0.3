<?php
namespace xataface\modules\group_permissions;
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * @brief Allows editing the roles for a record.  Provides methods to add/remove
 * groups, users, and user/group roles to a record.
 *
 * @author shannah
 */
class RecordRoleEditor {
    //put your code here
    
    /**
     * The record that is to be edited by this editor
     * @var \Dataface_Record
     */
    private $record;
    
    /**
     *
     * @var \StdClass
     */
    private $roles = null;
    
    public function __construct(\Dataface_Record $record){
        $this->record = $record;
    }
    
    public function roles(){
        if ( !isset($this->roles) ){
            $this->roles = (object)$this->record->getGroupRoleMetadata();
            if ( !$this->roles ){
                $this->roles = new \StdClass;
                $this->roles->users = new \StdClass;
                $this->roles->groups = new \StdClass;
                 
            }
            
        }
        return $this->roles;
    }
    
    public function groupRoles(){
        return $this->roles()->groups;
    }
    
    public function userRoles(){
        return $this->roles()->users;
    }
    
    private function addRole($type, $name, $role){
        if ( !isset($this->roles()->{$type}->{$name}) ){
            $this->roles()->{$type}->{$name} = array();
        }
        $this->roles()->{$type}->{$name}[] = $role;
    }
    
    private function removeRole($type, $name, $role){
        $roles =& $this->roles()->{$type}->{$name};
        if ( !$roles ){
            return;
        }
        array_splice($roles, array_search($role,$roles),1);
    }
    
    /**
     * @brief Adds a group role.
     * @param String $groupId The ID of the group.
     * @param type $role The name of the role.
     * @return void
     */
    public function addGroupRole($groupId, $role){
        return $this->addRole('groups', $groupId, $role);
    }
    
    /**
     * @brief Removes a group role for this record.
     * @param String $groupId The id of the group.
     * @param String $role The name of the role
     * @return void
     */
    public function removeGroupRole($groupId, $role){
        return $this->removeRole('groups', $groupId, $role);
    }
    
    /**
     * @brief Assigns a role to a user for this record.
     * @param String $name The username of the user.
     * @param String $role The role name.
     * @return void
     */
    public function addUserRole($name, $role){
        return $this->addRole('users', $name, $role);
    }
    
    /**
     * @brief Removes a user's role for this record.
     * @param String $name The username of the user.
     * @param String $role The role to add.
     * @return void
     */
    public function removeUserRole($name, $role){
        return $this->removeRole('users', $name, $role);
    }
    
    /**
     * @brief Removes a group and its assigned roles from this record.
     * @param String $groupId The group id 
     */
    public function removeGroup($groupId){
        if ( isset($this->roles()->groups->{$groupId} )){
            unset($this->roles()->groups->{$groupId});
        }
    }
    
    /**
     * @brief Removes a user and assigned roles from this record.
     * @param String $username
     */
    public function removeUser($username){
        if ( isset($this->roles()->users->{$username})){
            unset($this->roles()->users->{$username});
        }
    }
    
    /**
     * @brief Clears all uncomitted changes from this record.
     */
    public function revert(){
        $this->roles = null;
    }
    
    /**
     * @brief Commits all of the changes to the roles for this record into
     * the record itself.  Optionally persists the data to the database
     * if the $persist parameter is true.  (This is the default functionality).
     * @param boolean $persist Whether to persist the roles to the database.
     * @return boolean Returns true if the commit succeeds.
     */
    public function commit($persist = true){
        $this->record->pouch['__roles__'] = $this->roles();
        $json = json_encode($this->roles);
        $this->record->setMetaDataValue('__roles__', $json);
        if ( $persist ){
            
            $qb = new \Dataface_QueryBuilder($this->record->table()->tablename);
            $where = $qb->where($this->record, false);
            
            $sql = sprintf("update `%s` set `__roles__`='%s' %s",
                    str_replace('`', '', $this->record->table()->tablename),
                    addslashes($json),
                    $where);
            $res = df_q($sql);
            $this->revert();
            $this->record = df_get_record_by_id($this->record->getId());
            return $res;
        }
        return true;
    }
    
    
    
    
}
