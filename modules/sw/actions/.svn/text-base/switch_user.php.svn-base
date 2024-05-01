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
 * Switch User Action
 * @author Steve Hannah <shannah@sfu.ca>
 * Created Oct. 12, 2010
 * Copyright (c) 2010, Faculty of Communication Art and Technology, Simon Fraser University
 *	All rights reserved.
 *
 * Synopsis:
 * ==========
 *
 * A switch user action that allows administrators to log in under other users' accounts.
 * This action uses a REST api as follows:
 *
 * POST parameters:
 * -table : This should be 'users'
 * -action : This should be 'switch_user'
 * --restore : 0 or 1.  If present, then this action will restore to the original user account.
 * --username : The username to switch to.  This is not applicable if --restore parameter is present.
 *
 * Return value:
 * JSON object with following keys:
 *	code : 200 for success, 500 for failure.
 *	msg : Error or success message string.
 *  username : The effective username that the user is logged in as after this function's completion.
 *
 */
class actions_switch_user {
	function handle($params){
		if ( @$_POST['--restore'] ){
			if ( @$_SESSION['original_user'] ){
				$_SESSION['UserName'] = $_SESSION['original_user'];
				unset($_SESSION['original_user']);
				$this->response(array(
					'code'=>200,
					'msg'=>'Successfully restored user to '.$_SESSION['UserName']
				));
				exit;
			} else {
				$this->response(array(
					'code'=>500,
					'msg'=>'Failed to restore user because there was no original user to restore to.'
				));
				exit;
			}
		} else {
			$del = Dataface_Application::getInstance()->getDelegate();
			if ( !(isset($del) and method_exists($del, 'canSwitchUser') and $del->canSwitchUser()) ){
				$this->response(array(
					'code'=>500,
					'msg'=>'Failed to change to different user because this action is reserved for administrators only.'
				));
			}
			
			if ( !@$_POST['--username'] ){
				$this->response(array(
					'code'=>500,
					'msg'=>'Failed to change to different user because no username was included in the request.'
				));
			}
			
			if ( @$_SESSION['original_user'] ){
				$this->response(array(
					'code'=>500,
					'msg'=>'Please return to your original user account before changing to a different account.'
				));
			}
			
			$_SESSION['original_user'] = $_SESSION['UserName'];
			$_SESSION['UserName'] = $_POST['--username'];
			$this->response(array(
				'code'=>200,
				'msg'=>'Successfully changed user to '.$_POST['--username']
			));
		}
	}
	
	function response($params){
		$params['username'] = $_SESSION['UserName'];
		header('Content-type: text/json; charset="'.Dataface_Application::getInstance()->_conf['oe'].'"');
		echo json_encode($params);
	}
}