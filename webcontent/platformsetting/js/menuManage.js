$(document).ready(function (){
	getmenuData();//获取图表
});


menuValidator('#accountForm');//新增菜单//
menuValidator('#updateForm');//更新菜单//

//***********创建菜单*************//
function createMenu(){
	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'platform/menu',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "name":$("#name").val(),//菜单名称
		    "url":$("#url").val(),//资源路径
		    "status":"0",
		    "dom_style":$("#dom_style").val(),//DOM样式
		    "explain":$("#explain").val(),//说明
		    "pid":$("#pid").val(),//父菜单编号
		    "rank":$("#rank").val(),//排序
		    "lv":$("#menulv").val(),//菜单等级
		    "dom_class":$("#dom_class").val(),//DOM样式类
		    "dom_title":$("#dom_title").val(),//DOM TITLE
		    "target":$("#target").val(),//打开目标
		}),
		success:function (result) {
			$("#creatApplition").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('菜单添加成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "添加菜单成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#creatApplition").modal('hide');
              $("#failmodal").modal('show');
              $("#failTitle").text('菜单添加失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
               /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
            }
        }
	});   	  
}
function fnCreateMenu(){
    $("#creatApplition").modal('show');
}
//***********编辑菜单*************//
function updateMenu(){
	$.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+'platform/menu',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "name":$("#name_U").val(),//菜单名称
		    "url":$("#url_U").val(),//资源路径
		    "status":"0",
		    "dom_style":$("#dom_style_U").val(),//DOM样式
		    "explain":$("#explain_U").val(),//说明
		    "pid":$("#pid_U").val(),//父菜单编号
		    "rank":$("#rank_U").val(),//排序
		    "lv":$("#menulv_U").val(),//菜单等级
		    "dom_class":$("#dom_class_U").val(),//DOM样式类
		    "dom_title":$("#dom_title_U").val(),//DOM TITLE
		    "target":$("#target_U").val(),//打开目标
		    "id":$("#menuid_U").val()//菜单编号
		}),
		success:function (result) {
			$("#updateApplition").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('菜单编辑成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "编辑菜单成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#updateApplition").modal('hide');
              $("#failmodal").modal('show');
              $("#failTitle").text('菜单编辑失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
               /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
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
    	if(obj=='#accountForm'){
    		createMenu();
    	}else{
    		updateMenu();
    	}
    },
    fields: {
//       menuid: {
//            validators: {
//                notEmpty: {
//                    message: '菜单编号不能为空'
//                },
//                regexp: {
//                    regexp: /^[0-9]+$/,
//                    message: '用户名只为数字'
//                }
//            }
//        },
        menuname: {
            validators: {
                notEmpty: {
                    message: '菜单名称不能为空'
                }
            }
        },
        menulv: {
            validators: {
                notEmpty: {
                    message: '请选择菜单级别'
                }
            }
        },
//        parentid: {
//            validators: {
//                notEmpty: {
//                    message: '父菜单编号不能为空'
//                }
//            }
//        },
        menuurl:{
            validators: {
                notEmpty: {
                    message: '资源路径不能为空'
                }
            }
        },
        dom_class:{
            validators: {
                notEmpty: {
                    message: 'DOM样式类不能为空'
                }
            }
        }
    }
});
}
  $('#creatApplition').on('show.bs.modal', function () {
	  $("input").val('');
	});
//***********get表格*************//
 function getmenuData(){
  $('#editabledatatable').bootstrapTable({
      url: _URL_INTERFACE+"platform/menu", method: 'GET', cache: false,
      ajaxOptions:{headers: {
          "token": token
      }},search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'id',
        toolbar:'#btn-div',
        columns: [{					
          title: '菜单名称', field: 'name', searchable: true, sortable: true
        },  {
          title: '菜单说明', field: 'explain', sortable: true, searchable: true
        }, {
          title: '资源路径', field: 'url', sortable: true, searchable: true
        },{
          title: '菜单级别', field: 'lv',sortable: true, searchable: true, 
        },{
          title: '排序', field: 'rank',sortable: true, searchable: true, 
        }, {
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
        	$("#updateApplition").modal('show');
        	fnhandleupdate(id);
        }
      });
  }
 
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
        type: 'get',
        url: _URL_INTERFACE+'platform/menu',
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
					$("#name_U").val(data[i].name),//菜单名称
    			    $("#url_U").val(data[i].url),//资源路径
    			    //"status":"0",
    			    $("#dom_style_U").val(data[i].dom_style),//DOM样式
    			    $("#explain_U").val(data[i].explain),//说明
    			    $("#pid_U").val(data[i].pid),//父菜单编号
    			    $("#rank_U").val(data[i].rank),//排序
    			    $("#menulv_U").val(data[i].lv),//菜单等级
    			    $("#dom_class_U").val(data[i].dom_class),//DOM样式类
    			    $("#dom_title_U").val(data[i].dom_title),//DOM TITLE
    			    $("#target_U").val(data[i].target),//打开目标
    			    $("#menuid_U").val(data[i].id)//菜单编号
				}
			}
			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('更新数据失败！');//其他操作
            }
        }
	});
}
function fnUpdate(){
	$("#updateApplition").modal('show');
	
}
//删除菜单
function showdeleteModal(data){
	$("#DeleteMenu").modal("show");
	$("#deleteID").text(data);
}
function deleteMenu(){
	var id=$("#deleteID").text();
	$.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE+'platform/menu',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('菜单删除成功');
				/*commonAlert("#successMsg", "#successAlertBlock", "菜单删除成功");*/
				$('#editabledatatable').bootstrapTable("refresh");
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
              $("#failmodal").modal('show');
              $("#failTitle").text('菜单删除失败');
              $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
                /*alert('菜单删除失败！');//其他操作*/
            }
        }
	});
}
//父菜单
function fnmenulv(obj){
	var value=$(obj).val();
	if(value=="1"){
		if(obj.id=='menulv'){
			doHideDiv('#divId');
		}else{
			doHideDiv('#divId_U');
		}
		
	}else{
		if(obj.id=='menulv'){
			doGetOption(obj,'#divId','#pid');
		}else{
			doGetOption(obj,'#divId_U','#pid_U');
		}
	}
}
//get父菜单
function doGetOption(obj,a,b){
	$(a).show();
	$(b).empty();
	$(b).append("<option value='"+""+"'>"+"-请选择-"+"</option>");
	
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'platform/menu',
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "lv":$(obj).val()
		}),
		success:function (result) {
			var data=result.data;
			if(data.length != 0){
				for (var i = 0; i < data.length; i++){
					$(b).append("<option value='"+data[i].id+"'>"+data[i].name+"</option>"); 
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

function doHideDiv(c){
	$(c).hide();
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
//	$(alertObject).delay(4000).slideUp(slideUp, function() {
//	    $(this).hide();,slideUp
//	});
}