function onSignIn(googleUser){
    var profile = googleUser.getBasicProfile();
    localStorage.setItem("profile", profile.getName());
    document.getElementById("signin").style.display = "none";
    document.getElementById("table").style.display = "block";
}

function init(){
    var profile = localStorage.getItem("profile");
    if(profile!=null){
        document.getElementById("signin").style.display = "none";
        document.getElementById("table").style.display = "block";
    }
}

function checkCode(){
    var profile = localStorage.getItem("profile");
    var message = searchMessage(document.getElementById("code_box").value, profile);

    document.getElementById("code").style.display = "none";
    document.getElementById("message").style.display = "block";

    document.getElementById("message").innerHTML = message;
    if(clue_found){
        document.getElementById("ans").style.display = "block";
    }
}

var found_clue;
var found_person;
var clue_found = false;

function searchMessage(code, name){
    var message = "No clue found!";
    var clues = JSON.parse(clues_data);
    
    clues.forEach(function(clue){
        clue.people.forEach(function(person){
            if(person.name == name){
                if(person.code == code){
                    found_person = person;
                    found_clue = clue;
                    message = clue.msg;
                    clue_found = true;
                }
            }
        })
    });
    
    return message;
}

function checkAnswer(){
    var answer = document.getElementById("ans_box").value;
    if(answer == found_clue.answer){
        document.getElementById("ans").style.display = "none";
        document.getElementById("message").style.display = "none";

        document.getElementById("scs").innerHTML = found_clue.gps+"\n"+found_clue.scs+"\n"+found_person.atxt;
        document.getElementById("scs").style.display = "block";
    } else{
        document.getElementById("ans_box").value = "Wrong answer!";
        document.getElementById("ans_box").style.color= "red";
    }
}