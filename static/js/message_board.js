var box,
    rotateAngle = [0, 0];
    mouseDown = {
        state: 0,
        x: 0,
        y: 0,
    }

window.onload = function () {
    box = document.getElementsByClassName("box")[0];

    box.onmousedown = function (e) {
        mouseDown.state = 1;
        mouseDown.x = e.pageX;
        mouseDown.y = e.pageY;
        e.preventDefault();
    }
}

document.onmousemove = function (e) {
    if (mouseDown.state == 1) {
        var dy = (e.pageX - mouseDown.x) / 400,
            dx = -(e.pageY - mouseDown.y) / 400;
        rotateAngle[0] += dx;
        rotateAngle[1] += dy;
        var style = "translateZ(-400px) rotateX(" + rotateAngle[0] + "deg) rotateY(" + rotateAngle[1] + "deg)";
        box.style.transform = style;
        box.style.webkitTransform = style;
        e.preventDefault();
    }
}

document.onmouseup = function (e) {
    mouseDown.state = 0;
}

function left() {
    rotateAngle[1] += 90;
    var style = "translateZ(-400px) rotateX(" + rotateAngle[0] + "deg) rotateY(" + rotateAngle[1] + "deg)";
    box.style.transform = style;
    box.style.webkitTransform = style;
    document.getElementById("d").innerHTML = style;
}

function right() {
    rotateAngle[1] -= 90;
    var style = "translateZ(-400px) rotateX(" + rotateAngle[0] + "deg) rotateY(" + rotateAngle[1] + "deg)";
    box.style.transform = style;
}

function up() {
    rotateAngle[0] -= 90;
    var style = "translateZ(-400px) rotateX(" + rotateAngle[0] + "deg) rotateY(" + rotateAngle[1] + "deg)";
    box.style.transform = style;
}

function down() {
    rotateAngle[0] += 90;
    var style = "translateZ(-400px) rotateX(" + rotateAngle[0] + "deg) rotateY(" + rotateAngle[1] + "deg)";
    box.style.transform = style;
}