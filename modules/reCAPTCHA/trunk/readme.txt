Xataface reCAPTCHA Module
Author: Steve Hannah
Created: April 14, 2009
Modified: April 14, 2009

Synopsis:

This module adds reCAPTCHA validation to forms that occur when users are not logged in.
For more information about reCAPTCHA see http://recaptcha.net/

Installation:

1. Download/extract the module directory into your xataface/modules directory.
2. Add the following to the [_modules] section of your conf.ini file.
	[_modules]
	    modules_reCAPTCHA=modules/reCAPTCHA/reCAPTCHA.php
	    
3. Add the following section to your conf.ini file.
	[reCAPTCHA]
	    public_key="xxxxxxx"
	    private_key="xxxxxxx"
	    
   Where public_key, private_key are your keys from your reCAPTCHA account.  
   (Note that you need to register for a free reCAPTCHA account at
   http://recaptcha.net/ in order for this to work.
   
   
Usage:

If you are NOT logged in, you will now see a reCAPTCHA validation image before
the submit button for all webforms in your Xataface application.  If you fail
to enter the captcha text correctly the form will not validate.  If you are logged in
this module has no effect.

Contact:

steve@weblite.ca
or visit the Xataface forum at 
http://xataface.com/forum