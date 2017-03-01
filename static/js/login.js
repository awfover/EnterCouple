


window.onload = function () {
	elAttachEvent(document.getElementsByClassName("login-btn")[0], "click", login);
    elAttachEvent(document.getElementsByName("username")[0], "focus", focus);
    elAttachEvent(document.getElementsByName("password")[0], "focus", focus);
    elAttachEvent(document.getElementsByName("username")[0], "blur", blur);
    elAttachEvent(document.getElementsByName("password")[0], "blur", blur);

    var svg = document.getElementsByClassName("svg")[0],
        path = document.getElementsByTagName("path");
    for (var i = 0; i < path.length; i++) {
        var length = path[i].getTotalLength();
        path[i].style.strokeDasharray = length + 50;
        path[i].style.strokeDashoffset = length + 50;
        path[i].style.stroke = "#fff";
        //elTransitionDisplay(path[i], "all 0.5s ease");
        elAnimationDisplay(path[i], "dash 2s ease forwards", function () {
            var item = document.getElementsByClassName(this.getAttribute("value"))[0];
            if (this.getAttribute("value") == "login") {
                elTransitionDisplay(item, "all 1s ease");
                item.style.background = "rgba(54, 71, 85, 0.6)";
            }
            else {
                elTransitionDisplay(item, "all 1s ease");
                item.style.opacity = "1";
                item.style[prefix("transform")] = "scale(1)";
            }

            this.style.strokeDashoffset = "0";
            elTransitionDisplay(this, "all 0.5s ease 0.5s");
            this.style.stroke = "transparent";
        });
    }
    return;
}

window.onkeyup = function(event) {
    var key = (window.event) ? event.keyCode : event.which;
    if (key == 13) {
        login();
    }
}

function login() {
	var form = new FormData(document.getElementsByClassName("login-form")[0]),
        elLoginMessage = document.getElementsByClassName("login-message")[0],
        elInput = document.getElementsByTagName("input");
    
    //elLoginMessage.style.visibility = "hidden";
    if (elInput[0].value.length == 0) {
        //elLoginMessage.style.visibility = "visible";
        elLoginMessage.style.opacity = "1";
        elLoginMessage.innerHTML = "请输入用户名";
        elAnimationDisplay(elLoginMessage, "fadeIn 1s ease backwards");
        elAnimationDisplay(elInput[0], "wobble 0.1s 3 linear");
        return;
    }
    else if (elInput[1].value.length == 0) {
        //elLoginMessage.style.visibility = "visible";
        elLoginMessage.style.opacity = "1";
        elLoginMessage.innerHTML = "请输入密码";
        elAnimationDisplay(elLoginMessage, "fadeIn 1s ease forwards");
        elAnimationDisplay(elInput[1], "wobble 0.1s 3 linear");
        return;
    }
    
    ajax({
    	method: "POST",
        target: "/login/",
        async: true,
        form: form,
        onsuccess: function (xhr) {
            if (xhr.responseText.length > 0) {
                //elLoginMessage.style.visibility = "visible";
                elLoginMessage.style.opacity = "1";
                elLoginMessage.innerHTML = xhr.responseText;
                elAnimationDisplay(elLoginMessage, "fadeIn 1s ease forwards");
                elAnimationDisplay(elInput[1], "wobble 0.1s 3 linear");
            }
            else {
                window.location.href = "/index/";
            }
        }
    });
}

function focus() {
    if (this.getAttribute("name") == "username") {
        elAddClass(document.getElementsByClassName("icon")[0], "active");
    }
    else {
        elAddClass(document.getElementsByClassName("icon")[1], "active");
    }
}

function blur() {
    if (this.getAttribute("name") == "username") {
        elRemoveClass(document.getElementsByClassName("icon")[0], "active");
    }
    else {
        elRemoveClass(document.getElementsByClassName("icon")[1], "active");
    }
}