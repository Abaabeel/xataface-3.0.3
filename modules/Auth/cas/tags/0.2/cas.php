<?php
/*-------------------------------------------------------------------------------
 * Dataface Web Application Framework
 * Copyright (C) 2005-2006  Steve Hannah (shannah@sfu.ca)
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *-------------------------------------------------------------------------------
 */

/**
 *<p>This module extends Dataface to allow its applications to use Yale's 
 * CAS (Central Authentication Service).  For more information about CAS
 * see http://www.ja-sig.org/products/cas/ </p>
 * 
 * <p>This module includes the ESUP PHP CAS module as part of the distribution,
 *    (http://esup-phpcas.sourceforge.net/) which carries with it an LGPL.</p>
 *
 * <h2>Installation</h2>
 * <ol>
 * <li><p>Download the CAS module and extract the contents of the tarball into
 *     your dataface/modules directory.  You should have a directory path
 *	   somewhat like the following:</p>
 *     <p>%DATAFACE_PATH%/modules/Auth/cas/... </p>
 * </li>
 * <li><p>Add the following section to your application's conf.ini file.</p>
 *  <code>
 *    [_auth]
 *    auth_type = cas
 *    url = "https://%url.to.cas.com%/%path.to.cas%"
 *    users_table = "%name_of_your_users_table%"
 *    username_column = "%username_col%"
 *    password_column = ""
 *  </code>
 *  <p>If you are already using authentication in your application, then you will
 *    have only added 2 new lines:</p>
 *    <dl>
 *      <dt>auth_type</dt><dd>Set this to 'cas' to indicate that you want to use the 'cas' module.</dd>
 *      <dt>url</dt><dd>The URL to your CAS service.  Do not include the trailing 'login' in the url.. just the url to the service. </dd>
 *    </dl>
 *   <p>Please see the Getting Started with Dataface tutorial's section on permissions
 *      for more information about the '_auth' section of the conf.ini  file. 
 *      (http://fas.sfu.ca/dataface/documentation/tutorial/getting_started/permissions)
 *   </p>
 * </li>
 *
 * @author Steve Hannah (shannah@sfu.ca)
 * @created September 30, 2006
 * @version 0.1
 */     
class dataface_modules_cas {

	function _initCAS(){
		$app =& Dataface_Application::getInstance();
		//$app->startSession();
		require_once dirname(__FILE__).'/lib/CAS/CAS.php';
		phpCAS::setDebug();

		// initialize phpCAS
		if ( !isset($app->_conf['_auth']['url']) ) {
			trigger_error("No url for the CAS server was specified in the _auth section of the conf.ini file.  Please enter the URL using the 'url' key for the CAS server in the _auth section of the conf.ini file in order to use CAS authentication.", E_USER_ERROR);
		}
		$url = $app->_conf['_auth']['url'];
		$url_parts = parse_url($url);
		if ( !$url_parts ) {
			trigger_error("The URL \"$url\" specified for the CAS server in the conf.ini file is invalid.  Please enter a valid url similar to http://domain.com/path/to/service.",E_USER_ERROR);
		}
		$host = $url_parts['host'];
		$port = ( @$url_parts['port'] ? $url_parts['port'] : 443);
		$uri = (@$url_parts['path'] ? $url_parts['path'] : '');
		
		phpCAS::client(CAS_VERSION_2_0,$host,$port,$uri);
	
	
	}


	/**
	 * Overrides the default Login Prompt to use the CAS login.
	 */
	function showLoginPrompt(){
		$app =& Dataface_Application::getInstance();
		$this->_initCAS();
		if ( isset( $_REQUEST['-action'] ) and $_REQUEST['-action'] == 'logout' ){

				// the user has invoked a logout request.
				session_destroy();
				
				
				$redirect = ( (isset($_REQUEST['-redirect']) and !empty($_REQUEST['-redirect']) )? $_REQUEST['-redirect'] : $_SERVER['HOST_URI'].DATAFACE_SITE_HREF);
				phpCAS::logout($redirect);
				//if ( isset($_REQUEST['-redirect']) and !empty($_REQUEST['-redirect']) ){
				//	header('Location: '.$_REQUEST['-redirect']);
				//} else {
				//	header('Location: '.DATAFACE_SITE_HREF);
				//}
				// forward to the current page again now that we are logged out
				exit;
			}
		
		if ( !@$_SESSION['UserName'] ){
			
			
			// force CAS authentication
			$res = phpCAS::forceAuthentication();
			
			
			// If we are this far, then the login worked..  We will store the 
			// userid in the session.
			$_SESSION['UserName'] = phpCAS::getUser();
			//echo "Session: ".$_SESSION['UserName'];
			//exit;
			
			if ( isset( $_REQUEST['-redirect'] ) and !empty($_REQUEST['-redirect']) ){
				$url = $_REQUEST['-redirect'];
				//header('Location: '.$_REQUEST['-redirect']);
				//exit;
			} else if ( isset($_SESSION['--redirect']) ){
				$url = $_SESSION['--redirect'];
				unset($_SESSION['--redirect']);
			} else {
				$url = $app->url('');
				//$url = $_SERVER['HOST_URI'].DATAFACE_SITE_HREF.'?';
			}
			// Now we forward to the homepage:
			header('Location: '.$url.'&--msg='.urlencode('You are now logged in'));
			exit;
		}
		
	
	
	}
	
	/**
	 * Returns the username of the user who is currently logged in.  If no user
	 * is logged in it returns null.
	 */
	function getLoggedInUsername(){
		if ( !@$_SESSION['UserName'] ) return null;
		return @$_SESSION['UserName'];	
	}
	
	/**
	 * Returns the Dataface_Record for the currently logged in user.
	 */
	function &getLoggedInUser(){
		if ( !@$_SESSION['UserName'] ) return null;
		static $record = 0;
		if ( $record === 0 ){
			$auth =& Dataface_AuthenticationTool::getInstance();
			$record = df_get_record($auth->usersTable, array($auth->usernameColumn=>'='.$this->getLoggedInUsername()));
			if ( !isset($record) or $record->val($this->usernameColumn) ){
				$record = new Dataface_Record($auth->usersTable, array($this->usernameColumn=>$this->getLoggedInUsername()));
			}
			//print_r($record->strvals());exit;
		}
		return $record;
	}
	
	function logout(){
		$this->_initCAS();
		$redirect = ( (isset($_REQUEST['-redirect']) and !empty($_REQUEST['-redirect']) )? $_REQUEST['-redirect'] : $_SERVER['HOST_URI'].DATAFACE_SITE_HREF);
		phpCAS::logout($redirect);
		exit;
	}
	

}
?>