//require <jquery.packed.js>
//require <xataface/modules/pdfreports/pdfeditor.js>
//require <xataface/modules/pdfreports/containers/xataface/XFReportContainer.js>
(function(){

	var $ = jQuery;
	
	var pdfreports = xataface.modules.pdfreports;
	var PDFEditor = pdfreports.PDFEditor;
	var XFReportContainer = XataJax.load('xataface.modules.pdfreports.containers.xataface.XFReportContainer');
	
	
	// We need to specify the location of the Jar files for the pdf renderer.
	xataface.modules.pdfreports.PDFPage.codebase = XF_PDF_REPORTS_URL+'/js/xataface/modules/pdfreports/codebase';
	$(document).ready(function(){
		var editor = new PDFEditor();
		editor.uploadUrl = 'foo';
		
		var zoomIn = editor.newTool(PDFEditor.actions.zoomIn);
	
		var zoomOut = editor.newTool(PDFEditor.actions.zoomOut);
		var changeBg = editor.newTool(PDFEditor.actions.changeBackground);
		var editableAction = editor.newTool(PDFEditor.actions.editable);
		var componentPaletteAction = editor.newTool(PDFEditor.actions.showComponentPalette);
		var serializeAction = editor.newTool(PDFEditor.actions.serialize);
		var previewAction = editor.newTool(PDFEditor.actions.preview);
		var schemaAction = editor.newTool(PDFEditor.actions.showSchemaBrowser);
		var loadReportAction = editor.newTool(PDFEditor.actions.loadReport);
		var settingsAction = editor.newTool(PDFEditor.actions.settingsAction);
		var saveAction = editor.newTool(PDFEditor.actions.save);
		
		editor.addAction(zoomIn);
		editor.addAction(zoomOut);
		//editor.addAction(changeBg);
		//editor.addAction(editableAction);
		//editor.addAction(componentPaletteAction);
		//editor.addAction(serializeAction);
		editor.addAction(previewAction);
		editor.addAction(schemaAction);
		editor.addAction(loadReportAction);
		editor.addAction(settingsAction);
		editor.addAction(saveAction);
		
		editor.viewer.setEditable(true);
		editor.container = new XFReportContainer();
		editor.viewer.setPdfUrl(XF_PDF_REPORTS_URL+'/test.pdf');
		//editor.viewer.setPdfUrl('http://localhost/recipedb/index.php?-action=getBlob&-table=xf_pdfreports_reports&-field=background_pdf&-index=0&report_id=2');
		
		$('#pdf-editor-demo-wrapper').append(editor.el);
		
		//var pe = editor.viewer.newPageElement();
		
		//$(pe.contentEl).append($('<div class="preview-content">Preview Content</div>'));
		//$(pe.contentEl).append($('<div class="edit-content">Edit Content</div>'));
	
		/*
		$(editor.viewer).bind('pdfLoaded', function(){
			var curr = this.getCurrentPage();
			curr.addElement(pe);
			
			curr.update();
		});
		*/
		editor.update();
		
		$(document).ready(function(){
			
			
			//editor.loadReportById(null);
		});
	});
	
	
	
	
})();