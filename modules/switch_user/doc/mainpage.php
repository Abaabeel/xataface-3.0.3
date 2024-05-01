<?php /**
@mainpage Switch User Module

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-07-11_at_1.15.29_PM.png?max_width=640">

@section synopsis Synopsis:

The Switch User module adds widget to allow certain administrative users to 
easily switch to a different user account.  This is very handy for testing to see what 
the application looks like to other users with different permissions.

The switching is performed by way of a small widget that always appears in the upper left
of the screen.  Clicking on this widget prompts the user for the username that they 
wish to switch to.  The widget remains in the upper left while acting under the assumed
account and it allows the user to exit and return to their normal account at any time.

@section license License

@code
Xataface Switch User Module
Copyright (c) 2011, Steve Hannah <steve@weblite.ca>, All Rights Reserved

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


@section requirements Requirements

Xataface 1.4 or higher

@section download Download

@subsection packages Packages

None yet

@subsection svn SVN

<a href="http://weblite.ca/svn/dataface/modules/switch_user/trunk">http://weblite.ca/svn/dataface/modules/switch_user/trunk</a>


@section installation Installation

-# Copy the datepicker directory into your modules directory. i.e.: @code
modules/switch_user
@endcode
-# Add the following to the [_modules] section of your app's conf.ini file: @code
modules_switch_user=modules/switch_user/switch_user.php
@endcode
-# Define a method in your application delegate class named "canSwitchUser" that takes no parameters and returns a boolean.  E.g.: @code
 **
 * @brief Method to determine if the currently logged in user is allowed to switch users.
 * @return boolean True if the user is allowed to switch accounts.  False otherwise.
 *
function canSwitchUser(){
	if ( isAdmin() ) return true;
	else return false;
}
@endcode


@section usage Usage

When logged in as an authorized user (i.g. canSwitchUser() returns true), you should
see a widget in the upper left corner as follows:

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-07-11_at_1.14.52_PM.png?max_width=640">

Click on the icon to the right of this widget to switch users.  You will be prompted
to enter the username of the account you wish to switch to.

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-07-11_at_1.15.29_PM.png?max_width=640">


This will refresh the page and you will instantly see and be able to use the application as that user with the same permissions.  

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-07-11_at_1.15.55_PM.png?max_width=640">

When complete, you just click the "Exit" icon in the upper left to return to your original account.

<img src="http://media.weblite.ca/files/photos/Screen_shot_2011-07-11_at_1.16.07_PM.png?max_width=640">


 
@section more More Reading

TBA


@section support Support

<a href="http://xataface.com/forum">Xataface Forum</a>

*/
?>