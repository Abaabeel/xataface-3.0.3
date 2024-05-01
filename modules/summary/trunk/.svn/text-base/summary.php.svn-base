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
 * @brief Main summary module class.  This provides the module initialization
 * and utility methods for working with summary fields.
 *
 * @section accessing Accessing this Object
 *
 * All access to this object should be handled by the Dataface_ModuleTool:
 * @code
 * $summary = Dataface_ModuleTool::getInstance()->loadModule('modules_summary');
 * @endcode
 */
class modules_summary {

	/**
	 * @brief Internal cache to store calculated values.
	 */
	private $cache = array();
	
	/**
	 * @brief Caches the base URL of this module.
	 */
	private $baseURL=null;

	public function __construct(){
	
		
	}
	
	
	/**
	 * @brief Decorates the field definition of a summary field.  This will
	 * flesh out missing attributes.  It is called automatically when the
	 * summary fields are loaded for the table the first time.
	 *
	 * @param string $key The field name.
	 * @param array &$field Associative array data structure for the field.  This is modified in place by this method.
	 * @return void
	 */
	public function decorateSummaryField($key, &$field){
		
		if ( !isset($field['widget']) ) $field['widget'] = array();
		if ( !isset($field['widget']['label']) ){
			if ( isset($field['widget:label']) ){
				$field['widget']['label'] = $field['widget:label'];
			} else {
				$field['widget']['label'] = $field['widget:label'];
			}//$key;
		}
	}
	
	
	/**
	 * @brief Returns the base URL to this module's directory.  Useful for including
	 * Javascripts and CSS.
	 *
	 * @return string The Base URL to this module directory.
	 *
	 */
	public function getBaseURL(){
		if ( !isset($this->baseURL) ){
			$this->baseURL = Dataface_ModuleTool::getInstance()->getModuleURL(__FILE__);
		}
		return $this->baseURL;
	}
	
	/**
	 * @brief Returns all of the summary field definitions for a particular 
	 * table.
	 *
	 * @param Dataface_Table $table The table from which we are retrieving the summary
	 * fields.
	 *
	 * @return array Associative array of field definitions.  Each field definition should
	 * contain at least the following values:
	 * @code
	 * array(
	 *	formula => An sql expression for the summary value.
	 * )
	 * @endcode
	 *
	 */
	public function &getSummaryFields(Dataface_Table $table){
		$tablename = $table->tablename;
		
		if ( !isset($this->cache[$tablename]) ){
			$this->cache[$tablename] = array();
		}
		
		$cache =& $this->cache[$tablename];
		if ( !isset($cache['summary_fields']) ){
			$cache['summary_fields'] = array();
			$summary_fields =& $cache['summary_fields'];
			
			foreach ( $table->attributes() as $fieldname=>$field ){
				if ( !is_array($field) ) continue;
				if ( @$field['summary'] ){
					$summary_fields[$fieldname] = $field;
					$this->decorateSummaryField($fieldname, $summary_fields[$fieldname]);
				}
			}
		} else {
			$summary_fields =& $cache['summary_fields'];
		}
		return $summary_fields;
	
	}
	
	
	/**
	 * @brief Returns a summary field definition for a specified field.
	 *
	 * @param Dataface_Table $table The table that we are pulling the field from.
	 * @param string $fieldname The name of the field to retrieve.
	 * @return array The field definition data structure - or null if no such summary
	 * field could be found.
	 */
	public function getSummaryField(Dataface_Table $table, $fieldname){
		$fields =& $this->getSummaryFields($table);
		if ( !isset($fields[$fieldname]) ){
			return null;
		}
		
		return $fields[$fieldname];
	}
	
	
	/**
	 * Gets the SQL query to retrieve the summary for a table.
	 *
	 * @param Dataface_Table $table The table to retrieve the summary for.
	 * @param array $query The query parameters for filtering and sorting.
	 * @param array $groupBy Optional list of column names to group by.
	 * @param array $summaryFields Optional list of summary fields to return.
	 * @param array $graftedSummaryFields Optional associative array of add-on summary field
	 * 		definitions to be used for the purpose of this SQL.
	 * @return string SQL query.
	 */
	public function getSummarySQL(Dataface_Table $table, $query, $groupBy=null, $summaryFields=null, $graftedSummaryFields=null){
		unset($query['-sort']);
		$qb = new Dataface_QueryBuilder($table->tablename, $query);
		
		if ( !$groupBy ){
			$groupBy = '';
		}
		
		if ( !isset($summaryFields) ){
			$summaryFields = array_keys($this->getSummaryFields($table));
		}
		
		$sql = $qb->select($groupBy, $query);
		if ( $groupBy ){
			$gbc = ' group by `'.implode('`,`', $groupBy).'`';
			if ( preg_match('/( LIMIT [\s\S]*)$/i', $sql, $matches) ){
				$sql = preg_replace('/( LIMIT [\s\S]*)$/i', $gbc.'$1', $sql);
			} else {
				$sql .= $gbc;
			}
		} else {
			$sql = preg_replace('/select ([\s\S]*?) from /i', 'select  from ', $sql);
		}
		//echo $sql;
		if ( $summaryFields){
			$pos = stripos($sql, ' from ');
			$sql1 = substr($sql, 0, $pos);
			$sql2 = substr($sql, $pos);
			
			$summaryStr = array();
			foreach ($summaryFields as $fname){
				$field = $this->getSummaryField($table, $fname);
				if ( !$field  and is_array($graftedSummaryFields) ){
					$field = @$graftedSummaryFields[$fname];
				}
				if ( !$field ) continue;
				if ( !@$field['formula'] ) continue;
				
				$summaryStr[] = $field['formula'].' as `'.$fname.'`';
			}
			$summaryStr = implode(', ', $summaryStr);
			$sql = $sql1.($groupBy?',':'').' '.$summaryStr.' '.$sql2;
		}
		return $sql;
	
	}
	
	
	
	
}