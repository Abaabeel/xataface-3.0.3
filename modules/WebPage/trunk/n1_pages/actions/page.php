<?php

class tables_n1_pages_actions_page {
	function handle(&$params){
		$app =& Dataface_Application::getInstance();
		$page = $app->getRecord();
		df_register_skin('page_templates', dirname(__FILE__).'/../templates');
		
		if ( !$page ){
			header('Status: 404 Not Found');
			df_display(array(), 'common/404.html');
		} else {
			df_display(array('page'=>$page), 'pages/page.html');
		}
	}
}	