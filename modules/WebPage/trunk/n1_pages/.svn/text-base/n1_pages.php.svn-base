<?php

/**
 * Delegate class for the n1_pages table.
 * @created June 6, 2006
 * @author Steve Hannah <steve@weblite.ca>
 */
class tables_n1_pages {


	/**
	 * The getRoles() method returns either a single role or an array of
	 * roles that are granted for the current user. 
	 *
	 * @param Dataface_Record &$record The page record that we are granting
	 *	roles for.
	 * @return mixed Either a string role name or an array of string role names.
	 */
	function getRoles(&$record){
		if ( function_exists('isAdmin') ){
			if ( !isAdmin() ) return 'PUBLIC DEFAULT';
		}
	}

	/** 
	 * A calculated field that is essentially the equivalent
	 * of htmlValue() for the page_image field.  This is 
	 * used for substitution in the 'cooked_body' field,
	 * so that the user can just add $image to the body
	 * and have it replaced by this <img> tag.
	 * @param Dataface_Record &$record The page record.
	 * @param return string
	 */
	function field__image(&$record){
		return '<img src="'.$record->display('page_image').'" />';
	}
	
	/**
	 * A calculated field the returns the page body but with all
	 * variables replaced by their associated record value.
	 * Users are allows to add variables to their page body, such as 
	 * $image, which are replaced by their values in the record.
	 *
	 * @param Dataface_Record the page record.
	 * @param return string
	 */
	function field__cooked_body(&$record){
		if ( $record->val('page_body') ){
			return $record->parseString($record->htmlValue('page_body'));
		} else {
			return $record->val('image');
		}
	}
}