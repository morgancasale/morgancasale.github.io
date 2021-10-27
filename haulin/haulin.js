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

const levDis = (str1 = '', str2 = '') => {
    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
       track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
       track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
       for (let i = 1; i <= str1.length; i += 1) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          track[j][i] = Math.min(
             track[j][i - 1] + 1, // deletion
             track[j - 1][i] + 1, // insertion
             track[j - 1][i - 1] + indicator, // substitution
          );
       }
    }
    return track[str2.length][str1.length];
};

function checkAnswer(){
    var answer = document.getElementById("ans_box").value;
    if(simString(answer, found_clue.answer)){
        document.getElementById("ans").style.display = "none";
        document.getElementById("message").style.display = "none";

        document.getElementById("scs").innerHTML = found_clue.gps+"\n"+found_clue.scs+"\n"+found_person.atxt;
        document.getElementById("scs").style.display = "block";
    } else{
        document.getElementById("ans_box").value = "Wrong answer!";
        document.getElementById("ans_box").style.color= "red";
    }
}

function simString(str1, str2){
    var flag = false;
    if(str1.toLowerCase() == str2.toLowerCase()){
        flag = true;
    }
    return flag;
}