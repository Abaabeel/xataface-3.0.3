<?php
/**
 * This module provides tools to interchange data with Filemaker.  It
 * includes the fmpxmlresult action which exports the current found set as
 * Filemaker compatible XML. See
 * http://www.filemakerpro.com/help/12-Import%20export34.html for
 * information about the FMPXML grammar.
 *
 * @author Steve Hannah <steve@weblite.ca>
 * @created March 3, 2008
 * @copyright 2008 Steve Hannah.  All rights reserved.
 *
 */
class modules_Filemaker{
    
    /**
    * @brief The base URL to the datepicker module.  This will be correct whether it is in the 
    * application modules directory or the xataface modules directory.
    *
    * @see getBaseURL()
    */
    private $baseURL = null;
    
    public function __construct(){
        Dataface_Application::getInstance()->_conf['XF_MODULES_FILEMAKER_BASEURL'] = $this->getBaseURL();
    }
    
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
    
    
    
}