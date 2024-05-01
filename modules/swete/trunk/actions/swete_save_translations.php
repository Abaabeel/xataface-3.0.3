<?php
class actions_swete_save_translations {
	function handle(&$params){
		$message = json_decode($_POST['--message'], true);
		
		$errs = array();
		$successes = 0;
		foreach ($message as $recordID=>$vals){
			$record = df_get_record_by_id($recordID);
			
			if ( !$record ){
				$errs[] = 'Could not find record with ID '.$recordID;
				unset($record);
				continue;
			}
			
			if ( PEAR::isError($record) ){
				$errs[] = 'Error loading record '.$recordID.': '.$record->getMessage();
				unset($record);
				continue;
			}
			
			
			$record->setValues($vals);
			$res = $record->save(null, true);
			if ( PEAR::isError($res) ) $errs[] = $res->getMessage();
			else $successes++;
			
			
			unset($record);
			unset($res);
			
		}
		
		if ( $errs ){
			$code = 500;
			$msg = $successes.' records were successfully saved, but '.count($errs).' records failed.  The errors are as follows:'."\n\n".implode("\n", $errs);
			header('Content-type: text/json; charset="UTF-8"');
			echo json_encode(array('code'=>$code, 'message'=>$msg));
			exit;
		} else {
			header('Content-type: text/json; charset="UTF-8"');
			echo json_encode(array('code'=>200, 'message'=>$successes.' records successfully saved.'));
			exit;
		}
		
	}
}