var colors =  ["red","blue","green","gold","purple","darkolivegreen"];
var speedStart = 50;
var speed = speedStart;
var users = new Array();
var winner = false;
var distToStop = false;
var leftToStop = 0;
var timer = 15;
var _timer;
$(function(){
    
    $("#counterBlock").css({display:"none"});
    $("#stav").bind("click",function(){
        var name = $("#infoBlock #name").val();
        var count = parseInt($("#infoBlock #count").val());
        if(isNaN(count) || name.length < 1 || count <= 0){
            alert("Введите правильные данные!");
            return;
        }
        
        if(users.length >= colors.length){//user limit of color count
            alert("Достигнул лимит ставок!");
            return false;
        }
        $("#infoBlock #name").val("");
        $("#infoBlock #count").val("");
        users.push(new user(name,colors[users.length],count));
        updateLines();
        if(users.length == 2){
            startTimer();
            $("#counterBlock").slideDown(500);            
        }
    })
})
function findUserFromColor(color){
    for(var i = 0; i < users.length ; i++)
        if(users[i].color == color)
            return users[i];
}
function gameOver(){
    alert("Победил: "+winner.name);
    setTimeout(function(){
    speed = speedStart;
    leftToStop = 0;
    distToStop = false;
    users = [];
    winner = false;
    updateLines();
    $("#infoBlock label").slideDown(1000);
    $("#infoBlock #stav").slideDown(1000);
    
    var dlin = $("#common_cont").outerWidth();
    $("#cont").css({left:0});
    $("#cont2").css({left:parseFloat($("#cont").css("left"))+dlin});
    },3000)
}
function startGame(){
    $("#infoBlock label").slideUp(1000);
    $("#infoBlock #stav").slideUp(1000);
    $("#counterBlock").slideUp(1000);
    animation();
    setTimeout(whoWin,5000);
}
function whoWin(){
    
    var summ = 0;
    for(var i = 0; i < users.length;i++)
        summ+=users[i].count;
    
    while(users.length > 1){
        var userBall = new Array(users.length);
        var allNull = true;
        for(var i = 0; i < users.length; i++){
            var rand = Math.random();
            if(users[i].count/summ > rand){
                userBall[i] = 1;
                allNull = false;
            }
            else
                userBall[i] = 0;
        }
        if(!allNull)
            for(var i = userBall.length -1; i >= 0; i--)
                if(userBall[i] == 0)
                    users.splice(i,1);
    }
    winner = users[0];
}
function startTimer(){
    _timer = timer;
    var tm = function(){
        $("#sstart").html(_timer);
        if(_timer == 0){
            startGame();
            return;
        }
        _timer--;
       setTimeout(tm,1000);
    }
    tm();
}
function animation(){
    var c1 = $("#cont")
    var c2 = $("#cont2")
    var dlin = $("#common_cont").outerWidth();
    $(c1).css({left:parseFloat($(c1).css("left"))-speed});
    $(c2).css({left:parseFloat($(c2).css("left"))-speed});
    if(parseFloat($(c1).css("left")) <= -dlin)
        parseFloat($(c1).css({left:parseFloat($(c2).css("left"))+dlin}));
    if(parseFloat($(c2).css("left")) <= -dlin)
        parseFloat($(c2).css({left:parseFloat($(c1).css("left"))+dlin}));
    if(winner){
        var windiv;
        var winXOffset = 0;
        for(var i = 0,tmp = $("#cont .line"); i < tmp.length; i++){
            if(winner.color == tmp[i].style.backgroundColor){
                windiv = tmp[i];
                break;
            }
            winXOffset+= $(tmp[i]).outerWidth();
        }
        var winW = $(windiv).outerWidth();
        var c1X = parseFloat($(c1).css("left"));
        var x = c1X+dlin;
        var winX = (c1X+dlin+winXOffset)%dlin;
        if(!distToStop){
            distToStop = dlin+dlin/2 + winX + winW/2;
            leftToStop = distToStop;
        }
        leftToStop-= speed;
        
        var speedMin = 2;
        if(speed > speedMin)
            speed =(speedStart) * (leftToStop/distToStop);
        else
            speed = speedMin;
        
        if(speedMin == speed && winX+winW/2-dlin/2 <= speed){
            $(c1).css({left:  dlin/2 - winXOffset-winW/2});
            if(parseFloat($(c1).css("left")) > 0)
                $(c2).css({left:parseFloat($(c1).css("left"))-dlin});
            else
                $(c2).css({left:parseFloat($(c1).css("left"))+dlin});
            gameOver();
            return;
        }
        
    }
    setTimeout(animation,1000/60);
}


function updateLines(){
    $("#cont .line").remove();
    $("#cont2 .line").remove();
    var summ = 0;
    for(var i = 0; i < users.length;i++)
        summ+=users[i].count;
    for(var j = 0, n = ["#cont","#cont2"]; j <= 1;j++)
        for(var i = 0; i < users.length;i++){
            var div = document.createElement("div");
            div.className = "line";
            div.style.width = (users[i].count/summ*100)+"%";
            div.style.background = users[i].color;
            $(n[j]).append(div);
        }
    $("#userlist li").remove();
    for(var i = 0; i < users.length;i++){
        var li = "            <li>";
                li+= "<span class=\"uname\">"+users[i].name+"</span>";
                li+= "<span class=\"ucount\">Ставка: "+users[i].count+"</span>";
                li+= "<span class=\"uper\">Процент: "+(users[i].count/summ*100).toFixed(1)+"%</span>";
            li+= "</li>";
        li = $(li);
        $(li).css({background:users[i].color})
        if(i == users.length-1){
            $(li).css({display:"none"});
            $("#userlist").append(li);
            $(li).show();
        }
        else
            $("#userlist").append(li);
    }
}

function user(name,color,count){//user class
    this.name = name;
    this.color = color;
    this.count = count;
}