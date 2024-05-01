<?php
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
 
/**
 * @brief AJAX Action to get the switch user status. If the current user has permission
 * to switch users, this will return a single JSON object with two properties:
 *
 * - username:String   		// The username of the currently logged in user.
 * - isOriginal:Boolean     // True if the username is the originally logged in user
 *
 * E.g.
 * <code>
 * {
 *    username: shannah,
 *    isOriginal: false
 * }
 * </code>
 *
 * This action is primarily used by the switch_user.js library to determine what 
 * functionality should be provided for the user.
 *
 *
 * @section GET Parameters
 *
 * No parameters necessary.
 *
 * @see js/xataface/modules/switch_user/switch_user.js
 *
 */
class actions_switch_user_status {

	function handle($params){
		header('Connection: close');
		header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
		
		
		$del = Dataface_Application::getInstance()->getDelegate();
		$canSwitchUser = false;
		if ( method_exists($del, 'canSwitchUser') ){
			$canSwitchUser = $del->canSwitchUser();
		}
		if ( $canSwitchUser or @$_SESSION['original_user'] ){
			$isOriginal = false;
			if ( !@$_SESSION['original_user'] ) $isOriginal = true;
			//$user = getUser();
			$username = $_SESSION['UserName'];
			
			
			$atts = array(
				'username'=>$username,
				'isOriginal'=>$isOriginal
			);
			echo json_encode($atts);
			exit;
		} else {
			echo '{}';
			exit;
		}
	
	}
}