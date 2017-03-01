

document.getElementById("svg").onload = function () {
    var svg = document.getElementById("svg").getSVGDocument(),
        path1 = svg.getElementById("path1").getAttribute("d"),
        path2 = svg.getElementById("path2").getAttribute("d"),
        len1 = path1.split(" ").length,
        len2 = path2.split(" ").length;
    alert(len1.toString() + " " + len2.toString());
}