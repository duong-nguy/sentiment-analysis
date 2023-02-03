<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    append_data($_POST, "data.csv");
}
function append_data($data, $file_name)
{

    if (!file_exists($file_name)) {
        $header = "ID,";
        foreach ($data as $key => $value) {
            $header = $header . "" . "$key,";
        }
        $header = substr($header, 0, -1);
        $header = $header . "" . "\n";
        file_put_contents($file_name, $header);
    }
    $line = "" . generate_base64_id() . ",";
    foreach ($data as $value) {
        $line = $line . "" . "$value,";
    }
    $line = substr($line, 0, -1);
    $line = $line . "" . "\n";
    $file = fopen($file_name, "a");
    fwrite($file, $line);
    fclose($file);
}
function generate_base64_id()
{
    $base64_chars = 
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
    $id = "";
    for ($i = 0; $i < 5; $i++) {
        $rand_index = mt_rand(0, 63);
        $id .= $base64_chars[$rand_index];
    }
    return $id;
}

?>