<?php
class actions_swete_translation_template {
	var $tt;
	var $statuses = array();
	function handle(&$params){
		import('Dataface/TranslationTool.php');
		$this->tt = new Dataface_TranslationTool();
		$query = Dataface_Application::getInstance()->getQuery();
		$table =& Dataface_Table::loadTable($query['-table']);
		if ( PEAR::isError($table) ) return $table;
		
		$translations = $table->getTranslations();
		$lang1 = array_keys($translations);
		if ( !$lang1 ) return PEAR::raiseError("No translations available in this table");
		$lang1 = $lang1[0];
		$translationCodes = array_keys($translations);
		
		// Get the names of the columns in this table that contain translations.
		$cols = $table->getTranslation($lang1);
		
		import('Dataface/QueryBuilder.php');
		
		
		$qb = new Dataface_QueryBuilder($query['-table']);
		$sql = $qb->select($cols, $query);
		$res = mysql_query($sql, df_db());
		$rows = array();
		while ($row = mysql_fetch_assoc($res) ){
			$rec = new Dataface_Record($table->tablename, $row);
			$rows[] = $rec;
			unset($rec);
		}
		@mysql_free_result($res);
		
		df_register_skin('swete', dirname(__FILE__).'/../templates');
		
		df_display(array(
			'rows'=>$rows,
			'cols'=>$cols,
			'tablename'=>$query['-table'],
			'languages'=>$translationCodes,
			'self'=>$this
			),
			'swete_translation_template.html'
		);
		
		
		
	}
	
	function getStatus($record, $lang){
		$id = $record->getId();
		if ( !isset($this->statuses[$id.'-'.$lang]) ){
			$this->statuses[$id.'-'.$lang] = $this->tt->getTranslationRecord($record, $lang);
		}
		//echo "For ".$record->getId()." lang: ".$lang;
		//print_r($this->statuses[$id.'-'.$lang]->vals());
		return $this->statuses[$id.'-'.$lang];
	}
	
	function getStatusString($record, $lang){
		$s = $this->getStatus($record, $lang);
		return $this->tt->translation_status_codes[$s->val('translation_status')];
	}
	
	function getStatusCode($record, $lang){
		return $this->getStatus($record, $lang)->val('translation_status');
	}
	
	function isLocked($record, $lang){
		$status = $this->getStatus($record, $lang);
		switch ( $status->val('translation_status') ){
			case TRANSLATION_STATUS_UNTRANSLATED:
			case TRANSLATION_STATUS_MACHINE:
			case TRANSLATION_STATUS_NEEDS_UPDATE_MACHINE:
			case TRANSLATION_STATUS_EXTERNAL:
				return 0;
			default:
				return 1;
		}
	}
	
	function getStatusCaption($record, $lang){
		if ( $this->isLocked($record, $lang) ){
			return 'Locked';
		} else {
			return 'Translatable';
		}
		
	}
	
	function getLockedReason($record, $lang){
		$status = $this->getStatus($record, $lang);
		switch ( $status->val('translation_status') ){
			case TRANSLATION_STATUS_UNKNOWN:
				return 'The translation status of this record is unknown.';
				
			case TRANSLATION_STATUS_SOURCE:
				return 'The translation status of this record is set to "Source" which means that the '.$lang.' translation is the original content.';
			case TRANSLATION_STATUS_UNVERIFIED:
				return 'This record has been modified manually so there could be translations that would be lost if SWeTE tried to overwrite the existing translation with one managed by SWeTE.';
			case TRANSLATION_STATUS_APPROVED:
				return 'This translation is marked as APPROVED and cannot be overwritten in this state.';
				
			case TRANSLATION_STATUS_NEEDS_UPDATE:
				return 'This translation, though out of date, is marked as human translated in Xataface SWeTE is not sure if it can safely overwrite it.';
				
			case TRANSLATION_STATUS_NEEDS_UPDATE_UNVERIFIED:
				return 'This translation has been modified manually though it is out of date and requires verification.  It cannot safely be overwritten.';
			
			default:
				return '';
		}
	}
}