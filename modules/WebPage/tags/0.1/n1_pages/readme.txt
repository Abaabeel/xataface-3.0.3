Xataface Webpage Table/Module
Copyright 2008 Web Lite Solutions Corp., All rights reserved.

About this module
------------------

This module is a drop in table definition for use with Xataface applications to add
instant support for web pages in the application.  It is often a requirement for the
users of a web application to be able to add and edit generic web pages to the system.
This module handles this function by providing a table definition for web pages, and 
associated actions and templates to be able to view the web pageds.  It also includes
an .htaccess file that uses mod_rewrite to allow for "pretty" urls to access the pages.


License:
--------

This module is distributed under the terms of the GNU Public Licence version 2:
http://www.gnu.org/licenses/gpl-2.0.html

Installation:
-------------

1. Create the n1_pages table in your database using the following SQL statement:
CREATE TABLE `n1_pages` (
  `page_id` int(11) NOT NULL auto_increment,
  `page_path` varchar(100) NOT NULL,
  `page_title` varchar(50) NOT NULL,
  `page_body` text,
  `page_image` varchar(100) default NULL,
  `page_image_mimetype` varchar(50) default NULL,
  `date_posted` datetime default NULL,
  `date_modified` datetime default NULL,
  PRIMARY KEY  (`page_id`),
  KEY `page_path` (`page_path`)
)

2. Copy the n1_pages directory into your application's tables directory.

3. Make the page_images directory writable by the web server.  This is where
   the uploaded images will be stored.

4. (Optional) If you want to add a tab for the pages table to your application's
   table tabs, you can add an entry to the [_tables] section of your conf.ini file
   as follows:
   
   n1_pages=Web Pages
   
5. (Optional) If you want to use mod_rewrite for pretty URLs you can add the following
   to your application's .htaccess file:
   
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.php?-table=n1_pages&-action=page&-page_path=$1&%{QUERY_STRING} 


   
   This assumes that your application is accessed


Usage Instructions:
-------------------

Adding New Page:

	1. Click on the "Web Pages" tab in your application and click "Add New Record"
	2. Fill in the form.
	
	* Note:  If you leave the page body blank and provide an image, then the page body will consist of the image only.
	** Note: You can embed the image in the page body by adding '$image' to the body where you would like the image to appear.
	
Browsing the page:
	
	If you are using pretty URLs with mod_rewrite you can just enter the url:
		http://yourdomain.com/path/to/yourapp/%%page_path%%
		where %%page_path%% is the value of the page_path field for your page.
		
	If you are not using mod_rewrite you can view your page at
		index.php?-table=n1_pages&-action=page&page_path=%%page_path%%
		
		