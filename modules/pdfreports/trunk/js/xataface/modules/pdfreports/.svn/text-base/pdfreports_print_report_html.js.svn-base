//require <jquery.packed.js>
//require <jquery-ui.min.js>
//require-css <jquery-ui/jquery-ui.css>
//----require <xataface/modules/pdfreports/pdfrenderer.js>
//require <xataface/modules/pdfreports/PDFReport.js>
//require-css <xataface/modules/pdfreports/PDFReport.css>
//require <jquery-pdf/jquery.pdf.js>
(function(){
	var $ = jQuery;
	var pdfreports = XataJax.load('xataface.modules.pdfreports');
	var PDFPage = pdfreports.PDFPage;
	//xataface.modules.pdfreports.PDFPage.codebase = XF_PDF_REPORTS_URL+'/js/xataface/modules/pdfreports/codebase';
	
	
	
	$('html, body').css({
		padding: 0,
		margin: 0
	
	});
	
	var backgrounds = [];
	var backgroundClones = [];
	var u = 'px';
	
	$('.xf-ReportViewer').each(function(){
		var report = this;
		var prefix = 'data-xf-reportviewer-';
		
		$(this).parents('.xf-ReportViewer-wrapper').css({
			width: $(report).attr(prefix+'width')+u,
			padding:0,
			margin:0
		});
		
		$(report).css({
			width: $(report).attr(prefix+'width')+u,
			padding:0,
			margin:0
		});
		
		
		var pageNum = 0;
		
		
		function decoratePagePanel(/*HTMLElement*/ page, /*HTMLElement*/ report){
	
	
			$(page).css({
				width: $(report).attr(prefix+'width')+u,
				height: $(report).attr(prefix+'height')+u,
				//border: '1px solid black !important',
				position: 'relative',
				padding:0,
				margin:0,
				'page-break-after': 'always'
			
			});
			/*
			if ( backgrounds[pageNum] ){
				var bg = $(backgrounds[pageNum]).clone();
				if ( !backgroundClones[pageNum] ){
					backgroundClones[pageNum] = [];
				}	
				backgroundClones[pageNum].push(bg);
				
				$(page).prepend(bg);
			} else {
			
				var pdfPage = new PDFPage({
					url: $(report).attr(prefix+'pdfUrl'),
					width: $(this).width()*3.5,
					page: pageNum
				});
				//alert($(this).width());
				
				$(pdfPage).bind('afterUpdate', function(){
					//alert(backgroundClones[this.page]);
					$.each(backgroundClones[this.page], function(){
						$(this).attr('src', $(pdfPage.el).attr('src'));
					});
				});
				
				pdfPage.render();
				$(pdfPage.el).css({
					width: $(report).attr(prefix+'width')+u,
					'z-index': -10,
					'padding': 0,
					'margin': 0,
					'position': 'absolute',
					'top': 0,
					'left': 0
				});
				$(page).prepend(pdfPage.el);
				backgrounds[pageNum] = pdfPage.el;
			}
			pageNum++;
			*/
			
			$(page).children('.xf-ReportViewer-PageElement').each(function(){
			
				decoratePageElement(this, page, report);
				
			
			});
			
	
		
		}
		
		
		function decoratePageElement(/*HTMLElement*/ pageElement, /*HTMLElement*/ page, /*HTMLElement*/ report){
			var pePrefix = 'data-xf-reportviewer-pageelement-';
			$(pageElement).css({
			
				width: $(pageElement).attr(pePrefix+'width')+u,
				height: $(pageElement).attr(pePrefix+'height')+u,
				'font-size': $(pageElement).attr(pePrefix+'fontSize')+u,
				'font-family': $(pageElement).attr(pePrefix+'fontFamily'),
				'z-index': parseInt($(pageElement).attr(pePrefix+"zIndex")),
				position: 'absolute',
				top: $(pageElement).attr(pePrefix+'y')+u,
				left: $(pageElement).attr(pePrefix+'x')+u,
				padding: 0,
				margin: 0,
				'line-height': '1em',
				border: '2pt solid transparent',
				'font-weight': ($(pageElement).attr(pePrefix+'isBold') == 'true') ? 'bold':'normal',
				'font-style': ($(pageElement).attr(pePrefix+'isItalic') == 'true') ? 'italic':'normal',
				'text-decoration': ($(pageElement).attr(pePrefix+'isUnderlined') == 'true' ) ? 'underline': 'none',
				'text-align': ($(pageElement).attr(pePrefix+'textAlign')||'left'),
				'background-color': ($(pageElement).attr(pePrefix+'backgroundColor')||'transparent')
			
			});
			
			$('.preview-content', pageElement).css('display','none');
			$(pageElement).children('.xf-ReportViewer-Portal-childrenPane').css({
				padding: 0,
				margin: 0,
				border: 'none'
				
			});
			$(pageElement).children('.xf-ReportViewer-Portal-childrenPane').children('li').css({
				width: $(pageElement).attr(pePrefix+'width')+u,
				height: $(pageElement).attr(pePrefix+'height')+u,
				padding: 0,
				margin: 0,
				position: 'relative',
				border: 'none',
				'list-style-type': 'none',
				'list-style-image': 'none'
				
				
			}).each(function(){
				//console.log(this);
			});
			$(pageElement).children('.xf-ReportViewer-Portal-childrenPane').children('li').children('.xf-ReportViewer-PageElement').each(function(){
				decoratePageElement(this, page, report);
			});
			
		
		}
		
		
		$('.xf-ReportViewer-PagePanel', report).each(function(){
			decoratePagePanel(this, report);
			
		});
	});

	/*
	var link = document.createElement('a');
	$(link).text('Creating PDF');
	$('body').append(link);
	$(link).pdfButton({
		'canvas': '.xf-ReportViewer',
		'path': XF_PDF_REPORTS_URL+'/jquery-pdf/'
	});
	$(link).click();
	*/
	$(document).ready(function(){
		
		var dlg = $('<div>').
			append('<img src="'+DATAFACE_URL+'/images/progress.gif"/> Generating Report..  Please wait...')
			.get(0);
		$(dlg).dialog({modal: true});
		var format = $('.xf-ReportViewer-PagePanel').width()+'x'+$('.xf-ReportViewer-PagePanel').height();
		
		var rparams = {};
		if ( window.JQUERY_PDF_RPARAMS ){
			$.extend(rparams, window.JQUERY_PDF_RPARAMS);
		}
		pdfreports.domToPdf($('.xf-ReportViewer-wrapper').get(0), null, format, $('.xf-ReportViewer').attr('data-xf-reportviewer-reportid'), rparams);
	});



})();