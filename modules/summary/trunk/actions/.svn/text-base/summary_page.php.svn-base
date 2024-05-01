<?php
/*
 * Xataface Summary Module
 * 
 * Copyright (C) 2011  Steve Hannah <shannah@sfu.ca>
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 */
 
/**
 * @brief This HTML action displays the summary list for a particular table.  It 
 * respects all normal Xataface URL query parameters in addition to 2 custom
 * parameters:
 *
 * @param string -group-by  A comma-delimited list of fields on which to group the summaries by.
 * @param string -summary-cols A comma-delimited list of summary columns to display.
 *
 * @section templates Templates
 *
 * This action uses the xataface/modules/summary/main.html template which
 * extends Dataface_Main_Template.html
 *
 * It is located in the templates directory of this module and can be overridden
 * in the application templates directory just like any other template.
 *
 * @section javascripts Javascript
 *
 * This action uses the Dataface_JavascriptTool to manage its javascript dependencies.  Its
 * main javascript file (which registers its own dependencies) is located at
 * js/xataface/modules/summary/summary-page.js.
 *
 * @section css CSS
 *
 * This action uses the Dataface_CSSTool class to manage its CSS dependencies.  Its
 * main CSS file is located at css/xataface/modules/summary/main_summary_page.css
 *
 * @section permissions Permissions
 *
 * This action requires the "summary" permission in order to access it.  The module assigns
 * this permission only to the ADMIN, and MANAGER roles by default.  You must manually add 
 * this permission to any role that you wish to have access.
 *
 * @attention Users must also be granted the "summary view" and "summary group" permissions
 * on each field that you want them to be able to see in the summary section.  You should
 * assign this at the table level.
 *
 */ 
class actions_summary_page {

	/**
	 * @private
	 * @brief Reference to the current Dataface_Table object.
	 */
	private $table;
	
	/**
	 * @private
	 * @brief Reference to the associative array of available group functions.
	 */
	private $groupFuncs;
	
	/**
	 * @private
	 * @brief Reference to the summary module object (i.e. modules_summary)
	 */
	private $mod;
	
	/**
	 * @private 
	 * @brief Reference to the array of summary columns that are currently selected to be displayed.
	 */
	private $selectedSummaryCols;
	
	/**
	 * @private
	 * @brief Reference to the array of columns on which the summaries should be grouped.
	 */
	private $groupBy;


	/**
	 * @brief Entry point for the action.
	 */
	function handle($params){
	
		$app = Dataface_Application::getInstance();
		$query = $app->getQuery();
		$mod = Dataface_ModuleTool::getInstance()->loadModule('modules_summary');
		$this->mod = $mod;
		
		// Now work on our dependencies
		$mt = Dataface_ModuleTool::getInstance();
		
		// We require the XataJax module
		// The XataJax module activates and embeds the Javascript and CSS tools
		$mt->loadModule('modules_XataJax', 'modules/XataJax/XataJax.php');
		
		$jt = Dataface_JavascriptTool::getInstance();
		$jt->addPath(dirname(__FILE__).'/../js', $mod->getBaseURL().'/js');
		
		$ct = Dataface_CSSTool::getInstance();
		$ct->addPath(dirname(__FILE__).'/../css', $mod->getBaseURL().'/css');
		
		// Add our javascript
		$jt->import('xataface/modules/summary/summary-page.js');
		
		
		$table = Dataface_Table::loadTable($query['-table']);
		$this->table = $table;
		
		// Let's get all of the table columns
		$fields = $table->fields(false, true, false);
		$summaryFields = $mod->getSummaryFields($table);
		
		
		$groupableFields = array();
		$summarizableFields = array();
		$temp = array();
		
		foreach ($summaryFields as $k=>$v){
			$perms = $table->getPermissions(array('field'=>$k));
			if ( @$perms['summary view']){
				$temp[$k] = $v;
			}
			
		}
		$summaryFields = $temp;
		
		
		foreach ($fields as $k=>$v){
			$perms = $table->getPermissions(array('field'=>$k));
			if ( @$perms['summary group'] and @$perms['summary view'] ){
				$groupableFields[$k]=$v;
			}
			if ( @$perms['summary view'] ){
				$summarizableFields[$k] = $v;
				
			}
		}
		
		$groupFuncs = array(
			'min'=>array(
				'label'=>'Min',
				'description'=>'Show minimum value in set.',
				'param'=>'min(%s)',
				'types'=>array(
					'all'
				)
			),
			'max'=>array(
				'label'=>'Max',
				'description'=>'Show the maximum value in set.',
				'param'=>'max(%s)',
				'types'=>array(
					'all'
				)
			),
			'avg'=>array(
				'label'=>'Avg',
				'description'=>'Show the average value of this column in the set.',
				'param'=>'avg(%s)',
				'types'=>array(
					'all'
				)
			),
			'sum'=>array(
				'label'=>'Sum',
				'description'=>'Show the sum of all rows for this column.',
				'param'=>'sum(%s)',
				'types'=>array(
					'all'
				)
			),
			'count'=>array(
				'label'=>'Count',
				'description'=>'Counts the number of rows in teh set.',
				'param'=>'count(%s)',
				'types'=>array('all')
			
			),
			'count-distinct',array(
				'label'=>'Count (distinct)',
				'description'=>'Counts the number of distinct values in this column in the set.',
				'param'=>'count(distinct %s)',
				'types'=>array('all')
			),
			'std'=>array(
				'label'=>'Std',
				'description'=>'Standard deviation of this column in the set.',
				'param'=>'std(%s)',
				'types'=>array('all')
			)
		);
		
		$this->groupFuncs =& $groupFuncs;
		
		
		
		
		// Now for the result set
		
		$groupBy = array();
		if ( @$_GET['-group-by'] ){
			$groupBy = explode(',', $_GET['-group-by']);
			
		}
		foreach ($groupBy as $key=>$val){
			if ( !isset($groupableFields[$val]) ){
				unset($groupBy[$key]);
			}
		}
		
		$this->groupBy =& $groupBy;
		
		$selectedSummaryCols = null;
		if ( @$_GET['-summary-cols'] ){
			$selectedSummaryCols = explode(',', $_GET['-summary-cols']);
		}
		if ( !$selectedSummaryCols ){
			$selectedSummaryCols = array_keys($mod->getSummaryFields($table));
			
		}
		$this->selectedSummaryCols =& $selectedSummaryCols;
		$graftedSummaryColumnDefs = array();
		
		if ( $selectedSummaryCols ){
			foreach ($selectedSummaryCols as $key=>$col){
				if ( preg_match('/^([^\)]+)\(([^\)]+)\)$/', $col, $matches) ){
					// THis is a calculated field passed through the GET parameters
					// so we need to parse it out and add it as a proper summary field.
					$paramField = $matches[2];
					$funcName = $matches[1];
					
					if ( !isset($groupFuncs[$funcName]) ){
						unset($selectedSummaryCols[$key]);
						continue;
					}
					
					if ( !isset($summarizableFields[$paramField]) ){
						unset($selectedSummaryCols[$key]);
						continue;
					}
					
					$fieldDef =& $summarizableFields[$paramField];
					
					$graftedSummaryColumnDefs[$paramField.'__'.$funcName] = array(
						'formula'=> sprintf($groupFuncs[$funcName]['param'], '`'.$paramField.'`'),
						'widget'=>array('label'=>$groupFuncs[$funcName]['label'].'('.$fieldDef['widget']['label'].')'),
						'name'=>$paramField.'__'.$funcName
					);
					unset($selectedSummaryCols[$key]);
					$selectedSummaryCols[] = $paramField.'__'.$funcName;
					
					
				}
			}
		}
		
		$summaryFieldsRef =& $mod->getSummaryFields($table);
		
		foreach ($graftedSummaryColumnDefs as $key=>$val){
			$summaryFieldsRef[$key] = $val;
		}
		
		//print_r($graftedSummaryColumnDefs);
		if ( $selectedSummaryCols ){
			$sql = $mod->getSummarySQL($table, $query, $groupBy, $selectedSummaryCols);
			//echo $sql;exit;
			$res = mysql_query($sql, df_db());
			if ( !$res ){
				throw new Exception(mysql_error(df_db()));
			}
			$rows = array();
			while ($row = mysql_fetch_assoc($res) ){
				$rows[] = $row;
			}
			@mysql_free_result($res);
		} else {
			$rows = array();
		}
		
		
		
		if ( @$_GET['--format'] == 'csv' ){
			
			$groupBy = $groupBy?$groupBy:array();
			$fh = tmpfile();
			$headerRow = array();
			
			foreach ($groupBy as $col){
				$headerRow[] = $this->getFieldLabel($col);
				
			}
			
			foreach ($this->getSelectedSummaryColumns() as $col){
				$headerRow[] = $this->getSummaryLabel($col);
			}
			//echo "here";exit;
			fputcsv($fh, $headerRow);
			foreach ($rows as $row){
				$r = array();
				foreach ($row as $ckey=>$cell){
					$r[] = $this->getCellValue($ckey, $cell);
				}
				fputcsv($fh, $r);
			}
			
			rewind($fh);
			header('Content-type: text/csv; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
			header('Content-disposition: attachment; filename="'.addslashes($this->table->getLabel()).'-Summary-'.time().'.csv"');
			fpassthru($fh);
			exit;
		}
		
		
		$context = array(
			'summaryFields'=>$summaryFields,
			'groupableFields'=>$groupableFields,
			'summarizableFields'=>$summarizableFields,
			'groupFuncs'=> $groupFuncs,
			'self'=>$this,
			'rows'=>$rows,
			'numResults'=>$app->getResultSet()->found(),
			'table'=>$table,
				
			'groupBy'=>($groupBy?$groupBy:array())
		);
		
		df_register_skin('modules_summary', dirname(__FILE__).'/../templates');
		df_display($context, 'xataface/modules/summary/main.html');
			
			
		
		
		
		
		
	}
	
	
	/**
	 * @brief Utility function to check if a particular aggregate function is 
	 * supported on a particular column/field.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to decide which options to provide in the summary fields select list.
	 *
	 * @param string $fieldname The name of the field to check.
	 * @param string $funcname The name of the function we are checking for eligibility.
	 * @return boolean True if the given field can have the given function applied to it.
	 */
	function supports($fieldname, $funcname){
		$func = @$this->groupFuncs[$funcname];
		if ( !$func ) return false;
		if ( !@$func['types'] ) return false;
		if ( !is_array($func['types']) ) return false;
		
		if ( $this->table->exists($fieldname) ){
			if ( in_array('all', $func['types']) ) return true;
			if ( ($this->table->isInt($fieldname) or $this->table->isFloat($fieldname)) and in_array('numeric', $func['types']) ){
				return true;
			}
		} else {
			$sf =& $this->mod->getSummaryFields($this->table);
			if ( !isset($sf[$fieldname]) ) return false;
			if ( in_array('formula', $func['types']) ){
				return true;
			}
		}
		return false;
		
	}
	
	/**
	 * @brief Utility method to get the label for a particular summary column on the current table.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to display the column headings.
	 *
	 * For the sake of this action, summary columns generated with a wrapping function (e.g. max(colname))
	 * are given a calculated column name in the form: colname__funcname
	 *
	 * E.g. max(amount) would have the name amount__max for the purpose of this method's $col parameter.
	 *
	 *
	 * @param string $col The name of the column for which to retrieve the label.
	 * @return string The column label.
	 */
	function getSummaryLabel($col){
		$f =& $this->mod->getSummaryField($this->table, $col);
		if ( $f and @$f['label'] ) return $f['label'];
		if ( $f and @$f['widget'] and @$f['widget']['label'] ) return $f['widget']['label'];
		
		return $col;
	}
	
	
	/**
	 * @brief Utility function to retrieve the label of a regular table column.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to display the column headings.
	 *
	 * @param string $col The name of the field/column whose label we wish to retrieve.
	 * @return string The field label.
	 */
	function getFieldLabel($col){ 
		$f = $this->table->getField($col);
		if ( $f and @$f['widget']['label'] ){
			return $f['widget']['label'];
		}
		return $col;
	}
	
	/**
	 * @brief Checks whether a particular field is one of the currently selected
	 * group-by fields.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to show which of the grouped-by fields are selected in the select list.
	 *
	 * @param string $fieldname The name of the field to check.
	 *
	 * @return boolean True if the field is one of the currently selected group-by fields.
	 */
	function isSelectedGroupField($fieldname){
		return in_array($fieldname, $this->groupBy);
	}
	
	/**
	 * @brief Checks whether a paricular field (and optionally function) are currently
	 * selected to be included as a column in the summary stats list.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to decide which of the possible summary fields should be selected in the 
	 * select list.
	 *
	 * @param string $fieldname The name of the field to check.
	 * @param string $func The name of the function to apply to the field.
	 * @return boolean True if the field/function is selected in the select list (or should be).
	 */
	function isSelectedSummaryField($fieldname, $func=null){
		if ( !is_array($this->selectedSummaryCols) ) return false;
		if ( isset($func) ){
			$fieldname .= '__'.$func;
		}	
		return in_array($fieldname, $this->selectedSummaryCols);
	}
	
	/**
	 * @brief Convenience method to fetch a value from an associative array.
	 *
	 * This is used from within the xataface/modules/summary/main.html template
	 * to show which of the grouped-by fields are selected in the select list.
	 *
	 * @param array $array The associative array from which to retrieve the value.
	 * @param string $key The key of the array to retrieve.
	 * @return mixed The value (same as $array[$key])
	 */
	function get($array, $key){ return $array[$key]; }
	
	/**
	 * @brief Returns an array of the currently selected summary columns.
	 * @return array(string)
	 */
	function getSelectedSummaryColumns(){ 
		//print_r($this->selectedSummaryCols);
		return $this->selectedSummaryCols;
	}
	
	
	function getCellValue($fieldname, $value){
		if ( $this->table->hasField($fieldname) ){
			$rec = new Dataface_Record($this->table->tablename, array($fieldname=>$value));
			return $rec->display($fieldname);
		} else {
			return $value;
		}
	}
	
	function explainQueryParam($label, $value){
		$l = $label;
		$v = $value;
		$fc = $v{0};
		if ( $fc == '=' ){
			if ( strlen($v)===1 ){
				return $l.' is blank';
			}
			return  $l.' = "'.substr($v,1).'"';
		} else if ( $fc == '>' and @$v{1} != '='){
			if ( strlen($v)===1 ){
				return  $l.' is not blank';
			}
			return  $l.' > "'.substr($v,1).'"';
		} else if ( $fc == '<' and @$v{1} != '=' ){
			return  $l.' < "'.substr($v,1).'"';
		} else if ( $fc == '>' and @$v{1} == '='){
			
			return  $l.' >= "'.substr($v,2).'"';
		} else if ( $fc == '<' and @$v{1} == '=' ){
			return $l.' <= "'.substr($v,2).'"';
		} else if ( $fc == '~' ){
			return $l.' matches pattern "'.substr($v,1).'"';
		} else if ( $parts = explode('..', $v) and count($parts) > 1 ){
			return $l.' is between "'.$parts[0].'" and "'.$parts[1].'"';
		} else if ( $this->table->isInt($k) or $this->table->isFloat($k) ){
			return $l.' = '.$v;
		} else {
			return $l.' contains "'.$v.'"';
		}
	
	}
	
	function getCurrentFilters(){
		$app = Dataface_Application::getInstance();
		$query = $app->getQuery();
		
		$filter = array();
		foreach ($query as $k=>$v){
			if ( !isset($v) or $v === '' ) continue;
			if ( $this->table->hasField($k) ){
				
			
				$fld = $this->table->getField($k);
				$l = $fld['widget']['label'];
				$filter[$k] = $this->explainQueryParam($l, $v);
				
				
			} else if ( strpos($k,'/') !== false ){
				// We may have a related field query.
				list($rel,$fld) = explode('/', $k);
				if ( $this->table->hasRelationship($rel) ){
					$relObj = $this->table->getRelationship($rel);
					if ( $relObj->hasField($fld, true) ){
						$fldDef = $relObj->getField($fld);
						if ( PEAR::isError($fldDef) ) continue;
						$l = $fldDef['widget']['label'];
						$filter[$k] = $relObj->getLabel().' contains a related record with '.$this->explainQueryParam($l, $v); 
						
					}
				}
			
			}
		}
		return $filter;
	}
}