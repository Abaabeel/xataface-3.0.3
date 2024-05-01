<?php
/**
 * This action exports the current found set as filemaker XML (FMPXML). 
 * For more information about the grammar, see:
 * http://www.filemakerpro.com/help/12-Import%20export34.html
 * 
 * This action allows Xataface to serve as an XML datasource for Filemaker.
 *  Filemaker can then specify the URL to the Xataface application and
 * import the records directly.
 * 
 * @author Steve Hannah <steve@weblite.ca> @created March 3, 2007
 * @copyright 2008 Steve Hannah
 */
class actions_fmpxmlresult {
	var $cache=array();
	var $recordId = 1;
	function handle(&$params){
                set_time_limit(0);
		$app =& Dataface_Application::getInstance();
                $app->_conf['nocache'] = 1;
		$query =& $app->getQuery();
		if ( $query['-limit'] != 99999 or $query['-skip'] > 0 ){
			
			header('Location: '.$app->url('-limit=99999&-skip=0'));
			exit;
		}
		
		
		$results =& $app->getResultSet();
                import('Dataface/RecordReader.php');
                $rows = new Dataface_RecordReader($query, 100, false);
		$tableSize = $results->cardinality();
		
		header('Content-type: text/xml');
		header('Content-Disposition: attachment; filename="'.$query['-table'].'.fmp.xml"');
		include(dirname(__FILE__).'/fmpxmlresult.tpl.php');
		exit;
	
	}
	
	function &table(){
		$app =& Dataface_Application::getInstance();
		$query =& $app->getQuery();
		$table =& Dataface_Table::loadTable($query['-table']);
		return $table;
	
	}
	
	function fields(){
		if ( !isset($this->cache[__FUNCTION__]) ){
			$table =& $this->table();
			
			$del =& $table->getDelegate();
			if ( isset( $del ) and method_exists($del, 'fmpxmlresult_fields') ){
				$fieldnames = $del->fmpxmlresult_fields();
			} else {
				$fieldnames = array_keys($table->fields(false,true));
			}
			
			$fields = array();
			foreach ( $fieldnames as $fieldname ){
				if ( !$this->canView($fieldname) ) continue;
				$fields[$fieldname] =& $table->getField($fieldname);
			}
			$this->cache[__FUNCTION__] =& $fields;
		}
		return $this->cache[__FUNCTION__];
	}
	
	function canView($fieldname){
		$table =& $this->table();
		$perms = $table->getPermissions(array('field'=>$fieldname));
		return isset($perms['view']);
	}
	
	function _($string){
		$string = str_replace ( array ( '&', '"', "'", '<', '>', '' ), array ( '&amp;' , '&quot;', '&apos;' , '&lt;' , '&gt;', '&apos;' ), $string );
		$app =& Dataface_Application::getInstance();
		if ( $app->_conf['oe'] != 'UTF-8' ) $string = utf8_encode($string);
		return $string;
	}
	
	function getType($field){
		$table =& $this->table();
		if ( ($table->isInt($field['Field']) or $table->isFloat($field['Field'])) and !@$field['vocabulary']){
			return 'NUMBER';
		} else if ( strtolower($table->getType($field['Field'])) == 'time' ){
			return 'TIME';
		} else if ( $table->isDate($field['Field']) ){
			return 'DATE'; 
		} else if ( $table->isBlob($field['Field']) or $table->isContainer($field['Field']) ){
			return 'CONTAINER';
		} else {
			return 'TEXT';
		}
	}
	
	function getRecordId(&$record){
		if ( count($record->_table->keys()) == 1 ){
			list($pkey) = array_keys($record->_table->keys());
			return $record->val($pkey);
		} else {
			return $this->recordId++;
		}
	}

}