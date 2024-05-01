//require <jquery.packed.js>
//require <xataface/modules/pdfreports/ReportContainer.js>
//require <RecordDialog/RecordDialog.js>
//require <RecordBrowser/RecordBrowser.js>
//require <xataface/IO.js>
(function(){
	var $ = jQuery;
	var pdfreports = XataJax.load('xataface.modules.pdfreports');
	var ReportContainer = pdfreports.ReportContainer;
	var DataSchema = pdfreports.DataSchema;
	var IO = XataJax.load('xataface.IO');
	
	/**
	 * @namespace
	 * @name xataface
	 * @memberOf xataface.modules.pdfreports.containers
	 */
	var xatafaceContainers = XataJax.load('xataface.modules.pdfreports.containers.xataface');
	
	xatafaceContainers.XFReportContainer = XFReportContainer;
	
	/**
	 * @class
	 * @name XFReportContainer
	 * @memberOf xataface.modules.pdfreports.containers.xataface
	 * @constructor
	 * @param {Object} o
	 * @extends xataface.modules.pdfreports.ReportContainer
	 */
	function XFReportContainer(/**Object*/ o){
		this.parent.constructor.call(this, o);
	}
	
	
	XFReportContainer.prototype = new ReportContainer({}, true);
	XFReportContainer.prototype.constructor = XFReportContainer;
	XFReportContainer.prototype.parent = ReportContainer.prototype;
	
	$.extend(XFReportContainer.prototype, {
		load: XFReportContainer_load,
		loadSchema: XFReportContainer_loadSchema,
		settingsDialog: XFReportContainer_settingsDialog,
		save: XFReportContainer_save,
		preview: XFReportContainer_preview
	});
	
	/**
	 * @function
	 * @name settingsDialog
	 * @memberOf xataface.modules.pdfreports.containers.xataface.XFReportContainer#
	 * @description Opens the settings dialog for a particular report.
	 * @see xataface.modules.pdfreports.ReportContainer#settingsDialog
	 */
	function XFReportContainer_settingsDialog(/**Object*/ params){
		if ( typeof(params) == 'undefined') params = {};
		if ( !params.callback ) params.callback = function(){};
		var settingsCallback = params.callback;
		if ( !params.id ){
		
			alert('No report supplied.  Please select a report first.');
			return;
		}
		var recordDialog = new xataface.RecordDialog({
			recordid: 'xf_pdfreports_reports?report_id='+params.id,
			table: 'xf_pdfreports_reports',
			callback: function(){
			
				// Once it's done we'll want to load the data again.
				
				var q= {
					'-action': 'export_json',
					'-table': 'xf_pdfreports_reports',
					'--displayMethod': 'display',
					'report_id': '='+params.id
				};
				
				$.get(DATAFACE_SITE_HREF, q, function(res){
					if ( typeof(res) != 'object' ){
						throw 'Failed to load new settings because of a server error.  Please check the error log.';
						
					}
					if ( !res.length ){
						throw 'Failed to load new settings due to a server error.  Please check the error log for details.';
					}
					
					var report = res[0];
					
					settingsCallback({
						pdfUrl: report.background_pdf,
						schemaId: report.action_table
					});
				});	
				
			}
		});
		recordDialog.display();
		
		
	}
	
	/**
	 * @function
	 * @name load
	 * @memberOf xataface.modules.pdfreports.containers.xataface.XFReportContainer#
	 * @description Loads a report from Xataface.  If the params.id parameter is set
	 *	it will load the report with that id.  Otherwise, it will open a dialog
	 *  for the user to select a report, then open that one.
	 * @see xataface.modules.pdfreports.ReportContainer#load For parameters.
	 */
	function XFReportContainer_load(/**Object*/ params){
		
		var self = this;
		if ( typeof(params) == 'undefined' ) params  = {};
		var callback = params.callback || function(){};
		if ( params.id ){
			// They provided an ID so we'll just load it directly.
			
			// We need to load information about this report.
			var q = {
				'-action': 'export_json',
				'-table': 'xf_pdfreports_reports',
				'report_id': '='+(params.id),
				'--displayMethod': 'val',
				'-mode': 'browse'
			
			};
			$.get(DATAFACE_SITE_HREF, q, function(res){
				try {
					// res should be an array of objects
					
					if ( typeof(res) != 'object' ){
						throw 'Error occurred loading report. Expected JSON array but received something else. Possibly a permissions issue or a server side error.';
						
					}
					
					var report = res[0];
					if ( !report.background_pdf_mimetype ){
						throw 'This report does not have a background PDF specified so it cannot be loaded.  Please upload a background PDF and try to load it again.';
						//return;
					}
					
					var tpl = report.report_template;
					
					var tplDom = null;
					if ( !tpl ){
						// No template has yet been created so we need to create one
						// now.
						var tempReport = new pdfreports.ReportViewer({
							pdfUrl: report.background_pdf,
							schemaId: report.action_table,
							reportId: report.report_id,
							name: report.report_title
						});
						tplDom = tempReport.serialize();
						
						
					
					} else {
						tplDom = $(report.report_template).get(0);
						var tempReport = new pdfreports.ReportViewer({
							pdfUrl: report.background_pdf,
							schemaId: report.action_table,
							reportId: report.report_id
						});
						tempReport.unserialize(tplDom);
						tempReport.schemaId = report.action_table;
						tempReport.reportId = report.report_id;
						tempReport.name = report.report_title;
						tplDom = tempReport.serialize();
						
					}
					
					var data = {
					
						code: 200,
						message: 'Successfully loaded report',
						serializedReport: tplDom,
						version: report.version
					};
					
					
					callback(data);
					return;
					
				} catch (e){
					callback({
						code: 500,
						error: e
					});
					return;
				}
				
				
				
				
				
			});
			
			return;
			
			
		} else {
			// No ID was provided, so we'll open a dialog first
			var browser = $('<a>').RecordBrowser({
			
				table: 'xf_pdfreports_reports',
				callback: function(values){
					var breakIt = false;
					$.each(values, function(k,label){
						if ( breakIt ) return;
						if ( !k ){
						
							alert('Failed to load report.  No id returned.');
							return;
						}
						params2 = $.extend({}, params);
						
						params2.id=k;
						self.load(params2);
						breakIt = true;
						
						
						
					});
				}
			}).click();
			
		
		}
	
	}
	
	/**
	 * @function
	 * @name loadSchema
	 * @memberOf xataface.modules.pdfreports.containers.xataface.XFReportContainer#
	 * @description Loads a schema by table name.
	 * @param {Object} params
	 * @param {int} params.id The name of the table to load.
	 * @param {LoadSchemaCallback} callback The callback to be called when the schema
	 * 	has been loaded.
	 *
	 */
	function XFReportContainer_loadSchema(/**Object*/ params){
		if ( typeof(params) == 'undefined' ) params = {};
		if ( !params.callback ) params.callback = function(){};
		var loadSchemaCallback = params.callback;
		if ( params.id ){
			
			var q = {
				'-action': 'htmlreports_schemabrowser_getschema',
				'-table': params.id
				
			};
			
			$.get(DATAFACE_SITE_HREF, q, function(res){
			
				try {
				
					if ( typeof(res) != 'object' ){
						
						throw 'Failed to load schema.  Expected result to be an object but received something else.';
					}
					if ( res.code != 200 ){
						if ( res.error ) throw res.error;
						else throw 'Failed to load schema due to an unspecified server error. Please check the serve logs for details.';
						
					} else {
						
						var root = new DataSchema();
						$.each(res.schema, function(idx, schema){
							if ( schema['data-key'] != 'relationships' ){
								
								$.each(schema.children, function(idx, iSchema){
									var fieldSchema = new DataSchema({
										name: iSchema.attr['xf-htmlreports-fieldname'],
										label: iSchema.data,
										macro: iSchema.attr['xf-htmlreports-macro'],
										isField: true
									
									});
									$.each(iSchema.children, function(idx, fSchema){
										var funcSchema = new DataSchema({
											name: fSchema.data,
											label: fSchema.data,
											macro: fSchema.attr['xf-htmlreports-macro'],
											isFunction: true
										});
										fieldSchema.add(funcSchema);
									
									});
									
									root.add(fieldSchema);
									
								});
							} else {
								$.each(schema.children, function(idx, rSchema){
									
									var relSchema = new DataSchema({
										name: rSchema.attr['xf-htmlreports-relationshipname'],
										label: rSchema.data,
										isSchema: true
										
									});
									
									$.each(rSchema.children, function(idx, rfSchema){
										var relFieldSchema = new DataSchema({
											name: rfSchema.attr['xf-htmlreports-fieldname'],
											label: rfSchema.data,
											macro: rfSchema.attr['xf-htmlreports-macro'],
											isField: true
										});
										if ( rfSchema.children ){ 
											$.each(rfSchema.children, function(idx, rffSchema){
												var funcSchema = new DataSchema({
													name: rffSchema.data,
													label: rffSchema.data,
													macro: rffSchema.attr['xf-htmlreports-macro'],
													isFunction: true
												});
												relFieldSchema.add(funcSchema);
											
											});
										}
										
										
										relSchema.add(relFieldSchema);
									});
									
									root.add(relSchema);
									
								});
							}
							
						});
						
						loadSchemaCallback({
							code: 200,
							serializedSchema: root.serialize()
						});
					
					}
				} catch (e){
					loadSchemaCallback({
						code: 500,
						error: e
					});
					return;
				}
			});
			
		} else {
			
			this.showSettingsDialog(params);
			
		}
	}
	
	/**
	 * @name save
	 * @function
	 * @memberOf xataface.modules.pdfreports.containers.xataface.XFReportContainer#
	 *
	 * @see xataface.modules.pdfreports.ReportContainer#save
	 */
	function XFReportContainer_save(/**Object*/ params){
		if ( typeof(params.callback) == 'undefined' ) params.callback = function(){};
		var container = this;
		var recid;
		if ( params.id ){
			// An ID was specified so we just go ahead and save it.
			
			recid = 'xf_pdfreports_reports?report_id='+params.id;
			
			IO.update(recid, {
					report_template: params.template
				}, 
				function(res){
					try {
						var p = {
							code: 500
						};
						if ( res.code ) p.code = res.code;
						if ( p.code != 200 ) {
							p.error = 'Server Error.  Check log.';
						} else {
							// recordId is a xataface record id (e.g. tablename?key1=val1)
							// wherease the save callback is just expecting the primary key
							// value.
							p.id = res.recordId.substr(res.recordId.indexOf('=')+1);
							p.version = params.version;
							
						}
						
						params.callback.call(this, p);
						
					} catch (e){
						
					
						var p = {
							code: 500,
							
							error: 'Unspecified server error'
						};
						params.callback.call(container, p);
					}
				
				}
			);
			
			
		} else {
			
			// We need to open a record dialog to add a new record.
			var dlg = new xataface.RecordDialog({
				table: 'xf_pdfreports_reports',
				callback: function(data){
					if ( typeof(data) == 'undefined' ){
						// If there is no data returned, that means that saving was cancelled.
						return;
					} else {
						if ( !data.report_id ){
							params.callback.call(container, {code: 500, error: 'No report ID was returned.'});
						}
						params.id = data.report_id;
						container.save(params);
					}
				}
			});
			dlg.display();
		
		}
		
		
	}
	
	/**
	 * @function 
	 * @description Opens a dialog to preview a report.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @name preview
	 * @param {Object} params
	 * @param {PreviewCallback} params.callback Callback function called when the preview is complete.
	 * @param {String} params.serializedReport Serialized version of the report to preview.
	 * @param {String} params.schemaId The ID of the schema to use
	 * @param {String} params.id The id of the report to preview.
	 * 
	 */
	function XFReportContainer_preview(params){
		var self = this;
		var tpl = params.serializedReport;
	
		var q = {
			'--templateContent': tpl, 
			'-action': 'pdfreports_print_report_html',
			'-table': params.schemaId
		};
		XataJax.form.submitForm('post', q, '_blank');
		
	}
	

})();