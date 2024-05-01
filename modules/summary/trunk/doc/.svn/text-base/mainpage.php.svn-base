<?php
/**
@mainpage Xataface Summary Module

A module to produce reports, summaries, and totals for any table in your Xataface application.

@section synopsis Synopsis

The Xataface Summary Module adds a "Summary" tab for each table of a Xataface application
which enables the user to view reports that summarize the data in that table.

<img src="http://media.weblite.ca/files/photos/Screen%20shot%202011-06-07%20at%2011.27-blurred.png?max_width=640"/>

Summary reports generally show information like how many rows there are, or the average
value in a column, or the sum of all values in a column.  Reports can be grouped by
any field in the table.

<img src="http://media.weblite.ca/files/photos/Screen%20shot%202011-06-07%20at%2011.27.22%20AM.png?max_width=640"/>

<img src="http://media.weblite.ca/files/photos/Screen%20shot%202011-06-07%20at%2011.27.38%20AM.png?max_width=640"/>


In addition, this module allows developers to define summary fields which perform complicated
calculations and can be made available to users.

@section requirements Requirements

Xataface 1.3.1 or higher

@section license License

@code
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
@endcode


@section download Download

@subsection packages Packages

Not available.

@subsection svn SVN

<a href="http://weblite.ca/svn/dataface/modules/summary/trunk">http://weblite.ca/svn/dataface/modules/summary/trunk</a>

@section installation Installation

-# Copy the summary directory into your modules directory. i.e.: @code
modules/summary
@endcode
-# Add the following to the [_modules] section of your app's conf.ini file: @code
modules_summary=modules/datepicker/summary.php
@endcode

@see http://xataface.com/wiki/modules For more information about Xataface module development and installation.

@section usage Usage

Once installed, each table will now have a new "summary" tab (along with the "details", "list", "find" tabs).  Clicking on this tab will bring up a page to generate summary reports.  The user can select fields that they wish to summarize as well as fields on which to group the summaries.

@subsection summaryfields Defining Summary Fields

In addition to the default summary fields (sum, avg, std, etc..), you can define your own custom summary fields as well which are based on more complex calculations.  They are defined in the fields.ini file by marking a field with summary=1, and providing the "formula" directive.  E.g.
@code	
[mysummaryfield]
    summary=1
    formula="sum(col1+co12)"
@endcode

@see http://xataface.com/wiki/fields.ini_file For more information about fields.ini file directives.

	    
@subsection permissions Permissions
	
This module defines 3 permissions:

-# summary : Permission to access the summary action.
-# summary view : Permission to view a field summary (field-level)
-#  summary group : Permission to group by a field

All three of these permissions are default added to the ADMIN and MANAGER roles.  Any users or roles that you want to have access to your summary actions will need to be granted these permissions.

@see http://xataface.com/wiki/permissions.ini_file For more information about the permissions.ini file & directives.
@see http://xataface.com/documentation/tutorial/getting_started/permissions For an introduction to Xataface permissions and how to grant them to your users.

@section support Support

<a href="http://xataface.com/forum">http://xataface.com/forum</a>




*/
?>