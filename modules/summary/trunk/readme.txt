Xataface Summary Module

Copyright (C) 2011  Steve Hannah <shannah@sfu.ca>

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Library General Public
License as published by the Free Software Foundation; either
version 2 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Library General Public License for more details.

You should have received a copy of the GNU Library General Public
License along with this library; if not, write to the
Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
Boston, MA  02110-1301, USA.

Synopsis:
=========

The Xataface Summary Module adds a "Summary" tab for each table of a Xataface application
which enables the user to view reports that summarize the data in that table.

Summary reports generally show information like how many rows there are, or the average
value in a column, or the sum of all values in a column.  Reports can be grouped by
any field in the table.

In addition, this module allows developers to define summary fields which perform complicated
calculations and can be made available to users.

Requirements:
=============

Xataface 2.0 or higher

Installation:
=============

1. Copy the summary directory into your modules directory. i.e.:

modules/summary

2. Add the following to the [_modules] section of your app's conf.ini
file:

modules_summary=modules/datepicker/summary.php

Usage:
======

Once installed, each table will now have a new "summary" tab (along with the "details", "list", "find" tabs).  Clicking on this tab will bring up a page to generate summary reports.  The user can select fields that they wish to summarize as well as fields on which to group the summaries.

	Defining Summary Fields:
	========================
	
	In addition to the default summary fields (sum, avg, std, etc..), you can define your own custom summary fields as well which are based on more complex calculations.  They are defined in the fields.ini file by marking a field with summary=1, and providing the "formula" directive.  E.g.
	
	[mysummaryfield]
	    summary=1
	    formula="sum(col1+co12)"
	    
	
	Permissions:
	============
	
	This module defines 3 permissions:
	
	1. summary : Permission to access the summary action.
	2. summary view : Permission to view a field summary (field-level)
	3. summary group : Permission to group by a field
	
	All three of these permissions are default added to the ADMIN and MANAGER roles.  Any users or roles that you want to have access to your summary actions will need to be granted these permissions.
    
   
More Reading:
=============

TBA


Support:
========

http://xataface.com/forum

