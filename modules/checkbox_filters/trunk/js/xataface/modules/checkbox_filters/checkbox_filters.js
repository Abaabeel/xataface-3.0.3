//require <xatajax.util.js>
//require-css <xataface/modules/checkbox_filters/checkbox_filters.css>
(function(){

	var $ = jQuery;
	
	
	function refresh(div){
		var request = XataJax.util.getRequestParams();
		var opts = getSelectedOptions(div);

		if ( opts.length == 0 && !request[getFieldName(div)] ){
			return;
		}
		opts = opts.join(' OR ');
		//alert(opts);
		if ( request[getFieldName(div)] == opts ){
			return;
		}
		request[getFieldName(div)] = opts;
		window.location.href = XataJax.util.url(request);
		return;
		
	}
	
	function getFieldName(div){
		return $(div).attr('data-xf-checkbox-filter-field');
	}
	
	function getSelectedOptions(div){
		var opts = [];
		$('input[type="checkbox"]:checked', div).each(function(){
			opts.push($(this).val());
		});
		return opts;
	}
	
	
	$(document).ready(function(){
		$('.xf-checkbox-filters').each(function(){
			var div = this;
			$('button', this).click(function(){

				refresh(div);
			});
			
		});
	});

})();