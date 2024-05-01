<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of group_permissions_group_add_members
 * 
 * Sample AJAX Request:
 * 
 * var q = {
                '-action' : 'group_permissions_group_add_members',
                '--usernames' : selectedStr,
                '--role' : 'MEMBER',
                '-table' : 'xataface__groups',
                'group_id' : '='+self.group.group_id
            };
 *
 * @author shannah
 */
class actions_group_permissions_group_add_members {
    //put your code here
    function handle($params){
        try {
            $this->handle2($params);
        } catch ( Exception $ex){
            error_log(__FILE__.'['.__LINE__.']:'.$ex->getMessage().' Code='.$ex->getCode());
            $this->out(array(
                'code' => $ex->getCode() ? $ex->getCode() : 500,
                'message' => 'Failed.  Check server log for details.'
            ));
        }
    }
    
    
    function handle2($params){
        
        $app = Dataface_Application::getInstance();
        $query = $app->getQuery();
        
        $requiredFields = array(
            '--usernames',
            'group_id'
        );
        
        foreach ( $requiredFields as $field){
            if ( !@$query[$field] ){
                throw new Exception("Request parameter '".$field."' is required.", 500);
            }
        }
        
        $usernames = explode("\n", $query['--usernames']);
        if ( count($usernames) == 0 ){
            throw new Exception("No usernames provided", 500);
        }
        
        $role = @$query['--role'];
        if ( !$role ){
            $role = 'MEMBER';
        }
        
        $group = df_get_record('xataface__groups', $query);
        
        if ( !$group ){
            throw new Exception("Could not find group '".$query['group_id']."'", 404);
        }
        
        if ( !$group->checkPermission('group_permissions_manage_group') ){
            throw new Exception("You don't have permission to manage this group: ".$query['group_id'], 400);
        }
        
        $successes = 0;
        $failures = 0;
        
        foreach ( $usernames as $username ){
            $rec = df_get_record('xataface__group_members', array(
                'group_id' => '='.$group->val('group_id'),
                'username' => '='.$username
            ));
            if ( !$rec ){
                $rec = new Dataface_Record('xataface__group_members', array());
            }
            $rec->setValues(array(
                'group_id' => $group->val('group_id'),
                'username' => $username,
                'role' => $role
            ));
            
            $res = $rec->save();
            
            if ( PEAR::isError($res) ){
                $failures++;
                error_log(__FILE__.'['.__LINE__.']: '.$res->getMessage().' Code='.$res->getCode());
            }
            else {
                $successes++;
            }
        }
        
        $code = ($failures===0)?200:($successes>0)?201:500;
        $msg = 'Failed.  See error log for details';
        switch ( $code ){
            case 200:
                $msg = 'Success'; break;
            case 201:
                $msg = sprintf('%d members added successfully.  %d failed.', $successes, $failures);
                break;
            case 500:
                $msg = 'Failed to add members.  See server log for error details.';
                break;
        }
        
        
        $this->out(array(
            'code' => $code,
            'message' => $msg,
            'successes' => $successes,
            'failures' => $failures
        ));
        
    }
    
    function out($data){
        header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
        echo json_encode($data);
    }
}

?>
