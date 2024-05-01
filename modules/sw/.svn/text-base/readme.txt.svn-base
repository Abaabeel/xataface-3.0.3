Xataface Switch User Module
Copyright (c) 2011, Steve Hannah <shannah@sfu.ca>, All Rights Reserved

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

The Switch User module adds widget to allow certain administrative users to 
easily switch to a different user account.  This is very handy for testing to see what 
the application looks like to other users with different permissions.

The switching is performed by way of a small widget that always appears in the upper left
of the screen.  Clicking on this widget prompts the user for the username that they 
wish to switch to.  The widget remains in the upper left while acting under the assumed
account and it allows the user to exit and return to their normal account at any time.

Requirements:
=============

Xataface 1.4 or higher

Installation:
=============

1. Copy the datepicker directory into your modules directory. i.e.:

modules/switch_user.

2. Add the following to the [_modules] section of your app's conf.ini
file:

modules_switch_user=modules/switch_user/switch_user.php

3. Define a method in your application delegate class named "canSwitchUser" that
takes no parameters and returns a boolean.  E.g.:

/**
 * @brief Method to determine if the currently logged in user is allowed to switch users.
 * @return boolean True if the user is allowed to switch accounts.  False otherwise.
 */
function canSwitchUser(){
	if ( isAdmin() ) return true;
	else return false;
}


Usage:
======

When logged in as an authorized user (i.g. canSwitchUser() returns true), you should
see a widget in the upper left corner of the screen saying:
"Logged in as <username here>"

Click on the icon to the right of this widget to switch users.  You will be prompted
to enter the username of the account you wish to switch to.

This will refresh the page and you will instantly see and be able to use the application
as that user with the same permissions.  When complete, you just click the "Exit" icon in 
the upper left to return to your original account.

 
More Reading:
=============

TBA


Support:
========

http://xataface.com/forum

