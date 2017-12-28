$(document).ready(function (){

	fngetData();//获取图表	
    fnGetPool();
});


menuValidator('#creatDataModal');//新增网络//

function showCreatnerwork(){
  $('#creatDataModal').modal('show');
}


//***********创建网络*************//
function createNetwork(){
    var cluster=$("#cluster_object").selectpicker('val');
    var resourcePool=$("#ResourcesPool").find('.btn-info ').text();
    var clusterName;
    if(cluster=="sandun"){
        clusterName="三墩集群";
    }else{
        clusterName="石桥集群";
    }
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+'network',
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
      'username':_user.username,
		    "type":"tag",//网络类型
		    "net_id":$("#net_id").val(),//网络ID
		    "name":$("#net_name").val(),//网络名称
		    "subnet":$("#Net_subnet").val(),//子网
            "cluster_name":clusterName
		}),
		success:function (result) {
        $("#creatDataModal").modal('hide');
      $("#successmodal").modal('show');
      $("#successTitle").text('网络添加成功！！');
      $('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#creatDataModal").modal('hide');
        /*commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");*/
        $("#failmodal").modal('show');
        $("#failTitle").text('网络添加失败！！');
        $("#failSpan").text(JSON.parse(XMLHttpRequest.responseText).msg)
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
    
    submitHandler: function (validator, form, submitButton) {
    	if(obj=='#creatDataModal'){
    		createNetwork();
    	}else{
    		updateMenu("0");
    	}
    },
    fields: {
    	net_id: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                },
		    regexp: {
		  	  regexp: 	
		  		  /^[a-z0-9\.\-/]*$/,
		  	  message: '仅允许小写字母、数字、- 、/ 和 .'
		    }
            }
        },
        Net_subnet: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                },
        regexp: {
      	  regexp: 	
      		  /^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/,
      	  message: '请输入正确的子网。例：192.168.100.1/24 '
        }
        
            }
        },
        empty: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                }
            }
        },
        cluster_object:{
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                }
            }
        },
        content:{
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                }
            }
        }
    }
});
}
  $('#creatDataModal').on('show.bs.modal', function () {
	  $("input").val('');
	  
	});
//***********get表格*************//
 function fngetData(){
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE+'network',
    method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'net_id',
        toolbar:'#btn-div',					
        columns: [{					
          title: '网络ID', field: 'net_id', searchable: true, sortable: true,
          formatter: function (val, row, index) {
        	  
        	  var html='';
        	  html='<a href="#/webcontent/Network/Networklist.html?netid='+val+'" >'+val+'</a>';
          	  return html;
			}
        }, {
                title: '所属集群', field: 'cluster_name',sortable: true, searchable: true
            },{
          title: '网络名称', field: 'name', sortable: true, searchable: true
        }, {
          title: '网段', field: 'subnet', sortable: true, searchable: true
        },{
          title: '创建时间', field: 'create_time',sortable: true, searchable: true 
        }, {
          title: '操作', field: 'id',formatter: function (val, row, idx) {
        	  var netId=row["net_id"];
        	  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\''+netId+'\')"><i class="fa fa-trash-o"></i>删除</a>';
        	 
  	  		  	  			
          }
        }],
        responseHandler: function (result) {
        	//if (result.msg=='OK') {
                return result.data;
           //    } else {
           //      return [];
           //    }
        	// //return result;
        },
        onSearch: function (text) {
			console.info(text);
		},
        onLoadSuccess: function (data) {
        }
        
      });
  }
 
//删除菜单
 function showdeleteModal(data){
 	$("#DeleteData").modal("show");
 	$("#deleteID").text(data);
 }
 function deleteData(){
 	var id=$("#deleteID").text();
   $("#tips").modal("show");
 	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+'network',
    headers: {
      "token": token
    },
 		dataType: 'json',
 		data:JSON.stringify({
 		    "net_id":id
 		}),
 		success:function (result) {
      $("#tips").modal("hide");
      $("#successmodal").modal('show');
      $("#successTitle").text('删除成功！！');

 				/*commonAlert("#successMsg", "#successAlertBlock", "网络删除成功");*/
      $('#editabledatatable').bootstrapTable("refresh");
 		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       /* commonAlert("#warningMsg", "#warningAlertBlock", '网络删除失败');*/
        $("#tips").modal("hide");
        $("#failmodal").modal('show');
        $("#failTitle").text('删除失败！！');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
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

/*	function commonAlert(msgObjectName,alertObject,msg)
	{
		$(msgObjectName).html(msg);
		$(alertObject).show();
	}*/
document.getElementById("ResourcesPool").addEventListener("click",fnChangePool,false);
//资源池
function fnChangePool(event) {
    $("#ResourcesPool").find("a").attr('class', "btn btn-default margin-right-10");
    var clustername = '';
    if (event.target && event.target.nodeName == "A") {
        // 找到目标，输出ID!
        event.target.className = "btn btn-info margin-right-10";
        fnGetCluster(event.target.attributes.value.nodeValue);
    }
}
function fnGetPool(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/domain?type=app_resources_production_domain",
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $("#ResourcesPool").empty();
            var _html='';
            if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    if(i==0){
                        _html +='<a href="javascript:void(0);" class="btn btn-info" value="'+data[i].code+'">'+data[i].name+'</a>';
                    }else{
                        _html +='<a href="javascript:void(0);" class="btn btn-default" value="'+data[i].code+'">'+data[i].name+'</a>';
                    }

                }
            }
            $("#ResourcesPool").html(_html);
            var code=$("#ResourcesPool").find('.btn-info').attr('value');
            fnGetCluster(code);
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

function fnGetCluster(code){
    var target = $("select[name='cluster_object']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"cluster/resourcedomain/"+code,
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    target.append("<option value='" + data[i].label + "'>" + data[i].name + "</option>");
                }
                $("select[name='cluster_object']").parent().nextAll(".red").html("");
            }
            else{
                $("select[name='cluster_object']").parent().nextAll(".red").html("该资源池下没有可选集群");
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