<?php
class actions_DataGrid_datastore_xml {
	
	function handle(&$params){
		$app =& Dataface_Application::getInstance();
		$query =& $app->getQuery();
		
		$mt =& Dataface_ModuleTool::getInstance();
		$mod =& $mt->loadModule('modules_DataGrid');
		if ( PEAR::isError($mod) ) return $mod;
		
		$dataGrid = $mod->getDataGrid($query['-gridid']);
		if ( !$dataGrid ) return PEAR::raiseError("Error, the specified data grid could not be found");
		
		import('Dataface/XMLTool.php');
		$xmlTool = new Dataface_XMLTool();
		
		$records = df_get_records_array($query['-table'], $query, null, null, false);
		
		$rows = array();
		foreach ($records as $record){
			$row = array();
			$row['__recordID__'] = $record->getId();

			foreach ($dataGrid->getFieldDefs() as $colName => $fieldDef ){

				if ( strpos($colName,'#') === false ){
					// No index was provided so index is 0
					$index = 0;
					$fieldName = $colName;
				} else {
					list($fieldName, $index) = explode('#', $colName);
				}
				$row[ str_replace('.','-',$colName) ] = $xmlTool->xmlentities($record->strval( $fieldName, $index));
			}
			$rows[] = $row;
			unset($record);
			
			
		}
		header("Content-type: application/xml; charset=".$app->_conf['oe']);
		df_register_skin('DataGrid', DATAFACE_PATH.'/modules/DataGrid/templates');
		df_display(array('rows'=>&$rows), 'DataGrid/datastore.xml');
		exit;
		
	}
}