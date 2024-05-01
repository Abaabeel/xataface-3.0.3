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
 * @brief The action that allows users to edit reports.  This is the core action of the PDF reports
 * module from a user's perspective.
 *
 * @par GET Parameters
 *
 * There are no GET parameters available at this time.  This action simply starts up with a 
 * blank page and allows the user to click on "Open" to open an existing reports or create a new one.
 */
class actions_pdfreports_pdfeditor_demo {
	function handle($params){
		$mod = Dataface_ModuleTool::getInstance()->loadModule('modules_pdfreports');
		$hmod = Dataface_ModuleTool::getInstance()->loadModule('modules_htmlreports');
		$hmod->addPaths(); // Add javascript and CSS paths for htmlreports
		$mod->addPaths();  // Add javascript and CSS paths for pdfreports
		$jt = Dataface_JavascriptTool::getInstance();
		$jt->import('xataface/modules/pdfreports/pdfeditor-demo.js');
		
		Dataface_Application::getInstance()
			->addHeadContent('<script>XF_PDF_REPORTS_URL='.json_encode(df_absolute_url($mod->getBaseURL())).';</script>');
		
		df_register_skin('pdfreports', dirname(__FILE__).'/../templates');
		df_display(array(), 'xataface/modules/pdfreports/pdfeditor-demo.html');
	}

}