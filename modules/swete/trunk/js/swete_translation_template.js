jQuery(document).ready(function($){


	jQuery().translationsReady(function(lan){
	
		function showLockedSections(){
			jQuery('body').removeClass('hide-locked-sections');
		}
		
		function hideLockedSections(){
			jQuery('body').addClass('hide-locked-sections');
		}
		
		
		
		
			
	
	
		if ( lan != 'en' ){
		
			// Only if we aren't using the default language
			var firstDiv = $('div').get(0);
			$(firstDiv).before('<div id="xataface-translation-menu">&nbsp;</div>');
			
			$('#xataface-translation-menu').each(function(){
				$(this).append('<a href="#" class="menubar-button" title="Save Translations to Database" id="save-translations-menu-item" onclick="return false;"><span>Save Translations</span></a>');
				$(this).append('<a id="back-to-list-menu-item" class="menubar-button" title="Back return to Xataface" href="'+DATAFACE_SITE_HREF+'?-table='+$('body').attr('data-table')+'"><span>Back to List Page</span></a>');
				var saving = false;
				$('#save-translations-menu-item').click(function(){
					if ( saving ) return; // if we're already in a save don't do anything
					saving = true;
					$('span',this).html('Saving... Please wait ...');
					var btn = this;
					var message = {};
					
					var toSave = 0;
					$('.record-row').each(function(){
						if ( $(this).attr('locked-'+lan) == "1" ) return;
						toSave++;
						var id = $(this).attr('data-xataface-id');
						var row = {};
						$('.record-column', this).each(function(){
							var col = $(this).attr('data-column');
							var val = $(this).html();
							row[col] = val;
						});
						message[id] = row;
						
					});
					
					if ( toSave == 0 ){
						alert("No records can be saved because there are no unlocked records in this found set.");
						saving = false;
						$('span',btn).html('Save Translations');
						return;
					}
					
					if ( !confirm('Are you sure you want to save these translations to the database?  '+toSave+' records will be updated.') ){
						saving=false;
						$('span',btn).html('Save Translations');
						return;
					}
					
					var params = {
						'-table': $('body').attr('data-table'),
						'-action': 'swete_save_translations',
						'--message': $.toJSON(message),
						'--lang': lan
					};
					
					
					
					$.post(DATAFACE_SITE_HREF, params, function(data){
						try {
							if ( typeof(data) == 'string' ){
								eval('data='+data+';');
							}
							if ( data['code'] == 200 ){
								alert('Save successful');
							} else {
								throw ('Save failed with code '+data['code']+' and message '+data['message']);
							}
							
							
						} catch (e){
							alert(e);
						}
						
						saving = false;
						$('span',btn).html('Save Translations');
						
					});
					
					
					
				});
				
				$(this).append('<a href="#" class="menubar-button" title="Hide Locked Sections" onclick="return false;" id="hide-locked-sections"><span>Hide Locked Sections</span></a> <a href="#" class="menubar-button" onclick="return false;" id="show-locked-sections" title="Show locked sections"><span>Show Locked Sections</span></a>');
				
				$('#hide-locked-sections').click(hideLockedSections);
				$('#show-locked-sections').click(showLockedSections);
			
			});
			
			
			$('.record-row').each(function(){
				var firstDiv = $('div', this).get(0);
				$(firstDiv).before('<div class="row-menu">&nbsp;</div>');
				
				var menu = $('.row-menu', this);
				var row = this;
				menu.append('<a href="#" onclick="return false;" class="save-row-menu-item menubar-button" title="Save Row"><span>Save</span></a>');
				menu.append('<a href="#" onclick="return false;" class="locked-row-menu-item menubar-button" title="This Row is locked and cannot be translated.  Click for more info"><span>Locked</span></a>');
				
				
				function unlockRecord(){
				
					var msg = 'Are you sure you want to unlock this record?  This will change the translation status from "'+$(row).attr('status-'+lan+'-label')+'" to "Externally Managed".  This change will allow you to manage the translation using SWeTE, but, in doing so, any existing translation of this record may be overwritten when you hit "Save".';
					if ( !confirm(msg) ){
						return;
					}
				
					var params = {
						'-table': $('body').attr('data-table'),
						'-action': 'swete_unlock_record',
						'-record-id': $(row).attr('data-xataface-id'),
						'--lang': lan
					};
					
					$.post(DATAFACE_SITE_HREF, params, function(response){
						try {
							if ( response.error ){
								throw response.error;
							}
							if ( !response.success ){
								throw 'Failed to unlock record due to an unspecified server error';
							}
							
							if ( typeof(response.status_code)=='undefined' || !response.status_label ){
								throw 'The unlock may have proceeded but the message returned from the server was inconsistent.  Please refresh the browser and see if the  translation status of this record is appropriately updated.';
								
							}
							
							
							$(row).attr('status-'+lan, response.status_code);
							$(row).attr('status-'+lan+'-label', response.status_label);
							$(row).attr('locked-'+lan, 0);
							$(row).attr('locked-'+lan+'-reason', '');
							$(row).removeClass('locked-'+lan);
							
						} catch ( e ){
							alert(e);
						}
					});
				}
				
				
				
				function showRecordDiff(){
					var data = {};
					$('.record-column', row).each(function(){
						data[$(this).attr('data-column')] = $(this).html();
					});
					
					var params = {
						'-table': $('body').attr('data-table'),
						'-action': 'swete_show_diff',
						'-record-id': $(row).attr('data-xataface-id'),
						'--lang': lan,
						'-data': $.toJSON(data)
					};
					
					$.post(DATAFACE_SITE_HREF, params, function(response){
						try {
							if ( response.error ) throw response.error;
							if ( !response.success ) throw 'Failed to load diff because of an unspecified server error';
							if ( typeof(response.diff) == 'undefined' ){
								alert('Failed to get diff.  No error was reported but no diff was returned either.');
							}
							
							var div = document.createElement('div');
							
							var matrix = '<table class="diff-table"><thead><tr><th>Column</th><th>Database Version</th><th>SWeTE Version</th></tr></thead><tbody>';
							for ( var col in response.diff ){
								matrix += '<tr class="translation-value-row" data-column-name="'+col+'"><th valign="top">'+col+'</th><td>'+response.diff[col].database+'</td><td class="swete-version">'+response.diff[col].swete+'</td></tr>';
								matrix += '<tr><th valign="top">Diff</th><td colspan="2" class="diff-cell">'+response.diff[col].diff+'</td></tr>';
								
							}
							matrix += '</tbody></table>';
							$(div).html(matrix);
							$('a', div).click(function(){ return false;});
							
							
							function parseDiff(diffEl){
								var cp = $(diffEl).clone();
								$('del', cp).remove();
								$('ins', cp).each(function(){
									var content = $(this).html();
									$(this).after(content);
									$(this).remove();
								});
								return $(cp).text();
							}
							
							function save(unlocked){
								if ( !unlocked ) unlocked = 0;
								else unlocked = 1;
								var data = {};
								$('tr.translation-value-row', div).each(function(){
									data[$(this).attr('data-column-name')] = $('td.swete-version', this).html();
									
								});
								
								var params = {
									'-action': 'swete_save_translation',
									'-table': $('body').attr('data-table'),
									'-record-id': $(row).attr('data-xataface-id'),
									'-data': $.toJSON(data),
									'-unlocked': unlocked,
									'--lang': lan
								};
								
								$.post(DATAFACE_SITE_HREF, params, function(response){
									try {
										if ( response.error ) throw response.error;
										if ( !response.success ) throw 'Save failed due to an unspecified server error.';
										if ( unlocked ){
											$(row).attr('status-'+lan, response.status_code);
											$(row).attr('status-'+lan+'-label', response.status_label);
											$(row).attr('locked-'+lan, 0);
											$(row).attr('locked-'+lan+'-reason', '');
											$(row).removeClass('locked-'+lan);
										}
										
									} catch (e){
										alert(e);
									}
								});
								
							}
							
							$('td.diff-cell',div).each(function(){
								var diffRow = $(this).parent('tr');
								var diffCell = this;
								var contentRow = $(diffRow).prev('tr');
								var sweteCell = $('td.swete-version', contentRow);
							
								$('del', this).click(function(){
									// let's find the corresponding insert
									var ins = $(this).next('ins');
									var txt = $(ins).html();
									$(ins).html($(this).html());
									$(this).html(txt);
									$(sweteCell).html(parseDiff(diffCell));
									
								});
								
								$('ins', this).click(function(){
									// let's find the corresponding insert
									var del = $(this).prev('del');
									var txt = $(del).html();
									$(del).html($(this).html());
									$(this).html(txt);
									$(sweteCell).html(parseDiff(diffCell));
								});
							});
							
							
							$(div).dialog({
								title: 'Differences Between Database Translation & SWeTE Translation',
								width: 800,
								height: 400,
								buttons: {
									'Close': function(){$(div).dialog('destroy');},
									'Save & Unlock': function(){ save(1); $(div).dialog('destroy');},
									'Save & Keep Locked': function(){ save(0); $(div).dialog('destroy');}
								}
							});
							
						} catch (e){
							alert(e);
						}
					});
				}
				
				
				$('.locked-row-menu-item', this).click(function(){
					var dlg = document.createElement('div');
					$('body').append(dlg);
					$(dlg).append('<p>This record is currently locked because its translation status is "'+$(row).attr('status-'+lan+'-label')+'".  In order to prevent SWeTE from accidentally overwriting translations that you have done within the Xataface interface, the SWeTE translation function will only allow you to save translations that are either currently managed by SWeTE, or have not been translated at all by a human in the Xataface administration interface.</p>');
					$(dlg).append('<h3>What now?</h3>');
					$(dlg).append('<p>If you want to translate this record, you have 3 options:</p>');
					$(dlg).append('<ol><li><b>Unlock</b> - You can unlock the row so that SWeTE can overwrite the translation.  If you do this and then hit "Save" it will replace whatever translation is currently saved for this field with the one you are managing in SWeTE.</li><li><b>Use Xataface Translation Form</b> - You can always use the Xataface translation form to update this record\'s translation directly.</li><li><b>Review and Merge</b> - Compare the existing translation to SWeTE\'s translation and merge the differences.</li></ol>');
					$(dlg).dialog({
						width: 640,
						title: 'Record Locked',
						buttons: {
							'Cancel': function(){},
							'Unlock': function(){unlockRecord(); $(dlg).dialog('destroy');},
							//'Translate in Xataface': function(){},
							'Review & Merge': function(){showRecordDiff(); $(dlg).dialog('destroy');}
						}
					});
					
				});
				
				
			});
			
			
			
			
			
			
			
			
		}
	});
});