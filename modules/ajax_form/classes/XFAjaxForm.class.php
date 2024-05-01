<?php
/**
 * @brief A class for building AJAX web forms.
 */
class XFAjaxForm {
	
	/**
	 * @brief Flag to indicate whether this is a new record form.
	 */
	private $_new = false;
	
	/**
	 * @brief The record that is being edited.  This can either be 
	 * a Dataface_Record or a Dataface_RelatedRecord
	 */
	private $record = null;
	
	/**
	 * @brief Array of subrecords involved in this form.  This will be structured
	 * as a multi-dimensional array:
	 *	array($relationshipName:string => array( $rowIndex:int => $record:Dataface_RelatedRecord ))
	 */
	private $subrecords = array();
	
	/**
	 * @brief Array of flags indicating which subrecords are new records
	 * and which ones are existing records.  This array structure should 
	 * mirror the strucure of the $subrecords array.  I.e.
	 * array($relationshipName:string => array($rowIndex:int => $new:boolean))
	 */
	private $subrecordsNew = array();
	
	/**
	 * @brief the Dataface_QuickForm around which this form is built.  This will be 
	 * a quickform for the table of the main record.
	 */
	private $form = null;
	
	/**
	 * @brief Associative array of subforms for each table involved.  This will have the 
	 * following structure:
	 * array($tableName:string => $form:Dataface_QuickForm)
	 */
	private $subforms = array();
	
	
	
	/**
	 * @brief A cache to map a field name (including dot notation and index brackets)
	 * with its parsed representation.  This is used by the parseName() method primarily
	 * to avoid having to perform the same parsing twice.
	 *
	 * Array structure:
	 * array($name:string => array(
	 *		'relationshipName' => $relationshipName:string
	 *		'fieldName' => $fieldName:string
	 *		'index' => $index:int
	 * ))
	 */
	private $nameCache = array();
	
	
	/**
	 * @brief An optional related record that is meant to be a lense
	 * through which this record is interpreted.  This is only helpful
	 * if the portalRecord represents the same record as the "record".
	 *
	 * This is particularly helpful if the editing context is through a relationship
	 * where the user has access to records in the relationship, but not 
	 * necessarily in the destination table.  The related record permissions
	 * take precedence in this case.
	 *
	 * This record is also used to determine if a field is "constrained"
	 * in a relationship and should not be included in the form that is
	 * generated by the generateHtmlTemplate() method.
	 */
	private $portalRecord = null;
	
	
	/**
	 * @brief Constructor for the form. 
	 *
	 * @param Dataface_Record $record The record that is being edited.
	 * @param boolean $new  If true, this will be a new record form.  False => edit form.
	 */
	public function __construct(Dataface_Record $record, $new=false, $portalRecord=null){
		$this->record = $record;
		$this->_new = $new;
		$this->portalRecord = $portalRecord;
	}
	
	
	/**
	 * @brief Loads the required classes (e.g. the simple_html_dom) in a 
	 * way that will prevent it from being loaded twice.  This method is 
	 * called in compile() to ensure that all of the dependencies have been
	 * loaded.
	 */
	private function loadDependencies(){
		$s = DIRECTORY_SEPARATOR;
		if ( !class_exists('simple_html_dom_node') ){
			require_once dirname(__FILE__).$s.'..'.$s.'lib'.$s.'simple_html_dom.php';
		}
		import('Dataface/QuickForm.php');
	}
	
	/**
	 * @brief Parses a field name in full dot and bracket notation and returns
	 * an associative array of the parts of the field name.
	 *
	 * @param string $name The field name in dot/bracket notation.
	 *
	 * @return array Parsed field name as an associative array with the following structure:
	 *
	 * @code
	 * array(
	 *		'relationshipName' => $relationshipName:string,
	 *		'fieldName' => $fieldName:string,
	 *		'index' => $index:int
	 *	)
	 * @endcode
	 *
	 * <h3>Examples</h3>
	 * @code
	 *	$this->parseName('firstname');
	 * @endcode
	 * returns
	 * @code
	 *	array(
	 *		'relationshipName' => null,
	 *		'fieldName' => 'firstname',
	 *		'index' => 0
	 *  )
	 * @endcode
	 *
	 * @code
	 *	$this->parseName('cars.model');
	 * @endcode
	 * returns
	 * @code
	 *	array(
	 *		'relationshipName'=>'cars',
	 *		'fieldName'=>'model'
	 *		'index' => 0
	 *	)
	 * @endcode
	 * 
	 */
	private function parseName($name){
		if ( !isset($this->nameCache[$name]) ){
			$out = array(
				'relationshipName'=>null,
				'fieldName'=>null,
				'index'=>0,
				'id' => false
			);
			
			if ( strpos($name, '.') !== false ){
				list($relationshipName, $fieldName) = explode('.', $name);
				$index = 0;
				if ( preg_match('/^(.*)\{([^\]]*)\}$/', $relationshipName, $matches) ){
					$relationshipName = $matches[1];
					$index = $matches[2];
					if ( strlen($index) == 0 ){
						$index = -1;
					} else if ( preg_match('/^[0-9]+$/', $index) ){
						$index = intval($index);
					} else if ( preg_match('/^'.preg_quote($this->record->table()->tablename.'/'.$relationshipName.'?', '/').'$/', $index)){
						// No change to index.
						$out['id'] = true;
					} else {
						throw new Exception("Invalid field name $name.");
					}
						
				}
				
				$out['relationshipName'] = $relationshipName;
				$out['index'] = $index;
				$out['fieldName'] = $fieldName;
				if ( isset($id) ) $out['id'] = $id;
				
				
			} else {
				$out['fieldName'] = $name;
			}
			$this->nameCache[$name] = $out;
		}
		
		return $this->nameCache[$name];
	}
	
	/**
	 * @brief Returns a related record at the specified index.
	 *
	 * @param string $relationshipName The name of the relationship to load the
	 *	record from.
	 * @param int $index The index (or row number) to get the record from.
	 * @returns Dataface_RelatedRecord The subrecord at the specified index.
	 */
	private function getSubrecord($relationshipName, $index=0){
		if ( !isset($this->subrecords[$relationshipName]) ){
			$this->subrecords[$relationshipName] = array();
		}
		if ( !isset($this->subrecords[$relationshipName][$index]) ){
			$subrecord = null;
			if ( $index === -1 or $index === '__new__' ){
				// Do nothing.... we pick it up in the next if
			} else if ( is_int($index) ){
				//echo "Getting subrecord for $relationshipName index $index";
				$subrecord = $this->record->getRelatedRecord($relationshipName, $index);
			} else {
				$subrecord = df_get_record_by_id($index);
			}
			if ( !$subrecord ){
				$this->subrecordsNew[$relationshipName][$index] = true;
				$subrecord = new Dataface_RelatedRecord($this->record, $relationshipName);
			} else {
				$this->subrecordsNew[$relationshipName][$index] = false;
			}
			$this->subrecords[$relationshipName][$index] = $subrecord;
		}
		return $this->subrecords[$relationshipName][$index];
	}
	
	/**
	 * @brief Returns the Dataface_QuickForm object that is used for the main record
	 * of this form.  If called multiple times, this will return the same object each time
	 *
	 * @returns Dataface_QuickForm The form used to build widgets for the main record.
	 *
	 * @see getSubForm() For retrieving forms for subrecords.
	 */
	private function getForm(){
		if ( !isset($this->form) ){
			if ( $this->_new ){
				$this->form = Dataface_QuickForm::createNewRecordForm($this->record->table()->tablename);
			} else {
				$this->form = Dataface_QuickForm::createEditRecordForm($this->record);
			}
		}
		return $this->form;
	}
	
	
	/**
	 * @brief Returns the Dataface_QuickForm object used for building widgets in the
	 * specified table for subrecords.
	 *
	 * @param string $relationship The name of the relationship.
	 * @param string $tablename The name of the table whose quickform 
	 *	we are retrieving.  Note that relationships can be comprised of 
	 * 	multiple tables.  That's why this is necessary.
	 * @param int $index The row or the relationship where the subrecord can be obtained.
	 * @returns Dataface_QuickForm The quickform object used for generating widgets
	 * for fields of the given table in the context of the specified relationship.
	 *
	 * @see getForm() To obtain the quickform for fields in the main record.
	 */
	private function getSubForm($relationship, $tablename, $index=0){
		if ( !isset($this->subforms[$relationship][$tablename][$index]) ){
			$subrecord = $this->getSubrecord($relationship, $index);
			if ( $this->subrecordsNew[$relationship][$index] ){
				//echo "Creating new record form for $tablename Index $index";
				$subform = Dataface_QuickForm::createNewRecordForm($tablename);
				
			} else {
				//echo "Creating edit record form for $tablename";
				$subform = Dataface_QuickForm::createEditRecordForm($subrecord->toRecord($tablename));
			}
			$this->subforms[$relationship][$tablename][$index] = $subform;
		}
		return $this->subforms[$relationship][$tablename][$index];
	}
	
	/**
	 * @brief Returns the QuickForm that is used to build widgets for the specified
	 * field.
	 * @param string $name The field name.  This may be a related field and it may use
	 * dot/bracket notation.
	 * @returns Dataface_QuickForm The quickform used to edit the field.
	 */
	private function getFormForField($name){
		$parts = $this->parseName($name);
		
		if ( $parts['relationshipName'] ){
			$relationshipName = $parts['relationshipName'];
			$index = $parts['index'];
			$fieldName = $parts['fieldName'];
			
			$relationship = $this->record->table()->getRelationship($relationshipName);
			if ( PEAR::isError($relationship) ){
				return null;
			}
			$fieldDef = $relationship->getField($fieldName);
			if ( PEAR::isError($fieldDef) ) return null;
			
			return $this->getSubForm($relationshipName, $fieldDef['tablename'], $index);
			
		} else {
			return $this->getForm();
		}
	}
	
	
	/**
	 * @brief Returns the field definition for the specified field name.  The field definition
	 * is the associative array of properties that describes a field.  This includes options
	 * that were specified in the fields.ini file.
	 * @param string $name The Field name.  This may use dot/bracket notation to specify a
	 * related field.
	 * @returns array Associative array field definition.
	 */
	private function getFieldDef($name){
		$parts = $this->parseName($name);
		if ( $parts['relationshipName'] ){
			
			
			return $this->record->table()->getRelationship($parts['relationshipName'])->getField($parts['fieldName']);
		} else {
			return $this->record->table()->getField($name);
		}
		
	}
	
	/**
	 * @brief Returns the new/edit permission for a particular field.  Basically it checks 
	 * to see if the field is editable on this form.  It does some fancy stuff to figure
	 * out whether it should obey the new permission or the edit permission.
	 *
	 * @param string $name The field name.  This may be a related field with the dot/bracket notation.
	 * @returns boolean True if this form should be able to edit the field.  False otherwise.
	 */
	private function checkFieldPermissions($name){
		$parts = $this->parseName($name);
		if ( $parts['relationshipName'] ){
			$r = $parts['relationshipName'];
			$f = $parts['fieldName'];
			$i = $parts['index'];
			
			$subrecord = $this->getSubrecord($r, $i);
			$perm = $this->subrecordsNew[$r][$i] ? 'new':'edit';
			return $subrecord->checkPermission($perm, array('field'=>$f));
			
		} else {
			$perm = $this->_new ? 'new':'edit';
			$r = $this->record;
			if ( $this->portalRecord and $this->portalRecord->_relationship->hasField($parts['fieldName'], true, true) ){
				$r = $this->portalRecord;
			}
			return $r->checkPermission($perm, array('field'=>$parts['fieldName']));
		}
	}
	
	
	/**
	 * @brief Returns the html value for a specified field.
	 * @param string The field name.  This may be a related field with dot/bracket notation.
	 * @returns string
	 */
	private function getHtmlValue($name){
		$parts = $this->parseName($name);
		if ( $parts['relationshipName'] ){
			$subrecord = $this->getSubrecord($parts['relationshipName'], $parts['index']);
			return $subrecord->htmlValue($parts['fieldName']);
		} else {
			$r = $this->record;
			if ( $this->portalRecord and $this->portalRecord->_relationship->hasField($parts['fieldName'], true, true) ){
				$r = $this->portalRecord;
			}
			return $this->record->htmlValue($parts['fieldName']);
		}
	}
	
	
	/**
	 * @brief A callback used by the dom parser that will convert portal elements 
	 * so that they are ready for runtime.
	 * @param simple_html_dom_element $element A single node in an HTML document.
	 * @returns void
	 */
	public function _portalsCallback($element){
		$class = $element->{'class'};
		$relationship = $element->{'data-xf-relationship'};
		if ( $class and $relationship and strpos($class, 'xf-portal') !== false){
			$this->buildPortal($element);
		}
	
	}
	
	public function _domCallback($element){
		try {
			$app = Dataface_Application::getInstance();
			switch ($element->tag){
			
				case 'input':
				case 'select':
				case 'textarea':
					
					if ( $element->name ){
						
						$element->outertext = $this->buildWidget($element);
					
					}
					
					
					
					break;
					
				case 'form':
					$element->{'accept-charset'} = $app->_conf['oe'];
					$element->{'class'} = 'xf-form-group xf-ajax-form';
					$element->{'data-xf-record-id'} = $this->record->getId();
					$element->{'name'} = $element->{'id'} = ($this->_new?'new':'edit').'_'.$this->record->table()->tablename.'_record_form';
					$element->{'data-xf-tablename'} = $this->record->table()->tablename;
					$element->{'data-xf-new'} = $this->_new ? '1':'0';
					if ( $this->portalRecord ){
						$element->{'data-xf-portal-record-id'} = $this->portalRecord->getId();
					}
					break;
					
					
			
			}
		} catch (Exception $ex){
		
			error_log($ex->getTraceAsString());
			die("An error occurred parsing HTML");
			
		}
		
		
		
	}
	
	/**
	 * @brief Builds a widget for the specified element.  It figures out which
	 * field to render based on the "name" html attribute.
	 *
	 * @param simple_html_dom_element The dom element that we are converting.
	 * @returns string The HTML string that is generated to replace the element
	 * html.
	 */
	public function buildWidget($element){
		$name = $element->name;
		
		$fieldDef = $this->getFieldDef($name);
		$form = $this->getFormForField($name);
		if ( !$this->checkFieldPermissions($name) or $fieldDef['Type'] == 'calculated' or @$fieldDef['grafted'] ){
			return $this->getHtmlValue($name);
		}
		$el = $form->_buildWidget($fieldDef);
		$el->setName($name);
		//return preg_replace('/name="[^"]+"/i', 'name="'.htmlspecialchars($name).'"', $el->toHtml());
		return $el->toHtml();
		
	
	}
	
	/**
	 * @brief Converts a portal tag (i.e. contains css class xf-portal) to include
	 * all of the necessary css classes and HTML attributes to be a full portal
	 * on the form.  This will check the relationship to see what its multiplicity is
	 * and it will apply the proper tags so that Javascript can take over.
	 *
	 * @param simple_html_dom_element $element The DOM element that represents the portal.
	 * @returns void
	 */
	public function buildPortal($element){
		$relationshipName = $element->{'data-xf-relationship'};
		if ( !$this->record->checkPermission('view related records', array('relationship'=>$relationshipName) ) ){
			$element->outertext = '';
			return;
		}
		$relationship = $this->record->table()->getRelationship($relationshipName);
		$element->{'data-xf-portal-label'} = $relationship->getLabel();
		$element->{'data-xf-min-cardinality'} = $relationship->getMinCardinality();
		$element->{'data-xf-max-cardinality'} = $relationship->getMaxCardinality();
		if ( $relationship->isManyToMany() ){
			$element->{'data-xf-relationship-multiplicity'} = 'many-to-many';
		} else if ( $relationship->isOneToMany() ){
			$element->{'data-xf-relationship-multiplicity'} = 'one-to-many';
		} else if ( $relationship->isOneToOne() or $relationship->isOneToZeroOrOne() ){
			$element->{'data-xf-relationship-multiplicity'} = 'one-to-one';	
		}
		
		
		$numRelated = $this->record->numRelatedRecords($relationshipName);
		
		if ( $numRelated == 0 and ($relationship->isOneToZeroOrOne() or $relationship->isOneToMany()) ){
			$element->{'class'} .= ' collapsed';
		}
	
	}
	
	
	/**
	 * @brief Compiles the provided template into a full form.  It scans the HTML for any
	 * input, textarea, or select tags and transforms them into the correct widget based 
	 * on the field name.
	 *
	 * <p>Field names can be any of the following:</p>
	 *
	 * <ul>
	 *	<li>A simple field name.  E.g. <em>firstname</em></li>
	 *  <li>A related field name.  E.g. <em>students.firstname</em></li>
	 *	<li>A field for a specific related record by index..  E.g. <em>students[2].firstname</em></li>
	 *	<li>A field for a specific related record by related record ID.  E.g.
	 *		<em>students[people/students?person_id=10&students::person_id=20].firstname</em>
	 *	</li>
	 * 	<li>A field for a new record in a related field..  E.g.
	 *		<em>students[].firstname</em>
	 *	</li>
	 * </ul>
	 *
	 * @param string $template The HTML template to use for building the form.
	 * @returns string The compiled template with all widgets replaced by proper widgets
	 * 	taking into account permissions.  If the user has no permission for a particular field
	 *	then they'll either receive a no-access message (if no view permission) or they will
	 * 	see the htmlValue() of the field (which should respect permissions).
	 */
	public function compile($template=null){
		if ( !class_exists('Dataface_JavascriptTool') ){
			import('Dataface/JavascriptTool.php');
		}
		$jt = Dataface_JavascriptTool::getInstance();
		$mod = Dataface_ModuleTool::getInstance()->loadModule('modules_ajax_form');
		$mod->registerPaths();
		$jt->import('xataface/modules/ajax_form/ajax_form_html.js');
		
		if ( is_string($template) ){
			if ( preg_match('/^[0-9]+$/', $template) ){
				$template = intval($template);
			}
		}
		if ( is_int($template) ){
			// Must be a template ID
			$template = $this->getTemplateById($template);
		}
		
		if ( !$template ){
			$template = $this->generateHtmlTemplate();
		}
		
		$this->loadDependencies();
		
		$html = str_get_html($template);
		$html->set_callback(array($this, '_portalsCallback'));
		$template = (string)$html;
		
		$html = str_get_html($template);
		$html->set_callback(array($this, '_domCallback'));
		
		
		return (string)$html;
		
	}
	
	
	public function generateHtmlTemplate(){

		import('Dataface/FormTool.php');
		$formTool = Dataface_FormTool::getInstance();
		$fields = $this->record->table()->fields(false, false, true);
		
		// Let's filter the fields based on permission
		$constrainedFields = array();
		if ( $this->portalRecord ){
			$cfs = $this->portalRecord->getConstrainedFields();
			foreach ($cfs as $cf){
				if ( strpos($cf,'.') !== false ) list($junk,$cf) = explode('.', $cf);
				$constrainedFields[$cf] = true;
			}
		}
		
		$allowedFields = array();
		foreach ($fields as $fieldname=>$field){
			$r = $this->record;
			
			if ( @$constrainedFields[$fieldname] ) continue;
			
			if ( $this->portalRecord and $this->portalRecord->_relationship->hasField($fieldname, true, true) ){
				$r = $this->portalRecord;
			}
			if ( !$r->checkPermission('view', array('field'=>$fieldname)) ){
				
				continue;
			}
			$allowedFields[$fieldname] = $field;
		}
		$html[] = '<div class="xf-ajax-form-wrapper">';
		$html[] = '<form>';
		
		$groupedFields = $formTool->groupFields($allowedFields);
		
		foreach ($groupedFields as $groupName=>$groupFields){
			
			$groupDef = $this->record->table()->getFieldGroup($groupName);
			if ( !$groupDef or PEAR::isError($groupDef) ){
				$groupDef = array(
					'label' => $this->record->table()->getSingularLabel(),
					'order' => 0
				);
			}
			
			$columns = @$groupDef['columns'] ? intval($groupDef['columns']):min(2, count($groupFields));
			
			

			
			
			$html[] = '<div>';
			$html[] = '<fieldset>';
			$html[] = '<legend>'.htmlspecialchars($groupDef['label']).'</legend>';
			$html[] = '<table>';
			$col = 0;
			
			$hiddenFields = array();

			
			foreach ($groupFields as $groupField){
				
				if ( $groupField['widget']['type'] == 'hidden' ){
					$hiddenFields[] = $groupField;
					continue;	
				}
			
				if ( $col == 0 ){
					$html[] = '<tr>';
				}
			
				if ( @$groupField['display'] == 'block' and $col != 0 ){
					$html[] = '<td class="xf-cell xf-fill-cell" colspan="'.(3*($columns-$col)).'">&nbsp</td></tr>';
					$html[] = '<tr><td class="xf-cell xf-block-cell" colspan="'.(3*$columns).'"><div class="xf-field-label">'.
						htmlspecialchars($groupField['widget']['label']).'</div>';
					if ( @$groupField['widget']['question'] ){
						$html[] = '<div class="xf-field-question">'.
							htmlspecialchars($groupField['widget']['question']).
							'</div>';
					}
					
					if ( @$groupField['widget']['description'] ){
						$html[] = '<div class="xf-field-description">'.
							htmlspecialchars($groupField['widget']['description']).
							'</div>';
					}
					
					$html[] = '<div class="xf-field-widget">'
						.'<input type="text" name="'.htmlspecialchars($groupField['name']).'"/>'
						.'</div>';
					$html[] = '</td></tr>';
					$col = 0;
					continue;
				} else {
					
					if ( @$groupField['clear'] and $col != 0 ){
						$html[] = '<td class="xf-cell xf-fill-cell" colspan="'.(3*($columns-$col)).'">&nbsp;</td></tr><tr>';
						$col = 0;
					}
					
					$html[] = '<td class="xf-cell xf-inline-cell xf-label-cell">'
						.'<div class="xf-field-label">'.htmlspecialchars($groupField['widget']['label']).'</div>'
						.'</td><td class="xf-cell xf-inline-cell xf-widget-cell">'
						.'<div class="xf-field-widget">';
					if ( @$groupField['widget']['question'] ){
						$html[] = '<div class="xf-field-question formHelp">'.
							htmlspecialchars($groupField['widget']['question']).
							'</div>';
					}
					$html[] = '<input type="text" name="'.htmlspecialchars($groupField['name']).'"/>';
					if ( @$groupField['widget']['description'] ){
						$html[] = '<div class="xf-field-description formHelp">'.
							htmlspecialchars($groupField['widget']['description']).
							'</div>';
					}	
					$html[] = '</div>'
						.'</td><td class="xf-cell xf-spacer">&nbsp;</td>';
					$col ++;
					if ( $col >= $columns ){
						$html[] = '</tr>';
						$col = 0;
						continue;
					}
				
				}
				
			}
			
			$html[] = '</table>';
			
			foreach ($hiddenFields as $hiddenField){
				$html[] = '<input type="hidden" name="'.htmlspecialchars($hiddenField['name']).'"/>';
			}
			
			$html[] = '</fieldset>';
			$html[] = '</div>';
			
		
		
		}
		
		$html[] = '</form>';
		// Now that we have the main record's fields on the form, we can start 
		// to go after the related records.
		if ( !$this->_new ){
			$relationships = $this->record->table()->relationships();
			foreach ($relationships as $relationship){
				if ( !$this->record->checkPermission('view related records', array('relationship'=>$relationship->getName())) ){
					continue;
				}
				$html[] = '<div class="xf-portal" data-xf-relationship="'.htmlspecialchars($relationship->getName()).'">';
				$html[] = '<fieldset>';
				$html[] = '<legend>'.htmlspecialchars($relationship->getLabel()).'</legend>';
				$html[] = '<div class="xf-portal-body"></div>';
				$html[] = '</fieldset>';
				$html[] = '</div>';
			
			}
		}
		
		
		$html[] = '</div>';

		$html = implode("\r\n", $html);
		
		return $html;

		
	
	}
	
	
	public function generateNewRelatedRecordFormTemplate($relationshipName){
		import('Dataface/FormTool.php');
		$formTool = Dataface_FormTool::getInstance();
		$relationship = $this->record->table()->getRelationship($relationshipName);
		//print_r($relationship->getForeignKeyValues());
		$destinationTables = $relationship->getDestinationTables();
		$domainTableName = $relationship->getDomainTable();
		$includeDomainTable = true;
		if ( count($destinationTables) > 1 ){
			$includeDomainTable = false;
		}
		$fieldNames = $relationship->fields(true);
		$relatedRecord = new Dataface_RelatedRecord($this->record, $relationshipName, array());
		
		// Let's filter the fields based on permission
		$allowedFields = array();
		foreach ($fieldNames as $fieldname){
			if ( !$relatedRecord->checkPermission('view', array('field'=>$fieldname)) ){
				continue;
			}
			$allowedFields[$fieldname] = $relationship->getField($fieldname);
		}
		$html[] = '<div class="xf-ajax-form-wrapper">';
		$html[] = '<form>';
		
		$groupedFields = $formTool->groupFields($allowedFields);
		
		$fkCols = $relatedRecord->getForeignKeyValues();
		//print_r($fkCols);

		foreach ($groupedFields as $groupName=>$groupFields){
			
			$groupDef = $this->record->table()->getFieldGroup($groupName);
			if ( !$groupDef or PEAR::isError($groupDef) ){
				$groupDef = array(
					'label' => $relationship->getSingularLabel(),
					'order' => 0
				);
			}
			
			$columns = @$groupDef['columns'] ? intval($groupDef['columns']):min(2, count($groupFields));
			
			

			
			
			$html[] = '<div>';
			$html[] = '<fieldset>';
			$html[] = '<legend>'.htmlspecialchars($groupDef['label']).'</legend>';
			$html[] = '<table>';
			$col = 0;
			
			$hiddenFields = array();

			
			foreach ($groupFields as $groupField){
				$tablename = $groupField['tablename'];
				$fieldname = $groupField['name'];
				$absFieldname = $tablename.'.'.$fieldname;
				if ( !$includeDomainTable and strcasecmp($tablename, $domainTableName) === 0 ){
					// If there are multiple tables in this relationship, then 
					// we dont' include fields from the domain table in the form.
					// Instead we use a lookup widget to allow the user
					// to select the domain table record separately.
					continue;
				}
				if ( array_key_exists($tablename, $fkCols) and array_key_exists($fieldname, $fkCols[$tablename]) ){
					// This column is already specified by the foreign key relationship so we don't need to pass
					// this information using the form.
					
					// Actually - this isn't entirely true.  If there is no auto-incrementing field
					// associated with this foreign key, then 
					if ( $relationship->isNullForeignKey($fkCols[$tablename][$fieldname]) ){
						$furthestField = $fkCols[$tablename][$fieldname]->getFurthestField();
						if ( $furthestField != $absFieldname ){
							// We only display this field if it is the furthest field of the key
							continue;
						}
						
					} else {
						continue;
					}
					
					//continue;
				}
			
				
				if ( $groupField['widget']['type'] == 'hidden' ){
					$hiddenFields[] = $groupField;
					continue;	
				}
			
				if ( $col == 0 ){
					$html[] = '<tr>';
				}
			
				if ( @$groupField['display'] == 'block' and $col != 0 ){
					$html[] = '<td class="xf-cell xf-fill-cell" colspan="'.(3*($columns-$col)).'">&nbsp</td></tr>';
					$html[] = '<tr><td class="xf-cell xf-block-cell" colspan="'.(3*$columns).'"><div class="xf-field-label">'.
						htmlspecialchars($groupField['widget']['label']).'</div>';
					if ( @$groupField['widget']['question'] ){
						$html[] = '<div class="xf-field-question">'.
							htmlspecialchars($groupField['widget']['question']).
							'</div>';
					}
					
					if ( @$groupField['widget']['description'] ){
						$html[] = '<div class="xf-field-description">'.
							htmlspecialchars($groupField['widget']['description']).
							'</div>';
					}
					
					$html[] = '<div class="xf-field-widget">'
						.'<input type="text" name="'.htmlspecialchars($relationshipName.'{}.'.$groupField['name']).'"/>'
						.'</div>';
					$html[] = '</td></tr>';
					$col = 0;
					continue;
				} else {
					
					if ( @$groupField['clear'] and $col != 0 ){
						$html[] = '<td class="xf-cell xf-fill-cell" colspan="'.(3*($columns-$col)).'">&nbsp;</td></tr><tr>';
						$col = 0;
					}
					
					$html[] = '<td class="xf-cell xf-inline-cell xf-label-cell">'
						.'<div class="xf-field-label">'.htmlspecialchars($groupField['widget']['label']).'</div>'
						.'</td><td class="xf-cell xf-inline-cell xf-widget-cell">'
						.'<div class="xf-field-widget"><input type="text" name="'.htmlspecialchars($relationshipName.'{}.'.$groupField['name']).'"/></div>';
					
					if ( @$groupField['widget']['description'] ){
						$html[] = '<div class="xf-field-description">'.
							htmlspecialchars($groupField['widget']['description']).
							'</div>';
					}
					
					
					$html[] = ''
						.'</td><td class="xf-cell xf-spacer">&nbsp;</td>';
					$col ++;
					if ( $col >= $columns ){
						$html[] = '</tr>';
						$col = 0;
						continue;
					}
				
				}
				
			}
			
			$html[] = '</table>';
			
			foreach ($hiddenFields as $hiddenField){
				$html[] = '<input type="hidden" name="'.htmlspecialchars($relationshipName.'{}.'.$hiddenField['name']).'"/>';
			}
			
			$html[] = '</fieldset>';
			$html[] = '</div>';
			
		
		
		}
		
		
		// Now that we have the main record's fields on the form, we can start 
		// to go after the related records.
		$html[] = '</form>';
		
		
		
		$html[] = '</div>';

		$html = implode("\r\n", $html);
		return $html;
		
	}
	
	
	
}