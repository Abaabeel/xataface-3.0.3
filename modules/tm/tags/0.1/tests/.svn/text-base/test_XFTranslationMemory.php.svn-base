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
import('PHPUnit.php');
import(dirname(__FILE__).'/../lib/XFTranslationMemory.php');
class modules_tm_XFTranslationMemoryTest extends PHPUnit_TestCase {

	private $mod = null;
	
	function modules_calendar_RepeatEventTest( $name = 'modules_tm_XFTranslationMemoryTest'){
		$this->PHPUnit_TestCase($name);
		
	}

	function setUp(){
		$base = 'xf_tm_';
		$tables = array(
			$base.'records',
			$base.'record_strings',
			$base.'strings',
			$base.'translations',
			$base.'translations_comments',
			$base.'translations_score',
			$base.'translations_status',
			$base.'translation_memories',
			$base.'translation_memories_managers',
			$base.'translation_memory_translations',
			$base.'translation_statuses',
			$base.'workflows',
			$base.'workflow_records',
			$base.'workflow_steps',
			$base.'workflow_step_changes',
			$base.'workflow_step_panels',
			$base.'workflow_step_panel_actions',
			$base.'workflow_step_panel_members',
			$base.'workflow_strings'
			
		
		);
		
		foreach ($tables as $table){
			self::q("delete from `".$table."`");
		}
		
	}
	
	
	
	
	
	function tearDown(){
		
		

	}
	
	
	function testTranslationMemory(){
		$mod = Dataface_ModuleTool::loadModule('modules_tm');
		
		// Create a translation memory from thin air.
		$rec = new Dataface_Record('xf_tm_translation_memories', array());
		$rec->setValues(array(
			'translation_memory_name'=>"Test",
			'source_language'=>'en',
			'destination_language'=>'es'
		));
		
		$tm = new XFTranslationMemory($rec);
		
		$this->assertEquals('en', $tm->getSourceLanguage());
		$this->assertEquals('es', $tm->getDestinationLanguage());
		$this->assertEquals($rec, $tm->getRecord());
		
		$dtm = XFTranslationMemory::getDefaultTranslationMemory('en','es');
		$this->assertTrue($dtm instanceof XFTranslationMemory);
		
		$res = self::q("select count(*) from xf_tm_translation_memories");
		list($count) = mysql_fetch_row($res);
		@mysql_free_result($res);
		$this->assertEquals(1, $count, "Should only be one translation memory: the default one we just inserted.");
		
		
		$this->assertEquals("en", $dtm->getSourceLanguage());
		$this->assertEquals("es", $dtm->getDestinationLanguage());
		
		$res = self::q("select count(*) from xf_tm_records");
		list($count) = mysql_fetch_row($res);
		@mysql_free_result($res);
		$this->assertEquals(1, $count, "Should be one row in records table: the default one we just added.");
		$row = df_get_record('xf_tm_records', array('translation_memory_id'=>'='.$dtm->getRecord()->val('translation_memory_id')));
		$this->assertTrue($row instanceof Dataface_Record);
		$this->assertEquals('*', $row->val('record_id'));
		
		
		$dtm2 = XFTranslationMemory::getDefaultTranslationMemory('en','es');
		$this->assertEquals($dtm, $dtm2, 'Default translation memory should be cached so should always return the same object for the same pair.');
		
		
		$str = $dtm->addString('Test string', 'en');
		
		$this->assertTrue($str instanceof Dataface_Record);
		$this->assertEquals('xf_tm_strings', $str->table()->tablename);
		$this->assertEquals('Test string', $str->val('string_value'));
		$this->assertEquals('Test string', $str->val('normalized_value'));
		$this->assertEquals(md5('Test string'), $str->val('hash'));
		
		$str2 = df_get_record('xf_tm_strings', array('string_id'=>'='.$str->val('string_id')));
		$this->assertTrue($str2 instanceof Dataface_Record);
		$this->assertEquals('Test string', $str2->val('string_value'));
		$this->assertEquals($str->val('string_id'), $str2->val('string_id'));
		
		$str3 = XFTranslationMemory::findString('Test string', 'en');
		$this->assertTrue($str3 instanceof Dataface_Record);
		$this->assertEquals($str->val('string_id'), $str3->val('string_id'));
		
		$str4 = XFTranslationMemory::findString('Test string', 'es');
		$this->assertEquals(null, $str4, "String exists in english but not spanish so should return null.");
		
		
		$tr = $dtm->findTranslation('Test string', 'String teste');
		$this->assertEquals(null, $tr);
		
		$tr = $dtm->addTranslation('Test string', 'String teste', 'shannah');
		$this->assertTrue($tr instanceof Dataface_Record);
		$this->assertEquals('xf_tm_translations', $tr->table()->tablename);
		$this->assertEquals($str->val('string_id'), $tr->val('string_id'));
		$this->assertEquals('String teste', $tr->val('translation_value'));
		$this->assertEquals('String teste', $tr->val('normalized_translation_value'));
		$this->assertEquals(md5('String teste'), $tr->val('translation_hash'));
		
		
		
		// Now make sure we can't add the same string twice
		$str5 = XFTranslationMemory::addString('Test string', 'en');
		$this->assertEquals($str->val('string_id'), $str5->val('string_id'));
		
		
		// Try adding a translation using string id only
		$tr2 = $dtm->addTranslation($str->val('string_id'), 'String teste2', 'shannah');
		$this->assertEquals($str->val('string_id'), $tr2->val('string_id'));
		$this->assertEquals('String teste2', $tr2->val('translation_value'));
		
		$trf = $dtm->findTranslation('Test string', 'String teste');
		$this->assertEquals($trf->val('translation_id'), $tr->val('translation_id'));
		
		$trf2 = $dtm->findTranslation($str->val('string_id'), 'String teste');
		$this->assertEquals($trf2->val('translation_id'), $tr->val('translation_id'));
		$this->assertEquals($trf2->val('string_id'), $str->val('string_id'));
		
		// Try adding the same translation
		//echo "About to add our troubled string";
		$tr3 = $dtm->addTranslation('Test string', 'String teste', 'shannah');
		$this->assertEquals($tr->val('translation_id'), $tr3->val('translation_id'));
		
		// Make sure strings are case sensitive
		$tr4 = $dtm->addTranslation('Test String', 'String Teste', 'shannah');
		$this->assertTrue($tr4->val('translation_id') != $tr->val('translation_id'));
		$this->assertTrue($tr4->val('string_id') != $tr->val('string_id'));
		
		
		$this->assertTrue($dtm->containsTranslation('Test String', 'String Teste'));
		$this->assertTrue($dtm->containsTranslation('Test string', 'String teste'));
		$this->assertTrue(!$dtm->containsTranslation('Test2', '2Teste'));
		$this->assertTrue(!$dtm->containsTranslation('Test String', 'String teste'));
		$this->assertTrue(!$dtm->containsTranslation('Test string', 'foo'));
		
		$sources = array('foo','bar');
		$translations = $dtm->getTranslations($sources);
		$this->assertEquals(
			array(
				0 => null,
				1 => null
			),
			$translations
		);
		
		$sources = array('Test String','Test string');
		$translations = $dtm->getTranslations($sources);
		$this->assertEquals(
			array(
				0 => null,
				1 => null
			),
			$translations
		);
		
		$dtm->setTranslationStatus('Test String', 'String Teste', XFTranslationMemory::TRANSLATION_APPROVED, 'shannah');
		$translations = $dtm->getTranslations($sources);
		$this->assertEquals(
			array(
				0 => 'String Teste',
				1 => null
			),
			$translations
		);
		
		$translations = $dtm->getTranslations($sources, 3,4); // Only get the submitted but not the approved
		$this->assertEquals(
			array(
				0 => null,
				1 => null
			),
			$translations
		);
		sleep(1); // Necessary so that the approval statuses get different timestamps
		$dtm->setTranslationStatus('Test String', 'String Teste', XFTranslationMemory::TRANSLATION_SUBMITTED, 'shannah');
		$translations = $dtm->getTranslations($sources, 5); // Only get the submitted but not the approved
		$this->assertEquals(
			array(
				0 => null,
				1 => null
			),
			$translations
		);
		
		
		
		
		
		
		
		
	
		
		
	}
	
	
	static function q($sql){
		$res = mysql_query($sql, df_db());
		if ( !$res ) throw new Exception(mysql_error(df_db()));
		return $res;
	}
	
		


}


// Add this test to the suite of tests to be run by the testrunner
Dataface_ModuleTool::getInstance()->loadModule('modules_testrunner')
		->addTest('modules_tm_XFTranslationMemoryTest');
