<?php
class actions_swete_translation_template {
	function handle(&$params){
		$query = Dataface_Application::getInstance()->getQuery();
		$table =& Dataface_Table::loadTable($query['-table']);
		if ( PEAR::isError($table) ) return $table;
		
		$translations = $table->getTranslations();
		$lang1 = array_keys($translations);
		if ( !$lang1 ) return PEAR::raiseError("No translations available in this table");
		$lang1 = $lang1[0];
		
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
			'tablename'=>$query['-table']
			),
			'swete_translation_template.html'
		);
		
		
		
	}
}