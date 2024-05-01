<html>
<body>
<a href="javascript:<?php echo htmlspecialchars(<<<END
(function(){
	var s = document.createElement('script');
	s.src='http://dev.weblite.ca/jquery-pdf/jquery.pdf.js';
	s.type='text/javascript';
	s.async=true;
	s.setAttribute('convert-page',1);
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);

})();

END
);?>" title="Convert Page to PDF">Convert Page to PDF</a>
</body>
</html>