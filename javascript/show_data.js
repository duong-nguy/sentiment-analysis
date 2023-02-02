var off_set = 0;
const N_ROWS = 5;
document.getElementById("back-btn").addEventListener("click", () => {
    off_set += off_set === 0 ? 0 : -N_ROWS;
    request_data();
});
document.getElementById("next-btn").addEventListener("click", () => {
    off_set += N_ROWS;
    request_data();
});
function request_data() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/read_data.php", true);
    xhr.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE &&
            this.status === 200) {
            create_table(xhr.responseText);
        }
    }
    request = "off-set=" + encodeURIComponent(off_set) +
        "&n-rows=" + encodeURIComponent(N_ROWS);
    xhr.send(request);
}
function request_detele_row(){
    row = this.parentNode;
    id = row.getElementByTag("td")[0];
    console.log(id.innerHTML);
}
function request_edit_row(){
}
function end_of_file(responseText) {
    if (responseText === "[]") {
        off_set -= N_ROWS;
        return true;
    }
    return false;
}
function create_btn() {
    btn_delete = document.createElement("button");
    btn_edit = document.createElement("button");
    btn_delete.innerHTML = "Delete";
    btn_edit.innerHTML = "Edit";
    btn_delete.classList.add("delete-btn");
    btn_delete.classList.add("shy-btn");
    btn_edit.classList.add("delete-btn");
    btn_edit.classList.add("edit-btn");
    btn_delete.addEventListener("click",request_detele_row);
    btn_edit.addEventListener("click",request_edit_row);
    return [btn_delete,btn_edit];
}
function create_table(responseText) {
    if (end_of_file(responseText)) return;
    data = JSON.parse(responseText);
    table = document.getElementById("table");
    table.innerHTML = "";
    header_row = table.insertRow();
    Object.keys(data[0]).forEach(function (header) {
        cell = header_row.insertCell();
        cell.innerHTML = header;
    })
    data.forEach(function (row_data) {
        row = table.insertRow();
        for (const cell_idx in row_data) {
            if (Object.hasOwnProperty.call(row_data, cell_idx)) {
                cell = row.insertCell();
                cell.innerHTML = row_data[cell_idx];
            }
        }
        btn=create_btn()[0];
        row.insertCell().appendChild(btn);
    });
}
request_data();