var elFilterItems,
	elTimeaxis,
	elTimeaxisScrollBar,
	elTimeaxisWrapper,
	elTimeaxisItems,
	elNewItems,
    elPhotoInput,
    photoUpload,
    photoRemaining = 0,
	newItemHeight,
	scrollHeight,
    pageScrollHeight,
    isScroll = false,
    isChanging = false,
    isThemeChanging = false,
    isFooter = false,
    initY = 0,
    deltaY = 0,
    scrollY,
    scrollTarget,
    pageLoaded = false;
    pageMode = true,
    themeList = [ "theme-grass" ];

window.onload = function () {
	elFilterItems = document.getElementsByClassName("filter-item");
	elNewItems = document.getElementsByClassName("new-item");
	elTimeaxis = document.getElementsByClassName("timeaxis")[0];
	elTimeaxisScrollBar = document.getElementsByClassName("scroll-bar")[0];
	elTimeaxisWrapper = document.getElementsByClassName("timeaxis-wrapper")[0];
	elTimeaxisItems = document.getElementsByClassName("timeaxis-item");
    
    // 时间轴及日志等构造
    buildDay();
    buildDetailPhoto();

    if (elHasClass(document.body, "stranger") == -1) {
        elPhotoInput = document.getElementsByClassName("post-input-hide")[0];
    }

    // 判断当前显示方式
	if (document.body.offsetWidth > 700) {
		largeInit();
	}
	else {
		smallInit();
	}

    // 初始化图片插件
    // if (elHasClass(document.body, "stranger") == -1) {
    //     photoUpload = new _photoUpload();
    //     photoUpload.init("/post/");
    // }

    // dom加载完显示content
    document.getElementsByClassName("content")[0].style.opacity = "1";
    checkItems();
}

// 窗口大小改变时，调整
window.onresize = function () {
	if (pageMode) {
        adjustTimeaxisItem();
   		
        // 重新计算高度
        elTimeaxisScrollBar.parentElement.style.height = (document.body.offsetHeight - elTimeaxisWrapper.parentElement.offsetTop).toString() + "px";
        elTimeaxisWrapper.parentElement.style.height = (document.body.offsetHeight - elTimeaxisWrapper.parentElement.offsetTop).toString() + "px";
        pageScrollHeight = elTimeaxisWrapper.offsetHeight - document.body.offsetHeight + elTimeaxisWrapper.parentElement.offsetTop;
        
        if (pageScrollHeight <= 0) {
            if (elHasClass(elTimeaxisScrollBar.parentElement, "hide") == -1) {
                elAddClass(elTimeaxisScrollBar.parentElement, "hide");
            }
        }
        else {
            if (elHasClass(elTimeaxisScrollBar.parentElement, "hide") != -1) {
                elRemoveClass(elTimeaxisScrollBar.parentElement, "hide");
            }
        }

        scrollHeight = elTimeaxisWrapper.parentElement.style.height.replace(/px/, "") - elTimeaxisScrollBar.offsetHeight;

        var bkg = document.getElementsByClassName("timeaxis-background")[0],
            top = elTimeaxisWrapper.offsetHeight + elTimeaxisWrapper.offsetTop,
            h = +elTimeaxisWrapper.parentElement.style.height.replace(/px/, "") - top;
        if (h >= 236) {
            bkg.style.top = top.toString() + "px";
            bkg.style.height = h.toString() + "px";
            bkg.style.lineHeight = h.toString() + "px";
            bkg.style.display = "block";
        }
        else if (bkg.style.display != "none") {
            bkg.style.display = "none";
        }
        
        pageScroll(elTimeaxisWrapper.offsetTop, false);
    }

    // 显示内容改变
	if (!pageMode && (document.body.offsetWidth > 700)) {
		smallDest();
		largeInit();
	}
	else if (pageMode && (document.body.offsetWidth <= 700)) {
		largeDest();
		smallInit();
	}
}

// 鼠标滚动
window.onscroll = function () {
	if (!pageMode) {
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if (scrollTop >= newItemHeight) {
			if (elHasClass(elNewItems[0].parentElement, "active") == -1) {
				elAddClass(elNewItems[0].parentElement, "active");
			}
		}
		else if (elNewItems[0]) {
			elRemoveClass(elNewItems[0].parentElement, "active");
		}
	}
}

// 清除所有js添加的css
function resetStyle() {
	var nodes = elTimeaxisWrapper.parentElement.getElementsByTagName("*");
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].style.cssText = "";
	}

    document.getElementsByClassName("frame")[0].style.cssText = "";
}

// 大屏初始化
function largeInit () {
	resetStyle();

	pageMode = true;
    document.addEventListener("DOMMouseScroll", onMouseWheel);
    elAttachEvent(document, "mousewheel", onMouseWheel);

    for (var i = 0; i < elFilterItems.length; i++) {
        elAttachEvent(elFilterItems[i], "click", filterItem);
    }

    changeModuleDescription.call(document.getElementsByClassName("module-item-description")[0]);
    changeModuleDate.call(document.getElementsByClassName("module-item-date")[0]);

    if (pageLoaded) {
        window.onresize();
    }
    adjustTimePoint();

    if (elHasClass(document.body, "stranger") != -1) {
        return;
    }

    var hook = document.getElementsByClassName("hook")[0];
    hook.style.top = "-224px";
    elTransitionDisplay(hook, "all 1s ease");

    for (var i = 0; i < elNewItems.length; i++) {
        elAttachEvent(elNewItems[i], "click", newItem);
    }

    var elPostText = document.getElementsByClassName("post-text");
    for (var i = 0; i < elPostText.length; i++) {
        elAttachEvent(elPostText[i], "keyup", changePostText);
        elAttachEvent(elPostText[i], "mousemove", changePostText);
    }

    elAttachEvent(elPhotoInput, "change", newPhotoPost);

    elAttachEvent(document.getElementsByClassName("module-item-description")[0], "keyup", changeModuleDescription);
    elAttachEvent(document.getElementsByClassName("module-item-date")[0], "keyup", changeModuleDate);
    elAttachEvent(elNewItems[3].getElementsByClassName("list-item-input")[0], "change", changeAvatar);
    //elAttachEvent(elNewItems[3].getElementsByClassName("list-item-username")[0], "keyup", changeUsername);

   	//elTimeaxisWrapper.parentElement.style.height = (document.body.offsetHeight - elTimeaxisWrapper.parentElement.offsetTop).toString() + "px";
    //scrollHeight = elTimeaxisScrollBar.parentElement.offsetHeight - elTimeaxisScrollBar.offsetHeight;
}

// 删除大屏的。。
function largeDest() {
	document.removeEventListener("DOMMouseScroll", onMouseWheel);
	elDetachEvent(document, "mousewheel", onMouseWheel);

    for (var i = 0; i < elFilterItems.length; i++) {
        elDetachEvent(elFilterItems[i], "click", filterItem);
    }

    if (elHasClass(document.body, "stranger") != -1) {
        return;
    }

    for (var i = 0; i < elNewItems.length; i++) {
        elDetachEvent(elNewItems[i], "click", newItem);
    }

    var elPostText = document.getElementsByClassName("post-text");
    for (var i = 0; i < elPostText.length; i++) {
        elDetachEvent(elPostText[i], "keyup", changePostText);
        elDetachEvent(elPostText[i], "mousemove", changePostText);
    }

    var hook = document.getElementsByClassName("hook")[0];
    hook.style.top = "-336px";
    elTransitionDisplay(hook, "all 1s ease");

    elDetachEvent(elPhotoInput, "change", newPhotoPost);

    elDetachEvent(document.getElementsByClassName("module-item-description")[0], "keyup", changeModuleDescription);
    elDetachEvent(document.getElementsByClassName("module-item-date")[0], "keyup", changeModuleDate);
    elDetachEvent(elNewItems[3].getElementsByClassName("list-item-input")[0], "change", changeAvatar);
    //elDetachEvent(elNewItems[3].getElementsByClassName("list-item-username")[0], "keyup", changeUsername);
}

// 小屏初始化
function smallInit() {
	resetStyle();

	pageMode = false;
    window.onscroll();
	//newItemHeight = elGetOffsetTop(elNewItems[0].parentElement);
}

// 删除小屏的。。
function smallDest() {

}

// 鼠标拖动滚动条 以下
document.onmousedown = function (event) {
    var obj = event.srcElement ? event.srcElement : event.target;
    if (pageMode && (elHasClass(obj, "scroll-bar") != -1)) {
        isScroll = true;
        scrollY = event.pageY;
        scrollTarget = obj;
        elAddClass(elTimeaxisScrollBar.parentElement, "active");
    }
    else if (pageMode && (elHasClass(obj, "post-scroll-bar") != -1)) {
        isScroll = true;
        scrollY = event.pageY;
        scrollTarget = obj;
    }
    else if (pageMode && !isThemeChanging && (elHasClass(obj, "hook") != -1)) {
        dragRope();
        initY = event.pageY;
        event.preventDefault();
        return false;
    }
    else if (elHasClass(obj, "hook") != -1) {
        event.preventDefault();
        return false;
    }
}

document.onmousemove = function (event) {
    if (isScroll && (elHasClass(scrollTarget, "scroll-bar") != -1)) {
        var value = event.pageY - scrollY;
        value += Number(elTimeaxisScrollBar.style.top.replace(/px/, ""));
        if (value > scrollHeight) {
            value = scrollHeight;
        }
        else if (value < 0) {
            value = 0;
        }

        pageScroll(value, true);
        scrollY = event.pageY;
        event.preventDefault();
    }
    else if (isScroll) {
        var value = event.pageY - scrollY;
        itemScroll.call(scrollTarget, value, true);
        scrollY = event.pageY;
        event.preventDefault();
    }
    else if (isChanging) {
        var h = document.body.offsetHeight * 0.1;
        deltaY = event.pageY - initY;
        if (deltaY < 0) {
            deltaY = 0;
        }
        else if (deltaY > h) {
            deltaY = h;
        }
        document.getElementsByClassName("hook")[0].style.top = (deltaY - 224).toString() + "px";
        animBackground(deltaY / h);

        if (deltaY == h) {
            isThemeChanging = true;
            releaseRope(false);
            animThemeChanging();
        }
        event.preventDefault();
        return false;
    }
}

document.onmouseup = function () {
    if (isScroll) {
        isScroll = false;
        elRemoveClass(elTimeaxisScrollBar.parentElement, "active");
    }
    else if (isChanging) {
        releaseRope();
        animFrameRestore();
    }
}
// 鼠标拖动滚动条 以上


// 
document.onclick = function (event) {
    var obj = event.srcElement ? event.srcElement : event.target;
    if (elHasClass(obj, "top") != -1) {
        pageScroll(0);
    }
    else if (elHasClass(obj, "detail-control") != -1) {
        var show, hide;
        if (obj.innerHTML == "显示全部︾") {
            show = obj.parentElement.parentElement.getElementsByClassName("full");
            hide = obj.parentElement.parentElement.getElementsByClassName("preview");
            obj.innerHTML = "收起︽";
        }
        else {
            hide = obj.parentElement.parentElement.getElementsByClassName("full");
            show = obj.parentElement.parentElement.getElementsByClassName("preview");
            obj.innerHTML = "显示全部︾";
        }
        for (var i = 0; i < show.length; i++) {
            show[i].style.display = "block";
        }
        for (var i = 0; i < hide.length; i++) {
            hide[i].style.display = "none";
        }
        //show[show.length - 1].appendChild(obj);
        adjustTimePoint();
    }
    else if (elHasClass(obj, "post-send") != -1) {
    	newPost.call(obj, obj.parentElement.className.split(" ")[1]);
    }
    else if (elHasClass(obj, "item-remove") != -1) {
        var form = new FormData();
        form.append("option", "remove");
        form.append("sid", obj.getAttribute("sid"));
        ajax({
            target: "/delete/",
            form: form,
            onsuccess: function () {
                var item;
                if (elHasClass(obj, "item") != -1) {
                    item = obj.parentElement.parentElement.parentElement.parentElement;
                }
                else {
                    item = obj.parentElement;
                }
                item.parentElement.removeChild(item);
                checkItems();

                if (elHasClass(obj, "item") == -1) {
                    updateComment(item.parentElement.parentElement.parentElement.parentElement);
                }
                window.onresize();
                pageScroll(elTimeaxisWrapper.style.top.replace(/px/, ""), false);
            }
        });
    }
    else if (elHasClass(obj, "detail-comment") != -1) {
        var item = obj.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("item-comment")[0];
        if (elHasClass(item, "hide") == -1) {
            elAddClass(item, "hide");
        }
        else {
            elRemoveClass(item, "hide");
        }
        window.onresize();
        pageScroll(elTimeaxisWrapper.style.top.replace(/px/, ""), false);
    }
    else if (elHasClass(obj, "item-submit") != -1) {
        var form = new FormData(),
            sid = obj.parentElement.parentElement.getAttribute("sid"),
            time = timeNow();
        form.append("type", "comment");
        form.append("sid", sid);
        form.append("author", document.getElementsByClassName("user-name")[0].innerHTML);
        form.append("content", obj.previousElementSibling.value);
        form.append("time", time);
        ajax({
            target: "/post/",
            form: form,
            onsuccess: function (xhr) {
                var content = xhr.responseText;
                if (content.length > 0) {
                    insertComment(sid, content);
                }
                obj.previousElementSibling.value = "";
            }
        });
    }
}

// 开始拖动钩子
function dragRope() {
    var frame = document.getElementsByClassName("frame")[0];
    frame.children[0].style.borderRadius = "10px";

    if (isFooter) {
        frame.style.overflow = "";
        isFooter = false;
    }

    var fake = document.createElement("div");
    if (elHasClass(frame, "theme-grass") == -1) {
        fake.className = "frame-fake theme-grass";
    }
    else {
        fake.className = "frame-fake";
    }
    fake.innerHTML = "<div class=\"background\"></div>";
    fake.children[0].style.borderRadius = "10px";
    document.body.insertBefore(fake, frame);

    if (frame.style.top == "-180px") {
        animHideFooter();
    }

    isChanging = true;
    isThemeChanging = true;
}

// 结束拖动钩子
function releaseRope(mode) {
    var hook = document.getElementsByClassName("hook")[0];
    hook.style.top = "-224px";
    elTransitionDisplay(hook, "all ease 1s");

    isChanging = false;
}

function animFrameRestore() {
    var frame = document.getElementsByClassName("frame")[0],
        fake = document.getElementsByClassName("frame-fake")[0];

    frame.children[0].style.cssText = "";
    frame.style.cssText = "";
    elTransitionDisplay(frame, "all 1s ease");

    fake.style.top = "-80%";
    elTransitionDisplay(fake, "all 1s ease", function () {
        fake.parentElement.removeChild(fake);
        isThemeChanging = false;

        window.onresize();
    });
}

// 拖动钩子时的背景变化
function animBackground(per) {
    var frame = document.getElementsByClassName("frame")[0],
        fake = frame.previousElementSibling;
    frame.style[prefix("transform")] = "scale(" + (1 - 0.4 * per).toString() + ")";
    frame.style.top = (15 * per).toString() + "%";
    fake.style.top = (15 * per - 80).toString() + "%";
}

// 两个背景的移动
function animThemeChanging() {
    var frame = document.getElementsByClassName("frame")[0],
        fake = frame.previousElementSibling;
    frame.style.top = "80%";
    elTransitionDisplay(frame, "all 2s ease");

    fake.style.top = "0%";
    elTransitionDisplay(fake, "all 2s ease", animThemeScaleReset);
}

// fake与frame的交换内容
function animThemeScaleReset() {
    var frame = document.getElementsByClassName("frame")[0],
        fake = document.getElementsByClassName("frame-fake")[0],
        elContent = document.getElementsByClassName("content")[0],
        elFooter = document.getElementsByClassName("footer")[0],
        elMain = document.getElementsByClassName("main")[0],
        elSide = document.getElementsByClassName("side")[0];
    elMain.style.cssText = "";
    elSide.style.cssText = "";
    fake.appendChild(elContent);
    fake.appendChild(elFooter);
    frame.parentElement.removeChild(frame);

    elRemoveClass(fake, "frame-fake");
    elAddClass(fake, "frame");

    fake.children[0].style.cssText = "";
    elTransitionDisplay(fake.children[0], "all 1s ease");

    //fake.style[prefix("transform")] = "scale(1)";
    fake.cssText = "";
    elTransitionDisplay(fake, "all 1s ease", function () {
        var form = new FormData();
        form.append("option", "theme");
        form.append("username", document.getElementsByClassName("user-name")[0].innerHTML);
        if (elHasClass(fake, "theme-grass") == -1) {
            form.append("new", "default");
        }
        else {
            form.append("new", "theme-grass");
        }
        ajax({
            target: "/option/",
            form: form
        });

        isThemeChanging = false;
        animShowContent();
    });
}

// side和main显示动画
function animShowContent() {
    var elMain = document.getElementsByClassName("main")[0],
        elSide = document.getElementsByClassName("side")[0];
    elSide.style.cssText = "";
    elSide.style.opacity = "1";
    elAnimationDisplay(elSide, "leftFadeIn 1s ease both", function () {
        window.onresize();
    });
    elMain.style.cssText = "";
    elMain.style.opacity = "1";
    elMain.style[prefix("transform")] = "translate(0%) scale(1, 1)";
    elTransitionDisplay(elMain, "all 1s ease", function () {
        window.onresize();
    });
}

// footer显示动画
function animShowFooter() {
    var frame = document.getElementsByClassName("frame")[0];
    frame.style.top = "-180px";
    frame.style.overflow = "visible";
    elTransitionDisplay(frame, "all 1s ease");
    isFooter = true;
}

// footer隐藏动画
function animHideFooter() {
    var frame = document.getElementsByClassName("frame")[0];
    frame.style.top = "";
    elTransitionDisplay(frame, "all 0.5s ease", function () {
        frame.style.overflow = "";
    });
    isFooter = false;
}

// 插入评论
function insertComment(sid, content) {
    var piece = document.createElement("div");
    piece.className = "comment-piece";
    piece.innerHTML = content;

    for (var i = 0; i < elTimeaxisItems.length; i++) {
        if (elTimeaxisItems[i].getAttribute("sid") == sid) {
            var comment = elTimeaxisItems[i].getElementsByClassName("item-comment")[0];
            comment.insertBefore(piece, comment.lastElementChild);
            window.onresize();
            pageScroll(elTimeaxisWrapper.style.top.replace(/px/, ""), false);
            updateComment(elTimeaxisItems[i]);
            return;
        }
    }
}

// 更新评论数量
function updateComment(item) {
    if (elHasClass(document.body, "stranger") != -1) {
        return;
    }
    var detail = item.getElementsByClassName("detail-comment")[0],
        count = item.getElementsByClassName("comment-piece").length;
    detail.innerHTML = "评论";
    if (count > 0) {
        detail.innerHTML += "(" + count.toString() + ")"
    }
}

// 时间格式处理
function getDate(time) {
    var date = time.split(" ")[0].split("-");
    while (date[0].length < 4) {
        date[0] = "0" + date[0];
    }
    if (date[1].length < 2) {
        date[1] = "0" + date[1];
    }
    if (date[2].length < 2) {
        date[2] = "0" + date[2];
    }
    return date.join("");
}

// 插入日志、留言或照片
function insertItem(time, type, content) {
    var item = document.createElement("div"),
        value = getDate(time);
    if ((elTimeaxisWrapper.children.length > 0) && (elTimeaxisWrapper.children[0].getAttribute("value") == value)) {
        elTimeaxisWrapper.children[0].insertBefore(item, elTimeaxisWrapper.children[0].children[0]);
    }
    else {
        createDate(value).appendChild(item);
    }
    item.outerHTML = content;
    if (type == "photo") {
        buildDetailPhoto(elTimeaxisWrapper.children[0].children[0].getElementsByClassName("detail-photo")[0]);
    }
    adjustPostTop();
    window.onresize();
    pageScroll(elTimeaxisWrapper.style.top.replace(/px/, ""), false);
}

// 页面滚动
function pageScroll(x, mode) {
    var v1, v2;
    if (mode) {
        v2 = x;
        v1 = -x * (pageScrollHeight / scrollHeight);
    }
    else {
        v1 = x;
        v2 = -x * (scrollHeight / pageScrollHeight);
    }
    if ((elHasClass(elTimeaxisScrollBar.parentElement, "hide") != -1) || ((v2 == scrollHeight) && (document.getElementsByClassName("frame")[0].style.top != "-180px"))) {
        animShowFooter();
    }
    else if ((elHasClass(elTimeaxisScrollBar.parentElement, "hide") == -1) && (v2 < scrollHeight) && (document.getElementsByClassName("frame")[0].style.top == "-180px")) {
        animHideFooter();
    }

    elTimeaxisWrapper.style.top = v1 + "px";
    elTimeaxisScrollBar.style.top = v2 + "px";

    adjustTimePoint();
}

//新留言中滚动模块
function itemScroll(value, mode, calc) {
    var item = this.previousElementSibling,
        itemHeight = item.scrollHeight - item.offsetHeight,
        targetBorder = Number(window.getComputedStyle(this.parentElement, null).borderWidth.replace(/px/, "")),
        targetMarginTop = Number(window.getComputedStyle(this, null).marginTop.replace(/px/, "")),
        targetHeight = this.parentElement.offsetHeight - this.offsetHeight - targetMarginTop * 2 - targetBorder * 2,
        v1, v2;
    if (mode) {
        if (!calc) {
            v1 = +value + +this.style.top.replace(/px/, "");
        }
        else {
            v1 = +value;
        }
        if (v1 > targetHeight) {
            v1 = targetHeight;
        }
        else if (v1 < 0) {
            v1 = 0;
        }
        v2 = v1 * itemHeight / targetHeight;
    }
    else {
        if (!calc) {
            v2 = item.scrollTop + +value;
        }
        else {
            v2 = +value;
        }
        if (v2 > itemHeight) {
            v2 = itemHeight;
        }
        else if (v2 < 0) {
            v2 = 0;
        }
        v1 = v2 * targetHeight / itemHeight;
    }

    this.style.top = v1.toString() + "px";
    item.scrollTop = v2;
}

// 鼠标滚动
function onMouseWheel(event) {
    var obj = event.srcElement ? event.srcElement : event.target;
    if (isScroll || (pageScrollHeight < 0)) {
        return;
    }

    var value = event.wheelDelta ? event.wheelDelta / 4 : event.detail * (-10);

    var target = isPtInRect(event, "scroll-area");
    if (target) {
        itemScroll.call(target.getElementsByClassName("post-scroll-bar")[0], -value, false);
        return;
    }

    value += +elTimeaxisWrapper.style.top.replace(/px/, "");
    if (value > 0) {
        value = 0;
    }
    else if (value + pageScrollHeight < 0) {
        value = -pageScrollHeight;
    }

    pageScroll(value, false);
}

//新留言等输入框内容改变，判断是否出现滚动条
function changePostText(event) {
    if (this.scrollHeight > this.offsetHeight) {
        if (elHasClass(this.parentElement, "active") == -1) {
            elAddClass(this.parentElement, "active");
        }
        itemScroll.call(this.nextElementSibling, this.scrollTop, false, true);
    }
    else {
        if (elHasClass(this.parentElement, "active") != -1) {
            elRemoveClass(this.parentElement, "active");
        }
    }
}

// 纪念日描述修改
function changeModuleDescription() {
    var item = document.createElement("p"),
        form = new FormData();
    item.className = "module-item-type";
    item.innerHTML = this.value;
    item.style.display = "inline-block";
    this.parentElement.parentElement.appendChild(item);
    this.style.width = +window.getComputedStyle(item, null)["width"].replace(/px/, "") + 5 + "px";
    this.parentElement.parentElement.removeChild(item);

    if (this.value == this.getAttribute("last")) {
        return;
    }
    this.setAttribute("last", this.value);

    if (elHasClass(document.body, "stranger") == -1) {
        form.append("option", "name_mem");
        form.append("new", this.value);
        ajax({
            target: "/option/",
            form: form
        });
    }
}

// 纪念日日期修改
function changeModuleDate() {
    var item = document.createElement("p");
    item.className = "module-item-date";
    item.innerHTML = this.value;
    item.style.display = "inline-block";
    this.parentElement.parentElement.appendChild(item);
    this.style.width = +window.getComputedStyle(item, null)["width"].replace(/px/, "") + 5 + "px";
    this.parentElement.parentElement.removeChild(item);

    if (this.value == this.getAttribute("last")) {
        return;
    }
    this.setAttribute("last", this.value);

    if (elHasClass(document.body, "stranger") == -1) {
        var form = new FormData();
        form.append("option", "date_mem");
        form.append("new", this.value);
        ajax({
            target: "/option/",
            form: form,
            onsuccess: function (xhr) {
                if (xhr.responseText.length > 0) {
                    document.getElementsByClassName("module-item-year")[0].innerHTML = xhr.responseText.split("\n")[0];
                    document.getElementsByClassName("module-item-digit")[0].innerHTML = xhr.responseText.split("\n")[1];
                }
            }
        });
    }
}

// 新建day和point
function createDate(date) {
    var elDate = document.createElement("div"),
        elTimePoint = document.createElement("div"),
        month = +date.slice(4, 6) - 1;
        day = (+date.slice(-2, 8)) % 100,
        map = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    elDate.className = "timeaxis-day";
    elDate.setAttribute("value", date);
    elTimeaxisWrapper.insertBefore(elDate, elTimeaxisWrapper.children[0]);

    elTimePoint.className = "timeaxis-point";
    elTimePoint.innerHTML = map[month] + "<br />" + ((day < 10) ? ("0" + day.toString()) : day.toString());
    if (elTimeaxis.children.length == 1) {
        elTimeaxis.appendChild(elTimePoint);
    }
    else {
        elTimeaxis.insertBefore(elTimePoint, elTimeaxis.children[1]);
    }

    return elDate;
}

// 根据items添加day和point
function buildDay() {
    var day = "",
        elDay,
        item = "",
        len = elTimeaxisItems.length - 1,
        cnt = 0,
        elComment = document.getElementsByClassName("comment-piece");
    for (var i = 0; i <= len; i++) {
        item = elTimeaxisItems[len].getAttribute("value");
        if (day != item) {
            elDay = createDate(item);
            day = item;
        }
        if (elDay.children.length)
        {
            elDay.insertBefore(elTimeaxisItems[len], elDay.children[0]);
        }
        else {
            elDay.appendChild(elTimeaxisItems[len]);
        }
        for (var j = elComment.length - 1; j >= 0; j--) {
            if (elComment[j].getAttribute("parent") == elTimeaxisItems[len].getAttribute("sid")) {
                cnt++;
                var comment = elTimeaxisItems[len].getElementsByClassName("item-comment")[0];
                comment.insertBefore(elComment[j], comment.lastElementChild);
            }
        }
        updateComment(elTimeaxisItems[len]);
    }
}

// 解析图片src并添加
function buildDetailPhoto(x) {
    if (x) {
        var list, node;
        list = x.innerHTML.split(";");
        x.innerHTML = "";
        for (var j = 0; j < list.length; j++) {
            if (list[j].length > 0) {
                photoRemaining++;
                node = document.createElement("img");
                node.className = "item-photo";
                node.setAttribute("src", list[j]);
                x.parentElement.insertBefore(node, x);
                node.onload = photoLoaded;
            }
        }
        x.parentElement.removeChild(x);
        return;
    }

    var item = document.getElementsByClassName("detail-photo");
    if (item.length == 0) {
        photoRemaining = 1;
        photoLoaded();
    }

    var len = item.length;
    for (var i = 0; i < len; i++) {
        buildDetailPhoto(item[0]);
    }
}

// 判断图片是否全部加载完毕
function photoLoaded() {
    if ((--photoRemaining) == 0) {
        // 重新调整页面
        window.onresize();

        // 删除loading，显示内容
        if (!pageLoaded) {
            var elLoading = document.getElementsByClassName("loading")[0];
            elAnimationDisplay(elLoading, "fadeScaleOut 0.5s ease both", function () {
                elLoading.parentElement.removeChild(elLoading);
                animShowContent();
            });
            pageLoaded = true;

            if (elHasClass(document.body, "stranger") == -1) {
                var hook = document.getElementsByClassName("hook")[0];
                hook.style.top = "-224px";
                elTransitionDisplay(hook, "all 1s ease");
            }
        }
    }
}

// 设置修改
function changeOption(obj) {
    if (elHasClass(obj, "option-list-item") == -1) {
        obj = obj.parentElement;
    }
    if (elHasClass(obj, "permission") != -1) {
        var form = new FormData();
        form.append("option", "permission");
        ajax({
            target: "/option/",
            form: form,
            onsuccess: function () {
                var item = obj.getElementsByClassName("list-item-check")[0];
                if (elHasClass(item, "allow") == -1) {
                    elAddClass(item, "allow");
                }
                else {
                    elRemoveClass(item, "allow");
                }
            }
        });
    }
    else if (elHasClass(obj, "logout") != -1) {
        var form = new FormData();
        form.append("option", "logout");
        ajax({
            target: "/option/",
            form: form,
            onsuccess: function () {
                window.location.href = "/login/";
            }
        })
    }
}

// 修改头像
function changeAvatar() {
    var form = new FormData(),
        item = this;
    form.append("option", "avatar");
    form.append("username", document.getElementsByClassName("user-name")[0].innerHTML);
    form.append("avatar", item.files.item(0));
    ajax({
        target: "/option/",
        form: form,
        onsuccess: function () {
            document.getElementsByClassName("user-avatar")[0].children[0].setAttribute("src", window.URL.createObjectURL(item.files.item(0)));
        }
    });
}

// 修改用户名
function changeUsername(event) {
    var key = (window.event) ? event.keyCode : event.which;
    if (key != 13) {
        return;
    }

    var form = new FormData(),
        item = this;
    form.append("option", "username");
    form.append("old", document.getElementsByClassName("user-name")[0].innerHTML);
    form.append("new", item.value);
    ajax({
        target: "/option/",
        form: form,
        onsuccess: function () {
            document.getElementsByClassName("user-name")[0].innerHTML = item.value;
        }
    });
}

// 新留言等点击
function newItem(event) {
	var elOld = this.parentElement.getElementsByClassName("active")[0],
		elNew = this.parentElement.getElementsByClassName(this.getAttribute("value"))[1];
    if (elHasClass(this, "option") != -1) {
        var obj = event.srcElement ? event.srcElement : event.target;
        changeOption(obj);
        window.onresize();
        return;
    }
    else if (this.getAttribute("value") == "photo") {
        var event = document.createEvent("MouseEvent");
        event.initEvent("click", true, true);
        return elNew.children[0].dispatchEvent(event);
    }
	elRemoveClass(elOld, "active");
    if (elOld != elNew) {
    	elAddClass(elNew, "active");
    }
    adjustPostTop();
    window.onscroll();
}

// 日志留言等筛选
function filterItem() {
    var items = document.getElementsByClassName("timeaxis-item"),
        value = this.getAttribute("value");
    if (elHasClass(this, "active") == -1) {
        elAddClass(this, "active");
        for (var i = 0; i < items.length; i++) {
            if (elHasClass(items[i], value) != -1) {
                items[i].style.display = "block";
                if (items[i] == items[i].parentElement.lastElementChild) {
                    items[i].style.marginBottom = "20px";
                }
                else {
                    items[i].style.marginBottom = "15px";
                }
            }
        }
    }
    else {
        elRemoveClass(this, "active");
        for (var i = 0; i < items.length; i++) {
            if (elHasClass(items[i], value) != -1) {
                items[i].style.display = "none";
                items[i].style.marginBottom = "0";
            }
        }
    }

    window.onresize();
    pageScroll(0, false);
    event.stopPropagation();
}

// 调整日志等顶部高度
function adjustPostTop(x) {
    if (elHasClass(document.body, "stranger") != -1) {
        return;
    }

    var active = elNewItems[0].parentElement.getElementsByClassName("active")[0],
        height = active ? (active.offsetHeight + 10) : 0,
        style = "translateY(" + (height + 142.5).toString() + "px)",
        points = elTimeaxis.getElementsByClassName("timeaxis-point");
    if (x) {
        points[x + 1].style[prefix("transform")] = style;
        return;
    }
    for (var i = 1; i < points.length; i++) {
        if (elHasClass(points[i], "top") == -1) {
          points[i].style[prefix("transform")] = style;
        }
    }
    elTimeaxisWrapper.parentElement.style.top = (height + 260).toString() + "px";
    elTransitionDisplay(elTimeaxisWrapper.parentElement, "all 1.5s ease", function () {
        elTransitionDisplay(elTimeaxisWrapper.parentElement, "all 2s ease");
        window.onresize();
    });
}

// 调整时间轴point位置
function adjustTimePoint() {
    var points = document.getElementsByClassName("timeaxis-point"),
        days = document.getElementsByClassName("timeaxis-day"),
        value = 0;
    adjustTimeaxisItem();
    for (var i = 0; i < days.length; i++) {
        if (days[i].offsetHeight == 0) {
            points[i + 1].style.display = "none";
        }
        else {
            points[i + 1].style.display = "block";
        }

        value = days[i].offsetTop + +elTimeaxisWrapper.style.top.replace(/px/, "");
        if ((value + days[i].offsetHeight) <= 0) {
            if ((elHasClass(points[i + 1], "top") == -1) && (points[i + 1].style.display != "none")) {
                elAddClass(points[i + 1], "top");
                points[i + 1].style.cssText = "";
            }
        }
        else if (elHasClass(points[i + 1], "top") != -1) {
            elRemoveClass(points[i + 1], "top");
            adjustPostTop(i);
        }
        if (value < 0) {
            value = 0;
        }
        
        if (elHasClass(points[i + 1], "top") == -1) {
            points[i + 1].style.top = value + "px";
        }
        else {
            points[i + 1].style.top = "";
        }
    }
}

// 调整日志等item
function adjustTimeaxisItem() {
    for (var i = 0; i < elTimeaxisItems.length; i++) {
        if (elTimeaxisItems[i].style.display != "none") {
            var item = elTimeaxisItems[i],
                border = item.getElementsByClassName("item-border")[0],
                wrapper = border.getElementsByClassName("item-wrapper")[0];
            item.style.height = wrapper.offsetHeight + "px";
            border.style.height = item.style.height;
        }
    }

    var dmin = 0, imin = 0;
    for (var i = 0; i < elTimeaxisItems.length; i++) {
        if (elTimeaxisItems[i].style.display != "none") {
            var d = (elGetOffsetTop(elTimeaxisItems[i], elTimeaxisWrapper.offsetParent) + elTimeaxisItems[i].offsetHeight) / elTimeaxisItems[i].offsetHeight;
            if ((d > 1) || (elTimeaxisItems[i].offsetHeight >= elTimeaxisWrapper.parentElement.offsetHeight)) {
                d = 1;
            }
            else if (d < 0) {
                d = 0;
            }
            elTimeaxisItems[i].style.opacity = d;
            elTimeaxisItems[i].getElementsByClassName("item-border")[0].style.height = (elTimeaxisItems[i].offsetHeight * d).toString() + "px";

            if ((d > 0) && (d < 1)) {
                dmin = d;
                imin = i;
            }
        }
    }

    var hover = document.getElementsByClassName("timeaxis-hover")[0];
    if (dmin == 0) {
        hover.style.opacity = "0";
    }
    else {
        var h = elTimeaxisItems[imin].offsetHeight * dmin;
        if (h > 98) {
            h = 98;
        }
        //hover.style.height = h.toString() + "px";
        hover.style.opacity = "1";
    }
}

// ...
String.prototype.filterFirstSpace = function() {
	var i = -1;
	while (this[++i] == " ");
	return this.slice(i, this.length);
}

// 处理用户输入数据
function packPost(post, className) {
    var lines = post.split("\n"),
    	result = "";
    for (var i = 0; i < lines.length; i++) {
    	if (lines[i].length > 0) {
    		result += "<p class=\"" + className + "\">" + lines[i].replace(/ /g, "&nbsp;") + "</p>";
    	}
    }
    return result;
}

// 返回当前时间
function timeNow() {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ";" + date.getSeconds();
    return time;
}

// 新留言等
function newPost(type) {
	var form = new FormData(),
		author = document.getElementsByClassName("user-name")[0].innerHTML,
		content = "",
        time = timeNow(),
        list;
	if (type == "message") {
		content = packPost(this.nextElementSibling.children[0].value, "detail-info");
        this.nextElementSibling.children[0].value = "";
	}
	else if (type == "diary") {
		content = "<p class=\"detail-title\">" + this.parentElement.getElementsByClassName("post-title-input")[0].value + "</p>\n";
		content += packPost(this.parentElement.getElementsByClassName("post-text")[0].value, "detail-text full");
        this.parentElement.getElementsByClassName("post-title-input")[0].value = "";
        this.parentElement.getElementsByClassName("post-text")[0].value = "";
    }
    else {
        list = photoUpload.getPhotoList();
        for (var i = 0; i < list.length; i++) {
            form.append("photo", list[i].file);
        }
        photoUpload.removeAll();
    }

	form.append("author", author);
    form.append("type", type);
    form.append("content", content);
    form.append("time", time);
    
    ajax({
    	method: "POST",
        target: "/post/",
        async: true,
        form: form,
        onsuccess: function (xhr) {
            insertItem(time, type, xhr.responseText);

            var filter = document.getElementsByClassName("filter-item");
            for (var i = 0; i < filter.length; i++) {
                if ((filter[i].getAttribute("value") == type) && (elHasClass(filter[i], "active") == -1)) {
                    filterItem.call(filter[i]);
                }
            }
            window.onresize();
            pageScroll(0, false);

            checkItems();
        }
    });
}

// 新图片等
function newPhotoPost() {
    var form = new FormData(),
        author = document.getElementsByClassName("user-name")[0].innerHTML,
        content = "",
        type = "photo"
        time = timeNow();

    form.append("photo", elPhotoInput.files[0]);
    form.append("author", author);
    form.append("type", type);
    form.append("content", content);
    form.append("time", time);
    
    ajax({
        method: "POST",
        target: "/post/",
        async: true,
        form: form,
        onsuccess: function (xhr) {
            insertItem(time, type, xhr.responseText);

            var filter = document.getElementsByClassName("filter-item");
            for (var i = 0; i < filter.length; i++) {
                if ((filter[i].getAttribute("value") == type) && (elHasClass(filter[i], "active") == -1)) {
                    filterItem.call(filter[i]);
                }
            }
            window.onresize();
            pageScroll(0, false);

            checkItems();

            var input = document.createElement("input");
            input.className = "post-input-hide";
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/png, image/gif, image/jpeg");

            elPhotoInput.parentElement.insertBefore(input, elPhotoInput);
            elPhotoInput.parentElement.removeChild(elPhotoInput);
            elPhotoInput = input;

            elAttachEvent(elPhotoInput, "change", newPhotoPost);
        }
    });
}

// 判断日志内容等是否被清空
function checkItems() {
    var bkg = document.getElementsByClassName("timeaxis-background")[0];
    if (elTimeaxisItems.length == 0) {
        bkg.setAttribute("value", "no-active");
    }
    else {
        bkg.setAttribute("value", "active");
    }
}