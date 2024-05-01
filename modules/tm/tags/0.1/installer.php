<?php
/*
 * Xataface Translation Memory Module
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
class modules_tm_installer {
	
	
	
	
	public function update_1(){
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_records` (
		  `record_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `mtime` int(11) DEFAULT NULL,
		  `translation_memory_id` int(11) NOT NULL DEFAULT '0',
		  `last_string_extraction_time` int(11) DEFAULT NULL,
		  `locked` tinyint(1) DEFAULT NULL,
		  PRIMARY KEY (`record_id`,`translation_memory_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_record_strings` (
		  `record_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `string_id` int(11) NOT NULL,
		  PRIMARY KEY (`record_id`,`string_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_strings` (
		  `string_id` int(11) NOT NULL AUTO_INCREMENT,
		  `language` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
		  `string_value` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `normalized_value` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  `hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
		  PRIMARY KEY (`string_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translations` (
		  `translation_id` int(11) NOT NULL AUTO_INCREMENT,
		  `string_id` int(11) NOT NULL,
		  `language` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
		  `translation_value` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `normalized_translation_value` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  `created_by` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
		  `translation_hash` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
		  PRIMARY KEY (`translation_id`),
		  KEY `string_id` (`string_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translations_comments` (
		  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
		  `translation_id` int(11) NOT NULL,
		  `translation_memory_id` int(11) NOT NULL,
		  `posted_by` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  `comments` text COLLATE utf8_unicode_ci,
		  PRIMARY KEY (`comment_id`),
		  KEY `translation_id` (`translation_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translations_score` (
		  `translation_memory_id` int(11) NOT NULL,
		  `translation_id` int(11) NOT NULL,
		  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `score` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  PRIMARY KEY (`translation_memory_id`,`username`,`translation_id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translations_status` (
		  `translation_status_id` int(11) NOT NULL AUTO_INCREMENT,
		  `translation_memory_id` int(11) NOT NULL,
		  `translation_id` int(11) NOT NULL,
		  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `status_id` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  PRIMARY KEY (`translation_status_id`),
		  KEY `translation_memory_id` (`translation_memory_id`),
		  KEY `translation_id` (`translation_id`),
		  KEY `username` (`username`),
		  KEY `status_id` (`status_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translation_memories` (
		  `translation_memory_id` int(11) NOT NULL AUTO_INCREMENT,
		  `translation_memory_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
		  `source_language` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
		  `destination_language` varchar(2) COLLATE utf8_unicode_ci NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  `mtime` int(11) DEFAULT NULL,
		  PRIMARY KEY (`translation_memory_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translation_memories_managers` (
		  `translation_memory_id` int(11) NOT NULL,
		  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  PRIMARY KEY (`translation_memory_id`,`username`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translation_memory_translations` (
		  `translation_memory_id` int(11) NOT NULL,
		  `translation_id` int(11) NOT NULL,
		  PRIMARY KEY (`translation_memory_id`,`translation_id`)
		)  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_translation_statuses` (
		  `status_id` int(11) NOT NULL AUTO_INCREMENT,
		  `status_name` int(11) NOT NULL,
		  PRIMARY KEY (`status_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflows` (
		  `workflow_id` int(11) NOT NULL AUTO_INCREMENT,
		  `temp_translation_memory_id` int(11) NOT NULL,
		  `translation_memory_id` int(11) NOT NULL,
		  `created_by` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `current_step_id` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  PRIMARY KEY (`workflow_id`)
		)  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_records` (
		  `workflow_id` int(11) NOT NULL,
		  `record_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  PRIMARY KEY (`workflow_id`,`record_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_steps` (
		  `workflow_step_id` int(11) NOT NULL AUTO_INCREMENT,
		  `workflow_id` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  `step_number` int(5) NOT NULL,
		  PRIMARY KEY (`workflow_step_id`)
		)  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_step_changes` (
		  `workflow_step_id` int(11) NOT NULL,
		  `translations_log_id` int(11) NOT NULL,
		  PRIMARY KEY (`workflow_step_id`,`translations_log_id`)
		)  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_step_panels` (
		  `panel_id` int(11) NOT NULL AUTO_INCREMENT,
		  `workflow_step_id` int(11) NOT NULL,
		  `panel_type_id` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  `last_modified` datetime DEFAULT NULL,
		  PRIMARY KEY (`panel_id`)
		)  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_step_panel_actions` (
		  `action_id` int(11) NOT NULL AUTO_INCREMENT,
		  `workflow_step_id` int(11) NOT NULL,
		  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  `action_type_id` int(11) NOT NULL,
		  `date_created` datetime DEFAULT NULL,
		  PRIMARY KEY (`action_id`)
		) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_step_panel_members` (
		  `panel_id` int(11) NOT NULL,
		  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		  PRIMARY KEY (`panel_id`,`username`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		$sql[] = "CREATE TABLE IF NOT EXISTS `xf_tm_workflow_strings` (
		  `workflow_id` int(11) NOT NULL,
		  `string_id` int(11) NOT NULL,
		  PRIMARY KEY (`workflow_id`,`string_id`)
		) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
		";
		
		self::query($sql);
		self::clearViews();
	}
	
	public function update_2(){
		$sql[] = "ALTER TABLE  `xf_tm_strings` ADD UNIQUE (
			`language` ,
			`hash`
			)";
		self::query($sql);
	}
	
	
	public static function query($sql){
		if ( is_array($sql) ){
			$res = null;
			foreach ($sql as $q){
				$res = self::query($q);
			}
			return $res;
		} else {
			$res = mysql_query($sql, df_db());
			if ( !$res ) throw new Exception(mysql_error(df_db()));
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