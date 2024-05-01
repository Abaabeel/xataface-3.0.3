<?php
class modules_checkbox_filters {

	private $loaded = false;
	
	/**
	 * @brief The base URL to the module.  This will be correct whether it is in the 
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
	
	
	function block__after_left_column(){
	
		return $this->block__checkbox_filters();
		
	}

	
	function block__aftee2_left_column($params=array()){
		return $this->block__checkbox_filters($params=array());
	}
	
	function block__checkbox_filters(){
		
		$app = Dataface_Application::getInstance();
		$query = $app->getQuery();
		$table = Dataface_Table::loadTable($query['-table']);
		
		$cbfields = array();
		foreach ($table->fields(false, true) as $fname=>$fdef){
			if ( @$fdef['checkbox_filter'] ){
				$cbfields[$fname] = $fdef;
			}
		}
		
		if ( !$cbfields ) return;
		
		if ( !$this->loaded ){
			$this->loaded = true;
			$mt = Dataface_ModuleTool::getInstance();
			// We require the XataJax module
			// The XataJax module activates and embeds the Javascript and CSS tools
			$mt->loadModule('modules_XataJax', 'modules/XataJax/XataJax.php');
			
			$jt = Dataface_JavascriptTool::getInstance();
			$jt->addPath(dirname(__FILE__).'/js', $this->getBaseURL().'/js');
			
			$ct = Dataface_CSSTool::getInstance();
			$ct->addPath(dirname(__FILE__).'/css', $this->getBaseURL().'/css');
			
			// Add our javascript
			$jt->import('xataface/modules/checkbox_filters/checkbox_filters.js');
		
		}
		
		$qb = new Dataface_QueryBuilder($query['-table'], $query);
		foreach ( $cbfields as $col=>$field){
			
			unset($vocab);
			if ( isset($field['vocabulary']) ){
				$vocab =& $table->getValuelist($field['vocabulary']);
				
			} else {
				$vocab=null;
				
			}
			
			$qval = @$query[$col];
			$qval = explode(' OR ', $qval);
			foreach ($qval as $qkey =>$qpart){
				if ( $qpart and $qpart{0} == '=' ){
					$qpart = substr($qpart,1);
				}
				$qval[$qkey] = $qpart;
			}
			$res = df_query("select `$col`, count(*) as `num` ".$qb->_from()." ".$qb->_secure( $qb->_where(array($col=>null)) )." group by `$col`", null, true);
			if ( !$res and !is_array($res)) trigger_error(mysql_error(df_db()), E_USER_ERROR);
			
			
			
			
			else $queryColVal = $qval;
			
			
			
			//while ( $row = mysql_fetch_assoc($res) ){
			echo '<div data-xf-checkbox-filter-field="'.htmlspecialchars($col).'" class="xf-checkbox-filters xf-checkbox-filters-'.htmlspecialchars($col).'">';
			echo '<h3>Filter by '.htmlspecialchars($field['widget']['label']).'</h3>';
			echo '<ul>';
			$dummyRecord = new Dataface_Record($table->tablename, array());
			$del = $table->getDelegate();
			$getColorExists = (isset($del) and method_exists($del, 'getColor'));
			$getBgColorExists = (isset($del) and method_exists($del, 'getBgColor'));
			
			foreach ($res as $row){
				$dummyRecord->setValue($col, $row[$col]);
				
				if ( isset($vocab) and isset($vocab[$row[$col]]) ){
					$val = $vocab[$row[$col]];
				} else {
					$val = $row[$col];
				}
				
				if ( in_array($row[$col], $queryColVal) ) $selected = ' checked';
				else $selected = '';
				
				$color = null;
				$bgColor = null;
				
				if ( $getColorExists ){
					$color = $del->getColor($dummyRecord);
				}
				if ( $getBgColorExists ){
					$bgColor = $del->getBgColor($dummyRecord);
				}	
				
				$style = '';
				if ( $color ){
					$style.= 'color: '.$color.'; ';
				}
				if ( $bgColor ){
					$style .= 'background-color: '.$bgColor.';';
				}
				echo '<li style="'.$style.'" class="xf-checkbox-filter xf-checkbox-filter-'.htmlspecialchars($row[$col]).'"><input type="checkbox" value="'.htmlspecialchars($row[$col]).'"'.$selected.'>'.htmlspecialchars($val).' ('.$row['num'].')</li>';
				
			}
			echo '</ul>';
			echo '<button>Refresh</button>';
			echo '<div style="clear:both">&nbsp;</div>';
			echo '</div>';
			
		}
	
	}
}