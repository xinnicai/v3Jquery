$(document).ready(function (){
    fnGetApp();
    //获取告警信息
    fnalarminfo();
    //获取操作事件
    fngetEventData();
    fnUsage();
    //系统状态
    fnSysStatus();
    //获取容器信息
    fncontainer();
    fnGetCpuData();
    fnGetResourceUsed();
    fnBaseConfig();
    fnGetSysParam();
});
var cleanTime = setTimeout(function () {
    fngetEventData();fnalarminfo();fnUsage();fnGetApp();
},30000);
var sys_id=getUrlParam('sys_id');
var systemName =getUrlParam('sys_name');
$("#systemName").text(systemName);
// setTimeout('fnGetApp()',30000);
// setTimeout('fngetEventData()',30000);
// setTimeout('fnUsage()',30000);
// setTimeout('fnalarminfo()',30000);
//var num = Math.round(Math.random()*20+6);

//循环执行，每隔60-150秒钟执行一次showMsgIcon()
// window.setInterval(fnGetCpuData1, 20000);
// window.setInterval(fnGetMemData1, 20000);
var DatalInterval=setInterval(function(){
    fnGetCpuData1();
    fnGetMemData1();
},20000);
//使用率
function fnUsage(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+'dashboard/resource/usage?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            var mem_total=parseInt(data.mem.total/1024);
            $("#totalCPU").text(parseInt(data.cpu.total));
            $("#totalMem").text(mem_total);
//				fnGetData('#MerryUsed',data.mem);
//				$("#slave").text(data.slave);
//				fnpieEchart('#CPUused',data.cpu);
//				fnpieEchart('#MerryUsed',data.mem);
// 				fnpieEchart('#DiskUsed',data.disk);
//				fnGetData('#CPUused',data.cpu);
//				fnGetLineData('#CPUhistory',data.cpu);
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
var sysbuscode;
var first;
var second;
function fnGetSysParam(){
    $.ajax({
        type: 'GET',
        url:_URL_INTERFACE+'apps/domain?sysdomain_code='+sys_id+'&domain_code=&subdomain_code=&type=app_business_sysdomain',
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data[0];
            sysbuscode=data.sysdomain_code+'/'+data.sysdomain_name;
            first=data.domain_code+'/'+data.domain_name;
            second=data.subdomain_code+'/'+data.subdomain_name;
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                alert('数据加载失败');//其他操作
            }
        }
    });
}
function fnCreateBusiness(){
    window.location.href="#/webcontent/Application/CreatApplication.html?domain_code="+first+'&subdomain_code='+second+'&sysdomain_code='+sysbuscode;
}
function fnGetResourceUsed(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/app/usage?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            fnShowResourceUsed(data);
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                alert('数据加载失败');//其他操作
            }
        }
    });
}

function fnShowResourceUsed(data){
    var arr=data;
    $("#resourceUsed").empty;
    var html='';
    var flag=false;
    for(var i=0;i<arr.length;i++)
    {
        var value=arr[i];
        var cpuUsed=parseInt(value[4]);
        var memUsed=parseInt(value[3]);
        if(cpuUsed>=60||memUsed>=60){
            flag=true;
            if(cpuUsed>=80||memUsed>=80){
                if(cpuUsed>=80){
                    html +='<h6 style="font-size:12px"><span>'+value[2]+'</span><span class="pull-right">CPU使用率</span></h6>';
                    html +='	<div class="progress "><div class="progress-bar progress-bar-darkorange" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+cpuUsed+'%"><span>'+cpuUsed+'%</span></div>     </div>'

                }else{
                    html +='<h6 style="font-size:12px"><span>'+value[2]+'</span><span class="pull-right">内存使用率</span></h6>';
                    html +='	<div class="progress "><div class="progress-bar progress-bar-darkorange" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+memUsed+'%"><span>'+memUsed+'%</span></div>     </div>'

                }
            }else{
                if(cpuUsed>=60){
                    html +='<h6 style="font-size:12px"><span>'+value[2]+'</span><span class="pull-right">CPU使用率</span></h6>';
                    html +='	<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+cpuUsed+'%"><span>'+cpuUsed+'%</span></div>     </div>'
                }else{
                    html +='<h6 style="font-size:12px"><span>'+value[2]+'</span><span class="pull-right">内存使用率</span></h6>';
                    html +='	<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: '+memUsed+'%"><span>'+memUsed+'%</span></div>     </div>'

                }
            }
        }else{


        }


    }
    if(flag==false){
        html +='<img src="assets/img/img/rentDashboard.png" style="width:135px">'
    }
    $("#resourceUsed").append(html);
}
//---------添加删除查看应用-----------
function addShowApp(){
    //$("#showapp").empty();
    $("#appname").find(".checkedapp").each(function(i,obj){
        $(obj).remove();
        $("#showapp").append(this);
        $(obj).attr("class",'');
    });
}
function cutShowApp(){
    $("#showapp").find(".checkedapp").each(function(i,obj){
        $(obj).remove();
        $("#appname").append(this);
        $(obj).attr("class",'');
    });
}

function fnGetData(obj,result){
    $(obj).empty();
    if(obj=='#CPUused'){
        var use_rate=result;
    }else{
        use_rate=parseInt(result);
    }

    var html='';
    html +='<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="'+use_rate+' aria-valuemin="0" aria-valuemax="100" style="height:'+use_rate+'%">';
    html +='<span>'+use_rate+'% </span>';
    html +='</div>';
    $(obj).append(html);
}

function fnGetApp(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+'apps/list?sys_id='+sys_id,
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
			text: (use_rate* 100) + '%',
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
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/tenant/app/usage?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
//				var arrCpu=[];
//				arrCpu.push(data);
            dataCpu = data.cpu;
            dataMem = data.mem;
            fnGetLineCPUData();
            fnGetLineMemData();
            var dataMemLast=data.mem[data.mem.length-1];
            var dataMemLastV=dataMemLast[1];
            fnGetData('#MerryUsed',dataMemLastV);
            var dataCpuLast=data.cpu[data.cpu.length-1];
            var dataCpuLastV=dataCpuLast[1];
            fnGetData('#CPUused',dataCpuLastV);
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function fnGetCpuData1(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/tenant/app/usage?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
//				var arrCpu=[];
//				arrCpu.push(data);
            dataCpu = dataCpu.concat(data.cpu);
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}


function fnGetMemData1(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/tenant/app/usage?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;

//				var arrCpu=[];
//				arrCpu.push(data);
            dataMem = dataMem.concat(data.mem);
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
var dataCpu=[];
//获取折线图
function fnGetLineCPUData(){
    // var formattery='{value} %';
    var arr=[];
    var arrTime=[];
    var arrValue=[];
    for(var i=0;i<4;i++){
        arr.push(dataCpu.shift());
        arrTime.push(arr[i][0]);
        arrValue.push(arr[i][1]);
    }
    var myChart = echarts.init(document.getElementById('CPUhistory'));
    var option = {
        title: {
        },
        grid:{
            x:35,
            y:15,
            x2:10,
            y2:30,
            borderWidth:1
        },color:['#343568'],

        tooltip: {
            trigger: 'axis',

        },
        xAxis: {
            type: 'category',
            data:arrTime,
            splitLine: {
                show: false
            }
        },
        yAxis: {
            // show:true,
            max:100,
            name:'单位%',
            // axisLabel: {
            //     show: true,
            //     interval: 'auto',
            //     // formatter:formattery
            // },
        },
        series: [{
            name: 'cpu使用率',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
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
            data: arrValue

        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    setInterval(function () {
        if(dataCpu==[]){
            return;
        }
        arr.shift();
        arrTime.shift();
        arrValue.shift();
        arr.push(dataCpu.shift());
        var arrLast=arr[arr.length-1];
        if(arrLast!=undefined){
            arrTime.push(arrLast[0]);
            arrValue.push(arrLast[1]);
        }
        myChart.setOption({
            series: [{
                data: arrValue
            }]
        });

    }, 1000);


}
var dataMem=[];
function fnGetLineMemData(){
    // var formattery='{value} %';
    var arr=[];
    var arrTime=[];
    var arrValue=[];
    for(var i=0;i<4;i++){
        arr.push(dataMem.shift());
        arrTime.push(arr[i][0]);
        arrValue.push(arr[i][1]);
    }
    var myChart = echarts.init(document.getElementById('Memhistory'));
    var option = {
        title: {
        },
        grid:{
            x:35,
            y:15,
            x2:10,
            y2:30,
            borderWidth:1
        },
        color:['#343568'],
        tooltip: {
            trigger: 'axis',

        },
        xAxis: {
            type: 'category',
            data:arrTime,
            splitLine: {
                show: false
            }
        },
        yAxis: {
            show:true,
            max:100,
            name : '单位%',
            axisLabel: {
                show: true,
                interval: 'auto',
                // formatter:formattery
            },
        },
        series: [{
            name: '内存使用率',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
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
            data: arrValue

        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    setInterval(function () {
        if(dataMem==[]){
            return;
        }
        arr.shift();
        arrTime.shift();
        arrValue.shift();
        arr.push(dataMem.shift());
        var arrLast=arr[arr.length-1];
        if(arrLast!=undefined){
            arrTime.push(arrLast[0]);
            arrValue.push(arrLast[1]);
        }
        myChart.setOption({
            series: [{
                data: arrValue
            }]
        });

    }, 1000);


}
//-----显示选择查看系统名称------
function fnBaseConfig(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'apps/list?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            if(result.data &&　result.data.length!=0){
                fnHandleBasefig(result.data);
            }
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function fnHandleBasefig(result){
    var data=[];
    var getData=[];
    for(var i = 0; i < result.length; i++){
        if(result[i].status=='1'){
            getData.push(result[i].app_name);
        }
    }
    var json = {};
    for(var i = 0; i < getData.length; i++){
        if(!json[getData[i]]){
            data.push(getData[i]);
            json[getData[i]] = 1;
        }
    }

    //系统名称
    $("#sysname").empty();
    $("#selectSysname").empty();
    $("#selectSysname").append('<option value="">选择要查看的应用名称</option>');
    for(var i = 0; i < data.length; i++){
        var a=data[i];
        $("#sysname").append(' <li onclick="changeSysColor(this)"><a href="javascript:;">'+a+'</a></li>');
        $("#selectSysname").append('<option value="'+a+'">'+a+'</option>');
    }
}


function fnsys_appEchart(){
    var selectsys=$("#selectSysname").val();
    if(selectsys!=""){
        $.ajax({
            type: 'GET',
            url: _URL_INTERFACE+'apps/list',
            headers: {
                "token": token
            },
            dataType: 'json',
            success:function (result) {
                var data=result.data;
                if(data.length!=0){
                    var app_id=[];
                    for(var i=0;i<data.length;i++){
                        if(data[i].sys_name==selectsys && data[i].status=='1'){
                            app_id.push(data[i].app_id);
                        }
                    }
                    fnAjaxAppId(app_id);
                }
            },error:function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status === 401){
                    window.location.href = '/index.html';
                }else{
                    // alert('添加失败！（例子）');//其他操作
                }
            }
        });
    }
}

function fnAjaxAppId(app_id){
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE+'dashboard/platform/apps/config?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "app_ids":app_id
        }),
        success:function (result) {
            /*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
            fnGetAppEchartData();

        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
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
        type: 'GET',
        url: _URL_INTERFACE+"dashboard/platform/apps/config?username="+_userName+'?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        async:false,
        success:function (result) {
            $("#showapp").empty();
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
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                $("#showapp").empty();
            }
        }
    });
}

function fnGetAppEchartData(){
    var _userName=_user.username;
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/platform/apps?sys_id='+sys_id,
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
                type: 'value',
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
        url: _URL_INTERFACE+'dashboard/platform/apps/config?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "app_ids":app_id
        }),
        success:function (result) {
            /*commonAlert("#successMsg", "#successAlertBlock", "操作成功");*/
            fnGetAppEchartData();
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}

//获取操作事件
function fngetEventData(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+'dashboard/platform/eventlog?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length==0){
                $("#eventlist").html("暂无查询数据");
                $("#eventlist").removeClass("timeline");
            }else{
                $("#eventlist").addClass("timeline");
                fnhandleEvent(data);
            }
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
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
        type: 'get',
        url: _URL_INTERFACE+'dashboard/sys/status?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            $("#sya_status").empty();
            var data=result.data;
            if(data && data.length!=0){
                fnHandleStatus(data);
                // fnCountSys(data);
            }else{
                $("#sya_status").html("暂无查询数据");
            }
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function fnHandleStatus(data){//onclick="fnDetailHealth(\''+datasys+'\')"
    var syscount=0;
    var health=0;
    var warn=0;
    for(var i=0;i<data.length;i++){
        if(i<5){
            var datasys=data[i],detail=datasys.detail;
//			datasys=JSON.stringify(detail);
            var html='';

            for(var j=0;j<detail.length;j++){
                syscount++;
                html+='<div class="databox-row row-2 bordered-bottom bordered-ivory padding-10">  ';
                html+=' <span class="databox-text darkgray pull-left no-margin hidden-xs">'+detail[j][0]+'</span>';
                if(data[i].health==true){
                    health++;
                    html+=' <span class="databox-text palegreen pull-right no-margin uppercase">正常</span>';
                }else{
                    warn++;
                    html+=' <span class="databox-text yellow pull-right no-margin uppercase">异常</span>';
                }
                html+='</div>';
            }

            $("#sya_status").append(html);
        }

    }
    fnShowStatusdata(syscount,health,warn);
}
function fnShowStatusdata(syscount,health,warn){
    var health_rate=(health/syscount)*100;
    $("#sys_count").empty();
    var html='';
    html +='<div class="databox-cell cell-3 text-center">';
    html +='<div class="databox-number number-xxlg sonic-silver">'+syscount+'</div>';
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
function fncontainer(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'dashboard/platform/container?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $("#sysnum").text(data.sysnum);
            $("#module").text(data.module);
            $("#containernum").text(data.container);
            fnLoadPiechart();
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
//设置磁盘饼图数据显示
function fnLoadPiechart(){
    var myChart = echarts.init(document.getElementById('DiskUsed'));
    var value;
    if($("#module").text()=='0'){
        value=0;
    }else{
        value=25;
    }
    option = {
        series : [
            {
                type: 'pie',
                radius : ['70%', '85%'],
                label: {
                    normal: {
                        position: 'center'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#57b5e3'
                    }
                },

                data:[
                    {
                        value:value, name:'占有率',
                        label: {
                            normal: {
                                formatter: '{d} %',
                                textStyle: {
                                    fontSize: 13
                                }
                            }
                        }
                    },
                    {
                        value:75, name:'占位',
                        tooltip: {
                            show: false
                        },
                        itemStyle: {
                            normal: {
                                color: '#ccc'
                            }
                        },
                        label: {
                            normal: {
                                formatter: '\n已使用'
                            }
                        }
                    }
                ]
            }
        ]
    };
    myChart.setOption(option);
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
function changeColor(obj){
    if($(obj).css("background-color")=="rgb(255, 255, 255)"){
        $(obj).css("background-color",'#d9edf7').attr("class",'checkedapp');
    }else{
        $(obj).css("background-color",'rgb(255, 255, 255)').attr("class",'');
    }
}
function changeSysColor(obj){
//	$("#sysname").find('li').css("background-color",'#rgb(255, 255, 255)').attr("class",'');
//	$(obj).css("background-color",'#f5f5f5').attr("class",'checkedsys');
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
    $("#sys_name").empty();
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+'apps/list?sys_id='+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            $("#appname").empty();
            var data=result.data;
            if(data.length==0){
                $("#sys_name").html("暂无查询数据");
            }else{
                for(var i=0;i<data.length;i++){
                    if(data[i].sys_name==$(obj).find('a').text()){
                        if(data[i].status=='1'){
                            var html='<li onclick="changeColor(this)" value="'+data[i].app_id+'"><a href="javascript:;">'+data[i].app_name+'</a></li>';
                            $("#appname").append(html);
                        }
                    }
                }
                fnDifferent();
            }


        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                $("#appname").empty();
                // alert('添加失败！（例子）');//其他操作
            }
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