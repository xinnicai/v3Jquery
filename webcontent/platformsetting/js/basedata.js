$(document).ready(function (){
	fngetData();//获取图表
  $("#sys_name").select2();
  $("#dataTypes").select2();
  fngetvalue();//获取value2的值
  //fnPretermit();
  // fngetType();

});

var getDataUrl="platform/value?search=全部";

function fnGetType(){
  getDataUrl="platform/value?search="+$("#sys_name").select2('val');
  $('#editabledatatable').bootstrapTable('destroy');
    fngetData();
}
//系统名称
function fngetvalue(){

  var options=$("#sys_name option:selected");
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"platform/value",
    headers: {
      "token": token
    },
    data:JSON.stringify({
      "value":options.text(),
    }),
    success:function (result) {
      var sys=result.data;
      $("#sys_name").empty();
      $("#sys_name").append("<option>全部</option>");
      for(var i = 0; i < sys.length; i++){        
        $("#sys_name").append("<option value='"+sys[i].name+"' chinaName='"+sys[i].value+"'> "+sys[i].value+"</option>");       
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


var options=$("#sys_name option:selected");


//***********创建菜单*************//
function createMenu(){

  var options1=$("#dataTypes option:selected");
 var type="",value='';
  var role=_user.role_id;

	if(role=='1'&& $('#dataTypei').val() ==''){
		type=$('#dataTypes').val();
    value=options1.attr('chinaName');
	}else if(role=='1'&& $('#dataTypei').val() !=''){
		type=$('#dataTypei').val();
    value=$('#dataTypei').val();
	}else if(role!='1'){
    value=options1.attr('chinaName');
  }
	$.ajax({
		type: 'POST',
        url: _URL_INTERFACE+"platform/basedata",
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
            "key":$("#key").val(),//键
            "type":type,
            "value":$("#value1").val(),//value1
            "value2":$("#value2").val(),//value2
            "value3":$("#value3").val(),//value3
            "value4":$("#value4").val(),//value4
            "value5":$("#value5").val(),//value5
            "remark":$("#remark").val(),//备注
             "value10":value,

		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('数据添加成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加数据成功");*/
				$('#editabledatatable').bootstrapTable("refresh");

				location.reload();

		},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#creatDataModal").modal('hide');
               /* commonAlert("#warningMsg", "#warningAlertBlock", "添加数据失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('数据添加失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});   	  
}
function  fnCreateData(){
    $("#creatDataModal").modal('show');
  menuValidator('#creatDataModal');//新增菜单//

}
//***********编辑菜单*************//
function updateMenu(){
	var type="";
	if($('#dataTypei_U').attr("class").indexOf("hidden")<=0){
		type=$('#dataTypei_U').val();

	}else{
		type=$('#dataTypes_U').val();
	}
	$.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+"platform/basedata",
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({

		    "key":$("#key_U").val(),//键
		    "type":type,//类型
		    "value":$("#value1_U").val(),//value1
		    "value2":$("#value2_U").val(),//value2
		    "value3":$("#value3_U").val(),//value3
		    "value4":$("#value4_U").val(),//value4
		    "value5":$("#value5_U").val(),//value5
		    "remark":$("#remark_U").val(),//备注
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$("#updateDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('数据编辑成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "编辑数据成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#updateDataModal").modal('hide');
               /* commonAlert("#warningMsg", "#warningAlertBlock", "编辑数据失败");*/
              $("#failmodal").modal('show');
              $("#failTitle").text('数据编辑失败');
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
   /* feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },*/
    submitHandler: function (validator, form, submitButton) {
    	if(obj=='#creatDataModal'){
    		createMenu();
    	}else{
    		updateMenu();
    	}
    },
    fields: {
    	dataType: {
           validators: {
               notEmpty: {
                    message: '类型不能为空'
                }
           }
       },
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
	  getType('#dataTypes');
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
     url: _URL_INTERFACE + getDataUrl +"&page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt,
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
      // url: _URL_INTERFACE+getDataUrl, method: 'GET', cache: false,
      ajaxOptions:{headers: {
          "token": token
      }},
        search: true,dataType: 'json',
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
          title: '类型', field: 'value10', searchable: true, sortable: true
        },  {
          title: '键', field: 'key', sortable: true, searchable: true
        }, {
          title: '值1', field: 'value', sortable: true, searchable: true
        },{
          title: '值2', field: 'value2',sortable: true, searchable: true, 
        },{
          title: '值3', field: 'value3',sortable: true, searchable: true, 
        },{
          title: '值4', field: 'value4',sortable: true, searchable: true, 
        },{
          title: '值5', field: 'value5',sortable: true, searchable: true, 
        },{
          title: '备注', field: 'remark',sortable: true, searchable: true, 
        }, {
          title: '操作', field: 'id',formatter: function (val, row, idx) {
  	  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
  	  			
          }
        }],
        // responseHandler: function (result) {
        // 	// if (result.msg=='OK') {
        //         return result.data;

        // // }  } else {
        // //         return [];
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
          menuValidator('#updateDataModal');//更新菜单//
        	getType('#dataTypes_U');
        	fnhandleupdate(id);
        }
      });
  }
//类型
 function getType(obj){
		$(obj).empty();
		$(obj).append("<option value=''>-请选择-</option>");
		
		$.ajax({
			type: 'GET',
            url: _URL_INTERFACE+'platform/value',
            headers: {
                "token": token
            },
			dataType: 'json',
      success:function (result) {
        var type = result.data;
        $("#dataTypes").empty();
        for (var i = 0; i < type.length; i++) {          
          $("#dataTypes").append("<option value='" + type[i].name + "' chinaName='"+type[i].value+"'> " + type[i].value + "</option>");
        }
       fnPretermit();
      },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status === 401){
                    window.location.href = '#/login.html';
                }else{
                    alert('新增失败');//其他操作
                }
            }
		});
 }


 function fnNewAdd(){
	  if($("#dataTypes").val()=="新增" ){
		  $('#typeselect').addClass('hidden');
		  $('#dataTypei').val();
			$('#typeinput').removeClass('hidden');
			/*$('#typeselect_U').addClass('hidden');
			$('#typeinput_U').removeClass('hidden');*/
			$('#dataTypes_U').val();
	  }
}

//权限控制
function fnPretermit(){
  var role_id=_user.role_id;
  if(role_id != '1'){
    //$(".portconfigure").hide();
   // $("#dataTypei").removeAttr('name');
    $("#typeinput").remove();
    $('#typeselect').removeClass('hidden');


  }else{
    $("#typeinput").show();
    $("#dataTypei").attr('name','dataType');
    $("#dataTypes").append('<option onclick="fnNewAdd()">新增</option>');

  }
}
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'platform/basedata',
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
					$("#key_U").val(data[i].key);//键
					$('#dataTypei_U').val(data[i].value10);//类型
				    $("#value1_U").val(data[i].value);//value1
				    $("#value2_U").val(data[i].value2);//value2
				    $("#value3_U").val(data[i].value3);//value3
				    $("#value4_U").val(data[i].value4);//value4
				    $("#value5_U").val(data[i].value5);//value5
				    $("#remark_U").val(data[i].remark);//备注
				    $("#basedataid").text(data[i].id);
				}
			}
			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('获取数据失败！');//其他操作
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
        url: _URL_INTERFACE+'platform/basedata',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
				/*commonAlert("#successMsg", "#successAlertBlock", "数据删除成功");*/
      $("#successmodal").modal('show');
      $("#successTitle").text('数据删除成功');
				$('#editabledatatable').bootstrapTable("refresh");
		},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                /*alert('数据删除失败！');//其他操作*/
              $("#failmodal").modal('show');
              $("#failTitle").text('数据删除失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
	});
}
function closeInputSelect() {
  $('#typeselect').removeClass('hidden');
	$('#typeinput').addClass('hidden');
	$('#typeselect_U').removeClass('hidden');
	$('#typeselect_U').val('请选择');
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