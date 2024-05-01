Xataface Filemaker Export Module v0.1 
Created June 16, 2008 Author:
Steve Hannah <steve@weblite.ca>

Synopsis: 
---------

The Filemaker module simply adds another export mechanism for found sets
within Xataface.  It adds an action to a Xataface action to export the
current found set as a Filemaker XML file (FMPXML), which you can open
in Filemaker as a Filemaker database.

Requirements:
-------------

	PHP 5.x
	Xataface 1.0.x

Installation: 
-------------

1. Copy the FileMaker module directory into your Xataface modules
directory (i.e. path/to/xataface/modules).

2. Add the following to the [_modules] section of your application's
conf.ini file: [_modules]
modules_Filemaker=modules/Filemaker/Filemaker.php


Usage: 
------

Once installed, you should notice a little Filemaker icon showing up in
the upper right of the list view (along side the export CSV, XML, and
RSS icons).  Click on this icon to download the current found set as a
Filemaker XML file.  Note that this will only export the *found* set. 
So you can dictate which records should be exported by performing a find
or a search.

Once you have downloaded the XML file, you can drag this file onto your
filemaker icon to open it in Filemaker.  It will ask you to convert the
file to a .fp7 filemaker database file.  Just follow the prompts.

This file constitutes a valid XML data source so it can be used by
filemaker anywhere that it can make use of an XML data source.  For
example it is easy to set up refresh scripts to keep your filemaker
database synchronized with your Xataface application using these files.

Support: 
--------

Visit the Xataface support forum at http://xataface.com/forum

