$(document).ready(function (){
	fngetData();//获取图表
});


menuValidator('#creatDataModal');//新增菜单//
menuValidator('#updateDataModal');//更新菜单//

//***********创建菜单*************//
function createMenu(){
    var type=$("#checkBlock").find("input[type='radio']:checked").attr("aaaa");
	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'platform/model',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "name":$("#objname").val(),//键
		    "obj":$("#objurl").val(),//value1
		    "type":type
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('功能添加成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加模型成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#creatDataModal").modal('hide');
              $("#failmodal").modal('show');
              $("#failTitle").text('功能添加失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
               /* commonAlert("#successMsg", "#successAlertBlock", "添加模型失败");*/
            }
        }
	});   	  
}
function fnCreateDataModal1(){
    $("#creatDataModal").modal('show');
}

//***********编辑菜单*************//
function updateMenu(){

	$.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+'platform/model',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "name":$("#objname_U").val(),//键
		    "obj":$("#objurl_U").val(),//value1
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$("#updateDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('功能编辑成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "编辑模型成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
               /* commonAlert("#successMsg", "#successAlertBlock", "编辑模型失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('功能编辑失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
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
    	objname: {
            validators: {
                notEmpty: {
                    message: '对象别称不能为空'
                }
            }
        },
        objurl:{
            validators: {
                notEmpty: {
                    message: '对象路径不能为空'
                }
            }
        }
    }
});
  $("input[name='checkRadio']").next('i').remove();
}
  $('#creatDataModal').on('show.bs.modal', function () {
	  $("input").val('');
	  //getType('#dataTypes');
	});
//***********get表格*************//
 function fngetData(){
  $('#editabledatatable').bootstrapTable({
      url: _URL_INTERFACE+"platform/model?type=all", method: 'GET', cache: false,
      ajaxOptions:{headers: {
          "token": token
      }}, search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'id',
        toolbar:'#btn-div',
        columns: [{					
          title: '对象别称', field: 'name', searchable: true, sortable: true
        },  {
          title: '对象路径', field: 'obj', sortable: true, searchable: true
        }, {
          title: '功能类型', field: 'type', sortable: true, searchable: true
        },{
          title: '操作', field: 'id',formatter: function (val, row, idx) {
  	  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
  	  			
          }
        }],
        responseHandler: function (result) {
                return result.data;
        	//return result;
        },
        onSearch: function (text) {
			console.info(text);
		},
        onLoadSuccess: function (data) {
 	
        },
        onDblClickRow:function(data){
        	var id=data.id;
            $("#basedataid").text(id);
            $("#objname_U").val(data.name),//键
            $("#objurl_U").val(data.obj),//value1
        	$("#updateDataModal").modal('show');
        }
      });
  }

// //***********编辑modal获取数据*************//
// function fnhandleupdate(id){
// 	$.ajax({
//         type: 'GET',
//         url: _URL_INTERFACE+'platform/model',
//         headers: {
//             "token": token
//         },
// 		dataType: 'json',
// 		data:JSON.stringify({
// 		    "id":id
// 		}),
// 		success:function (result) {
// 			var data=result.data;
// 			debugger
// 			for(var i=0;i<data.length;i++){
// 				if(data[i].id == id){
// 					 $("#objname_U").val(data[i].name),//键
// 					 $("#objurl_U").val(data[i].obj),//value1
// 				    $("#basedataid").text(data[i].id);
// 				}
// 			}
//
// 		},error:function (XMLHttpRequest, textStatus, errorThrown) {
//             if(XMLHttpRequest.status === 401){
//                 window.location.href = '#/login.html';
//             }else{
//                 alert('编辑失败！');//其他操作
//             }
//         }
// 	});
// }
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
        url: _URL_INTERFACE+'platform/model',
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
				/*commonAlert("#successMsg", "#successAlertBlock", "数据模型成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
               /* commonAlert("#successMsg", "#successAlertBlock", "数据模型失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('删除失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
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

/*
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}*/
