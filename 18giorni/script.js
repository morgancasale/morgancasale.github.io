function onload(){
    width = window.outerWidth;
    zoom = width / 3840 * 1.5;
    document.getElementById("container").style.zoom = zoom;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function cycle_digit(){
    for(var i = 0; i < 10; i++){
        num = randInt(0, 8);
        document.getElementById("num").innerHTML = num;
        await new Promise(r => setTimeout(r, 150));
    }
}

async function cycle_num(){
    var num = 8;
    while(true){
        num = 8;
        document.getElementById("num").innerHTML = num;
        await new Promise(r => setTimeout(r, 1500));

        for(var i = 0; i < 10; i++){
            num = randInt(0, 8);
            document.getElementById("num").innerHTML = num;
            await new Promise(r => setTimeout(r, 150));
        }

        num = 1;
        document.getElementById("num").innerHTML = num;
        await new Promise(r => setTimeout(r, 1500));

        for(var i = 1; i < 9; i++){
            document.getElementById("num").innerHTML = i;
            await new Promise(r => setTimeout(r, 100));
        }
    }
}

async function flash(){
    while(true){        
        document.getElementById("one").style.display = "none";
        document.getElementById("num").style.display = "none";
        document.getElementById("giorni").style.display = "none";
        await new Promise(r => setTimeout(r, 400));
        document.getElementById("one").style.display = "block";
        document.getElementById("num").style.display = "block";
        document.getElementById("giorni").style.display = "block";
        await new Promise(r => setTimeout(r, 800));
    }
}

