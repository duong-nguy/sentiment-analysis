<?php
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    if (isset($_POST["delete"]))
        delete_row("data.csv", $_POST["delete"]);
    if (isset($_POST["edit"]))
        edit_row("data.csv", $_POST["edit"], $_POST["new-row"]);
    $data_json = read_csv(
        "data.csv",
        $_POST["off-set"],
        $_POST["n-rows"]
    );
    header("Content-Type: application/json");
    echo $data_json;
}
function make_prediction($comment)
{
    $curl = curl_init();

    curl_setopt_array(
        $curl,
        array(
            CURLOPT_URL => "http://localhost:5000/predict",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($comment),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json"
            ),
        )
    );

    $response = curl_exec($curl);
    if(!$response) return "Na";
    curl_close($curl);

    $prediction = json_decode($response, true);
    return $prediction;
}
function process_request($data){
    $arr = explode(',', $data);
    $comment = $arr[count($arr) - 2];
    $sentiment = make_prediction($comment);
    $arr[count($arr) - 1] = $sentiment;
    $data = implode(",", $arr);
    return $data;
}
function edit_row($file_name, $id, $new_row)
{
    if (!check_data($new_row))
        return;
    $new_row= process_request($new_row);
    $file = fopen($file_name, "r");
    $tem_file = fopen("temp.csv", "a");
    while ($row = fgetcsv($file)) {
        if ($row[0] === $id) {
            fwrite($tem_file, $new_row."\n");
            continue;
        }
        fputcsv($tem_file, $row);

    }
    fclose($file);
    fclose($tem_file);
    unlink($file_name);
    rename("temp.csv", $file_name);
}
function check_data($data){
    $data = explode(",", $data);
    foreach ($data as $key => $value) {
        if ($value === "")
            return false;
        if ($key === 2 && !is_numeric($value))
            return false;
    }
    return true;
}
function delete_row($file_name, $id)
{
    $file = fopen($file_name, "r");
    $tem_file = fopen("temp.csv", "a");
    while ($row = fgetcsv($file)) {
        if ($row[0] === $id)
            continue;
        fputcsv($tem_file, $row);

    }
    fclose($file);
    fclose($tem_file);
    unlink($file_name);
    rename("temp.csv", $file_name);
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