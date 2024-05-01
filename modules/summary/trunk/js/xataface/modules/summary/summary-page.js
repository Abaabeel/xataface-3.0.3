/*
 * Xataface Summary Module
 * 
 * Copyright (C) 2011  Steve Hannah <shannah@sfu.ca>
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
 */
 
 /**
  * This javascript file applies primarily to the xataface/modules/summary/main.html
  * template and it's contents.
  *
  * It is utilized by the summary_page action.
  *
  * @author Steve Hannah <steve@weblite.ca>
  * @created June 1, 2011
  */
 
//require-css <xataface/modules/summary/main_summary_page.css>
//require <jquery.packed.js>
//require-css <jquery-ui/jquery-ui.css>
//require <jquery-ui.min.js>
//require-css <multiselect-widget.css>
//require <multiselect-widget.min.js>
//require <xatajax.util.js>


(function(){
	// A function to parse the request parameters from the current URL
	var getRequestParams = XataJax.util.getRequestParams;
	
	// Reference to jQuery object
	var $ = jQuery;
	
	// Reference to the group-by fields select list.
	var groupBySelect = $('div.summary-group-by-columns-form select');
	
	// Reference to the summary columns select list.
	var summaryColsSelect = $('div.summary-summarized-columns-form select');
	
	// Reference to the refresh button.
	var refreshBtn = $('#refresh-button');
	
	// Let's turn the groupBy select list into a funky multi-select widget
	groupBySelect.multiselect({
		selectedText: "Grouping by # of # fields",
		noneSelectedText: "Select fields to group by"
	
	});
	
	// Turn the summary column select list into a funky multi-select widget
	summaryColsSelect.multiselect({
		selectedText: "Reporting # Summary Fields",
		noneSelectedText: "Select Summary Fields",
		
	});
	
	
	
	/**
	 * Function called when the user requests a refresh of the list.
	 * It uses the user's selected group by and summary fields,
	 * and redirects to a page that will show the appropriate summaries.
	 */
	function refreshList(){
		var groupByStr = (groupBySelect.val()||[]).join(',');
		var summaryColsStr = (summaryColsSelect.val()||[]).join(',');
		requestParams = getRequestParams();
		requestParams['-group-by'] = groupByStr;
		requestParams['-summary-cols'] = summaryColsStr;
		var url = XataJax.util.url(requestParams);
		
		window.location.href = XataJax.util.url(requestParams);
		return;
	
	}
	
	// Attache the click handler to the refresh button.
	refreshBtn.click(refreshList);
	


})();