$(document).ready(function (){
	fngetData();//获取图表
});

function doSetNodes(menuId)
{
	var treeObj = $.fn.zTree.getZTreeObj("tree_U");
	treeObj.checkAllNodes(false);
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/menu",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function(result){
			var data = result.data;
			if(data.length != 0){
				var treeObj = $.fn.zTree.getZTreeObj("tree_U");
				for(var i=0;i<data.length;i++){
					for(var a=0;a<menuId.length;a++){
						if(data[i].id==menuId[a]){
							//treeObj.getNodeByParam("id", node.id);
							treeObj.checkNode(treeObj.getNodeByParam("id", data[i].id),true);
						}
					}
				}
//				$.each(data,function(i,node){
//					treeObj.checkNode(treeObj.getNodeByParam("id", node.id),true);
//				});
				treeObj.expandAll(false);
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
menuValidator('#creatDataModal');//新增菜单//
menuValidator('#updateDataModal');//更新菜单//

//***********创建菜单*************//
function createMenu(){
	var treeObj = $.fn.zTree.getZTreeObj("tree");
	var nodes = treeObj.getCheckedNodes(); 
	var nodeIds = [];
	$.each(nodes,function(i,node){
		nodeIds.push(node.id);
	});
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"platform/role",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "status":'0',//类型
		    "description":$("#roledes").val(),//value1
		    "name":$("#rolename").val(),//value2
		    "menu_ids":nodeIds,//value3
		    
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('角色添加成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加角色成功");*/
				location.reload();
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        $("#creatDataModal").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('角色添加失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "添加角色失败");*/
      }
    }
	});   	  
}
function fnCreateDataModal(){
    $("#creatDataModal").modal('show');
}
//***********编辑菜单*************//
function updateMenu(){
  $("#updateDataModal").modal('hide');
	var treeObj = $.fn.zTree.getZTreeObj("tree_U");
	var nodes = treeObj.getCheckedNodes(); 
	var nodeIds = [];
	$.each(nodes,function(i,node){
		nodeIds.push(node.id);
	});
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/role",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "status":'0',//类型
		    "description":$("#roledes_U").val(),//value1
		    "name":$("#rolename_U").val(),//value2
		    "menu_ids":nodeIds,//value3
		    "id":$("#basedataid").text()
		}),
		success:function (result) {

      $("#successmodal").modal('show');
      $("#successTitle").text('角色编辑成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "编辑角色成功");*/
				location.reload();
				$('#editabledatatable').bootstrapTable("refresh");
			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#updateDataModal").modal('hide');
              $("#failmodal").modal('show');
              $("#failTitle").text('角色编辑失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
                /*commonAlert("#successMsg", "#successAlertBlock", "编辑角色失败");*/
            }
        }
	});   	  
}
//*****************验证 提交表单*************//
function menuValidator(obj){

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
    	if(obj=='#creatDataModal'){
    		createMenu();
    	}else{
    		updateMenu();
    	}
    },
    fields: {
//    	dataType: {
//            validators: {
//                notEmpty: {
//                    message: '菜单名称不能为空'
//                }
//            }
//        },
        dataKey: {
            validators: {
                notEmpty: {
                    message: '键不能为空'
                }
            }
        },
        value1:{
            validators: {
                notEmpty: {
                    message: '值1不能为空'
                }
            }
        }
    }
});
}
  $('#creatDataModal').on('show.bs.modal', function () {
	  $("input").val('');
	 // getType('#dataTypes');
	});
//***********get表格*************//
 function fngetData(){
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE+"platform/role", method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'id',
        toolbar:'#btn-div',
        columns: [{					
          title: '角色名称', field: 'name', searchable: true, sortable: true
        },  {
          title: '角色描述', field: 'description', sortable: true, searchable: true
        },  {
          title: '操作', field: 'id',formatter: function (val, row, idx) {
        	  if(row['name']=='超级管理员' || row['name']=='应用管理员' ||row['name']=='应用租户' ){
        		  return '<i class="fa fa-ban"></i>';
        	  }else{
        		  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
        	  }
  	  
  	  			
          }
        }],
        responseHandler: function (result) {
        	//if (result.msg=='OK') {
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
//        	if(data.name=='超级管理员' || data.name=='应用管理员' || data.name=='应用租户' ){
//        		$("#tips").modal('show');
//        	}else{
//        		
//        	}
        	var id=data.id;
        	$("#createUser1").attr('disabled',false);
        	$("#updateDataModal").modal('show');	//$("#createUser").prop("disabled",false);
        	getType('#dataTypes_U');
        	fnhandleupdate(id);
        }
      });
  }
//类型
 function getType(obj){
		$(obj).empty();
		$(obj).append("<option value='"+""+"'>"+"-请选择-"+"</option>");
		
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
						$(obj).append("<option value='"+data[i].id+"'>"+data[i].type+"</option>"); 
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
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/role",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
			var data=result.data;
			for(var i=0;i<data.length;i++){
				if(data[i].id == id){
					$("#roledes_U").val(data[i].description);//value1
				    $("#rolename_U").val(data[i].name);//value2
				    //menu_ids
				    $("#basedataid").text(data[i].id);
					doSetNodes(data[i].menu_ids);
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
function fnUpdate(){
	$("#updateApplition").modal('show');
	
}
//删除菜单
function showdeleteModal(data){
	$("#DeleteData").modal("show");
	$("#deleteID").text(data);
}
function deleteData(){
	var id=$("#deleteID").text();
	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"platform/role",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('删除成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "角色删除成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('删除失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock",'角色删除失败');*/
      }
    }
	});
}
function closeInputSelect() {
	$('#typeselect').removeClass('hidden');
	$('#typeinput').addClass('hidden');
	$('#typeselect_U').removeClass('hidden');
	$('#typeinput_U').addClass('hidden');
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

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}