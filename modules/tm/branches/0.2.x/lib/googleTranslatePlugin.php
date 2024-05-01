<?php 


/*
googleTranslatePlugin class - uses the Google Translate 2.0 API to translate strings to other languages. 
This may run slowly, since it is sending the strings to a server to do the translations.
Author: Kevin Chow
Date: June 17, 2012

INTERFACE:
void setSourceLanguage(String $srcLang) - sets the language of the input strings
void setTargetLanguage(String $targLang)	- sets the desired output language
String getSourceLanguage(void)
String getTargetLanguage(void)
void setGoogleAPIKey($key) - sets the Google API Key to be used when translating the strings. A valid API Key MUST be supplied 
							 before calling getTranslations().
void addSourceString($string) - adds a string to be translated into the target language
void addSourceStrings($strings) - adds strings in an array to be translated into the target language
array(source=>target) getTranslations() - translates all of the user provided strings into the target language using the Google
										  Translate API and returns an array of source=>target strings.

*/

class googleTranslatePlugin
{
	private $strings,
			$sourceLanguage,
			$targetLanguage,
			$translatedStrings,
			$googleAPIKey;
	
	public function __construct($srcLang = NULL, $targLang = NULL, $strings = NULL, $googleAPIKey = NULL)
	{
		if($strings != NULL) $this->addSourceStrings($strings);
		$this->setTargetLanguage($targLang);
		$this->setSourceLanguage($srcLang);
		$this->setGoogleAPIKey($googleAPIKey);
		
		$this->strings = array();
		$this->translatedStrings = array();		
	}
	
	public function setSourceLanguage($srcLang) {$this->sourceLanguage = $srcLang;}
	public function setTargetLanguage($targLang){$this->targetLanguage = $targLang;}
	
	public function getSourceLanguage() {return $this->sourceLanguage;}
	public function getTargetLanguage() {return $this->targetLanguage;}
	
	//
	public function setGoogleAPIKey($key)
	{
		$this->googleAPIKey = $key;
	}
	
	//add the strings to the list of strings to be translated
	public function addSourceStrings($strings)
	{
		foreach($strings as $s)
			addSourceString($s);
	}
	
	public function addSourceString($string) 
	{
		array_push($this->strings, $string);
	}
	
	public function getTranslations()
	{
		if($this->googleAPIKey == NULL)
			throw new Exception('googleTranslatePlugin::getTranslations() - A valid Google API Key must be provided before calling this function.');
			
		if($this->sourceLanguage == NULL)
			throw new Exception('googleTranslatePlugin::getTranslations() - The source language must be specified.');
			
		if($this->targetLanguage == NULL)
			throw new Exception('googleTranslatePlugin::getTranslations() - The target language must be specified.');
		
		$jobHandles = array();	
			
		//create all of the job information
		foreach($this->strings as $s)
		{
			$url = 
				'https://www.googleapis.com/language/translate/v2?key=' . $this->googleAPIKey . 
				"&q=" . urlencode($s) . 
				"&source=" . $this->sourceLanguage . 
				"&target=" . $this->targetLanguage;
			
			$jobHandles[$s] = curl_init();
			curl_setopt($jobHandles[$s], CURLOPT_URL, $url); 
			curl_setopt($jobHandles[$s], CURLOPT_HEADER, 0);
			curl_setopt($jobHandles[$s], CURLOPT_RETURNTRANSFER, 1);
			//curl_setopt($jobHandles[$s], CURLOPT_FAILONERROR, 0);
			curl_setopt($jobHandles[$s], CURLOPT_SSL_VERIFYPEER, 0);
			//curl_setopt($jobHandles[$s], CURLOPT_SSL_VERIFYHOST, 0);	
		}
		
		$mh = curl_multi_init();
		foreach($jobHandles as $j)
			$res = curl_multi_add_handle($mh, $j);
			
		$active = null;
		//execute the handles
		do {
	    	curl_multi_exec($mh, $active);
		} while($active);
		
		foreach($jobHandles as $s=>$j)
		{
			$result = curl_multi_getcontent($j);
			$this->translatedStrings[$s] = $this->extractResult($result);
			curl_multi_remove_handle($mh, $j);
			curl_close($j);
		}
		
		curl_multi_close($mh);
		
		return $this->translatedStrings;
	}
	
	//google translate gives us back something like this:
	// { "data": { "translations": [ { "translatedText": "Bonjour" } ] } }
	//we just want the "Bonjour"
	private function extractResult($string)
	{
		$json = json_decode($string, true);
		//if($json === NULL) return NULL;
		
		return $json["data"]["translations"][0]["translatedText"];
	}
	
};
