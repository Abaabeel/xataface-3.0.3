<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of group_permissions_group_remove_members
 *
 * 
 * Sample AJAX request:
 * var q = {
                '-action' : 'group_permissions_group_remove_members',
                '-table' : 'xataface__groups',
                'group_id' : '='+self.group.group_id,
                '--usernames' : selectedStr
            };
 * @author shannah
 */
class actions_group_permissions_group_remove_members {
    //put your code here
    
    function handle($params){
        try {
            $this->handle2($params);
        } catch ( Exception $ex){
            error_log(__FILE__.'['.__LINE__.']: '.$ex->getMessage().' code='.$ex->getCode());
            $this->out(array(
                'code' => $ex->getCode(),
                'message' => 'Failed to remove group members.  See server log for details.'
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
        
        foreach ( $requiredFields as $field ){
            if ( !@$query[$field] ){
                throw new Exception("Field $field is required.", 500);
            }
            
        }
        
        $group = df_get_record('xataface__groups', $query);
        if ( !$group ){
            throw new Exception("Group could not be found: ".$query['group_id'], 404);
        }
        
        if ( !$group->checkPermission('group_permissions_manage_group') ){
            throw new Exception("You don't have permission to manage this group", 400);
        }
        
        $usernames = explode("\n", $query['--usernames']);
        if ( count($usernames) === 0 ){
            throw new Exception("No usernames specified", 500);
        }
        
        $successes = 0;
        $failures = 0;
        foreach ( $usernames as $username ){
            $rec = df_get_record('xataface__group_members', array(
                'group_id' => '='.$group->val('group_id'),
                'username' => '='.$username
            ));
            if ( !$rec ){
                $failures++;
                error_log(__FILE__.'['.__LINE__.']: Could not find record to remove: '.$username.' in group '.$group->val('group_id'));
                continue;
            }
            
            $res = $rec->delete();
            if ( PEAR::isError($res) ){
                $failures++;
                error_log(__FILE__.'['.__LINE__.']: Failed to delete group membership for username '.$username.' in group '.$group->val('group_id').': '.$res->getMessage());
                continue;
            } else {
                $successes++;
            }
        }
        
        $code = $failures===0 ? 200 : ($successes > 0 ? 201 : 500);
        $message = 'Failed';
        switch ($code){
            case 200:
                $message = 'Successfully removed group members'; break;
            case 201:
                $message = sprintf("%d members removed.  Failed to remove %d members.  See server log for details.",
                        $successes,
                        $failures
                        );
                break;
            default:
                $message = 'Failed to remove group members.  See server log for details.'; break;
            
        }
        
        $this->out(array(
            'code' => $code,
            'message' => $message,
            'successes' => $successes,
            'failures' => $failures
        ));
    }
    
    function out($data){
        header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
        echo json_encode($data);
    }
}
