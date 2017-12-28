$(document).ready(function (){ 
	// initPage();
	//获取操作事件
	fngetEventData();
	//获取告警信息
	fnalarminfo();
	//使用率
	fnUsage();
	fncontainer();
	fnhealth();
	fnGetApp();
	fnGetNoticeData();
	fnBaseConfig();//选择要查看的系统名称
});
var cleanTime = setTimeout(function () {
  fngetEventData();fnalarminfo();fnUsage();fncontainer();fnGetApp();fnhealth();
},30000);
// setTimeout('fngetEventData()',30000);
// setTimeout('fnalarminfo()',30000);
// setTimeout('fnUsage()',30000);
// setTimeout('fncontainer()',30000);
// setTimeout('fnGetApp()',30000);
// setTimeout('fnhealth()',30000);
//使用率
function fnUsage(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/resource/usage',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				$("#slave").text(data.slave);
				fnpieEchart('#CPUused',data.cpu);
				fnpieEchart('#MerryUsed',data.mem);
				fnpieEchart('#DiskUsed',data.disk);
			// }
			
		}
	});
}
function fncontainer(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/platform/container',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				$("#centerNum").text(data.center);
				$("#sysnum").text(data.sysnum);
				$("#module").text(data.module);
				$("#containernum").text(data.container);
			// }
			
		}
	});
}
function fnhealth(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/components/health',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				fnhealthData(data.haproxy,3);
				fnhealthData(data.mesos,0);
				fnhealthData(data.marathon,1);
				fnhealthData(data.zk,2);
			// }
			
		}
	});
}
function fnhealthData(data,q){
	var healthy=0,unhealthy=0;
	for(var i=0;i<data.length;i++){
		if(data[i].status=="0"){
			healthy++;
		}else{
			unhealthy++;
		}
	}
	$("[hea_status='unhealth']").eq(q).empty();
	$("[hea_status='health']").eq(q).empty();
	if(unhealthy!=0){
		$("[hea_status='unhealth']").eq(q).append(unhealthy+'<i class="fa fa-heartbeat red padding-left-5"></i>');
	}else{
		$("[hea_status='unhealth']").eq(q).append(unhealthy+'<i class="fa fa-heartbeat gray padding-left-5"></i>');
	}
	
	$("[hea_status='health']").eq(q).append(healthy+'<i class="fa fa-heartbeat info padding-left-5"></i>');
}
function fnHealthDetail(type){
	$("#showMoreModal").modal("show");
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/components/health',
		dataType: 'json',
		headers:{'token':token},
		success:function (result) {
				var data='';
				if(type=="Mesos"){
					data=result.data.mesos;
					$("#ComponentType").text("Mesos");
				}else if(type=="HAProxy"){
					data=result.data.haproxy;
					$("#ComponentType").text("HAProxy");
				}else if(type=="Zookeeper"){
					data=result.data.zk;
					$("#ComponentType").text("Zookeeper");
				}else if(type=="Marathon"){
					data=result.data.marathon;
					$("#ComponentType").text("Marathon");
				}
				$("#table_detail_status").empty();
				var html='';
				for(var i=0;i<data.length;i++){
					 html+='<tr><td>'+data[i].address+'</td>';
					if(data[i].status=='0'){
						html+='<td><span class="label label-success label-sm">健康</span></td></tr>';
					}else{
						html+='<td><span class="label label-danger label-sm">非健康</span></td></tr>';
					}
					                            
				}
				$("#table_detail_status").append(html);
				console.log(html);
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '/index.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
    }
	});
}

//获取操作事件
function fngetEventData(){

	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/platform/eventlog',
    headers: {
      "token": token
    },
    dataType: 'json',
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					$("#eventlist").html("暂无查询数据");
					$("#eventlist").removeClass("timeline");
				}else{
					$("#eventlist").addClass("timeline");
					fnhandleEvent(data);
				}
			// }

		},
		error:function (a,b,c) {
			console.log(a.status+a.readyState+b);

    }
	});
}

function fnhandleEvent(getdata){
	$("#eventlist").empty();
	var data=[];
	if(getdata.length>5){
		data=getdata.slice(0,5);
	}else{
		data=getdata;
	}
	for(var i=0;i<data.length;i++){
		var html='';
		html+='<li class="timeline-inverted">';
        
		
		if(data[i].result==0){
			html+='<div class="timeline-badge darkorange">';
			html+='<i class="fa fa-check-circle info"></i>';
		}else{
			html+='<div class="timeline-badge darkorange">';
			html+='<i class="fa fa-times-circle darkorange"></i>';
		}
		
        html+='</div>';
        html+='<div class="timeline-panel bordered-right-3">';
        html+='<div class="timeline-body">';
        html+='<span>'+data[i].type+'</span> '; 
         html+='</div>';
       html+='<div class="timeline-footer">';
         html+=' <span>'+data[i].create_time+'</span>  ';
         html+='</div>';
         html+='</div>';
         html+='</li>';
         $("#eventlist").append(html);
	}
}


//获取告警信息
function fnalarminfo(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'dashboard/platform/alarm',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					$("#alarminfo").html("暂无告警信息");
					//$("#alarminfo").removeClass("timeline");
				}else{
					//$("#alarminfo").addClass("timeline");
					fnhandleAlarm(data);
				}
			// }
			
		}
	});
}
function fnhandleAlarm(getdata){
	$("#alarminfo").empty();
	var data=[];
	if(getdata.length>5){
		data=getdata.slice(0,5);
	}else{
		data=getdata;
	}
	for(var i=0;i<data.length;i++){
		var html='';
		if(i=='0'){
			html+='<li class="task-item margin-bottom-10">';
		}else{
			html+='<li class="task-item margin-bottom-10">';
		}
		
		if(data[i].state=='WARNING'){
			html+='	<div class="task-state "><span class="label label-orange label-sm"><i class="fa fa-warning padding-right-5"></i>警告</span></div>';
		}else if(data[i].state=='CRITICAL'){
			html+='	<div class="task-state "><span class="label label-orange label-sm"><i class="fa fa-warning padding-right-5"></i>警告</span></div>';
		}else if(data[i].state=='OK'){
			html+='<div class="task-state "><span class="label label-palegreen label-sm"><i class="fa fa-warning padding-right-5"></i>提示</span></div>';
		}
    html+='<div class="task-time " >'+data[i].hostname+'</div>';
		html+='<div class="task-body" ><p><a href="javascript:;"   title="'+data[i].message+'">'+data[i].message+'</a></p></div>';


		html+='</li>';
         $("#alarminfo").append(html);
	}
}

//饼图
// 基于准备好的dom，初始化echarts实例
function fnpieEchart(obj,result){
	if(obj=="#CPUused"){
		$(obj).next().find("[name='used']").text((result.used).toFixed(3));
		$(obj).next().find("[name='total']").text((result.total).toFixed(3));
	}else{
		$(obj).next().find("[name='used']").text((result.used / 1024).toFixed(3));
		$(obj).next().find("[name='total']").text((result.total / 1024).toFixed(3));
	}
	
	var objId=obj.split('#')[1];
	var myChart = echarts.init(document.getElementById(objId));
	var use_rate=result.use_rate / 100;
	var option = {
			title: {
			text: ((use_rate* 100).toFixed(2)) + '%',
			subtext: '已使用',
			x: 'center',
			y: 'center',
			textStyle: {
			    color: '#666',
			    fontSize: 16
			},
			subtextStyle: {
			    color: '#666',
			    fontSize: 15
			}
			},
			animation: false,
			series: [{
			type: 'pie',
			radius: ['78%', '73%'],
			silent: true,
			label: {
			    normal: {
			        show: false,
			    }
			},
			data: [{
			    itemStyle: {
			        normal: {
			            color: '#cccccc',
			            shadowBlur: 0,
			            shadowColor: '#cccccc'
			        }
			    }
			}]
			}, {
			name: 'main',
			type: 'pie',
			radius: ['78%', '73%'],
			label: {
			    normal: {
			        show: false
			    }
			},
			data: getData(use_rate)
			}]
			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
}

function getData(percent) {
return [{
value: percent,
itemStyle: {
    normal: {
        color: '#1eb6ff',
        shadowBlur: 0,
        shadowColor: '#1eb6ff'
    }
}
}, {
value: 1 - percent,
itemStyle: {
    normal: {
        color: 'transparent'
    }
}
}];
}

//应用显示模块
//获取系统名称
$("#Containsetting").on('show.bs.modal', function () {
	$("warningAlertBlock").addClass('hidden');
	$("successAlertBlock").addClass('hidden');
	fnBaseConfig();
	fnGetApp();
	
});
function fnBaseConfig(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'apps/sys_with_app',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			if(result.data &&　result.length!=0){
				fnHandleBasefig(result.data);
			}
		}
	});
}
function fnHandleBasefig(result){
	var data=[];
	//系统名称
	$("#sysname").empty();
	$("#selectSysname").empty();
	$("#selectSysname").append('<option value="">选择要查看的系统名称</option>');
	for(var i = 0; i < result.length; i++){
		var a=data[i];
		//添加业务系统名称
		$("#sysname").append(' <li onclick="changeSysColor(this)" value="'+result[i].sys_id+'"><a href="javascript:;">'+result[i].sys_name+'</a></li>');
		$("#selectSysname").append('<option value="'+result[i].sys_id+'">'+result[i].sys_name+'</option>');
	}
}
function fnsys_appEchart(){
	var selectsys=$("#selectSysname").val();
	if(selectsys!=""){
		$.ajax({
			type: 'get',
			url: _URL_INTERFACE+"apps/list/min?sys_id="+selectsys,
			dataType: 'json',
			headers:{'token':token},
			success:function (result) {
					var data=result.data;
					if(data.length!=0){
						var app_id=[];
						for(var i=0;i<data.length;i++){
								app_id.push(data[i].app_id);
						}
						fnAjaxAppId(app_id);
					}
			}
		});
	}
}
function fnGetApp(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'apps/list/min',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			$("#appname").empty();
			// if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					$("#Containscount").html("暂无查询应用信息");
					$("#appname").html("暂无查询数据");
				}else{
					fnHandleApp(data);
					fnGetAppShow(data);
				}
			// }
		}
	});
}

function fnGetAppShow(name){
	var _userName=_user.username;
	$.ajax({
		type: 'GET',
		url: _URL_INTERFACE+"dashboard/platform/apps/config?username="+_userName,
		dataType: 'json',
	       async:false, 
		headers:{'token':token},
		success:function (result) {
			$("#showapp").empty();
                //获取展示应用列表数据
				var data=result.data.app_ids;
				if(data){
					for(var i=0;i<5;i++){
						for(var a=0;a<name.length;a++){
							if(name[a].app_id==data[i]){
								var html='<li onclick="changeColor(this)" value="'+data[i]+'"><a href="javascript:;">'+name[a].app_name+'</a></li>';
								$("#showapp").append(html);
							}
						}
						fnDifferent();
					}
					
				}else{
					$("#showapp").html('请先选择需要显示的应用');
					$("#Containscount").html('请先选择需要显示的应用');
					
				}
				fnPostData();
			
		}
	});
}
function fnDifferent(){
	$("#appname").find("li").each(function(i,obj){
		$("#showapp").find("li").each(function(a,objapp){
			if($(obj).attr("value")==$(objapp).attr("value")){
				$(obj).remove();
			}
		});
	});
}
function fnGetAppEchartData(){
	var _userName=_user.username;
	$.ajax({
		type: 'GET',
		url: _URL_INTERFACE+"dashboard/platform/apps?username="+_userName,
		dataType: 'json',
		headers:{'token':token},
		success:function (result) {
				markAppEchart(result.data);
			
		}
	});
}
function markAppEchart(data){
	var myChart = echarts.init(document.getElementById('Containscount'));
    var app_name=[],series=[],time=data.time;
    for(var i=0;i<data.value.length;i++){
    	var seriesCon={};
    	app_name.push(data.value[i].app_name);
    	seriesCon={name:data.value[i].app_name,
	            type:'line',
	            stack: '总量'+[i],
	            data:data.value[i].value};
    	series.push(seriesCon);
    }
    	 
	(function getData(data) {   
	var option = {
	    title: {
	        text: '容器总数'
	       // subtext: '纯属虚构'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:app_name,
	         bottom: 'bottom'
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: time
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: series
	};


	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
	 })();    
}
function fnHandleApp(data){
	//应用列表
	for(var i=0;i<data.length;i++){
		if(data[i].status=='1'){//已发布运行中的
			$("#appname").append(' <li onclick="changeColor(this)" value="'+data[i].app_id+'"><a href="javascript:;">'+data[i].app_name+'</a></li>');
		}
		
	}
}
function changeColor(obj){
	if($(obj).css("background-color")=="rgb(255, 255, 255)"){
		$(obj).css("background-color",'#d9edf7').attr("class",'checkedapp');
	}else{
		$(obj).css("background-color",'rgb(255, 255, 255)').attr("class",'');
	}
}
function changeSysColor(obj){
	$("#sysname").find('li').css("background-color",'rgb(255, 255, 255)');
//	$(obj).css("background-color",'#f5f5f5').attr("class",'checkedsys');
 // $(obj).css("background-color","rgb(255, 255, 255)");
	if($(obj).css("background-color")=="rgb(255, 255, 255)"){
		$("#sysname").find('li').css("background-color",'#rgb(255, 255, 255)').attr("class",'');
		$(obj).css("background-color",'#d9edf7').attr("class",'checkedsys');
		sysNameApp(obj);
	}else{
		$(obj).css("background-color",'rgb(255, 255, 255)').attr("class",'');
		fnGetApp();
	}
}
function sysNameApp(obj){
	var sys_id=$(obj).attr('value');
	$("#sys_name").empty();
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'apps/list/min?sys_id='+sys_id,
		dataType: 'json',
		headers:{'token':token},
		success:function (result) {
			$("#appname").empty();
				var data=result.data;
				if(data.length==0){
					$("#sys_name").html("暂无查询数据");
				}else{
					for(var i=0;i<data.length;i++){
							if(data[i].status=='1'){
								var html='<li onclick="changeColor(this)" value="'+data[i].app_id+'"><a href="javascript:;">'+data[i].app_name+'</a></li>';
								$("#appname").append(html);
							}
					}
					fnDifferent();
				}

			
		}
	});
}
function addShowApp(){
	//$("#showapp").empty();
	var length=$("#appname").find(".checkedapp").length;
	var lilength=$('#showapp').find('li').length;
	var a=parseInt(length)+parseInt(lilength);
	if(a>5){
    commonAlert("#warningMsg", "#warningAlertBlock", "最多显示5个应用");
	}else{
    $("#appname").find(".checkedapp").each(function(i,obj){
      $(obj).remove();
      $("#showapp").append(this);
      $(obj).attr("class",'');
    });
	}

}
function cutShowApp(){
	$("#showapp").find(".checkedapp").each(function(i,obj){
		$(obj).remove();
		$("#appname").append(this);
		$(obj).attr("class",'');
	});
}

function fnPostData(){
	var app_id=[];
	for(var i=0;i<$("#showapp").find("li").length;i++){
		var attr=$("#showapp").find("li").eq(i).attr('value');
		app_id.push(attr);
	}
	// if(app_id.length>5){
  // 	commonAlert("#warningMsg", "#warningAlertBlock", "最多显示5个应用");
  // 	return;
  // }else{
  // 	//$("#Containsetting").modal('hide');
  // 	fnAjaxAppId(app_id);
  // }
  fnAjaxAppId(app_id);
}
function fnAjaxAppId(app_id){
	$.ajax({
		type: 'POST',
		url: _URL_INTERFACE+'dashboard/platform/apps/config',
		dataType: 'json',
		headers:{'token':token},
    data:JSON.stringify({
      "app_ids":app_id
    }),
		success:function (result) {
			// if(result.msg=='OK'){
				/*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
				fnGetAppEchartData();
			// }else{
			// 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
			// }
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '/index.html';
      }else{
       // alert('添加失败！（例子）');//其他操作
      }
    }
	});
}
//弹出公告
//获取公告信息
function fnGetNoticeData(){
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'platform/notice/manage',
		dataType: 'json',
    headers: {
      "token": token
    },
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				if(data){
					fnHandleNoticeData(data);
				}
					
			// }
		}
	});
}
function fnHandleNoticeData(data){
	if(data.length==0){
		$("#modal-info").modal('hide');
	}else{
		$("#modal-info").modal('show');
		$("#info_list").empty();
		for(var i=0;i<data.length;i++){
			var html='<li noticeid="'+data[i].id+'" style="font-size:16px"><a href="javascript:;"  onclick="fnNoticeContent(this)">'+data[i].notice_title+'</a>'
			+'<p id="content_info" class="noticecontent" style="word-wrap:break-word;display:none;">'+data[i].notice_content+'</p></li>';
			$("#info_list").append(html);
		}
	}
}
function fnNoticeContent(obj){
	$('#modal-info').find(".noticecontent").hide();
	$(obj).next('.noticecontent').show();
}
$('#modal-info').on('hide.bs.modal', function () {
	var notice_ids=[];
	$('#modal-info').find("li").each(function(i){
		var id = "";
		id = $(this).attr("noticeid");
		notice_ids.push(id);
	});
	fnPostNotice(notice_ids);
});
function fnPostNotice(id){
	$.ajax({
		type: 'POST', 
		url: _URL_INTERFACE+'platform/notice/manage',
		dataType: 'json',
		data:JSON.stringify({
		    "notice_ids":id
		}),
		headers:{'token':token},
		success:function (result) {
			// if(result.msg=='OK'){
			//
			// }else{
			//
			// }
			
		}
	});
}
$("#info_more").click(function(){
	window.location.href="noticeList.html";
});
//search
function fnSearch(obj,goal){
var txt = $(obj).val();
if (txt == '') {
	$(goal).find("li").show();
} else {
	$(goal).find("li").hide();
	$(goal).find("li:contains('" + txt + "')").show();
}
}

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}