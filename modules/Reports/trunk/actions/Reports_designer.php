<?php
/**
 * Action to access the reports designer for the current table.
 *
 * @created July 6, 2009
 * @author Steve Hannah
 *
 * License:  See http://xataface.com/license
 */
class actions_Reports_designer {
	function handle(&$params){
		$app =& Dataface_Application::getInstance();
		$query =& $app->getQuery();
		
		
		// Build the template context
		$context = array();
		$context['baseURL'] = df_absolute_url(DATAFACE_URL.'/modules/Reports');
		
		$table =& Dataface_Table::loadTable($query['-table']);
		
		// Step 1: Build the fields array
		$fields = array();
		foreach ( $table->fields(false,true) as $fname => $field ){
			$fields[$fname] = array(
				'name' => $fname,
				'label' => $field['widget']['label']
			);
		}
		
		foreach ($table->delegateFields(true) as $fname => $field ){
			$fields[$fname] = array(
				'name' => $fname,
				'label' => $field['widget']['label']
			);
		}
		
		ksort($fields);
		$context['json_fields'] = json_encode($fields);
		
		
		// Step 2: Build the relationships array
		$relationships = array();
		foreach ($table->relationships() as $rname => $r ){
			$relationships[$rname] = array(
				'name' => $rname,
				'label' => $rname,
				'fields' => array()
			);
			
			foreach ( $r->fields(true) as $fname){
				$field =& $r->getField($fname);
				$relationships[$rname]['fields'][$fname] = array(
					'name' => $fname,
					'label' => $field['widget']['label']
				);
				unset($field);
			}
		}
		$context['json_relationships'] = json_encode($relationships);
		
		
		df_register_skin('Reports', dirname(__FILE__).'/../templates');
		df_display($context, 'Reports/designer.html');
	}
	
}