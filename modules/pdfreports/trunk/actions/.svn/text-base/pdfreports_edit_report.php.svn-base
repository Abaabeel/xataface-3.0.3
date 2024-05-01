<?php
/**
 * Not currently used.
 */
class actions_pdfreports_edit_report {
	function handle($params){
		$context = array();
		$mod = Dataface_ModuleTool::getInstance()->loadModule('modules_pdfreports');
		
		df_register_skin('pdfreports', dirname(__FILE__).'/../templates');
		import('Dataface/JavascriptTool.php');
		
		$jt = Dataface_JavascriptTool::getInstance();
		$jt->addPath(dirname(__FILE__).'/../js', $mod->getBaseURL().'/js');
		$jt->import('xataface/modules/pdfreports/edit_report.js');
		df_display($context, 'xataface/modules/pdfreports/edit_report.html');
	}
}