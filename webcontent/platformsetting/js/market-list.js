$(document).ready(function (){ 
	fnPluginInfo();
	fngetData();
	hljs.initHighlightingOnLoad();
	fnGetHost();

});
var params = parseParams(self.location.search);
var id =getUrlParam('aaid');//params.aaid ;//_local.id;
var type='';
//highlight js添加行号
//$(function(){
//    $('pre code').each(function(){
//        var lines = $(this).text().split('\n').length - 1;
//        var $numbering = $('<ul/>').addClass('pre-numbering');
//        $(this)
//            .addClass('has-numbering')
//            .parent()
//            .append($numbering);
//        for(i=1;i<=lines;i++){
//            $numbering.append($('<li/>').text(i));
//        }
//    });
//});

function fnPluginInfo(){
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"scripts/plugin?id="+id,
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fnShowFilenameTitle(data);
				fnShowPluginDetail(data);
				fnShowPluginContent(data);
				fnShowInput(data);
				fnPlugin_showInExec(data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('获取插件数据失败！');//其他操作
            }
        }
	});
	
}

function fnShowFilenameTitle(data){
	$("#filename").empty();
	//if(arr.length!=0){
	var html=' ';
	for(key in data){
		html = ''
	
		for(var i=0;i<data[key].length;i++){
			html +='<h2>'+data[key][i].filename+'</h2>'
		}
		   
		$("#filename").append(html);
		}
	
}

function fnShowPluginDetail(data){	
	$("#plugindetail").empty();
	//if(arr.length!=0){
	var html='';
	var language;
	for(key in data){
		html = ''
		for(var i=0;i<data[key].length;i++){
			type=data[key][i].type;
			language=data[key][i].language;
			html +='<div class="col-sm-12" >'
			html += '<div class="col-sm-3 no-padding-left"><strong class="padding-right-10">分类：</strong><span>'+data[key][i].type+'</span></div>'
			html +='<div class="col-sm-6">'
			html +='<strong>作者:</strong>'
			html +='<span class="padding-left-10">'+data[key][i].username+'</span> '
			html +='</div> '	
			html +='</div> '
			html += '<div class="col-sm-12  margin-top-10">'
			html += '<div class="col-sm-3 no-padding-left">'
			html += '<strong>语言：</strong><span class="padding-left-5" id="pluginLanguage">'+language+'</span>'
			html +='</div> '
				
			html += ' <div class="col-sm-6">'
			html += '<strong>说明:</strong><span class="padding-left-5" >'+data[key][i].remark+'</span> '
			html += '</div>'
			html += '</div>'
		}
		   
		$("#plugindetail").append(html);
//		------插件图标------
		$("#imgAvatarSrc").empty();
		var html='';
			if(language=='python'){
				html +='<img class="header-avatar" src="assets/img/img/pythonLogo.jpg" >'
			}else{
				html +='<img class="header-avatar" src="assets/img/img/shellLogo.jpg" >'
			}
			
		}
		$("#imgAvatarSrc").append(html);

}


function fnShowPluginContent(data){
	$("#pluginContent").empty();
	//if(arr.length!=0){
	var html='';
	for(key in data){
		html = '暂未输入脚本'
	
		for(var i=0;i<data[key].length;i++){
			html='<pre>'
			html +='<code>'+data[key][i].content+'</code>'
			html +='</pre>'
		}
		   
		$("#pluginContent").append(html);
		}
}

//***********get历史记录表格*************//
function fngetData(){
 $('#editabledatatable').bootstrapTable({
     url: _URL_INTERFACE+"scripts/plugin/result?tool_id="+id, method: 'GET', cache: false,
     ajaxOptions:{headers: {
         "token": token
     }}, search: true,dataType: 'json',
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'id',
       toolbar:'#btn-div',					
       columns: [   {
         title: '最近执行的插件', field: 'tool_info', sortable: true, searchable: true,
         
         	 formatter: function (val, row, index) {
         	 var historyid=row['id'];
           	  var html='';
           	  html='<a href="#" onclick="changeMenu(this, \'/webcontent/platformsetting/setting.html\', \'history-list.html?id='+historyid+'\')">'+row['tool_info']['filename']+'</a>';
             	  return html;
   			}
       },  {
         title: '结果', field: 'result', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  if(val=='0'){
          		  return '<span class="label label-success label-sm">成功</span>';
          	  }else if(val=='1'){
          		  return '<span class="label label-darkorange label-sm">失败</span>';
          	  }
            }
       },{
         title: '插件类型', field: 'tool_info', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  return row['tool_info']['type'];
            	}
       },{
         title: '执行开始的时间', field: 'tool_info', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
         	  return row['tool_info']['create_time'];
           	}
         
       },{
         title: '耗时', field: 'cost_time', sortable: true, searchable: true }, 
//         {
//           title: '操作', field: 'id',
//           formatter: function (val, row, idx) {
//        	  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="historylistModal(\''+val+'\')"><i class="fa fa-keyboard-o"></i>查看详情</a>';
//          }
//         } 
         ],
       responseHandler: function (result) {
               return result.data;
       },
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (data) {
	
       },
		 onDblClickRow:function(data){
	        	
	        }
       
     });
 }

//编辑插件
function fnhandleupdate(){
	$("#updatemarket").attr('href','#/webcontent/platformsetting/Plug-In/Edit-market.html?aaid='+id+'&type='+type);
	//changeMenu(this, '/webcontent/platformsetting/setting.html', '/webcontent/platformsetting/Plug-In/Edit-market.html?aaid='+id+'&type='+type);
}

//删除插件
function showDeleteModal(){
	$("#DeleteData").modal("show");
	
}
function deleteData1(){
	$("#DeleteData").modal("hide");
	$.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE+'scripts/plugin',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('成功！！');
			/*	commonAlert("#successMsg", "#successAlertBlock", "插件删除成功");*/
            // changeMenu(this, '/webcontent/platformsetting/setting.html', '/webcontent/platformsetting/Plug-In/market.html');
			history.go(-1);
            // window.location.href="/webcontent/platformsetting/Plug-In/market.html";
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                /*commonAlert("#warningMsg", "#warningAlertBlock","插件删除失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('删除失败！！');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});
}
menuValidator('#ExecuteModal');//执行插件//

function fnShowPluginModal(){
    $("#ExecuteModal").modal('show');
}

//***********执行插件*************//
function createExecuteModal(){
    $("#ExecuteModal").modal('hide');
	   var param=[];
	    $(".plugin_param").each(function(i){
	    	var param_key= "";
	    	var param_value="";
	    	param_key = $(this).find("[name='param_key']").text();
	    	param_value = $(this).find("[name='param_value']").val();
	    	var arr = {"key":param_key, "val":param_value};
			param.push(arr);
	    	
		});
	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'scripts/plugin/exec',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "tool_id": id,
		    "ips":$("#ip").val(),//执行主机
		    "params":param,
		    "user_type":$("#user").val()//执行用户
		   
		}),
		success:function (result) {
				/*commonAlert("#successMsg", "#successAlertBlock", "插件已执行！！！");*/
      $("#successmodal").modal('show');
      $("#successTitle").text('执行成功！！');
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
               /* commonAlert("#warningMsg", "#warningAlertBlock", "执行失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('执行失败！！');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});   	  
}


function fnShowInput(data){
	$("#show_param").empty();
//	if(data.length!=0){
	var html='';
	for(key in data){
		html = ''
		if(data[key].length!=0){
			for(var i=0;i<data[key].length;i++){
				var index=data[key][i].param_input.length;
				for(var j=0;j<index;j++){
					html +='<tr>'
					html +='<td class="index">1</td>'
					html +='<td class="param_key">'+data[key][i].param_input[j].param_key+'</td>'
					html +='<td class="param_name">'+data[key][i].param_input[j].param_name+'</td>'
	                html +='<td class="remark">'+data[key][i].param_input[j].remark+'</td>'
	                html +='<td class="param_def">'+data[key][i].param_input[j].param_def+'</td>'
	                html +='</tr>'
			}
		}
		$("#show_param").append(html);
		}
	
}
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
/******筛选ip地址********/
function fngetIpData(data){
	
	$("#host_table").empty();
	if(data.length!=0){
		var html='';
		for(var i=0;i<data.length;i++){
			html+='<tr><td><label><input type="checkbox" name="plugin_version" pluginurl="'+data[i].url+'">'
			+'<span class="text"></span></label></td>'
			+'<td class="url">'+data[i].url+'</td><td class="v1">'+data[i].v1+'</td></tr>';
		}
		$("#host_table").append(html);
	}else{
		$("#host_table").append("<tr>暂无数据记录</tr>");
	}
}
function fnShowIP(){
    $("#creatDataModal3").modal("show");
}
function fn_append(){
	var arr=$("#host_table").find("input[type='checkbox']:checked");
	var arr1=[];
	for(var i=0;i<arr.length;i++){
		var value=arr[i].attributes.pluginurl.nodeValue;
		arr1.push(value);
	}
	$("#ip").val(arr1);
	$("#creatDataModal3").modal("hide");
}


function fnPlugin_showInExec(data){
	$("#Plugin_showInExec").empty();
//	if(data.length!=0){
	var html='';
	for(key in data){
		html = ''
		if(data[key].length!=0){
			for(var i=0;i<data[key].length;i++){
				var index=data[key][i].param_input.length;
				for(var j=0;j<index;j++){
					html +='<div class="plugin_param">'
					html +='<label name="param_key">'+data[key][i].param_input[j].param_key+'</label>'
					html +='<input type="text" class="form-control"  paramValue="'+data[key][i].param_input[j].param_def+'" placeholder="'+data[key][i].param_input[j].param_def+'" name="param_value">'
			        html +='</div>'
				}
		}
		$("#Plugin_showInExec").append(html);
		}
}
}
//*****************验证 提交表单*************//
function menuValidator(obj){

  $(obj).bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    
    submitHandler: function (validator, form, submitButton) {
    	if(obj=='#ExecuteModal'){
    		createExecuteModal();
    	}else{
    		updateMenu("0");
    	}
    },
    fields: {
    	ip: {
            validators: {
                notEmpty: {
                    message: '请至少输入一个ip地址'
                },
		    regexp: {
		    	 regexp: 	
		      		  /^(\d{1,3}|\*)(\.(\d{1,3}|\*)){3}(\,(\d{1,3}|\*)(\.(\d{1,3}|\*)){3})*$/,
		      	  message: '请输入正确的地址 '
		    }
            }
        },
        user: {
            validators: {
                notEmpty: {
                    message: '请填写执行用户'
                },
       
        
            }
        },
       
       
    }
});
}
    var downloadTextFile = function() {
    var context=$("#pluginContent").text();
    var language=$("#pluginLanguage").text();
    var filename=$("#filename").text();
    var name="";
    if(language=="python"){
    	name=filename+'.py';
    }else if(language=="shell"){
    	name=filename+'.sh';
    }else{
    	name=filename+'.txt';
    }
    var file = new File([context], name, { type: "text/plain;charset=utf-8" });
    saveAs(file);
}
 

  
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}
