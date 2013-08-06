/**
 * @description 提示模块
 */


/**
 * @description 弹出警告信息，将信息翻译后调用系统的alert函数
 * @method alert
 * @param {String} str 警告信息
 * @static
 */
uinv.FCM.configMgr.note.alert = function(str){
	alert(u.le.get(str));
};

/**
 * @description 弹出确认回话信息，将信息翻译后调用系统的confirm函数
 * @method confirm
 * @param {String} str 确认信息
 * @return {Boolean}
 * @static
 */
uinv.FCM.configMgr.note.confirm = function(str){
	return confirm(u.le.get(str));
};

/**
 * @description 信息提示，将提示信息翻译后调用dialog函数弹层提示，大小随内容自适应
 * @method dialog
 * @param {String} str 提示信息
 * @static
 */
uinv.FCM.configMgr.note.dialog = function(str){
	var html = '';
	html += '<div class="dialog-note">';
		html += '<div><s>' + str + '</s></div>';
		html += '<div class="action"><button class="button-btn" onclick="uinv.FCM.configMgr.model.dialog.close();"><s>确定</s></button></div>';
	html += '</div>';
	
	uinv.FCM.configMgr.model.dialog.show(html);
};