
 
//----------------------------
// 基础设置
//----------------------------


/**
 * @description 相册母路径
 * @type String
 */
uinv.FCM.configMgr.model.images.path = '/Images';

/**
 * @description 图片操作时的子目录，在弹开相册时会传入路径改写此值
 * @type String
 */
uinv.FCM.configMgr.model.images.dir = '';

/**
 * @description 相册列表图片的默认高度
 * @type Number
 */
uinv.FCM.configMgr.model.images.imgHeight = 50;

/**
 * 相册列表图片的默认宽度
 * @type Number
 */
uinv.FCM.configMgr.model.images.imgWidth = 100;

/**
 * @description 相册列表文件名过滤列表
 * @type Array
 */
uinv.FCM.configMgr.model.images.limit = [
	'.svn'
];


//----------------------------
// 函数区
//----------------------------


/**
 * @description 图片上传处理
 * @see uinv.server.manager.frame.upImage()
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {DOM} obj file 节点
 * @param {String} dir 文件夹
 * @static
 */
uinv.FCM.configMgr.model.images.imUpload = function(obj, dir){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	_this.dir = dir || _this.dir;
	var pathinfo = obj.value.split('\\');
	var filename = pathinfo[pathinfo.length-1];
	if(/.*[\u4e00-\u9fa5]+.*$/.test(filename)){
		_obj.note.alert(_obj.msg.S34);
		return;
	}
	var filename = encodeURIComponent(filename).replaceAll('%','___');
	var path = _obj.global.path + _this.path + _this.dir;
	var result = uinv.server.manager.frame.isFileExist(path+'/'+filename);
	var bool = true;
	if(result.data){
		bool = _obj.note.confirm(_obj.msg.F2(filename));
	}
	
	if(bool){
		uinv.server.manager.frame.upImage(obj, path , filename, function(result){_this.uploadImagesCallback(result);}); 
	}
};

/**
 * @description 删除图片
 * @see uinv.server.manager.frame.delImage()
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {String} path 图片路径
 * @static
 */
uinv.FCM.configMgr.model.images.delImages = function(path, evt){
	var e = evt || window.event;
	
	if(e.preventDefault){
		e.preventDefault();
	}
     
	if (e.stopPropagation){
		e.stopPropagation();
	}else{
		e.returnValue = false; // 解决IE8右键弹出
		e.cancelBubble = true;
	}
	
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	var bool = _obj.note.confirm(_obj.msg.S5);
	if(bool){
		uinv.server.manager.frame.delImage(path, function(result){ _this.deleteImagesCallback(result); });	
	}
	
	return false;
};

/**
 * @description 相册关闭
 * @memberOf uinv.FCM.configMgr.model.images
 * @static
 */
uinv.FCM.configMgr.model.images.close = function(){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	_obj.model.dialog.close();
};

/**
 * @description 上传图片回调函数
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {Object} result 上传图片的返回结果
 * @static
 */
uinv.FCM.configMgr.model.images.uploadImagesCallback = function(result){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	if(result.success){
		// 重新构建列表
		_this.updateList();
		_obj.model.dialog.getObj().find('.img .right .views').html('');
	}else{
		_obj.note.alert(result.data);
	}
};

/**
 * @description 删除图片回调函数
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {Object} result 删除图片返回结果
 * @static
 */
uinv.FCM.configMgr.model.images.deleteImagesCallback = function(result){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	
	if(result.success){
		// 重新构建列表
		_this.updateList();
		
		// 右侧大图取消
		_obj.model.dialog.getObj().find('.img .right .views').html('');
	
		
		var okobj = _obj.model.dialog.getObj().find('.img .left .imglist li.ok img');
		var obj = _obj.form.box.find('*[name='+_this.name+']');
		if( obj.attr('src') != okobj.attr('src') ){
			obj.attr('src','');
		}
	}
};

/**
 * @description 选择图片操作
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {DOM} obj 选中图片的DOM节点
 * @static
 */
uinv.FCM.configMgr.model.images.selectImg = function(obj){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	_obj.model.dialog.getObj().find('.img .imglist li.ok').each(function(){
		$(this).removeClass('ok');
	});
	
	$('*[name=' + _this.name + ']').attr('src', $(obj).find('img').attr('src') );
	
	$(obj).addClass('ok');
};
	
/**
 * @description 读取某个操作目录下的图片列表<br />
 * 1) 这里有个bug，实际上如果目录下有其它的飞文件也会返回<br />
 * 2) 已针对这个bug写了一个过滤特定文件的程序
 * @memberOf uinv.FCM.configMgr.model.images
 * @return {Array} 文件列表
 * @static
 */
uinv.FCM.configMgr.model.images.getData = function(){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	
	var path = _obj.global.path + _this.path + _this.dir;
	var result = uinv.server.manager.frame.getImages(path);
	
	if(result.success){
		return result.data;
	}else{
		return [];
	}
};

/**
 * @description 相册面板右侧显示大图，传入img对象，即可显示，并自动居中
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {DOM} obj 图片DOM节点
 * @static
 */
uinv.FCM.configMgr.model.images.viewsImg = function(obj){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	var img = document.createElement("img");
	img.src = $(obj).attr('src');
	_obj.model.dialog.getObj().find('.img .right .views').html(img);
};

/**
 * @description urldecode
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {String} str urlencode 字符
 * @return {String} urldecode后的字符
 * @static
 */
uinv.FCM.configMgr.model.images.decode = function(str){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	// 把 _ 替换 % 因为之前为了方便urldecode编码命名
	return decodeURIComponent(str.replaceAll('___','%'));
};

/**
 * @description 更新相册列表
 * @memberOf uinv.FCM.configMgr.model.images
 * @static
 */
uinv.FCM.configMgr.model.images.updateList = function(){
	var _obj = uinv.FCM.configMgr,
		_this = this,
		data = _this.getData(),
		cla = "",
		filename = "",
		arr = [],
		pathinfo = [],
		path = _obj.global.path + _this.path + _this.dir + '/';
		
	for(var i=0,k=data.length; i<k; i++){
		
		if( _obj.model.array.inArray(data[i], _this.limit)){
			continue;
		}
		
		var value = _obj.form.box.find('*[name='+ _this.name +']').attr('src');
		
		if( value ){
			pathinfo = value.split('/');
			filename = pathinfo[ pathinfo.length-1 ];
		}else{
			filename = '';
		}
		
		cla = filename == data[i] ? 'ok' : '';
		
		arr.push( _obj.template.load("images/li.html",{
			cla			: cla,
			url			: _obj.global.projectPath + path+data[i],
			path		: path+data[i],
			title		: _this.decode(data[i])
		}));
		
	}
	
	_obj.model.dialog.getObj().find('.img .left .imglist').html(arr.join(''));
};

/**
 * @description  列表图标加载结束触发
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {DOM} obj
 * @static
 */
uinv.FCM.configMgr.model.images.liImgLoad = function(obj){
	var _obj = uinv.FCM.configMgr,
		_this = this;
	if($(obj).width() > $(obj).height()){
		$(obj).css("max-width", "100%");
	}else{
		$(obj).css("max-height", "100%");
	}
};

/**
 * @description 鼠标移除左侧图片列表框后操作函数
 * @memberOf uinv.FCM.configMgr.model.images
 * @static
 */
uinv.FCM.configMgr.model.images.out = function(){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	var obj = _obj.form.box.find('*[name='+_this.name+']').get(0);
	_this.viewsImg(obj);
};

/**
 * @description 相册显示主函数入口
 * @memberOf uinv.FCM.configMgr.model.images
 * @param {Object} param { dir:操作的图片目录 , name:本次操作的name值以便于修改配置数据 }
 * @example uinv.FCM.configMgr.model.images.show({dir:"logo",name:"logo"});
 * @static
 */
uinv.FCM.configMgr.model.images.show = function(param){
	var _obj = uinv.FCM.configMgr;
	var _this = this;
	_this.dir = param.dir || 'global';
	_this.name = param.name || 'global';
	
	if(_this.dir.substr(0,1) != "/" ){
		_this.dir = "/" + _this.dir;
	}
	
	_obj.model.dialog.show( _obj.template.load("images/main.html") );
	_this.updateList();
	
	// 默认选中的图片在右侧显示
	var o = _obj.model.dialog.getObj().find('.img .left .imglist li.ok img').get(0);
	uinv.FCM.configMgr.model.images.viewsImg( o );
};
