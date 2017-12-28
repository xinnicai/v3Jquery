$(document).ready(function (){
	fngetData();//获取图表	
	$("#deadtime").datetimepicker({
		format : 'YYYY-MM-DD HH:mm'
	});
	$("#deadtime_U").datetimepicker({
		format : 'YYYY-MM-DD HH:mm'
	});
	Selectrole();
});


menuValidator('#creatDataModal');//新增菜单//
menuValidator('#updateDataModal');//更新菜单//

//***********创建菜单*************//
function createMenu(){
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"platform/notice",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "notice_title":$("#title11").val(),//键
		    "status":"0",//类型
		    "notice_content":$("#info_content").val(),//value1
		    "dead_time":$("#deadtime").val(),//value2
		    "role_ids":$("#role_id").selectpicker("val"),//value3
		    "username":'admin'
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('公告添加成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加公告成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        $("#creatDataModal").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('公告添加失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
      /* commonAlert("#warningMsg", "#warningAlertBlock", "添加公告失败");*/
      }
    }
	});   	  
}
function fnCreateNoteInfo(){
    $("#creatDataModal").modal('show');
}

//***********编辑菜单*************//
function updateMenu(status){
	
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/notice",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "notice_title":$("#notice_title_U").val(),//键
		    "status":status,//类型
		    "notice_content":$("#info_content_U").val(),//value1
		    "dead_time":$("#deadtime_U").val(),//value2
		    "role_ids":$("#role_id_U").selectpicker("val"),//value3
		    "username":'admin',
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$("#updateDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('公告编辑成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "编辑公告成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#updateDataModal").modal('hide');
        $("#failmodal").modal('show');
        $("#failTitle").text('公告编辑失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "编辑公告失败");*/
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
    		updateMenu("0");
    	}
    },
    fields: {
    	notice_title: {
            validators: {
                notEmpty: {
                    message: '不能为空'
                }
            }
        },
        role_id: {
            validators: {
                notEmpty: {
                    message: '不能为空'
                }
            }
        },
        empty: {
            validators: {
                notEmpty: {
                    message: '不能为空'
                }
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
}
  $('#creatDataModal').on('show.bs.modal', function () {
	  $("#deadtime").val('');
	 // $("#notice_title").val('');
	  $("#info_content").val('');
	});
//***********get表格*************//

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
     url: _URL_INTERFACE +"platform/notice?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt,
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
 function fngetData(){
  $('#editabledatatable').bootstrapTable({
        	// url: _URL_INTERFACE+"platform/notice", method: 'GET', cache: false,
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
        cellStyle : function cellStyle(value, row, index) {
        	return {
        	};
        },
        toolbar:'#btn-div',					
        columns: [{					
          title: '公告标题', field: 'notice_title', searchable: true, sortable: true
        },  {
          title: '创建人', field: 'username', sortable: true, searchable: true
        }, {
          title: '公告内容', field: 'notice_content', sortable: true, searchable: true,class:"tdoverflow"
        },{
          title: '创建时间', field: 'create_time',sortable: true, searchable: true 
        },{
          title: '有效期', field: 'dead_time',sortable: true, searchable: true
        },{
          title: '状态', field: 'status',sortable: true, searchable: true, 
          formatter: function (val, row, idx) {
        	  if(val=='0'){
        		  return '<a href="javascript:void(0)" class="primary">有效</a>';
        	  }else{
        		  return '<a href="javascript:void(0)" class="darkorange">失效</a>';
        	  }
          }
        }, {
          title: '操作', field: 'id',formatter: function (val, row, idx) {
        	  var handle='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
        	  if(row['status'] == '0'){
        		  handle+='<a class="btn btn-sm btn-default" onclick="showdropModal('+val+')"><i class="fa fa-edit"></i>取消</a>';
        	  }else{
        		  handle+='<a class="btn btn-sm btn-default" disabled><i class="fa fa-edit">取消</i></a>';
        	  }
        	  return handle;
  	  		  	  			
          }
        }],
        // responseHandler: function (result) {
        // //	if (result.msg=='OK') {
        //         return result.data;
        //       // } else {
        //       //   return [];
        //       // }
        // 	//return result;
        // },
        onSearch: function (text) {
			console.info(text);
		},
        onLoadSuccess: function (data) {
 	
        },
        onDblClickRow:function(data){
        	var id=data.id;
        	$("#updateDataModal").modal('show');
        	fnhandleupdate(id);
        }
      });
  }

//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"platform/notice",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data=result.data;
			for(var i=0;i<data.length;i++){
				if(data[i].id == id){
					$("#notice_title_U").val(data[i].notice_title),//键
				  
				    $("#info_content_U").val(data[i].notice_content),//value1
				    $("#deadtime_U").val(data[i].dead_time),//value2
				    $("#role_id_U").selectpicker("val",data[i].role_ids),//value3
				    
				    $("#basedataid").text(data[i].id);
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
//取消公告
function showdropModal(data){
	$("#dropinfo").modal("show");
	$("#basedataid").text(data);
	fnhandleupdate(data);
}
function dropinfo(){
	updateMenu("1")
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
    url: _URL_INTERFACE+"platform/notice",
    headers: {
      "token": token
    },
		dataType: 'json',
        data:JSON.stringify({
            "id":id
        }),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('公告删除成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "公告删除成功!");*/
				$('#editabledatatable').bootstrapTable("refresh");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('公告删除失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", '公告删除失败');*/
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
//角色
function Selectrole(){
	var target = $("select[name='role_id']").empty();
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
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
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

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}