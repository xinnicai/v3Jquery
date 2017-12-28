$(document).ready(function (){
	fngetData();//获取图表	
	fnnoUiSlider("#sample-onehandle","#CPU",0,100);
	fnnoUiSlider("#sample-onehandle2","#mem",0,100);
	fnnoUiSlider("#sample-onehandle3","#disk",0,100);
	
	fnnoUiSlider("#sample-onehandle_U","#CPU_U",0,100);
	fnnoUiSlider("#sample-onehandle2_U","#mem_U",0,100);
	fnnoUiSlider("#sample-onehandle3_U","#disk_U",0,100);
});

//***********get表格*************//
function fngetData(){
 $('#editabledatatable').bootstrapTable({//url: '/exchange?time=' + Math.random(),
   url: _URL_INTERFACE+"platform/resource",method: 'GET', cache: false,
       contentType: 'application/json',ajaxOptions:{headers: {
     "token": token
   }}, search: true,dataType: 'json',
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'key',
       toolbar:'#btn-div',
       columns: [{					
         title: '系统组', field: 'value', searchable: true, sortable: true
       },  {
         title: 'CPU(核)', field: 'value3', sortable: true, searchable: true,
       }, {
         title: '内存(GB)', field: 'value4', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
        	  return (parseInt(val/1024)).toFixed(0);
         }
       },{
         title: '磁盘(GB)', field: 'value5',sortable: true, searchable: true,
         formatter: function (val, row, idx) {
       	  return (parseInt(val/1024)).toFixed(0);
        }
       }, {
         title: '操作', field: 'key',formatter: function (val, row, idx) {// onclick="changeMenu(this, \'/webcontent/platformsetting/setting.html\', \'/webcontent/platformsetting/quotaslist.html?sysid='+val+'\')
 	  return '<a href="#/webcontent/platformsetting/quotaslist.html?sysid='+val+'" class="btn btn-default btn-sm margin-right-5"><i class="fa fa-edit"></i>查看</a>'
 	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\''+val+'\')"><i class="fa fa-trash-o"></i>删除</a>';
         }
       }],
       //
       responseHandler: function (result) {
       	// if (result.msg=='OK') {
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
       	var id=data.key;
       	$("#updateDataModal").modal('show');
       	fnhandleupdate(id);
       }
     });
 }
//删除
function showdeleteModal(id){
	$("#DeleteData").modal("show");
	$("#deleteID").text(id);
}
function deleteData(){
	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"platform/resource/"+$("#deleteID").text(),
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('删除成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "删除成功!");*/
				$('#editabledatatable').bootstrapTable("refresh");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       /* commonAlert("#warningMsg", "#warningAlertBlock", "删除成功");*/
        $("#failmodal").modal('show');
        $("#failTitle").text('删除失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
	});
}
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/resource/"+id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data=result.data;
			var mem=(parseInt(data[0].value4)/1024).toFixed(3);
			var disk=(parseInt(data[0].value5)/1024).toFixed(3);
			  $("#CPU_U").val(data[0].value3);
			   $("#mem_U").val(mem);
			    $("#disk_U").val(disk);
				  $("#sample-onehandle_U").val(data[0].value3);
				   $("#sample-onehandle2_U").val(mem);
				    $("#sample-onehandle3_U").val(disk);
			    $("#sysname_U").val(data[0].value);
			 $("#syslable_U").val(data[0].key);
			
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

//***********创建*************//
function createMenu(){
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"platform/resource",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "cpu": $("#CPU").val(),
		    "mem": parseInt($("#mem").val())*1024,
		    "disk": parseInt($("#disk").val())*1024,
		    "sys_name": $("#sysname").val(),
		    "sys_id": $("#syslable").val()
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('添加成功！！');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#creatDataModal").modal('hide');
       /* commonAlert("#warningMsg", "#warningAlertBlock", "添加失败");*/
        $("#failmodal").modal('show');
        $("#failTitle").text('添加失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
	});   	  
}
function fnCreateResource(){
    $("#creatDataModal").modal('show');

}

//***********编辑菜单*************//
function updateMenu(){
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"platform/resource/"+$("#syslable_U").val(),
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "cpu": $("#CPU_U").val(),
		    "mem": parseInt($("#mem_U").val())*1024,
		    "disk": parseInt($("#disk_U").val())*1024
		}),
		success:function (result) {
			$("#updateDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('编辑成功');
			/*	commonAlert("#successMsg", "#successAlertBlock", "编辑成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
				window.location.reload();
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#updateDataModal").modal('hide');
       /* commonAlert("#warningMsg", "#warningAlertBlock", "编辑失败");*/
        $("#failmodal").modal('show');
        $("#failTitle").text('编辑失败！！');
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
	});
function fnnoUiSlider(obj,inputobj,start,end){
	//$(obj).destroy();
	return $(obj).noUiSlider({
	    range: [start, end],
	    start: 0,
	    step: 1,
	    handles: 1,
	    connect: "lower",
	    serialization: {
	        to: [$("#low"), 'html']
	    },
	    slide: function() {
			var values = $(this).val();
			$(inputobj).val(parseInt(values));
		  }
	});
	//$( obj ).slider( "destroy" );	
	
}
function change(obj){
	  var inp_val=$(obj).val();
	  $(obj).val(inp_val.replace(/[^\d.]/g,'')); 
	  var id=$(obj).attr("id");
	  $("[name='"+id+"']").val(inp_val);
	  
	  if(obj.id=="slider_value"){
		  inp_val=parseInt(inp_val);
		  if(inp_val > 10){
			  $("#HMdo").prop("disabled",true);
		  }else{
			  $("#HMdo").prop("disabled",false);
		  }
	  }
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