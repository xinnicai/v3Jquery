
$(document).ready(function (){
	//权限
	Selectpower();
	//模型
	Selectobj();
    Selectobj1();
	//角色
	Selectrole();
	//获取图表
	fngetData();
	// fnForbidenValidate();
	});
menuValidator('#creatApplition');//新增菜单//
menuValidator('#updateApplition');//更新菜单//

//***********创建菜单*************//
function createMenu(){
	var app_ids=[];
	if($("#select_power").selectpicker('val')){
		app_ids=$("#select_power").selectpicker('val');
	}
	var mo_ids=[];
	// if($("#modal_object").selectpicker('val')){
	// 	mo_ids=$("#modal_object").selectpicker('val');
	// }
	var type=$("#checkBlock").find("input[type='radio']:checked").attr("aaaa");
	if(type=="icloud"){
        mo_ids=$("#modal_object").selectpicker('val');
	}else{
        mo_ids=$("#modal_object1").selectpicker('val');
	}
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "status":"0",//键
		    "username":$("#username").val(),//用户名
		    "mobile_phone":$("#telephone").val(),//手机号
		    "group":$("#selectGroup").val(),//用户组
		    "name":$("#name").val(),//姓名
		    "explain":$("#explain").val(),//说明
		    "role_id":$("#select_role").selectpicker('val'),//角色
		    "email":'',
		    "password":$("#passwords").val(),//密码
		    "app_ids":app_ids,//权限
		    "mo_ids":mo_ids,//模型
			"user_type":type
		}),
		success:function (result) {
			$("#creatApplition").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('用户添加成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "添加用户成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#creatApplition").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('用户添加失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "添加用户失败");*/
      }
    }
	});   	  
}

function fnCreateApplication(){
    $("#creatApplition").modal('show');
}
//***********编辑菜单*************//
function updateMenu(status){
	var app_ids=[];
	if($("#select_power_U").selectpicker('val')){
		app_ids=$("#select_power_U").selectpicker('val');
	}
	var mo_ids=[];
    var type=$("#save_user_type").text();
    if(type=="接口用户"){
        mo_ids=$("#modal_object_U1").selectpicker('val');
    }else{
        mo_ids=$("#modal_object_U").selectpicker('val');
    }
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":"update",
		    "status":status,//键
		    "username":$("#username_U").val(),//用户名
		    "mobile_phone":$("#telephone_U").val(),//手机号
		    "group":$("#selectGroup_U").val(),//用户组
		    "name":$("#name_U").val(),//姓名
		    "explain":$("#explain_U").val(),//说明
		    "role_id":$("#select_role_U").selectpicker('val'),//角色
		    "email":'',//确认密码
		    "password":$("#passwords_U").val(),//密码
		    "app_ids":app_ids,//权限
		    "mo_ids":mo_ids,//模型
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$("#updateApplition").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('用户信息编辑成功');

				/*commonAlert("#successMsg", "#successAlertBlock", "编辑用户成功");*/
				$('#editabledatatable').bootstrapTable("refresh");

			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else
        $("#updateApplition").modal('hide');
      $("#failmodal").modal('show');
      $("#failTitle").text('用户编辑失败');
      $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "编辑用户失败");*/
    }
	});   	  
}
//表单验证
function menuValidator(obj){
	  $(obj).bootstrapValidator({
      // Only disabled elements are excluded
      // The invisible elements belonging to inactive tabs must be validated
		  excluded: [':disabled', ':hidden', ':not(:visible)'],
      feedbackIcons: {
          valid: 'glyphicon',
          invalid: 'glyphicon ',
          validating: 'glyphicon'
      },
      submitHandler: function (validator, form, submitButton) {
      	if(obj=='#creatApplition'){//flag=true;
      		createMenu();
      	}else{
      		updateMenu("0");
      	}	  
      },
      fields: {
         username: {
              validators: {
                  notEmpty: {
                      message: '用户名不能为空'
                  }
                  // ,
                  // regexp: {
                  //     regexp: /^[a-zA-Z\u4e00-\u9fa5_]+$/,
                  //     message: '用户名只能包含大写、小写、汉字'
                  // }
              }
          },
          passwords: {
              validators: {
                  notEmpty: {
                      message: '密码不能为空'
                  },
								regexp:{
                  	regexp:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
										message:'密码必须在8-20个字符，必须包含至少一个大写字符，一个小写字符，和一个数字！'
								}
              }
          },
          compasswords: {
              validators: {
                  notEmpty: {
                      message: '请确认密码'
                  },
                  identical: {//相同
                      field: 'passwords', //需要进行比较的input name值
                      message: '两次密码不一致'
                  }
              }
          },
          // checkRadio:false,
          name: {
              validators: {
                  notEmpty: {
                      message: '姓名不能为空'
                  }
              }
          },
          telephone: {
              validators: {
                  notEmpty: {
                      message: '手机号不能为空'
                  },
                  regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                      regexp: /^1[34578]\d{9}$/,
                      message: '手机号有误，请重输'
                  }
                  
              }
          },
          select_role: {
              validators: {
                  notEmpty: {
                      message: '姓名不能为空'
                  }
              }
          }
      }
  });
	  $("input[name='checkRadio']").next('i').remove();
}

function fnAjax(params){
  var txt='';
   var josn = params.data;
   var pageSize = josn.pageSize;
   var pageNumber = josn.pageNumber;
   if(josn.searchText){
     txt=josn.searchText;
   }
   $.ajax({
     type:'GET',
     url: _URL_INTERFACE +"platform/users?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt,
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

//获取图表
function fngetData(){  
	  $('#editabledatatable').bootstrapTable({
      // url: _URL_INTERFACE+"platform/users", method: 'GET', cache: false,
      ajaxOptions:{headers: {
        "token": token
      }}, search: true,dataType: 'json',
	        pagination: true,
	        pageNumber: 1,      //初始化加载第一页，默认第一页
		   	pageSize: 10,      //每页的记录行数（*）
		   	pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
		   	sidePagination: "server",//服务器端分页
		   	queryParamsType:'',	        
	        ajax: function (params) {
			    fnAjax(params);
			},
	        uniqueId: 'id',
	        toolbar:'#btn-div',
	        columns: [{
	          title: '用户名', field: 'username', searchable: true, sortable: true
	        },  {
	          title: '姓名', field: 'name', sortable: true, searchable: true
	        }, {
	          title: '角色', field: 'role_name', sortable: true, searchable: true
	        },{
	          title: '说明', field: 'explain',sortable: true, searchable: true
	        },{
                title: '用户类型', field: 'user_type',sortable: true, searchable: true
            },
				{
	          title: '手机号码', field: 'mobile_phone', sortable: true, searchable: true
	        },{
	          title: '状态', field: 'status', sortable: true, searchable: true,
	          formatter: function (val, row, idx) {
	        	  if(val=='0'){
	        		  return '<a href="javascript:void(0)" class="primary">启用</a>';
	        	  }else if(val=='1'){
	        		  return '<a href="javascript:void(0)" class="darkorange">停用</a>';
	        	  }else{
	        		  return '<a href="javascript:void(0)" class="">待审批</a>';
	        	  }
	          }
	        }, {
	          title: '操作', field: 'id',formatter: function (val, row, idx) {
	        	  var handle='';
	        	  if(row['username'] == 'admin'){
	        		  handle='<i class="fa fa-ban"></i>';
	        	  }else{
	        		  if(row['status'] == '0'){
		        		  handle='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showclockModal('+val+')"><i class="fa fa-unlock"></i>锁定用户</a>';  
		        	  }else{
		        		  handle='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showunclock('+val+')"><i class="fa fa-lock"></i>解锁用户</a>';  
		        	  }
		        	  handle+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showpawdModal('+val+')"><i class="fa fa-keyboard-o"></i>密码重置</a>';
		        	  handle+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除用户</a>';
	        	  }
	        	  return handle;
	            
	          }
	        }],
	        // responseHandler: function (result) {
	        // 	//if (result.msg=='OK') {
	        //         return result.data;
	        //       // } else {
	        //       //   return [];
	        //       // }
	        // },
	        onSearch: function (text) {
				console.info(text);
			},
	        onLoadSuccess: function (data) {
	        },
	        onDblClickRow:function(data){
	        	var id=data.id;
	        	$("#save_user_type").text(data.user_type);
	        	if(data.user_type=="接口用户"){
                    $("#updateIcloud").addClass("hidden",true);
                    $("#updateInterface").removeClass("hidden",true)
				}else{
                    $("#updateInterface").addClass("hidden",true);
                    $("#updateIcloud").removeClass("hidden",true);
				}
                $("#updateApplition").modal('show');

	        	//getType('#dataTypes_U');
	        	fnhandleupdate(id);
	        }
	      });
	}


function fnUpdateMenu(status,obj){	
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":status,//键	
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$(obj).modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('操作成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
				$('#editabledatatable').bootstrapTable("refresh");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $(obj).modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('操作失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/

      }
    }
	});   	  
}
//锁定用户
function showclockModal(data){
	$("#clockUser").modal("show");
	$("#basedataid").text(data);
}
function clock(){
	fnUpdateMenu("lock","#clockUser");
}
//解锁用户
function showunclock(data){
	$("#unclockUser").modal("show");
	$("#basedataid").text(data);
}
function unclock(){
	fnUpdateMenu("unlock","#unclockUser");
}
//密码重置
function showpawdModal(data){
	$("#resetPasswd").modal("show");
	$("#basedataid").text(data);
}
function resetpawd(){
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":"reset_password",//键	
		    "id":$("#basedataid").text(),
		    "password":"Sddcos.123"
		}),
		success:function (result) {
			$("#resetPasswd").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('密码重置成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#resetPasswd").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('操作失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
      }
    }
	});   
}
//删除菜单
function showdeleteModal(data){
	$("#DeleteUser").modal("show");
	$("#deleteID").text(data);
}
function deleteData(){
	var id=$("#deleteID").text();
	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"platform/users",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
			$("#DeleteUser").modal("hide");
      $("#successmodal").modal('show');
      $("#successTitle").text('用户删除成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "用户删除成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#DeleteUser").modal("hide");
        $("#failmodal").modal('show');
        $("#failTitle").text('删除失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", '用户删除失败');*/
      }
    }
	});
}
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+ "platform/users/detail?id="+id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data=result.data;
			console.log(data);
//			for(var i=0;i<data.length;i++){
//				if(data[i].id == id){
					$("#username_U").val(data.username);//用户名
				    $("#telephone_U").val(data.mobile_phone);//手机号
				    $("#selectGroup_U").val(data.group);//用户组
				    $("#name_U").val(data.name);//姓名
				    $("#explain_U").val(data.explain);//说明
				    $("#select_role_U").selectpicker('val',data.role_id);//角色
				    $("#compasswords_U").val(data.password),//确认密码
				    $("#passwords_U").val(data.password);//密码
				    $("#select_power_U").selectpicker('val',data.app_ids);
				    $("#modal_object_U").selectpicker('val',data.mo_ids);//模型
            		$("#modal_object_U1").selectpicker('val',data.mo_ids);
				    $("#basedataid").text(data.id);
//				}
//			}
			
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
$('#creatApplition').on('show.bs.modal', function () {
	  $("input").val('');
	  //$('#creatApplition').modal({backdrop: 'static', keyboard: false});
	});
function fnUpdate(){
	$("#updateApplition").modal('show');
	
}
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}
//角色
function Selectrole(){
	var target = $("select[name='select_role']").empty();
	  target.selectpicker('refresh');
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/role",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				if(data.length != 0){
					for (var i = 0; i < data.length; i++){
						target.append("<option value='"+data[i].id+"'>"+data[i].name+"</option>"); 
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
//权限
function Selectpower(){
	var target = $("select[name='select_power']").empty();
	  target.selectpicker('refresh');
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/list",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				if(data.length != 0){
					for (var i = 0; i < data.length; i++){
						target.append("<option value='"+data[i].id+"'>"+data[i].app_name+"</option>"); 
					}
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

//模型
function Selectobj(){
	var target = $("select[name='modal_object']").empty();
	  target.selectpicker('refresh');
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/model",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				if(data.length != 0){
					for (var i = 0; i < data.length; i++){
						target.append("<option value='"+data[i].id+"'>"+data[i].name+"</option>"); 
					}
				}

			 target.selectpicker('refresh');
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
function Selectobj1(){
    var target = $("select[name='modal_object1']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/model?type=interface",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    target.append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
                }
            }

            target.selectpicker('refresh');
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
//search
function fnSearch(obj){
var txt = $(obj).val();
if (txt == '') {
	$("tbody tr").show();
} else {
	$("td").parents("tbody tr").hide();
	$("td:contains('" + txt + "')").parents("tbody tr").show();
}
}

$("#checkBlock").find("input[type='radio']").change(function () {
    if($("#checkBlock").find("input[type='radio']:checked").attr("aaaa") == "icloud"){
        $("#icloudBlock").removeClass("hidden",false);
        $("#interfaceBlock").addClass("hidden",true);
    } else {
        $("#icloudBlock").addClass("hidden",true);
        $("#interfaceBlock").removeClass("hidden",false);
    }
});
// function fnForbidenValidate(){
//     $('#accountForm').bootstrapValidator('enableFieldValidators', '11111',false);
//     // $('#accountForm').data('bootstrapValidator').enableFieldValidators('11111', false);
// }
/*
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}*/
