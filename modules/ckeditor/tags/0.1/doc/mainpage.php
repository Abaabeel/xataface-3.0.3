<?php
/**
@mainpage Xataface CKeditor Module

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-08-12_at_9.44.22_AM.png?max_width=640"/>

@section Synopsis

This module adds an html editor widget that uses CKeditor to the set of widgets that can be used in a Xataface application.  CKeditor is the successor of the FCKeditor project, which is included standard as part of the Xataface installation.  The future of Xataface development is planned as modules so FCKeditor will continue to be used as the default editor for the @c htmlarea widget type.  The CKeditor widget can be specified for any field by setting @c widget:type=ckeditor .

@see http://ckeditor.com/

@section toc Table of Contents

-# @ref requirements
-# @ref license
-# @ref installation
-# @ref basic_usage
-# @ref configuration
-# @ref plugins
-# @ref support

@section requirements Requirements

-# Xataface 2.0 (or SVN development trunk rev 2500 or higher)

@section installation Installation

Installing the CKeditor module involves 2 steps:

-# Copying the ckeditor directory into your application's (or xataface's) @e modules directory.  I.e. the path should be <em>modules/ckeditor</em>.
-# Adding the following line to the [_modules] section of your @e conf.ini file: @code
modules_ckeditor=modules/ckeditor/ckeditor.php
@endcode

At this point you should be able to use the ckeditor widget in your application.

@section basic_usage Basic Usage

Once the module has been @ref installation "installed", you can specify that a field use the CKeditor widget by setting its @c widget:type directive to "ckeditor" in the @e fields.ini file.  E.g.

@code
[myfield]
    widget:type=ckeditor
@endcode

Now when you load up the edit form for that table, you should see a ckeditor widget for editing the @e myfield field.

@see http://docs.cksource.com/CKEditor_3.x/Users_Guide (The CKeditor Users Guide)
@see 

@see http://xataface.com/wiki/fields.ini_file

@section configuration Configuration Options

CKeditor supports a many configuration options for setting such things as where the toolbar should appear and which buttons should be present on the toolbar.  A full list of these options can be found at http://docs.cksource.com/ckeditor_api/symbols/CKEDITOR.config.html

Many of these options can be specified in the <a href="http://xataface.com/wiki/fields.ini_file">fields.ini file</a> by setting:
@code
widget:ckeditor:<configOption>=<configValue>
@endcode

e.g.

@code
widget:ckeditor:uiColor="#AADC6E"
@endcode


@section support Support

@see http://xataface.com/forum



*/
?>