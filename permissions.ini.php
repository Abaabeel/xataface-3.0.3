;<?php exit;
;;First we will list the permissions and their associated labels.

;; view : Allowed to view an element
view = View

;; link : Allowed to access the link to a record
link = Link

view in rss = View record as part of RSS feed

;; list : Allowed to see the list tab
list = List

calendar = calendar

;; edit : Allowed to edit information in an element
edit = Edit

;; new : Create a new record
new = New


;; select_rows : Allows to select rows in the result set to perform actions
;; to them
select_rows = Select Rows


;; post : Post a record using HTTP post
post = Post

;; Access to the Copy action
copy = Copy

;; Access to update set action
update_set = Update Set

update_selected=Update selected records

;; Ability to add a new related record to a relationship of a record.
add new related record = Add New Related Record

;; Ability to add an existing related record to a relationship of a record.
add existing related record = Add Existing Related Record

;; delete: Allowed to delete a record
delete = Delete

;; Ability to delete selected records from the database.
delete selected = Delete selected

;; Ability to add a new record to a table  // Deprecated.. see if this breaks anything!!
;;add new record = Add New Record

;; Access to delete found records (the delete found records menu option)
delete found = Delete Found

;; Access to the show all action (to show all records in a table)
show all = Show All

;; Access to remove a related record from a relationship.  This does not
;; delete the related record from the database - just from the relationship.
remove related record = Remove Related Record

;; Access to delete a related record from the database.  This permission
;; will override delete access of the actual related record to provide 
;; some elevated permissions for the owner of the parent record.
delete related record = Delete Related Record

;; View the records of a relationship
view related records = View related records

;; Optional Override the view parameter of the target records in a relationship
view related records override = View Related Records override

;; Access to RSS feed for related records
related records feed = Related Records RSS Feed

update related records = Update related records

find related records = Find Related Records

edit related records = Edit Related Records

link related records = Link to Related Records

;; Access to the "find" tab
find = Find

;; Ability to import records
import = Import

;; Ability to export records in CSV format
export_csv = Export CSV

;; Ability to export records as XML
export_xml = Export XML

;; Ability to export records as JSON
export_json = Export JSON

;; Ability to translate records
translate = translate

;; Ability to see history information
history = View history information

edit_history = Edit history information

;; Ability to navigate through the records of this table.
navigate = Navigate

;; Ability to reorder the records in a relationship
reorder_related_records = Reorder related records

ajax_save = AJAX Save
ajax_load = AJAX Load
ajax_form = AJAX Form

find_list = Search current table
find_multi_table = Perform multi-table searches

register = Register

rss = RSS

xml_view = XML View	;; This should not be confused with view xml.  This is 
					;; more of a management permission for a more complex
					;; XML action.
					
view xml = View XML ;; This permission allows a record to be viewed as XML
					;; It corresponds with the xml_feed action - but 
					;; works on individual records - rather than the entire
					;; action


manage_output_cache = "Manage Output Cache"
clear views = "Clear Views"
manage_migrate = "Manage Migrations"
manage = "Manage Site"
manage_build_index="Manage Build Search Index"
manage_sync_bindings="Synchronize field bindings"
install = "Install and update applications.  Administrator only"
expandable = "Whether the record can be expanded in the left nav menu"

clear views = "Clear Autogenerated views"

show hide columns = "Show and hide columns"

;;=============================================================================
;;
;; 	Roles :
;; 	--------
;;
;;  The following are roles.  Roles are basically just grouped permissions
;;  that allow you to easily assign a group of permissions to an action or
;;	record.
;;
;;  Guidelines for Roles:
;;  ---------------------
;;  Role names should be in all caps (to differentiate them from permissions),
;;  and cannot contain any commas or punctuation of any kind.
;;  You can "extend" another role with the "extends" keyword.  For example:
;;    [READ]
;;    view = 1
;;
;;    [EDIT]
;;    edit = 1
;;    
;;    [READ AND EDIT extends READ, EDIT]
;;
;;  In the above example, we defined a READ role and an EDIT role.  Then we 
;;  defined a "READ AND EDIT" role that extends READ and EDIT.  What this means
;;  is that the READ AND EDIT role contains all of the permissions contained
;;  in the READ permission and the EDIT permission, and allows other permissions
;;	to be added also.

[NO ACCESS]
	register=1
	

;;------------------------------------------------------------------------------
;; The READ ONLY role is allowed to view records and perform the show all 
;; and find actions.  Basically, anything that doesn't require making changes
;; is allowed with the READ ONLY permission

[READ BASIC]
;; A role that allows reading through the web but not in other structured formats
;; like CSV, XML, RSS, or JSON
	view = 1
	link = 1
	list = 1
	calendar = 1
	show all =1
	find = 1
	navigate = 1
	find_list =1
	find_multiple_table = 1
	view related records = 1
	find related records = 1
	link related records = 1
	expandable = 1
	show hide columns = 1

[READ ONLY]
	view in rss=1
	view = 1
	link = 1
	list = 1
	calendar = 1
	view xml = 1
	show all = 1
	find = 1
	navigate = 1
	ajax_load = 1
	find_list = 1
	find_multi_table = 1
	rss = 1
	export_csv = 1
	export_xml = 1
	export_json = 1
	view related records=1
	related records feed=1
	expandable=1
	find related records=1
	link related records=1
	show hide columns = 1

;;------------------------------------------------------------------------------
;; The EDIT role extends the READ ONLY role so that anyone who can edit can also
;; READ.  It is pretty far reaching, as it provides permissions to edit records,
;; and manipulate the records' relationship by adding new and existing records
;; to the relationship.

[EDIT BASIC extends READ BASIC]
	edit = 1
	add new related record = 1
	add existing related record = 1
	add new record = 1
	remove related record = 1
	reorder_related_records = 1
	import = 1
	translate = 1
	new = 1
	ajax_save = 1
	ajax_form = 1
	history = 1
	edit_history = 1
	copy = 1
	update_set = 1
	update_selected=1
	select_rows = 1
	update related records = 1
	edit related records = 1
	

[EDIT extends READ ONLY]
	edit = 1
	add new related record = 1
	add existing related record = 1
	add new record = 1
	remove related record = 1
	reorder_related_records = 1
	import = 1
	translate = 1
	new = 1
	ajax_save = 1
	ajax_form = 1
	history = 1
	edit_history = 1
	copy = 1
	update_set = 1
	update_selected=1
	select_rows = 1
	update related records = 1
	edit related records =1


;;------------------------------------------------------------------------------
;; The DELETE role extends the EDIT role but adds the ability to delete
;; records and related records also.  Notice that the EDIT permission allows
;; the removal of related records but not the deletion of the records.  This is
;; relevant with ONE TO MANY relationships in which a record can only be removed
;; if the related record is deleted.

[DELETE BASIC extends EDIT BASIC]
	delete = 1
	delete found = 1
	delete selected = 1
	
[DELETE extends EDIT]
	delete = 1
	delete found = 1
	delete selected = 1

;;------------------------------------------------------------------------------
;; The EDIT AND DELETE role is basically an alias of the DELETE role.

[EDIT AND DELETE extends EDIT, DELETE]

;;------------------------------------------------------------------------------
;; The OWNER role is encapsulates the permissions that the owner of a record 
;; should have.  It allows full access to the current record, but not necessarily
;; full access to the table.

[OWNER extends EDIT AND DELETE]
	navigate = 0
	new = 0
	delete found = 0


;;------------------------------------------------------------------------------
;; The REVIEWER role contains a subset of the EDIT role.  It basically just allows
;; editing of the record itself, but not adding or removing related records.

[REVIEWER extends READ ONLY]
	edit = 1
	translate = 1

;;------------------------------------------------------------------------------
;; The USER role allows for reading and adding new related records.  This would 
;; be useful for users to be able to add comments to the comments relationship
;; but not be able to edit the record itself.
[USER extends READ ONLY]
	add new related record = 1


;;------------------------------------------------------------------------------
;; The ADMIN role allows full acccess .. kind of like ALL
[ADMIN extends EDIT AND DELETE]
	xml_view=1

[WEB SERVICE BROWSER extends READ ONLY]
	xml_view=1

[WEB SERVICE ADMIN extends WEB SERVICE BROWSER, ADMIN]

[MANAGER extends ADMIN]
	manage=1
	manage_output_cache=1
	manage_migrate=1
	manage_build_index=1
	install = 1
	manage_sync_bindings=1
	
