<?php
require 'modules/htmlreports/classes/XfHtmlReportBuilder.class.php';
class XFPDFReportRenderer {
	
	
	private $_records;
	private $_template;
	
	
	function __construct($records, $template){
		$this->_records = $records;
		$this->_template = $template;
	}
	
	function toHtml(){
		
		return XfHtmlReportBuilder::fillReportMultiple($this->_records, $this->_template, false, false);
	
	}
	

}