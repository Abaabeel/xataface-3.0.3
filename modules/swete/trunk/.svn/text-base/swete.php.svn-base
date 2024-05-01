<?php
class modules_swete {
	
	
	function block__before_edit_record_form(){
		import('Dataface/LanguageTool.php');
		$app = Dataface_Application::getInstance();
		
		$baseLang = $app->_conf['default_language'];
		if ( $baseLang == $app->_conf['lang'] ) return;
		$lt= Dataface_LanguageTool::getInstance();
		$baseLang = $lt->getLanguageLabel($baseLang);
		$baseLangURL = $app->url('-lang='.$app->_conf['default_language']);
	
		echo <<<END
		<div class="portalMessage">
		<p>This application is currently set up to be managed by <a href="http://swete.weblite.ca">Web Lite SWeTE</a> which is
		incompatible with editing translated languages directly in Xataface.  Please edit records in {$baseLang} only, and use
		the translation form for translating records into the target language.</p>
		<p><a href="$baseLangURL">Switch to {$baseLang} now</a></p>
		</div>
END;
		
	}
	
	
	function block__before_new_record_form(){
		return $this->block__before_edit_record_form();
	}
}