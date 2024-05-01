<?php
class modules_NavMenu {
	public function __construct(){
		
	}
	
	private function createTable(){
		$res = mysql_query("create table if not exists dataface__menus (
				menu_id int(11) not null auto_increment primary key,
				menu longtext,
				`language` varchar(2),
				`username` varchar(32),
				`dirty` tinyint(1) default 0,
				`dependencies` varchar(255),
				`last_modified` datetime
				)", df_db());
		if ( !$res ) throw new Exception(mysql_error(df_db()));
	}
	
	public function buildMenu($params=array()){
		import(dirname(__FILE__).'/lib/Dataface_Menu.php');
		$menu = new Dataface_Menu();
		$app =& Dataface_Application::getInstance();
		$query =& $app->getQuery();
		$table = isset($params['table'])?$params['table']:$query['-table'];
		$tdel =& Dataface_Table::loadTable($table)->getDelegate();
		if ( $tdel and method_exists($tdel, 'buildMenu') ){
			$tdel->buildMenu($menu);
			if ( !isset($menu->dependencies[$table]) ) $menu->dependencies[$table] = 1;
			return $menu;
		}
		
		$del =& $app->getDelegate();
		if ( $del and method_exists($del, 'buildMenu') ){
			$del->buildMenu($menu);
			return $menu;
		} else {
			$tables = array();
			if ( isset($app->_conf['modules_NavMenu']) ){
				$conf = $app->_conf['modules_NavMenu'];
				
				if ( isset($conf['tables']) ){
					$tables = explode(',', $conf['tables']);
					
				} else {
					$tables = array_keys($app->_conf['_tables']);
				}
			}
			
			foreach ($tables as $t){
				
				$tableObj =& Dataface_Table::loadTable($t);
				$tdel =& $tableObj->getDelegate();
				if ( $tdel and method_exists($tdel, 'extendMenu') ){
					$tdel->extendMenu($menu);
					if ( !isset($menu->dependencies[$t]) ) $menu->dependencies[$t] = 1;
				} else {
					$recs = df_get_records_array($t, array('-limit'=>1000));
					
					foreach ($recs as $r){
						if ( $r->checkPermission('link') and $r->checkPermission('view') and $r->checkPermission('menu')){
							// We only include this item in the menu if the user has
							// all of link, view, and menu permissions
							if ( $tdel and method_exists($tdel, 'getMenuItem') ){
								$mi = $tdel->getMenuItem($r);
								if ( $mi ){
									$label = @$mi['label']?$mi['label']:$r->getTitle();
									$url = @$mi['url']?$mi['url']:$r->getPublicLink();
									$miObj = $menu->newMenuItem($label, $url);
									if ( !isset($menu->dependencies[$t]) ) $menu->dependencies[$t]=1;
									
								}
							} else {
							
								$miObj = $menu->newMenuItem($r->getTitle(), $r->getPublicLink());
								if ( !isset($menu->dependencies[$t]) ) $menu->dependencies[$t] = 1;
							}
							
						}
					}
				}
			}
		}
		
		return $menu;
	
	}
	
	
	
	
	
	public function block__modules_NavMenu_menu($params=array()){
		$menu = $this->loadMenu($params);
		echo $menu->toHtml();
	}
	
	private function loadMenu($params=array()){
		$lang = isset($params['lang'])?$params['lang']:Dataface_Application::getInstance()->_conf['lang'];
		if ( class_exists('Dataface_AuthenticationTool') ){
			$username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
		} else {
			$username = '';
		}
		$menuRec = df_get_record('dataface__menus', array('language'=>'='.$lang, 'username'=>'='.$username));
		
		
		if ( $this->isDirty($menuRec) ){
			$menu = $this->buildMenu($params);
			$this->saveMenu($menu, $params, $menuRec);
			return $menu;
		}
		if ( $menuRec ){
			import(dirname(__FILE__).'/lib/Dataface_Menu.php');
			$menu = unserialize($menu->val('menu'));
			return $menu;
		}
	}
	
	
	private function isDirty(Dataface_Record $menuRec){
		if ( $menuRec ) return true;
		else if ( !$menuRec or $menuRec->val('dirty') or $this->dependencyModTime($menuRec)>strtotime($menuRec->strval('last_modified')) ){
			return true;
		} else {
			return false;
		}
	}
	
	private function dependencyModTime(Dataface_Record $menuRec){
		$tables = explode(' ', $menuRec->val('dependencies') );
		$modTimes = Dataface_Table::getTableModificationTimes();
		$time = 0;
		foreach ($tables as $table){
			if ( @$modTimes[$table]>$time ) $time = $modTimes[$table;
		}
		return $time;
		
	}
	
	private function saveMenu($menu, $params=array(), $menuRec=null){
		if ( !isset($menuRec) ){
			$lang = isset($params['lang'])?$params['lang']:Dataface_Application::getInstance()->_conf['lang'];
			if ( class_exists('Dataface_AuthenticationTool') ){
				$username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
			} else {
				$username = '';
			}
			$menuRec = new Dataface_Record('dataface__menus', array());
			$menuRec->setValues(array(
				'language'=>$lang,
				'username'=>$username
			));
				
			
		}
		
		$menuRec->setValues(array(
			'menu'=>serialize($menu),
			'dependencies'=>implode(' ', array_keys($menu->dependencies)),
			'last_modified'=>date('Y-m-d H:i:s'),
			'dirty'=>0
		));
		$menuRec->save();
	}
	
	public function setDirty(){
		$res = mysql_query("update dataface__menus set dirty=1", df_db());
		if ( !$res ) throw new Exception(mysql_error(df_db()));
		
	
	}
	
	
	
	
	
}