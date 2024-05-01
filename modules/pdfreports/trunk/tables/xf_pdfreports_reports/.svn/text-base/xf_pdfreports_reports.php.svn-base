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
 * @brief Delegate class for the xf_pdfreports_reports table which holds all of the reports
 * for the pdfreports module.
 */
class tables_xf_pdfreports_reports {
	
	
	/**
	 * @brief Valuelist of the tablenames currently set up in this application.  This just wraps
	 * the htmlreports module's tablenames valuelist.
	 *
	 * @see <a href="http://xataface.com/dox/modules/htmlreports/latest/classtables__dataface____htmlreports__reports.html#ada0f47a41ba823c689939542221d2163">HTML Reports Module</a>
	 */
	function valuelist__tablenames(){
		return Dataface_Table
			::loadTable('dataface__htmlreports_reports')
				->getValuelist('tablenames');
		
	}
	
	
	function valuelist__action_categories(){
		return Dataface_Table
			::loadTable('dataface__htmlreports_reports')
				->getValuelist('action_categories');
	}
	
	function valuelist__action_permissions(){
		return Dataface_Table
			::loadTable('dataface__htmlreports_reports')
				->getValuelist('action_permissions');
	
	}
}