$(document).ready(function (){
	fndetail(netID);
	fngetData();//获取图表	
	fnGetGoal('tag');
	fnGetAppData();
	showMore('day');//网络监控
  // fnAppEvent();//事件查看
});

/*var params = parseParams(self.location.search);
var netID = params.netid;*/
var netID = getUrlParam('netid');
menuValidator('#creatDataModal');//创建网络规则//
menuValidator('#updateDataModal');//更新网络菜单//

function showrule(){
 $('#creatDataModal') .modal('show')
}

//***********创建网络规则*************//
$('#creatDataModal').on('show.bs.modal', function () {
	  $("#netid").val(netID);
	  
	});
function createNetworklist(){
	var dest_net='';
	if($('#typeinput').attr("class")=='hidden'){
		dest_net=$("#dest_net").val();
	}else{
		dest_net=$("#dataTypei").val();
	}
	$("#creatDataModal").modal('hide');
	$("#tips").modal("show");
  $("#tipsText").text("正在创建，请稍后...");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"network/policy",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "net_id":$("#netid").val(),//netid
		    "type":$("#net_type").val(),//网络类型
		    "ingress":$("#ingress").val(),//入网
		    "egress":$("#egress").val(),//出网
		    "dest_net":dest_net,//目标网络
		    
		}),
		success:function (result) {
			 $("#tips").modal('hide');
     		 $("#successModal").modal('show');
     		 $("#SucessTitle").text("创建成功");
				/*commonAlert("#successMsg", "#successAlertBlock", "创建成功");*/
			 $('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#tips").modal('hide');
        $("#failmodal").modal('show');
        $("#failtitle").text("创建失败");
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
        /*commonAlert("#warningMsg", "#warningAlertBlock", "创建失败");*/
      }
    }
	});   	  
}

//***********更新菜单*************//
function updateNetworkList(){
	var dest_net='';
	if($('#typeinput_U').attr("class")=='hidden'){
		dest_net=$("#dest_net_U").val();
	}else{
		dest_net=$("#dataTypei_U").val();
	}
	$("#updateDataModal").modal('hide');
	$("#tips").modal('show');
  $("#tipsText").text("正在更新中，请稍后。。。。。");
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"network/policy",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":$("#net_type_U").val(),//网络类型
		    "net_id":$("#netid_U").val(),//网络ID
		    "dest_net":dest_net,// 目标网络
		    "ingress":$("#ingress_U").val(),//入网
		    "egress":$("#egress_U").val(),//出网
		    "id":$("#basedataid").text()
		    
		}),
		success:function (result) {
			$("#tips").modal('hide');
      $("#successModal").modal('show');
      $("#SucessTitle").text("编辑成功");
				$('#editabledatatable').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#tips").modal('hide');
        $("#failmodal").modal('show');
        $("#failtitle").text("编辑失败");
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
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
    		createNetworklist();
    	}else{
    		updateNetworkList();
    	}
    },
    fields: {
    	ingress: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                },
		   
            }
        },
        egress: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                },
       
        
            }
        },
        empty: {
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                }
            }
        },
        dest_net:{
            validators: {
                notEmpty: {
                    message: '此项不允许为空'
                }
            }
        }
    }
});
}
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"network/policy/"+netID,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data=result.data;
			for(var i=0;i<data.length;i++){
				if(data[i].id == id){
					$("#net_type_U").val(data[i].type);//网络类型
					$('#netid_U').val(data[i].net_id);//网络ID
					if(data[i].type=="tag"){
						$("#dest_net_U").removeClass("hidden");
						$("#typeinput_U").addClass("hidden");
						$("#dest_net_U").val(data[i].dest_net);//目标网络
					}else{
						$("#dest_net_U").addClass("hidden");
						$("#typeinput_U").removeClass("hidden");
						$("#dataTypei_U").val(data[i].dest_net);//目标网络
					}
				    
				    $("#ingress_U").val(data[i].ingress);//入网
				    $("#egress_U").val(data[i].egress);//出网
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

//***********get表格*************//
 function fngetData(){
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE+ "network/policy/"+netID,
    method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: false,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'net_id',
        toolbar:'#btn-div',					
        columns: [   {
          title: '网络类型', field: 'type', sortable: true, searchable: true
        },  {
          title: '目标网络', field: 'dest_net', sortable: true, searchable: true
        }, {
          title: '入网', field: 'ingress', sortable: true, searchable: true,
          formatter: function (val, row, idx) {
           	  if(val=='1'){
           		  return '<span class="success"><i class="fa fa-check-circle-o padding-right-5"></i>允许</span>';
           	  }else if(val=='0'){
           		  return '<span class="darkorange"><i class="fa  fa-minus-square-o padding-right-5"></i>禁止</span>';
           	  }
             }
        },{
          title: '出网', field: 'egress', sortable: true, searchable: true,
          formatter: function (val, row, idx) {
           	  if(val=='1'){
           		  return '<span class="success"><i class="fa fa-check-circle-o padding-right-5"></i>允许</span>';
           	  }else if(val=='0'){
           		  return '<span class="darkorange"><i class="fa  fa-minus-square-o padding-right-5"></i>禁止</span>';
           	  }
             }
        },{
          title: '创建时间', field: 'create_time',sortable: true, searchable: true 
        }, {
          title: '操作', field: 'id',formatter: function (val, row, idx) {
        	  var netId=row["net_id"];
        	  var dest_net=row["dest_net"];
        	  var net_typet=row["type"];
        	  var value=netId+","+dest_net+","+net_typet;
        	  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\''+value+'\')"><i class="fa fa-trash-o"></i>删除</a>';
        	 
  	  		  	  			
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
	        	var id=data.id;
	        	$("#updateDataModal").modal('show');
	        	fnhandleupdate(id);
	        }
        
      });
  }

//事件查看
/*function fnAppEvent(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/event/log?app_id="+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      fnDataEvent();
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
function fnDataEvent(){
  $('#Networkinfo').bootstrapTable({
    url: _URL_INTERFACE+"apps/event/log?app_id="+app_id, method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: true,dataType: 'json',
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',
    toolbar:'#btn-div',
    columns: [{
      field: 'type',
      formatter: function (val, row, idx) {
        var _html='';
        _html+='<li class="ticket-item">';
        _html+='<div class="row">';
        _html+='<div class="ticket-user col-lg-10 col-sm-10">';
        _html+='<span class="user-name padding-top-10">'+val+'</span>';
        if(row['result']=="0"){
          _html+='<span class="user-at">成功</span>';
        }else{
          _html+='<span class="user-at">失败</span>';
        }

        _html+='<span class="user-company">'+row['detail']+'。</span>';
        if(val=="应用扩缩容"){
          _html+='<span class="user-company">详细信息：'+row['verbose']+'</span>';
        }

        _html+='</div> ';
        _html+='<div class="ticket-time  col-lg-2 col-sm-2 col-xs-12">';
        _html+='<div class="divider hidden-md hidden-sm hidden-xs"></div>';
        _html+='<i class="fa fa-clock-o"></i>' +
          '<span class="time">'+row['create_time']+'</span> </div>';
        if(row['result']=="0"){
          _html+='<div class="ticket-state bg-palegreen"><i class="fa fa-check"></i></div>';
        }else{
          _html+='<div class="ticket-state bg-darkorange"><i class="fa fa-times"></i></div>';
        }

        _html+='</div></li>';

        return _html;
      }
    }],
    responseHandler: function (result) {
      return result.data;
    },
    onSearch: function (text) {
    }
  });

}*/


 /* 获取应用列表*/
 function fnGetAppData(){
	  $('#appTable').bootstrapTable({
      url: _URL_INTERFACE+"networkapps/"+netID,
      method: 'GET', cache: false,
      ajaxOptions:{headers: {
        "token": token
      }},search: false,dataType: 'json',
	        pagination: true, pageSize: 10,//data:"result.data",
	        uniqueId: 'net_id',
	        toolbar:'#btn-div',					
	        columns: [{
	          title: '系统名称', field: 'sys_name', sortable: true, searchable: true
	        }, {
	          title: '应用名称', field: 'app_name', sortable: true, searchable: true
	        },{
	          title: '状态', field: 'status',sortable: true, searchable: true ,
	          formatter: function (val, row, idx) {
	           	  if(val=='1'){
	           		  return '<span class="label label-success label-sm">已发布</span>';
	           	  }else if(val=='2'){
	           		  return '<span class="label label-warning label-sm">已暂停</span>';
	           	  }else if(val=='0'){
	           		  return '<span class="label label-default label-sm">未发布</span>';
	           	  }else if(val=='3'){
	           		  return '<span class="label label-danger label-sm">发布失败</span>';
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
		        	
		        }
	        
	      });
	  }
 ////获取net_id值///////
 function fndetail(net_id){
		$.ajax({
      type: 'get',
      url: _URL_INTERFACE+"singlenetwork/"+net_id,
      headers: {
        "token": token
      },
			dataType: 'json',
			success:function (result) {
					var data=result.data;
					fnhandleData(data);
			},
      error:function (XMLHttpRequest, textStatus, errorThrown) {
        if(XMLHttpRequest.status === 401){
          window.location.href ='#/login.html';
        }else{
         // alert('添加失败！（例子）');//其他操作
        }
      }
		});
	}
	function fnhandleData(data){
		$("#net_name").text(data[0].name);
		$("#currentnet").text(data[0].name);
		$("#net_id").text(data[0].net_id);
		$("#Net_subnet").text(data[0].subnet);
		$("#create_time").text(data[0].create_time);
        $("#cluster_name").text(data[0].cluster_name);
		
	}
	//获取目标网络
	function fnGetGoal(type){
		$.ajax({
      type: 'get',
      url: _URL_INTERFACE+"type/"+type,
      headers: {
        "token": token
      },
			dataType: 'json',
			success:function (result) {
				$("[name='dest_net']").empty();
					var data=result.data;
					for(var i=0;i<data.length;i++){
						if(data[i].net_id!=netID){
							$("[name='dest_net']").append('<option value="'+data[i].net_id+'">'+data[i].name+'</option>');
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
 
//删除菜单
 function showdeleteModal(data){
	 var arr=data.split(",");
 	$("#DeleteData").modal("show");
 	$("#deleteID").text(arr[0]);
 	$("#_dest_net").text(arr[1]);
 	$("#net_type").text(arr[2]);
 }
 function deleteData(){
 	var id=$("#deleteID").text();
 	var dest_net=$("#_dest_net").text();
 	var type=$("#net_type").text();
 	$("#DeleteData").modal("hide");
 	$("#tips").modal("show");
   $("#tipsText").text("正在删除中，请稍后。。。。。");
 	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"network/policy",
    headers: {
      "token": token
    },
 		dataType: 'json',
 		data:JSON.stringify({
 		    "net_id":id,
 		    "dest_net":dest_net,
 		    "type":type
 		    
 		}),
 		success:function (result) {
 			$("#tips").modal("hide");
      $("#successModal").modal('show');
      $("#SucessTitle").text("删除成功");
 				/*commonAlert("#successMsg", "#successAlertBlock", "网络策略删除成功");*/
 				$('#editabledatatable').bootstrapTable("refresh");

 		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#tips").modal("hide");
        $("#failmodal").modal('show');
        $("#failtitle").text("删除失败");
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
 	});
 }
 //网络类型改变事件
function netTypeChange(obj){
	var value=$(obj).val();
	if(value=='tag'){
		$("#typeinput").addClass("hidden");
		$("#dest_net").removeClass("hidden");
		fnGetGoal("tag");
	}else{
		$("#typeinput").removeClass("hidden");
		$("#dest_net").addClass("hidden");
		fnGetGoal("cidr");
	}
}
//网络监控
function showMore(sort){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"monitor/network?net_id="+netID+"&scope="+sort,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
					markEchart(data,sort);
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
function markEchart(data,type){
	var myChart = echarts.init(document.getElementById('NetWorkCPU'));
    var two=[],time=[],app_name=["网络I/O"];
	if(data.length=="0"){
		
	}else{
    	for(var i=0;i<data.value2.length;i++){//时间
        	two.push(data.value2[i].value);
        }
	}

	(function getData(data) {   
	var option = {
		    title: {
		        text: '网络I/O'
		        /*subtext: '单位（核）间隔：5分钟'*/
		    },
		    tooltip: {
		        trigger: 'axis'
		    },
		    toolbox: {
		        show: true,    
		    },
		    xAxis:  {
		        type: 'category',
		        boundaryGap: false,
		        data: time
		    },
		    yAxis: {
		        type: 'value',
		        axisLabel: {
		            formatter: '{value} %'
		        }
		    },
		    visualMap: {
		        show: false,
		        dimension: 0,
		        pieces: [{
		            lte: 6,
		            color: 'green'
		        }, {
		            gt: 6,
		            lte: 8,
		            color: 'green'
		        }, {
		            gt: 8,
		            lte: 14,
		            color: 'green'
		        }, {
		            gt: 14,
		            lte: 17,
		            color: 'red'
		        }, {
		            gt: 17,
		            color: 'green'
		        }]
		    },
		    series: [{name:app_name[0],
	            type:'line',
	            stack: '总量'+[0],
	            data:two}
	            ]
		}; 
	// 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
	 })();    
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
	
	
	
