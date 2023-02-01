<?php
if (!empty($_REQUEST["min"]))
	$min = $_REQUEST["min"] ;
else
	$min = 0 ;
if (!empty($_REQUEST["max"]))
	$max = $_REQUEST["max"] ;
else
	$max = 10e10 ;

//źródło danych o krajach: https://www.downloadexcelfiles.com/pl/wo_pl/lista-krajow-na-%C5%9Bwiecie#.WxRLGhwuD7M
$handle = fopen("kraje.csv", "r") or die("Read failure") ;
$kraje = array() ;
while(!feof($handle)) {
	$kraj = fgetcsv ($handle,0, ";" ) ;
	if ($kraj && $kraj[1] >= $min && $kraj[1] < $max)
		$kraje[] = array("kraj" => $kraj[0],"ludnosc" => $kraj[1], "powierzchnia" => $kraj[2],"gestosc"=>$kraj[3]) ;
}
fclose($handle) ;
//echo '<pre>' ; print_r($kraje) ; echo '</pre>' ;
$krajejson = json_encode($kraje) ;
echo $krajejson ;
?>
