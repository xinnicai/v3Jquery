
var myTextarea1,editor;
$(document).ready(function (){
  //$("#language a").attr("class", "label label-default")
	
	fnBaseConfig();
	initScript();
//	fngetIpData();
	fnGetHost();
	fnhandleupdate()
  myTextarea1 = document.getElementById("content_u");

  editor = CodeMirror.fromTextArea(myTextarea1, {
    lineNumbers: true,
    matchBrackets: true,

    mode: "python",
    lineWrapping: true
  });
  $("#content_u").text(editor.getValue());

});

var params = parseParams(self.location.search);
var id =getUrlParam('aaid');//params.aaid ;//_local.id;
var edittype=getUrlParam('type');//params.type ;
function showback(){
  // this.attr('href','#./webcontent/platformsetting/Plug-In/market-list.html?aaid='+id);
  history.go(-1);
	//changeMenu(this, '/webcontent/platformsetting/setting.html', );
}



//***********获取数据*************//
function fnhandleupdate(){
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"scripts/plugin?id="+id,
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
			//var da = JSON.parse(result.data);
			var data=result.data[edittype];
					$("#filename_u").val(data[0].filename),//插件名称
    			    $("#language_u").val(data[0].language),//插件语言
    			    $("#type_u").val(data[0].type),//脚本类型
    			    $("#content_u").text(editor.setValue(data[0].content)),//脚本
    			    $("#remark_t").val(data[0].remark),//工具说明
    			    $("#dev_IP_u").val(data[0].dev_IP),
//    			    $("#user_u").val(data[0].username),
    			    fnShowParam(data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('更新失败！');//其他操作
            }
        }
	});
}
var index=0;
function fnShowParam(data){
	 $("#add_param_u").empty();
		var length=data[0].param_input.length;
		var html='';
	
		for(var i=0;i<length;i++){
			index++;
			var str=''+index+','+data[0].param_input[i].param_key+','+data[0].param_input[i].param_name+','+data[0].param_input[i].remark+','+data[0].param_input[i].param_def+'';
			
			html+='<tr>';
			html+='<td class="index">'+index;
			html+='</td>';
			html+='<td class="param_key_u">'+data[0].param_input[i].param_key+'</td>';	
			html+='<td class="param_name_u">'+data[0].param_input[i].param_name+'</td>';
			html+='<td class="remark_u">'+data[0].param_input[i].remark+'</td>';
			html+='<td class="param_def_u">'+data[0].param_input[i].param_def+'</td>';
			html+='<td><a href="#" class="btn btn-default btn-xs"onclick="fnUpdateParam(\''+str+'\')"><i class="fa fa-edit"></i>修改</a>';
			html+='<a href="#" class="btn btn-default btn-xs " onclick="fnDeleteParam(this)"><i class="fa fa-trash" ></i> 删除</a></td>';
			html+='</tr>';
		}
		$("#add_param_u").append(html);
//		------添加参数到执行调试页面---------
		$("#Plugin_showInExec").empty();
		var html='';
		for(var i=0;i<length;i++){
			html +='<div class="plugin_param">'
			html +='<label name="param_key" >'+data[0].param_input[i].param_key+'</label>'
			html +='<input type="text" class="form-control" value="'+data[0].param_input[i].param_def+'" name="param_value">'
			html +='</div>'
		}
		$("#Plugin_showInExec").append(html);
}
//***********更新插件*************//

function updateinfo(){
	var arr=[];
	var d=$("#add_param_u tr");
	for(i=0;i<d.length;i++){
		var tmp={};
		tmp.param_key = $($(d[i]).children('td')[1]).html();
		tmp.param_name = $($(d[i]).children('td')[2]).html();
		tmp.remark = $($(d[i]).children('td')[3]).html();
		tmp.param_def = $($(d[i]).children('td')[4]).html();
		arr.push(tmp);
	}
	$.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+'scripts/plugin',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id,
		    "type":$("#type_u").val(),
		    "filename":$("#filename_u").val(),
		    "remark":$("#remark_t").val(),
		    "language": $("#language_u a.label-lightinfo").text(),
		    "content":editor.getValue(),
		    "param_input":arr,
		    "username":'admin'
		}),
		success:function (result) {
				// changeMenu(this, '/webcontent/platformsetting/setting.html', '/webcontent/platformsetting/Plug-In/market-list.html?aaid='+id);
			history.go(-1)	;
			/*commonAlert("#successMsg", "#successAlertBlock", "更新成功");*/
      $("#successmodal").modal('show');
      $("#successTitle").text('更新成功！！');
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
               /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('更新失败！！');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});   	  
}

/*----加载脚本语言   ------*/
function initScript(){
	
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"scripts/plugin/language/type",
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
				$("#language_u").empty();
				for(var i = 0; i < result.data.length; i++){
					var a=result.data[i].value;
					$("#language_u").append("<a class=\"label label-default\">"+a+"</a>");
					
				}
				$("#language_u a").on("click",function(){
					$("#language_u a").attr("class", "label label-default");
					$(this).attr("class", "label label-lightinfo");
				});
				$($('#language_u a')[0]).click();
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('脚本语言加载失败！');//其他操作
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
                alert('获取类型数据失败！');//其他操作
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

/******筛选主机ip地址********/
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
	$("#dev_IP_u").val(arr1);
	$("#creatDataModal3").modal("hide");
}


function fn_add_param_u(){
	index++;
	//$("#add_param").empty();
			var html='';
			var str=''+index+','+$("#param_key_u").val()+','+$("#param_name_u").val()+','+$("#remark_u").val()+','+$("#param_def_u").val()+'';
			html+='<tr>';
			html+='<td class="index">'+index;
			html+='</td>';
			html+='<td class="param_key_u">'+$("#param_key_u").val()+'</td>';	
			html+='<td class="param_name_u">'+$("#param_name_u").val()+'</td>';
			html+='<td class="remark_u">'+$("#remark_u").val()+'</td>';
			html+='<td class="param_def_u">'+$("#param_def_u").val()+'</td>';
			html+='<td><a href="#" class="btn btn-default btn-xs"onclick="fnUpdateParam(\''+str+'\')"><i class="fa fa-edit"></i>修改</a>';
			html+='<a href="#" class="btn btn-default btn-xs " onclick="fnDeleteParam(this)"><i class="fa fa-trash" ></i> 删除</a></td>';
			html+='</tr>';
				
			$("#add_param_u").append(html);
			fnPlugin_showInExec(str);
			$("#creatDataModal").modal("hide");
			$("#param_key_u").val('');
		    $("#param_name_u").val('');
			$("#remark_u").val('');
			$("#param_def_u").val('');	
			
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

//删除参数
function fnDeleteParam(obj){
	var text=$(obj).parents('tr').find('.param_key_u').text();
	var divs = $("#add_param_u tr");
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

//------修改参数-----
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
				
			var arrlength=$("#add_param_u .index");
			for(var i=0;i<arrlength.length;i++){
				if(arrlength.eq(i).text()==index){
					arrlength.eq(i).parents('tr').html(html);
					return;
				}
				
			}
			
}
//---验证---
function checkName(obj){ 
	var name = $(obj).val(); //在这里我认为： name 代表的name 为 txtUser 的文本框 
	if(name.length==0){ 
	$(obj).next().text("请输入名称");  
	return false; 
	}else{
		$(obj).next().text("");  
	} 
}

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}

