// 判断元素是否有某个class
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

// 给元素增加一个class
function elAddClass(obj, name) {
    if (obj) {
        obj.className += " " + name;
    }
}

// 删除元素中特定的class
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

// 得到元素在页面上的坐标
function elGetCoordinate(obj) {
    var ret = { x: 0, y: -elGetScrollTop(obj) + document.body.scrollTop };
    while (obj) {
        ret.x += obj.offsetLeft;
        ret.y += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return ret;
}

// 得到obj顶端到top顶端之间的距离
function elGetOffsetTop(obj, top) {
    var ret = 0;
    while (obj && (obj != top)) {
        ret += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return ret;
}

// 得到obj左端到top左端之间的距离
function elGetOffsetLeft(obj, top) {
    var ret = 0;
    while (obj && (obj != top)) {
        ret += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return ret;
}

// 得到obj到top之间所有元素滚动条滚动高度之和
function elGetScrollTop(obj, top) {
    var ret = 0;
    while (obj != top) {
        ret += obj.scrollTop;
        obj = obj.offsetParent;
    }
    return ret;
}

// 判断点是否在某元素矩形内部
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

var hash = {};

// 给元素增加事件
function elAttachEvent(item, event, callback, useCapture) {
    if (item.addEventListener) {
        item.addEventListener(event, callback, useCapture);
    }
    else if (item.attachEvent) {
        item.attachEvent("on" + event, callback, useCapture);
    }
    if (callback) {
        hash[event] = hash[event] || [];
        hash[event].push(callback);
    }
}

// 给元素删除事件
function elDetachEvent(item, event, callback, useCapture) {
    if (callback) {
        if (item.addEventListener) {
            item.removeEventListener(event, callback, useCapture);
        }
        else if (item.attachEvent) {
            item.detachEvent("on" + event, callback, useCapture);
        }
    }
    else {
        for (var i = 0; i < hash[event].length; i++) {
            elDetachEvent(item, event, hash[event][i]);
        }
    }
}

// 给元素添加一段过渡
function elTransitionDisplay(item, anim, callback) {
    var prop = prefix("transition"),
        _event = (prop == "transition") ? (prop + "end") : (prop + "End");
    item.style[prop] = anim;
    elAttachEvent(item, _event, function (event) {
        elDetachEvent(item, _event);
        this.style[prefix("transition")] = "";
        if (callback) {
            callback.call(this);
        }
    });
}

// 给元素添加一段动画
function elAnimationDisplay(item, anim, callback) {
    var prop = prefix("animation"),
        _event = (prop == "animation") ? (prop + "end") : (prop + "End");
    item.style[prop] = anim;
    elAttachEvent(item, _event, function (event) {
        elDetachEvent(item, _event);
        this.style[prefix("animation")] = "";
        if (callback) {
            callback.call(this);
        }
    });
}

// ajax
function ajax(option) {
    var method = option.method || "POST",
        target = option.target,
        async = (option.async != null) ? option.async : true,
        form = option.form,
        onprogress = option.onprogress,
        onsuccess = option.onsuccess;

    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new window.XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.open(method, target, async);
    xhr.upload.onprogress = onprogress;
    xhr.send(form);

    xhr.onreadystatechange = function () {
        if ((xhr.readyState == 4) && (xhr.status == 200)) {
            if (onsuccess) {
                onsuccess(xhr);
            }
        }
    }
    
    return xhr;
}

// 返回添加好浏览器前缀的属性
function prefix(prop) {
    var div = document.createElement("div"),
        vendors = 'khtml O Moz Webkit'.split(" "),
        len = vendors.lengthl;
    
    if (prop in div.style) {
        return prop;
    }
    if ("-ms-" + prop in div.style) {
        return ("-ms-" + prop);
    }
    
    prop = prop.replace(/^[a-z]/, function (val) {
        return val.toUpperCase();
    });
    while (len--) {
        if ((vendors[len] + prop) in div.style) {
            return (vendors[len] + prop);
        }
    }
    
    return null;
}