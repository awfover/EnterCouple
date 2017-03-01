function elHasClass(obj, name) {
    if (obj) {
        var list = obj.className.split(" ");
        for (var i = 0; i < list.length; i++) {
            if (list[i] == name) {
                return i;
            }
        }
    }
    return -1;
}

function elAddClass(obj, name) {
    if (obj) {
        obj.className += " " + name;
    }
}

function elRemoveClass(obj, name) {
    if (obj) {
        var index = elHasClass(obj, name),
            list = obj.className.split(" ");
        if (index != -1) {
            list.splice(index, 1);
            obj.className = list.join(" ");
        }
    }
}

function elGetCoordinate(obj) {
    var ret = { x: 0, y: -elGetScrollTop(obj) + document.body.scrollTop };
    while (obj) {
        ret.x += obj.offsetLeft;
        ret.y += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return ret;
}

function elGetScrollTop(obj) {
    var ret = 0;
    while (obj) {
        ret += obj.scrollTop;
        obj = obj.offsetParent;
    }
    return ret;
}

function isPtInRect() {
    var e = arguments[0],
        obj = arguments[1];
    if (typeof obj == "string") {
        var items = document.getElementsByClassName(obj);
        for (var i = 0; i < items.length; i++) {
            if (isPtInRect(e, items[i])) {
                return items[i];
            }
        }
    }
    else if (obj) {
        var pos = elGetCoordinate(obj);
        return ((e.pageX > pos.x) && (e.pageX < pos.x + obj.offsetWidth) && (e.pageY > pos.y) && (e.pageY < pos.y + obj.offsetHeight));
    }
}