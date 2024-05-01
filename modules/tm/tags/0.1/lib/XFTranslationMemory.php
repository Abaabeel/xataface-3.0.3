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
require_once(dirname(__FILE__).DIRECTORY_SEPARATOR.'TMTools.php');

/**
 * Class that handles all of the translation memory functionality.
 * @author Steve Hannah <steve@weblite.ca>
 */
class XFTranslationMemory {

	const TRANSLATION_REJECTED=1;
	//const TRANSLATION_VOTE_DOWN=2;
	const TRANSLATION_SUBMITTED=3;
	//const TRANSLATION_VOTE_UP=4;
	const TRANSLATION_APPROVED=5;

	/**
	 * @type Dataface_Record
	 *
	 * Encapsulated record from the xf_tm_translation_memories table
	 */
	private $_rec;
	

	/**
	 * @brief Creates a new TranslationMemory record that wraps a record of the 
	 * xf_tm_translation_memories table.
	 * @param Dataface_Record $rec A record from the xf_tm_translation_memories table.
	 */
	public function __construct(Dataface_Record $rec){
		$this->_rec = $rec;
	}
	
	/**
	 * @brief Gets the encapsulated xf_tm_translation_memories record.
	 * @return Dataface_Record A record from the xf_tm_translation_memories table.
	 */
	public function getRecord(){
		return $this->_rec;
	}
	
	/**
	 * @brief Gets the 2-digit language code of the source language of this
	 * translation memory.
	 */
	public function getSourceLanguage(){
		return $this->_rec->val('source_language');
	}
	
	
	/**
	 * @brief Gets the 2-digit language code of the destination language of this
	 * translation memory.
	 */
	public function getDestinationLanguage(){
		return $this->_rec->val('destination_language');
	}

	
	/**
	 * @brief Stores the default translation memories that are in the system.
	 * Translation memories can be assigned to individual records.  But if none
	 * is assigned to a record, then it uses the default translation memory.
	 */
	private static $defaultTranslationMemories = null;
	
	
	/**
	 * @brief Gets the default translation memory for the given source
	 * and destination languages.
	 *
	 * @param string $source The 2-digit language code of the source language.
	 * @param string $dest The 2-diggit language code of the destination language.
	 * @param boolean $secure True if inserting a translation memory record should
	 *		be subject to Xataface permissions.
	 * @return XFTranslationMemory The defautl translation memory with the given 
	 *		source and destination languages.
	 */
	public static function getDefaultTranslationMemory($source, $dest, $secure=false){
		$source = strtolower($source);
		$dest = strtolower($dest);
		if ( !isset(self::$defaultTranslationMemories) ){
			self::$defaultTranslationMemories = array();
		}
		
		if ( !isset(self::$defaultTranslationMemories[$source]) ){
			self::$defaultTranslationMemories[$source] = array();
		}
		
		if ( !isset(self::$defaultTranslationMemories[$source][$dest]) ){
			$rec = df_get_record('xf_tm_records',
				array(
					'record_id'=>'=*',
					'source_language'=>'='.$source,
					'destination_language'=>'='.$dest
				)
			);
			
			if ( $rec ){
			
				self::$defaultTranslationMemories[$source][$dest] = self::loadTranslationMemoryById($rec->val('translation_memory_id'));
				
			}
		}
		
		if ( !isset(self::$defaultTranslationMemories[$source][$dest]) ){
			$tm = self::createTranslationMemory('Default '.$source.'=>'.$dest, $source, $dest, $secure);
			$tm->assignTo('*');
			self::$defaultTranslationMemories[$source][$dest] = $tm;
		}
		return self::$defaultTranslationMemories[$source][$dest];
	}
	
	/**
	 * @brief Creates a translation memory and saves it to the database.
	 *
	 * 
	 * @param string $name The name of the translation memory.
	 * @param string $source The 2-digit language code of the source language for this 
	 *		translation memory.
	 * @param string $dest The 2-digit language code of the destination language.
	 * @param boolean $secure True if inserting the translation memory should be 
	 *		subject to xataface permissions.
	 * @return XFTranslationMemory The translation memory object.
	 * @throws Exception If no such memory is found AND it fails to create a new one.
	 *
	 *
	 */
	private static function createTranslationMemory($name, $source, $dest, $secure=false){
		$source = strtolower($source); $dest = strtolower($dest);
		if ( !preg_match('/^[a-z0-9]{2}$/', $source) ){
			throw new Exception("Invalid source language code inserting a translation memory: $source");
		}
		if ( !preg_match('/^[a-z0-9]{2}$/', $dest) ){
			throw new Exception("Invalid destination language code inserting a translation memory: $dest");
		}
		
		$rec = new Dataface_Record('xf_tm_translation_memories',array());
		$rec->setValues(array(
			'translation_memory_name'=>$name,
			'source_language'=>$source,
			'destination_language'=>$dest
		));
		$res = $rec->save($secure);
		if ( PEAR::isError($res) ){
			throw new Exception("Failed to create translation memory ".$res->getMessage(), $res->getCode());
		}
		
		$tm = new XFTranslationMemory($rec);
		
		return $tm;	
	}
	
	
	
	/**
	 * @brief Assigns the current translation memory to the record with the specified id.
	 * 
	 * @param string $recid The ID of the record to assign this translation memory to.  '*' for default.
	 * @param boolean $secure True if inserting this join record should be subject to xatafae 
	 * 	permissions.
	 * @return void
	 * @throws Exception If it fails to save.
	 */
	public function assignTo($recid, $secure = false){
		$rec = new Dataface_Record('xf_tm_records', array());
		$rec->setValues(array(
			'record_id'=>$recid,
			'translation_memory_id'=>$this->_rec->val('translation_memory_id')
		));
		$res = $rec->save($secure);
		if ( PEAR::isError($res) ){
			throw new Exception("Failed to assign the translation memory to the record with id ".$recid);
			
		}
		
	}

	/**
	 * @brief Loads a translation memory by its translation_memory_id
	 * @param int $id The translation_memory_id of the memory to load.
	 * @return XFTranslationMemory
	 */
	public static function loadTranslationMemoryById($id){
		$tmrec  = df_get_record('xf_tm_translation_memories', array('translation_memory_id'=>'='.$id));
		if ( !$tmrec ) return null;
		return new XFTranslationMemory($tmrec);
	}


	/**
	 * @brief Loads the translation memory for a given record.
	 *
	 * @param Dataface_Record $record The record for which the translation memory is used.
	 * @param string $source The 2-digit language code of the source language.
	 * @param string $dest The 2-digit language code of the destination language.
	 * @return XFTranslationMemory or null if it cannot be found.
	 */
	public static function loadTranslationMemoryFor(Dataface_Record $record, $source, $dest){
		$rec = df_get_record('xf_tm_records', 
			array(
				'record_id'=>'='.$record->getId(),
				'source_language'=>'='.$source,
				'destination_language'=>'='.$dest
			)
		);
		if ( !$rec ){
			return self::getDefaultTranslationMemory($source, $dest);
		}
		
		if ( !$rec->val('translation_memory_id') ){
			return null;
		}
		
		return self::loadTranslationMemoryById($rec->val('translation_memory_id'));
	}
	
	/**
	 * @brief Adds a translation to the current translation memory.  If the translation
	 *  already exists in the system then that same translation will be linked to the
	 *  translation memory.  Otherwise the translation will be created and linked.
	 * @param string $string The source string.
	 * @param string $translation The translated string.
	 * @param string $username The username of the user who is adding the string.  If omitted
	 *		it will use the currently logged-in user.
	 * @param boolean $secure True if adding this translation should be subject to 
	 *		xataface permissions.
	 * @return Dataface_Record The translation record from the xf_tm_translations table.
	 *
	 */
	public function addTranslation($string, $translation, $username=null, $secure=false){
		if ( !$username ) $username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
		$strid = null;
		if ( is_int($string) ){
			$strid = $string;
		}
		
		if ( !$strid ){
			$strRec = self::findString($string, $this->getSourceLanguage());
			if ( !$strRec ){
				$strRec = self::addString($string, $this->getSourceLanguage(), $secure);
				
			}
			if ( !$strRec ){
				throw new Exception("Failed to add string $string");
			}
			$strid = intval($strRec->val('string_id'));
			
		}
		
		
		$trec = $this->findTranslation($strid, $translation);
		if ( !$trec ){
			
			$normalized = TMTools::normalize($translation);
			$hash = md5($normalized);
			$trec = new Dataface_Record('xf_tm_translations', array());
			$trec->setValues(array(
				'string_id'=>$strid,
				'translation_value'=>$translation,
				'normalized_translation_value'=> $normalized,
				'language'=> $this->getDestinationLanguage(),
				'translation_hash'=>$hash,
				'created_by' => $username
			));
			$res = $trec->save($secure);
			if ( PEAR::isError($res) ){
				throw new Exception('Failed to add translation "$translation": '.$res->getMessage(), $res->getCode());
			}
		}
		
		// Now add this translation to the translation memory
		$res = mysql_query("insert ignore into xf_tm_translation_memory_translations 
			(translation_memory_id,translation_id)
			values
			('".addslashes($this->_rec->val('translation_memory_id'))."',
			 '".addslashes($trec->val('translation_id'))."'
			 )", df_db());
		if ( !$res ) throw new Exception(mysql_error(df_db()));
		
		
		return $trec;
			
		
		
		
	}
	
	/**
	 * @brief Checks if the current translation memory contains the specified 
	 * 	translation.
	 * @param string $string The source string
	 * @param string $translation The translated string.
	 * @return boolean True if it contains the translation.
	 */
	public function containsTranslation($string, $translation){
		$tr = $this->findTranslation($string, $translation);
		if ( !$tr ) return false;
		$tm = df_get_record('xf_tm_translation_memory_translations', 
			array(
				'translation_memory_id'=>'='.$this->_rec->val('translation_memory_id'),
				'translation_id'=>'='.$tr->val('translation_id')
			)
		);
		if ( !$tm ) return false;
		else return true;
	}
	
	
	/**
	 * @brief Finds a record encapsulating the given string.
	 * @param string $string The string that we want to find.
	 * @return Dataface_Record The record for the string from the xf_tm_strings table.
	 */
	public static function findString($string, $language){
		$normalized = TMTools::normalize($string);
		$hash = md5($normalized);
		$strRec = df_get_record('xf_tm_strings', 
			array(
				'normalized_value'=>'='.$normalized, 
				'hash'=>'='.$hash,
				'language'=>'='.$language));
		if ( !$strRec ) return null;
		return $strRec;
	}
	
	
	/**
	 * @brief Adds the given string to the database.
	 * @param string $string The string to be added.
	 * @param string $language The 2-digit language code of the language for the string.
	 * @param boolean $secure True if adding the string should be subject
	 *		to Xataface permissions.
	 * @return Dataface_Record Record from the xf_tm_strings table.
	 */
	public static function addString($string, $language, $secure=false){
		
		$str = self::findString($string, $language);
		if ( !$str ){
			$app = Dataface_Application::getInstance();
			$strRec = new Dataface_Record('xf_tm_strings', array());
			$normalized = TMTools::normalize($string);
			$hash = md5($normalized);
			$strRec->setValues(array(
				'language'=>$language,
				'string_value'=>$string,
				'normalized_value'=>$normalized,
				'hash'=> $hash
			));
			$res = $strRec->save($secure);
			if ( PEAR::isError($res) ){
				
				throw new Exception($res->getMessage());
			}
			return $strRec;
				
		}
		return $str;
	}
	
	
	/**
	 * @brief Finds the translation record for the given translation.
	 * @param string $string The source string or the integer string id of the string.
	 * 
	 * @param string $translation The translated String
	 * @return Dataface_Record Record from the xf_tm_translations table.
	 *
	 */
	public function findTranslation($string, $translation){
		$strid = null;
		if ( is_int($string) ) $strid = $string;
		
		if ( !$strid ){
			
			$strRec = self::findString($string, $this->getSourceLanguage());
			if ( $strRec ){
				$strid = intval($strRec->val('string_id'));
			}
			
		}
		if ( !$strid ) return null;
		
		$normalizedTranslation = TMTools::normalize($translation);
		$hashTranslation = md5($normalizedTranslation);
		
		$trRec = df_get_record('xf_tm_translations', 
			array(
				'string_id'=>'='.$strid,
				'normalized_translation_value'=>'='.$normalizedTranslation,
				'translation_hash'=>'='.$hashTranslation,
				'language'=>'='.$this->getDestinationLanguage()
				
			)
		);
		
		if ( !$trRec ) return null;
		
		return $trRec;
		
		
	}
	
	/**
	 * @brief Scores a translation.  
	 *
	 * @param string $string The source string (or integer string id)
	 * @param string $translation The translation string (or integer translation id)
	 * @param int $score The score to be applied to the translation.
	 * @param string $username The username of the user who is marking it (default is currently logged in user).
	 * @param boolean $secure True if marking this translation should be subject to Xataface permissions.
	 * @return Dataface_Record record from the xf_tm_translations_score table.
	 *
	 */
	 		
	public function scoreTranslation($string, $translation, $score, $username=null, $secure=false){
		
		if ( !$username ) $username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
		$trec = $this->findTranslation($string, $translation);
		
		if ( !$trec ){
			$trec = $this->addTranslation($string, $translation, $username, $secure);
		}
		
		if ( !$trec ){
			throw new Exception("Could not find matching translation and failed to add one.");
		}
		
		$arec = new Dataface_Record('xf_tm_translations_score', array());
		$arec->setValues(array(
			'translation_id'=>$trec->val('translation_id'),
			'translation_memory_id'=>$this->_rec->val('translation_memory_id'),
			'username'=>$username,
			'score'=>$score
		));
		$res = $arec->save($secure);
		if ( PEAR::isError($res) ){
			throw new Exception("Failed to approve translation: ".$res->getMessage());
			
		}
		return $arec;
		
	}
	
	
	/**
	 * @brief Sets the status of a translation.  Should be one of <ol>
	 *	<li>@code XFTranslationMemory::TRANSLATION_REJECTED @endcode</li>
	 *	<li>@code XFTranslationMemory::TRANSLATION_SUBMITTED @endcode</li>
	 *  <li>@code XFTranslationMemory::TRANSLATION_APPROVED @endcode</li>
	 *	</ol>
	 *
	 * @param string $string The source string (or int string id).
	 * @param string $translation The translated string (or int translation id)
	 * @param string $username The username of the user who is setting this (default to current
	 *		logged in user.
	 * @param boolean $secure True if setting the status should be subject to xataface permissions.
	 * @return Dataface_Record Record from the xf_tm_translations_status table.
	 */
	public function setTranslationStatus($string, $translation, $status, $username=null, $secure=false){
		if ( !$username ) $username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
		$trec = $this->findTranslation($string, $translation);
		
		if ( !$trec ){
			$trec = $this->addTranslation($string, $translation, $username, $secure);
		}
		
		if ( !$trec ){
			throw new Exception("Could not find matching translation and failed to add one.");
		}
		
		$arec = new Dataface_Record('xf_tm_translations_status', array());
		$arec->setValues(array(
			'translation_id'=>$trec->val('translation_id'),
			'translation_memory_id'=>$this->_rec->val('translation_memory_id'),
			'username'=>$username,
			'status_id'=>$status
		));
		$res = $arec->save($secure);
		if ( PEAR::isError($res) ){
			throw new Exception("Failed to approve translation: ".$res->getMessage());
			
		}
		return $arec;
	}
	
	
	/**
	 * @brief Adds a comment to a translation.
	 * @param string $string The source string (or int string id).
	 * @param string $translation The translated string (or int translation id)
	 * @param string $username The usernmae of hte user who is adding the comment (default to logged in user).
	 * @param boolean $secure True if adding the comment should be subject to xataface permissions.
	 * @return Dataface_Record record from the xf_tm_translations_comments table.
	 */
	public function addTranslationComment($string, $translation, $comment, $username=null, $secure=false){
		if ( !$username ) $username = Dataface_AuthenticationTool::getInstance()->getLoggedInUserName();
		$trec = $this->findTranslation($string, $translation);
		
		if ( !$trec ){
			$trec = $this->addTranslation($string, $translation, $username, $secure);
		}
		
		if ( !$trec ){
			throw new Exception("Could not find matching translation and failed to add one.");
		}
		
		$arec = new Dataface_Record('xf_tm_translations_comments', array());
		$arec->setValues(array(
			'translation_id'=>$trec->val('translation_id'),
			'translation_memory_id'=>$this->_rec->val('translation_memory_id'),
			'posted_by'=>$username,
			'comments'=>$comment
		));
		$res = $arec->save($secure);
		if ( PEAR::isError($res) ){
			throw new Exception("Failed to approve translation: ".$res->getMessage());
			
		}
		return $arec;
	}
	
	/**
	 * @brief Gets translated strings corresponding to the given source strings.
	 * @param array $sources Array of source strings.
	 * @param int $minStatus The minimum status of a translation to return (5=approved, 3=submitted, 1=rejected)
	 * @param int $maxStatus The maximum status of a translation to return (5=approved, 3=submitted, 1=rejected)
	 */
	public function getTranslations(array $sources, $minStatus=3, $maxStatus=5){
		$out = array();
		$normalized = array();
		$hashed = array();
		$hashIndex = array();
		$disqualified = array();
		foreach ($sources as $k=>$src){
			$normalized[$k] = TMTools::normalize($src);
			$hashed[$k] = md5($normalized[$k]);
			$hashIndex[$hashed[$k]] = $k;
			$out[$k] = null;
		}
		
		$hashesStr = "'".implode("','", $hashed)."'";
		if ( !$hashesStr ) $hashesStr = '0';
		$hashesStr = '('.$hashesStr.')';
		
		
		$sql = "select 
			s.`hash`,
			t.translation_value,
			tts.status_id
			from 
				xf_tm_translations t
				inner join xf_tm_translations_status tts on t.translation_id=tts.translation_id and tts.translation_memory_id='".addslashes($this->_rec->val('translation_memory_id'))."'
				inner join xf_tm_strings s on t.string_id=s.string_id
			where 
				tts.translation_memory_id='".addslashes($this->_rec->val('translation_memory_id'))."'
				and s.`hash` in $hashesStr
				
			order by tts.date_created desc";
		$res  = mysql_query($sql, df_db());
		if ( !$res ) throw new Exception(mysql_error(df_db()));
		
		while ($row = mysql_fetch_assoc($res) ){
			$k = $hashIndex[$row['hash']];
			if ( !isset($k) ){
				throw new Exception("Invalid hash returned");
			}
			if ( !isset($out[$k]) ){
				if ( $row['status_id'] < $minStatus or $row['status_id'] > $maxStatus ){
					$disqualified[$k] = true;
				} else if ( !@$disqualified[$k] ){
					$out[$k] = $row['translation_value'];
				}
			}
		}
		@mysql_free_result($res);
		return $out;
		
			
			
	}
	
	
	
}