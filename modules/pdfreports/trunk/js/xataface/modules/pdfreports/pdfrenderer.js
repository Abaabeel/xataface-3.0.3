/*
 * Web PDF Renderer
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
(function(){

	
	
	var $ = jQuery;
	
	
	
	
	function write(str){
		$('body').append(str);
	}
	
	
	/**
	 * Standard Java deployment code for deploying applets.
	 * This was taken from http://java.com/js/deployJava.js
	 */
	var deployJava={debug:null,firefoxJavaVersion:null,myInterval:null,preInstallJREList:null,returnPage:null,brand:null,locale:null,installType:null,EAInstallEnabled:false,EarlyAccessURL:null,getJavaURL:'http://java.sun.com/webapps/getjava/BrowserRedirect?host=java.com',appleRedirectPage:'http://www.apple.com/support/downloads/',oldMimeType:'application/npruntime-scriptable-plugin;DeploymentToolkit',mimeType:'application/java-deployment-toolkit',launchButtonPNG:'http://java.sun.com/products/jfc/tsc/articles/swing2d/webstart.png',browserName:null,browserName2:null,getJREs:function(){var list=new Array();if(deployJava.isPluginInstalled()){var plugin=deployJava.getPlugin();var VMs=plugin.jvms;for(var i=0;i<VMs.getLength();i++){list[i]=VMs.get(i).version;}}else{var browser=deployJava.getBrowser();if(browser=='MSIE'){if(deployJava.testUsingActiveX('1.7.0')){list[0]='1.7.0';}else if(deployJava.testUsingActiveX('1.6.0')){list[0]='1.6.0';}else if(deployJava.testUsingActiveX('1.5.0')){list[0]='1.5.0';}else if(deployJava.testUsingActiveX('1.4.2')){list[0]='1.4.2';}else if(deployJava.testForMSVM()){list[0]='1.1';}}else if(browser=='Netscape Family'){deployJava.getJPIVersionUsingMimeType();if(deployJava.firefoxJavaVersion!=null){list[0]=deployJava.firefoxJavaVersion;}else if(deployJava.testUsingMimeTypes('1.7')){list[0]='1.7.0';}else if(deployJava.testUsingMimeTypes('1.6')){list[0]='1.6.0';}else if(deployJava.testUsingMimeTypes('1.5')){list[0]='1.5.0';}else if(deployJava.testUsingMimeTypes('1.4.2')){list[0]='1.4.2';}else if(deployJava.browserName2=='Safari'){if(deployJava.testUsingPluginsArray('1.7.0')){list[0]='1.7.0';}else if(deployJava.testUsingPluginsArray('1.6')){list[0]='1.6.0';}else if(deployJava.testUsingPluginsArray('1.5')){list[0]='1.5.0';}else if(deployJava.testUsingPluginsArray('1.4.2')){list[0]='1.4.2';}}}}
	if(deployJava.debug){for(var i=0;i<list.length;++i){alert('We claim to have detected Java SE '+list[i]);}}
	return list;},installJRE:function(requestVersion){var ret=false;if(deployJava.isPluginInstalled()){if(deployJava.getPlugin().installJRE(requestVersion)){deployJava.refresh();if(deployJava.returnPage!=null){document.location=deployJava.returnPage;}
	return true;}else{return false;}}else{return deployJava.installLatestJRE();}},installLatestJRE:function(){if(deployJava.isPluginInstalled()){if(deployJava.getPlugin().installLatestJRE()){deployJava.refresh();if(deployJava.returnPage!=null){document.location=deployJava.returnPage;}
	return true;}else{return false;}}else{var browser=deployJava.getBrowser();var platform=navigator.platform.toLowerCase();if((deployJava.EAInstallEnabled=='true')&&(platform.indexOf('win')!=-1)&&(deployJava.EarlyAccessURL!=null)){deployJava.preInstallJREList=deployJava.getJREs();if(deployJava.returnPage!=null){deployJava.myInterval=setInterval("deployJava.poll()",3000);}
	location.href=deployJava.EarlyAccessURL;return false;}else{if(browser=='MSIE'){return deployJava.IEInstall();}else if((browser=='Netscape Family')&&(platform.indexOf('win32')!=-1)){return deployJava.FFInstall();}else{location.href=deployJava.getJavaURL+
	((deployJava.returnPage!=null)?('&returnPage='+deployJava.returnPage):'')+
	((deployJava.locale!=null)?('&locale='+deployJava.locale):'')+
	((deployJava.brand!=null)?('&brand='+deployJava.brand):'');}
	return false;}}},runApplet:function(attributes,parameters,minimumVersion){if(minimumVersion=='undefined'||minimumVersion==null){minimumVersion='1.1';}
	var regex="^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";var matchData=minimumVersion.match(regex);if(deployJava.returnPage==null){deployJava.returnPage=document.location;}
	if(matchData!=null){var browser=deployJava.getBrowser();if((browser!='?')&&('Safari'!=deployJava.browserName2)){if(deployJava.versionCheck(minimumVersion+'+')){deployJava.writeAppletTag(attributes,parameters);}else if(deployJava.installJRE(minimumVersion+'+')){deployJava.refresh();location.href=document.location;deployJava.writeAppletTag(attributes,parameters);}}else{deployJava.writeAppletTag(attributes,parameters);}}else{if(deployJava.debug){alert('Invalid minimumVersion argument to runApplet():'+
	minimumVersion);}}},writeAppletTag:function(attributes,parameters){var startApplet='<'+'applet ';var params='';var endApplet='<'+'/'+'applet'+'>';var addCodeAttribute=true;for(var attribute in attributes){startApplet+=(' '+attribute+'="'+attributes[attribute]+'"');if(attribute=='code'||attribute=='java_code'){addCodeAttribute=false;}}
	if(parameters!='undefined'&&parameters!=null){var codebaseParam=false;for(var parameter in parameters){if(parameter=='codebase_lookup'){codebaseParam=true;}
	if(parameter=='object'||parameter=='java_object'){addCodeAttribute=false;}
	params+='<param name="'+parameter+'" value="'+
	parameters[parameter]+'"/>';}
	if(!codebaseParam){params+='<param name="codebase_lookup" value="false"/>';}}
	if(addCodeAttribute){startApplet+=(' code="dummy"');}
	startApplet+='>';write(startApplet+'\n'+params+'\n'+endApplet);},versionCheck:function(versionPattern)
	{var index=0;var regex="^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?(\\*|\\+)?$";var matchData=versionPattern.match(regex);if(matchData!=null){var familyMatch=true;var patternArray=new Array();for(var i=1;i<matchData.length;++i){if((typeof matchData[i]=='string')&&(matchData[i]!='')){patternArray[index]=matchData[i];index++;}}
	if(patternArray[patternArray.length-1]=='+'){familyMatch=false;patternArray.length--;}else{if(patternArray[patternArray.length-1]=='*'){patternArray.length--;}}
	var list=deployJava.getJREs();for(var i=0;i<list.length;++i){if(deployJava.compareVersionToPattern(list[i],patternArray,familyMatch)){return true;}}
	return false;}else{alert('Invalid versionPattern passed to versionCheck: '+
	versionPattern);return false;}},isWebStartInstalled:function(minimumVersion){var browser=deployJava.getBrowser();if((browser=='?')||('Safari'==deployJava.browserName2)){return true;}
	if(minimumVersion=='undefined'||minimumVersion==null){minimumVersion='1.4.2';}
	var retval=false;var regex="^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";var matchData=minimumVersion.match(regex);if(matchData!=null){retval=deployJava.versionCheck(minimumVersion+'+');}else{if(deployJava.debug){alert('Invalid minimumVersion argument to isWebStartInstalled(): '+minimumVersion);}
	retval=deployJava.versionCheck('1.4.2+');}
	return retval;},getJPIVersionUsingMimeType:function(){for(var i=0;i<navigator.mimeTypes.length;++i){var s=navigator.mimeTypes[i].type;var m=s.match(/^application\/x-java-applet;jpi-version=(.*)$/);if(m!=null){deployJava.firefoxJavaVersion=m[1];if('Opera'!=deployJava.browserName2){break;}}}},launchWebStartApplication:function(jnlp){var uaString=navigator.userAgent.toLowerCase();deployJava.getJPIVersionUsingMimeType();if(deployJava.isWebStartInstalled('1.7.0')==false){if((deployJava.installJRE('1.7.0+')==false)||((deployJava.isWebStartInstalled('1.7.0')==false))){return false;}}
	var jnlpDocbase=null;if(document.documentURI){jnlpDocbase=document.documentURI;}
	if(jnlpDocbase==null){jnlpDocbase=document.URL;}
	var browser=deployJava.getBrowser();var launchTag;if(browser=='MSIE'){launchTag='<'+'object classid="clsid:8AD9C840-044E-11D1-B3E9-00805F499D93" '+'width="0" height="0">'+'<'+'PARAM name="launchjnlp" value="'+jnlp+'"'+'>'+'<'+'PARAM name="docbase" value="'+jnlpDocbase+'"'+'>'+'<'+'/'+'object'+'>';}else if(browser=='Netscape Family'){launchTag='<'+'embed type="application/x-java-applet;jpi-version='+
	deployJava.firefoxJavaVersion+'" '+'width="0" height="0" '+'launchjnlp="'+jnlp+'"'+'docbase="'+jnlpDocbase+'"'+' />';}
	if(document.body=='undefined'||document.body==null){write(launchTag);document.location=jnlpDocbase;}else{var divTag=document.createElement("div");divTag.id="div1";divTag.style.position="relative";divTag.style.left="-10000px";divTag.style.margin="0px auto";divTag.className="dynamicDiv";divTag.innerHTML=launchTag;document.body.appendChild(divTag);}},createWebStartLaunchButtonEx:function(jnlp,minimumVersion){if(deployJava.returnPage==null){deployJava.returnPage=jnlp;}
	var url='javascript:deployJava.launchWebStartApplication(\''+jnlp+'\');';write('<'+'a href="'+url+'" onMouseOver="window.status=\'\'; '+'return true;"><'+'img '+'src="'+deployJava.launchButtonPNG+'" '+'border="0" /><'+'/'+'a'+'>');},createWebStartLaunchButton:function(jnlp,minimumVersion){if(deployJava.returnPage==null){deployJava.returnPage=jnlp;}
	var url='javascript:'+'if (!deployJava.isWebStartInstalled(&quot;'+
	minimumVersion+'&quot;)) {'+'if (deployJava.installLatestJRE()) {'+'if (deployJava.launch(&quot;'+jnlp+'&quot;)) {}'+'}'+'} else {'+'if (deployJava.launch(&quot;'+jnlp+'&quot;)) {}'+'}';write('<'+'a href="'+url+'" onMouseOver="window.status=\'\'; '+'return true;"><'+'img '+'src="'+deployJava.launchButtonPNG+'" '+'border="0" /><'+'/'+'a'+'>');},launch:function(jnlp){document.location=jnlp;return true;},isPluginInstalled:function(){var plugin=deployJava.getPlugin();if(plugin&&plugin.jvms){return true;}else{return false;}},isAutoUpdateEnabled:function(){if(deployJava.isPluginInstalled()){return deployJava.getPlugin().isAutoUpdateEnabled();}
	return false;},setAutoUpdateEnabled:function(){if(deployJava.isPluginInstalled()){return deployJava.getPlugin().setAutoUpdateEnabled();}
	return false;},setInstallerType:function(type){deployJava.installType=type;if(deployJava.isPluginInstalled()){return deployJava.getPlugin().setInstallerType(type);}
	return false;},setAdditionalPackages:function(packageList){if(deployJava.isPluginInstalled()){return deployJava.getPlugin().setAdditionalPackages(packageList);}
	return false;},setEarlyAccess:function(enabled){deployJava.EAInstallEnabled=enabled;},isPlugin2:function(){if(deployJava.isPluginInstalled()){if(deployJava.versionCheck('1.6.0_10+')){try{return deployJava.getPlugin().isPlugin2();}catch(err){}}}
	return false;},allowPlugin:function(){deployJava.getBrowser();var ret=('Safari'!=deployJava.browserName2&&'Opera'!=deployJava.browserName2);return ret;},getPlugin:function(){deployJava.refresh();var ret=null;if(deployJava.allowPlugin()){ret=document.getElementById('deployJavaPlugin');}
	return ret;},compareVersionToPattern:function(version,patternArray,familyMatch){var regex="^(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)(?:_(\\d+))?)?)?$";var matchData=version.match(regex);if(matchData!=null){var index=0;var result=new Array();for(var i=1;i<matchData.length;++i){if((typeof matchData[i]=='string')&&(matchData[i]!=''))
	{result[index]=matchData[i];index++;}}
	var l=Math.min(result.length,patternArray.length);if(familyMatch){for(var i=0;i<l;++i){if(result[i]!=patternArray[i])return false;}
	return true;}else{for(var i=0;i<l;++i){if(result[i]<patternArray[i]){return false;}else if(result[i]>patternArray[i]){return true;}}
	return true;}}else{return false;}},getBrowser:function(){if(deployJava.browserName==null){var browser=navigator.userAgent.toLowerCase();if(deployJava.debug){alert('userAgent -> '+browser);}
	if(browser.indexOf('msie')!=-1){deployJava.browserName='MSIE';deployJava.browserName2='MSIE';}else if(browser.indexOf('iphone')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='iPhone';}else if(browser.indexOf('firefox')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='Firefox';}else if(browser.indexOf('chrome')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='Chrome';}else if(browser.indexOf('safari')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='Safari';}else if(browser.indexOf('mozilla')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='Other';}else if(browser.indexOf('opera')!=-1){deployJava.browserName='Netscape Family';deployJava.browserName2='Opera';}else{deployJava.browserName='?';deployJava.browserName2='unknown';}
	if(deployJava.debug){alert('Detected browser name:'+deployJava.browserName+', '+deployJava.browserName2);}}
	return deployJava.browserName;},testUsingActiveX:function(version){var objectName='JavaWebStart.isInstalled.'+version+'.0';if(!ActiveXObject){if(deployJava.debug){alert('Browser claims to be IE, but no ActiveXObject object?');}
	return false;}
	try{return(new ActiveXObject(objectName)!=null);}catch(exception){return false;}},testForMSVM:function(){var clsid='{08B0E5C0-4FCB-11CF-AAA5-00401C608500}';if(typeof oClientCaps!='undefined'){var v=oClientCaps.getComponentVersion(clsid,"ComponentID");if((v=='')||(v=='5,0,5000,0')){return false;}else{return true;}}else{return false;}},testUsingMimeTypes:function(version){if(!navigator.mimeTypes){if(deployJava.debug){alert('Browser claims to be Netscape family, but no mimeTypes[] array?');}
	return false;}
	for(var i=0;i<navigator.mimeTypes.length;++i){s=navigator.mimeTypes[i].type;var m=s.match(/^application\/x-java-applet\x3Bversion=(1\.8|1\.7|1\.6|1\.5|1\.4\.2)$/);if(m!=null){if(deployJava.compareVersions(m[1],version)){return true;}}}
	return false;},testUsingPluginsArray:function(version){if((!navigator.plugins)||(!navigator.plugins.length)){return false;}
	var platform=navigator.platform.toLowerCase();for(var i=0;i<navigator.plugins.length;++i){s=navigator.plugins[i].description;if(s.search(/^Java Switchable Plug-in (Cocoa)/)!=-1){if(deployJava.compareVersions("1.5.0",version)){return true;}}else if(s.search(/^Java/)!=-1){if(platform.indexOf('win')!=-1){if(deployJava.compareVersions("1.5.0",version)||deployJava.compareVersions("1.6.0",version)){return true;}}}}
	if(deployJava.compareVersions("1.5.0",version)){return true;}
	return false;},IEInstall:function(){location.href=deployJava.getJavaURL+
	((deployJava.returnPage!=null)?('&returnPage='+deployJava.returnPage):'')+
	((deployJava.locale!=null)?('&locale='+deployJava.locale):'')+
	((deployJava.brand!=null)?('&brand='+deployJava.brand):'')+
	((deployJava.installType!=null)?('&type='+deployJava.installType):'');return false;},done:function(name,result){},FFInstall:function(){location.href=deployJava.getJavaURL+
	((deployJava.returnPage!=null)?('&returnPage='+deployJava.returnPage):'')+
	((deployJava.locale!=null)?('&locale='+deployJava.locale):'')+
	((deployJava.brand!=null)?('&brand='+deployJava.brand):'')+
	((deployJava.installType!=null)?('&type='+deployJava.installType):'');return false;},compareVersions:function(installed,required){var a=installed.split('.');var b=required.split('.');for(var i=0;i<a.length;++i){a[i]=Number(a[i]);}
	for(var i=0;i<b.length;++i){b[i]=Number(b[i]);}
	if(a.length==2){a[2]=0;}
	if(a[0]>b[0])return true;if(a[0]<b[0])return false;if(a[1]>b[1])return true;if(a[1]<b[1])return false;if(a[2]>b[2])return true;if(a[2]<b[2])return false;return true;},enableAlerts:function(){deployJava.browserName=null;deployJava.debug=true;},poll:function(){deployJava.refresh();var postInstallJREList=deployJava.getJREs();if((deployJava.preInstallJREList.length==0)&&(postInstallJREList.length!=0)){clearInterval(deployJava.myInterval);if(deployJava.returnPage!=null){location.href=deployJava.returnPage;};}
	if((deployJava.preInstallJREList.length!=0)&&(postInstallJREList.length!=0)&&(deployJava.preInstallJREList[0]!=postInstallJREList[0])){clearInterval(deployJava.myInterval);if(deployJava.returnPage!=null){location.href=deployJava.returnPage;}}},writePluginTag:function(){var browser=deployJava.getBrowser();if(browser=='MSIE'){write('<'+'object classid="clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA" '+'id="deployJavaPlugin" width="0" height="0">'+'<'+'/'+'object'+'>');}else if(browser=='Netscape Family'&&deployJava.allowPlugin()){deployJava.writeEmbedTag();}},refresh:function(){navigator.plugins.refresh(false);var browser=deployJava.getBrowser();if(browser=='Netscape Family'&&deployJava.allowPlugin()){var plugin=document.getElementById('deployJavaPlugin');if(plugin==null){deployJava.writeEmbedTag();}}},writeEmbedTag:function(){var written=false;if(navigator.mimeTypes!=null){for(var i=0;i<navigator.mimeTypes.length;i++){if(navigator.mimeTypes[i].type==deployJava.mimeType){if(navigator.mimeTypes[i].enabledPlugin){write('<'+'embed id="deployJavaPlugin" type="'+
	deployJava.mimeType+'" hidden="true" />');written=true;}}}
	if(!written)for(var i=0;i<navigator.mimeTypes.length;i++){if(navigator.mimeTypes[i].type==deployJava.oldMimeType){if(navigator.mimeTypes[i].enabledPlugin){write('<'+'embed id="deployJavaPlugin" type="'+
	deployJava.oldMimeType+'" hidden="true" />');}}}}},do_initialize:function(){deployJava.writePluginTag();if(deployJava.locale==null){var loc=null;if(loc==null)try{loc=navigator.userLanguage;}catch(err){}
	if(loc==null)try{loc=navigator.systemLanguage;}catch(err){}
	if(loc==null)try{loc=navigator.language;}catch(err){}
	if(loc!=null){loc.replace("-","_")
	deployJava.locale=loc;}}}};deployJava.do_initialize();
	
	
	window.deployJava = deployJava;

})();



(function(){

	var $ = jQuery;
	/*
	 * The actual PDF Renderer Core code.
	 */
	if ( typeof(window.xataface) == 'undefined')  window.xataface = {};
	if ( typeof(window.xataface.modules) == 'undefined')  window.xataface.modules = {};
	if ( typeof(window.xataface.modules.pdfreports) == 'undefined')  window.xataface.modules.pdfreports = {};
	
	
	
	var pdfreports = window.xataface.modules.pdfreports;
	pdfreports.PDFPage = PDFPage;
	pdfreports.PDFDocument = PDFDocument;
	
	
	/**
	 * A class to encapsulate a PDF document.  This mostly just allows us to 
	 * see how many pages are in the document.  It does include a convenience
	 * method for creating pages in the document.
	 *
	 * @param {String} url The URL to the PDF document.  Relative or absolute.  This
	 *		needs to be on the same host as the codebase.
	 *
	 * @param {int} width (optional) The width in pixels of the document as it should be displayed.
	 * @param {HTMLElement} el (optional) The img element in which the document is to be displayed.
	 * 
	 */
	function PDFDocument(o){
		this.url = null;
		this.numPages = null;
		this.el = $('<img/>').get(0);
		this.width = 72*8.5;
		this.baseWidth = null;
		this.baseHeight = null;
		
		$.extend(this,o);
	
	}
	
	PDFDocument.prototype.load = PDFDocument_load;
	PDFDocument.prototype.newPage = PDFDocument_newPage;
	
	/**
	 * Loads the document information (e.g. how many pages are in the document).
	 *
	 * @param {Function} callback A callback function that will be called after
	 *  the data has been loaded.  This function will take the PDFDocument object
	 *	as a parameter.
	 */
	function PDFDocument_load(callback){
		var self = this;
		PDFPage.queue.push({
			request: 'numPages',
			update: function(num, width, height){
				self.numPages = num;
				self.baseWidth = width;
				self.baseHeight = height;
				if ( typeof(callback) == 'function' ) callback(self);
			},
			url: self.url
			
		});
		startDispatch();
	}
	
	
	/**
	 * Creates a new page for the same image element, and with the same url and 
	 * width as the document itself.
	 *
	 * @param {int} pageNum The page number (0-based index).
	 *
	 */
	function PDFDocument_newPage(pageNum){
		var o = {};
		o.page = pageNum;
		o.url = this.url;
		o.el = this.el;
		o.width = this.width;
		return new PDFPage(o);
		
	}
	
	
	/**
	 * Constructor for a page of a PDF that can be displayed in an <img> tag.
	 *
	 * @param {int} width The width to display the page as in pixels.
	 * @param {int} page The page number to display.
	 * @param {String} url The URL to the PDF.  Relative or Absolute, but should be 
	 *		located on same host as codebase.
	 * @param {HTMLElement} el The <img> tag to display the page in.  If none is
	 *		given, one will be created and can be accessed by the el attribute.
	 * 
	 */
	function PDFPage(o){
	
		this.width = 72.0*8.5;
		this.page = 0;
		this.url = null;
		this.el = $('<img/>').get(0);
		
		$.extend(this,o);
	}
	
	
	/**
	 * The queue for passing messages to the applet.
	 */
	PDFPage.queue = [];
	
	/**
	 * The name to be used for the applet.
	 */
	PDFPage.appletID = 'com.xataface.modules.pdfreports.PDFRenderer-applet';
	
	PDFPage.startDispatch = startDispatch;
	
	/**
	 * The codebase where the jar files are located.  This should be set 
	 * before calling any of the functions as this is needed to properly load
	 * the applet.
	 */
	PDFPage.codebase = 'pdfrenderer-codebase';
	
	
	PDFPage.prototype.render = PDFPage_render;
	PDFPage.prototype.update = PDFPage_update;
	
	/**
	 * Renders the current page.  This sends a message to the applet to ask it 
	 * to load the PDF and produce an image of the page at the current width setting.
	 * The applet will call the update() method with the base64 encoded image 
	 * data when it is complete.
	 */
	function PDFPage_render(){
	
		PDFPage.queue.push(this);
		startDispatch();
		
	}
	
	
	/**
	 * A callback method that is used by the applet when wants to write image data
	 * back to the page after it has generated it.  This takes the base64 encoded
	 * image data and sets it as the source for the <img> tag that is stored in 
	 * the el property.
	 * 
	 * @param {String} data base64 encoded PNG image data.
	 */
	function PDFPage_update(/*String*/ data){
		
		$(this.el).attr('src', 'data:image/png;base64,'+data);
		$(this).trigger('afterUpdate');
		
	}
	var count=1;
	
	/**
	 * Starts the dispatch thread of the applet that looks for new requests from 
	 * javascript.  The applet will automatically kill the thread when it reaches
	 * the end of the queue, so this should be called any time you want the applet
	 * to do anything.
	 */
	function startDispatch(){
		var applet = $('applet[name="'+PDFPage.appletID+'"]').get(0);
		if ( !applet ){
			 var attributes = {
			 	name: PDFPage.appletID,
                code:       "com.xataface.modules.pdfreports.PDFRendererApplet",
               codebase: PDFPage.codebase,
                archive:    "WebPDFRenderer.jar, commons-codec-1.5.jar, commons-logging-1.1.1.jar, icepdf-core.jar",
                width:      1,
                height:     1
            };
            var parameters = {startDispatch:"xataface.modules.pdfreports.PDFPage.startDispatch()", queue:"xataface.modules.pdfreports.PDFPage.queue"}; 
            var version = "1.5"; 
            deployJava.runApplet(attributes, parameters, version);
			
			
		} else {
		
			try {
				applet.startDispatch();
			} catch (e){
				setTimeout(function(){
					startDispatch();
				}, 1000);
			}
		}
	
	}


})();