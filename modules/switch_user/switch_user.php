<?php
/*
 * Xataface Switch User Module
 * Copyright (C) 2011  Steve Hannah <steve@weblite.ca>
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
 *
 */
/**
 * @brief The Switch User module core class.
 *
 * This class is loaded whenever the module is active.  It loads the appropriate
 * dependencies and registers the datepicker widget.
 *
 * @author Steve Hannah <steve@weblite.ca>
 * @created July 11, 2011
 */
class modules_switch_user {
	
	
	/**
	 * @brief The base URL to the datepicker module.  This will be correct whether it is in the 
	 * application modules directory or the xataface modules directory.
	 *
	 * @see getBaseURL()
	 */
	private $baseURL = null;
	
	
	public function __construct(){
	
		
		
		$del = Dataface_Application::getInstance()->getDelegate();
		$canSwitchUser = false;
		if ( method_exists($del, 'canSwitchUser') ){
			$canSwitchUser = $del->canSwitchUser();
		}
		if ( $canSwitchUser or @$_SESSION['original_user'] ){
                        
                        Dataface_Application::getInstance()->_conf['nocache'] = 1;
                        $isOriginal = 'false';
			if ( !@$_SESSION['original_user'] ) $isOriginal = 'true';
			//$user = getUser();
			$username = $_SESSION['UserName'];
			
			
			// Now work on our dependencies
			$mt = Dataface_ModuleTool::getInstance();
			
			// We require the XataJax module
			// The XataJax module activates and embeds the Javascript and CSS tools
			$mt->loadModule('modules_XataJax', 'modules/XataJax/XataJax.php');
			
			$js = Dataface_JavascriptTool::getInstance();
			$js->addPath(dirname(__FILE__).DIRECTORY_SEPARATOR.'js', $this->getBaseURL().'/js');
			
			$css = Dataface_CSSTool::getInstance();
			$css->addPath(dirname(__FILE__).DIRECTORY_SEPARATOR.'css', $this->getBaseURL().'/css');
			$js->import('xataface/modules/switch_user/switch_user.js');
			
		}
		
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