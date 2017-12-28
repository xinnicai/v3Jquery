/*距离时间计算
 * 小于1小时的返回 ：最近
 * 小于1天的大于1小时的返回：n小时前
 * 大于1天小于一个月的返回：大约n天前
 * 大于1个月，小于1年的返回：大约n个月前
 * 大于1年的返回：大约n年前
 */

function imageValidator(obj){
    $(obj).bootstrapValidator({
        // Only disabled elements are excluded
        // The invisible elements belonging to inactive tabs must be validated
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon ',
            validating: 'glyphicon'
        },
        fields: {
            create_img_name: {
                validators: {
                    notEmpty: {
                        message: '镜像名称不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z\u4e00-\u9fa5_]+$/,
                        message: '用户名只能包含大写、小写、汉字'
                    }
                }
            },
            select_project: {
                validators: {
                    notEmpty: {
                        message: '项目不能为空'
                    }
                }
            },    create_img_dockerfile: {
                validators: {
                    notEmpty: {
                        message: 'dockerfile不能为空'
                    }

                }
            }
        }
    });
    // .on("success.form.bv",function(e){
    //     e.preventDefault();
    //     if(obj=='#creatimage'){ 
    //         // 创建镜像
    //         createImage();
    //         // $('#creatimage').bootstrapValidator("resetForm",true);
    //     }else{
    //                 // updateImage("0");
    //     }
    // });
}

function diffTime(versionStamp) {

  var daysOfMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (typeof(versionStamp) != 'string') {
    return "";
  }

  var d = new Date();

  var verYear = versionStamp.substring(0, 4);
  var verMonth = versionStamp.substring(4, 6);
  var verDays = versionStamp.substring(6, 8);
  var verHours = versionStamp.substring(8, 10);

  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDays = d.getDate();
  var nowHours = d.getHours();

  var diffHours = nowHours - verHours;
  if (diffHours < 0) {
    diffHours = 24 + parseInt(diffHours);
    nowDays = parseInt(nowDays) - 1;
  }

  var diffDays = nowDays - verDays;
  if (diffDays < 0) {
    diffDays = daysOfMonth[nowDays] + parseInt(diffDays);
    nowMonth = parseInt(nowMonth) - 1;
  }

  var diffMonths = nowMonth - verMonth;
  if (diffMonths < 0) {
    diffMonths = 12 + parseInt(diffMonths);
    nowYear = parseInt(nowYear) - 1;
  }

  var diffYear = parseInt(nowYear) - parseInt(verYear);

  var updateTime = "";

  if (diffYear < 0) {
    updateTime = "时间不确定";
  }

  if (updateTime == "" && diffYear > 0) {
    updateTime = "大约" + diffYear + "年前";
  }

  if (updateTime == "" && diffMonths > 0) {
    updateTime = "大约" + diffMonths + "月前";
  }

  if (updateTime == "" && diffDays > 0) {
    updateTime = "大约" + diffDays + "天前";
  }

  if (updateTime == "" && diffHours > 0) {
    updateTime = "大约" + diffHours + "小时前"
  }

  if (diffYear == 0 && diffMonths == 0 && diffDays == 0 && diffHours == 0) {
    updateTime = "最近1小时内";
  }

  return updateTime;

}

//search
function fnSearch(obj) {
  var txt = $(obj).val();
  if (txt == '') {
    $("tbody tr").show();
  } else {
    $("td").parents("tbody tr").hide();
    $("td:contains('" + txt + "')").parents("tbody tr").show();
  }
}

function inBusy(content) {
  $('#tips span').html(content);
  $('#tips').modal('show');
}

function notBusy() {
  $('#tips').modal('hide');
}

/*function alertShow(title, content){
	$('#MsgAlertTitle').html(title);
	$('#MsgAlertContent').html(content);
	$('#MsgAlertModal').modal('show');
}*/

function trim(str) {
  return str.replace(/\s+/g, "")
}

/*function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}*/

/*function imageListParams(){
	return { "_uri": "",
		     "_method": "GET"}
}*/

/*function imageVersionsParams(){
	var img_name = getUrlParam("image_name")
	return { "_uri": "himage/version?name="+img_name,
		     "_method": "GET"}
}*/
var packageUrls = [];
function fnupload() {
  $('#uploadfilebtn').Huploadify({
    auto: true,
    fileTypeExts: '*.*',
    multi: true,
    formData: null,
    fileSizeLimit: 1024000000,
    showUploadedPercent: true,//是否实时显示上传的百分比，如20%
    showUploadedSize: true,
    removeTimeout: 9999999,
    uploader: _URL_INTERFACE + 'apps/minio/upload/' + "cipackagedir",
    headers: {"token": token},
    onUploadStart: function () {
      //alert('开始上传');
    },
    onInit: function () {
      //alert('初始化');
    },
    onUploadComplete: function (file) {
      //console.log(file);

    },
    onUploadSuccess: function (file, data, response) {
      var info = JSON.parse(data);
      var packageUrl = {raw_filename:info.raw_filename,url:encodeURIComponent(info.url)};
      packageUrls.push(packageUrl);
      // $("#fileurl").text(info.url);
      // $("#fileurl").hide();
      // $("#checkurl").show();
      var text = $('#create_img_dockerfile').val();
      $('#create_img_dockerfile').val(text+'\n'+'ADD '+info.url+" /app/pkg/"+info.raw_filename);
    },
    onDelete: function (file) {
      console.log('删除的文件：' + file);
      console.log(file);
      $("#checkurl").hide();
    }
  });
}

function fnupload_jb() {
  $('#uploadfilejb').Huploadify({
    auto: true,
    fileTypeExts: '*.*',
    multi: true,
    formData: null,
    fileSizeLimit: 1024000000,
    showUploadedPercent: true,//是否实时显示上传的百分比，如20%
    showUploadedSize: true,
    removeTimeout: 9999999,
    uploader: _URL_INTERFACE + 'apps/minio/upload/' + "cistartdir",
    headers: {"token": token},
    onUploadStart: function () {
      //alert('开始上传');
    },
    onInit: function () {
      //alert('初始化');
    },
    onUploadComplete: function (file) {
      //console.log(file);

    },
    onUploadSuccess: function (file, data, response) {
      var info = JSON.parse(data);
      var packageUrl = {raw_filename:info.raw_filename,url:info.url};
      packageUrls.push(packageUrl);
      // $("#fileurl").text(info.url);
      // $("#fileurl").hide();
      // $("#checkurl").show();
      var text = $('#create_img_dockerfile').val();
      $('#create_img_dockerfile').val(text+'\n'+'ADD '+info.url+" /app/bin/startServer.sh"+info.raw_filename);
    },
    onDelete: function (file) {
      console.log('删除的文件：' + file);
      console.log(file);
      $("#checkurl").hide();
    }
  });
}

function fnGetCreateImgType() {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/images?type=common",
    headers: {
      "token": token
    },
    Type: 'json',
    success: function (result) {
      $("#create_image_si").empty();
      var data = result.data.repos;
      var _html = '';
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {

          _html += '<option value="' + data[i] + '">' + data[i] + '</option>';
        }
      }
      $("#create_image_si").append(_html);
      fnGetCreateImgVer();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}

function showWs() {
  if (window["WebSocket"]) {
    var conn = new WebSocket("ws://" + "20.26.28.187:80" + "/ws?host=20.26.33.165&containerid=b391e802124a&showstdout=1&showstderr=1&follow=1&tail=500&timestamps=1");
    conn.onclose = function (evt) {
      var date33=new Date();
      console.log(date33);
      var item = document.createElement("p");
      item.innerHTML = "<b>Connection closed.</b>";
      $('#showD_WS').append(item);
    };
    conn.onmessage = function (evt) {
      var messages = evt.data.split('\n');
      for (var i = 0; i < messages.length; i++) {
        var item = document.createElement("p");
        item.innerText = messages[i];
        $('#showD_WS').append(item);
      }
    };
  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    $('#showD_WS').append(item);
  }
}

function fnGetCreateImgVer() {
  var image = $("#create_image_si").val();
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/images?type=common&middleware=" + image,
    headers: {
      "token": token
    },
    // async:false,
    Type: 'json',
    success: function (result) {
      $("#comImgVer").empty();
      var data = result.data.images;
      var _html = '';
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var dataval = data[i];
          _html += '<option value="' + result.data.registry + '/' + dataval + '">' + dataval.split(':')[1] + '</option>';
        }
      }
      $("#comImgVer").append(_html);
      $('#create_img_dockerfile').val('FROM '+$("#comImgVer").val());
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}

function loadProjNames() {
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE + 'harbor/projectnames',
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (resp) {
      if (resp.msg == 'OK') {
        var projs = resp.data.myProjs;
        $('select#create_img_proj').empty();
        for (i = 0; i < projs.length; i++) {
          var content = '<option value="' + projs[i].name + '">' +
            projs[i].name + '&nbsp/</option>';
          $('select#create_img_proj').append(content);
        }
        $('input#repo_host').val(resp.data.repo_host);
      }
    }
  });
}

function initImageInfo() {
  var img_name = getUrlParam("image_name");
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE + "harborimages?image_name=" + img_name,
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (resp) {

      var data = resp.data;
      $("#img_version").html(data.latest_version);
      $("#img_environment").html(data.environment);
      $("#img_time").html(data.created);
      $("#img_pullurl").html(img_name + ":" + data.latest_version);
      $("#img_info").html(data.img_info);
      $("#img_dockerfile").html(data.docfile);
      $("#img_config").html(data.config_info);
      $("#img_env").html(data.env);

      $('#create_ver_imgname').val(img_name);
      $('#create_ver_environment').val(data.environment);
      $('#create_ver_dockerfile').val(data.docfile);
      $('#create_ver_info').val(data.img_info);
      $('#create_ver_config').val(data.config_info);
      $('#create_ver_env').val(data.env);

      $('#create_ver_imgid').val("");
      $('#create_ver_imgid').val(data.img_id);


    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '/index.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}

function initImageVersionsTable() {
  var img_name = getUrlParam("image_name");
  $('#image-versions-table').bootstrapTable({
    method: 'GET',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,     //是否显示分页（*）
    sortable: false,      //是否启用排序
    sortOrder: "asc",     //排序方式
    pageNumber: 1,      //初始化加载第一页，默认第一页
    pageSize: 10,      //每页的记录行数（*）
    url: _URL_INTERFACE + "himage/version?name=" + img_name,//这个接口需要处理bootstrap table传递的固定参数
    queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                         // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber

    /*queryParams: imageVersionsParams,*///前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
    sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
    //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    //showColumns: true, //是否显示所有的列
    //showRefresh: true, //是否显示刷新按钮
    minimumCountColumns: 2,    //最少允许的列数
    clickToSelect: true,    //是否启用点击选中行
    searchOnEnterKey: true,
    columns: [{
      field: 'version',
      title: '版本号',
      align: 'center'
    }, {
      field: 'version',
      title: '创建时间',
      align: 'center',
      formatter: function (value, row, index) {
        var content = '<i class="fa fa-clock-o">';
        content += '<span class="time">' + diffTime(value) + '</span>';
        return content;
      }
    }, {
      field: 'status',
      title: '使用状态',
      align: 'center',
      formatter: function (value, row, index) {
        var content = ""
        if (value == 1) {
          content += '<span class="label label-success label-sm">使用中</span>'
        }
        else {
          content += '<span class="label label-default label-sm">未使用</span>'
        }
        return content;
      }
    }, {
      field: 'version',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
        var img_name = getUrlParam("image_name");
        var content = '<a class="btn btn-sm" ' +
          'href="javascript:delImageVer(\'' + img_name + '\', \'' + value + '\')">';
        content += '<i class="fa fa-trash-o"></i>';
        content += '删除</a>';
        return content;
      }
    }],
    pagination: true
  });
}

function initImageListTable() {

  $('#image-list-table').bootstrapTable({
    method: 'GET',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    pagination: true,     //是否显示分页（*）
    sortable: true,      //是否启用排序
    sortOrder: "asc",     //排序方式
    pageNumber: 1,      //初始化加载第一页，默认第一页
    pageSize: 10,      //每页的记录行数（*）
    url: _URL_INTERFACE + 'harbor/topimages',//这个接口需要处理bootstrap table传递的固定参数
    queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                         // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
    ajaxOptions:{headers: {
      "token": token
    }},
    /*queryParams: imageListParams,*///前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
    sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
    //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    //showColumns: true, //是否显示所有的列
    //showRefresh: true, //是否显示刷新按钮
    minimumCountColumns: 2,    //最少允许的列数
    clickToSelect: true,    //是否启用点击选中行
    searchOnEnterKey: true,
    columns: [{
      field: 'name',
      title: '镜像名称',
      align: 'left',
        width:'400px',
      // formatter: function (value, row, index) {
      //   var a = '<a href="#/webcontent/image/imageVersions.html?image_name=' + value + '">' + value + '</a>';
      //   return a
      // }

    }, {
        field: 'latest_version',
        title: '最新版本',
        align: 'center'
    }, {
      field: 'count',
      title: '下载次数',
      align: 'center'
    }, {
      field: 'total_tags',
      title: '版本数',
      align: 'center'
    }],
    pagination: true
  });

}

function fnhandleupdate(name){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"harborimages?image_name="+name,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      $('#create_img_name').val(data.image_name);

    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}

//增加删除按钮
var clickindex = 1;

function addConfig(obj) {
  clickindex++;
  var config_main = ' <div class="col-sm-offset-2 col-sm-10 config_main">'
    + '<div class="col-sm-11 no-padding-left margin-bottom-10">'
    + '<input class="form-control" rows="2" placeholder="">'
    + '</div>'
    + '<div class="col-sm-1 margin-top-5">'
    + ' <div class="form-group header-buttons" onclick="removeElement(this)""> <a href="javascript:;" class="tooltip-primary"><i class="glyphicon glyphicon-minus"></i></a></div>'
    + '</div>'
    + '</div>';
  $(obj).before(config_main);

}

function removeElement(obj) {
  var pObj = obj.parentNode.parentNode;
  pObj.parentNode.removeChild(pObj);
}

function fnCutpolicy(obj) {
  var divs = $(".staticConfig");
  if (divs.length > 1) {
    var pObj = obj.parentNode.parentNode.parentNode;
    pObj.parentNode.removeChild(pObj);
  }
}


// /*//文件上传
// function fnupload(){
// 	$('#uploadfilebtn').Huploadify({
// 		auto:true,
// 		fileTypeExts:'*.zip;*.ear;*.tar;*.jar;*.war;*.tgz;*.tar.gz.txt',
// 		multi:true,
// 		formData:{},
// 		fileSizeLimit:1024000000,
// 		showUploadedPercent:true,//是否实时显示上传的百分比，如20%
// 		showUploadedSize:true,
// 		removeTimeout:9999999,
// 		uploader:'/common/upload',
// 		onUploadStart:function(){
// 			//alert('开始上传');
// 			},
// 		onInit:function(){
// 			//alert('初始化');
// 			},
// 		onUploadComplete:function(file){
// 			//console.log(file);
//
// 			},
// 		onUploadSuccess:function(file,data,response){
// 			var info=JSON.parse(data).info;
// 			$("#filename").text(info.upload_filename);
//
// 			},
// 		onDelete:function(file){
// 			console.log('删除的文件：'+file);
// 			console.log(file);
// 		}
// 	});
// }*/


/*//改之后的创建镜像
function createImage(){
	var config_cmd=[];
	var d=$(".config_main");
	for(i=0;i<d.length;i++){
		var value=$(".config_main").eq(i).find('input').val();
		config_cmd.push(value);
	}
	//config_cmd.push(config_cmd);
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri":"images",
		    "_method":"POST",
		    "config_cmd":config_cmd,//启动脚本
		    "start_script":$("#start_script").val(),//配置脚本
		    "remark":$("#remark").text(),//镜像说明
             "image_url":"192.168.2.88/111111111/imge13:201704211921"//url
		   
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
			if(result.status=='200'){
				commonAlert("#successMsg", "#successAlertBlock", "镜像创建成功");
			}else{
				commonAlert("#warningMsg", "#warningAlertBlock", "操作失败,原因："+result.msg);
			}
			
		}
	}); 
	
}*/
//打开创建镜像modal，初始化数据
function showimageCreat() { 
  $("#creatimage").data('bootstrapValidator').destroy();  //销毁验证
  $('#creatimage').data('bootstrapValidator', null);  //置空
  imageValidator('#creatimage');  //重置数据
  $('#creatimage').modal('show');
  $("#select_project_U").selectpicker('val',"");
  $("#select_project_U").val("");
  $("#create_img_name").val("");
  $("#uploadfilebtn").empty();
  $("#uploadfilejb").empty();    
  fnupload_jb();  //上传启动脚本
  fnupload();   //上传程序包
  $("#create_img_dockerfile").val("");
  fnGetCreateImgType();  //初始化镜像类型列表
}

function showWS_D() {
  $('#showWS').modal('show');
  showWs();
}

function showcreatversion() {
  $('#creatimageversion').modal('show')

}

function selectProject(){
  var target = $("select[name='select_project']").empty();
  target.selectpicker('refresh');
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"harbor/projects",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data.rows;
      if(data.length != 0){
        for (var i = 0; i < data.length; i++){
          target.append("<option value='"+data[i].name+"'>"+data[i].name+"</option>");
        }
      }
      target.selectpicker('refresh');
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}
function alertShow(title, content){
  $('#MsgAlertTitle').html(title);
  $('#MsgAlertContent').html(content);
  $('#MsgAlertModal').modal('show');
}
//没改之前的创建镜像
function createImage() { 
  $('#creatimage').data('bootstrapValidator').validate();  //激活验证
  if(!$('#creatimage').data('bootstrapValidator').isValid()){  //手动验证
    return ;  
  } 
  var proj = $('#create_img_proj').find('option:selected').val();
  // var repo = $('#repo_host').val();
  var name = $("#create_img_name").val();
  var base_image = $("#comImgVer").val();
  // var imgPath = trim(repo) + "/" + trim(proj) + "/" + trim(imgName);
  // var environment = $('#create_img_environment').find('option:selected').val();
  var dockerfile = $('#create_img_dockerfile').val();
  var description = $('#create_img_info').val();
  var config_info = $('#create_img_config').val();
   var business_sysdomain= $("#select_project_U").selectpicker('val');
  // var env = $('#create_img_env').val();
    $("#creatimage").modal("hide");
  inBusy("镜像正在创建，请稍候...");
  console.log(packageUrls);
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'harborimages',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({
      "name": name,
      "base_image": base_image,
      "dockerfile": dockerfile,
      "description": description,
      "config_info": config_info,
      "package_urls": packageUrls,
      'business_sysdomain':business_sysdomain
    }),
    success: function (resp) {
        setTime(resp.data.img_name);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      notBusy();
      /*alertShow("提示:", "镜像创建异常，请检查网络状态!");*/
      $("#failmodal").modal('show');
      $("#failTitle").text('镜像创建失败！！');
      $("#failSpan").text(JSON.parse(XMLHttpRequest.responseText).msg);
      $('#image-list-table').bootstrapTable('refresh');

    }
  });
}
var timeout=false,img_name_new='',add_img='',times=0;
function setTime(name)
{

    if(timeout){
        // fnGetNewImg();
        timeout=false;
        return;
    }
    fnCreateImgStatus(name);
    cleanApp=setTimeout(function(){
        setTime(name)},5000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
}
function fnCreateImgStatus(name){
    times++;
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + "harborimages?image_name="+name,
        headers: {
            "token": token
        },
        //async:false,
        dataType: 'json',
        success: function (result) {
            var status=result.data.status;
            $("#failSpan").empty();
            $("#failnone").attr('onclick',"$('#creatimage').modal('show')");
            if(status!='1'){
                timeout=true;
                $('#tipsmodal').modal('hide');
                if(status=='0'){
                    notBusy();
                    $("#successmodal").modal("show");
                    $("#successTitle").text("镜像创建成功！");
                    $('#image-list-table').bootstrapTable('refresh');
                }else{
                    notBusy();
                    $("#failmodal").modal('show');
                    $("#failTitle").text('镜像创建失败');
                    for(var i=0;i<result.data.log.length;i++){
                        $("#failSpan").append('<p style="text-align: left;padding-left: 10px;">'+result.data.log[i]+'</p>');
                    }
                    document.getElementById("failSpan").style.textAlign = "left";
                }
            }else if(status==1 && times>20){
                timeout=true;
                times=0;
                $('#tips').modal('hide');
                img_name_new='';
                add_img='';
                $("#failmodal").modal('show');
                $("#failTitle").text('镜像创建失败');
                $("#failSpan").append('<p>创建超时,请联系管理员</p>');
                $("#failButton").attr('onclick',"");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '#/login.html';
            } else {
                //alert('添加失败！（例子）');//其他操作
            }
        }
    });
}

function createImageVer() {
  var imgId = $('#create_ver_imgid').val();
  var imgName = $('#create_ver_imgname').val();
  var environment = $('#create_ver_environment').val();
  var dockerfile = $('#create_ver_dockerfile').val();
  var imgInfo = $('#create_ver_info').val();
  var configInfo = $('#create_ver_config').val();
  var env = $('#create_ver_env').val();

  inBusy("正在创建镜像版本,请稍候...");

  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'himage/image',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({
      "imgId": imgId,
      "imgName": imgName,
      "environment": environment,
      "dockerfile": dockerfile,
      "imgInfo": imgInfo,
      "configInfo": configInfo,
      "env": env
    }),
    success: function (resp) {
      notBusy();
      if (resp.msg == 'OK') {
        alertShow("提示:", "创建镜像版本成功!");
        $('#image-versions-table').bootstrapTable('refresh');
      } else {
        alertShow("提示:", "创建镜像版本失败。原因：" + resp.msg);
        $('#image-versions-table').bootstrapTable('refresh');
      }
    },
    error: function (resp) {
      notBusy();
      alertShow("提示:", "创建镜像版本异常, 请检查网络状态!");
      $('#image-versions-table').bootstrapTable('refresh');
    }
  });
}

function bindCreateImgVerBtn() {
  $('#create_imgver_btn').on('click', function () {
    createImageVer();
  });
}

function delImage(id, name) {

  var m = $('#DelAlertModal')
  $(m).modal('show');
  $(m).find('#delete-btn').on("click", function () {
    inBusy("正在删除镜像...")
    $.ajax({
      type: 'DELETE',
      url: _URL_INTERFACE + 'himage/image',
      headers: {
        "token": token
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({

        "img_name": name
      }),
      success: function (result) {
        notBusy();
        alertShow("提示:", "镜像删除成功!");
        $('#image-list-table').bootstrapTable('refresh');

      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 401) {
          window.location.href = '/index.html';
        } else {
          notBusy();
          alertShow("提示:", "删除镜像失败, 该镜像正在使用!");
          $('#image-list-table').bootstrapTable('refresh');
        }
      }
    });

  });
}

function delImageVer(name, version) {
  var m = $('#DelAlertModal')
  $(m).modal('show');
  $(m).find('#delete-btn').on("click", function () {
    inBusy("正在删除镜像版本:" + version);
    $.ajax({
      type: 'DELETE',
      url: _URL_INTERFACE + 'himage/version',
      headers: {
        "token": token
      },
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({

        "img_name": name,
        "version": version
      }),
      success: function (result) {
        notBusy();
        if (result.msg == 'OK') {
          alertShow("提示:", "镜像删除成功!");
          $('#image-versions-table').bootstrapTable('refresh');
        }
        else {
          alertShow("提示:", "镜像删除失败!");
          $('#image-versions-table').bootstrapTable('refresh');
        }
      },
    });

  });
}

function bindTabBtn() {
  $('a[href="#tab1"]').on('click', function () {
    initImageInfo();
  });
  $('a[href="#tab2"]').on('click', function () {
    initImageVersionsTable();
  });
}

function initImageSearchAutocom() {

  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE + 'himage/imagenames',
    headers: {
      "token": token
    },
    dataType: 'json',
    async: false,
    success: function (result) {

      var data = result.data;
      var arr = new Array();
      for (i = 0; i < data.length; i++) {
        arr[i] = {value: data[i], data: data[i]};
      }
      window.image_names = arr;


    },
    error: function (resp) {
      ;
    }
  });

  $('#image-search-input').autocomplete({
    lookup: window.image_names,
    minChars: 2,
    maxHeight: 400,
    width: 300,
    zIndex: 999
  });

}

function searchImages(event) {
  if (event.keyCode == 13) {
    console.log("search press");
  }
}

function commonAlert(msgObjectName, alertObject, msg) {
  $(msgObjectName).html(msg);
  $(alertObject).show();
}

