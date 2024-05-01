<?php
/*
 * Xataface PDF Reports Module
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
 * @brief The PDF reports module main class.  This provides useful utility functions for PDF reports
 * as well as some initialization code that is performed before each request.
 *
 */
class modules_pdfreports {

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
	
	/**
	 * @brief Registers the Javascript and CSS paths for this module in the JavascriptTool.
	 *
	 */
	public function addPaths(){
		Dataface_JavascriptTool::getInstance()->addPath(dirname(__FILE__).'/js', $this->getBaseURL().'/js');
		Dataface_CSSTool::getInstance()->addPath(dirname(__FILE__).'/css', $this->getBaseURL().'/css');
	}
	
	
	/**
	 * @brief Constructor which runs once per request (if the module is enabled).
	 */
	public function __construct(){
		Dataface_Table::setBasePath('xf_pdfreports_reports', dirname(__FILE__));
		Dataface_Application::getInstance()->addHeadContent('<script> XATAFACE_MODULES_PDFREPORTS_URL='.json_encode($this->getBaseURL()).';</script>');
		// This module requires the html reports module for some components
		$htmlReports = Dataface_ModuleTool::getInstance()->loadModule('modules_htmlreports');
		if ( PEAR::isError($htmlReports) ){
			throw new Exception("The PDF Reports Module requires the HTML reports module to be installed.  Please either disable the PDF reports module, or install the HTML reports module.  You can find out more about the htmlreports module at http://xataface.com/dox/modules/htmlreports/latest");
			
		}

		
		
		
	}
}