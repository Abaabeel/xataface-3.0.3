<?php
class modules_DataGrid {

	function modules_DataGrid(){
		static $tableCreated = false;
		if ( !$tableCreated ){
			$this->createTable();
			$tableCreated = true;
		}
	}
	
	
	/**
	 * @brief The base URL to the datepicker module.  This will be correct whether it is in the 
	 * application modules directory or the xataface modules directory.
	 *
	 * @see getBaseURL()
	 */
	private $baseURL = null;
	/**
	 * @brief Returns the base URL to this module's directory.  Useful for including
	 * Javascripts and CSS.
	 *
	 */
	public function getBaseURL(){
		if ( !isset($this->baseURL) ){
			$this->baseURL = Dataface_ModuleTool::getInstance()->getModuleURL(__FILE__);
		}
		return $this->baseURL;
	}
	
	
	public function registerSkin(){
		df_register_skin('DataGrid', dirname(__FILE__).'/templates');
	}
	
	
	function createTable(){
		$sql = '
			create table if not exists dataface__DataGrids (
				gridID int(11) not null auto_increment,
				gridName varchar(64) not null,
				gridData text,
				tableName varchar(64) not null,
				primary key (gridID)
			)';
		$res = mysql_query($sql, df_db());
		
	}
	
	function getDataGrids($query=array()){
		$app =& Dataface_Application::getInstance();
		$appQuery =& $app->getQuery();
		if ( !@$query['tableName'] ) $query['tableName'] = $appQuery['-table'];
		$grids = df_get_records_array('dataface__DataGrids', $query, null,null,false);
		$out = array();
		foreach ($grids as $grid){
			$out[] = unserialize($grid->val('gridData'));
		}
		return $out;
	}
	
	function getDataGrid($id){
		$res = mysql_query("select * from dataface__DataGrids where gridID='".addslashes($id)."'",df_db());
		if ( !$res) trigger_error(mysql_error(df_db()), E_USER_ERROR);
		if ( mysql_num_rows($res) == 0 ){
			mysql_free_result($res);
			return null;
		}
		$row = mysql_fetch_assoc($res);
		return unserialize($row['gridData']);
	}
	
	function deleteGrid($id){
		$res = mysql_query("delete from dataface__DataGrids where gridID='".addslashes($id)."'",df_db());
		if ( !$res ) trigger_error(mysql_error(df_db()), E_USER_ERROR);
		return true;
	}
	
	function saveDataGrid($grid){
		if ( $grid->id ){
			$idName = 'gridID,';
			$idVal = "'".addslashes($grid->id)."',";
		} else {
			$idName = '';
			$idVal = '';
		}
		$sql = "replace into dataface__DataGrids 
			(".$idName."gridName,gridData,tableName)
			values
			(".$idVal."'".addslashes($grid->name)."',
			'".addslashes(serialize($grid))."',
			'".addslashes($grid->tableName)."')";
			
		$res = mysql_query($sql, df_db());
		if ( !$res ) trigger_error(mysql_error(df_db()), E_USER_ERROR);
		if ( !$grid->id ){
			$grid->id = mysql_insert_id(df_db());
			return $this->saveDataGrid($grid);
		}
		return true;
	}
	
	function createDataGrid($name, $tableName, $columns){
		$grid = new modules_DataGrid_grid;
		$grid->name = $name;
		$grid->tableName = $tableName;
		$grid->columns = $columns;
		return $grid;
	}
	
	
}

class modules_DataGrid_grid {
	var $id;
	var $name;
	var $tableName;
	var $columns;
	
	function getFieldDefs($replace=false){
		$table =& Dataface_Table::loadTable($this->tableName);
		$cols = array();
		foreach ( $this->columns as $column ){
			
			$cols[ $replace ? str_replace('.','-',$column) : $column ] = $table->getField($this->getFieldName($column));
		}
		
		return $cols;
	}
	
	function getFieldIndex($colName){
		if ( strpos($colName, '#') !== false ){
			list($col,$index) = explode('#', $colName);
		} else {
			$index = 0;
		}
		return $index;
	}
	
	/**
	 * For the sake of the data grid we allow column names to include
	 * a suffix of the form #X where X is an integer.
	 * e.g. Schedule.Room#2 would allow editing of the 3rd room record
	 * of the Schedule relationship.  This method simply returns
	 * the field name portion.  i.e. Schedule.Room in our example.
	 *
	 * @param string $colName The name of a column in the data grid.  This 
	 * may include the index suffix.
	 * @return The corresponding field name (i.e. excluding the index suffix).
	 */
	function getFieldName($colName){
		if ( strpos($colName, '#') !== false ){
			list($col,$index) = explode('#', $colName);
		} else {
			$col = $colName;
		}
		return $col;
	}
	
	function buildRow($recordID){
		import('Dataface/XMLTool.php');
		$xmlTool = new Dataface_XMLTool();
		if ( is_a($recordID, 'Dataface_Record') ){
			$record =& $recordID;
		} else {
			$record =& df_get_record_by_id($recordID);
		}
		if ( PEAR::isError($record) ) return $record;
		$row = array();
		$row['__recordID__'] = $record->getId();

		foreach ($this->getFieldDefs() as $colName => $fieldDef ){

			if ( strpos($colName,'#') === false ){
				// No index was provided so index is 0
				$index = 0;
				$fieldName = $colName;
			} else {
				list($fieldName, $index) = explode('#', $colName);
			}
			$row[ str_replace('.','-',$colName) ] = $xmlTool->xmlentities($record->strval( $fieldName, $index));
		}
		return $row;
	}
	
	
	function saveRow($recordID, $row, $secure=false){
		if ( preg_match('/^[0-9]+$/', $recordID) ){
			// This is a new record - its id is only an integer
			$record = new Dataface_Record($this->tableName, array());
		} else {
			$record =& df_get_record_by_id($recordID);
		}
		if ( PEAR::isError($record) ) return $record;
		if ( !$record ) return PEAR::raiseError("The specified record could not be found: ".$recordID);
		
		$localValues = array();
		$relatedValues = array();
		
		// Separate the local values from the related values
		foreach ( $row as $key=>$value ){
			$key = str_replace('-','.',$key);
			if ( strpos($key,'.') === false ){
				$localValues[$this->getFieldName($key)] = $value;
			} else {
				// We have the option of having different related values
				// so we need to split them up also.
				// This allows us to have the phone
				list($relationshipName, $fieldName) = explode('.', $key);
				$relatedValues[$relationshipName][$this->getFieldIndex($key)][$this->getFieldName($fieldName)] = $value;
			}
		}
		
		
		// Save the local values.
		$record->setValues($localValues);
		$res = $record->save(null, $secure);
		if ( PEAR::isError($res) ) return $res;
		
		// Now we save the related values.
		
		$errors = array();
		
		foreach ( $relatedValues as $relationshipName => $relatedRows ){
			foreach ( $relatedRows as $rowNum => $rowValues ){
				$relatedRecords =& $record->getRelatedRecordObjects($relationshipName, $rowNum, 1);
				if ( !$relatedRecords or PEAR::isError($relatedRecord)){
					$relatedRecord = new Dataface_RelatedRecord($record, $relationshipName);
				} else {
					$relatedRecord = $relatedRecords[0];
				}
				//echo 'Setting row values on related record:';
				//print_r($rowValues);
				
				$relatedRecord->setValues($rowValues);
				//print_r($relatedRecord->getValues());exit;
				$res = $relatedRecord->save(null, $secure);
				if ( PEAR::isError($res) ) $errors[] = $res;
				unset($relatedRecord);
				
			}
		}
		
		if ( $errors ) return $errors;
		return $record;
		
		
		
	}
	
	
	function getValuelists($convertToSubarray=false){
		$valuelists = array();
		
		foreach ( $this->getFieldDefs() as $fieldDef ){
			if ( @$fieldDef['vocabulary'] ){
				
				$table =& Dataface_Table::loadTable($fieldDef['tablename']);
				if ( $convertToSubarray ){
					$valuelists[ $fieldDef['vocabulary'] ] = $this->convertToSubarray( $table->getValuelist($fieldDef['vocabulary']) );
				} else {
					$valuelists[ $fieldDef['vocabulary'] ] = $table->getValuelist($fieldDef['vocabulary']);
				}
				unset($table);	
			}
			
		}
		
		return $valuelists;
	
	}
	
	function convertToSubarray($arr){
		$out = array();
		foreach ($arr as $key=>$value){
			$out[] = array($key,$value);
		}
		return $out;
	
	}
	
}