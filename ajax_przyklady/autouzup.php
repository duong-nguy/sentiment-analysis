<?php
//źródło danych o krajach: https://www.downloadexcelfiles.com/pl/wo_pl/lista-krajow-na-%C5%9Bwiecie#.WxRLGhwuD7M
$kraje = file("autouzup.txt", FILE_IGNORE_NEW_LINES); //Czyta wszystkie linie
$q = $_REQUEST["q"] ;
$hint = "" ;
if ($q !== "") {
    $len=strlen($q);
    foreach($kraje as $k) {
        if (stristr($q, substr($k, 0, $len))) {
		$hint = $q.substr($k,$len) ; //Sklejamy oryginał i pierwszy suffiks            
		break ;
        }
    }
    if ($hint === "")  $hint=$q ;
}
echo $hint ;
?>
