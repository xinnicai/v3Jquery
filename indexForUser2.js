$(document).ready(function (){ 
	initPage();
	fnGetApp();
	//获取告警信息
	fnalarminfo();
	//获取操作事件
	fngetEventData();
	fnUsage();
	//系统状态
	fnSysStatus();
	fncontainer();
	fnGetCpuData();
});

setTimeout('fnGetApp()',30000);
setTimeout('fngetEventData()',30000);
setTimeout('fnUsage()',30000);
setTimeout('fnalarminfo()',30000);

//使用率
function fnUsage(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/resource/usage",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				var mem_total=parseInt(data.mem.total/1024);
				$("#totalCPU").text(data.cpu.total);
				$("#totalMem").text(mem_total);
				fnGetData('#MerryUsed',data.mem);
//				$("#slave").text(data.slave);
//				fnpieEchart('#CPUused',data.cpu);
//				fnpieEchart('#MerryUsed',data.mem);
				fnpieEchart('#DiskUsed',data.disk);
				fnGetData('#CPUused',data.cpu);
//				fnGetLineData('#CPUhistory',data.cpu);
				
			}
			
		}
	});
}


function fnGetData(obj,result){
	$(obj).empty();
	if(obj=='#CPUused'){
		var use_rate=parseInt(result.use_rate*100); 
	}else{
		use_rate=parseInt(result.use_rate);
	}
	
	var html='';
	html +='<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+use_rate+' aria-valuemin="0" aria-valuemax="100" style="height:'+use_rate+'%">'
    html +='<span>'+use_rate+'% </span>'
    html +='</div>'
    $(obj).append(html);
}

function fnGetApp(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/list",
		    "_method": "GET"
		}),
		success:function (result) {
			
			$("#appname").empty();
			if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					$("#Containscount").html("暂无查询应用信息");
					$("#appname").html("暂无查询数据");
				}else{
					fnHandleApp(data);
					fnGetAppShow(data);
				}
			}
			
		}
	});
}

//饼图
//基于准备好的dom，初始化echarts实例
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

function fnGetCpuData(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "monitor/apps/cpu?app_id=76c4d1603c4511e7df63e23d28db40e9",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				fnGetLineData(data);
			}
		}
	});
}
//获取折线图
function fnGetLineData(d){
	var data=d;
	var myChart = echarts.init(document.getElementById('CPUhistory'));
    option = {
        title: {
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() +'/'+date.getHours()+ ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };

    setInterval(function () {

            data.shift();
            data.push(data);

        myChart.setOption({
            series: [{
                data: data
            }]
        });
    }, 1000);
  
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

function fnGetAppShow(name){
	var _userName=_user.username;
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
	       async:false, 
		data:JSON.stringify({
			"_uri": "dashboard/platform/apps/config?username="+_userName,
		    "_method": "GET"
		}),
		success:function (result) {
			$("#showapp").empty();
			if(result.msg=='OK'){
				var data=result.data.app_ids;
				if(data){
					for(var i=0;i<data.length;i++){
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
			
		}
	});
}

function fnGetAppEchartData(){
	var _userName=_user.username;
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/platform/apps?username="+_userName,
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				markAppEchart(result.data);
			}
			
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
	for(var i=0;i<data.length;i++){
		if(data[i].status=='1'){//已发布运行中的
			$("#appname").append(' <li onclick="changeColor(this)" value="'+data[i].app_id+'"><a href="javascript:;">'+data[i].app_name+'</a></li>');
		}
		
	}
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

function fnPostData(){
	var app_id=[];
	for(var i=0;i<$("#showapp").find("li").length;i++){
		var attr=$("#showapp").find("li").eq(i).attr('value');
		app_id.push(attr);
	}
	if(app_id.length>5){
		commonAlert("#warningMsg", "#warningAlertBlock", "最多显示5个应用");
	}else{
		fnAjaxAppId(app_id);	
	}
	
}
function fnAjaxAppId(app_id){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/platform/apps/config",
		    "_method": "POST",
		    "app_ids":app_id
		}),
		success:function (result) {
			if(result.msg=='OK'){
				/*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
				fnGetAppEchartData();
			}else{
				commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
			}
			
		}
	});
}

//获取操作事件
function fngetEventData(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/platform/eventlog",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					$("#eventlist").html("暂无查询数据");
					$("#eventlist").removeClass("timeline");
				}else{
					$("#eventlist").addClass("timeline");
					fnhandleEvent(data);
				}
			}
			
		}
	});
}

function fnhandleEvent(getdata){
	$("#eventlist").empty();
	var data=[];
	if(getdata.length>4){
		data=getdata.slice(0,4);
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

//系统状态
function fnSysStatus(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/sys/status",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				$("#sya_status").empty();
				var data=result.data;
				if(data && data.length!=0){
					fnHandleStatus(data);
					fnCountSys(data);
				}else{
					$("#sya_status").html("暂无查询数据");
				}
			}
			
		}
	});
}
function fnHandleStatus(data){//onclick="fnDetailHealth(\''+datasys+'\')"
	for(var i=0;i<data.length;i++){
		if(i<5){
			var datasys=data[i],detail=datasys.detail;
			datasys=JSON.stringify(detail);
			var html='';
			html+='<div class="databox-row row-2 bordered-bottom bordered-ivory padding-10">  ';
			html+=' <span class="databox-text darkgray pull-left no-margin hidden-xs">'+data[i].sys_name+'</span>';

			if(data[i].health==true){
				html+=' <span class="databox-text palegreen pull-right no-margin uppercase">正常</span>';
			}else{
				html+=' <span class="databox-text yellow pull-right no-margin uppercase">异常</span>';
			}
			html+='</div>';
	         $("#sya_status").append(html);
		}
		
	}
}

function fncontainer(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/platform/container",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				$("#sysnum").text(data.sysnum);
				$("#module").text(data.module);
				$("#containernum").text(data.container);
			}
			
		}
	});
}

function fnCountSys(data){
	var sys_count=data.length;
	var health=0;
	var warn=0;
	for(var i=0;i<data.length;i++){
		if(data[i].health==true){
			health++;
		}else{
			warn++;
		}
			
	}
	var health_rate=(health/sys_count)*100;
	$("#sys_count").empty();
	var html='';
	html +='<div class="databox-cell cell-3 text-center">';
    html +='<div class="databox-number number-xxlg sonic-silver">'+sys_count+'</div>';
    html +='<div class="databox-text storm-cloud">总数</div>';
    html +='</div>';
    html +='<div class="databox-cell cell-9 text-align-center">';
    html +=' <div class="databox-row row-6 text-left">';
    html +=' <span class="badge badge-palegreen badge-empty margin-left-5"></span>';
    html +='<span class="databox-inlinetext uppercase darkgray margin-left-5">'+health+'正常</span>';
    html +=' <span class="badge badge-yellow badge-empty margin-left-30"></span>';
    html +='<span class="databox-inlinetext uppercase darkgray margin-left-5">'+warn+'异常</span>';
    html +='</div>';
    html +='<div class="databox-row row-6">' ;
    html +='<div class="progress bg-gray progress-no-radius">';
    html +=' <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: '+health_rate+'%">';
    html +='</div>';
    html +='</div>';
    html +='</div>';
    html +='</div>';
    $("#sys_count").append(html);
	
	}

//获取告警信息
function fnalarminfo(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "dashboard/platform/alarm",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				if(data.length==0){
					
					//$("#alarminfo").removeClass("timeline");
				}else{
					//$("#alarminfo").addClass("timeline");
					fnhandleAlarm(data);
				}
			}
			
		}
	});
}
function fnhandleAlarm(getdata){
	$("#alarminfo").empty();
	var data=[];
	if(getdata.length>4){
		data=getdata.slice(0,4);
	}else{
		data=getdata;
	}
	for(var i=0;i<data.length;i++){
		var html='';
		if(i=='0'){
			html+='<div class="bordered-gray bordered-1 no-padding">';
		}else{
			html+='<div class="bordered-gray bordered-1 no-padding margin-top-10">';
		}
		
		if(data[i].state=='WARNING'){
			html+='	<div class="padding-5  lightred">严重</div>';
		}else if(data[i].state=='CRITICAL'){
			html+='	<div class="padding-5  lightyellow">关注</div>';
		}else if(data[i].state=='OK'){
			html+='	<div class="padding-5  primary">恢复</div>';
		}
		
		html+='<div class="padding-10 word-wrap" >'+data[i].message+'</div>';
		html+='</div>';
         $("#alarminfo").append(html);
	}
}
	