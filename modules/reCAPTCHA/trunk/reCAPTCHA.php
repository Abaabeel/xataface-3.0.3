<?php
/**
 * reCAPTCHA module
 * Created by Steve Hannah <steve@weblite.ca> April 14, 2009
 *
 * Synopsis:
 * This module adds reCAPTCHA validation to any form where the user is not logged in.
 * This prevents spam.  For more information about reCAPTCHA, visit:
 * http://recaptcha.net/
 *
 * Installation:
 * See readme.txt for installation instructions.
 */
class modules_reCAPTCHA {

	var $fieldAdded = false;
	/**
	 * Module constructor.  This is executed before each page request.  It checks to 
	 * see if a user is logged in, if not, it registers the captcha validation function
	 * with the Dataface_QuickForm_before_validate event so that it is called to validate
	 * form submissions.
	 * @return void
	 */
	function modules_reCAPTCHA(){
		if ( class_exists('Dataface_AuthenticationTool') ){
			$auth =& Dataface_AuthenticationTool::getInstance();
			$user =& $auth->getLoggedInUser();
			if ( $user ) return null;
		}
		$app =& Dataface_Application::getInstance();
		$app->registerEventListener('Dataface_QuickForm_before_validate', array(&$this, 'validateCaptcha'));
	}
	
	
	/**
	 * A block that is inserted into the "before_submit_button" slot in QuickForms.
	 * If the use is not logged in, this displays the recaptcha image just before the 
	 * submit button.
	 *
	 * @return void
	 */
	function block__before_submit_button(){
		if ( class_exists('Dataface_AuthenticationTool') ){
			$auth =& Dataface_AuthenticationTool::getInstance();
			$user =& $auth->getLoggedInUser();
			if ( $user ) return null;
		}
		if ( $this->fieldAdded ) return;
		require_once dirname(__FILE__).'/recaptcha-php/recaptchalib.php';
		$app =& Dataface_Application::getInstance();
		if ( !isset($app->_conf['reCAPTCHA']) or !isset($app->_conf['reCAPTCHA']['public_key']) ){
			trigger_error('No public key set for reCAPTCHA.  You need to add a section to your conf.ini file as follows:<br/>
[reCAPTCHA]
    public_key=xxxxxx
    private_key=xxxxxx
    ', 		E_USER_ERROR);
    	
    
		}
		$public_key = $app->_conf['reCAPTCHA']['public_key'];
		//echo $public_key; echo "here";exit;
		echo '<div>'.recaptcha_get_html($public_key).'</div>';
		$this->fieldAdded = true;
	
	
	}


	/**
	 * Validates the Captcha on the previous form.  This is an event handler for the
	 * Dataface_QuickForm_vefore_validate event.
	 *
	 * @return PEAR_Error or void 
	 */
	function validateCaptcha(){
		if ( defined('DISABLE_reCAPTCHA') ) return true;
		require_once(dirname(__FILE__).'/recaptcha-php/recaptchalib.php');
		$app =& Dataface_Application::getInstance();
		if ( !isset($app->_conf['reCAPTCHA']) or !isset($app->_conf['reCAPTCHA']['private_key']) ){
			trigger_error('No public key set for reCAPTCHA.  You need to add a section to your conf.ini file as follows:<br/>
[reCAPTCHA]
    public_key=xxxxxx
    private_key=xxxxxx
    ', 		E_USER_ERROR);
    	
    
		}
		$privatekey = $app->_conf['reCAPTCHA']['private_key'];
		$resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

		if (!$resp->is_valid) {
			return PEAR::raiseError("The reCAPTCHA wasn't entered correctly. Please try again." );
       	} 
     }
}
