<?php
import('PHPUnit.php');
class modules_testrunner {


	/**
	 * @brief The base URL to the datepicker module.  This will be correct whether it is in the 
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
	
	

	
	private $testSuite;
	
	public function getTestSuite(){
		if ( !isset($this->testSuite) ){
			$this->testSuite = new PHPUnit_TestSuite();
		}
		return $this->testSuite;
	}
	
	public function addTest($classname){
		
		$suite = new PHPUnit_TestSuite($classname);
		foreach ($suite->tests() as $test){
			$this->getTestSuite()->addTest($test);
		}
	}
	

}