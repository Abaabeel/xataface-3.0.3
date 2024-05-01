<?php
/*
// just require TCPDF instead of FPDF
require_once('tcpdf.php');
require_once('fpdi.php');

class PDF extends FPDI {
    /**
     * "Remembers" the template id of the imported page
     *
    var $_tplIdx;
    
    
    
    /**
     * include a background template for every page
     *
    function Header() {
        if (is_null($this->_tplIdx)) {
            $this->setSourceFile('PDFDocument.pdf');
            $this->_tplIdx = $this->importPage(1);
        }
        $this->useTemplate($this->_tplIdx);
        
        $this->SetFont('freesans', 'B', 9);
        $this->SetTextColor(255);
        $this->SetXY(60.5, 24.8);
        $this->Cell(0, 8.6, "TCPDF and FPDI");
    }
    
    function Footer() {}
}

*/
//ini_set('error_log', dirname(__FILE__).'/pdflog');
error_log("Starting PDF conversion: ".time());
define('CACHE_PATH', 'cache');

set_time_limit(1000);
ini_set('memory_limit', '128M');
// Is magic quotes on? 
if (get_magic_quotes_gpc()) { 
	// Yes? Strip the added slashes 
	$_REQUEST = array_map('stripslashes', $_REQUEST); 
	$_GET = array_map('stripslashes', $_GET); 
	$_POST = array_map('stripslashes', $_POST); 
	$_COOKIE = array_map('stripslashes', $_COOKIE); 
}




error_reporting(E_ALL);
//ini_set('display_errors','on');
//require_once 'alpha-fpdf.php';
require_once 'modules/pdfreports/jquery-pdf/tcpdf/tcpdf.php';
require_once 'modules/pdfreports/jquery-pdf/fpdi/fpdi.php';
class jquery_pdf {
	var $data;
	var $fpdf;
	var $baseHref;
	var $pagesWide=1;
	var $template = null;
	
	
	var $colors = array(
		"aliceblue"=>
		"#f0f8ff"
		,
		
		
		"antiquewhite"=>
		"#faebd7"
		,
		
		
		"aqua"=>
		"#00ffff"
		,
		
		
		"aquamarine"=>
		"#7fffd4"
		,
		
		
		"azure"=>
		"#f0ffff"
		,
		
		
		"beige"=>
		"#f5f5dc"
		,
		
		
		"bisque"=>
		"#ffe4c4"
		,
		
		
		"black"=>
		"#000000"
		,
		
		
		"blanchedalmond"=>
		"#ffebcd"
		,
		
		
		"blue"=>
		"#0000ff"
		,
		
		
		"blueviolet"=>
		"#8a2be2"
		,
		
		
		"brown"=>
		"#a52a2a"
		,
		
		
		"burlywood"=>
		"#deb887"
		,
		
		
		"cadetblue"=>
		"#5f9ea0"
		,
		
		
		"chartreuse"=>
		"#7fff00"
		,
		
		
		"chocolate"=>
		"#d2691e"
		,
		
		
		"coral"=>
		"#ff7f50"
		,
		
		
		"cornflowerblue"=>
		"#6495ed"
		,
		
		
		"cornsilk"=>
		"#fff8dc"
		,
		
		
		"crimson"=>
		"#dc143c"
		,
		
		
		"cyan"=>
		"#00ffff"
		,
		
		
		"darkblue"=>
		"#00008b"
		,
		
		
		"darkcyan"=>
		"#008b8b"
		,
		
		
		"darkgoldenrod"=>
		"#b8860b"
		,
		
		
		"darkgray"=>
		"#a9a9a9"
		,
		
		
		"darkgreen"=>
		"#006400"
		,
		
		
		"darkkhaki"=>
		"#bdb76b"
		,
		
		
		"darkmagenta"=>
		"#8b008b"
		,
		
		
		"darkolivegreen"=>
		"#556b2f"
		,
		
		
		"darkorange"=>
		"#ff8c00"
		,
		
		
		"darkorchid"=>
		"#9932cc"
		,
		
		
		"darkred"=>
		"#8b0000"
		,
		
		
		"darksalmon"=>
		"#e9967a"
		,
		
		
		"darkseagreen"=>
		"#8fbc8f"
		,
		
		
		"darkslateblue"=>
		"#483d8b"
		,
		
		
		"darkslategray"=>
		"#2f4f4f"
		,
		
		
		"darkturquoise"=>
		"#00ced1"
		,
		
		
		"darkviolet"=>
		"#9400d3"
		,
		
		
		"deeppink"=>
		"#ff1493"
		,
		
		
		"deepskyblue"=>
		"#00bfff"
		,
		
		
		"dimgray"=>
		"#696969"
		,
		
		
		"dodgerblue"=>
		"#1e90ff"
		,
		
		
		"firebrick"=>
		"#b22222"
		,
		
		
		"floralwhite"=>
		"#fffaf0"
		,
		
		
		"forestgreen"=>
		"#228b22"
		,
		
		
		"fuchsia"=>
		"#ff00ff"
		,
		
		
		"gainsboro"=>
		"#dcdcdc"
		,
		
		
		"ghostwhite"=>
		"#f8f8ff"
		,
		
		
		"gold"=>
		"#ffd700"
		,
		
		
		"goldenrod"=>
		"#daa520"
		,
		
		
		"gray"=>
		"#808080"
		,
		
		
		"green"=>
		"#008000"
		,
		
		
		"greenyellow"=>
		"#adff2f"
		,
		
		
		"honeydew"=>
		"#f0fff0"
		,
		
		
		"hotpink"=>
		"#ff69b4"
		,
		
		
		"indianred"=>
		"#cd5c5c"
		,
		
		
		"indigo"=>
		"#4b0082"
		,
		
		
		"ivory"=>
		"#fffff0"
		,
		
		
		"khaki"=>
		"#f0e68c"
		,
		
		
		"lavender"=>
		"#e6e6fa"
		,
		
		
		"lavenderblush"=>
		"#fff0f5"
		,
		
		
		"lawngreen"=>
		"#7cfc00"
		,
		
		
		"lemonchiffon"=>
		"#fffacd"
		,
		
		
		"lightblue"=>
		"#add8e6"
		,
		
		
		"lightcoral"=>
		"#f08080"
		,
		
		
		"lightcyan"=>
		"#e0ffff"
		,
		
		
		"lightgoldenrodyellow"=>
		"#fafad2"
		,
		
		
		"lightgrey"=>
		"#d3d3d3"
		,
		
		
		"lightgreen"=>
		"#90ee90"
		,
		
		
		"lightpink"=>
		"#ffb6c1"
		,
		
		
		"lightsalmon"=>
		"#ffa07a"
		,
		
		
		"lightseagreen"=>
		"#20b2aa"
		,
		
		
		"lightskyblue"=>
		"#87cefa"
		,
		
		
		"lightslategray"=>
		"#778899"
		,
		
		
		"lightsteelblue"=>
		"#b0c4de"
		,
		
		
		"lightyellow"=>
		"#ffffe0"
		,
		
		
		"lime"=>
		"#00ff00"
		,
		
		
		"limegreen"=>
		"#32cd32"
		,
		
		
		"linen"=>
		"#faf0e6"
		,
		
		
		"magenta"=>
		"#ff00ff"
		,
		
		
		"maroon"=>
		"#800000"
		,
		
		
		"mediumaquamarine"=>
		"#66cdaa"
		,
		
		
		"mediumblue"=>
		"#0000cd"
		,
		
		
		"mediumorchid"=>
		"#ba55d3"
		,
		
		
		"mediumpurple"=>
		"#9370d8"
		,
		
		
		"mediumseagreen"=>
		"#3cb371"
		,
		
		
		"mediumslateblue"=>
		"#7b68ee"
		,
		
		
		"mediumspringgreen"=>
		"#00fa9a"
		,
		
		
		"mediumturquoise"=>
		"#48d1cc"
		,
		
		
		"mediumvioletred"=>
		"#c71585"
		,
		
		
		"midnightblue"=>
		"#191970"
		,
		
		
		"mintcream"=>
		"#f5fffa"
		,
		
		
		"mistyrose"=>
		"#ffe4e1"
		,
		
		
		"moccasin"=>
		"#ffe4b5"
		,
		
		
		"navajowhite"=>
		"#ffdead"
		,
		
		
		"navy"=>
		"#000080"
		,
		
		
		"oldlace"=>
		"#fdf5e6"
		,
		
		
		"olive"=>
		"#808000"
		,
		
		
		"olivedrab"=>
		"#6b8e23"
		,
		
		
		"orange"=>
		"#ffa500"
		,
		
		
		"orangered"=>
		"#ff4500"
		,
		
		
		"orchid"=>
		"#da70d6"
		,
		
		
		"palegoldenrod"=>
		"#eee8aa"
		,
		
		
		"palegreen"=>
		"#98fb98"
		,
		
		
		"paleturquoise"=>
		"#afeeee"
		,
		
		
		"palevioletred"=>
		"#d87093"
		,
		
		
		"papayawhip"=>
		"#ffefd5"
		,
		
		
		"peachpuff"=>
		"#ffdab9"
		,
		
		
		"peru"=>
		"#cd853f"
		,
		
		
		"pink"=>
		"#ffc0cb"
		,
		
		
		"plum"=>
		"#dda0dd"
		,
		
		
		"powderblue"=>
		"#b0e0e6"
		,
		
		
		"purple"=>
		"#800080"
		,
		
		
		"red"=>
		"#ff0000"
		,
		
		
		"rosybrown"=>
		"#bc8f8f"
		,
		
		
		"royalblue"=>
		"#4169e1"
		,
		
		
		"saddlebrown"=>
		"#8b4513"
		,
		
		
		"salmon"=>
		"#fa8072"
		,
		
		
		"sandybrown"=>
		"#f4a460"
		,
		
		
		"seagreen"=>
		"#2e8b57"
		,
		
		
		"seashell"=>
		"#fff5ee"
		,
		
		
		"sienna"=>
		"#a0522d"
		,
		
		
		"silver"=>
		"#c0c0c0"
		,
		
		
		"skyblue"=>
		"#87ceeb"
		,
		
		
		"slateblue"=>
		"#6a5acd"
		,
		
		
		"slategray"=>
		"#708090"
		,
		
		
		"snow"=>
		"#fffafa"
		,
		
		
		"springgreen"=>
		"#00ff7f"
		,
		
		
		"steelblue"=>
		"#4682b4"
		,
		
		
		"tan"=>
		"#d2b48c"
		,
		
		
		"teal"=>
		"#008080"
		,
		
		
		"thistle"=>
		"#d8bfd8"
		,
		
		
		"tomato"=>
		"#ff6347"
		,
		
		
		"turquoise"=>
		"#40e0d0"
		,
		
		
		"violet"=>
		"#ee82ee"
		,
		
		
		"wheat"=>
		"#f5deb3"
		,
		
		
		"white"=>
		"#ffffff"
		,
		
		
		"whitesmoke"=>
		"#f5f5f5"
		,
		
		
		"yellow"=>
		"#ffff00"
		,
		
		
		"yellowgreen"=>
		"#9acd32"
		);
	
	
	/**
	 * A variable to use to scale our pixel positions onto the page.
	 */
	var $scale;
	var $ptScale;
	
	function jquery_pdf($data, $baseHref, $orientation='P', $unit='pt', $format='Letter', $pagesWide=1){
		$this->data = $data;
		$this->baseHref = $baseHref;
		//$this->fpdf = new TCPDF($orientation, $unit, $format, true, 'UTF-8', false);
		if ( strpos($format, 'x') ){
			$format = array_map('floatval',explode('x', $format));
		}
		$this->fpdf = new FPDI($orientation, $unit, $format, true, 'UTF-8', false);
		$this->fpdf->SetAutoPageBreak(false);
		$this->pagesWide = $pagesWide or 1;
		
		
		//print_r($this->fpdf->GetPageSizeFromFormat($format);
		
		// Let's figure out what the conversion should be
		$pageWidth = $this->fpdf->getPageWidth();
		$pageHeight = $this->fpdf->getPageHeight();
		
		
		//echo $pageWidth.'x'.$pageHeight;exit;
		
		//echo $this->data['width'];exit;
		$this->scale = ($pageWidth*$pagesWide)/$this->data['width'];
		//echo "Scale is ".$this->scale;exit;
		
		//if ( $this->data['height'] * $this->scale > $pageHeight ){
		//	$this->scale = $pageHeight / ($this->data['height'] * $this->scale);
		//}
		
		//$this->scale = 1.0;
		
		
		
		
		
	}
	
	function fontFamily(&$atts){
		//return 'Arial';
		if ( @$atts['font-family'] ) {
			$f = $atts['font-family'];
			if ( preg_match('/Times|Lucida/', $f) ) return 'Times';
		}
		return 'Helvetica';
	}
	function fontStyle(&$atts){
		$out = '';
		if ( @$atts['font-weight'] == 'bold' ) $out .= 'B';
		if ( @$atts['font-style'] == 'italic' ) $out .= 'I';
		if ( @$atts['text-decoration'] == 'underline' ) $out .= 'U';
		return $out;
	}
	function fontSize(&$atts){
		if ( @$atts['font-size'] ) {
			if ( is_numeric($atts['font-size']) ){
				// We are dealing with font size on scale 1-7
				switch ($atts['font-size']){
					case 1: $atts['font-size'] = '9px';break;
					case 2: $atts['font-size'] = '11px';break;
					case 3: $atts['font-size'] = '12px';break;
					case 4: $atts['font-size'] = '14px';break;
					case 5: $atts['font-size'] = '18px';break;
					case 6: $atts['font-size'] = '24px';break;
					case 7: $atts['font-size'] = '36px';break;
					
				}
			}
		
			$out = floor($this->coord($atts['font-size']));
			if ( $out > 0 ) return $out*.8;
			else return 12*$this->scale*.8;
		}
		return 12*$this->scale;
	}
	
	function decodeColor($color){
		
		if ( preg_match('/^[a-zA-Z]+$/', $color) ){
			if ( isset($this->colors[strtolower($color)]) ){
				$color = $this->colors[strtolower($color)];
			} else if (strtolower($color) == 'transparent' ) {
				$color = 'rgba(0,0,0,0)';
				
			} else {
				$color = 'rgba(0,0,0,0)';
			}
		}
	
		if($color{0}=='#'){
			$color=substr($color,1);
	
			if(strlen($color)==6)
				list($r,$g,$b)=array($color[0].$color[1],
					$color[2].$color[3],
					$color[4].$color[5]);
			else if(strlen($color)==3)
				list($r,$g,$b)=array($color[0].$color[0],$color[1].$color[1],$color[2].$color[2]);
			else
				return false;
			
			$r=hexdec($r);$g=hexdec($g);$b=hexdec($b);
			
			return"rgb($r,$g,$b)";
		} else if ( preg_match('/^rgb/', $color) ){
			return $color;
		} else {
			return null;	
		
		}
	}
	
	function getAlpha(&$atts){
		if ( isset($atts['opacity']) ) return floatval($atts['opacity']);
		else if ( isset($atts['-moz-opacity']) ) return floatval($atts['-moz-opacity']);
		else if ( isset($atts['filter']) ){
			if ( preg_match('/alpha(.*opacity=(\d+)/', $atts['filter'], $matches) ){
				return floatval($matches[1])/100.0;
			}
		} else {
			return 1.0;
		}
	}
	
	
	function getR(&$node, $attname){
		if ( !$this->getA($node, $attname) ) return null;
		if ( @$node[$attname] ){
			if ( preg_match('/\((\d+) ?,/', $this->decodeColor($node[$attname]), $matches) ){
				return intval($matches[1]);
			}
		}
		return null;
	}
	
	function getG(&$node, $attname){
		if ( !$this->getA($node, $attname) ) return null;
		if ( @$node[$attname] ){
			if ( preg_match('/\((\d+) ?, ?(\d+) ?,/', $this->decodeColor($node[$attname]), $matches) ){
				return intval($matches[2]);
			}
		}
		return null;
	}
	
	function getB(&$node, $attname){
		if ( !$this->getA($node, $attname) ) return null;
		if ( @$node[$attname] ){
			if ( preg_match('/\((\d+) ?, ?(\d+) ?, ?(\d+)/',$this->decodeColor($node[$attname]), $matches) ){
				return intval($matches[3]);
			}
		}
		return null;
	}
	
	function getA(&$node, $attname){

		if ( @$node[$attname] ){

			if ( preg_match('/^rgba\((\d+) ?, ?(\d+) ?, ?(\d+) ?, ?(\d+)/',$this->decodeColor($node[$attname]), $matches) ){
				//echo $node[$attname];
				return intval($matches[4]);
			} else if (preg_match('/^rgb\(/', $this->decodeColor($node[$attname]))){
				//echo $node['type'];
				//echo $node[$attname];
				return 255;
			} else {
			
			}
		}
		return null;
	}
	
	function textR(&$node){ return $this->getR($node, 'color');}
	function textG(&$node){ return $this->getG($node, 'color');}
	function textB(&$node){ return $this->getB($node, 'color');}
	function drawR(&$node){ return $this->getR($node, 'border-color');}
	function drawG(&$node){return $this->getG($node, 'border-color');}
	function drawB(&$node){return $this->getB($node, 'border-color');}
	function drawA(&$node){return $this->getA($node, 'border-color');}
	function fillR(&$node){return $this->getR($node, 'background-color');}
	function fillG(&$node){return $this->getG($node, 'background-color');}
	function fillB(&$node){return $this->getB($node, 'background-color');}
	function fillA(&$node){return $this->getA($node, 'background-color');}
	function lineWidth(&$node){	
		if ( !@$node['border'] == 'none' or @$node['border-width'] == "" or @$node['border-width'] == 'initial' ) return 0;
		return $this->coord(@$node['border-width']);
	}
	
	function coord($val){
		if ( is_numeric($val) ) return floatval($val)*$this->scale;
		if ( preg_match('/^(\d+)pt/', $val, $matches) ){
			return floatval($matches[1]);
		} else if ( preg_match('/^(\d+)in/', $val, $matches) ){
			//echo $matches[1];
			return floatval($matches[1])*72;
		} else if ( preg_match('/^(\d+)px/', $val, $matches ) ) return floatval($matches[1])*$this->scale;
		else if ( preg_match('/^(\d+)$/', $val) )return floatval($val)*$this->scale;
		else return null;
	}
	
	function pcoord($val){
		$val = $this->coord($val);
		if ( is_numeric($val) ){
			//if ( !$this->pagesWide ) $this->pagesWide = 1;
			return $val - (floor(floatval($this->fpdf->GetPage()-1)/floatval($this->pagesWide)))*$this->fpdf->GetPageHeight();
		} else {
			return $val;
		}
	}
	
	function pycoord($val){
		return $this->pcoord($val);
	}
	
	function pxcoord($val){
		$val = $this->coord($val);
		if ( is_numeric($val) ){
			return $val - (($this->fpdf->GetPage()-1)%$this->pagesWide)*$this->fpdf->GetPageWidth();
		} else {
			return $val;
		}
	}
	
	function url($val){
		if ( preg_match('/url\(\'?"?([^"\'\)]*)"?\'?\)/', $val, $matches) ){
			$val = $matches[1];
			//echo $val;
		}
		if ( preg_match('/^https?:\/\//', $val) ) return $val;
		else {
			$parts = parse_url($this->baseHref);
			if ( $val{0} == '/' ){
				return $parts['scheme'].'://'.(@$parts['user']?($parts['user'].(@$parts['pass']?(':'.$parts['pass']):'').'@'):'').$parts['host'].$val;
			} else {
				return $parts['scheme'].'://'.(@$parts['user']?($parts['user'].(@$parts['pass']?(':'.$parts['pass']):'').'@'):'').$parts['host'].dirname($parts['path']).'/'.$val;
			}
		}
		
	}
	function BackgroundImage(&$node){
		if ( @$node['background-image'] ) {
			if ( preg_match('/^none/', $node['background-image'] ) ) return null;
			return $this->url($node['background-image']);
		}
		return null;
	}
	function Img(&$node){
		if ( @$node['src'] ) return $this->url($node['src']);
		return null;
	}
	function lineHeight(&$node){
		if ( @$node['line-height'] ){
			return $this->coord($node['line-height']);
		}
		return $this->fontSize($node)*1.2;
	}
	function align(&$node){
		if ( @$node['text-align'] ){
			switch ($node['text-align']){
				case 'left': return 'L';
				case 'center': return 'C';
				case 'right': return 'R';
				case 'justify': return 'J';
				default: return 'L';
			}
		}
		return 'L';
	}
	function fill(&$node){
		if ( $this->fillA($node) ){ 
			return true;
		}
		return false;
	}
	function border(&$node){
		$out = '';
		if ( $this->borderTop($node) ) $out .= 'T';
		if ( $this->borderLeft($node) ) $out .= 'L';
		if ( $this->borderRight($node) ) $out .= 'R';
		if ( $this->borderBottom($node) ) $out .= 'B';
		return $out;
		
	}
	
	
	
	function borderSide(&$node, $side){
		//return true;
		//echo "in borderSide $side";
		//echo $this->getA($node, 'border-'.$side.'-color');
		if ( (@$node['border-'.$side.'-style'] != 'none') and 
			  @$node['border-'.$side.'-style'] != 'initial' and
			//@$node['border-'.$side.'-style'] != "" and 
			$this->getA($node, 'border-'.$side.'-color') and 
			$this->coord(@$node['border-'.$side.'-width'])// and
			
			){
		
			return true;
		
		} else {
			return false;
		}
	}	
	
	function borderTop(&$node){return $this->borderSide($node,'top');}
	function borderLeft(&$node){return $this->borderSide($node,'left');}
	function borderRight(&$node){return $this->borderSide($node,'right');}
	function borderBottom(&$node){return $this->borderSide($node,'bottom');}
	
	function rectStyle(&$node){
		$out = '';
		if ( $this->border($node) ) $out .= 'D';
		if ( $this->fillR($node) ) $out .= 'F';
		return $out;
	}
	
	
	function fillBackgroundSize(&$node){
		if ( isset($node['background-width']) && isset($node['background-height']) ) return;
		// get image dimensions
		$file = $this->BackgroundImage($node);
		if ( !$file ) return;
		
		$imsize = @getimagesize($file);
		if ($imsize === FALSE) {
			// encode spaces on filename
			$file = str_replace(' ', '%20', $file);
			$imsize = @getimagesize($file);
			if ($imsize === FALSE) {
				throw new Exception('No image size');
			}
		}
		// get original image width and height in pixels
		list($pixw, $pixh) = $imsize;
		$w = $this->fpdf->pixelsToUnits($pixw);
		$h = $this->fpdf->pixelsToUnits($pixh);
		$node['background-width'] = $w;
		$node['background-height'] = $h;
		
	}
	
	
	function BackgroundOffset(&$node){
		if ( !@$node['background-position'] ){
			return array('top'=>0, 'left'=>0);
		}
		
		$width = floatval($this->coord($node['width'])) + $this->coord($node['padding-left']) + $this->coord($node['padding-right']);
		$height = floatval($this->coord($node['height'])) + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom']);
		
		
		if ( preg_match('/^(left|right|center) (top|bottom|center)$/i', trim(strtolower($node['background-position'])), $matches) ){
			$out = array(
				'top'=>0,
				'left'=>0
			);
			switch ($matches[1]){
				case 'right': $out['left'] = $width - floatval($node['background-width']);break;
				case 'center': $out['left'] = ($width-floatval($node['background-width']))/2; break;
				
			}
			
			switch ($matches[2]){
				case 'bottom': $out['top'] = $height - floatval($node['background-height']);break;
				case 'center': $out['top'] = ($height - floatval($node['background-height']))/2; break;
				
			}
			return $out;
		}
		
		if ( preg_match('/^([\d\.]+)% ([\d\.]+)%$/', trim(strtolower($node['background-position'])), $matches) ){
			$out = array(
				'top'=>0,
				'left'=>0
			);
			
			$out['top'] = floatval($matches[2])*floatval($height)/100.0 - (floatval($node['background-height'])*floatval($matches[2])/100);
			$out['left'] = floatval($matches[1])*floatval($width)/100.0 - (floatval($node['background-width'])*floatval($matches[1])/100);
			return $out;
		}
		
		if ( preg_match('/^([\d\.]+) ([\d\.]+)$/', trim(strtolower($node['background-position'])), $matches) ){
			$out = array(
				'top'=>floatval($matches[2]),
				'left'=>floatval($matches[1])
			);
			return $out;
		}
		
		return array(
			'top'=>0,
			'left'=>0
		);
		
		
	
	}
	
	function render(&$node){
		
		if ( $this->pcoord(@$node['top']) > $this->fpdf->getPageHeight() 
			or
			(
				$this->pcoord(@$node['top']+@$node['height']) > 0
				and
				$this->pxcoord(@$node['left']) > $this->fpdf->getPageWidth()
			)
		) {
			return true;
		}
		
		if ( @$node['width'] ){
			$attributes = $node;
			
			
			$this->fpdf->SetAlpha($this->getAlpha($node));
			//echo "Atts: ".$this->getAlpha($attributes);
			
			$this->fpdf->SetFont(
				$this->fontFamily($attributes),
				$this->fontStyle($attributes),
				$this->fontSize($attributes)
			);
			//$this->fpdf->SetDrawColor(
			//	$this->drawR($node),
			//	$this->drawG($node),
			//	$this->drawB($node)
			//);
			
			$this->fpdf->SetLineWidth($this->lineWidth($node));
			
			$this->fpdf->SetXY($this->pxcoord($node['left']), $this->pcoord($node['top']));
			
			/*
			if ( !@$node['background-image'] and @$node['background'] and preg_match('/url\([^)]+\)/', $node['background'], $matches) ){
				$node['background-image'] = $matches[0];
			}
			*/
			
			
			if ( $this->fillA($node) ){
				//$this->fpdf->SetXY(floatval($this->coord($node['left'])), floatval($this->coord($node['top'])));
				$this->fpdf->SetFillColor(
					$this->fillR($node),
					$this->fillG($node),
					$this->fillB($node)
				);
				
				$this->fpdf->Rect(
					floatval($this->pxcoord($node['left'])),
					 floatval($this->pcoord($node['top'])),
				//$this->fpdf->Cell(
					floatval($this->coord($node['width'])) + $this->coord($node['padding-left']) + $this->coord($node['padding-right']),
					floatval($this->coord($node['height'])) + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom']),
					'F'
				);
			}
			
			if ( @$node['background-image'] ){
				$img = $this->BackgroundImage($node);
				if ( $img ){
					//error_log($img);
					$this->fpdf->setImageScale(1/$this->scale);
					$this->fpdf->StartTransform();
					
					$boundsLeft = floatval($this->pxcoord($node['left']));
					$boundsTop = floatval($this->pcoord($node['top']));
					$boundsWidth = floatval($this->coord($node['width'])) + $this->coord($node['padding-left']) + $this->coord($node['padding-right']);
					$boundsHeight = floatval($this->coord($node['height'])) + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom']);
					$boundsRight = $boundsLeft+$boundsWidth;
					$boundsBottom = $boundsTop+$boundsHeight;
					$this->fpdf->Rect(
						$boundsLeft,
						 $boundsTop,
					//$this->fpdf->Cell(
						$boundsWidth,
						$boundsHeight,
						'CNZ'
					);
					try {
						$this->fillBackgroundSize($node);
						$bgoffset = $this->BackgroundOffset($node);
						
						$x = $this->pxcoord($node['left'])+$bgoffset['left'];
						$y = $this->pcoord($node['top'])+$bgoffset['top'];
						
						$repeatX = (in_array(strtolower(@$node['background-repeat']), array('repeat','repeat-x')) );
						$repeatY = (in_array(strtolower(@$node['background-repeat']), array('repeat','repeat-y')) );
						
						
						$startX = $x;
						$startY = $y;
						
						while ( $x < $boundsRight ){
							$y = $startY;
							while ( $y < $boundsBottom ){
								$this->fpdf->Image(
									$img,
									$x,
									$y
								);
								if ( !$repeatY ) break;
								if ( floatval(@$node['background-height']) <= 0 ) break;
								$y += floatval(@$node['background-height']);
							}
							if ( !$repeatX ) break;
							if ( floatval(@$node['background-width']) <= 0 ) break;
							$x += floatval(@$node['background-width']);
						}
						
						$x = $startX = $startX - floatval(@$node['background-width']);
						$y = $startY = $startY - floatval(@$node['background-height']);
						
						while ( $x + floatval(@$node['background-width']) > $boundsLeft ){
							if ( !$repeatX ) break;
							if ( floatval(@$node['background-width']) <= 0 ) break;
							$y = $startY;
							while ( $y + floatval(@$node['background-height']) > $boundsTop ){
								$this->fpdf->Image(
									$img,
									$x,
									$y
								);
								
								if ( !$repeatY ) break;
								if ( floatval(@$node['background-height']) <= 0 ) break;
								$y -= floatval(@$node['background-height']);
								
							}
							
							$x -= floatval(@$node['background-width']);
						}
						
						
						
						
						
					} catch (Exception $ex){
						error_log($ex->getMessage());
					}
					$this->fpdf->StopTransform();
				}
			}
			$this->fpdf->SetXY($this->pxcoord($node['left']), $this->pcoord($node['top']));
			
			
			if ( @$node['src'] and $node['type'] == 'IMG' ){
				try {
					$this->fpdf->Image(
						$this->Img($node),
						$this->pxcoord($node['left']) + $this->coord($node['padding-left']),
						$this->pcoord($node['top']) + $this->coord($node['padding-top']),
						$this->coord($node['width']),
						$this->coord($node['height'])
					);
				} catch (Exception $ex){
					error_log($ex->getMessage());
				}
			}
			
			//$this->fpdf->setDrawColor(0,0,0);
			if ( @$node['text'] ){
				//print_r($node);
				//echo $this->coord($node['width']);
				//echo $this->lineHeight($node);
				//echo $node['text'];exit;
				$this->fpdf->SetTextColor(
					$this->textR($attributes),
					$this->textG($attributes),
					$this->textB($attributes)
				);
				
				$fontSize = $this->fontSize($attributes);
				
				//print_r($attributes);
				//echo "Setting font size to ".$this->fontSize($attributes)." for text '".$node['text'];
				//echo "Writing text at (".$this->coord($node['left']).','.$this->coord($node['top']).')';
				
				$str = utf8_decode(html_entity_decode(str_replace('  ', ' ',trim($node['text']))));
				
				
				
				
				//$lastFontSize = -1;
				$lastWidth = 0;
				$currWidth = 0;
				while ( ($currWidth = $this->fpdf->GetStringWidth($str)) < $this->coord($node['width']) ){
					if ( $currWidth == $lastWidth ) break;
					$fontSize += 0.5;
					$this->fpdf->SetFontSize($fontSize);
					$lastWidth = $currWidth;
				}
				$lastWidth = 0;
				$currWidth = 0;
				while ( ($currWidth = $this->fpdf->GetStringWidth($str)) > $this->coord($node['width']) ){
					if ( $currWidth == $lastWidth) break;
					$fontSize -= 0.5;
					$this->fpdf->SetFontSize($fontSize);
					$lastWidth = $currWidth;
				}
				
				
				$this->fpdf->SetFontSize($fontSize);
				$this->fpdf->SetXY(floatval($this->pxcoord($node['left'])), $this->pcoord($node['top'])/*+$this->fpdf->getFontAscent(
					$this->fpdf->getFontFamily(),
					$this->fpdf->getFontStyle(),
					$this->fpdf->getFontSize()
				)*/);
			
				//$this->fpdf->SetCellPadding(0);
				$this->fpdf->Text($this->pxcoord($node['left']), $this->pcoord($node['top'])/*+$this->fpdf->getFontAscent(
					$this->fpdf->getFontFamily(),
					$this->fpdf->getFontStyle(),
					$this->fpdf->getFontSize()
					)*/, 
					$str
				);
				
				
			}
			
			
			
			
			//if ( $this->fpdf->getY() + $this->coord($node['height']) > $this->fpdf
			
			
			
			
			if ( $this->borderTop($node) ){
				//$this->fpdf->SetXY($this->coord($node['left'])+(floatval($this->coord($node['border-top-width']))-floatval($this->coord($node['border-left-width'])))/2.0, floatval($this->coord($node['top']))-floatval($this->coord($node['border-top-width']))/2.0);
			
				$this->fpdf->SetLineWidth($this->coord($node['border-top-width']));
				$this->fpdf->SetDrawColor(
					$this->getR($node, 'border-top-color'),
					$this->getG($node, 'border-top-color'),
					$this->getB($node, 'border-top-color')
				);
				//echo $this->coord($node['border-top-width']);
				//echo '{'.$this->getR($node, 'border-top-color').'}';
				//echo '{'.$this->getG($node, 'border-top-color').'}';
				$this->fpdf->Line(
					floatval($this->pxcoord($node['left']))-floatval($this->coord($node['border-left-width'])),
					floatval($this->pcoord($node['top'])) - floatval($this->coord($node['border-top-width']))/2.0,
					floatval($this->pxcoord($node['left']))+floatval($this->coord($node['width']))+floatval($this->coord($node['border-right-width'])) + $this->coord($node['padding-left']) + $this->coord($node['padding-right']),
					floatval($this->pcoord($node['top'])) - floatval($this->coord($node['border-top-width']))/2.0
				);
				//$this->fpdf->Rect(
				//	$this->coord($node['left']),
				//	$this->coord($node['top']),
				//	$this->coord($node['width']),
				//	$this->coord($node['height']),
				//	$this->rectStyle($node)
				//);
			}
			
			if ( $this->borderLeft($node) ){
				//$this->fpdf->SetXY($this->coord($node['left']) , floatval($this->coord($node['top'])) + floatval($this->coord($node['border-top-width']))/2.0);
			
				$this->fpdf->SetLineWidth($this->coord($node['border-left-width']));
				$this->fpdf->SetDrawColor(
					$this->getR($node, 'border-left-color'),
					$this->getG($node, 'border-left-color'),
					$this->getB($node, 'border-left-color')
				);
				//echo $this->coord($node['border-top-width']);
				//echo '{'.$this->getR($node, 'border-top-color').'}';
				//echo '{'.$this->getG($node, 'border-top-color').'}';
				
				$this->fpdf->Line(
					floatval($this->pxcoord($node['left']))-floatval($this->coord($node['border-left-width']))/2.0,
					floatval($this->pcoord($node['top'])) ,
					floatval($this->pxcoord($node['left']))-floatval($this->coord($node['border-left-width']))/2.0,
					
					floatval($this->pcoord($node['top'])) +floatval($this->coord($node['height'])) + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom'])
				);
				//$this->fpdf->Rect(
				//	$this->coord($node['left']),
				//	$this->coord($node['top']),
				//	$this->coord($node['width']),
				//	$this->coord($node['height']),
				//	$this->rectStyle($node)
				//);
			}
			
			if ( $this->borderBottom($node) ){
				//$this->fpdf->SetXY($this->coord($node['left']) + floor(floatval($this->coord($node['border-left-width']))/2.0), floatval($this->coord($node['top'])) + floatval($this->coord($node['border-bottom-width']))/2.0);
			
				$this->fpdf->SetLineWidth($this->coord($node['border-bottom-width']));
				$this->fpdf->SetDrawColor(
					$this->getR($node, 'border-bottom-color'),
					$this->getG($node, 'border-bottom-color'),
					$this->getB($node, 'border-bottom-color')
				);
				$bottom = floatval($this->pcoord($node['top'])) + floatval($this->coord($node['height']));
				$this->fpdf->Line(
					floatval($this->pxcoord($node['left']))-floatval($this->coord($node['border-left-width'])),
					$bottom+floatval($this->coord($node['border-bottom-width']))/2.0 + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom']) ,
					floatval($this->pxcoord($node['left']))+floatval($this->coord($node['width']))+floatval($this->coord($node['border-right-width'])) + $this->coord($node['padding-left']) + $this->coord($node['padding-right']),
					$bottom+floatval($this->coord($node['border-bottom-width']))/2.0 + $this->coord($node['padding-top']) + $this->coord($node['padding-bottom'])

				);
				//echo $this->coord($node['border-top-width']);
				//echo '{'.$this->getR($node, 'border-top-color').'}';
				//echo '{'.$this->getG($node, 'border-top-color').'}';
				
				//$this->fpdf->Rect(
				//	$this->coord($node['left']),
				//	$this->coord($node['top']),
				//	$this->coord($node['width']),
				//	$this->coord($node['height']),
				//	$this->rectStyle($node)
				//);
			}
				
				
			if ( $this->borderRight($node) ){
				//$this->fpdf->SetXY($this->coord($node['left']) + floor(floatval($this->coord($node['border-left-width']))/2.0), floatval($this->coord($node['top'])) + floatval($this->coord($node['border-bottom-width']))/2.0);
			
				$this->fpdf->SetLineWidth($this->coord($node['border-right-width']));
				$this->fpdf->SetDrawColor(
					$this->getR($node, 'border-right-color'),
					$this->getG($node, 'border-right-color'),
					$this->getB($node, 'border-right-color')
				);
				$bottom = floatval($this->pcoord($node['top'])) + floatval($this->coord($node['height']));
				$right = floatval($this->pxcoord($node['left'])) + floatval($this->coord($node['width']));
				
				$this->fpdf->Line(
					$right+floatval($this->coord($node['border-right-width']))/2.0+$this->coord($node['padding-left']) + $this->coord($node['padding-right']),
					floatval($this->pcoord($node['top'])),
					$right+floatval($this->coord($node['border-right-width']))/2.0+$this->coord($node['padding-left']) + $this->coord($node['padding-right']) ,
					$bottom+$this->coord($node['padding-top'])+$this->coord($node['padding-bottom'])

				);
				//echo $this->coord($node['border-top-width']);
				//echo '{'.$this->getR($node, 'border-top-color').'}';
				//echo '{'.$this->getG($node, 'border-top-color').'}';
				
				//$this->fpdf->Rect(
				//	$this->coord($node['left']),
				//	$this->coord($node['top']),
				//	$this->coord($node['width']),
				//	$this->coord($node['height']),
				//	$this->rectStyle($node)
				//);
			}
			
		
		} else {
			// This should only happen for text nodes, but the text would
			// have been also contained in the parent node so we can just
			// ignore it.
			//echo "[No Width: ".$node['text'].']';
		}
		
		// We are no longer doing this recursively.  We first flatten
		// the array and go through it sequentially.  That allows us to 
		// deal with things like z-index in a much better fashion.
		//if ( @$node['children'] ) {
		//	foreach ($node['children'] as $child ){
		//		$this->render($child, $attributes);
		//	}
		//}
		
		// If this element exceeds the lower bounds of the page,
		// we return true to instruct the caller to schedule 
		// this element for insertion into the next page
		// also.
		if ( $this->pcoord(@$node['top']+@$node['height']) > $this->fpdf->getPageHeight() ){
			return true;
		} else if ( $this->pcoord(@$node['top']+@$node['height']) > 0 and $this->pxcoord(@$node['left']+@$node['width']) > $this->fpdf->getPageWidth() ){
			return true;
		} else {
			return false;
		}
	
	}
	
	
	function flatten(&$node){
		$out = array();
		$this->flatten_rec($node, $out);
		return $out;
				
	}
	
	function flatten_rec(&$node, &$out, $attributes=array('opacity'=>1.0)){
		if ( @$node['font-family'] ) $attributes['font-family'] = $node['font-family'];
		if ( @$node['font-size'] ) $attributes['font-size'] = $node['font-size'];
		if ( @$node['font-weight'] ) $attributes['font-weight'] = $node['font-weight'];
		if ( @$node['line-height'] ) $attributes['line-height'] = $node['line-height'];
		if ( @$node['color'] ) $attributes['color'] = $node['color'];
		if ( @$node['filter'] ){
			$opacity = $this->getAlpha($node);
			$node['opacity'] = $opacity;
		}
		if ( @$node['-moz-opacity'] ){
			$node['opacity'] = $node['-moz-opacity'];
		}
		if ( @$node['opacity'] ){
			if ( isset($attributes['opacity']) ) $attributes['opacity'] = floatval($attributes['opacity'])*floatval($node['opacity']);
			else $attributes['opacity'] = $node['opacity'];
		}
		
		foreach ($attributes as $k=>$v){
			$node[$k] = $v;
		}
	
	
		$out[] = $node;
		if ( @$node['children'] ){
			usort($node['children'], array($this, '_cmp_zindex'));
			foreach ($node['children'] as $child){
				$this->flatten_rec($child, $out, $attributes);
			}
		}
	}
	
	function _cmp_zindex($a, $b){
		$z1 = $z2 = 0;
		if ( isset($a['z-index'] )) $z1 = intval($a['z-index']);
		if ( isset($b['z-index'] )) $z2 = intval($b['z-index']);
		if ( $z1<$z2 ) return -1;
		if ( $z2<$z1 ) return 1;
		return 0;
	}
	
	
	private $currTemplatePage = 0;
	function AddPage(){
		
		$this->fpdf->AddPage();
		if ( $this->template ){
			//$page = $this->fpdf->getPage();
			$this->currTemplatePage++;
			//echo "Page number: ".$this->currTemplatePage;
			$tid = $this->fpdf->importPage(1/*$this->currTemplatePage*/, '/ArtBox');
			if ( !$tid ){
				$this->currTemplatePage = 1;
				$tid = $this->pdf->importPage($this->currTemplatePage);
			}
			if ( !$tid ){
				throw new Exception("Failed to get emplate id for page ".$this->currTemplatePage." from template ".$this->template);
			}
			$this->fpdf->useTemplate($tid);
		
		}
	
	}
	
	
	function build(){
		//$this->fpdf->AddPage();
		if ( $this->template ){
			$this->fpdf->setSourceFile($this->template);
		}
        
        
        
		$this->fpdf->SetMargins(0,0,0);
		$data = $this->flatten($this->data);
		$queue = $data;
		while ( count($queue) > 0 ){
			//echo "Adding Page";
			$this->AddPage();
			$nextQueue = array();
			foreach ($queue as $d){
				$res = $this->render($d);
				if ( $res ){
					$nextQueue[] = $d;
				}
			}
			$queue = $nextQueue;
			
		}
		
		//$this->render($this->data);
		$f = tempnam(sys_get_temp_dir(),'jquery.pdf');
		$out = $this->fpdf->Output($f, 'S');
		file_put_contents($f, $out);
		//exit;
		return basename($f);
	}
	
	static function getPDFAsString($file){
		$f = tempnam(sys_get_temp_dir(), 'jquery.pdf');
		$d = dirname($f);
		if ( file_exists($d.'/'.basename($file)) ){
			$out = file_get_contents($d.'/'.basename($file));
			unlink($d.'/'.basename($file));
			//echo "Found";
			//echo $out;
			return $out;
		} else {
			echo "Not found";
			return null;
		}
	}
	
	
}

function decode_data_keys(&$data, &$rdict){
	//$keys = array_keys($data);
	//print_r($keys);
	//foreach ($keys as $k){
	foreach ($data as $k=>$v){
		
		//$v = $data[$k];
		if ( $k === 'c' ){
			// it's the children
			foreach ($data['c'] as $ck=>$child){
				decode_data_keys($data['c'][$ck], $rdict);
			}
			$data['children'] =& $data['c'];
			unset($data['c']);
		} else {
			$key='';
			$val='';
			if (!is_array($rdict) ){
				$ex = new Exception();
				echo $ex->getTraceAsString();
				print_r($rdict);
				
			}
			if ( array_key_exists($k, $rdict) ) $key = $rdict[$k];
			else {
				continue;
			}
			if ( array_key_exists($v, $rdict) ) $val = $rdict[$v];
			else {
				continue;
			}
			
			unset($data[$k]);
			$data[$key] = $val;
			
		}
	}
	

}


function handlePacket(){
	$required = array(
		'req',
		'pid',
		'data',
		'size'
	);
	
	foreach ($required as $r){
		if ( !isset($_GET[$r])  ){
			throw new Exception("MIssing required field $r");
		}
	}
	
	if ( !preg_match('/^[0-9]+$/', $_GET['req']) ){
		throw new Exception("Invalid request id");
	}
	
	$requestID = intval($_GET['req']);
	
	
	if ( !preg_match('/^[0-9]+$/', $_GET['pid']) ){
		throw new Exception("Invalid packet id");
	}
	
	$packetID = intval($_GET['pid']);
	
	if ( !preg_match('/^[0-9]+$/', $_GET['size']) ){
		throw new Exception('Invalid size');
	}
	
	$numPackets = intval($_GET['size']);
	
	
	if ( $numPackets < $packetID+1 ){
		throw new Exception("Packet ID exceeds request size");
	}
	
	$contents = $_GET['data'];
	
	
	
	// Now we can get to business
	$path = CACHE_PATH.'/'.$requestID;
	touch($path);
	$fh = fopen($path, 'r+');
	if ( !$fh ) throw new Exception("Failed to open file $path");
	flock($fh, LOCK_EX);
	
	$data = stream_get_contents($fh);
	//echo "[$data]";
	if ( $data ) $data = unserialize($data);
	else $data = array();
	
	if ( !is_array($data) ) $data = array();
	
	$data['packets'][$packetID] = $contents;
	
	$complete=true;
	for ( $i=0;$i<$numPackets; $i++){
		if ( !isset($data['packets'][$i]) ){
			$complete = false;
			break;
		}
	}
	
	if ( $complete ){
	
	
		$contents = '';
		for ( $i=0; $i<$numPackets; $i++){
			$contents .= $data['packets'][$i];
		}
		
		
		//mail('steve@weblite.ca', 'Test Email', $contents);
		fclose($fh);
		//file_put_contents($path, $contents);
		unlink($path);
		return $contents;
		
	
	} else {
	
		ftruncate($fh,0);
		rewind($fh);
		$res = fwrite($fh, serialize($data));
		if ( !$res ) throw new Exception("Failed to write file");
		fclose($fh);
		$response = array(
			'success'=>true,
			'filesize'=>filesize($path),
			'numkeys'=>count($data['packets'])
		);
		response($response, $requestID, $packetID);
		//exit;
	}
	
}

function response($response, $requestID=null, $packetID=null){

	if ( !isset($requestID) ) $requestID = $_GET['req'];
	if ( !isset($packetID) ) $packetID = $_GET['pid'];
	header("Content-type: text/javascript");
	echo 'if ( typeof(jpdf_response) == "undefined")  jpdf_response = {};';
	echo 'if ( typeof(jpdf_response['.$requestID.']) == "undefined") jpdf_response['.$requestID.'] = {};';
	echo 'jpdf_response['.$requestID.']['.$packetID.'] = '.json_encode($response).';';
}




if ( isset($_GET['req']) ){
	try {
		$_REQUEST['data'] = handlePacket();
	} catch (Exception $ex){
		$response = array(
			'success'=>false,
			'error'=>$ex->getMessage()
		);
		response($response);
		//exit;
	}
}


if ( @$_REQUEST['data'] ){
	if ( !isset($_REQUEST['baseHref']) ) die("Please provide baseHref parameter");
	if ( !isset($_REQUEST['orientation']) ) die("Please provide orientation parameter");
	if ( !isset($_REQUEST['format']) ) die("Please provide format parameter");
	//require_once 'Services/JSON.php';
	//$json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
	//$data = $json->decode($_POST['data']);
	error_log("Starting json_decode: ".time());
	$d = json_decode($_REQUEST['data'], true);
	error_log("Finished json_decode: ".time());
	//print_r($d);
	
	$data =& $d['data'];
	//$dict = $d['dict'];
	$rdict =& $d['dict'];
	//print_r($data);exit;
	//print_r($rdict);exit;
	error_log("Starting decode_data_keys: ".time());
	decode_data_keys($data, $rdict);
	error_log("Finished decode_data_keys: ".time());
	
	//echo "width:$data[width]";
	//print_r($json->decode($_POST['data'], true));exit;
	$pagesWide = 1;
	if ( @$_REQUEST['pagesWide'] ) $pagesWide = intval($_REQUEST['pagesWide']);
	$jpdf = new jquery_pdf($data, $_REQUEST['baseHref'],  $_REQUEST['orientation'], 'pt', $_REQUEST['format'], $pagesWide);
	
	if ( @$_GET['--template'] ){
		$jpdf->template = $_GET['--template'];
		//echo "Template: ".$jpdf->template;exit;
	}
	
	error_log("Starting build: ".time());
	$ret = $jpdf->build();
	error_log("Finished build: ".time());
	
	$fileurl = "http".(@$_SERVER['HTTPS']=='on'?'s':'')."://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].'?-action=pdfreports_jquery_pdf&file='.urlencode(base64_encode($ret));
	if ( @$_REQUEST['--disposition'] ){
		$fileurl .= '&--disposition='.urlencode($_REQUEST['--disposition']);
	}
	if ( @$_GET['req'] ){
		$response = array(
			'success'=>true,
			'complete'=>true,
			'pdf_url'=>$fileurl
		);
		response($response);
		//exit;
	} else {
		header('Content-type: text/plain');
		echo 'OK'."\n$fileurl";
		//exit;
	}
} else if ( @$_GET['file'] ){
	$ret = jquery_pdf::getPDFAsString(base64_decode($_GET['file']));
	//echo $ret;
	//print_r($_GET);
	$disposition = "inline";
	if ( @$_GET['--disposition'] == 'attachment' ){
		$disposition='attachment';
	}
	if ( $ret ){
		header("Content-type: application/pdf");
		header('Content-Disposition: '.$disposition.'; filename="GeneratedPDF.pdf"');
		header('Content-Length: '.strlen($ret));
		header('Connection:close');
		echo $ret;
		//exit;
	} else {
		header('HTTP/1.0 404 Not Found');
		//exit;
	}
	
} else {
	echo "Please either post the data or post the file name to retrieve";
	//exit;
}