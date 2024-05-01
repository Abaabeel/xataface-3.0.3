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
 * @brief Action that prints a PDF report.  This action first lays out the report in HTML
 *	but displays a dialog message saying "Generating Report.... Please wait" while it passes
 * the placement of the report data back to the pdfreports_jquery_pdf action to be converted
 * into a PDF.
 *
 * @par POST Parameters
 * 
 * @param string --templateContent The serialized template to render.  If this is provided (it's optional)
 *	it will override the template that is currently stored in the report specified.
 * @param int --report-id The ID of the report to display.  This corresponds with the report_id column
 * 	of the xf_pdfreports_reports table.  This may be omitted if the alternate --report-name parameter is specified.
 * @param string --report-name The name of the report to display.  This corresponds with the action_name
 * 	column of the xf_pdfreports_reports table.
 * @returns This will display a progress dialog, then will redirect to the actual generated PDF once
 * the report has been generated.
 */
class actions_pdfreports_print_report_html {

	function handle($params){
		session_write_close();
		header('Connection:close');
		$app = Dataface_Application::getInstance();
		
		$query = $app->getQuery();
		if ( !@$query['--templateContent'] ){
			
			if ( @$query['--report-id'] ){
			
				$report = df_get_record('xf_pdfreports_reports', array('report_id'=>'='.$query['--report-id']));
				if ( !$report ){
					throw new Exception("Could not find report with id specified");
				}
				$query['--templateContent'] = $report->val('report_template');
			} else if ( @$query['--report-name'] ){
				$report = df_get_record('xf_pdfreports_reports', array('action_name'=>'='.$query['--report-name']));
				if ( !$report ){
					throw new Exception("Could not find report with name specified");
				}
				$query['--templateContent'] = $report->val('report_template');
			
			}
			
			
		}
		
		if ( !@$query['--templateContent'] ){
			throw new Exception("No report template provided");
		}
		
		$template = $query['--templateContent'];
		
		$records = df_get_selected_records($query);
		if ( !$records ){
			$records = df_get_records_array($query['-table'], $query);
		}
		if ( !$records ) throw new Exception("No records found to run report with.");
		
		import('modules/pdfreports/inc/XFPDFReportRenderer.php');
		$renderer = new XFPDFReportRenderer($records, $template);
		$html = $renderer->toHtml();
		
		$mod = Dataface_ModuleTool::getInstance()->loadModule('modules_pdfreports');
		$jt = Dataface_JavascriptTool::getInstance();
		$jt->addPath(dirname(__FILE__).'/../js', $mod->getBaseURL().'/js');
		
		$ct = Dataface_CSSTool::getInstance();
		$ct->addPath(dirname(__FILE__).'/../css', $mod->getBaseURL().'/css');
		
		$jt->import('xataface/modules/pdfreports/pdfreports_print_report_html.js');
		
		Dataface_Application::getInstance()
			->addHeadContent('<script>XF_PDF_REPORTS_URL='.json_encode(df_absolute_url($mod->getBaseURL())).';</script>');
		
		if ( @$_REQUEST['--disposition'] == 'attachment'){
			Dataface_Application::getInstance()
				->addHeadContent('<script>JQUERY_PDF_RPARAMS={disposition:"attachment"};</script>');
		}
		
		df_register_skin('pdfreports', dirname(__FILE__).'/../templates');
		df_display(array('reportHtml'=>$html), 'xataface/modules/pdfreports/pdfreports_print_report_html.html');
		
	}
}