/*
 * Xataface Switch User Module
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
//require-css <xataface/modules/switch_user/switch_user.css>



(function(){
	
	var initSwitchUser;
	var $ = jQuery;
	jQuery(document).ready(function($){
		
		var userbar = document.createElement('div');
		$(userbar).attr('id', 'switch-user-menu');
		$(userbar).html('Logged in as <span id="switch-user-username">&nbsp;</span>. <a href="#" id="switch-user-btn" title="Switch User"><span>Switch User</span></a>');
		var usernameSpan = $('#switch-user-username', userbar).get(0);
		var switchUserBtn = $('#switch-user-btn', userbar).get(0);
		var isOriginalUser = true;
		
		function restoreToOriginalUser(){
			$.post(DATAFACE_SITE_HREF, {'-action': 'switch_user', '--restore': 1}, function(response){
				try {
					if ( typeof(response) == 'string' ){
						eval('response='+response+';');
						
					}
					if ( response.code == 200 ){
						$(usernameSpan).html(response.username);
						window.location.reload();
					} else {
						throw response.msg;
					}
				} catch (e){
					alert(e);
				}
			});
		}
		
		
		function switchUser(username){
			$.post(DATAFACE_SITE_HREF, {'-action': 'switch_user', '--username': username}, function(response){
				try {
					//alert(response);
					if ( typeof(response) == 'string' ){
						eval('response='+response+';');
					}
					if ( response.code == 200 ){
						$(usernameSpan).html(response.username);
						window.location.reload();
					} else {
						throw response.msg;
					}
				
				} catch (e){
					alert(e);
				}
			});
		}
		
		
		
		
		initSwitchUser = function(username, isOriginal){
			$(usernameSpan).html(username);
			$('body').append(userbar);
			isOriginalUser = isOriginal;
			if ( !isOriginalUser ){
				$(userbar).addClass('non-original-user');
			}
		}
		
		$(switchUserBtn).click(function(){
			if ( isOriginalUser ){
				var user = prompt('Please enter the name of the user you wish to switch to.', 'Username');
				if ( user ){
					switchUser(user);
				}
				
				
			} else {
				if ( confirm('Are you sure you want to exit this user account and return to your own account?') ){
					restoreToOriginalUser();
				}
			}
			return false;
		});
		
		
		
		$.get(DATAFACE_SITE_HREF, {'-action': 'switch_user_status'}, function(response){
			try {
				
				if ( response.username ){
				
					initSwitchUser(response.username, response.isOriginal);
				}
			
			} catch (e){}
		});
		
		
		
		
	});
	
	
})();