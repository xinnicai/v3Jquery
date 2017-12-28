$(document).ready(function (){
	fnGetAppData();//获取应用告警表格	
	fnGetAppName();//获取应用名称
	fnGetPersonName();//获取联系人
	fnGetLogData();//获取日志告警表格	
//	initselect2("#app_name");
});

//function initselect2(obj){
//	$(obj).select2({
//        placeholder: "输入主机IP",
//        allowClear: true
//    });	
//}
//***********get应用告警表格*************//
function fnGetAppData(){
 $('#editabledatatable').bootstrapTable({
   url: _URL_INTERFACE+"query/apps/alert",
   ajaxOptions:{headers: {
     "token": token
   }},  method: 'get', cache: false,
        search: true,dataType: 'json',
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'id',
       toolbar:'#btn-div',
       columns: [{					
         title: '策略Id', field: 'id', searchable: true, sortable: true
       },  {
         title: '应用名称', field: 'app_name', sortable: true, searchable: true
       }, {
         title: '规则', field: 'policy', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
        	 var type=row['policy']['type'];
       	  if(type=='mem'){
       		  return '内存'+row['policy']['rule']+row['policy']['value']+"%";
       	  }else if(type=='cpu'){
       		return 'cpu'+row['policy']['rule']+row['policy']['value']+"%";
       	  }else if(type=='disk'){
       		  return '磁盘'+row['policy']['rule']+row['policy']['value']+"%";
       	  }
          }
       },{
         title: '级别', field: 'alert_level',sortable: true, searchable: true, 
         formatter: function (val, row, idx) {
        	  if(val=='1'){
        		  return '严重';
        	  }else if(val=='2'){
        		  return '关注';
        	  }else if(val=='3'){
        		  return '恢复';
        	  }
           }
       },{
         title: '周期', field: 'period',sortable: true, searchable: true, 
       },{
         title: '阈值', field: 'thresh',sortable: true, searchable: true, 
       }/*,{
         title: '联系人', field: 'persons',sortable: true, searchable: true,
         formatter: function (val, row, idx) {
        	 return val.toString();
          }
       }*/,{
         title: '状态', field: 'switch',sortable: true, searchable: true, 
         formatter: function (val, row, idx) {
        	 if(val==0){
        		 return '<span class="label label-success  label-sm">开启</span>';
        	 }else{
        		 return '<span class="label label-warning label-sm">暂停</span>';
        	 }
          }
       }, {
         title: '操作', field: 'app_id',formatter: function (val, row, idx) {
        	 var type=row['policy']['type'],appname=row['app_name'];
        	 var stop='';
        	 if(row['switch']==0){
        		 stop=val+",apps,"+type+",1,"+row['app_name'];
        		 return '<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showAppStopModal(\''+stop+'\')"><i class="fa fa-pause"></i>暂停策略</a>'
      	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showdeleteModal(\''+val+'\',\''+type+'\',\''+appname+'\')"><i class="fa fa-trash-o"></i>删除策略</a>';
      	  			
        	 }else{
        		 stop=val+",apps,"+type+",0,"+row['app_name'];
        		 return '<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showAppStopModal(\''+stop+'\')"><i class="fa fa-play"></i>开启策略</a>'
      	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showdeleteModal(\''+val+'\',\''+type+'\',\''+appname+'\')"><i class="fa fa-trash-o"></i>删除策略</a>';
      	  			
        	 }
 	  
         }
       }],
       responseHandler: function (result) {
       //	if (result.status=='200') {
               return result.data;
             // } else {
             //   return [];
             // }
       	//return result;
       },
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (data) {
	
       },
       onDblClickRow:function(data){
       	var id=data.app_id;
       	var applevel=data.alert_level;
       	var apptype=data.policy.type;
       	$("#updateDataModal").modal('show');
       	fnhandleAppupdate(id,applevel,apptype);
       }
     });
 }
//获取单个应用策略
function fnhandleAppupdate(app_id,applevel,apptype){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/alert/"+app_id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			console.log(result.msg);
				var data=result.data;
				$("#appwarningcreate").modal("show");
				$("#appmodaltitle").text("编辑应用告警策略");
				$("#app_name").prop("disabled",true);
				$("#policytype").prop("disabled",true);
				$("#alert_level").prop("disabled",true);
				$("#submitapp").text("更新");
				
				for(var i=0;i<data.length;i++){
					if(data[i].alert_level==applevel && data[i].policy.type==apptype){
						$("#app_name").selectpicker('val',data[i].app_id);
						$("#alert_level").val(data[i].alert_level);
					    
					      $("#policytype").val(data[i].policy.type);
					      $("#policyrule").val(data[i].policy.rule);
					      $("#policyvalue").val(data[i].policy.value);
					 
					   $("#period").val(data[i].period);
					    $("#thresh").val(data[i].thresh);
					    $("#persons").selectpicker('val',data[i].persons);
					    if(data[i].switch==0){
					    	$("#switch").prop("checked",true);
						}else{
							$("#switch").prop("checked",false);
						}
					}
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

//删除应用策略
function showdeleteModal(id,type,name){
	$("#DeleteData").modal("show");
	$("#deletename").text(name);
	$("#app_id").text(id);
	$("#deleteID").text(type);
	if(type=="mem"){
		$("#deletetype").text("内存");
	}else if(type=="disk"){
		$("#deletetype").text("磁盘");
	}else{
		$("#deletetype").text(type);
	}
	
}
function deleteData(){

	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"apps/alert",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":$("#app_id").text(),
		    "type":$("#deleteID").text()
		}),
		success:function (result) {

      $("#successmodal").modal('show');
      $("#successTitle").text('应用策略删除成功！！');
			/*	commonAlert("#successMsg", "#successAlertBlock", "应用策略删除成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('应用策略删除失败！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock",'应用策略删除失败');*/
      }
    }
	});
}
//暂停应用....日志策略
function showAppStopModal(data){
	$("#stopappmodal").modal("show");
	var app_id=data.split(",");
	$("#stopapp").text(app_id[4]);
	if(app_id[3]=='1'){
		$("#start").text("暂停");
	}else{
		$("#start").text("启动");
	}
	$("#stopdata").text(data);

}
function stopData(){
	var data=$("#stopdata").text().split(",");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"status/alert",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":data[0],
		    "mtype":data[1],
		    "type":data[2],
		    "switch":parseInt(data[3])
		}),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('更改成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "操作策略成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
				$('#Logpolicydatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('更改失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock", '操作策略失败');*/
      }
    }
	});
}
//创建***更新应用策略
formValidator("#appForm");
function fnAppShow(){
	$("#appwarningcreate").modal("show");
	$("#appwarningcreate").find("input").val('');
	$("#appmodaltitle").text("创建应用告警策略");
	$("#submitapp").text("创建");
	$("#app_name").prop("disabled",false);
	$("#policytype").prop("disabled",false);
	$("#alert_level").prop("disabled",false);
}
function createAppPolicy(){
	var persons=$("#persons").selectpicker('val');
	var method=''/*,appswitch=''*/;
	if($("#submitapp").text()=="创建"){
		method='POST';
	}else{
		method='PUT';
	}
//	if($("#switch").prop("checked")==true){
//		appswitch=0;
//	}else{
//		appswitch=1;
//	}
	$.ajax({
    type: method,
    url: _URL_INTERFACE+"apps/alert",
      headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":$("#app_name").selectpicker('val'),
		    "alert_level":$("#alert_level").val(),
		    "policy":{
		        "type":$("#policytype").val(),
		        "rule":$("#policyrule").val(),
		        "value":$("#policyvalue").val()
		    },
		    "period":$("#period").val(),
		    "thresh":$("#thresh").val(),
		    "persons":$("#persons").selectpicker('val'),
		    "switch":0
		}),
		success:function (result) {
			$("#appwarningcreate").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('创建应用告警策略成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "操作应用策略成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#appwarningcreate").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('策略创建失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock", "操作应用策略失败");*/
      }
    }
	});   	  
}

//*****************验证 提交表单*************//
function formValidator(obj){

  $(obj).bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
    		createAppPolicy();  	
    },
    fields: {
    	app_name: {
            validators: {
                notEmpty: {
                    message: '应用名称不能为空'
                }
            }
        },
        alert_level: {
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        policyrule:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        policytype:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        policyvalue:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                },
                regexp: {
                    regexp: /^[1-9][0-9]?$/,
                    message: '该值必须大于0小于100'
                }
            }
        },
        period:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        thresh:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        }/*,
        persons:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        }*/
    }
});
}
//获取应用名称
function fnGetAppName(){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/list",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				//$("[name='app_name']").empty();
				if(result.data.length>0){
					
					for (var i = 0; i < result.data.length; i++){
						$("[name='app_name']").append("<option value='"+result.data[i].app_id+"'>"+result.data[i].app_name+"</option>"); 
					}
				}else{
					$("[name='app_name']").append("<option value=''>暂无应用</option>"); 
				}
				$("[name='app_name']").selectpicker('refresh');
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

//获取应用名称
function fnGetPersonName(){
	var target = $("select[name='persons']").empty();
	  target.selectpicker('refresh');
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {

				
				if(result.data.length>0){
					for (var i = 0; i < result.data.length; i++){
						target.append("<option value='"+result.data[i].username+"'>"+result.data[i].username+"</option>"); 
					}
				}else{
					target.append("<option value=''>暂无联系人</option>"); 
				}
			target.selectpicker('refresh');
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

//****************************************************************************************************//
//****************************************************************************************************//
//***********************************************************//
//***********get日志告警表格*************//
function fnGetLogData(){
	 $('#Logpolicydatatable').bootstrapTable({
	     method: 'get', cache: false,
     url: _URL_INTERFACE+"query/log/alert",
     ajaxOptions:{headers: {
       "token": token
     }},  search: true,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'id',
	       toolbar:'#btn-div',
	       columns: [{					
	         title: '策略Id', field: 'id', searchable: true, sortable: true
	       },  {
	         title: '应用名称', field: 'app_name', sortable: true, searchable: true
	       }, {
	         title: '监控关键字', field: 'keyword', sortable: true, searchable: true
	       },{
	         title: '级别', field: 'alert_level',sortable: true, searchable: true, 
	         formatter: function (val, row, idx) {
	        	  if(val=='1'){
	        		  return '严重';
	        	  }else if(val=='2'){
	        		  return '关注';
	        	  }else if(val=='3'){
	        		  return '恢复';
	        	  }
	           }
	       },{
	         title: '监控周期', field: 'period',sortable: true, searchable: true, 
	       },{
	         title: '阈值', field: 'thresh',sortable: true, searchable: true, 
	       },/*{
	         title: '联系人', field: 'persons',sortable: true, searchable: true, 
	         formatter: function (val, row, idx) {
	        	 return val.toString();
	         }
	       },*/{
	         title: '状态', field: 'switch',sortable: true, searchable: true,
	         formatter: function (val, row, idx) {
		         if(val==0){
	        		 return '<span class="label label-success  label-sm">开启</span>';
	        	 }else{
	        		 return '<span class="label label-warning label-sm">暂停</span>';
	        	 }
	         }
	       },/*{
	         title: '更新时间', field: 'create_time',sortable: true, searchable: true, 
	       },*/ {
	         title: '操作', field: 'app_id',formatter: function (val, row, idx) {
	        	 var keyword=row['keyword'],logAppName=row['app_name'];
	        	 var stop='';
	        	 if(row['switch']==0){
	        		 stop=val+",log,"+keyword+",1,"+row['app_name'];
	        		 return '<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showAppStopModal(\''+stop+'\')"><i class="fa fa-pause"></i>暂停策略</a>'
	 	 	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showdeleteLogModal(\''+val+'\',\''+keyword+'\',\''+logAppName+'\')"><i class="fa fa-trash-o"></i>删除策略</a>';
	 	 	  			
	        	 }else{
	        		 stop=val+",log,"+keyword+",0,"+row['app_name'];
	        		 return '<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showAppStopModal(\''+stop+'\')"><i class="fa fa-play"></i>开启策略</a>'
	 	 	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm margin-left-5" onclick="showdeleteLogModal(\''+val+'\',\''+keyword+'\',\''+logAppName+'\')"><i class="fa fa-trash-o"></i>删除策略</a>';
	 	 	  			
	        	 }
	 	  
	         }
	       }],
	       responseHandler: function (result) {
	       //	if (result.status=='200') {
	               return result.data;
	             // } else {
	             //   return [];
	             // }
	       	//return result;
	       },
	       onSearch: function (text) {
				console.info(text);
			},
	       onLoadSuccess: function (data) {
		
	       },
	       onDblClickRow:function(data){
	       	var id=data.app_id;
	       	var loglevel=data.alert_level;
	       	var logtype=data.keyword;
	       	$("#policyLogWarningCreate").modal('show');
	       	$("#logmodaltitle").text("编辑日志告警策略");
	       	$("#submitlog").text("更新");
	       	fnhandleLogupdate(id,loglevel,logtype);
	       }
	     });
	 }
//获取单个日志信息
function fnhandleLogupdate(app_id,loglevel,logtype){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"log/alert/"+app_id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			console.log(result.msg);
				var data=result.data;
				
				for(var i=0;i<data.length;i++){
					if(data[i].alert_level==loglevel && data[i].keyword==logtype){
						$("#log_app").prop("disabled",true);
						$("#log_keyword").prop("disabled",true);
						$("#log_level").prop("disabled",true);
						$("#log_app").selectpicker('val',data[i].app_id);
						$("#log_level").val(data[i].alert_level);
					    
					      $("#log_keyword").val(data[i].keyword);
					 
					   $("#log_period").val(data[i].period);
					    $("#log_thresh").val(data[i].thresh);
					    $("#log_person").selectpicker('val',data[i].persons);
					    if(data[i].switch==0){
					    	$("#log_switch").prop("checked",true);
						}else{
							$("#log_switch").prop("checked",false);
						}
					}
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
//删除日志策略
function showdeleteLogModal(id,type,name){
		$("#DeleteLogData").modal("show");
		$("#logname").text(name);
		$("#log_id").text(id);
		$("#deletelogID").text(type);
}
function deleteLogData(){
	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"log/alert",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":$("#log_id").text(),
		    "keyword":$("#deletelogID").text()
		}),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('日志策略删除成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "日志策略删除成功");*/
				$('#Logpolicydatatable').bootstrapTable("refresh");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('日志策略删除失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", '日志策略删除失败');*/
      }
    }
	});
}

//创建日志策略
formLogValidator("#logForm");
function fnLogModal(){
	$("#policyLogWarningCreate").modal('show');
	$("#logmodaltitle").text("创建日志告警策略");
   	$("#submitlog").text("创建");
   	$("#log_app").prop("disabled",false);
	$("#log_keyword").prop("disabled",false);
	$("#log_level").prop("disabled",false);
}
function createLogPolicy(){
	var persons=$("#log_person").selectpicker('val');
	var method,logswitch;
	if($("#submitlog").text()=="创建"){
		method='POST';
	}else{
		method='PUT';
	}
	if($("#log_switch").prop("checked")==true){
		logswitch=0;
	}else{
		logswitch=1;
	}
	$.ajax({
    type: method,
    url: _URL_INTERFACE+"log/alert",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":$("#log_app").selectpicker('val'),
		    "alert_level":$("#log_level").val(),
		    "keyword":$("#log_keyword").val(),
		    "period":$("#log_period").val(),
		    "thresh":$("#log_thresh").val(),
		    "persons":$("#log_person").selectpicker('val'),
		    "switch":0
		}),
		success:function (result) {
			$("#policyLogWarningCreate").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('创建日志告警策略成功！！');
			/*	commonAlert("#successMsg", "#successAlertBlock", "操作日志策略成功");*/
				$('#Logpolicydatatable').bootstrapTable("refresh");
			
		},
  error:function (XMLHttpRequest, textStatus, errorThrown) {
    $("#policyLogWarningCreate").modal('hide');
    if(XMLHttpRequest.status === 401){
      window.location.href = '#/login.html';
    }else{
      $("#failmodal").modal('show');
      $("#failTitle").text('更改失败！');
      $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
     /* commonAlert("#warningMsg", "#warningAlertBlock",'操作日志策略失败');*/
    }
  }
	});   	  
}
//*****************验证 提交表单*************//
function formLogValidator(obj){

  $(obj).bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
    		createLogPolicy();
    },
    fields: {
    	app_name: {
            validators: {
                notEmpty: {
                    message: '应用名称不能为空'
                }
            }
        },
        log_level: {
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        log_keyword:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        log_period:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        },
        log_thresh:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        }/*,
        log_person:{
            validators: {
                notEmpty: {
                    message: '该项不能为空'
                }
            }
        }*/
    }
});
}
function fnSearch(obj){
	var txt = $(obj).val();
	if (txt == '') {
		$("tbody tr").show();
	} else {
		$("td").parents("tbody tr").hide();
		$("td:contains('" + txt + "')").parents("tbody tr").show();
	}
}

/*
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}*/
