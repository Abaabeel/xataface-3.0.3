Xataface Duration Selector Module

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

The Xataface Duration Selector module adds a "duration selector" widget that can be used in forms with a start date and an end date, but where it is more convenient to select the end date in terms of a duration (or delta from the start date).  For the end date field you can use the durationselector widget to provide the user with a select list of durations in any size increment you specify.

Features:
=========

	* Can be used on any datetime field.
	* Provides simple select list of duration times.
	* Compatible with all existing date/time widgets that you may want to use for the start date field.
	

Requirements:
=============

Xataface 1.4 or higher

Installation:
=============

1. Copy the summary directory into your modules directory. i.e.:

modules/durationselector

2. Add the following to the [_modules] section of your app's conf.ini
file:

modules_durationselector=modules/durationselector/durationselector.php

Usage:
======

To configure an end-date field to use the durationselector widget, just set its fields.ini file widget:type directive to "durationselector".  You should also set the following directives:

- widget:start :  The name of the field that stores the start date that this duration is associated with.
- widget:interval  : The interval size (in minutes) between options in the duration select list.


Examples:
=========

In the following example we have a start_time field that is just set up with defaults so it will use the calendar widget.  The end_time field is actually a mysql DATETIME field, but we are using the durationselector widget to allow users to select the end time as a duration from the start time.

[start_time]
	
[end_time]
	widget:type=durationselector
	widget:start=start_time

   
More Reading:
=============

TBA


Support:
========

http://xataface.com/forum


Credits:
========

- This module was developed by Steve Hannah (steve@weblite.ca).
- Parsing of dates in Javascript is handled by the wonderfully powerful Date.js library. (http://www.datejs.com).
- This widget makes heavy use of jQuery to help with DOM interaction.  (http://www.jquery.com).

