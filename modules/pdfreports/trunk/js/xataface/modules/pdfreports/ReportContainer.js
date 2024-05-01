//require <jquery.packed.js>
//require <xatajax.core.js>
(function(){

	var $ = jQuery;
	var pdfreports = XataJax.load('xataface.modules.pdfreports');
	pdfreports.ReportContainer = ReportContainer;
	
	/**
	 * @namespace
	 * @name containers
	 * @memberOf xataface.modules.pdfreports
	 */
	
	/**
	 * @class An interface for containers for the pdf editor.
	 * @name ReportContainer
	 * @description An interface that can be implemented to provide 
	 * services to the pdfeditor such as loading, saving, and properties
	 * that lie outside the file itself.  The container may interact
	 * with systems that hold the reports to allow the user to configure
	 * how the report should interact with the underlying system.
	 *
	 * @memberOf xataface.modules.pdfreports
	 * @see xataface.modules.pdfreports.PDFEditor-container
	 */
	 
	/**
	 * @constructor
	 * @name ReportContainer
	 * @memberOf xataface.modules.pdfreports
	 * @param {Object} o Configuration variables.
	 */
	function ReportContainer(/*Object*/ o, internal){
		if ( internal ) return;
		if ( typeof(o) == 'undefined') o = {};
		$.extend(this,o);
	}
	
	$.extend(ReportContainer.prototype, {
	
		save: ReportContainer_save,
		load: ReportContainer_load,
		'delete': ReportContainer_delete,
		preview: ReportContainer_preview,
		settingsDialog: ReportContainer_settingsDialog,
		loadSchema: ReportContainer_loadSchema,
		loadPdf: ReportContainer_loadPdf
		
		
	});
	
	
	/**
	 * @name SaveCallback
	 * @memberOf xataface.modules.pdfreports.ReportContainer
	 * @function
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {int} result.version The version that is being saved.
	 * @param {String} result.error The error message
	 * @param {String} result.id The ID of the report as it was saved.  This is so it can be retrieved.
	 * @param {String} result.name The name of the report as it was saved.
	 */
	 
	
	 
	/**
	 * @name DeleteCallback
	 * @function
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {String} result.error The error message
	 * @param {xataface.modules.pdfreports.PDFEditor} result.editor The editor that was deleted.
	 */
	 
	/**
	 * @name PreviewCallback
	 * @function
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {String} result.error The error message
	 */
	 
	/**
	 * @name LoadCallback
	 * @function
	 * @memberOf xataface.modules.pdfreports.ReportContainer
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {int} result.version The version number we just loaded.
	 * @param {String} result.error The error message.
	 * @param {HTMLElement} result.serializedReport The serialized report that was loaded.
	 */
	 
	/**
	 * @name LoadSchemaCallback
	 * @function
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {String} result.error The error message.
	 * @param {HTMLElement} result.serializedSchema The serialized schema that was loaded.
	 */
	 
	/**
	 * @name LoadPdfCallback
	 * @function
	 * @param {Object} result
	 * @param {int} result.code The response code (200 for success)
	 * @param {String} result.error The error message.
	 * @param {String} result.pdfUrl The URL to the PDF that was loaded.
	 */
	/**
	 * @name SettingsDialogCallback
	 * @function
	 * @param {Object} result
	 * @param {String} result.schemaId The Schema that is now used for the report.
	 * @param {String} result.pdfUrl The PDF URL that was set.
	 */
	
	
	/**
	 * @function 
	 * @description Opens a save dialog for the report.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @name save
	 * @param {Object} params Parameters
	 * @param {xataface.modules.pdfreports.ReportContainer.SaveCallback} params.callback Callback function called when the save is complete.
	 * @param {String} params.id The id of the report to save.  If this is not provided then
	 * @param {String} params.template The serialized form template to be saved.
	 * @param {String} params.version The version number that is being saved.
	 *	this method may open a dialog to ask the user where to save it.
	 *
	 */
	function ReportContainer_save(/**Object*/ params){
		console.log('ReportContainer.save is not implemented.  Please implement in the subclass.');
	}
	
	/**
	 * @function 
	 * @description Opens a dialog to load a report.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @name load
	 * @param {Object} params
	 * @param {xataface.modules.pdfreports.ReportContainer.LoadCallback} params.callback Callback function called when the load is complete.
	 * @param {String} params.id The id of the report to load.  If this is not provided then
	 * 		this method may open a dialog to ask the user which report to load.
	 *
	 */
	function ReportContainer_load(/**Object*/ params){
		console.log('ReportContainer.load is not implemented.  Please implement in the subclass.');
	}
	
	/**
	 * @function 
	 * @description Opens a dialog to delete a report.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @name delete
	 * @param {Object} params
	 * @param {DeleteCallback} params.callback Callback function called when the delete is complete.
	 * @param {String} params.id The id of the report to delete.  If this is not provided
	 * 
	 */
	function ReportContainer_delete(/**Object*/ params){
		console.log('ReportContainer.delete is not implemented.  Please implement in the subclass.');
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
	function ReportContainer_preview(/**Object*/ params){
		console.log('ReportContainer.preview is not implemented.  Please implement in the subclass.');
	}
	
	
	
	/**
	 * @function 
	 * @description Opens a dialog to edit the properties of a report with 
	 *	 respect to the container.  This might include things like permissions
	 *   or where the report should be integrated into a system etc..
	 *
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @name settingsDialog
	 * @param {Object} params
	 * @param {String} params.id The ID of the report to open the settings dialog for.
	 * @param {SettingsDialogCallback} params.callback Callback function called when settings are changed.
	 *
	 * 
	 */
	function ReportContainer_settingsDialog(/*Object*/ params){
		console.log('ReportContainer.preview is not implemented.  Please implement in the subclass.');
	}
	
	
	/**
	 * @function
	 * @name loadSchema
	 * @description Opens a dialog to load a schema.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @param {Object} params
	 * @param {String} params.id The ID of the schema to load.  If this is not provided
	 *	then this method will open a dialog to allow the user to browse for the schema 
	 *  that they want to load.
	 * @param {xataface.modules.pdfreports.PDFEditor} params.editor
	 * @param {LoadSchemaCallback} params.callback Callback function to handle when the schema is loaded.
	 */
	function ReportContainer_loadSchema(/**Object*/ params){
		console.log('ReportContainer.schema is not implemented.  Please implement in the subclass.');
	
	}
	
	/**
	 * @function
	 * @name loadPdf
	 * @description Opens a dialog to load a PDF.
	 * @memberOf xataface.modules.pdfreports.ReportContainer#
	 * @param {Object} params
	 * @param {xataface.modules.pdfreports.PDFEditor} params.editor
	 * @param {LoadPdfCallback} params.callback Callback function to handle when the PDF is loaded.
	 */
	function ReportContainer_loadPdf(/**Object*/ params){
	
	}
	
	
	
	
	
	
})();