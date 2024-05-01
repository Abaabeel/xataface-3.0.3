<?php
/**
 * @brief An action that generates the output PDF report as a PDF.  Currently it makes use
 * of the jquery-pdf library which converts HTML on the client side into a PDF on the server
 * side.
 *
 * This action works as a REST wrapper around the jquery.pdf script itself.  Generating a 
 * PDF takes 2 requests.  The first request builds the PDF and stores it in a temp file, then
 * sends a URL back to the client where the client can view the finished product PDF.
 *
 * The 2nd request takes back the ID that is generated from the first request and outputs
 * the actual rendered PDF.
 *
 * @par POST Parameters For Generating a PDF
 *
 * @param int report_id The ID of the report to be rendered.  This corresponds to the report_id column
 *	in the xf_pdfreports_reports table.  This is an optional parameter.  It is also possible to 
 * 	specify the template directly using the --template parameter.
 *
 * @param string --template The URL to the PDF that is used as a backdrop or template for this 
 *	report.  If this parameter is omitted, then the template from the report identified by 
 *	the report_id parameter will be used.
 * 
 * @param string data The HTML data (produced by the jquery.pdf.js library that specifieds the 
 * content to layout on the report.
 *
 * @returns application/json A JSON data structure with a status code and a URL where the generated PDF can be
 * 	downloaded.  The structure follows the following format:
 * @code
 *	{
 *		success: <boolean>,  	// Whether it was successful
 *		complete: <boolean>,  	// Not used here  (it is for cross-domain generation where the pdf data 
 *								// must be passed over multiple requests).
 *		pdf_url: <string>  		// The URL where the PDF can be downloaded.
 *	}
 * @endcode
 *
 * @par GET Parameters For Downloading a Previously Generated PDF
 *
 * @param string file The ID of the file of the PDF that is generated.
 * @returns application/pdf The PDF that was generated.
 * 
 * 
 */
class actions_pdfreports_jquery_pdf {

	function handle($params){
		session_write_close();
		$app = Dataface_Application::getInstance();
		$query = $app->getQuery();
		if ( @$query['report_id'] ){
		
				
			
			//echo "Report ID passed";exit;
			$report = df_get_record('xf_pdfreports_reports', array('report_id'=>'='.$query['report_id']));
			if ( !$report ){
				throw new Exception("Could not find report with specified report id.");
			}
			if ( !$report->checkPermission('view') ){
				throw new Exception("Permission denied");
			}
			
			$res = mysql_query("select background_pdf from xf_pdfreports_reports where report_id='".addslashes($query['report_id'])."' limit 1", df_db());
			if ( !$res ) throw new Exception(mysql_error(df_db()));
			
			$temp = tempnam(sys_get_temp_dir(), 'pdfreports_jquery_');
			file_put_contents($temp, mysql_result($res,0));
			@mysql_free_result($res);
			$_REQUEST['--template'] = $_GET['--template'] = $query['--template'] = $temp;
		}
			
		
		
		include 'modules/pdfreports/jquery-pdf/jquery.pdf.php';
		
		if ( @$query['report_id']){
			@unlink($temp);
		}
		
		
		
	}
}