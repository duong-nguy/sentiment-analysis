<?php
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data_json = read_csv(
        "data.csv",
        $_POST["off-set"],
        $_POST["n-rows"]
    );
    header("Content-Type: application/json");
    echo $data_json;
}
function delete_line($file, $id)
{
    $file = fopen($file, "r");
    $tem_file = fopen("temp.csv", "a");
    while ($row = fgetcsv($file)) {
        if ($row[0] === $id)
            continue;
        fwrite($tem_file, $row);

    }
    fclose($file);
    fclose($tem_file);
    unlink($file);
    rename("temp.csv", $file);
}
function read_csv(
    string $file,
    int $off_set,
    int $n_rows
)
{
    $file = fopen($file, "r");
    $header = fgetcsv($file);
    $data_arr = array();
    while ($row = fgetcsv($file)) {
        if ($off_set > 0) {
            $off_set--;
            continue;
        }
        if ($n_rows <= 0)
            break;
        $data_row = array();
        for ($i = $off_set; $i < count($header); $i++) {
            $data_row[$header[$i]] = $row[$i];
        }
        $data_arr[] = $data_row;
        $n_rows--;
    }
    fclose($file);
    $data_json = json_encode($data_arr);
    return $data_json;
}

?>