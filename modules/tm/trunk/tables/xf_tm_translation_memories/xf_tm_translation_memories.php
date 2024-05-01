<?php
class tables_xf_tm_translation_memories {
	function afterCopy(Dataface_Record $original, Dataface_Record $copy){
		require_once 'modules/tm/lib/XFTranslationMemory.php';
		$tmOriginal = new XFTranslationMemory($original);
		$tmCopy = new XFTranslationMemory($copy);
		$tmCopy->import($tmOriginal);
	}
}