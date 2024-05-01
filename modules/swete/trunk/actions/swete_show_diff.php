<?php
class actions_swete_show_diff {
	function handle(&$params){
		try {
			if ( !@$_POST['-record-id'] ){
				throw new Exception('No record id specified');
				
			}
			
			if ( !@$_POST['--lang'] ){
				throw new Exception('No language specified');
			}
			
			if ( !@$_POST['-data'] ){
				throw new Exception('No data was supplied with the request for comparison');
			}
			
			
			
			
			$record = df_get_record_by_id($_POST['-record-id']);
			if ( !$record ) throw new Exception("Record could not be found");
			if ( PEAR::isError($record) ) throw new Exception($record->getMessage().' ['.$_POST['-record-id'].']');
			
			if ( !$record->checkPermission('translate') ){
				throw new Exception("Could not get difference between translations because you don't have sufficient permissions.  Please contact the system administrator and have him grant you the 'translate' permission.");
				
			}
			
			
			$out = array();
			$data = json_decode($_POST['-data'], true);
			import('Text/Diff.php');
			import('Text/Diff/Renderer/inline.php');
			
			$renderer = new Text_Diff_Renderer_inline();
			//foreach ($vals2 as $key=>$val ){
			//	$diff = new Text_Diff(explode("\n", @$vals1[$key]), explode("\n", $val));
				
			//	$vals_diff[$key] = $renderer->render($diff);
			//}
			foreach ( $data as $k=>$v){
				$diff = new Text_Diff(explode("\n", $record->strval($k)), explode("\n", $v));
				$out[$k] = array('database'=>$record->strval($k), 'swete'=>$v, 'diff'=> $renderer->render($diff));
				
			}
			
			$this->response(array(
				'success'=>1,
				'diff'=>$out
			));
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