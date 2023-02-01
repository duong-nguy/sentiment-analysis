<?php
if ($_SERVER['REQUEST_METHOD'] === "GET") {
    echo count($_GET);
    $data_json = read_csv(
        "data.csv",
        5
    );
    header("Content-Type: application/json");
    echo $data_json;
}
function read_csv(
    string $file,
    int $n_rows
)
{
    $file = fopen($file, "r");
    $header = fgetcsv($file);
    $data_arr = array();
    while ($row = fgetcsv($file)) {
        if ($n_rows <= 0)
            break;
        $data_row = array();
        for ($i = 0; $i < count($header); $i++) {
            $data_row[$header[$i]] = $row[$i];
        }
        $data_arr[] = $data_row;
        $n_rows--;
    }
    fclose($file);
    $data_json = json_encode($data_arr);
    file_put_contents("debug.json",$data_json);
    return $data_json;
}

?>