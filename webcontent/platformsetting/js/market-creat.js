$(document).ready(function (){ 
  //$("#language a").attr("class", "label label-default")
	
	fnBaseConfig();
	initScript();
//	fngetIpData();
	fnGetHost();

  var myTextarea = document.getElementById("Plugincontent");
  editor1 = CodeMirror.fromTextArea(myTextarea, {
    lineNumbers: true,
    matchBrackets: true,

    mode: "python",
    lineWrapping: true
  });
  $("#Plugincontent").text(editor1.getValue());
});

var editor1;
function fnCreateParam(){
    $("#creatDataModal").modal("show");
}
function fnSelectedHostIp(){
    $("#creatDataModal3").modal("show");
}
//***********创建插件*************//

function saveinfo(){
	var arr=[];
	var d=$("#add_param tr");
	for(i=0;i<d.length;i++){
		var tmp={};
		tmp.param_key = $($(d[i]).children('td')[1]).html();
		tmp.param_name = $($(d[i]).children('td')[2]).html();
		tmp.remark = $($(d[i]).children('td')[3]).html();
		tmp.param_def = $($(d[i]).children('td')[4]).html();
		arr.push(tmp);
	}
    // var spantext=$("span[role='presentation']").find('span');
	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'scripts/plugin',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "type":$("#type").val(),
		    "filename":$("#filename").val(),
		    "remark":$("#remark_tool").val(),
		    "language": $("#language a.label-lightinfo").text(),
		    "content":editor1.getValue(),
		    "param_input":arr
		}),
		success:function (result) {
           // changeMenu(this, '/webcontent/platformsetting/setting.html', '/webcontent/platformsetting/Plug-In/market.html');
			// 	window.location.href="#/webcontent/platformsetting/Plug-In/market.html";
			history.go(-1);
				/*commonAlert("#successMsg", "#successAlertBlock", "保存成功");*/
      $("#successmodal").modal('show');
      $("#successTitle").text('创建成功！！');
		},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
               /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('创建失败！！');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});   	  
}

/*----加载脚本语言------*/
function initScript(){
	
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'scripts/plugin/language/type',
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
				$("#language").empty();
				for(var i = 0; i < result.data.length; i++){
					var a=result.data[i].value;
					$("#language").append("<a class=\"label label-default\">"+a+"</a>");
					
				}
				$("#language a").on("click",function(){
					$("#language a").attr("class", "label label-default");
					$(this).attr("class", "label label-lightinfo");
				});
				$($('#language a')[0]).click();

			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('加载脚本语言失败！');//其他操作
            }
        }
	});   	  
}
function fnGetHost(){
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'scripts/plugin/hosts',
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fngetIpData(data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('获取主机失败！');//其他操作
            }
        }
		
	
	});
}
function fnBaseConfig(){
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'scripts/plugin/type',
        headers: {
            "token": token
        },
		dataType: 'json',

		success:function (result) {
			fnHandleBasefig(result.data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('获取参数类型失败！');//其他操作
            }
        }
	});
}
function fnHandleBasefig(data){
	
	//发布构建方式
	var type=data.type;
	$("select#FROM_VALUE").empty();
	for(var i = 0; i < data.length; i++){
		var a=data[i].value;
		$("select#FROM_VALUE").append("<option value='"+a+"'>"+a+"</option>");
	}

}
/*

//表单验证
function menuValidator(obj){
	  $("form").bootstrapValidator({
      // Only disabled elements are excluded
      // The invisible elements belonging to inactive tabs must be validated
		        feedbackIcons: icon,   //加载图标
		       
		        live: 'disabled', 
		        //表单域配置
		        fields: {
		        	plugin_name: {//username为input标签name值
		                validators: {
		                    notEmpty: {message: '请输入用户名'},    //非空提示
		                    stringLength: {    //长度限制
		                          min: 6,
		                          max: 30,
		                          message: '用户名长度必须在6到30之间'
		                    }, 
		                    regexp: {//匹配规则
		                          regexp: /^[a-zA-Z0-9_\\u4e00-\\u9fa5]+$/,  //正则表达式
		                          message:'用户名仅支持汉字、字母、数字、下划线的组合'
		                    },
		                    remote: { //ajax校验，获得一个json数据（{'valid': true or false}）
		                          url: 'user.php',                  //验证地址
		                          message: '用户已存在',   //提示信息
		                          type: 'POST',                   //请求方式
		                          data: function(validator){  //自定义提交数据，默认为当前input name值
		                            return {
		                                act: 'is_registered',
		                                username: $("input[name='username']").val()
		                            }
		                        }
		                    }
		                }
		            }
  }
	  });
	  }

*/
/******筛选ip地址********/
function fngetIpData(data){
	
	$("#host_table").empty();
	if(data.length!=0){
		for(var i=0;i<data.length;i++){
			var html='';
			html+='<tr>';
			html+='<td>';
			html+='<label>';
			html+='<input type="checkbox" name="file-version" value="'+data[i].url+'">';
			html+='<span class="text"></span>';
			html+='</label>';	
			html+='</td>';
			html+='<td class="url">'+data[i].url+'</td>';	
			html+='<td class="v1">'+data[i].v1+'</td>';
			html+='</tr>';
				
			$("#host_table").append(html);
		}
	}else{
		$("#host_table").append("<tr>暂无数据记录</tr>");
	}

}
function fn_append(){
	var arr=$("#host_table").find("input[type='checkbox']:checked");
	var arr1=[];
	for(var i=0;i<arr.length;i++){
		var value=arr[i].value;
		arr1.push(value);
	}
	$("#dev_IP").val(arr1);
	$("#creatDataModal3").modal("hide");
}

var index=0;
function fn_add_param(){
	index++;
	//$("#add_param").empty();
			var html='';
			var str=''+index+','+$("#param_key").val()+','+$("#param_name").val()+','+$("#remark").val()+','+$("#param_def").val()+'';
			html+='<tr>';
			html+='<td class="index">'+index;
			html+='</td>';
			html+='<td class="param_key">'+$("#param_key").val()+'</td>';	
			html+='<td class="param_name">'+$("#param_name").val()+'</td>';
			html+='<td class="remark">'+$("#remark").val()+'</td>';
			html+='<td class="param_def">'+$("#param_def").val()+'</td>';
			html+='<td><a href="#" class="btn btn-default btn-xs"onclick="fnUpdateParam(\''+str+'\')"><i class="fa fa-edit"></i>修改</a>';
			html+='<a href="#" class="btn btn-default btn-xs " onclick="fnDeleteParam(this)"><i class="fa fa-trash" ></i> 删除</a></td>';
			html+='</tr>';
				
			$("#add_param").append(html);
			fnPlugin_showInExec(str);
			$("#creatDataModal").modal("hide");
			$("#param_key").val('');
		    $("#param_name").val('');
			$("#remark").val('');
			$("#param_def").val('');	
			
}

function fnPlugin_showInExec(data){
	var arr=data.split(',');
//	$("#Plugin_showInExec").empty();

	var html='';
	html +='<div class="plugin_param">'
	html +='<label name="param_key" >'+arr[1]+'</label>'
	html +='<input type="text" class="form-control" value="'+arr[4]+'" name="param_value">'
	html +='</div>'
		$("#Plugin_showInExec").append(html);
}

//执行调试
function ShowDebuggerModal(){
	$("#DebuggerModal").modal("show");
	fnGetresult();
	
}
function fnGetresult(){

    var param=[];
    $(".plugin_param").each(function(i){
    	var param_key= "";
    	var param_value="";
    	param_key = $(this).find("[name='param_key']").text();
    	param_value = $(this).find("[name='param_value']").val();
    	var arr = {"key":param_key, "value":param_value};
		param.push(arr);
    	
	});

	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'scripts/plugin/debug',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "ips":$("#dev_IP").val(),
		    "user_type": $("#user_type").val(),
		    "type":$("#type").val(),
		    "filename":$("#filename").val(),
		    "remark":$("#remark").val(),
		    "language": $("#language a.label-lightinfo").text(),
		    "content":$("#Plugincontent").val(),
		    "params":param
		}),
		success:function (result) {
				var data=result.data;
				fnhandleData(data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('调试失败！');//其他操作
            }
        }
	});
}

function fnhandleData(data){
//	$("#filename_h").text(data.filename);//插件名
	$("#creattime_h").text(data.create_time);//开始时间
	if(data.result=="0"){
		$("#result_h").html('<span class="label label-success label-sm">成功</span>');
	  }else if(data.result=="1"){
		 $("#result_h").html('<span class="label label-darkorange label-sm">失败</span>');
	  }
	
	$("#target_h").text(data.target);//目标主机
	$("#cost_time_h").text(data.cost_time);//耗时
	$("#detail_u").text(data.detail)//详情描述

}


//-------验证表单--------
$("#savepluginInfo").bootstrapValidator({
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
  	  saveinfo();
    },
    fields: {
    	plugin_name: {
            validators: {
                notEmpty: {
                    message: '插件名称不能为空'
                },
                callback:{
              	
              	  message: '插件名称不能重复',//提示消息
              	  callback: function(value, validator, $field) {
              		  var flag = true;
              		$.ajax({
                        type: 'GET',
                        url: _URL_INTERFACE+"scripts/plugin/check?filename="+$("#filename").val(),
                        headers: {
                            "token": token
                        },
              			dataType: 'json',
              			async:false,
              				success:function (result) {
              						if(result.data.is_exist==false){
              							flag=true;
              						}else{
            							flag=false;
              						}
              				},error:function (XMLHttpRequest, textStatus, errorThrown) {
                            if(XMLHttpRequest.status === 401){
                                window.location.href = '#/login.html';
                            }else{
                                alert('检查插件名失败！');//其他操作
                            }
                        }
              			});   
              		  return flag;
                    }
                }
                
            }
        },
        FROM_VALUE: {
            validators: {
                notEmpty: {
                    message: '插件类型不能为空'
                },
       
        
            }
        },
        content:{
            validators: {
                notEmpty: {
                    message: '不能为空'
                }
            }
        }
        
     
    }
});
//function checkFileName(obj){
//	var filename1 = $(obj).val();
//	$.ajax({
//		type: 'POST', 
//		url: '/exchange',
//		contentType: 'application/json',
//		dataType: 'json',
//		data:JSON.stringify({
//			"_uri": "scripts/plugin/check?filename="+filename1,
//		    "_method": "GET"
//		}),
//		success:function (result) {
//			if(result.msg=='OK'){
//				var data=result.data;
//				
//				
//			}
//		}
//	});
//	
//}
//验证
function checkName(obj){ 
	var name = $(obj).val(); //在这里我认为： name 代表的name 为 txtUser 的文本框 
	if(name.length==0){ 
	$(obj).next().text("请输入名称");  
	return false; 
	}else{
		$(obj).next().text("");  
	} 
}
//删除参数
function fnDeleteParam(obj){
	var text=$(obj).parents('tr').find('.param_name').text();
	var divs = $("#add_param tr");
	fnDeleteParam1(text);
//	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
		
		
//	}
}
//同步删除执行调试内的参数
function fnDeleteParam1(text){
	var name=text;
	var lableobj=$("#Plugin_showInExec").find(".plugin_param label");
	for(var i=0;i<lableobj.length;i++){
		var lable=lableobj.eq(i).text();
		if(lable==name){
			$("#Plugin_showInExec").find(".plugin_param").eq(i).remove();
			return;
		}
	}
	
}
function fnUpdateParam(str){
	var arr=str.split(",");
	$("#updateIndex").text(arr[0]);
    $("#param_key1").val(arr[1]);
    $("#param_name1").val(arr[2]);
    $("#remark1").val(arr[3]);
    $("#param_def1").val(arr[4]);	
    $("#updateDataModal").modal("show");
    
	
}

function fn_update_param(){
	$("#updateDataModal").modal("hide");
//	$("#param_key").val('');
//    $("#param_name").val('');
//	$("#remark").val('');
//	$("#param_def").val('');	
	var index=$("#updateIndex").text();
	//$("#add_param").empty();
			var html='';
			var str=''+$("#param_key").val()+','+$("#param_name").val()+','+$("#remark").val()+','+$("#param_def").val()+'';
			//html+='<tr>';
			html+='<td class="index">'+index;
			html+='</td>';
			html+='<td class="param_key">'+$("#param_key1").val()+'</td>';	
			html+='<td class="param_name">'+$("#param_name1").val()+'</td>';
			html+='<td class="remark">'+$("#remark1").val()+'</td>';
			html+='<td class="param_def">'+$("#param_def1").val()+'</td>';
			html+='<td><a href="#" class="btn btn-default btn-xs"onclick="fnUpdateParam(\''+str+'\')"><i class="fa fa-edit"></i>修改</a>';
			html+='<a href="#" class="btn btn-default btn-xs " onclick="fnDeleteParam(this)"><i class="fa fa-trash" ></i> 删除</a></td>';
			//html+='</tr>';
				
			var arrlength=$("#add_param .index");
			for(var i=0;i<arrlength.length;i++){
				if(arrlength.eq(i).text()==index){
					arrlength.eq(i).parents('tr').html(html);
					return;
				}
				
			}
			
}
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}

