$(document).ready(function (){
	initServiceListTable();
});

function test_getServiceListTable(){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"services/services",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fnnet_Volume(data);
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！ （例子）');//其他 操作
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

function inBusy(content){
	$('#tips span').html(content);
	$('#tips').modal('show');
}

function notBusy(){
	$('#tips').modal('hide');
}

function alertShow(title, content){
	$('#MsgAlertTitle').html(title);
	$('#MsgAlertContent').html(content);
	$('#MsgAlertModal').modal('show');
}

function serviceListParams(){
	return { "_uri": "services/services",
		     "_method": "GET"}
}


function initServiceListTable(){
  $('#service-list-table').bootstrapTable('destroy');
    	$('#service-list-table').bootstrapTable({
            url:_URL_INTERFACE+"services",ajaxOptions:{headers: {
          "token": token
        }},
	        method: 'GET', cache: false,
            contentType: 'application/json', search: true,dataType: 'json',
            pagination: true, pageSize: 10,//data:"result.data",
            uniqueId: 'id',
            toolbar:'#btn-div',
            columns: [{					
              title: '系统名称', field: 'sys_name', searchable: true, sortable: true,
              formatter: function (val, row, idx) {
             	 var value=row['seq'],type=row['type'],status=row['status'];
             	 var html='';
                  html='<a href="#/webcontent/server/mysql1.html?seq_id='+value+'&seq_type='+type+'&seq_status='+status+'" >'+val+'</a>';

                  return html;
              			  /*'<a href="Application.html?'+value+'">'+val+'</a>';*/
                }
            },  {
              title: '服务类型', field: 'type', sortable: true, searchable: true
            }, {
              title: '版本', field: 'version', sortable: true, searchable: true
            },{
              title: '容器数', field: 'instance_num',sortable: true, searchable: true, 
            },{
              title: 'cpu(核)', field: 'cpus',sortable: true, searchable: true, 
            },{
              title: '内存(MB)', field: 'mem',sortable: true, searchable: true, 
            },{
              title: '运行状态', field: 'status',sortable: true, searchable: true, 
              formatter: function (val, row, idx) {
              	  if(val=="1"){
              		  return '<span class="label label-success label-sm">运行中</span>';
              	  }else if(val=="2"){
              		 return '<span>服务创建中，请稍后 <i class="fa fa-spin fa-spinner"></i></span>';
              	  }else if(val=="3"){
                    return '<span class="label label-default  label-sm">创建失败</span>';
                  }
              	  			
                }
            },{
              title: '创建时间', field: 'create_time',sortable: true, searchable: true, 
            }, {
              title: '操作', field: 'id',formatter: function (val, row, idx) {
                var value=row['seq']+','+row['type'];
                if(row['status']=='2'){
                  return '<a href="javascript:void(0)" class="btn btn-default btn-sm"><i class="fa fa-trash-o"></i>删除</a>';
                }else{
                  return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\''+value+'\')"><i class="fa fa-trash-o"></i>删除</a>';
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
function showdeleteModal(val){
  $("#delete-mysql-modal").modal("show");
$("#seq_id").text(val);
}
$("#delete-mysql").click(function(){
	var str=$("#seq_id").text().split(',');
  $("#tips").modal('show');
  var url='';
  if(str[1]=='mysql'){
    url= _URL_INTERFACE+"services/mysql/"+str[0];
  }else{
    url=_URL_INTERFACE+"services/redis/"+str[0];
  }
  $.ajax({
    type: 'DELETE',
    url:url,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      $("#tips").modal('hide');
      $("#successmodal").modal('show');
      $("#tipsSpan").text('删除成功！')
      $('#editabledatatable').bootstrapTable("refresh");
      //$("#profile11").tab('show');
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      $("#tips").modal('hide');
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
      	$("#failtitle").text('删除失败！')
        $("#failmodal").modal('show');
        $('#editabledatatable').bootstrapTable("refresh");
      }
    }
  });
});

function initServiceInfo(){
	var id = getUrlParam("id");
	$.ajax({
		 type: 'get',
    url: _URL_INTERFACE+"services/service_info?id="+id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				$("#serveType").text(data.type);
				$('#handleBtn').empty();var html='';
				if(data.type=="centos" || data.type=="ubuntu" || data.type=="redis"){	
					html='<a class="btn btn-azure" href="#" onclick="fnModalShow(\'服务重启\')"><i class="fa  fa-refresh"></i></i>服务重启</a>'
						+'<a class="btn btn-azure" href="#" onclick="updateMysql()"><class="padding-right-10 fa fa-arrow-up"></i></i>版本升级</a>'
						if(data.status=1){
							+'<a class="btn btn-azure" href="#" onclick="fnModalShow(\'服务停止\')"><i class="fa  fa-pause"></i>服务停止</a>'
						}else{
							+'<a class="btn btn-azure" href="#" onclick="fnModalShow(\'服务启动\')"><i class="fa  fa-play"></i>服务启动</a>'
							
						}
						if(data.type=="centos" || data.type=="ubuntu" ){
							 +'<div class="btn-group">'
	                         +'<a class="btn  btn-azure" href="javascript:void(0);"><i class="fa fa fa-th"></i>更多操作</a>'
	                        +'<a class="btn  btn-azure  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i class="fa fa-angle-down"></i></a>'
	                        +'<ul class="dropdown-menu">'
	                        +'<li><a href="javascript:updateMysql();"><i class="padding-right-10 fa fa-arrow-up"></i>Webssh</a></li>'
	                        +'</ul></div>';
						}
                       	
				}else{
					html='<a class="btn btn-azure" href="#" data-toggle="modal" data-target="#modal-info"><i class="fa  fa-keyboard-o"></i>密码重置</a>'
                       	+'<a class="btn btn-azure"><i class="fa  fa-map-o"></i>管理mysql</a>'
                       	+'<div class="btn-group">'
                       	+'<a class="btn  btn-azure" href="javascript:void(0);"><i class="fa fa fa-th"></i>更多操作</a>'
                       	+'<a class="btn  btn-azure  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i class="fa fa-angle-down"></i></a>'
                       	+' <ul class="dropdown-menu">'
                       	+'<li><a href="javascript:updateMysql();"><i class="padding-right-10 fa fa-arrow-up"></i>版本升级</a></li>'
                       	+' <li><a href="javascript:scaleService();"><i class="padding-right-10 fa fa-exchange"></i>扩缩容</a></li>'
                       	+'<li class="divider"></li>'
                       	+'<li><a href="javascript:deleteMysql();"><i class="padding-right-10 fa fa-trash-o"></i>删除服务</a></li>'
                       	+' </ul></div>';
				}
				$('#handleBtn').html(html);
				if(data.status=1){
					$('#service-status').attr("class", "label label-sm label-success");
				    $('#service-status').html("运行");
				}
				else{
					$('#service-status').attr("class", "label label-sm label-default");
				    $('#service-status').html("未运行");
				}
				$('#service-name').html(data.name);
				$('#service-app-id').val(data.app_id);
				$('#service-marathon-name').val(data.marathon_name);
				$('#service-zk-hosts').val(data.zk_hosts);
				$('#service-cpus').html(data.cpus);
				$('#service-mem').html(data.mem);
				$('#service-inst-num').html(data.instance_num);
				$('#service-ip').html(data.ip);
				$('#service-image').html(data.version);
				$('#service-username').html(data.username);
				$('#service-password').html(data.password);
				$('#slider-move').val(data.instance_num);
				$('#slider-value').val(String(data.instance_num)+".00");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert("错误:", "网络问题更新失败!");//其他操作
      }
    }
	});
}
function fnModalShow(title){
	$("#RestartContainer").modal("show");
	$("#modalTitle").text(title);
}
function fuResartCon(){
	if($("#modalTitle").text()=="服务重启"){
		fnRestartSever();
	}else{
		fnStartStop();
	}
}
//服务重启
function fnRestartSever(){
	var id = getUrlParam("id");
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"services/restart",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id": id,
	        "app_id":$('#service-app-id').val(),
	        "marathon_name":$('#service-marathon-name').val(),
	        "zk_hosts": $('service-zk-hosts').val()
		}),
		success:function (result) {
			notBusy();
				alertShow("提示:", "服务重启成功!");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        alertShow("提示:", "服务重启失败!");
      }
    }
	});
}
//启停事件
function fnStartStop(){
	var id = getUrlParam("id");
	var switchnum='';
	if($('#service-status').html()=="运行"){
		switchnum="0";
	}else{
		switchnum="1";
	}
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"services/restart",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id": id,
	        "app_id":$('#service-app-id').val(),
	        "marathon_name":$('#service-marathon-name').val(),
	        "zk_hosts": $('service-zk-hosts').val(),
	        "switch": switchnum
		}),
		success:function (result) {
			notBusy();
				alertShow("提示:", "操作成功!");

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alertShow("提示:", "操作失败!");
      }
    }
	});
}
function resetMysqlPassword(){
	var password = "123456789"
	var app_id = $('#service-app-id').val();
	var marathon_name = $('#service-marathon-name').val();
	var zk_hosts = $('#service-zk-hosts').val();
	inBusy("重置密码中...");
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"services/mysql_password",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "password": password,
		    "app_id": app_id,
		    "marathon_name": marathon_name,
		    "zk_hosts": zk_hosts 
		}),
		success: function(result) {
			notBusy();
				alertShow("提示:", "密码重置成功!");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alertShow("提示:", "密码重置失败!");
      }
    }
    })
}

function deleteMysql(){
	$('#delete-mysql-modal').modal('show');
	var id = getUrlParam("id");
	var password = "123456789";
	var app_id = $('#service-app-id').val();
	var marathon_name = $('#service-marathon-name').val();
	var zk_hosts = $('#service-zk-hosts').val();
	$('#delete-mysql').on("click",function(){
		inBusy("正在删除服务...");
	    $.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE+"services/mysql",
        headers: {
          "token": token
        },
	    	dataType: 'json',
	    	data:JSON.stringify({
	    	    "id": id,
	    	    "app_id": app_id,
	    	    "marathon_name": marathon_name,
	    	    "zk_hosts": zk_hosts 
	    	}),
	    	success: function(result) {
	    		notBusy();
	    			$('#alert-delete-success').modal('show');

	    	},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status === 401){
            window.location.href = '#/login.html';
          }else{
            alertShow("提示:", "删除服务失败!");
          }
        }
        })
	
	});
}

function bindResetMysqlPasswd(){
	$('#reset-mysql-password').on('click', function(){
        resetMysqlPassword();
	});
}

function bindConfirmDelMysql(){
	$('#confirm-delete-success').on("click",function(){
		window.location.href="#/webcontent/server/servercluster.html";
	});
}

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
			$(inputobj).val(values);
		  }
	});
	//$( obj ).slider( "destroy" );	
	
}

//手动扩缩
var scaleSlider = null;
$("#doScaleService").on('show.bs.modal', function () {
	if(scaleSlider == null){
		scaleSlider = fnnoUiSlider("#slider-move","#slider-value",0,10);
	}
	$("#slider-move").val($("#slider-value").val());
});

function scaleService(){
	$('#doScaleService').modal('show');
	$('#doScaleService button[name="confirm"]').off("click")
	$('#doScaleService button[name="confirm"]').on("click", function(){
		$('#doScaleService').modal('hide');
		var inst_num_old = parseInt($('#service-inst-num').html());
		var inst_num_new = parseInt($('#slider-value').val());
		if(inst_num_old==inst_num_new){
			return
		}
		$('#ConfirmTitle').html("服务扩缩容确认:");
		$('#ConfirmContent').html("确定要进行扩缩容操作吗？");
		$('#ConfirmModal').modal('show');
		$('#ConfirmModal button[name="confirm"]').off("click")
		$('#ConfirmModal button[name="confirm"]').on("click",function(){
			$('#ConfirmModal').modal('hide');
			var marathon_name = $('#service-marathon-name').val();
			var zk_hosts = $('#service-zk-hosts').val();
			var app_id = $('#service-app-id').val();
			var id = getUrlParam("id");
			$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"services/scale",
        headers: {
          "token": token
        },
				dataType: 'json',
				data: JSON.stringify({
					"id": id,
					"inst_num": inst_num_new,
					"app_id": app_id,
					"marathon_name": marathon_name,
					"zk_hosts": zk_hosts
				}),
				success: function(resp){
					alertShow("提示:", "扩缩容");
				},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status === 401){
            window.location.href = '#/login.html';
          }else{
            alertShow("提示:", "扩缩容异常，请检查网络状态!");
          }
        }
			});
		});
	});
}

function updateMysql(){
	$('#UpdateModal').modal('show');
	$('#UpdateModal button[name="confirm"]').off("click")
	$('#UpdateModal button[name="confirm"]').on("click", function(){
		$('#UpdateModal').modal('hide');
		var service_img_old = $('#service-image').html();
		var service_img_new = $('#mysql-version-select option:selected').val();
		if(service_img_old==service_img_new){
			return
		}
		$('#ConfirmTitle').html("MySQL版本升级确认:");
		$('#ConfirmContent').html("确定要升级MySQL版本吗？");
		$('#ConfirmModal').modal('show');
		$('#ConfirmModal button[name="confirm"]').off("click")
		$('#ConfirmModal button[name="confirm"]').on("click",function(){
			$('#ConfirmModal').modal('hide');
			var marathon_name = $('#service-marathon-name').val();
			var zk_hosts = $('#service-zk-hosts').val();
			var app_id = $('#service-app-id').val();
			var id = getUrlParam("id");
			$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"services/mysql/version",
        headers: {
          "token": token
        },
				dataType: 'json',
				data: JSON.stringify({
					"id": id,
					"mysql_version": service_img_new,
					"app_id": app_id,
					"marathon_name": marathon_name,
					"zk_hosts": zk_hosts
				}),
				success: function(resp){
					h = window.location.href;
					window.location.href = h;
				},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
          if(XMLHttpRequest.status === 401){
            window.location.href = '#/login.html';
          }else{
            alertShow("提示:", "扩缩容异常，请检查网络状态!");
          }
        }
			});
		});
	});
}

function echartServiceProc(url_name,type,show_id){
	var app_id = $('#service-app-id').val()
	if(app_id==undefined || app_id==''){
		return
	}
	var base_urls = {"cpu": "monitor/apps/history/cpu",
			         "mem": "monitor/apps/history/mem",
			         "mysqlcon": "services/monitor/mysqlcon"}
	var titles = {"cpu": "CPU",
			      "mem": "内存",
			      "mysqlcon": "MySQL连接数"}
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+ base_urls[url_name]+"?type="+type+"&app_id="+app_id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				if(data.length>0){
					var date=[],value=[];
					for(var i=0;i<data.length;i++){
						var aa=data[i];
						date.push(aa[0]);
						value.push(aa[1]);
					}
					echart(show_id,titles[url_name],date,value);
				}else{
					var _html="";
					_html+="<h2><stronge>"+c+"</stronge></h2>";
					_html+="<p>暂无查询记录</p>";
					$("#moreEchart").html(_html);
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

function echart(show_id,title,date,value){
     var myChart = echarts.init(document.getElementById(show_id));
     
     option = {
	 title : {
	     text: title
	 },
	 tooltip : {
	     trigger: 'axis'
	 },
	 color:['#343568'],
	 legend: {
	     data:['使用率'],
	     bottom: 'bottom'
	 },
	
	 calculable : true,
	 xAxis : [
	     {
	         type : 'category',
	         boundaryGap : false,
	         data : date
	     }
	 ],
	 yAxis : [
	     {
	         type : 'value'
	     }
	 ],
	 series : [
	     {
	         name:'使用率',
	         type:'line',
	         smooth:true,
	         areaStyle: {
	         normal: {
	                 color: new echarts.graphic.LinearGradient(0, 0,0,1, [{
	                     offset: 0,
	                     color: 'rgba(0, 0, 0, 0.2)'
	                 }, {
	                     offset: 0.5,
	                     color: 'rgba(0, 0, 0, 0.08)'
	                 }, {
	                     offset: 0.8,
	                     color: 'rgba(0, 0, 0, 0.05)'
	                 }, {
	                     offset: 0.92,
	                     color: 'transparent'
	                 }, {
	                     offset: 1,
	                      color: 'transparent'
	                 }])
	             }
	     },
	         data:value
	     },         
	 ]};     // 使用刚指定的配置项和数据显示图表。
     myChart.setOption(option);
}

function bindDateQueryBtns(){

	$('#day-query').on('click',function(){
		echartServiceProc('cpu', 'd', "CPUused");
		echartServiceProc('mem', 'd', "MemUsed");
		echartServiceProc('mysqlcon', 'd', "MySQLConnect");
	});
	
	$('#week-query').on('click',function(){
		echartServiceProc('cpu', 'w', "CPUused");
		echartServiceProc('mem', 'w', "MemUsed");
		echartServiceProc('mysqlcon', 'w', "MySQLConnect");
	});
	
	$('#month-query').on('click',function(){
		echartServiceProc('cpu', 'm', "CPUused");
		echartServiceProc('mem', 'm', "MemUsed");
		echartServiceProc('mysqlcon', 'm', "MySQLConnect");
	})
	
}

function initContainersTable(){
	 var app_id = $('#service-app-id').val();
	 $('#service-containers-table').bootstrapTable({
	       url: _URL_INTERFACE+"apps/container/list?app_id="+app_id, method: 'GET', cache: false,
     ajaxOptions:{headers: {
       "token": token
     }}, search: false,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'id',
	       toolbar:'#btn-div',
	       columns: [{					
	         title: '容器ID', field: 'id', searchable: true, sortable: true,class:"tdoverflow"
	       },  {
	         title: '节点', field: 'host', sortable: true, searchable: true
	       },{
	         title: '端口', field: 'ports', sortable: true, searchable: true
	       },{
	         title: '所属集群', field: 'label', sortable: true, searchable: true
	       },{
	         title: '启动时间', field: 'started_at', sortable: true, searchable: true,
	       },{
	         title: '运行状态', field: 'state', sortable: true, searchable: true,
	         formatter: function (val, row, idx) {
		       	  if(val=='TASK_RUNNING'){
		       		  return '<span class="label label-success label-sm">运行中</span>';
		       	  }else if(val=='TASK_STAGING'){
		       		  return '<span class="label label-warning label-sm">启动中</span>';
		       	  }
	         }
	       },{
	         title: '操作', field: 'app_id',formatter: function (val, row, idx) {
	        	 var data=row['app_id']+","+row['id'],threaddump='threaddump',containerlog='containerlog';
	        	 var containerHtml='';
	        	 containerHtml += '<div class="btn-group">';
	        	 containerHtml += '<a class="btn btn-azure btn-sm " href="javascript:void(0);" onclick="showContainerMonitor(\''+data+'\')"><i class="fa  fa-bar-chart-o"></i>性能监控</a>';
	        	containerHtml += '<a class="btn btn-azure btn-sm  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i class="fa fa-angle-down"></i></a>';
	        	containerHtml += '<ul class="dropdown-menu">';
	        	containerHtml += '<li onclick="showContinerModal(\''+data+'\')"><a href="javascript:void(0);">重启</a></li>';
	        	containerHtml += '<li onclick="showthlogModal(\''+data+'\',\''+threaddump+'\')"><a href="javascript:void(0);">ThreadDump</a></li>';
	        	containerHtml += '<li onclick="showthlogModal(\''+data+'\',\''+containerlog+'\')"><a href="javascript:void(0);">查看日志</a></li>';
	        	containerHtml += '<li class="divider"></li>';
	        	containerHtml += '<li onclick="showDwonlogModal(\''+data+'\',\''+row['host']+'\')"><a href="javascript:void(0);">日志下载</a></li></ul></div>';
	        	
	       	  return containerHtml;
	         }
	       }],
	       responseHandler: function (result) {
	    	   
	      // 	if (result.msg=='OK') {
	       		
	               return result.data;
	             // } else {
	             //   return [];
	             // }
	       	//return result;
	       },
	       onSearch: function (text) {
			},
	       onLoadSuccess: function (data) {
		
	       },
	       onDblClickRow:function(data){
	       }
	     });	
}

function bindContainersBtn(){
	$('a[href="#tab3"]').on("click",function(){
		var t = $('#service-containers-table')
		if($(t).find('th').length==0){
            initContainersTable();
		}
		else{
			$(t).bootstrapTable('refresh');
		}
	});
	
}