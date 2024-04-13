function getAdress(){
    var link1 = "login-prod.html"
    var link2 = "account-poc.html"
    if(document.getElementById("option2").checked == true) {
        document.getElementById("adressId-log").setAttribute("href", link1)
    }
    else {
        document.getElementById("adressId-log").setAttribute("href", link2)
    }
}

// function PVZ(){
//     if(){}
// }