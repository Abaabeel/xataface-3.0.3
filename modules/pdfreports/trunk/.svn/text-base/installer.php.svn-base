<?php
/*
 * Xataface PDF Reports Module
 * Copyright (C) 2011  Steve Hannah <steve@weblite.ca>
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Library General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Library General Public License for more details.
 * 
 * You should have received a copy of the GNU Library General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin St, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 *
 */
 
/**
 * @brief Installer file that manages updates using the standard Xataface module update
 * mechanism.  It also handles the installation the first time the module is installed.
 */
class modules_pdfreports_installer {
	
	
	
	
	public function update_1(){
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_pdfreports_reports` (
			  `report_id` int(11) NOT NULL AUTO_INCREMENT,
			  `report_title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
			  `background_pdf` longblob,
			  `background_pdf_mimetype` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `report_template` longtext COLLATE utf8_unicode_ci,
			  `action_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `action_label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `action_table` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `action_category` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `action_permission` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `action_order` float DEFAULT '0',
			  `created_by` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
			  `date_created` datetime DEFAULT NULL,
			  `last_modified` datetime DEFAULT NULL,
			  `version` int(11) unsigned DEFAULT '0',
			  PRIMARY KEY (`report_id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ;";

		
		self::query($sql);
		self::clearViews();
	}
	
	
	
	
	public static function query($sql, $suppress=true){
		if ( is_array($sql) ){
			$res = null;
			foreach ($sql as $q){
				$res = self::query($q);
			}
			return $res;
		} else {
			$res = mysql_query($sql, df_db());
			if ( !$res ) {
				if ( $suppress ){
					error_log(mysql_error(df_db()));
				} else {
					throw new Exception(mysql_error(df_db()));
				}
			}
			return $res;
		}
	
	}
	
	public static function clearViews(){
	
	
		$res = mysql_query("show tables like 'dataface__view_%'", df_db());
		$views = array();
		while ( $row = mysql_fetch_row($res) ){
			$views[] = $row[0];
		}
		if ( $views ) {
			$sql = "drop view `".implode('`,`', $views)."`";
			//echo $sql;
			//echo "<br/>";
			$res = mysql_query("drop view `".implode('`,`', $views)."`", df_db());
			if ( !$res ) throw new Exception(mysql_error(df_db()));
		}
		
	}

}