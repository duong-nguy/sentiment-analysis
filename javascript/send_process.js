var button = document.getElementById("send-request");
button.addEventListener("click",submit_form);
function validate_data() {
    let form_ctmr_fbck = document.getElementById("customer-feedback");
    for (const element of form_ctmr_fbck.elements) {
        if (element.value == "") {
            if (element.type == "button") continue;
            document.getElementById("input-val-res").innerHTML =
                element.name + " is empty";
            return false;
        }
    }
    return true;
}
function extract_data() {
    let form_ctmr_fbck = document.getElementById("customer-feedback");
    let data= "";
    for (const element of form_ctmr_fbck.elements) {
        if (element.type == "button") continue;
        data+= data == "" ? `${element.name}=` : `&${element.name}=`;
        data+= encodeURIComponent(element.value);
    }
    return data;
}

function submit_form() {
    if (!validate_data()) return;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/save_data.php", true);
    xhr.setRequestHeader("Content-Type",
        "application/x-www-form-urlencoded");
    form_data = extract_data();
    console.log(form_data);
    xhr.send(form_data);
}
