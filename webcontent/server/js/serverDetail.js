$(document).ready(function (){
	fnTypeShow();
	fnGetDetailData();//获取详细信息
	
	//获取容器列表
	fnGetContainer();
	getCPUEchartData('');
	getMemEchartData('');
});
var seq_id =getUrlParam('seq_id');//params.seq_id ;//_local.appid;
var seq_type =getUrlParam('seq_type');//params.seq_type ;//_local.appid;
// seq_status =getUrlParam('seq_status');//params.seq_status ;//_local.appid;
//判断类型
function fnTypeShow(){
    //var seq_type =getUrlParam('seq_type');//params.seq_type ;//_local.appid;
	console.log(seq_type);
	if(seq_type=="mysql"){
		$("#imgAvatarSrc").attr("src","assets/img/img/mysql.jpg");
		$("#handleMysqlBtn").show();
		$("#handleRedisBtn").hide();
		$(".severtype").show();
	}else if(seq_type=="Redis"){
		$("#imgAvatarSrc").attr("src","assets/img/img/redis.jpg");
		$("#handleMysqlBtn").hide();
		$(".severtype").hide();
		$("#handleRedisBtn").show();
	}
}
//获取详细信息
function fnGetDetailData(){
  //  var seq_type =getUrlParam('seq_type');
	$("#serveType").text(seq_type);
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"services/"+seq_id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fnHandelDetailData(data);
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！（例子） ');//其他操作
      }
    }
	});
}

function fnHandelDetailData(data){
	var address=data.address.join(",");
	$("#service-ip").text(address);//访问地址
	$("#service-name").text(data.sys_name);

	$("#service-status").html(data.group);//分组
	
	$("#service-cpus").text(data.cpus);
	$("#service-mem").text(data.mem);
	$("#service-inst-num").text(data.instance);
	$("#service-image").text(data.version);//版本信息

	$("#service-username").text(data.username);//用户名
	$("#service-password").text(data.password);//密码
	$("#service-cluster").text(data.cluster_name);//集群信息
	$("#service-mara").text(data.marathon_addr);//马拉松地址
	
	 if(getUrlParam('seq_status')=="1"){
 		 $("#server_status").html('<span class="label label-success label-sm">运行中</span>');
 	  }else if(getUrlParam('seq_status')=="0"){
 		 $("#server_status").html('<span class="label label-warning  label-sm">已停止</span>');
 	  }
}
function fnShowUrl(){
	$("#haproxy_listmodal").modal('show');
	var url=$("#service-ip").text().split(','),ha_html='';
  if(url.length>1){
    $("#haproxy_table").empty();ha_html='';
    ha_html +='<tr>';
    for(var i=0;i<url.length;i++){
      if(i%4==0){
        ha_html +='<tr>'
      }
      ha_html +='<td class="param_key">'+url[i]+'</td>'

    }
    ha_html +='</tr>';
    $("#haproxy_table").append(ha_html);
  }else {
    if (url.length == 1) {
      $("#modalha").text(url.join(","));
      $("#haproxy_table").remove();
    } else {
      ha_html += '<tr>';
      for (var i = 0; i < url.length; i++) {
        if (i % 4 == 0) {
          ha_html += '<tr>'
        }
        ha_html += '<td class="param_key">' + url[i] + '</td>'

      }
      ha_html += '</tr>';
      $("#haproxy_table").append(ha_html);
    }

  }

}
function fnChangeCpuMem(str){
  getCPUEchartData(str);
  getMemEchartData(str);
}
//获取cpu监控信息
function getCPUEchartData(str){
  var url='';
  if(str==''){
    url=_URL_INTERFACE+"services/mem/"+seq_id;
  }else{
    url=_URL_INTERFACE+"services/mem/"+seq_id+'?type='+str;
  }
 	$.ajax({
    type: 'get',
    url: url,
    //url: _URL_INTERFACE+"services/monitor/mysqlcon",
    headers: {
      "token": token
    },
 		dataType: 'json',
 		success:function (result) {

 				var data=result.data;
 				HandleControlEchart('CPUusedServer',data,'cpu');

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
//获取内存监控信息
function getMemEchartData(str){
	var url='';
	if(str=''){
		url=_URL_INTERFACE+"services/mem/"+seq_id;
	}else{
    url=_URL_INTERFACE+"services/mem/"+seq_id+'?type='+str;
	}
 	$.ajax({
    type: 'get',
    url: url,
    headers: {
      "token": token
    },
 		dataType: 'json',
 		success:function (result) {
 				var data=result.data;
 				HandleControlEchart('MemUsed',data,'内存');

 		},
    error:function(XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       // alert('添加失败！（例子）');//其他操作
      }
    }
 	});
 }
function HandleControlEchart(obj,data,type){
	var date=[],value=[];
	if(data.length==0){
		date=[];
			value=[];
	}else{	
		for(var i=0;i<data.length;i++){
			date.push(data[i][0]);
			value.push(data[i][1].toFixed(2));
		}			
	}
	 // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById(obj));
  
		option = {
		
		tooltip: {
		    trigger: 'axis'
		},
		toolbox: {
		    show: true,
		    
		},
		color:['#343568'],
		legend: {
		    data: type
		},
		xAxis:  {
		    type: 'category',
		    boundaryGap: false,
		    data: date
		},
		yAxis: {
		    type: 'value'
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
		series: [
		    {
          symbol:'none',//去掉小圆点
		        name:type,
		        type:'line',
		        smooth: true,
		        data: value,
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
          }
		    }
		]
		};


  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
//获取容器列表
function fnGetContainer(){
	$('#service-containers-table').bootstrapTable({
        url:  _URL_INTERFACE+"services/containers/"+getUrlParam('seq_id'), method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'id', 

        toolbar:'#btn-div',
        columns: [{					
          title: '容器ID', field: 'container_id', searchable: true, sortable: true,
      
        },  {
          title: '节点', field: 'host', sortable: true, searchable: true
        }, {
          title: '端口', field: 'port', sortable: true, searchable: true
        },{
          title: '启动时间', field: 'start_time',sortable: true, searchable: true,
          
        },{
          title: '运行状态', field: 'state',sortable: true, searchable: true, 
          formatter: function (val, row, idx) {
        	  if(val=="TASK_RUNNING"){
          		  return '<span class="label label-success label-sm">运行</span>';
          	  }else{
          		 return '<span class="label label-warning  label-sm">异常</span>';
          	  }
              }
        },{
          title: '操作', field: 'app_id',sortable: true, searchable: true, 
          formatter: function (val, row, idx) {
         	 var data=row['app_id']+","+row['container_id'],containerlog='containerlog';
         	 var containerHtml='';
         	 containerHtml += '<div class="btn-group">';
         	 containerHtml += '<a class="btn btn-azure btn-sm " href="javascript:void(0);" onclick="showContainerMonitor(\''+data+'\')"><i class="fa  fa-bar-chart-o"></i>性能监控</a>';
         	containerHtml += '<a class="btn btn-azure btn-sm  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i class="fa fa-angle-down"></i></a>';
         	containerHtml += '<ul class="dropdown-menu">';
         	var mo = _user.mo;
         	for(var i=0;i<mo.length;i++){
         		if(mo[i].obj=="apps/container/task/restart"){
         			containerHtml += '<li class="containerbtn" onclick="showContinerModal(\''+data+'\')"><a href="javascript:void(0);">重启</a></li>';
         		}
         	}
         	containerHtml += '<li onclick="showthlogModal(\''+data+'\',\''+containerlog+'\')"><a href="javascript:void(0);">查看日志</a></li>';
         	containerHtml += '<li class="divider"></li>';
         	containerHtml += '<li onclick="showDwonlogModal(\''+data+'\',\''+row['host']+'\')"><a href="javascript:void(0);">日志下载</a></li></ul></div>';
         	
        	  return containerHtml;
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
//        	var id=data.id;
//        	$("#updateDataModal").modal('show');
//        	getType('#dataTypes_U');
//        	fnhandleupdate(id);
        }
      });
}
//容器日志
function showthlogModal(data,type){
	$("#threaddown_log").modal('show');
	if(type=="threaddump"){
		$("#threaddown_logtype").text('ThreadDump');
	}else{
		$("#threaddown_logtype").text('日志');
	}
	fnthread_log(data,type);
}
function fnthread_log(data,type){
	var val=data.split(",");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/container/task/logs",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":val[0],
		    "task_id":val[1],
		    "type":type
		}),
		success:function (result) {
				var getdata=result.data;
				$("#message").text(getdata);
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#message").text("日志查询失败");
      }
    }
	});
}
//日志下载
function showDwonlogModal(data,a){
	var val=data.split(",");
	$("#dwonlogmodal").modal('show');
	getDwonloadLog(val[0],val[1],a);
}
function getDwonloadLog(val1,val2,val3){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/container/task/logs/download?app_id="+val1+"&task_id="+val2+"&app_host="+val3,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var getdata=result.data;
				if(getdata.length!=0){
					fnHandleGetDownData(getdata,val3);
				}else{
					$("#logdwontable").html("暂无查询数据");
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
function fnHandleGetDownData(files,host){
	$('#logdwontable').empty();
	var buf='';
	for(i = 0; i<files.length; i++){
        name = files[i].name;
        //bytes = files[i].size;
        size = files[i].size;
        time = files[i].time;
        path = files[i].path;

        buf += '<tr> ';
        buf += '	<td>'+ (i+1) +'</td> ';
        buf += '    <td><a href="#" onclick="download_log(\''+path+'\',\''+host+'\');"><i class="yellow fa fa-file-text"></i> <span>'+name+'</span> </a></td> ';
        buf += '    <td>'+time+'</td> ';
        buf += '    <td>'+size+'</td> ';
        buf += '</tr> ';
        	
	}
	$('#logdwontable').html(buf);
}
function download_log(path,host){
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/container/task/logs/download",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_host":host,
		    "path":path
		    	
		}),
		success:function (result) {
				var getdata=result.data;
				var file=getdata.url.split("/");
				var filename=file[file.length-1];
				downloadFile(filename,getdata.url);
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
function downloadFile(fileName, content){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/firefox/) != null){
        window.open(content);
    }
    else if(ua.match(/chrome/) != null){
        var aLink = document.createElement("a");
        aLink.download = fileName;
        aLink.href = content;
        aLink.click();
    }else if(ua.match(/msie/) != null){
        window.open(content);
    }
}

//容器重启
function showContinerModal(data){
	$("#RestartContainer1").modal('show');
	$("#restartContainer").text(data);
}
function fuResartCon(){
	$("#modal-info1").modal("show");
	$("#publishing").text("正在进行容器重启，请稍后......");
	var d = document.getElementById("statusslider");d.style.width = "50%";
	var data=$("#restartContainer").text().split(",");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"services/restart",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":data[0]
		    //"task_id":data[1]
		}),
		success:function (result) {
			$("#modal-info1").modal("hide");

				d.style.width = "100%";
				$("#successmodal").modal("show");
				$("#successInfo").html('容器重启成功');
//				var data=result.data;
//
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#modal-info1").modal("hide");
       $("#failmodal").modal('show');
        $('#failtitle').text('容器重启失败！！');
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
	});
}
//容器性能监控
function showContainerMonitor(data){
	$("#ContainerMonitor").modal('show');
	var type=$("#monitortype").val();
	var typeChina='';
	if(type=="cpu"){
		typeChina="CPU"
	}else if(type=="mem"){
		typeChina="内存"
	}else if(type=="jvm"){
		typeChina="JVM"
	}else if(type=="thread"){
		typeChina="线程数"
	}else if(type=="concurrent"){
		typeChina="并发数"
	}
	$("#containertype").text(typeChina);
	$("#monitordata").text(data);
	fnCtnMonitor(data,type,"funmonitor",typeChina);
}
$("#monitortype").change(function(){
	var type=$("#monitortype").val();
	var typeChina='';
	if(type=="cpu"){
		typeChina="CPU"
	}else if(type=="mem"){
		typeChina="内存"
	}else if(type=="jvm"){
		typeChina="JVM"
	}else if(type=="thread"){
		typeChina="线程数"
	}else if(type=="concurrent"){
		typeChina="并发数"
	}
	$("#containertype").text(typeChina);
	fnCtnMonitor($("#monitordata").text(),type,"funmonitor",typeChina);
	
});
function fnCtnMonitor(data,type,b,typeChina){
	var data=data.split(",");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/container/task/monitor",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "app_id":data[0],
		    "task_id":data[1],
		    "type":type
		}),
		success:function (result) {

				var getdata=result.data;
				var date=[],value=[];
				if(getdata.length>0){
					for(var i=0;i<getdata.length;i++){
						var aa=getdata[i];
						date.push(aa[0]);
						value.push(aa[1]);
					}
				}
				fnEchart(b,typeChina,date,value);

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

function fnEchart(obj,a,date,value){
	// 基于准备好的dom，初始化echarts实例
     var myChart = echarts.init(document.getElementById(obj));
     var legenddata=[];
     if(a=='CPU' || a=='内存' || a=='JVM'){
    	 legenddata.push(a+'使用率');
     }else{
    	 legenddata.push(a+'个数');
     }
   option = {
	 title : {
	    /* text: a*/
	     //subtext: '纯属虚构'
	 },
	 tooltip : {
	     trigger: 'axis'
	 },
	color:['#343568'],
//	 legend: {
//	     data:legenddata,
//	     
//	 },
	
	 calculable : true,
	 xAxis : [
	     {
	         type : 'category',
	         boundaryGap : false,
	         data : date,
	         axisLabel : {
	                show:true,
	                interval: 'auto',    // {number}
	                rotate: 65,
	                margin: 18,
	               
	                textStyle: {
	                    
	                    fontFamily: 'sans-serif',
	                    fontSize: 11,
	                    fontStyle: 'italic',
	                   
	                }
	            },
	     }
	 ],
	 yAxis : [
	     {
	         type : 'value'
	     }
	 ],
	 series : [
	     {
	         name:legenddata.join(""),
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
	 ]
};     // 使用刚指定的配置项和数据显示图表。
     myChart.setOption(option);
 }
//密码重置
function updatePassword(){
	$("#modal-info").modal("show");
}
$("#reset-mysql-password").click(function(){
	var seq_id=getUrlParam('seq_id');
	//$("#tips").modal("show");
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"services/mysql/"+seq_id,
    headers: {
      "token": token
    },
 		dataType: 'json',
 		data:JSON.stringify({

 		   "type": "mysql_pwd"
        }),
 		success:function (result) {
 			//$("#tips").modal("hide");
 				/*commonAlert("#successMsg", "#successAlertBlock", "mysql密码重置成功");*/
      $("#successmodal").modal("show");
      $("#successInfo").text("密码重置成功!!");
 				fnGetDetailData();
 		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        /*commonAlert("#warningMsg", "#warningAlertBlock","mysql密码重置失败");*/
        $("#failmodal").modal("show");
        $("#failtitle").text("重置失败!!");
        $("#failInfo").text(JSON.parse(XMLHttpRequest.responseText).msg);

      }
    }
 	});
});
//版本升级
function updateMysql(){
	if(seq_type=="mysql"){
		$('#mysql-version-select').show();
		$('#Redis-version-select').hide();
	}else if(seq_type=="Redis"){
		$('#mysql-version-select').hide();
		$('#Redis-version-select').show();
	}
	$("#UpdateModal").modal("show");
}
function fnSelectVersion(){
   var seq_id= getUrlParam('seq_id');
	//$("#tips").modal("show");
	// alert(seq_id);
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"services/"+seq_id,
    headers: {
      "token": token
    },
 		dataType: 'json',
 		data:JSON.stringify({
 		   "type": "mysql",
 		    "value": "mysql-3"
        }),
 		success:function (result) {
 			//$("#tips").modal("hide");

 				commonAlert("#successMsg", "#successAlertBlock", "mysql版本成功升级");
 				fnGetDetailData();

 		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        commonAlert("#warningMsg", "#warningAlertBlock", "mysql版本升级失败");
      }
    }
 	});
}
//删除服务
function deleteMysql(){
	$("#delete-mysql-modal").modal("show");
}
$("#delete-mysql").click(function(){
    var seq_id=getUrlParam('seq_id');
	$("#server_status").html('<span class="label label-warning  label-sm">删除中...</span>');
	var url='';
	if(seq_type=='mysql'){
		url= _URL_INTERFACE+"services/mysql/"+seq_id;
	}else{
    url=_URL_INTERFACE+"services/redis/"+seq_id;
	}
	$.ajax({
    type: 'DELETE',
    url:url,
    headers: {
      "token": token
    },
 		dataType: 'json',
 		success:function (result) {
 				$("#server_status").html('<span class="label label-success  label-sm">删除成功</span>');
      window.location.href = '#/webcontent/server/servercluster.html';
 				//$("#profile11").tab('show');
 		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#server_status").html('<span class="label label-warning  label-sm">删除失败</span>');
        commonAlert("#warningMsg", "#warningAlertBlock","删除失败");
      }
    }
 	});
});
/*
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}*/
