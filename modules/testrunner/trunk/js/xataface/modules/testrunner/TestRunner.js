//require <tests/TestRunner.js>
(function(){
	
	if ( typeof(window.xataface) == 'undefined') window.xataface = {};
	if ( typeof(window.xataface.modules) == 'undefined') window.xataface.modules = {};
	if ( typeof(window.xataface.modules.testrunner) == 'undefined' ) window.xataface.modules.testrunner = {};
	
	
	var TestRunner = new window.tests.TestRunner();
	TestRunner.getTests = getTests;
	TestRunner.addTest = addTest;
	
	window.xataface.modules.testrunner.TestRunner = TestRunner;
	
	var tests = [];
	
	
	function addTest(tst){
		tests.push(tst);
	}
	
	function getTests(){
		return tests;
	}
	
})();