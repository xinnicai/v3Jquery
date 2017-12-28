$(document).ready(function (){
	fnUserPowerAppList1(uriArr,domArr);
	//formValidator();
	fnGetData();//获取表ge
	//fnBaseConfig();//获取网络、资源池等基本信息
  fnGetAppPower();
  toBatchPublish();  //批量发布按钮
  initBtnClick();   //批量重启按钮
	/*initImageSelect();*/
});
var sys_id;
//var useParam=getUrlParam('sys_id');
if(getUrlParam('sys_id')){
    sys_id=getUrlParam('sys_id');
}else{
    sys_id="";
}

var sysId=getUrlParam('sysid')||'';
var sysName =getUrlParam('sysname')||'';
if(sysId){
    sessionStorage.setItem("sysId", sysId);
}
if(sysName){
    sessionStorage.setItem("sysName", sysName);    
}

//应用名称
var _moName=[];
//用户权限
var uriArr=fnUrlArr(),
domArr=fnDomArr();
var mourl=[];
function fnUserPowerAppList1(uriArr,domArr){
	var mo=_user.mo;
	for(var i=0;i<mo.length;i++){
		mourl.push(mo[i].obj);
	}
	for(var a=0; a<uriArr.length; a++){
		var uri = uriArr[a];
		if(mourl.length==0){
			$(domArr[a]).css("display","none");
		}else{
			for(var b=0; b<mourl.length; b++){
				if(uri == mourl[b]){
					$(domArr[a]).css("display","inline-block");return;
				}else{
					$(domArr[a]).css("display","none");
				}
			}
		}

	}
}

var group_mo;
//***********get表格*************//
function fnGetData(){
 $('#editabledatatable').bootstrapTable({
      // url:  _URL_INTERFACE+'apps/list?sys_id='+sys_id, method: 'get',
   cache: false,
   ajaxOptions:{headers: {
     "token": token
   }},
   pageNumber: 1,      //初始化加载第一页，默认第一页
   pageSize: 10,      //每页的记录行数（*）
   pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
   ajax: function (params) {
     fnPaging(params);
   },
    search: true,dataType: 'json',
    searchAlign:'left',
       pagination: true, //data:"result.data",
       uniqueId: 'app_id',
        sidePagination: "server",//服务器端分页
        queryParamsType: '',
       // clickToSelect:true,
       // checkboxHeader:true,  //列头checkall
       // maintainSelected:true,  //分页 搜索记住check
       toolbar:'#btn-div',
       columns: [{
         checkbox:true,
         formatter: function (val, row, idx) {
            var group_mo=row['groupmo'],flag=true;
           for(var i=0;i<group_mo.length;i++){
             if(group_mo[i].groupmo_name.indexOf("批量")!=-1){
               flag=false;
             }
           }
           if(flag){
             return {
               disabled : true,//设置可用
             };
           }else{
             return {
               disabled : false,//设置可用
             };
           }
         }
       },{					
         title: '系统名称', field: 'sys_name', searchable: true, sortable: true
       },  {
         title: '应用名称', field: 'app_name', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
        	 var value=row['app_id'];
        	 var html='';
        	 html='<a href="#/webcontent/Application/Application.html?appid='+value+'">'+val+'</a>';
         	  return html;
         			  /*'<a href="Application.html?'+value+'">'+val+'</a>';*/
           }
       },{          
         title: '应用ID', field: 'app_id', searchable: true, sortable: true
       },{
         title: 'CPU(核)', field: 'cpus', sortable: true, searchable: true
       },{
         title: '内存(MB)', field: 'mem', sortable: true, searchable: true
       },{
         title: '容器数', field: 'instances', sortable: true, searchable: true
       },{
         title: '扩缩容策略', field: 'autoscale_policy', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  if(val=='1'){
          		  return '<span class="label label-success label-sm">开启</span>';
          	  }else if(val=='0'){
          		  return '<span class="label label-default label-sm">关闭</span>';
          	  }
            }
       },{
         title: '状态', field: 'status', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
       	  if(val=='1'){
       		  return '<span class="label label-success label-sm">已发布</span>';
       	  }else if(val=='2'){
       		  return '<span class="label label-warning label-sm">已暂停</span>';
       	  }else if(val=='0'){
       		  return '<span class="label label-danger label-sm">创建失败</span>';
       	  }else if(val=='3'){
       		  return '<span class="label label-danger label-sm">发布失败</span>';
       	  }
         }
       },{
         title: '操作', field: 'app_id',formatter: function (val, row, idx) {
        	 var name=row['app_name'],group_mo=row['groupmo'],html='';
        	 for(var i=0;i<group_mo.length;i++){
             if(group_mo[i].groupmo_name=="删除应用"){
               name=encodeURI(name);
         			html+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showDeleteModal(\''+val+'\',\''+name+'\')"><i class="fa fa-trash-o"></i>删除</a>';
         		}
         	}
           for(var i=0;i<group_mo.length;i++){
             if(group_mo[i].groupmo_name=="修改应用"){
               html+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="fnUpdateApp(\''+val+'\')"><i class="fa fa-edit"></i>编辑</a>';
             }
           }
           if(html==''){
             html='<i class="fa fa-ban"></i>';
					 }
        	 return html;
          //'<a class="btn btn-default btn-sm" href="javascript:void(0);" onclick="showAppCloneModal(\''+val+'\')"><i class="fa fa-copy padding-right-5"></i>配置克隆</a>'
        	 
         }
       }],
       /*responseHandler: function (result) {
       //	if (result.msg=='OK') {
       		_moName=[];
       		if(result.data &&　result.data.length!=0){
       			for(var i=0;i<result.data.length;i++){
                result.data[i].checked=false;
           			_moName.push(result.data[i].app_name);
           		}
       		}
               return result.data;
             // } else {
             //   return [];
             // }
       	//return result;
       },*/
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (data) {
       },
       onDblClickRow:function(data){
       }
     });
}
function fnPaging(params){
  var txt='';
   var josn = params.data;
   var pageSize = josn.pageSize;
   var pageNumber = josn.pageNumber;
   var appUrl = _URL_INTERFACE +"apps/list/paging?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt;
   if(josn.searchText){
     txt=josn.searchText;
   }
   if(sessionStorage.getItem("sysId")){
      sysId = sessionStorage.getItem("sysId");
      appUrl = _URL_INTERFACE +"apps/list/paging?page=" + pageNumber + "&pageSize=" + pageSize+ "&sys_id=" + sysId+'&condition='+txt
   }
   $.ajax({
     type:'GET',
     url: appUrl,
     headers: {
       "token": token
     },
     dataType: 'json',
     success: function (result) {
       var data = result;
       params.success({
         total: data.total,
         rows: data.data
       });
     },
     error: function (resp) {
       alertShow("提示:", "网络异常，加载失败!")
     }
   });
}
//编辑
function fnUpdateApp(id){
  window.location.href="#/webcontent/Application/updateApplication.html?app_id="+id;
}
//删除
function showDeleteModal(data,name){
  name=decodeURI(name);
	$("#Delvloume").modal("show");
	$("#deleteID").text(data);
	$("#deletename").text(name);
    sendMessage();
}
var deleteFlag;
function deleteData(name){
	$("#Delvloume").modal("hide");
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"platform/sms/validcode",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "appid":$("#deleteID").text(),
            "valid_code":$("#checkCode").val(),
        }),
        success:function (result) {
            if(result.data.valid==1){
                deleteFlag=true;
            }else{
                deleteFlag=false;
            }
            deleteAppInfo();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function deleteAppInfo(){
    var id=$("#deleteID").text();
    if(deleteFlag==true){
        $.ajax({
            type: 'DELETE',
            url: _URL_INTERFACE+"apps/create",
            headers: {
                "token": token
            },
            dataType: 'json',
            data:JSON.stringify({
                "app_id":id
            }),
            success:function (result) {
                $("#successmodal").modal('show');
                $("#Delappname").text(name);
                $('#editabledatatable').bootstrapTable("refresh");
                // }else{
                // 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
                // }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status === 401){
                    window.location.href = '#/login.html';
                }else{
                    $("#errormodal").modal('show');
                    $("#errorinfo").text(JSON.parse(XMLHttpRequest.responseText).msg);//其他操作
                }
            }
        });
    }else{
        $("#errormodal").modal('show');
        $("#errorinfo").text("验证码错误!");
    }
}
//克隆
function showAppCloneModal(d){
	$("#Appclone").modal("show");
	$("#clonid").text(d);
	fnCloneUpdate(d);
}
function fnCloneUpdate(d){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/detail?app_id="+d,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fnUpdataApp(data);
				fnIfEmpty("#cluster_master");
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
//获取创建应用权限
function fnGetAppPower(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/rule",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
        	if(data.create_app==true){
				$("#createAppButton").removeClass("hidden",true);
			}else{
                $("#createAppButton").addClass("hidden",true);
			}
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
var InterValObj; //timer变量，控制时间
var count = 300; //间隔函数，1秒执行
var curCount;//当前剩余秒数
var code = ""; //验证码
var codeLength = 6;//验证码长度
function sendMessage(){
    //启动计时器，1秒执行一次
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"platform/sms/sendcode",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({

            "appid":$("#deleteID").text()
        }),
        success:function (result) {
            window.clearInterval(InterValObj);
            if(result.data==undefined){
                $("#btnSendCode").val("发送验证码");
                $("#phoneName").text("");
                $("#error").text('错误提示：'+result.msg);
            }else{
                $("#phoneName").text(result.data.receiver);
                $("#error").text('');
                timeFunction();
            }

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function timeFunction(){
    window.clearInterval(InterValObj);
    curCount = count;
    $("#btnSendCode").attr("disabled", "true");
    $("#btnSendCode").val("还剩" + curCount + "秒");
    InterValObj = window.setInterval(SetRemainTime, 1000);
}
//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#btnSendCode").removeAttr("disabled");//启用按钮
        $("#btnSendCode").val("重新发送验证码");
        code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效
    }
    else {
        curCount--;
        $("#btnSendCode").val("还剩" + curCount + "秒");
    }
}

var appIds=[]; //选择的应用

//到批量发布页面
function toBatchPublish () {
  $("#publish").click(function(){
    
    var arrCheckbox=$("#editabledatatable").find("td input[type='checkbox']:checked");    
    for(var i=0;i<arrCheckbox.length;i++){
      var tr=$(arrCheckbox[i]).parents('tr');
      appIds.push(tr.attr('data-uniqueid'));
    } 
    if(appIds.length>0){
      // window.location.href = '#/webcontent/Application/appBatchPublish.html?appIds='+JSON.stringify(appIds); 
      window.location.href = '#/webcontent/Application/appBatchPublish.html?app_id=customer-scrm-13';
    }else{
      //提示选择要发布的应用
    }  
    
  });  
}

//初始操作按钮事件
function initBtnClick(){
  $("#restart").click(function(){
    openConfirmModal("重启");
  });
  $("#pause").click(function(){    
    openConfirmModal("暂停");
  });
  $("#start").click(function(){    
    openConfirmModal("启动");
  });
}

//操作按钮事件初始
function openConfirmModal(text){
  var arrCheckbox=$("#editabledatatable").find("td input[type='checkbox']:checked");
  appIds.length=0;    
  for(var i=0;i<arrCheckbox.length;i++){
    var tr=$(arrCheckbox[i]).parents('tr');
    appIds.push(tr.attr('data-uniqueid'));
  }  
  if(appIds.length>0){
    if(text=="重启"){
      //判断所有选中应用的状态是否为已发布
      for(var idx=0;idx<appIds.length;idx++){ 
        var obj=$("#editabledatatable").bootstrapTable('getRowByUniqueId', appIds[idx]);
        if(obj.status!='1'){  //有应用状态不是已发布
          $("#cuetitle1").text("只能重启运行中的应用！");
          $("#wrongmodal").modal('show');
          return false;
        }
      }
    } else if(text=="暂停"){
      //判断所有选中应用的状态是否为非暂停
      for(var idx=0;idx<appIds.length;idx++){ 
        var obj=$("#editabledatatable").bootstrapTable('getRowByUniqueId', appIds[idx]);
        if(obj.status!='1'){  //有应用状态不是已发布
          $("#cuetitle1").text("只能暂停运行中的应用！");
          $("#wrongmodal").modal('show');
          return false;
        }
      }
    }else if(text=="启动"){
      //判断所有选中应用的状态是否为暂停
      for(var idx=0;idx<appIds.length;idx++){
        var obj=$("#editabledatatable").bootstrapTable('getRowByUniqueId', appIds[idx]);
        if(obj.status!='2'){  //有应用状态不是已暂停
          $("#cuetitle1").text("只能启动已暂停的应用！");
          $("#wrongmodal").modal('show');
          return false;
        }
      }
    }
    //展示弹框内容
    $("#confirmModal").find("[do-name='dohandle']").eq(0).text(text);
    var eleAppitem=""  
    for(var index=0;index<appIds.length;index++){
      eleAppitem +='<div><span>'+appIds[index]+'</span></div>';
    }
    $("#infomessage").empty();
    $("#infomessage").append(eleAppitem);
    $("#confirmModal").modal('show');
  }else{
    //提示选择应用
    $("#cuetitle1").text("请选择需要操作的应用！");
    $("#wrongmodal").modal('show');
  } 
}

//确定执行操作
function doConfirm(){
  var handle=$("#confirmModal").find("[do-name='dohandle']").eq(0).text();
  $("#confirmModal").modal('hide');
  if(handle=='重启'){
    doRestart();
  }else if(handle=='暂停'){
    doPause();
  }else if(handle=='启动'){
    doStart();
  }
}

var restartLen=0,pauseLen=0,startLen=0;

//执行批量重启操作
function doRestart(){
  restartLen=appIds.length;
  var elem = '';
  for(var index=0;index<appIds.length;index++){
    restartAjax(appIds[index]);  //ajax请求重启
    elem+='<div><span class="app-name">'+appIds[index]+'</span><span do-name="'+appIds[index]+'"> 正在操作...</span></div>'
  }
  $("[do-name='dotype']").text("正在进行批量重启,请稍后......");
  $("#applist").empty();
  $("#applist").append(elem);
  $("#scheduleModal").modal('show');
}
//重启请求
function restartAjax(appid){
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/restart",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":appid
    }),
    success:function (result) {
      restartLen-=1;      
      $("[do-name="+appid+"]").text('重启成功');   
      $("[do-name="+appid+"]").css("color","green");  
      if(restartLen==0){ 
        $("[do-name='dotype']").text("批量重启操作完成！");
        $('#editabledatatable').bootstrapTable("refresh");
      }      
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      restartLen-=1; 
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{             
        $("[do-name="+appid+"]").text('重启失败');   
        $("[do-name="+appid+"]").css("color","red"); 
      }
      if(restartLen==0){
        $("[do-name='dotype']").text("批量重启操作完成！");
        $('#editabledatatable').bootstrapTable("refresh");
      }
    }
  });
}

//执行批量暂停操作
function doPause(){
  pauseLen=appIds.length;
  var elem = '';
  for(var index=0;index<appIds.length;index++){
    pauseAjax(appIds[index],'0');  //ajax请求暂停
    elem+='<div><span class="app-name">'+appIds[index]+'</span><span do-name="'+appIds[index]+'"> 正在操作...</span></div>'
  }
  $("[do-name='dotype']").text("正在进行批量暂停,请稍后......");
  $("#applist").empty();
  $("#applist").append(elem);
  $("#scheduleModal").modal('show');
}

//执行批量启动操作
function doStart(){
  startLen=appIds.length;
  var elem = '';
  for(var index=0;index<appIds.length;index++){
    pauseAjax(appIds[index],'-1');  //ajax请求启动
    elem+='<div><span class="app-name">'+appIds[index]+'</span><span do-name="'+appIds[index]+'"> 正在操作...</span></div>'
  }
  $("[do-name='dotype']").text("正在进行批量启动,请稍后......");
  $("#applist").empty();
  $("#applist").append(elem);
  $("#scheduleModal").modal('show');
}

//暂停或启动请求 scale '0'-暂停 '-1'-启动
function pauseAjax(appid,scale){
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"apps/scale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":appid,
      "scale":scale
    }),
    success:function (result) {
      if(scale=='0'){
        pauseLen-=1;
        $("[do-name="+appid+"]").text('暂停成功'); 
        if(pauseLen==0){
          $("[do-name='dotype']").text("批量暂停操作完成！");
          $('#editabledatatable').bootstrapTable("refresh");
        }  
      }else if(scale=='-1'){
        startLen-=1;
        $("[do-name="+appid+"]").text('启动成功'); 
        if(startLen==0){
          $("[do-name='dotype']").text("批量启动操作完成！");
          $('#editabledatatable').bootstrapTable("refresh");
        }
      } 
      $("[do-name="+appid+"]").css("color","green");           
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(scale=='0'){
        pauseLen-=1;
        if(pauseLen==0){
          $("[do-name='dotype']").text("批量暂停操作完成！");
          $('#editabledatatable').bootstrapTable("refresh");
        }  
      }else if(scale=='-1'){
        startLen-=1;
        if(startLen==0){
          $("[do-name='dotype']").text("批量启动操作完成！")
          $('#editabledatatable').bootstrapTable("refresh");
        }
      }  
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        if(scale=='0'){             
          $("[do-name="+appid+"]").text('暂停失败');
        }else{
          $("[do-name="+appid+"]").text('启动失败');  
        }
        $("[do-name="+appid+"]").css("color","red"); 
      }      
    }
  });
}

