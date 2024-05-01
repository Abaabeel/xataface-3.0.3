<?php
class actions_new_message {
	function handle(&$params){
		
		$app =& Dataface_Application::getInstance();
		$query =& $app->getQuery();
		
		if ( !isset($query['--messageType']) ) return PEAR::raiseError("No message type specified");
		if ( !isset($query['--sourceID']) ) return PEAR::raiseError("No source ID specified");
		if ( !isset($query['--destinationID']) ) return PEAR::raiseError("No destination ID specified");
		
		
		
		$mt =& Dataface_ModuleTool::getInstance();
		$mod =& $mt->loadModule('modules_Messages');
		if ( PEAR::isError($mod) ) return $mod;
		$message = $mod->newMessage($query['--messageType']);
		$message->sourceID = $query['--sourceID'];
		$message->destinationID = $query['--destinationID'];
		
		$form =& $message->buildEditForm();
		$form->addElement('hidden','-action', 'new_message');
		if ( isset($query['--redirect']) ) $form->addElement('hidden','--redirect',$query['--redirect']);
		
		
		if ( $form->validate() ){
			$res = $form->process(array(&$message, 'processForm'), true);
			if ( isset($query['--redirect']) ) $url = $query['--redirect'];
			else $url = $app->url('-action=list');
			
			$msg = urlencode('Message successfully sent');
			header('Location: '.$url.'&--msg='.$msg);
			exit;
			
		}
		echo $form->display();
	}

}