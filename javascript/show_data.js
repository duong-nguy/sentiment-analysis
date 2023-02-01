var off_set = 0;
const N_ROWS = 5;
document.addEventListener("load", request_data)
document.getElementById("back-btn").addEventListener("click", () => {
    off_set += off_set === 0 ? 0 : 1;
    request_data();
})
document.getElementById("next-btn").addEventListener("click", () => {
    off_set++;
    request_data();
})
function request_data() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "php/read_data.php", true);
    xhr.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE &&
            this.status === 200) {
            create_table(xhr.responseText);
        }
    }
    xhr.send("off-set=" + encodeURIComponent(off_set) +
        "&n-rows=" + encodeURIComponent(N_ROWS));
}
function create_table(data) {
    data = data.substring(data.indexOf('['),
        data.lastIndexOf(']') + 1);
    data = JSON.parse(data);
    table = document.getElementById("table");
    table.innerHTML += "<tr>";
    for (const key of Object.keys(data[0])) {
        table.innerHTML += `<th>${key}</th>`
    }
    table.innerHTML += "</tr>";
    data.forEach(function(row){
        table.innerHTML += "<tr>";
        for (const key in row) {
            table.innerHTML += `<td>${row[key]}</th>`;
        }
        table.innerHTML += "</tr>";
    });

}