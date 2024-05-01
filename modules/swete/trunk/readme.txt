SWeTE Translation Module for Xataface
Copyright (c) 2010 Web Lite Translation Corp.  All Rights Reserved.

Synopsis:
----------

The SWeTE Translation Module is a module that links up a Xataface application with the 
SWeTE translation engine (http://swete.weblite.ca) so that SWeTE can be used to manage
the translations in the database.  SWeTE includes many useful translation features such
as automatic machine translation, human translation, approval workflow and more.  It allows
you to assign jobs to translate individual fields, records, or entire result sets to 
professional translators.  You can review the translations and approve them before committing
them to the database.

How it works:
-------------

Once installed, the module adds an action called "Translate Results" to the list of table actions.
This action will open a new page with all translatable text (i.e. fields that are designated by
Xataface as translated fields using the table convention) displayed, and the SWeTE flag icons
along the top.  This page is SWeTE enabled so you can activate the SWeTE translation toolbar
to translate the page or assign the page to be translated by a professional tranlsator.

You can save the translations to the database by clicking the "Save Translations" link
at the top of this page.  This will take the text that you see on the page and store
it in the Xataface application database in the appropriate tables and fields.


Installation:
--------------

1. Ensure that your Xataface application is set up for multilingual content.
(http://xataface.com/documentation/tutorial/internationalization-with-dataface-0.6/dynamic_translations)

2. Sign up for a free SWeTE account for your web application at http://swete.weblite.ca

3. Copy the "swete" directory into your xataface/modules directory so that it is located at
/xataface/modules/swete

4. Add a [_swete] section to your conf.ini file with the SWeTE site id and list of languages you 
wish to include in your applicaiton.  E.g.

[_swete]
	site_id=5555
	languages="en,zh,zt,es"
	
In this example we were including English, Chinese Simplified, Chinese Traditional, and Spanish.
You should be able to find your SWeTE site id by either logging into your SWeTE account at
http://translation.weblite.ca or by checking the "site_id" attribute for the SWeTE snippet that
was emailed to you when you signed up.

5. Enable the swete module in the [_modules] section of your conf.ini file:

[_modules]
	swete=modules/swete/swete.php
	
6. Set up permissions.  The SWeTE module adds a permission "swete_translation" to your application.
By default only users who are assigned ALL() permissions will have access to this.  You can
however give this permission to any user using standard Xataface permissions.  This would allow them
to access the translate results action.

