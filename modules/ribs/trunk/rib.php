<?php
class modules_rib {
    /**
	 * @brief The base URL to the tagger module.  This will be correct whether it is in the 
	 * application modules directory or the xataface modules directory.
	 *
	 * @see getBaseURL()
	 */
	private $baseURL = null;
	
	
	private $pathsRegistered = false;
	
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
	
	function registerPaths(){
		if ( !$this->pathsRegistered ){
			Dataface_JavascriptTool::getInstance()
				->addPath(dirname(__FILE__).'/js', $this->getBaseURL().'/js');
			Dataface_CSSTool::getInstance()
				->addPath(dirname(__FILE__).'/css', $this->getBaseURL().'/css');
				
			df_register_skin('modules_rib', dirname(__FILE__).'/templates');
		}
	}
} 