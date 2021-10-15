function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    document.getElementById("name").innerHTML = profile.getName();    
}