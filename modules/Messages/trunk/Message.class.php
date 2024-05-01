<?php
class Message {

	var $id;
	var $destinationID;
	var $sourceID;
	var $state;
	var $closed = false;
	
	
	function subject(){ return '';}
	function body(){return '';}
	 
	function states(){ return array();}
	function transitions(){ return array();}
	
	function buildEditForm(){
	
		$source =& df_get_record_by_id($this->sourceID);
		if ( PEAR::isError($source) ) return $source;
		if ( !$source ) return PEAR::raiseError("Could not find source record: ".$this->sourceID);
		
		$destination =& df_get_record_by_id($this->destinationID);
		if ( PEAR::isError($destination) ) return $destination;
		if ( !$destination ) return PEAR::raiseError("Could not find destination record: ".$this->destinationID);
		
		
		
	
		$fields = $this->form();
		import('HTML/QuickForm.php');
		$form = new HTML_QuickForm('message_form', 'post');
		$form->addElement('hidden','-action','edit_message');
		$form->addElement('hidden','-messageID', $this->id);
		foreach ($fields as $field){
			if ( isset($field['options']) ) $options = $field['options'];
			else $options = null;
			$form->addElement($field['type'], $field['name'], $field['label'], $options);
		}
		
		$transitions = $this->availableTransitions($this->state);
		$tbtns = array();
		foreach ($transitions as $t){
			if ( $t['type'] == TRANSITION_IF_UNCHANGED ) continue;
			if ( @$t['permission'] and !$source->checkPermission($t['permission']) ) continue;
			$tbtns[] = $form->createElement('radio','--transition',$t['name'], $t['label']);
		}
		$form->addGroup($tbtns, '--transition');
		$form->addElement('submit','submit','Submit');
		return $form;
		
	}
	
	
	function getDefault($default, $alt=null){
		if ( isset($default) ) return $default;
		else return $alt;
	}
	
	function form(){return array();}
	function processForm($vals){
		if ( !$this->validate($vals) ) return PEAR::raiseError("Failed to validate");
		$old = serialize(unserialize($this));
		$changed = false;
		foreach ( $vals as $key=>$val){
			if ( $key{0} == '-' ) continue;
			if ( !array_key_exists($key, get_object_vars($this))) continue;
			if ( $this->$key != $val ) $changed = true;
			$this->$key = $val;
		}
		
		
		// Swap the source and destination as we will be sending it back
		//  by default.  This can be overridden in the individual transition
		// callbacks.
		$dest = $this->destination;
		$this->destination = $this->source;
		$this->source = $dest;
		
		if ( isset($vals['--transition']) ){
			$transition = $this->getTransition($vals['--transition'], true);
			if ( !$transition ) return PEAR::raiseError("The specified transition could not be found, or was unavailable from this state");
			
			
			$checklist = 0;
			if ( $changed and $transition['type'] == TRANSITION_IF_UNCHANGED ){
				return PEAR::raiseError("The specified transition can only be made if no changes have been made");
			}
			
			if ( !$changed and $transition['type'] == TRANSITION_IF_CHANGED ){
				return PEAR::raiseError("The specified transition can only be made if changes have been made");
			}
			
			if ( isset($transition['callback']) ){
				$res = call_user_func($transition['callback'], $old, $new);
				if ( PEAR::isError($res) ) return $res;
			}
			
			$this->state = $transition['destination'];
			$state = $this->getState($this->state);
			$this->closed = $state['closed'];
			
		}
		
		return true;
		
		
	}
	
	function prepareTransitions($transitions){
		$stateNames = array();
		
		foreach ($this->states() as $state ){ $stateNames[] = $state['name'];}
	
		foreach ( $transitions as $key=>$transition ){
			if ( !isset($transition['label']) ) $transition['label'] = ucwords(str_replace('_',' ', $transition['name']));
			if ( !array_key_exists('description', $transition) ) $transition['description'] = null;
			if ( !array_key_exists('source', $transition) ) $transition['source'] = $stateNames;
			if ( !array_key_exists('destination', $transition) ) $transition['destination'] = $stateNames[0];
			if ( !array_key_exists('type', $transition) ) $transition['type'] = TRANSITION_NORMAL;
			if ( !array_key_exists('callback', $transition) ) $transition['callback'] = null;
			
			$transitions[$key] = $transition;
		}
		
		return $transitions;
	}
	
	function prepareStates($states){
		foreach ($states as $key=>$state){
			if ( !isset($state['label']) ) $state['label'] = ucwords(str_replace('_',' ',$state['name']));
			if ( !array_key_exists('description', $state) ) $state['description'] = null;
			if ( !array_key_exists('closed', $state) ) $state['closed'] = false;
			$states[$key] = $state;
		}
		
		return $states;
	
	}
	
	function prepareForm($form){
		foreach ( $form as $key=>$field){
			if ( !isset($field['label']) ) $field['label'] = ucwords(str_replace('_',' ',$field['name']));
			if ( !array_key_exists('description',$field) ) $field['description'] = null;
			if ( !array_key_exists('defaultValue', $field) ) $field['defaultValue'] = null;
			if ( !array_key_exists('type', $field) ) $field['type'] = 'text';
			$form[$key] = $field;
		}
		
		return $form;
	}
	
	function validate($vals){ return true;}
	
	
	function display(){
		df_display(array('message'=>&$this), 'Message/display.html');
	}
	
	function availableTransitions($source){
		$out = array();
		foreach ($this->transitions() as $transition){
			if ( (!isset($source) and !isset($transition['source']))
						or
				 (is_array($transition['source']) and in_array($source, array($transition['source'])))
				 		or
				 (is_string($transition['source']) and $source == $transition['source'])
				){
				$out[] = $transition;
			}
		}
		
		return $out;
	
	}
	
	function getTransition($name, $availableOnly=false){
		if ( $availableOnly ) $transitions = $this->availableTransitions();
		else $transitions = $this->transitions();
		
		foreach ( $transitions as $transition ){
			if ( $transition['name'] == $name ) return $transition;
		}
		return null;
	}
	
	function currentState(){
		foreach ($this->states() as $state ){
			if ( $state['name'] == $this->state) return $state;
		}
		return null;
	}
	
	
	
	
	
	
	
}

class ExampleMessage extends Message {
	var $GroupTitle;

	function states(){
		return $this->prepareStates(array(
			array(
				'name' => 'pending invite',
				'label' => 'Pending Group Invitation',
				'description' => 'Awaiting member to accept invitation to group'
			),
			array(
				'name' => 'pending approval',
				'label' => 'Pending Join Request',
				'description' => 'Awaiting group admin to approve the member'
			),
			array(
				'name' => 'details changed',
				'label' => 'Details Changed',
				'description' => 'Awaiting verification of changes to details'
			),
			array(
				'name' => 'approved',
				'label' => 'Approved',
				'description' => 'Request has been approved'
			),
			array(
				'name' => 'rejected',
				'label' => 'Rejected',
				'description' => 'Request has been rejected'
			)
		));
			
	
	}
	
	
	function transitions(){
	
		return $this->prepareTransitions(array(
			array(
				'name' => 'invite',
				'label' => 'Invite Member',
				'description' => 'Invite Member to Join Group',
				'source' => null,
				'destination' => 'pending invite',
				'type' => TRANSITION_NORMAL,
				'callback' => array(&$this, 'inviteMember')
			),
			array(
				'name' => 'request confirm',
				'label' => 'Request Confirmation',
				'description' => 'Request confirmation for details changes',
				'source' => array('pending invite','pending approval','details changed'),
				'destination' => 'details changed',
				'type' => TRANSITION_IF_CHANGED,
				'callback' => array(&$this, 'requestConfirmation')
			),
			array(
				'name' => 'accept invite',
				'label' => 'Accept invitation',
				'description' => 'Accept the invitation to join this group',
				'source' => 'pending invite',
				'destination' => 'approved',
				'type' => TRANSITION_IF_UNCHANGED,
				'callback' => array(&$this, 'acceptInvite')
			),
			array(
				'name' => 'reject invite',
				'label' => 'Reject Invitation',
				'description' => 'Reject invitation to join this group',
				'source' => 'pending invite',
				'destination' => 'rejected',
				'type' => TRANSITION_NORMAL,
				'callback' => array(&$this, 'rejectInvite')
			),
			array(
				'name' => 'confirm changes',
				'label' => 'Confirm Changes',
				'description' => 'Changes are OK',
				'source' => 'details changed',
				'destination' => 'approved',
				'type' => TRANSITION_IF_UNCHANGED,
				'callback' => array(&$this, 'confirmChanges')
			),
			array(
				'name' => 'apply',
				'label' => 'Apply to join',
				'description' => 'Apply to join this group',
				'source' => null,
				'destination' => 'pending approval',
				'type' => TRANSITION_NORMAL,
				'callback' => array(&$this, 'applyToJoin')
			),
			array(
				'name' => 'approve',
				'label' => 'Approve Join Request',
				'description' => 'Approve this join request',
				'source' => 'pending approval',
				'destination' => 'approved',
				'type' => TRANSITION_IF_UNCHANGED,
				'callback' => array(&$this, 'approveJoin')
			)
		));
	}
	
	
	function form(){
		return $this->prepareForm(array(
			array(
				'name' => 'GroupTitle',
				'label' => 'Position Title',
				'description' => 'The role that this member plays in the group.  E.g. Director or Grad Student',
				'defaultValue' => $this->getDefault($this->GroupTitle, 'Member'),
				'type' => 'text'
			)
		));
				
	}
	
	
	function inviteMember($old, $new){}
	function requestConfirmation($old, $new){}
	function acceptInvite($old,$new){}
	function rejectInvite($old,$new){}
	function confirmChanges($old,$new){}
	function applyToJoin($old,$new){}
	function approveJoin($old,$new){}
	
	
	
	
	
	
	

}