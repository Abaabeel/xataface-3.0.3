
<?php 

include("googleTranslatePlugin.php");

class gtpTester
{
	private $gtp;

	public function __construct()
	{
		$this->gtp = new googleTranslatePlugin("en", "fr");
	
	}
	
	public function testTranslate()
	{
		//$expectedTranslations1 = array("Hello"=>"Bonjour");
	
		$this->gtp->setGoogleAPIKey('AIzaSyBasMS7PiZ85Qxpvt3gepY3QOQdQJiYJJo');
		
		$this->gtp->addSourceString("Hello");
		$this->gtp->addSourceString("My name is Kevin.");
		$this->gtp->addSourceString("The date is June 13, 2012.");
		$this->gtp->addSourceString("\"");
		$this->gtp->addSourceString("!@#$%^&*()<>");
		
		$startTime = microtime(true);
		$translations = $this->gtp->getTranslations();
		$endTime = microtime(true);
		print "Translation took " . (($endTime - $startTime)*1000) . " milliseconds<br>";
		if($translations["Hello"] != "Bonjour")
			return "Test case 1 failed for \"Hello\". Expected \"Bonjour\" but received \"" .$translations["Hello"] . "\"";
			
		if($translations["\""] != "\"")
			return "Test case 2 failed for \"\"\". Expected \"\"\" but received \"" .$translations["\""] . "\"";
		
		print "<br>Translations:<br>";
		foreach($translations as $s=>$t)
			print  $s . " => "	. $t . "<br>";
		
		return 'OK';
	}

}

$tester = new gtpTester();



print 'Testing getTranslations(): ' . $tester->testTranslate() . "<br>";


print 'Done<br>';

?>