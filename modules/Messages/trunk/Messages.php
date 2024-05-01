<?php
class modules_Messages {

	function modules_Messages(){
		$this->createTable();
	}
	
	function createTable(){
	
		$sql = "create table if not exists dataface__messages (
			messageID int(11) not null auto_increment primary key,
			messageClass varchar(100) not null,
			sourceID varchar(128) not null,
			destinationID varchar(128) not null,
			messageData text,
			closed tinyint(1) default 0,
			dateCreated datetime,
			lastModified datetime)";
			
		$res = mysql_query($sql, df_db());
		if ( !$res ) trigger_error(mysql_error(df_db()), E_USER_ERROR);
		
		
			
	
	}
	
	function getMessage($id){
		$message = df_get_record('dataface__messages', array('messageID'=>$id));
		if ( !$message ) return null;
		
		$class = $message->val('messageClass');
		if ( !$class ) return null;
		
		$this->loadMessageClass($class);
		$obj = unserialize($message->val('messageData'));
		$obj->id = $id;
		
		return $obj;
		
	}
	
	
	function saveMessage($message){
		if ( isset($message->id) ){
			$old = $this->getMessage($message->id);
			$record = df_get_record('dataface__messages', array('messageID'=>$message->id));
		} else {
			$old = null;
			$record = new Dataface_Record('dataface__messages', array());
			
		}
		$message->beforeSave($old);
		$record->setValue('messageClass', get_class($message));
		$record->setValue('closed', intval($message->closed));
		$record->setValue('sourceID', $message->sourceID);
		$record->setValue('destinationID', $message->destinationID);
		$record->setValue('messageData', serialize($message));
		if ( !$old ) $record->setValue('dateCreated', date('Y-m-d H:i:s'));
		$record->setValue('lastModified', date('Y-m-d H:i:s'));
		
		$record->save();
		
		
	}
	
	function newMessage($type){
		$this->loadMessageClass($type);
		return new $type;
	}
	
	function loadMessageClass($class){
		$app =& Dataface_Application::getInstance();
		$msgClasses =& $app->_conf['_messages'];
		require_once $msgClasses[$class];
		
	}
	
	function getMessages(&$record, $query=array()){
		$query['destinationID'] = '='.$record->getId();
		$messages = df_get_records('dataface__messages', $query);
		return $messages;
	}
	
	function getOpenMessages(&$record, $query=array()){
		$query['closed'] = 0;
		return $this->getMessages($record, $query);
	}
	
	

}