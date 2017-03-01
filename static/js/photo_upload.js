

;(function (window, document) {
    var elUpload,
        elInput, 
        elList, 
        elAdd,
        elSend,
        elInfo,
        elProgress,
        elRemove,
        list,
        inputName,
        targetURL,
        isSend;

    _photoUpload = function () {
        return this;
    }

    // 初始化
    _photoUpload.prototype.init = function (target, name) {
        targetURL = target;
        inputName = name || "file[]";

        elUpload = document.getElementsByClassName("new-post")[2];
        
        elAdd = elUpload.getElementsByClassName("post-list-add")[0];
        elAttachEvent(elAdd, "click", add);

        elInput = elUpload.getElementsByClassName("post-input-hide")[0];
        elAttachEvent(elInput, "change", added);

        elList = elUpload.getElementsByClassName("post-list")[0];
        elAttachEvent(elList, "click", listClick)

        list = new Array();
    }

    // 返回选择的图片
    _photoUpload.prototype.getPhotoList = function () {
        return list;
    }

    _photoUpload.prototype.removeAll = function () {
        list = new Array();
        while (elList.children[0] != elAdd) {
            elList.removeChild(elList.children[0]);
        }
    }

    // 弹出选择文件对话框
    function add() {
        var event = document.createEvent("MouseEvent");
        event.initEvent("click", true, true);
        return elInput.dispatchEvent(event);
    }

    // 记录选择的图片
    function added() {
        var i, item, img, info, sid;
        for (i = 0; i < this.files.length; i++) {
            sid = Math.floor(Math.random() * 1000000);
            list.push({ name: this.files.item(i).name, sid: sid, file: this.files.item(i) });

            item = document.createElement("div");
            item.className = "post-list-item";
            item.setAttribute("sid", sid);
            item.style.backgroundImage = "url(" + window.URL.createObjectURL(this.files.item(i)) + ")";
            
            elList.insertBefore(item, elAdd);
            changePostText.call(elList);
        }
        elInputReset();
    }
    
    // 图片删除
    function fileRemove(para) {
        if (typeof para == "string") {
            for (var i = 0; i < list.length; i++) {
                if (list[i].sid == para) {
                    list.splice(i, 1);
                    return;
                }
            }
        }
        else {
            fileRemove(para.getAttribute("sid"));
            para.parentElement.removeChild(para);
        }
    }

    // 图片删除
    function listClick(event) {
        var obj = event.srcElement ? event.srcElement : event.target;
        if (obj.className == "post-list-item") {
            fileRemove(obj)
        }
    }

    // 重置input
    function elInputReset() {
        var node = document.createElement("input");
        node.setAttribute("class", "post-input-hide");
        node.setAttribute("type", "file");
        node.setAttribute("multiple", "multiple");

        elUpload.replaceChild(node, elInput);

        elInput = node;
        elInput.onchange = added;
    }

    // 以下 too old
    function fileSend() {
        var form = new FormData();
        for (var i = 0; i < fileList.length; i++) {
            form.append("file[]", list[i].file);
        }
        ajax({
            method: "POST",
            target: targetURL,
            async: true,
            form: form,
            onprogress: fileSendProgress,
            onsuccess: fileSendSuccess
        });

        isFileSend = true;
    }

    function fileSendProgress(event) {
        //elFileProgress.style.width = (event.loaded / event.total * 100).toString() + "%";
    }

    function fileSendSuccess(xhr) {
        document.getElementById("d").innerHTML = xhr.responseText;
    }

    window._photoUpload = _photoUpload;
})(window, document)