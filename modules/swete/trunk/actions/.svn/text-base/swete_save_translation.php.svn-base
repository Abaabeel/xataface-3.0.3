<?php
class actions_swete_save_translation {
	function handle($params=array()){
		
		try {
			if ( !$_POST['--lang'] ) {
				throw new Exception('No language specified in request');
				
			}
			
			if ( !@$_POST['-record-id'] ){
				throw new Exception('No record id specified in request');
				
			}
			
			$record = df_get_record_by_id($_POST['-record-id']);
			
			if ( PEAR::isError($record) ){
				throw new Exception($record->getMessage());
				
			}
			if ( !$record ){
				throw new Exception('Record could not be found');
				
			}
			
			if ( !$record->checkPermission('translate') ){
				throw new Exception('Failed to save record because you have insufficient permissions.  Saving records requires the "translate" permission which your account is currently not granted.  Please contact the system administrator to grant you this permission.');
				
			}
			
			
			
			if ( !@$_POST['-data'] ){
				throw new Exception('No data supplied to save');
				
			}
			
			$data = json_decode($_POST['-data'], true);
			$record->setValues($data);
			$res = $record->save(null, true);
			if ( PEAR::isError($res) ) throw new Exception($res->getMessage());
			
			$outParams = array();
			// Now to see if we want to unlock it
			if ( @$_POST['-unlocked'] ){
				import('Dataface/TranslationTool.php');
				$tt = new Dataface_TranslationTool();
				
				$tt->setTranslationStatus($record, $_POST['--lang'], TRANSLATION_STATUS_EXTERNAL);
				
				$statusRecord = $tt->getTranslationRecord($record, $_POST['--lang']);
				//print_r($statusRecord);
				if ( intval($statusRecord->val('translation_status')) !== intval(TRANSLATION_STATUS_EXTERNAL) ){
					throw new Exception('There was a problem updating the translation status.  No errors were reported, but it appears that the save failed.  Expecting translation status '.TRANSLATION_STATUS_EXTERNAL.' but received '.$statusRecord->val('translation_status').'.');
					
					
				}
				$outParams['status_code'] = $statusRecord->val('translation_status');
				$outParams['status_label'] = $tt->translation_status_codes[$statusRecord->val('translation_status')];
				
				
			}
			
			$outParams['success'] = 1;
			
			$this->response($outParams);
			exit;
		} catch (Exception $ex){
			$this->response(array(
				'error'=>$ex->getMessage()
			));
			exit;
		}
		
	}
	
	function response($params=array()){
		header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
		echo json_encode($params);
	}
}