/*
 * Xataface Duration Selector Module
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
 
 
//require <jquery.packed.js>
//require <date.js>
(function(){
	var $ = jQuery;
	
	
	function mysqlTimeStampToDate(timestamp) {
		//function parses mysql datetime string and returns javascript Date object
		//input has to be in this format: 2007-06-05 15:26:02
		var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
		var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
		return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
	  }
	
	function formatDate(formatDate, formatString) {
		if(formatDate instanceof Date) {
			//alert(formatDate);
			var months = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
			var yyyy = formatDate.getFullYear();
			var yy = yyyy.toString().substring(2);
			var m = formatDate.getMonth()+1;
			var mm = m < 10 ? "0" + m : m;
			var mmm = months[m];
			var d = formatDate.getDate();
			var dd = d < 10 ? "0" + d : d;
	 
			var h = formatDate.getHours();
			var hh = h < 10 ? "0" + h : h;
			var n = formatDate.getMinutes();
			var nn = n < 10 ? "0" + n : n;
			var s = formatDate.getSeconds();
			var ss = s < 10 ? "0" + s : s;
	 
			formatString = formatString.replace(/yyyy/, yyyy);
			formatString = formatString.replace(/yy/i, yy);
			formatString = formatString.replace(/mmm/i, mmm);
			formatString = formatString.replace(/mm/i, mm);
			formatString = formatString.replace(/m/i, m);
			formatString = formatString.replace(/dd/i, dd);
			formatString = formatString.replace(/d/i, d);
			formatString = formatString.replace(/hh/i, hh);
			formatString = formatString.replace(/h/i, h);
			formatString = formatString.replace(/nn/i, nn);
			formatString = formatString.replace(/n/i, n);
			formatString = formatString.replace(/ss/i, ss);
			formatString = formatString.replace(/s/i, s);
	 
			return formatString;
		} else {
			return "";
		}
	}
	
		
	
	/**
	 * Finds a field by name relative to a starting point.  It will search only within
	 * the startNode's form group (i.e. class xf-form-group).
	 *
	 * @param {HTMLElement} startNode The starting point of our search (we search for siblings).
	 * @param {String} fieldName The name of the field we are searching for.
	 *
	 * @return {HTMLElement} The found field or null if it cannot find it.
	 */
	function findField(startNode, fieldName){
		
		var parentGroup = $(startNode).parents('.xf-form-group').get(0);
		if ( !parentGroup ) parentGroup = $(startNode).parents('form').get(0);
		if ( !parentGroup ) return null;
		//alert('here');
		var fld = $('[data-xf-field="'+fieldName+'"]', parentGroup).get(0);
		return fld;
	}
	
	function updateSelect(select, startField, endField){
		if ( !$(startField).val() ) return;
		if ( !$(endField).val() ) return;
		
		//var startDate = mysqlTimeStampToDate($(startField).val());
		var startDate = Date.parse($(startField).val());
		//var endDate = mysqlTimeStampToDate($(endField).val());
		var endDate = Date.parse($(endField).val());
		
		var diffSeconds = Math.floor((endDate.getTime()-startDate.getTime())/1000);
		var diffMinutes = Math.floor(diffSeconds/60);
		//alert(diffSeconds);
		var selectedOption = $('option[value="'+diffSeconds+'"]', select);
		if ( selectedOption.size() == 0 ){
	
			$(select).append(
				$('<option></option>')
					.attr('value', diffSeconds)
					.text(diffMinutes+' minutes')
			);
			
			
		}
		//alert(diffMinutes);
		$(select).val(diffSeconds);
		
	}
	
	function updateEndField(select, startField, endField){
		
		if ( !$(startField).val() ) return;
		if ( !$(select).val() ) return;
		
		//var startDate = mysqlTimeStampToDate($(startField).val());
		var startDate = Date.parse($(startField).val());
		//alert("Val: "+$(startField).val());
		//alert("Start "+startDate);
		var durationSeconds = parseInt($(select).val());
		//alert("Start: "+startDate);
		//alert("duration seconds" + durationSeconds);
		//alert('duration: '+durationSeconds);
		var endDate = new Date(startDate.getTime()+durationSeconds*1000);
		var dateStr = formatDate(endDate, 'yyyy-mm-dd hh:nn:ss');
		$(endField).val(dateStr);
		
	}
	
	function buildOptions(select, intervalMinutes){
	
		for ( var i=0; i < 3600; i+= intervalMinutes ){
			$(select).append(
				$('<option></option>')
					.attr('value', i*60)
					.text(i+' minutes')
			);
		}
	}
	
	
	
	
	
	
	/**
	 * When defining the javascript for a widget, we always wrap it in
	 * registerXatafaceDecorator so that it will be run whenever any new content is
	 * loaded ino the page.  This makes it compatible with the grid widget.
	 *
	 * If you don't do this, the widget will only be installed on widgets at page load time
	 * so when new rows are added via the grid widget, the necessary javascript won't be installed
	 * on those widgets.
	 */
	registerXatafaceDecorator(function(node){
		
		$('input.xf-durationselector', node).each(function(){
			//alert('here');
			var self = this;
			var startFieldName = $(self).attr('data-xf-durationselector-start');
			if ( !startFieldName ) return;
			
			var startField = findField(self, startFieldName);
			if ( !startField ) return;
			
			
			
			
			var select = $('<select></select>')
				.append('<option value="">Please Select</option>');
				
			if ( $(self).val() ){
				var val = $(self).val();
				
			}
			
			$(self).change(function(){
				updateSelect(select, startField, self);
			});
			
			$(select).change(function(){
				updateEndField(select, startField, self);
			});
			
			$(startField).change(function(){
				updateEndField(select, startField, self);
			});
			
			$(self).parents('form').submit(function(){
				updateEndField(select, startField, self);
				//alert($(self).val());
				return true;
				
			});
			
			
			var interval = parseInt($(self).attr('data-xf-durationselector-interval'));
			buildOptions(select, interval);
			
			
			$(self).after(select);
			$(self).hide();
			updateSelect(select, startField, self);
			
			
			
			
			
			
		});
		
		
	
	});
})();