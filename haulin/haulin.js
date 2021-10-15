function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    localStorage.setItem("profile", profile);  
}

function init(){
    var profile = localStorage.getItem("profile");
    if(profile!=null){
        document.getElementById("signin").style.display = "none";
        document.getElementById("table").style.display = "block";
    }
}

function checkCode(){
    if(document.getElementById("code_box").value == "626"){
        document.getElementsById("table").style.display = "none";
        document.getElementsById("message").style.display = "block";
        document.getElementById("message").innerHTML = "Đăng nhập thành công";
    }
}