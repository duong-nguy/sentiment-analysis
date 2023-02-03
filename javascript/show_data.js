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
    request = "off-set=" + encodeURIComponent(off_set) +
        "&n-rows=" + encodeURIComponent(N_ROWS);
    send_request(request);
}
function request_detele_row() {
    id = this.parentNode.parentNode.cells[0].innerHTML;
    request =
        "off-set=" + encodeURIComponent(off_set) +
        "&n-rows=" + encodeURIComponent(N_ROWS) +
        "&delete=" + encodeURIComponent(id);
    send_request(request);
}
function request_edit_row() {
    id = this.parentNode.parentNode.cells[0].innerHTML;
    row = this.parentNode.parentNode;
    new_row = id + ",";
    for (let index = 1; index < row.cells.length - 2; index++) {
        const cell = row.cells[index];
        cell_value = cell
            .querySelector(`#${cell.id}`)
            .value;
        if (cell_value == "") {
            document.getElementById("feedback-msg").innerHTML =
                `${cell.id} is empty`;
            return;
        };
        if (row.cells[index].id == "age" && !Number.isFinite(cell_value)) {
            document.getElementById("feedback-msg").innerHTML =
                `${cell.id} can only not be number`;
            return;
        }
        new_row += cell_value + ",";
    }
    new_row = new_row.substring(0, new_row.length - 1);
    request =
        "off-set=" + encodeURIComponent(off_set) +
        "&n-rows=" + encodeURIComponent(N_ROWS) +
        "&edit=" + encodeURIComponent(id) +
        "&new-row=" + encodeURIComponent(new_row);
    send_request(request);
    document.getElementById("feedback-msg").innerHTML = "";
}
function send_request(request) {
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
    xhr.send(request);
}
function create_edit_fields() {
    row = this.parentNode.parentNode;
    id = row.cells[0].innerHTML;
    for (let index = 1; index < row.cells.length - 2; index++) {
        cell = row.cells[index];
        cell.innerHTML = "";
        text_area = document.createElement("textarea");
        text_area.id = cell.id;
        cell.appendChild(text_area);
    }
    row.cells[row.cells.length - 1].innerHTML = "";
    row.cells[row.cells.length - 2].innerHTML = "";
    return_btn = create_btn("return", request_data)
    done_btn = create_btn("done", request_edit_row)
    row.cells[row.cells.length - 1].appendChild(return_btn);
    row.cells[row.cells.length - 2].appendChild(done_btn);
}
function create_btn(name, event_lis) {
    btn = document.createElement("button");
    btn.innerHTML = name;
    btn.addEventListener("click", event_lis);
    return btn;
}
function end_of_file(responseText) {
    if (responseText === "[]") {
        off_set -= N_ROWS;
        return true;
    }
    return false;
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
                cell.id = cell_idx;
                cell.innerHTML = row_data[cell_idx];
            }
        }
        row.insertCell().appendChild(
            create_btn("delete", request_detele_row));
        row.insertCell().appendChild(
            create_btn("edit", create_edit_fields));
    });
}
request_data();