<?php
class actions_swete_unlock_record {
	function handle(&$params=array()){
		
		if ( !$_POST['--lang'] ) {
			$this->response(array(
				'error'=>'No language specified in request'
			));
			exit;
		}
		
		if ( !@$_POST['-record-id'] ){
			$this->response(array(
				'error'=>'No record id specified in request'
			));
			exit;
		}
		
		$record = df_get_record_by_id($_POST['-record-id']);
		
		if ( PEAR::isError($record) ){
			$this->response(array(	
				'error'=>$record->getMessage()
			));
			exit;
		}
		if ( !$record ){
			$this->response(array(	
				'error'=>'Record could not be found'
			));
			exit;
		}
		
		if ( !$record->checkPermission('translate') ){
			$this->response(array(
				'error'=>'Failed to unlock record because you have insufficient permissions.  Unlocking records requires the "translate" permission which your account is currently not granted.  Please contact the system administrator to grant you this permission.'
			));
			exit;
		}
		
		
		// Now we should be good to go.
		import('Dataface/TranslationTool.php');
		$tt = new Dataface_TranslationTool();
		
		$tt->setTranslationStatus($record, $_POST['--lang'], TRANSLATION_STATUS_EXTERNAL);
		
		$statusRecord = $tt->getTranslationRecord($record, $_POST['--lang']);
		//print_r($statusRecord);
		if ( intval($statusRecord->val('translation_status')) !== intval(TRANSLATION_STATUS_EXTERNAL) ){
			$this->response(array(
				'error'=>'There was a problem updating the translation status.  No errors were reported, but it appears that the save failed.  Expecting translation status '.TRANSLATION_STATUS_EXTERNAL.' but received '.$statusRecord->val('translation_status').'.'
			));
			exit;
		}
		
		
		
		$this->response(array(
			'success'=>1,
			'status_code'=> $statusRecord->val('translation_status'),
			'status_label'=> $tt->translation_status_codes[$statusRecord->val('translation_status')]
		));
		exit;
		
		
		
	}
	
	function response($params=array()){
		header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
		echo json_encode($params);
	}
}