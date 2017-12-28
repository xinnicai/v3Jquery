//setTimeout(fnMonitorEchart(),1000);
$(document).ready(function (){
  document.body.scrollTop = 0;
  //fnUserPower(uriArr,domArr);
  fnHandlePolicy();
  //setTimeout(fnMonitorEchart(),500);
  // fnUserPower(["apps/deployment","apps/undeployment","apps/scale/stop","apps/scale/auto","apps/restart","apps/autoscale/policy"],
  // 		["[data-target='#Release']","#undeployment","#appStop","#doScaleAppBtn","#RestartapplicationBtn","#autoApplitionBtn"]);
  //fnIsPublish(app_id);
  //fnBaseConfig();
  fnGetData();//容器管理
  fnDetail();
  fnGetMarathonAddr();//marathon地址
  fnAppStatus();//状态
  fnDataEvent();//fnAppEvent();//事件查看
  // fnAppVersion();//版本
  getFtpEnv();
  // getInterface();
  //fngetautodata(app_id);//弹性配
  // initImageSelect();
  $(".ctTime").datetimepicker({
    format: 'HH:mm'
  });


  fnnoUiSlider("#sample-onehandle3","#cooldownSeconds",0,60);
  //CPU
  fnnoUiSlider("#sample-onehandlecpu","#minCpuPercent",0,100);
  fnnoUiSlider("#sample-onehandle6","#maxConcurrentCPU",0,100);
  fnnoUiSlider("#sample-onehandle7","#scaleOutcpu",0,100);
  //内存
  fnnoUiSlider("#sample-onehandlemem","#minMemory",0,100);
  fnnoUiSlider("#sample-onehandle8","#maxMemory",0,100);
  fnnoUiSlider("#sample-onehandle9","#scaleOutmem",0,100);
  //线程
  fnnoUiSlider("#sample-onehandlecon","#minConcurrent",0,100);
  fnnoUiSlider("#sample-onehandle0","#maxConcurrent",0,100);
  fnnoUiSlider("#sample-onehand","#scaleOutcon",0,100);

});

// var params = parseParams(self.location.search);
// var app_id =params.appid ;//_local.appid;
var app_id =getUrlParam('appid');

var mourl='';
var maxResource='',autoMaxResource="";
var publish='';
var isStop=0,allClusre='',allclustername='';

$('#Release').on('show.bs.modal', function () {
  // fnAppVersion();
});
//验证是否已经发布、
function fnIsPublish(app_id){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+'apps/list',
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      for(var i=0;i<data.length;i++){
        if(data[i].app_id==app_id){
          publish=data[i].status;
        }
      }
    }
  });
}

var Applicationparams = setInterval(function () {
  fnControl(datamonitorcpu,"CPUused","CPU","#CPUused","notModal");
  fnControl(datamonitormem,"Memused","内存","#Memused","notModal");
  fnControl(datamonitorjvm,"JVM","JVM","#JVM","notModal");
  fnControl(datamonitorth,"thread","线程数","#thread","notModal");
  fnControl(datamonitorcon,"concurrent","并发数","#concurrent","notModal");
  fnControl(datamonitortainer,"containerused","容器数","#containerused","notModal");
  $("#editabledatatable").bootstrapTable("refresh");
},30000);
var datamonitorcpu='',datamonitormem= '',datamonitorjvm='',datamonitorth='',datamonitorcon='',datamonitortainer='';
function fnMonitorEchart(){
  if(allClusre==''){
    datamonitorcpu=_URL_INTERFACE+"monitor/apps/cpu?app_id="+app_id;
    datamonitormem= _URL_INTERFACE+"monitor/apps/mem?app_id="+app_id;
    datamonitorjvm=_URL_INTERFACE+"monitor/apps/jvm?app_id="+app_id;
    datamonitorth=_URL_INTERFACE+"monitor/apps/thread?app_id="+app_id;
    datamonitorcon=_URL_INTERFACE+"monitor/apps/concurrent?app_id="+app_id;
    datamonitortainer=_URL_INTERFACE+"monitor/apps/container?app_id="+app_id;
  }else{
    datamonitorcpu=_URL_INTERFACE+"monitor/apps/cpu?app_id="+app_id+"&label="+allClusre;
    datamonitormem= _URL_INTERFACE+"monitor/apps/mem?app_id="+app_id+"&label="+allClusre;
    datamonitorjvm=_URL_INTERFACE+"monitor/apps/jvm?app_id="+app_id+"&label="+allClusre;
    datamonitorth=_URL_INTERFACE+"monitor/apps/thread?app_id="+app_id+"&label="+allClusre;
    datamonitorcon=_URL_INTERFACE+"monitor/apps/concurrent?app_id="+app_id+"&label="+allClusre;
    datamonitortainer=_URL_INTERFACE+"monitor/apps/container?app_id="+app_id+"&label="+allClusre;
  }
//性能监控
  fnControl(datamonitorcpu,"CPUused",'CPU',"#CPUused","notModal");//cpu
  fnControl(datamonitormem,"Memused",'内存',"#Memused","notModal");//内存
//JVM
  fnControl(datamonitorjvm,"JVM",'JVM',"#JVM","notModal");
//线程数
  fnControl(datamonitorth,"thread",'线程数',"#thread","notModal");
//并发数
  fnControl(datamonitorcon,"concurrent",'并发数',"#concurrent","notModal");
//容器数
  fnControl(datamonitortainer,"containerused",'容器数',"#containerused","notModal");
}

function fnControl(a,b,c,d,ismodal){
  $.ajax({
    type: 'GET',
    url: a,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {

      var data=result.data;
      if(data.length>0) {
        var date = [], value = [];
        for (var i = 0; i < data.length; i++) {
          var aa = data[i];
          date.push(aa[0]);
          value.push(aa[1].toFixed(2));
        }
        fnEchart(b, c, date, value,ismodal);

      }
      // }else{
      // 	fnEchart(b,c,[],[]);
      // }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        fnEchart(b,c,[],[],ismodal);
      }
    }
  });
}
function showMore(c,type,china){
  $("#showMoreModal").modal("show");
  $("#showMoreType").text(china);
  $("#echartSpan").text(c);
  $("#echartSpan").attr("value",china);
  fnEchartMore(c,type,china);
}
function fnEchartMore(c,type,china){
  // console.log(app_id+" "+c+ "  "+type);
  var geturl='';
  if(allClusre==''){
    geturl=_URL_INTERFACE+"monitor/apps/history/"+c+"?type="+type+"&app_id="+app_id;
  }else{
    geturl=_URL_INTERFACE+"monitor/apps/history/"+c+"?type="+type+"&app_id="+app_id+"&label="+allClusre;
  }
  $.ajax({
    type: 'get',
    url: geturl,
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
          value.push((aa[1]).toFixed(2));
        }
        fnEchart("moreEchart",china,date,value,"modal");
      }else{
        fnEchart("moreEchart",china,[],[],"modal");
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
function chartRefresh(){
  var type=$("#moreSort").val();
  var c=$("#echartSpan").text();
  var china=$("#echartSpan").attr("value");
  fnEchartMore(c,type,china);
}
//获取发布的版本信息
// function fnAppVersion(){
//   $.ajax({
//     type: 'GET',
//     url: _URL_INTERFACE+"apps/version?app_id="+app_id,
//     headers: {
//       "token": token
//     },
//     dataType: 'json',
//     success:function (result) {
//       var data=result.data;
//       fnHandleVersionData(data);
//     },
//     error:function (XMLHttpRequest, textStatus, errorThrown) {
//       if(XMLHttpRequest.status === 401){
//         window.location.href = '#/login.html';
//       }else{
//         //alert('添加失败！（例子）');//其他操作
//       }
//     }
//   });
// }

function fnHandleVersionData(data){
  $("#_ReleaseTable").empty();
  if(data.length!=0){
    for(var i=0;i<data.length;i++){
      var link=data[i].file.download_url;
      var html='';
      if(data[i].is_used=="1"){
        html+='<tr class="success" dataFileFormat='+data[i].file.format+'>';
        html+='<td>';
        html+='<label>';
        html+='<input type="radio" disabled name="file-version" value="'+data[i].id+'">';
      }else if(data[i].is_used=="0"){
        html+='<tr  dataFileFormat='+data[i].file.format+'>';
        html+='<td>';
        html+='<label>';
        if(i==(data.length-1)){
          html+='<input type="radio" checked name="file-version" value="'+data[i].id+'">';
        }else{
          html+='<input type="radio" name="file-version" value="'+data[i].id+'">';
        }

      }

      html+='<span class="text"></span>';
      html+='</label>';
      html+='</td>';
      html+='<td class="fliename">'+data[i].file.name+'</td>';
      html+='<td class="version">'+data[i].version+'</td>';
      //html+='<span class="hidden dataFileFormat">'++'</span>'
      html+='<td class="fliesize"> '+data[i].file.size+'</td>';
      html+='<td class="createtime">'+data[i].create_time+'</td>';
      html+='<td class="username"> '+data[i].create_time+'</td>';
      if(data[i].is_used=="1"){
        html+='<td>运行中</td>';
      }else if(data[i].is_used=="0"){
        html+='<td>待发布</td>';
      }

      html+='<td>'+data[i].remark+'</td>';
      html+='<td><a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="fndownload('+"'"+link+"'"+')"><i class="fa fa-download"></i>下载</a></td>';
      html+='</tr>';

      $("#_ReleaseTable").append(html);
    }
  }else{
    $("#_ReleaseTable").append("<tr>暂无数据记录</tr>");
  }


}
/*****代码包下载*****/
function fndownload(link){
  window.location.href=link;
}
//***********get表格荣器管理*************//
function fnGetData(){
  $('#editabledatatable').bootstrapTable('destroy');
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE+"apps/container/list?app_id="+app_id, method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: false,dataType: 'json',
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',
    toolbar:'#btn-div',
    columns: [{
      title: '容器ID', field: 'containerid', searchable: true, sortable: true,class:"tdoverflow"
    },  {
      title: '节点', field: 'host', sortable: true, searchable: true
    },{
      title: '端口', field: 'ports', sortable: true, searchable: true
    },{
      title: '所属集群', field: 'cluster_name', sortable: true, searchable: true
    },{
      title: '启动时间', field: 'started_at', sortable: true, searchable: true,
    },{
      title: '版本校验', field: 'buildnum', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if(val){
          return '<i class="fa fa-check"></i>';
        }else{
          return '-';
        }
      }
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

        var data=row['app_id']+","+row['id']+','+row['label'],threaddump='threaddump,'+row['label'],containerlog='containerlog,'+row['label'];
        var containerHtml='';
        containerHtml += '<div class="btn-group">';
        containerHtml += '<a class="btn btn-azure btn-sm " href="javascript:void(0);" onclick="showContainerMonitor(\''+data+'\')"><i class="fa  fa-bar-chart-o"></i>性能监控</a>';
        containerHtml += '<a class="btn btn-azure btn-sm  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i class="fa fa-angle-down"></i></a>';
        containerHtml += '<ul class="dropdown-menu">';
        var mo = _user.mo;
          if(resetContainer==true){
            containerHtml += '<li class="containerbtn" onclick="showContinerModal(\''+data+'\')"><a href="javascript:void(0);">重启</a></li>';
          }
        containerHtml += '<li onclick="showthlogModal(\''+data+'\',\''+threaddump+'\')"><a href="javascript:void(0);">ThreadDump</a></li>';
        containerHtml += '<li onclick="showthlogModal(\''+data+'\',\''+containerlog+'\')"><a href="javascript:void(0);">查看日志</a></li>';
        containerHtml += '<li class="divider"></li>';
        containerHtml += '<li onclick="showDwonlogModal(\''+data+'\',\''+row['host']+'\')"><a href="javascript:void(0);">日志下载</a></li>';
        containerHtml += '<li onclick="webShell(\''+row['ports']+'\',\''+row['host']+'\')"><a href="javascript:void(0);">webshell</a></li></ul></div>';

        return containerHtml;
      }
    }],
    responseHandler: function (result) {

      if(allClusre==''){
        var data=result.data[0].containers;
        for(var a=1;a<result.data.length;a++){
          for(var b=0;b<result.data[a].containers.length;b++){
            data.push(result.data[a].containers[b]);
          }
        }
        return data;
      }else{
        for(var i=0;i<result.data.length;i++){
          if(allClusre==result.data[i].clusterlabel){
            return result.data[i].containers;
          }
        }
      }

    },
    onSearch: function (text) {
    },
    onLoadSuccess: function (data) {
    },
    onDblClickRow:function(data){
    }
  });
}
//webShell
function webShell(ports,host){
  ports=ports.split(',');
  var port=ports[ports.length-1];
  window.open("http://"+host+":"+port);
}
// setInterval('',30000);
//日志下载
function showDwonlogModal(data,a){
  var val=data.split(",");
  $("#dwonlogmodal").modal('show');
  getDwonloadLog(val[0],val[1],a);
}
function getDwonloadLog(val1,val2,val3){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"apps/container/task/logs/download?app_id="+val1+"&task_id="+val2+"&app_host="+val3,
    dataType: 'json',
    headers: {
      "token": token
    },
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

//容器日志、ThreadDump
function showthlogModal(data,type){
  $("#threaddown_log").modal('show');
  var name=type.split(',')[0];
  if(name=="threaddump"){
    $("#threaddown_logtype").text('ThreadDump');
    fnthreaddump(data,type);
  }else{
    $("#threaddown_logtype").text('日志');
    fnthreaddump(data,type);
  }
}
function fnthreaddump(data,type){//ThreadDump、日志
  var val=data.split(","),label=type.split(',');
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
      "type":label[0],
      "label":label[1]
    }),
    success:function (result) {
      var getdata=result.data;
      $("#message").text(getdata);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#message").text(result.msg);
      }
    }
  });
}
/*function fnthread_log(data,type){//容器日志
  var val=data.split(","),label=type.split(',');
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
        $("#message").text(result.msg);
      }
    }
  });
}*/
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
  fnCtnMonitor(data,type,"funmonitor",typeChina,"modal");
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
  fnCtnMonitor($("#monitordata").text(),type,"funmonitor",typeChina,"modal");

});
function fnCtnMonitor(data,type,b,typeChina,ismodal){
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
      "label":data[2],
      "type":type
    }),
    success:function (result) {
      var getdata=result.data;
      var date=[],value=[];
      if(getdata.length>0){
        for(var i=0;i<getdata.length;i++){
          var aa=getdata[i];
          date.push(aa[0]);
          value.push(parseFloat(aa[1]).toFixed(2));
        }
      }else{
        /*var _html="";
        _html+="<h2><stronge>"+type+"</stronge></h2>";
        _html+="<p>暂无查询记录</p>";
        $("#funmonitor").html(_html);*/
      }
      fnEchart(b,typeChina,date,value,ismodal);
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
//容器重启
function showContinerModal(data){
  $("#RestartContainer").modal('show');
  $("#restart").text(data);
}
function fuResartCon(){
  $("#modal-info").modal("show");
  $("#publishing").text("正在进行容器重启，请稍后......");
  var d = document.getElementById("statusslider");d.style.width = "50%";
  var data=$("#restart").text().split(",");
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/container/task/restart",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":data[0],
      "task_id":data[1],
      "label":data[2]
    }),
    success:function (result) {
      $("#modal-info").modal("hide");
      d.style.width = "100%";
      // $("#tips").modal("show");
      // $("#tipsSpan").text(''+$("#appName").text()+'重启成功，现在可以通过此页面查看应用的详细信息！');
      $("#success_msg").html('<i class="glyphicon glyphicon-check"></i>容器重启成功');
//				var data=result.data;
//				commonAlert("#successMsg", "#successAlertBlock", "容器重启成功");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#modal-info").modal("hide");
        $('#failmodal').modal('show');
        $('#failtitle').text('重启失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}

//创建新版本
function showuploadfile(){
  $('#uploadfile').modal('show');
}

//发布
function showrerlease(){
  window.location.href = '#/webcontent/Application/appPublishing.html?app_id='+app_id;
}

function publishAffirm(){
  var obj=$("#Release").find("[name='reset_cluster']").find("input[type='checkbox']:checked");
  var cluster_label=[];
  if(obj.length!=0 && obj.length<$("#Release").find("[name='reset_cluster']").find('input').length){
    for(var i=0;i<obj.length;i++){
      cluster_label.push(obj.attr('value'));
    }
  }else{
    if(allClusre!=''){
      cluster_label.push(allClusre);
    }
  }
  var val=$("#_ReleaseTable").find("input[type='radio']:checked").val();
  var tr=$("#_ReleaseTable").find("input[type='radio']:checked").parents('tr');
  var dataFileFormat=tr.attr("dataFileFormat");
  if(dataFileFormat=='image'){

    fnPublishImage(val,cluster_label);
  }else{
    if(val){
      $("#Release").modal("show");
      fnPublishVal(val,cluster_label);
    }else{
      $('#warningmodal').modal('show');
      $('#warningtitle').text('选择要发布的版本！！')

    }
  }

}
function fnPublishImage(val,cluster_label){
//	$("#Release").modal("hide");
  $("#modal-info").modal("show");
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/deployment/image",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "version_id":val,
      "cluster_label":cluster_label
    }),
    success:function (result) {
      var data=result.data;
//				commonAlert("#successMsg", "#successAlertBlock", "发布成功");
//				location.reload();
      $("#dohandle").text('发布');$("#publishing").text("正在进行发布操作，请稍后......");
      time(result.data);
    },
    error:function(XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('应用发布失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}
function fnPublishVal(val,cluster_label){

  $("#Release").modal("hide");
  $("#modal-info").modal("show");

  $.ajax({
    type: 'POST',
    url:_URL_INTERFACE+"apps/deploy",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "version_id":parseInt(val),
      "cluster_label":cluster_label
    }),
    success:function (result) {
      var data=result.data;
//				commonAlert("#successMsg", "#successAlertBlock", "发布成功");
//				location.reload();
      $("#dohandle").text('发布');$("#publishing").text("正在进行发布操作，请稍后......");
      time(result.data);

    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      $("#modal-info").modal("hide");
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('应用发布失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}
$('#tips').on('hidden.bs.modal', function () {
  location.reload();
});
//应用的发布状态
function fnSetIntval(resultdata){
  var url='';
  if(resultdata.length==1){
    url=_URL_INTERFACE+"apps/status?app_id="+app_id+"&label="+resultdata[0].clusterlabel;
  }else{
    url=_URL_INTERFACE+"apps/status?app_id="+app_id;
  }
  $.ajax({
    type: 'GET',
    url: url,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      var healthy=0,instances=0,staged=0,is_ok=0,successcluster='',failcluster='',failmsg='';
      for(var i=0;i<data.length;i++){
        instances+=parseInt(data[i].data.instances);
        healthy+=parseInt(data[i].data.healthy);
        staged+=parseInt(data[i].data.staged);
        if(resultdata.length>0){
          is_ok+=parseInt(resultdata[i].is_ok);
          if(resultdata[i].is_ok=='0'){
            successcluster+=resultdata[i].clustername;
          }else{
            failcluster+=resultdata[i].clustername;
            failmsg+='<p>'+resultdata[i].clustername+'失败原因：'+resultdata[i].errmsg+'</p>';
          }
        }

      }
      if(healthy==instances && staged==0){
        timeout=true;
        var d = document.getElementById("statusslider");d.style.width = "100%";
        $("#modal-info").modal("hide");
        var handle=$("#do").find("[do-name='dohandle']").eq(0).text();
        if(is_ok==0){
          $("#tips").modal("show");
          $("#tipsSpan").text('在'+successcluster+'集群'+handle+'成功,现在可以通过此页面查看应用的详细信息！');
        }else if(is_ok!=0 && is_ok<data.length){
          $("#tips").modal("show");
          $("#tipsSpan").text('在'+successcluster+'集群'+handle+'成功,'+failcluster+handle+'失败');
          $('#tipsSpan1').html(failmsg);
        }else{
          $('#failmodal').modal('show');
          $('#failtitle').text('在'+failcluster+'集群'+handle+'失败！！');
          $('#failInfo').html(failmsg);
        }
      }else if(staged!=0){
        var d = document.getElementById("statusslider");d.style.width ="60%";
        time(resultdata);
      }

    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      timeout=true;
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $("#modal-info").modal("hide");
        $('#failmodal').modal('show');
        $('#failtitle').text(handle+'失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}
var timeout = false; //启动及关闭按钮
var cleanApp='';
function time(resultdata)
{
  if(timeout) return;
  fnSetIntval(resultdata);
  cleanApp=setTimeout(function(){time(resultdata)},10000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
}

//获取当前时间
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
var mStatus = true;

function statusFalseShow() {
  if($("#appStop").text()=="启动"){
  $("#status").text("暂停");
  }else{
      $("#status").text("正在运行");
  }
  $('#Falsewarningmodal').modal('show');
  return;
}

function fnDetail(){
  $.ajax({
    type: 'GET',
    url:_URL_INTERFACE+"apps/detail?app_id="+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      fnHandleData(data);
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
var clusterLength='',clusterResetName='',proname='';
var group_mo;
var resetFlag,autoFlag,updateDeployFlag,scaleFlag;
function fnHandleData(data){
  group_mo=data.groupmo;
  fnSetDeployPower();
  fnSetStopPower();
  fnSetResetPower();
  fnSetScalePower();
  fnSetUndeploymentPower();
  fnSetAutoPower();
  fnSetUpdateDeployPower();
  fnControlMore();
  proname=data.sys_id;
  fnGetNewImg();
  var autoscale_policy=data.autoscale_policy;
  var app_id=data.app_id;
  if(autoscale_policy=="0"){
    $("#autoscale_policy").text("关闭");
    fnhandleupdate(app_id);
  }else{
    $("#autoscale_policy").text("开启");
    fnhandleupdate(app_id);
    //fngetautodata(app_id);
  }
  $("#appName").text(data.app.model_name);
  $("#zstest").text(data.app.model_name);
  $("#appID").text(data.app_id);
  $("#CPU").text(data.container.cpu);
  $("#mem").text(data.container.mem);
  $("#disk").text(data.container.disk);
  $("#image_url").text(data.container.image);
  $("#create_time").text(data.create_time);
  if(data.dnsname==""){
    $("#domain_name").text("未绑定域名");
    $("#vip_name").text("未使用负载均衡");
  }else{
    $("#domain_name").text(data.dnsname);
    if(data.vip==''){
      $("#vip_name").text('当前没有可用VIP');
    }else{
      $("#vip_name").text(data.vip);
    }
  }

  var cluster=data.deployment.resource;
  var clustername=[],clusterScale=[],handlescale='',clusterlabel=[];
  $("#clusterquota").empty();
  for(var a=0;a<cluster.length;a++){
    clustername.push(cluster[a].name);
    clusterlabel.push(cluster[a].label);
    if(cluster[a].quota==null){
      cluster[a].quota=100;
    }
    clusterScale.push(cluster[a].quota+'%');
    if(cluster.length>1) {
      handlescale += '<div class="form-group quota" style="margin-bottom:10px;">' +
        '<label class="col-sm-2 control-label margin-left-20 no-padding-right" label="' + cluster[a].label + '">' + cluster[a].name + '</label>' +
        '<div class="col-sm-9"> <div class="col-sm-10  no-padding-right">' +
        '<input type="text" class="form-control" value="' + cluster[a].quota + '" onkeyup="fnSumQuota()">' +
        '</div> <div class="col-sm-2 no-padding-right" >' +
        '<p class="no-padding-left">%</p> </div> </div> </div>';
    }

  }
  $("#clusterquota").append(handlescale);
  $("#cluster_list").attr('label',clusterlabel.join(','));
  $("#clusterScale").text('('+clustername.join(',')+'的分配比例为'+clusterScale.join(',')+')');

  if(cluster.length){
    clusterLength=cluster.length;
    $(".cluster_info").empty();
    $("[name='reset_cluster']").empty();
    var reset='';
    for(var i=0;i<clusterLength;i++){
      $(".cluster_info").append('<li><a>'+cluster[i].name+'</a></li>');
      clusterResetName=cluster[i].name;
      reset+='<div class="col-lg-3 col-sm-3 col-xs-3">';
      reset+='<div class="checkbox">';
      reset+='<label>';
      reset+='<input type="checkbox" class="colored-blue" value="'+cluster[i].label+'" checked>';
      reset+='<span class="text">'+cluster[i].name+'</span>';
      reset+='</label></div></div>';
    }
    if(clusterLength>1){
      $("[name='reset_cluster']").show();
      $("[name='reset_cluster']").append(reset);
    }else{
      $("[name='reset_cluster']").hide();
    }

    $("#clustertab").empty();$("#clustertab").css('display','none');
    if(cluster.length>1){
      $("#clustersidebar").show();
      var cluarename='';/*<li value="" class="active" >所有集群</li><li value="'+cluster[i].label+'">'+cluster[i].name+'</li>*/
      for(var i=0;i<cluster.length;i++){
        cluarename+=' <li value="'+cluster[i].label+'" onclick="fnChangeCluster(this)"><a href="javascript:;"><span class="menu-text">'+cluster[i].name+'</span> </a> </li>';
      }
      $("#clustertab").append(cluarename);
      $(".tabbable").parent().addClass('col-sm-10');
      $(".tabbable").parent().css('border-left','1px solid #ccc');
    }else{
      $("#clustersidebar").hide();
      $(".tabbable").parent().removeClass('col-sm-10');
      $(".tabbable").parent().css('border-left','none');
    }
    fnMonitorEchart();
  }
  haClusters=data.deployment.clusters;
  fnGetHa();
  var app_origin_detail=data.deployment.app_origin_detail;
  var app_origintype=data.deployment.app_origin;
  /*if(app_origintype==''){
    $("#updatestylemodal").find('[value="jxfb"]').parent().hide();
  }else{
    $("#updatestylemodal").find('[value="'+app_origintype+'"]').parent().hide();
  }*/
  $("#app_origin").find('div[value="'+app_origintype+'"] input').prop('checked',true);
  if(app_origintype=='fwqxz'){
    $("#ci_detail").show();
    $("#package_name").val(app_origin_detail.filename);
    $("#package_path").val(app_origin_detail.path);
  }else{
    $("#ci_detail").hide();
    $("#package_name").val('');
    $("#package_path").val('');
  };
  if(app_origintype=='bdsc'){
    $("div[name='bdsc']").css("display","block");
    $("div[name='fwqxz']").addClass("hidden");
    $("#now_origin").text("本地上传");
    $("#current").text("本地上传");
    $("#cluster_list").text("本地上传");
  }else if(app_origintype=='fwqxz'){
    $("div[name='fwqxz']").removeClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("#now_origin").text("持续集成");
    $("#current").text("持续集成");
    $("#cluster_list").text("持续集成");
    $("#upLoadFileContainer").addClass("hidden");
  }else{
    $("div[name='fwqxz']").addClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("#now_origin").text("镜像发布");
    $("#current").text("镜像发布");
    $("#cluster_list").text("镜像发布");
  }
}
//发布方式
document.getElementById("app_origin").addEventListener("click", function (e) {
  //$("#loadBalance").find("a").attr('class',"btn btn-default margin-right-10");
  if (e.target && e.target.nodeName == "SPAN") {
    if(e.target.childNodes[0].data == "持续集成"){
      //fnGetCiFtp();
      $("#ci_detail").show();
    }else{
      $("#ci_detail").hide();
    }
  }
});

function fnSumQuota(){
  var obj=$("#clusterquota").find('input'),sum=0;
  for(var i=0;i<obj.length;i++){
    var val=parseInt(obj.eq(i).val());
    sum+=val;
    if(val>100){
      $("#HMdo").attr('disabled',true);
      return;
    }else{
      $("#HMdo").attr('disabled',false);
    }
  }
  if(sum!=100){
    $("#HMdo").attr('disabled',true);
    return;
  }else{
    $("#HMdo").attr('disabled',false);
  }
}
function fnAllCluster(){
  allClusre='';
  allclustername='';
  fnGetData();
  fnMonitorEchart();
  fnResetCluster();
  fnAppStatus();
  fnGetMarathonAddr();
  fnGetHa();
}
function fnChangeCluster(obj){
    $("#clustertab").find('li').removeClass('active');
    $(obj).addClass('active');
    allClusre=$(obj).attr('value');
    allclustername=$(obj).find('span').text();
  fnGetData();
  fnMonitorEchart();
  fnResetCluster();
  fnAppStatus();
  fnGetMarathonAddr();
  fnGetHa();
}

/*document.getElementById("clustertab").addEventListener("click", function (e) {
  $("#clustertab").find("li").attr('class', "");
  if (e.target && e.target.nodeName == "LI") {
    e.target.className = "active";
    allClusre = e.target.attributes[0].nodeValue;
    allclustername = e.target.innerText;
  }

});*/
function fnResetCluster(){
  if(allClusre!=''){
    //var handlename=$("#Restartapplication").find('[hname="handlename1"]').eq(0).text();
    $("#Release").find("[name='reset_cluster']").html('<div class="col-lg-3 col-sm-3 col-xs-3">该应用发布在'+allclustername+'</div>');
    $("#Restartapplication").find(".modal-body [name='reset_cluster']").html('<div class="margin-left-20">该应用操作在'+allclustername+'</div>');
    $("#Restartapplication").find(".form-title").hide();
  }else{
    $("[name='reset_cluster']").empty();
    var reset='';
    for(var i=0;i<$("#clustertab").find("li").length;i++){
      var obj=$("#clustertab").find("li").eq(i);
      $(".cluster_info").append('<li><a>'+obj.find('span').text()+'</a></li>');
      clusterResetName=obj.find('span').text();
      reset+='<div class="col-lg-3 col-sm-3 col-xs-3">';
      reset+='<div class="checkbox">';
      reset+='<label>';
      reset+='<input type="checkbox" class="colored-blue" value="'+obj.attr('value')+'" checked>';
      reset+='<span class="text">'+obj.find('span').text()+'</span>';
      reset+='</label></div></div>';
    }
    $("[name='reset_cluster']").show();
    $("[name='reset_cluster']").append(reset);
    $("#Restartapplication").find(".form-title").show();

  }
}
//发布应用权限控制
function fnSetDeployPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="发布应用"){
      $("#deployButton").removeClass("hidden",true);
      return
    }else{
      $("#deployButton").addClass("hidden",true);
    }

  }

}
//启停应用权限控制
function fnSetStopPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="启停应用"){
      $("#appStop").removeClass("hidden",true);
      return
    }else{
      $("#appStop").addClass("hidden",true);
    }

  }
}
var resetContainer=false;
//重启应用权限控制
function fnSetResetPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="重启应用"){
      $("#RestartapplicationBtn").removeClass("hidden",true);
      resetFlag=false;
        resetContainer=true;
      return
    }else{
      $("#RestartapplicationBtn").addClass("hidden",true);
      resetFlag=true;
    }

  }
}
//手动扩缩权限控制
function fnSetScalePower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="手动扩缩"){
      $("#doScaleAppBtn").removeClass("hidden",true);
      scaleFlag=false;
      return
    }else{
      $("#doScaleAppBtn").addClass("hidden",true);
      scaleFlag=true;
    }

  }
}
//取消部署权限控制
function fnSetUndeploymentPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="取消部署"){
      $("#undeployment").removeClass("hidden",true);
      return
    }else{
      $("#undeployment").addClass("hidden",true);
    }

  }
}
//弹性配置权限控制
function fnSetAutoPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="弹性配置"){
      $("#autoApplitionBtn").removeClass("hidden",true);
      autoFlag=false;
      return
    }else{
      $("#autoApplitionBtn").addClass("hidden",true);
      autoFlag=true;
    }

  }
}
//更改发布方式权限控制
function fnSetUpdateDeployPower(){
  for(var i=0;i<group_mo.length;i++){
    if(group_mo[i].groupmo_name=="更改发布方式"){
      $("#updateBtn").removeClass("hidden",true);
      updateDeployFlag=false;
      return
    }else{
      $("#updateBtn").addClass("hidden",true);
      updateDeployFlag=true;
    }

  }
}
//控制查看更多按钮
function fnControlMore(){
  if(resetFlag&&autoFlag&&updateDeployFlag&&scaleFlag){
    $("#moreAppBtn").addClass("hidden",true);
  }else{
    $("#moreAppBtn").removeClass("hidden",true);
  }
}

//获取ha
var haClusters=[],ha_html='';
function fnGetHa(){
  var clusterHa=[];
  if(allClusre==''){
    for(var i=0;i<haClusters.length;i++){
      if(haClusters[i].haproxy.length>0){
        clusterHa.push(haClusters[i].haproxy);
      }
    }
  }else{
    for(var i=0;i<haClusters.length;i++){
      if(allClusre==haClusters[i].label && haClusters[i].haproxy.length>0){
        clusterHa.push(haClusters[i].haproxy);
      }

    }
  }
  if($("#cluster_list").text().split(',').length>1){
    $("#haproxy_table").empty();ha_html='';
    ha_html +='<tr>';
    for(var i=0;i<clusterHa.length;i++){
      if(i%4==0){
        ha_html +='<tr>'
      }
      ha_html +='<td class="param_key">'+clusterHa[i]+'</td>'

    }
    ha_html +='</tr>';
    $("#haproxy_table").append(ha_html);
    haproxy=clusterHa.join(",");
    $("#haproxy_list").text(haproxy);
  }else {
    if (clusterHa.length == 1) {
      haproxy = clusterHa.join(",");
      $("#haproxy_list").text(haproxy);
      $("#modalha").text(haproxy);
      $("#haproxy_table").remove();
    } else {
      ha_html += '<tr>';
      for (var i = 0; i < clusterHa.length; i++) {
        if (i % 4 == 0) {
          ha_html += '<tr>'
        }
        ha_html += '<td class="param_key">' + clusterHa[i] + '</td>'

      }
      ha_html += '</tr>';
      $("#haproxy_table").append(ha_html);
      haproxy = clusterHa.join(",");
      $("#haproxy_list").text(haproxy);
    }

  }

}
function fnHaproxyDetail(){
  if($("#haproxy_list").text()!=''){
    $("#haproxy_listmodal").modal('show');
  }
}
function fnUpdateStyle(){
  var str=$("#updatestylemodal").find('input[type="radio"]:checked').parents('.radio').attr('value');
  var flag=true;
  if($("#current").text()=='持续集成' || str=='fwqxz'){
    if($("#package_path").val()==''){
      $("#package_path").next().text('该项不能为空');
      flag=false;
    }else{
      $("#package_path").next().text('');
    }

    if($("#package_name").val()==''){
      $("#package_name").next().text('该项不能为空');
      flag=false;
    }else{
      $("#package_name").next().text('');
    }
  }
  if(flag){
    $('#updatestylemodal').modal('hide');
    $("#do").modal('show');
    $('[do-name="dohandle"]').text('更改发布方式');
  }

  $("#parameter").text(str);
  if($("#current").text()=='本地上传' || $("#current").text()=='持续集成'){
    if(str=='jxfb'){
      $("#infomessage").text('将发布方式改为镜像发布会导致应用重启');
    }else{
      $("#infomessage").text('');
    }
  }else {
    var style='持续集成';
    if(str=='bdsc'){
      style='本地上传';
    }
    $("#infomessage").text('将发布方式改为'+style+'导致应用重启');
  }
}
function fnDoUpdate(str){
  var deploy_mode='jxfb';
  if(str=='bdsc' || str=='fwqxz'){
    deploy_mode='gzcxb';
  }else{
    //str='';
  }
  var package_path='',package_name='';
  if(str=='fwqxz'){
    package_path=$("#package_path").val();
    package_name=$("#package_name").val();
  }
  $.ajax({
    type:'PUT',
    url:_URL_INTERFACE+"apps/deploymode",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id": app_id,
      "deploy_mode": deploy_mode,
      "app_origin": str,
      "package_path":package_path,
      "package_name":package_name
    }),
    success:function (result) {
      $("#do").modal('hide');
      $("#tips").modal('show');
      $("#tipsSpan").text('更改发布方式成功！');
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#do").modal('hide');
        $("#failmodal").modal('show');
        $('#failtitle').text('更改发布方式失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
  });
}
//最大资源
function fnhandleupdate(id){
  $.ajax({
    type:'POST',
    url:_URL_INTERFACE+"apps/resourceCheck/"+id,
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "scale": 0
    }),
    success:function (result) {
      var data=result.data;
      autoMaxResource=data.max_app_scale;
      fnnoUiSlider("#sample-onehandle2","#maxTasks",0,autoMaxResource);
      fnnoUiSlider("#sample-onehandle","#minTasks",0,autoMaxResource);
      //$("#maxInstances").text(autoMaxResource);
      if($("#autoscale_policy").text()=="关闭"){
        maxResource=data.max_app_scale;
        $("#maxInstances").text(maxResource);
      }
      fngetautodata(app_id);

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
//Marathon地址
function fnGetMarathonAddr(){
  $.ajax({
    type: 'GET',
    url:_URL_INTERFACE+"apps/marathon?app_id="+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=[],url='';
      $("#marathon_addr").empty();
      $("#marathon_addr").text('');
      if(allClusre!=''){
        for(var k=0;k<result.data.length;k++){
          if(result.data[k].clustername==allclustername){
            data.push(result.data[k]);
          }
        }
      }else{
        data=result.data;
      }
      if(data.length>0){
        for(var i=0;i<data.length;i++){
          if(i==data.length-1){
            url+='<a href="'+data[i].url+'" target="_blank">'+data[i].url+'</a>';
          }else{
            url+='<a href="'+data[i].url+'" target="_blank">'+data[i].url+',</a>';
          }
        }
        $("#marathon_addr").append(url);
      }else{
        $("#marathon_addr").text('未发布');
      }

			/*if(url.length==0){
			 url='未发布';
			 }else{
			 url=url.join(',');
			 }
			 */
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
//状态
function fnAppStatus(){
  var geturl=_URL_INTERFACE+"apps/status?app_id="+app_id;
  if(allClusre!=''){
    geturl=_URL_INTERFACE+"apps/status?app_id="+app_id+"&label="+allClusre;
  }
  $.ajax({
    type: 'GET',
    url: geturl,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      fnHandleStatusData(data);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#marathon_addr").text("异常情况");
        //commonAlert("#warningMsg", "#warningAlertBlock","marathon异常");
      }
    }

  });
}
function fnHandleStatusData(data){
  var appstatus='',instances=0,unknow=0,unheath=0,version=[];
  for(var i=0;i<data.length;i++){
    appstatus+='<div class="col-sm-12 no-padding-left"><div class="no-padding-left" style="width：29%"> <span is_ok="'+data[i].is_ok+'">';
    appstatus+=data[i].clustername+'( '+data[i].data.instances+' / '+data[i].data.running+' 实例)</span> ' ;
    if(data[i].status=="Finished"){
      appstatus+=' <strong style="color:#53A93F" class="appstatus">运行中</strong></div>';
    }else if(data[i].status=='Suspended'){
      appstatus+='<strong style="color:#FFCC33" class="appstatus">暂停中</strong></div>';
    }else if(data[i].status=='Deploying'){
      appstatus+='<strong style="color:#FFCC33" class="appstatus">部署中</strong></div>';
    }
    appstatus+='<div class="progress health-bar col-sm-4 " style="padding:0;margin:4px 4px 0 0;" data-reactid=".0.1.1.0.2.0">' ;
    appstatus+=' <div class="progress-bar health-bar-healthy" style="width:0%;" name="app-info-progress-healthy"></div>' ;
    appstatus+='<div class="progress-bar health-bar-unhealthy" style="width:0%;" name="app-info-progress-unhealthy"></div>' ;
    appstatus+='<div class="progress-bar health-bar-unknown " style="width:0%;" name="app-info-progress-unknown"></div>' ;
    appstatus+='<div class="progress-bar health-bar-staged" style="width:100%;" name="app-info-progress-staged"></div>' ;
    appstatus+='<div class="progress-bar health-bar-over-capacity" style="width:0%;" name="app-info-progress-over-capacity"></div>';
    appstatus+='<div class="progress-bar health-bar-unscheduled" style="width:0%;" name="app-info-progress-unscheduled"></div>';
    appstatus+=' &lt;!&ndash; <div class="loading-bar"></div> &ndash;&gt;';
    appstatus+='</div>';
    appstatus+='<span class="padding-left-5"> <i class="fa fa-circle success"></i></span>';
    appstatus+='<span class="padding-left-5 darkgray healthy">'+data[i].data.healthy+'</span>';
    appstatus+='<span class="padding-left-5 darkgray">健康</span>';

    appstatus+='<span class="padding-left-10"> <i class="fa fa-circle gray"></i></span>';
    appstatus+='<span class="padding-left-5 darkgray unknownspan">'+data[i].data.unknow+'</span>';
    appstatus+='<span class="padding-left-5 darkgray ">未知</span>';

    appstatus+='<span class="padding-left-10"> <i class="fa fa-circle danger"></i></span>';
    appstatus+='<span class="padding-left-5 darkgray unhealthy">'+data[i].data.unhealthy+'</span>';
    appstatus+='<span class="padding-left-5 darkgray ">非健康</span></div>';
    unknow += parseInt(data[i].data.unknow);
    unheath += parseInt(data[i].data.unhealthy);
    instances += parseInt(data[i].data.instances);
    if(data[i].data.version!=''){
      version.push(data[i].data.version);
    }
  }
  if(unknow==0 && unheath==0){
    mStatus=false;
  }else{
    mStatus=true;
  }
  isStop=instances;
  $("#clusterstatus").empty();
  $("#clusterstatus").append(appstatus);
  $("#now_version").text(version.join(','));
  $("#curentinstance").text(instances);//实例数
  if(instances==0){
    //$("#marathon_addr").text("未分配");
    $("#appStop").html('<i class="fa  fa-play">启动</i>');
  }else{
    $("#appStop").html('<i class="fa  fa-pause">暂停</i>');
  }

  for(var i=0;i<data.length;i++){
    if(data[i].data.instances!=0){
      $("[name='app-info-progress-healthy']").eq(i).css("width", ((data[i].data.healthy / data[i].data.running) * 100) + "%");
      $("[name='app-info-progress-unhealthy']").eq(i).css("width", ((data[i].data.unhealthy / data[i].data.running) * 100) + "%");
      $("[name='app-info-progress-staged']").eq(i).css("width", ((data[i].data.unknow / data[i].data.running) * 100) + "%");
    }else{

    }

  }
}
var cleanAppStatus;
cleanAppStatus=setInterval('fnAppStatus()',5000);
//重启
function fuReset(){
  var resetCluster=[];
  var obj=$("#Restartapplication").find("[name='reset_cluster']").find("input[type='checkbox']:checked");
  if(obj.length){
    for(var i=0;i<obj.length;i++){
      resetCluster.push(obj.eq(i).val());
    }
  }else{
    resetCluster.push(allClusre);
  }
  if(resetCluster.length==1 && resetCluster[0]==''){
    $("#warningmodal").modal('show');
    $("#warningtitle").text('请先选择要'+$('[hname="handlename"]').text()+'的集群');
    return;
  }else{
    $("#parameter").text(resetCluster.join(','));
    if($('[hname="handlename"]').text()=='启动'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("启动");
      $("#infomessage").text("");
    }else if($('[hname="handlename"]').text()=='重启'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("重启");
      $("#infomessage").text("");
    }else if($('[hname="handlename"]').text()=='暂停'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("暂停");
      $("#infomessage").text("暂停之后，该应用将暂停对外服务");
      //var param=$("#slider_value").val();
    }else if($('[hname="handlename"]').text()=='取消部署'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("取消部署");
      $("#infomessage").text("");
      //var param=$("#slider_value").val();
    }
  }

}
function fnDoReset(p){
  $("#modal-info").modal("show");
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/restart",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "pool":p
    }),
    success:function (result) {
      //commonAlert("#successMsg", "#successAlertBlock", "重启成功");
      $("#dohandle").text('重启');$("#publishing").text("正在进行服务重启，请稍后......");
      time(result.data);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#modal-info').modal('hide');
        $('#failmodal').modal('show');
        $('#failtitle').text('重启失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}

//取消发布
$("#undeployment").click(function(){
  if(mStatus===false){
    statusFalseShow();
    return;
  }
  if(isStop!=0){
    if(clusterLength=='1'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("取消部署");
      $("#infomessage").text('')
      var param=$("#slider_value").val();
      $("#parameter").text('');
    }else{
      $("[hname='handlename']").text("取消部署");
      $("[hname='handlename1']").text("取消部署");
      $("#Restartapplication").modal('show');
    }
  }else{
    $('#warningmodal').modal('show');
    $('#warningtitle').text('当前应用处于暂停状态，无需进行取消部署操作');
  }
});
function fnUndeploying(){
  var cluster_label=[];
  var obj=$("#Restartapplication").find("input[type='checkbox']:checked");
  if(obj.length>0){
    obj.each(function(i){
      cluster_label.push($(this).attr('value'));
    });
  }

  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"apps/undeployment",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "cluster_label":cluster_label
    }),
    success:function (result) {
      var data=result.data,is_ok=0,failmsg='',successmsg='';
      for(var i=0;i<data.length;i++){
        is_ok+=parseInt(data[i].is_ok);
        if(data[i].is_ok='1'){
          failmsg+=data[i].clustername+'取消部署失败：'+data[i].errmsg+";";
        }else{
          successmsg+=data[i].clustername+'取消部署成功';
        }
      }
      if(is_ok==0){
        $('#tips').modal('show');
        $('#tipsSpan').text('已成功取消部署啦！！')
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('取消部署失败！！');
        $('#failInfo').text(failmsg+successmsg);
      }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('取消部署失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}

//手动扩缩
$("#doScaleAppBtn").click(function(){
  /*if (mStatus===false){
    statusFalseShow();
    return;
  }*/
    $("#doScaleApp").modal("show");
    //$("#HMdo").attr('disabled',true);
    $("#doScaleApp").find("h4").text("手动扩缩");
});

function fnMaxValue(obj){
  var value=parseInt($(obj).val());
  if(value>maxResource){
    $(obj).val(maxResource);
  }
}
/*var scaleSlider = null;
 $("#doScaleApp").on('show.bs.modal', function () {
 if(scaleSlider == null){
 scaleSlider = fnnoUiSlider("#sample-onehandle4","#slider_value",0,maxResource);
 }
 $("#sample-onehandle4").val($("#slider_value").val());
 });*/
function fnScalemodal(){
  $("#do").modal('show');
  $("#infomessage").text("");
  var text=$("#doScaleApp").find("h4").text();
  $("#do").find("[do-name='dohandle']").text(text);
  var param=$("#slider_value").val();
  $("#parameter").text(param);

}

function fnunauto(data){
  var cluster_quota={};
  if($('.quota').length){
    for(var i=0;i<$('.quota').length;i++){
      var key=$('.quota').eq(i).find('label').attr('label');
      var value=$('.quota').eq(i).find('input').val();
      cluster_quota[key]=value;
    }
  }

  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"apps/scale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "scale":parseInt(data),
      "cluster_quota":cluster_quota
    }),
    success:function (result) {
      $('#tips').modal('show');
      $('#tipsSpan').text('扩缩成功！！')
      //location.reload();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('扩容失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
  });
}
//重启
$("#RestartapplicationBtn").click(function(){
  /*if (mStatus===false){
    statusFalseShow();
    return;
  }*/
  if(isStop!=0){
    if(clusterLength=='1'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("重启");
      $("#parameter").text($("#cluster_list").attr('label'));
    }else{
      $("[hname='handlename']").text("重启");
      $("[hname='handlename1']").text("重启");
      $("#Restartapplication").modal('show');
    }
  }else{
    $('#warningmodal').modal('show');
    $('#warningtitle').text('当前应用处于暂停状态，无需进行重启操作')
  }
});
//暂停
function fnDoModalShow(){
  if(isStop!=0){
    if(clusterLength=='1'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("暂停");
      $("#infomessage").text("暂停之后，该应用将暂停对外服务");
      var param=$("#slider_value").val();
      $("#parameter").text($("#cluster_list").attr('label'));
    }else{
      $("[hname='handlename']").text("暂停");
      $("[hname='handlename1']").text("暂停");
      $("#Restartapplication").modal('show');
    }
  }else{
    if(clusterLength=='1'){
      $("#do").modal('show');
      $("#do").find("[do-name='dohandle']").text("启动");
      $("#parameter").text($("#cluster_list").attr('label'));
    }else{
      $("[hname='handlename']").text("启动");
      $("[hname='handlename1']").text("启动");
      $("#Restartapplication").modal('show');
    }
  }
}
//暂停应用
function fnDoStop(scale,cluster_label){
  $("#modal-info").modal("show");
  var a;
  if(scale=='暂停'){
    a='0';
  }else{
    a='-1';
  }
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"apps/scale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "scale":a,
      "cluster_label":cluster_label
    }),
    success:function (result) {
      //commonAlert("#successMsg", "#successAlertBlock", "暂停成功");
      //location.reload();
      $('#editabledatatable').bootstrapTable("refresh");
      $("#dohandle").text(scale);$("#publishing").text("正在进行"+scale+"应用，请稍后......");
      time(result.data);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#modal-info').modal('hide');
        $('#failmodal').modal('show');
        $('#failtitle').text(scale+'失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
        // commonAlert("#warningMsg", "#warningAlertBlock", scale+"应用失败");
      }
    }
  });
}
//确认执行操作
function fndo(){
  var handle=$("#do").find("[do-name='dohandle']").eq(0).text();
  $("#do").modal('hide');
  var cl=$("#parameter").text().split(",");
  var cluter=[],cluster_label=[];
  for(var i=0;i<cl.length;i++){
    cluter.push({"label":cl[i]});
    cluster_label.push(cl[i]);
  }
  if(cl.length==1 && cl[0]==''){
    cluster_label=[];
  }
  if(handle=='重启'){
    fnDoReset(cluter);
  }else if(handle=='取消部署'){
    fnUndeploying();
  }else if(handle=='手动扩缩'){
    fnunauto($("#parameter").text());
  }else if(handle=='暂停' || handle=='启动'){
    fnDoStop(handle,cluster_label);
  }else if(handle=='更改发布方式'){
    fnDoUpdate($("#parameter").text());
  }
}
//事件查看
function fnDataEvent(){
  $('#appEvent').bootstrapTable({
    url: _URL_INTERFACE+"apps/event/log?app_id="+app_id+"&sort=desc", method: 'GET', cache: false,
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
        _html+='<li class="ticket-item evenwidth">';
        _html+='<div class="row">';
        _html+='<div class="ticket-user col-lg-9 col-sm-9">';
        _html+='<span class="user-name padding-top-10">'+val+'</span>';
        if(row['user_type']=="interface"){
        	_html+='<span class="user-company">              操作用户：'+row['username']+'(接口用户)';
        }else{
        	_html+='<span class="user-company">              操作用户：'+row['username'];
        }
        _html+='；    操作结果：     '+row['detail']+'。</span>';
        if(val=="应用扩缩容"){
          _html+='<span class="user-company">详细信息：'+row['verbose']+'</span>';
        }

        _html+='</div> ';
        _html+='<div class="ticket-time  col-lg-3 col-sm-3 col-xs-12">';
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

}
//上传程序包
$('#uploadfile').on('show.bs.modal', function () {
  if($("#now_origin").text()=="本地上传"){
    $("#checkedapp_origin").find("input[value='bdsc']").prop('checked',true);
    $('[name="bdsc"]').removeClass("hidden");
    $('[name="fwqxz"]').addClass("hidden");
  }else if($("#now_origin").text()=="镜像发布"){
    $("#checkedapp_origin").find("input[value='jxfb']").prop('checked',true);
    $('[name="jxfb"]').removeClass("hidden");
    $('[name="bdsc"]').addClass("hidden");
    // $("#docreate").prop("disabled",false);
  }else{
    $("#checkedapp_origin").find("input[value='fwqxz']").prop('checked',true);
    $("#docreate").attr("disabled",false);
  }
//
//	$("div[name='bdsc']").removeClass("hidden");
  $('#uploadfilebtn').empty();
  fnupload();

});
/*在源码jquery.Huploadify.js239行设置token*/
function fnupload(){
  $('#uploadfilebtn').Huploadify({
    auto:true,
    fileTypeExts:'*.zip;*.ear;*.tar;*.jar;*.war;*.tgz;*.tar.gz',
    multi:true,
    formData:null,
    fileSizeLimit:1024000000,
    showUploadedPercent:true,//是否实时显示上传的百分比，如20%
    showUploadedSize:true,
    removeTimeout:9999999,
    uploader: _URL_INTERFACE+'apps/upload/'+app_id,
    headers: {"token": token},
    onUploadStart:function(){
      //alert('开始上传');
    },
    onInit:function(){
      //alert('初始化');
    },
    onUploadComplete:function(file){
      //console.log(file);

    },
    onUploadSuccess:function(file,data,response){
      var info=JSON.parse(data);
      $("#disk_filename").text(info.disk_filename);
      // $("#size").text(file.size/1024);
      $("#format").text(info.format);
      $("#md5").text(info.md5);
      $("#raw_filename").text(info.raw_filename);
      $("#docreate").attr("disabled",false);
    },
    onDelete:function(file){
      console.log('删除的文件：'+file);
      console.log(file);
    }
  });
}
//获取系统信息ftp、env
function getFtpEnv(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/sysinfo?app_id="+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var envtext='';
      for(var i=0;i<result.data.env.length;i++){
        for(var name in result.data.env[i]){
          envtext += name + ":" + result.data.env[i][name] + "; ";
        }
      }
      $("#env").text(envtext);
      if(result.data.ftp){
        var ftp=result.data.ftp;
        $("#ftpInfo").text('服务器IP地址:'+ftp.ftp_ip+'; 服务器端口:'+ftp.ftp_port+'; 文件名:'+ftp.filename+'; 用户名'+ftp.ftp_username+'; 文件存放路径:'+ftp.path);
      }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
/*function fnCreateVersion(){
  var insideVersion=$("#insideVersion").val();
  var versionExp=$("#versionExp").val();
  var length=$("#uploadfilebtn").find(".totalsize").length;
  var file={"size":$("#uploadfilebtn").find(".totalsize").eq(length-1).text(),
    "format":$("#format").text(),
    "disk_filename":$("#disk_filename").text(),
    // "size":$("#size").text(),
    "md5":$("#md5").text(),
    "raw_filename":$("#raw_filename").text()
  };
  var ajaxdata='';
  if($("#now_origin").text()=="本地上传"){
    ajaxdata=JSON.stringify({
      "app_id":app_id,
      "type":'bdsc',
      "version":$("#insideVersion").val(),
      "remark":$("#versionExp").val(),
      "file":file
    });
  }else if($("#now_origin").text()=="持续集成"){
    ajaxdata=JSON.stringify({
      "app_id":app_id,
      "type":'fwqxz',
      "version":$("#cxinsideVersion").val(),
      "remark":$("#cxversionExp").val()
    });
  }else if($("#now_origin").text()=="镜像发布"){
    ajaxdata=JSON.stringify({
      "app_id":app_id,
      "type":"jxfb",
      "version":$("#jxinsideVersion").val(),
      "remark":$("#jxversionExp").val(),
      "image":$('#image_version').val()
    });
  }
  $("#docreate").attr('disabled',true);
  $.ajax({
    type: 'post',
    url: _URL_INTERFACE+"apps/version",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:ajaxdata,
    success:function (result) {
      $('#uploadfile').modal('hide');
      fnAppVersion();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#docreate").attr('disabled',false);
        $('#failmodal').modal('show');
        $('#failtitle').text('操作失败！！');
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
  });
}*/
//***********获取网络、资源池等基本信息*************//
/*function fnBaseConfig(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/deployment/baseconfig",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      fnHandleBasefig(result.data);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}*/
/*function fnHandleBasefig(data){
  //程序包来源
  var app_origin=data.app_origin;
  $("#checkedapp_origin").empty();
  for(var i = 0; i < app_origin.length; i++){
    var a=app_origin[i];
    var html='';
    html+='<div class="col-lg-4 col-sm-4 col-xs-4 no-padding-left">';
    html+='<div class="radio">';
    html+='<label>';
    html+='<input name="form-field-radio" type="radio" value="'+a[1]+'"  class="colored-success" onchange="fnchangeorigin()" >';
    html+='<span class="text">'+a[0]+'</span>';
    html+=' </label>';
    html+='</div>';
    html+='</div>';
    $("#checkedapp_origin").append(html);
  }
}*/
/*function fnchangeorigin(){
  var type=$("#checkedapp_origin").find("input[type='radio']:checked").val();
  if(type=='bdsc'){
    $("div[name='bdsc']").removeClass("hidden");
    $("div[name='fwqxz']").addClass("hidden");
    $("div[name='jxfb']").addClass("hidden");
    $("#now_origin").text("本地上传");
    $("#upLoadFileContainer").removeClass("hidden");
    $("#docreate").prop("disabled",true);
  }else if(type=='fwqxz'){
    $("div[name='fwqxz']").removeClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("div[name='jxfb']").addClass("hidden");
    $("#now_origin").text("持续集成");
    $("#upLoadFileContainer").addClass("hidden");
    $("#docreate").prop("disabled",false);
  }else{
    $("#upLoadFileContainer").addClass("hidden");
    $("div[name='jxfb']").removeClass("hidden");
    $("div[name='fwqxz']").addClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("#now_origin").text("镜像发布");
    $("#docreate").prop("disabled",false);
  }
}*/
function fnGetNewImg(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "harbor/projects/repo?project_name="+proname,
    headers: {
      "token": token
    },
    async:false,
    dataType: 'json',
    success: function (result) {

      $("#image_name").empty();
      var data=result.data;
      var _html='';
      for(var i=0;i<data.length;i++){
        _html+='<option value="'+data[i]+'">'+data[i].split("/")[1]+'</option>'
      }
      $("#image_name").append(_html);
      fnGetSpecialImg();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}
function fnGetSpecialImg(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "harbor/image/tags?repo="+$("#image_name").val(),
    headers: {
      "token": token
    },
    async:false,
    dataType: 'json',
    success: function (result) {
      $("#image_version").empty();
      var data=result.data;
      var _html='';
      var value=result.host+'/'+result.repo,value2=result.repo.split('/')[1];
      for(var i=0;i<data.length;i++){
        _html+='<option value="'+value+':'+data[i]+'">'+value2+":"+data[i]+'</option>'
      }
      $("#image_version").append(_html);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}
//弹性配置

//创建弹性
function fncreatescaleOut(){
  var autoScale=$("#autoScale").prop("checked");
  var minTasks=$("#minTasks").val();
  var cooldownSeconds=$("#cooldownSeconds").val();
  var maxTasks=$("#maxTasks").val();

  var scalePolicy={};
  var staticScalePolicy={};
  var senable=$("#AL").find("input[type='checkbox']").prop("checked");
  var scalePoints=[];
  $(".staticScale").each(function(i){
    var tasks= "";//local、share
    var time="";

    tasks = $(this).find(".tasks").val();
    time = $(this).find(".time").val();

    var arr = {"time":time, "tasks":tasks};
    scalePoints.push(arr);
  });
  staticScalePolicy={"enable":senable,"scalePoints":scalePoints};

  var cpuScalePolicy={};
  var minCpuPercent=$("#minCpuPercent").val();
  var scaleOutcpu=$("#scaleOutcpu").val();
  var cpuenable=$("#AK").find("input[type='checkbox']").prop("checked");
  var maxConcurrentCPU=$("#maxConcurrentCPU").val();
  cpuScalePolicy={"minCpuPercent": minCpuPercent,
    "scaleOutPercent": scaleOutcpu,
    "enable": cpuenable,
    "maxCpuPercent": maxConcurrentCPU};

  var concurrentScalePolicy={};
  var minConcurrent=$("#minConcurrent").val();
  var scaleOutcon=$("#scaleOutcon").val();
  var conenable=$("#AX").find("input[type='checkbox']").prop("checked");
  var maxConcurrent=$("#maxConcurrent").val();
  concurrentScalePolicy={"minConcurrent": minConcurrent,
    "scaleOutPercent": scaleOutcon,
    "enable": conenable,
    "maxConcurrent": maxConcurrent};

  var memoryScalePolicy={};
  var maxMemory=$("#maxMemory").val();
  var scaleOutmem=$("#scaleOutmem").val();
  var memenable=$("#AZ").find("input[type='checkbox']").prop("checked");
  var minMemory=$("#minMemory").val();
  memoryScalePolicy={"minMemory": minMemory,
    "scaleOutPercent": scaleOutmem,
    "enable": memenable,
    "maxMemory": maxMemory};
  scalePolicy={"cpuScalePolicy":cpuScalePolicy,"concurrentScalePolicy":concurrentScalePolicy,
    "memoryScalePolicy":memoryScalePolicy,
    "staticScalePolicy":staticScalePolicy};

  var scale_policy={};
  scale_policy={
    "appId":app_id,
    "autoScale":autoScale,
    "minTasks":minTasks,
    "autoScale":autoScale,
    "cooldownSeconds":cooldownSeconds,
    "scalePolicy":scalePolicy,
    "maxTasks":maxTasks
  };

  var scaletype='';
  if($("#marathon_endpoint").text()==''){
    scaletype="POST";
    data=JSON.stringify({
      "scale_policy":scale_policy,
      "autoscale_admin": autoScale,
      "app_id": app_id,
    });
  }else{
    scaletype="PUT";
    data=JSON.stringify({
      "scale_policy":scale_policy,
      "autoscale_admin": autoScale,
      "app_id": app_id,
    });
  }

  $("#creatApplition").modal("hide");
  fnautoScaleajax(data,scaletype);
}
function fnautoScaleajax(data,scaletype){
  $.ajax({
    type: "PUT",//scaletype,
    url: _URL_INTERFACE+"apps/autoscale/policy",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:data,
    success:function (result) {
      $('#tips').modal('show');
      $('#tipsSpan').text('弹性扩缩已配置好！！');
      //	location.reload();
      fngetautodata(app_id);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failtitle').text('弹性配置失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}

$("#e2").on("change",function(e){
  var val=$(this).select2("val");
  if(val==null){
    val=[];
  }
  val=val.join(",");
  if(val.indexOf('AL')!=-1){
    $("#AL").removeClass("hidden");
  }else{
    $("#AL").addClass("hidden");
    $("#sideAL").addClass("hidden");
    $("#AL").find("input[type='checkbox']").prop("checked",false);
    $("#AL").find("input").val('');
  }

  if(val.indexOf('AK')!=-1){
    $("#AK").removeClass("hidden");
  }else{
    $("#AK").addClass("hidden");
    $("#sideAK").addClass("hidden");
    $("#AK").find("input[type='checkbox']").prop("checked",false);
    $("#AK").find("input").val('0');
    $("#AK").find(".noUi-target").val('0');
  }

  if(val.indexOf('AZ')!=-1){
    $("#AZ").removeClass("hidden");
  }else{
    $("#AZ").addClass("hidden");
    $("#sideAZ").addClass("hidden");
    $("#AZ").find("input[type='checkbox']").prop("checked",false);
    $("#AZ").find("input").val('0');
    $("#AZ").find(".noUi-target").val('0');
  }

  if(val.indexOf('AX')!=-1){
    $("#AX").removeClass("hidden");
  }else{
    $("#AX").addClass("hidden");
    $("#sideAX").addClass("hidden");
    $("#AX").find("input[type='checkbox']").prop("checked",false);
    $("#AX").find("input").val('0');
    $("#AX").find(".noUi-target").val('0');
  }
});
//获取弹性
function fngetautodata(data){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"apps/autoscale/policy?app_id="+data,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      fnhandleautodata(data);
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
function fnhandleautodata(data){
  if(data.scale_policy){
    $("#marathon_endpoint").text(data.marathon_endpoint);
    var scale_policy=data.scale_policy;
    $("#autoScale").prop("checked",scale_policy.autoScale);
    $("#scale").empty();
    if(scale_policy.autoScale==true){
      $("#scale").html('<i class="fa fa-check-circle-o padding-right-5"></i>开启');
    }else{
      $("#scale").html('<i class="fa  fa-minus-square-o padding-right-5"></i>未开启');
    }
    $("#minTasks").val(scale_policy.minTasks);
    $("#mininstance").text(scale_policy.minTasks);
    $("#maxTasks").val(scale_policy.maxTasks);
    $("#maxinstance").text(scale_policy.maxTasks);
    $("#cooldownSeconds").val(scale_policy.cooldownSeconds);
    $("#cooltime").text(scale_policy.cooldownSeconds);
    $("#sample-onehandle").val(scale_policy.minTasks);//最小实例数


    maxResource=scale_policy.maxTasks;
    $("#maxInstances").text(maxResource);
    //fnnoUiSlider("#sample-onehandle2","#maxTasks",0,maxResource);
    $("#sample-onehandle2").val(scale_policy.maxTasks);//最大实例数
    $("#sample-onehandle3").val(scale_policy.cooldownSeconds);//冷却时间

    var selectval=[];
    //线程
    var scalePolicy=scale_policy.scalePolicy;
    var concurrentScalePolicy=scalePolicy.concurrentScalePolicy;
    if(concurrentScalePolicy.enable==true){
      $("#AX").removeClass("hidden");selectval.push('AX');
    }else{
      $("#AX").addClass("hidden");
    }
    $("#AX").find("input[type='checkbox']").prop("checked",concurrentScalePolicy.enable);
    $("#scaleOutcon").val(concurrentScalePolicy.scaleOutPercent);
    $("#minConcurrent").val(concurrentScalePolicy.minConcurrent);
    $("#maxConcurrent").val(concurrentScalePolicy.maxConcurrent);
    $("#sample-onehand").val(concurrentScalePolicy.scaleOutPercent);
    $("#sample-onehandlecon").val(concurrentScalePolicy.minConcurrent);
    $("#sample-onehandle0").val(concurrentScalePolicy.maxConcurrent);
    if(concurrentScalePolicy.enable==true){
      $("#sideAX").removeClass("hidden");
      $("#sideAX").find("[name='enabled']").html('<i class="fa fa-check-circle-o padding-right-5"></i>开启');
    }else{
      $("#sideAX").addClass("hidden");
      $("#sideAX").find("[name='enabled']").html('<i class="fa  fa-minus-square-o padding-right-5"></i>未启用');
    }
    $("#sideAX").find("[name='minthreshold']").text(concurrentScalePolicy.minConcurrent+"%");
    $("#sideAX").find("[name='maxthreshold']").text(concurrentScalePolicy.maxConcurrent+"%");
    $("#sideAX").find("[name='scaleratio']").text(concurrentScalePolicy.scaleOutPercent+"%");

    //cpu
    var cpuScalePolicy=scalePolicy.cpuScalePolicy;
    if(cpuScalePolicy.enable==true){
      $("#AK").removeClass("hidden");selectval.push('AK');
    }else{
      $("#AK").addClass("hidden");
    }
    $("#AK").find("input[type='checkbox']").prop("checked",cpuScalePolicy.enable);
    $("#scaleOutcpu").val(cpuScalePolicy.scaleOutPercent);
    $("#minCpuPercent").val(cpuScalePolicy.minCpuPercent);
    $("#maxConcurrentCPU").val(cpuScalePolicy.maxCpuPercent);
    $("#sample-onehandle7").val(cpuScalePolicy.scaleOutPercent);
    $("#sample-onehandlecpu").val(cpuScalePolicy.minCpuPercent);
    $("#sample-onehandle6").val(cpuScalePolicy.maxCpuPercent);
    if(cpuScalePolicy.enable==true){
      $("#sideAK").removeClass("hidden");
      $("#sideAK").find("[name='enabled']").html('<i class="fa fa-check-circle-o padding-right-5"></i>开启');
    }else{
      $("#sideAK").addClass("hidden");
      $("#sideAK").find("[name='enabled']").html('<i class="fa  fa-minus-square-o padding-right-5"></i>未启用');
    }
    $("#sideAK").find("[name='minthreshold']").text(cpuScalePolicy.minCpuPercent+"%");
    $("#sideAK").find("[name='maxthreshold']").text(cpuScalePolicy.maxCpuPercent+"%");
    $("#sideAK").find("[name='scaleratio']").text(cpuScalePolicy.scaleOutPercent+"%");

    //内存
    var memoryScalePolicy=scalePolicy.memoryScalePolicy;
    if(memoryScalePolicy.enable==true){
      $("#AZ").removeClass("hidden");selectval.push('AZ');
    }else{
      $("#AZ").addClass("hidden");
    }
    $("#AZ").find("input[type='checkbox']").prop("checked",memoryScalePolicy.enable);
    $("#scaleOutmem").val(memoryScalePolicy.scaleOutPercent);
    $("#minMemory").val(memoryScalePolicy.minMemory);
    $("#maxMemory").val(memoryScalePolicy.maxMemory);
    $("#sample-onehandle9").val(memoryScalePolicy.scaleOutPercent);
    $("#sample-onehandlemem").val(memoryScalePolicy.minMemory);
    $("#sample-onehandle8").val(memoryScalePolicy.maxMemory);
    if(memoryScalePolicy.enable==true){
      $("#sideAZ").removeClass("hidden");
      $("#sideAZ").find("[name='enabled']").html('<i class="fa fa-check-circle-o padding-right-5"></i>开启');
    }else{
      $("#sideAZ").addClass("hidden");
      $("#sideAZ").find("[name='enabled']").html('<i class="fa  fa-minus-square-o padding-right-5"></i>未启用');
    }
    $("#sideAZ").find("[name='minthreshold']").text(memoryScalePolicy.minMemory+"%");
    $("#sideAZ").find("[name='maxthreshold']").text(memoryScalePolicy.maxMemory+"%");
    $("#sideAZ").find("[name='scaleratio']").text(memoryScalePolicy.scaleOutPercent+"%");

    //定时策略
    var staticScalePolicy=scalePolicy.staticScalePolicy;
    if(staticScalePolicy.enable==true){
      $("#sideAL").removeClass("hidden");
      $("#AL").removeClass("hidden");selectval.push('AL');
    }else{
      $("#sideAl").addClass("hidden");
      $("#AL").addClass("hidden");
    }
    $("#AL").find("input[type='checkbox']").prop("checked",staticScalePolicy.enable);
    var scalePoints=staticScalePolicy.scalePoints;
    if(scalePoints.length > $(".staticScale").length){
      for(var i =0;i<scalePoints.length-1;i++){
        var portMappingsContent = "<div class=\"form-group margin-top-20 staticScale\">" + $(".staticScale").html() + "<\/div>";
        $(".staticScaleX").append(portMappingsContent);
      }
      for(var i =0;i<scalePoints.length-1;i++){
        var portMappingsContent = "<div class=\"more\">" + $(".more").html() + "<\/div>";
        $("#sideAL").append(portMappingsContent);
      }
    } else {
      $(".staticScale").each(function(i,obj){
        if(i <= scalePoints.length-1 && scalePoints.length >= 1){
          $(obj).find(".tasks").val('');
          $(obj).find(".time").val('');
        } else if(docker.length == 0 && i == 0){
          $(obj).find(".tasks").val('');
          $(obj).find(".time").val('');
        } else {
          obj.remove();
        }
      });
      $(".more").each(function(i,obj){
        if(i <= scalePoints.length-1 && scalePoints.length >= 1){
          $(obj).find(".tasks").text('');
          $(obj).find(".time").text('');
        } else if(docker.length == 0 && i == 0){
          $(obj).find(".tasks").text('');
          $(obj).find(".time").text('');
        } else {
          obj.remove();
        }
      });
    }
    $(".staticScale").each(function(i,obj){
      $.each(scalePoints,function(k,item){
        if(i==k){
          $(obj).find(".tasks").val(item.tasks);
          $(obj).find(".time").val(item.time);
        }
      });
    });
    $(".more").each(function(i,obj){
      $.each(scalePoints,function(k,item){
        if(i==k){
          $(obj).find(".tasks").text(item.tasks);
          $(obj).find(".time").text(item.time);
        }
      });
    });
    //定时策略侧边

    //$("#e2").select2("val", selectval);
    $("#e2").val(selectval);$("#e2").select2();
  }else{
    $("#marathon_endpoint").text('');
    $("#minTasks").val("0");
    $("#maxTasks").val("0");
    $("#cooldownSeconds").val("0");
    $("#sample-onehandle").val('0');//最小实例数
    $("#sample-onehandle2").val('0');//最大实例数
    $("#sample-onehandle3").val('0');//冷却时间
    $("#mininstance").text('0');
    $("#maxinstance").text('0');
    $("#cooltime").text('0');
    $("[name='minthreshold']").text('0');
    $("[name='maxthreshold']").text('0');
    $("[name='scaleratio']").text('0');
  }
}
$("#autoApplitionBtn").click(function(){
  $("#creatApplition").modal("show");
});
$("#updateBtn").click(function(){
  $("#updatestylemodal").modal('show');
});
function fnHandlePolicy(){
  $("#e2").empty();
  $("#e2").select2();
  $("#e2").append('<option value="">请选择规则</option>');
  $("#e2").append('<option value="AL">定时</option>');
  $("#e2").append('<option value="AK">CPU</option>');
  $("#e2").append('<option value="AZ">内存</option>');
  $("#e2").append('<option value="AX">线程数</option>');
  //fngetautodata(app_id);
}
$("#creatApplition").on('show.bs.modal', function () {

});
// $(function () {
//   	  $('#togglingForm').bootstrapValidator({
//
//
//             })
//             .find('button[data-toggle]')
//             .on('click', function () {
//                 var $target = $($(this).attr('data-toggle'));
//                 // Show or hide the additional fields
//                 // They will or will not be validated based on their visibilities
//                 $target.toggle();
//                 if (!$target.is(':visible')) {
//                     // Enable the submit buttons in case additional fields are not valid
//                     $('#togglingForm').data('bootstrapValidator').disableSubmitButtons(false);
//                 }
//             });
//      //$("#e2").select2();
//
//         // $("#e2").select2({
//         //     placeholder: "选择一个或多个目标",
//         //     allowClear: true
//         // });
//
//   });
function fnEchart(obj,a,date,value,ismodal){
  // console.log(value.length);
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById(obj));
  var legenddata=[];
  var formatter='';
  var formattery='';
  var maxValue;
  if(a=='CPU' || a=='内存' || a=='JVM'){
    legenddata.push(a+'使用率');
    formatter='{b}:\n{c}%';
    formattery='{value} %';
    maxValue=100;
  }else{
    legenddata.push(a);
    formattery='{value}';
    if(Math.max.apply(null, value)<=5){
      maxValue = 5;
    }else{
      maxValue=value;
    }
  }
  var rotates;
  var margins;
  if(ismodal=="modal"){
    rotates=0;
    margins=10;
  }else{
    rotates=65;
    margins=18;
  }
  option = {
    title : {
			/* text: a*/
      //subtext: '纯属虚构'
    },
    tooltip : {
      trigger: 'axis',
      formatter: formatter
    },
    color:['#343568'],
//	 legend: {
//	     data:legenddata,
//
//	 },
      grid: {
         left:"12%"
      },

          calculable : true,
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data : date,
        axisLabel : {
          show:true,
          interval: 'auto',    // {number}
          rotate: rotates,
          margin: margins,

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
        type : 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter:formattery
        },
        max: maxValue,
        show: true
      }
    ],
    series : [
      {
        name:legenddata.join(""),
        type:'line',
        symbol:'none',//去掉小圆点
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
    if(inp_val > parseInt($("#maxInstances").text())){
      $("#HMdo").prop("disabled",true);
    }else{
      $("#HMdo").prop("disabled",false);
    }
  }
}

function fnaddpolicy(){
  var volumesContent = "<div class=\"form-group margin-top-20 staticScale\">" + $(".staticScale").html() + "<\/div>";
  $(".staticScaleX").append(volumesContent);
  $(".ctTime").datetimepicker({
    format: 'HH:mm'
  });
}
function fnCutpolicy(obj){
  var divs = $(".staticScale");
  if (divs.length > 1){
    var pObj = obj.parentNode.parentNode.parentNode;
    pObj.parentNode.removeChild(pObj);
  }
}

//用户权限
/* var uriArr=fnUrlArr(),
 domArr=fnDomArr();

 var mourl=[];
 function fnUserPower(uriArr,domArr){

 var mo=JSON.parse(_user.mo);
 for(var i=0;i<mo.length;i++){
 mourl.push(mo[i].obj);
 }
 for(var a=0; a<uriArr.length; a++){
 var uri = uriArr[a];
 if(mourl.length==0){
 $(domArr[a]).css("display","none");
 }else{
 for(var b=0; b<mourl.length; b++){
 if(uri == mourl[b]){
 $(domArr[a]).css("display","inline-block");
 break;
 }else{
 $(domArr[a]).css("display","none");
 }
 }
 }

 }

 if(mourl.indexOf("apps/scale") < 0 && mourl.indexOf("apps/restart") < 0 && mourl.indexOf("apps/autoscale/policy") < 0){
 $("#moreAppBtn").css("display","none");
 }else{
 $("#moreAppBtn").css("display","inline-block");
 }
 }*/
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
function initImageSelect(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"himage/user/imagenames",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      try{
        var data= result.data;
        for(i=0;i<data.length;i++){
          $('#image-select').append('<option value="'+data[i]+'" >'+data[i]+'</option>')
        }
      }
      catch(err){
        console.log(err);
      }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert("获取镜像列表异常，请检查网络状态！");//其他操作
      }
    }
  });
}

function commonAlert(msgObjectName,alertObject,msg)
{
  $(msgObjectName).html(msg);
  $(alertObject).show();
}
//更新電話
function fnupdatePhoneCheckPower(forObj){
  if(_user.role_id != '1' && _user.role_id!= '4') {
    return;
  }else{
    fnupdatePhone(forObj);

  }
}
function fnupdatePhone(forObj){
  var id=forObj.id;
  if(id=="inter-phone"){
    $("#inter-phone").addClass("hidden",true);
    $("#update_phone").removeClass("hidden",true);
    $("#update_phone").val($("#inter-phone").text());
  }else{
    $("#inter-phone1").addClass("hidden",true);
    $("#update_phone1").removeClass("hidden",true);
    $("#update_phone1").val($("#inter-phone1").text());
  }

}
function fnValidatePhone(forObj){
  var id=forObj.id;
  var mobile;
  var returnvalue=true;
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if(id=="update_phone"){
    mobile=$("#update_phone").val();
    if(mobile.length!=11)
    {
      $("#update_phone").nextAll(".red").html("请输入11位的手机号！");
      returnvalue = false;
    }else if(!myreg.test(mobile))
    {
      $("#update_phone").nextAll(".red").html("请输入正确手机号！");
      returnvalue = false;
    }else {
      $("#update_phone").nextAll(".red").html("");
    }
  }else{
    mobile=$("#update_phone1").val();
    if(mobile.length!=11)
    {
      $("#update_phone1").nextAll(".red").html("请输入11位的手机号！");
      returnvalue = false;
    }else if(!myreg.test(mobile))
    {
      $("#update_phone1").nextAll(".red").html("请输入正确手机号！");
      returnvalue = false;
    }else {
      $("#update_phone1").nextAll(".red").html("");
    }
  }

  if(returnvalue==false){
    return;
  }else{
    updatePhoneAjax(forObj);
  }

}
function updatePhoneAjax(obj) {
  var aPhone;
  var bPhone;
  if($("#inter-man").text()==""||$("#inter-man1").text()==""){
    return;
  }
  if(obj.id=="update_phone"){
    aPhone=$("#update_phone").val();
    bPhone=$("#inter-phone1").text();
  }else{
    bPhone=$("#update_phone1").val();
    aPhone=$("#inter-phone").text();
  }
  $.ajax({
    type: 'put',
    url: _URL_INTERFACE+"apps/interface4a",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "interface_a":{
        "id": $("#interface_a_id").text(),
        "name": $("#inter-man").text(),
        "phone":aPhone,
        "company": $("#inter-depart").text(),
        "email":$("#inter-email").text()
      },
      "interface_b":{
        "id": $("#interface_b_id").text(),
        "name": $("#inter-man1").text(),
        "phone":bPhone,
        "company": $("#inter-depart1").text(),
        "email":$("#inter-email1").text()
      },
    }),

    success:function (result) {
      if(obj.id=="update_phone") {
        $("#update_phone").addClass("hidden", true);
        $("#inter-phone").removeClass("hidden", true);
      }else{
        $("#update_phone1").addClass("hidden", true);
        $("#inter-phone1").removeClass("hidden", true);
      }
      getInterface();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
//更新郵箱
function fnupdateEmailCheckPower(forObj){
  if(_user.role_id != '1' && _user.role_id!= '4') {
    return;
  }else{
    fnupdateEmail(forObj);

  }
}
function fnupdateEmail(forObj){
  var id=forObj.id;
  if(id=="inter-email"){
    $("#inter-email").addClass("hidden",true);
    $("#update_email").removeClass("hidden",true);
    $("#update_email").val($("#inter-email").text());
  }else{
    $("#inter-email1").addClass("hidden",true);
    $("#update_email1").removeClass("hidden",true);
    $("#update_email1").val($("#inter-email1").text());
  }

}
function fnValidateEmail(forObj){
  var emailFlag=true;
  var id=forObj.id;
  var email;
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if(id=="update_email"){
    email=$("#update_email").val();
    if(!re.test(email)){
      $("#update_email").nextAll(".red").html("请输入正确邮箱！");
      emailFlag=false;
    }else{
      $("#update_email").nextAll(".red").html("");
    }
  }else{
    email=$("#update_email1").val();
    if(!re.test(email)){
      $("#update_email1").nextAll(".red").html("请输入正确邮箱！");
      emailFlag=false;
    }else{
      $("#update_email1").nextAll(".red").html("");
    }
  }

  if(emailFlag==false){
    return;
  }else{
    updateEmailAjax(forObj);
  }

}
function updateEmailAjax(obj) {
  var aEmail;
  var bEmail;
  if($("#inter-man").text()==""||$("#inter-man1").text()==""){
    return;
  }
  if(obj.id=="update_email"){
    aEmail=$("#update_email").val();
    bEmail=$("#inter-email1").text();
  }else{
    aEmail=$("#inter-email").text();
    bEmail=$("#update_email1").val();
  }
  $.ajax({
    type: 'put',
    url: _URL_INTERFACE+"apps/interface4a",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "interface_a":{
        "id": $("#interface_a_id").text(),
        "name": $("#inter-man").text(),
        "phone":$("#inter-phone").text(),
        "email": aEmail,
        "company":$("#inter-depart").text()
      },
      "interface_b":{
        "id": $("#interface_b_id").text(),
        "name": $("#inter-man1").text(),
        "phone":$("#inter-phone").text(),
        "email": bEmail,
        "company":$("#inter-depart1").text()
      },
    }),

    success:function (result) {
      if(obj.id=="update_email") {
        $("#update_email").addClass("hidden", true);
        $("#inter-email").removeClass("hidden", true);
      }else{
        $("#update_email1").addClass("hidden", true);
        $("#inter-email1").removeClass("hidden", true);
      }
      getInterface();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
//更新接口人所屬單位

function fnupdateDepartCheckPower(forObj){
  if(_user.role_id != '1' && _user.role_id!= '4') {
    return;
  }else{
    fnupdateDepart(forObj);

  }
}
function fnupdateDepart(forObj){
  var id=forObj.id;
  if(id=="inter-depart"){
    $("#inter-depart").addClass("hidden",true);
    $("#update_depart").removeClass("hidden",true);
    $("#update_depart").val($("#inter-depart").text());
  }else{
    $("#inter-depart1").addClass("hidden",true);
    $("#update_depart1").removeClass("hidden",true);
    $("#update_depart1").val($("#inter-depart1").text());
  }

}
function fnValidateDepart(forObj){
  var departFlag=true;
  var id=forObj.id;
  var depart;
  if(id=="update_depart"){
    depart=$("#update_depart").val();
    if(depart==""){
      $("#update_depart").nextAll(".red").html("该项不能为空，请重输！");
      departFlag=false;
    }else{
      $("#update_depart").nextAll(".red").html("");
    }
  }else{
    depart=$("#update_depart1").val();
    if(depart==""){
      $("#update_depart1").nextAll(".red").html("该项不能为空，请重输！");
      departFlag=false;
    }else{
      $("#update_depart1").nextAll(".red").html("");
    }
  }

  if(departFlag==false){
    return;
  }else{
    updateDepartAjax(forObj);
  }

}
function updateDepartAjax(obj) {
  var aDepart;
  var bDepart;
  if($("#inter-man").text()==""||$("#inter-man1").text()==""){
    return;
  }
  if(obj.id=="update_depart"){
    aDepart=$("#update_depart").val();
    bDepart=$("#inter-depart1").text();
  }else{
    aDepart=$("#inter-depart").text();
    bDepart=$("#update_depart1").val();

  }

  $.ajax({
    type: 'put',
    url: _URL_INTERFACE+"apps/interface4a",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "interface_a":{
        "id": $("#interface_a_id").text(),
        "name": $("#inter-man").text(),
        "phone":$("#inter-phone").text(),
        "email": $("#inter-email").text(),
        "company":aDepart
      },
      "interface_b":{
        "id": $("#interface_b_id").text(),
        "name": $("#inter-man1").text(),
        "phone":$("#inter-phone").text(),
        "email": $("#inter-email1").text(),
        "company":bDepart
      },
    }),

    success:function (result) {
      if(obj.id=="update_depart") {
        $("#update_depart").addClass("hidden", true);
        $("#inter-depart").removeClass("hidden", true);
      }else{
        $("#update_depart1").addClass("hidden", true);
        $("#inter-depart1").removeClass("hidden", true);
      }
      getInterface();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
function fnReplace(forObj){
  if(_user.role_id != '1' && _user.role_id!= '4') {
    return;
  }else {
    if (forObj.id == "inter-mana") {
      $("#interface_aBlock").removeClass("hidden", true);
      $("#inter-man").addClass("hidden", true);
      $("#inter-man").text("");
      fngetInterfaceUser('#dataTypes');
    } else {
      $("#interface_aBlock1").removeClass("hidden", true);
      $("#inter-man1").addClass("hidden", true);
      $("#inter-man1").text("");
      fngetInterfaceUser('#dataTypes1');
    }
  }

}

function fngetInterfaceUser(obj){
  placeholder: "选择一个用户",
    $(obj).select2({
      tags:'true',
      language : "zh-CN",// 指定语言为中文，国际化才起效
      ajax: {
        type: 'GET',
        url: _URL_INTERFACE+'apps/interface4a',
        headers: {
          "token": token
        },
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            name: params.term, // search term
          };
        },
        processResults: function (data, params) {
          return {
            results: data.msg,
          };
        },
        cache: true
      },
      escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
      minimumInputLength: 1,
      templateResult: formatRepo, // omitted for brevity, see the source of this page
      templateSelection: function (formatRepoSelection){
        if(obj=="#dataTypes"){
          formatRepoSelection2(formatRepoSelection);
        }else{
          formatRepoSelection1(formatRepoSelection);
        }
        return formatRepoSelection.name;
      },
    });
}
function formatRepo (repo) {
  var markup;
  if (repo.loading) {
    return repo.text;
  }else{
    repo.text = repo.name
    repo.id = repo.id
    if(repo.text != undefined){
      markup = '<div >'+
        '<div ><strong>'+repo.name+'</strong></div>' +
        '<div  style="color:grey; ">所属单位：'+repo.company+'</div>'+
        '</div>';
    }else{

    }
  }
  return markup;

}
function formatRepoSelection2 (repo) {
  repo.selected = true;
  repo.code = repo.id
  repo.name = repo.text

  $("#interface_a_id").text(repo.id);
  $("#inter-man").text(repo.name);
  $("#inter-phone").text(repo.phone);
  $("#inter-email").text(repo.email);
  $("#inter-depart").text(repo.company);

}
function formatRepoSelection1 (repo) {
  repo.selected = true;
  repo.code = repo.id
  repo.name = repo.text

  $("#interface_b_id").text(repo.id);
  $("#inter-man1").text(repo.name);
  $("#inter-phone1").text(repo.phone);
  $("#inter-email1").text(repo.email);
  $("#inter-depart1").text(repo.company);

}
function fnNameAjax(forObj){
  var interface_a_id,interface_a_name,interface_a_phone,interface_a_email,interface_a_depart;
  var interface_b_id,interface_b_name,interface_b_phone,interface_b_email,interface_b_depart;
  interface_a_id=$("#interface_a_id").text();
  interface_a_name=$("#inter-man").text();
  interface_a_phone=$("#inter-phone").text();
  interface_a_email=$("#inter-email").text();
  interface_a_depart=$("#inter-depart").text();

  interface_b_id=$("#interface_b_id").text();
  interface_b_name=$("#inter-man1").text();
  interface_b_phone=$("#inter-phone1").text();
  interface_b_email=$("#inter-email1").text();
  interface_b_depart=$("#inter-depart1").text();
  if(forObj.id=="aAjax"){
    if($("#interface_a_Name").attr('data-flag')=="notEmpty"){
      interface_a_id=-1;
      interface_a_name=$("#interface_a_Name").val();
      interface_a_phone=$("#update_phone").val();
      interface_a_email=$("#update_email").val();
      interface_a_depart=$("#update_depart").val();
    }else{
      interface_a_id=$("#interface_a_id").text();
      interface_a_name=$("#dataTypes option:selected").text();
      interface_a_phone=$("#inter-phone").text();
      interface_a_email=$("#inter-email").text();
      interface_a_depart=$("#inter-depart").text();
    }
  }else{
    if($("#interface_b_Name").attr('data-flag')=="notEmpty"){
      interface_b_id=-1;
      interface_b_name=$("#interface_b_Name").val();
      interface_b_phone=$("#update_phone1").val();
      interface_b_email=$("#update_email1").val();
      interface_b_depart=$("#update_depart1").val();
    }else{
      interface_b_id=$("#interface_b_id").text();
      interface_b_name=$("#dataTypes1 option:selected").text();
      interface_b_phone=$("#inter-phone1").text();
      interface_b_email=$("#inter-email1").text();
      interface_b_depart=$("#inter-depart1").text();
    }
  }

  $.ajax({
    type: 'put',
    url: _URL_INTERFACE+"apps/interface4a",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":app_id,
      "interface_a":{
        "id": interface_a_id,
        "name": interface_a_name,
        "phone":interface_a_phone,
        "email": interface_a_email,
        "company":interface_a_depart
      },
      "interface_b":{
        "id": interface_b_id,
        "name": interface_b_name,
        "phone":interface_b_phone,
        "email": interface_b_email,
        "company":interface_b_depart
      },
    }),

    success:function (result) {
      if(forObj.id=="aAjax") {
        $("#inter-man").removeClass("hidden", true);
        $("#inter-phone").removeClass("hidden", true);
        $("#inter-email").removeClass("hidden", true);
        $("#inter-depart").removeClass("hidden", true);
        $("#interface_aBlock").addClass("hidden", true);
        $("#update_phone").addClass("hidden", true);
        $("#update_email").addClass("hidden", true);
        $("#update_depart").addClass("hidden", true);
      }else{
        $("#inter-man1").removeClass("hidden", true);
        $("#inter-phone1").removeClass("hidden", true);
        $("#inter-email1").removeClass("hidden", true);
        $("#inter-depart1").removeClass("hidden", true);
        $("#interface_aBlock1").addClass("hidden", true);
        $("#update_phone1").addClass("hidden", true);
        $("#update_email1").addClass("hidden", true);
        $("#update_depart1").addClass("hidden", true);

      }
      getInterface();

    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
function getInterface(){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"apps/create?app_id="+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      console.log(data);
      var data=result.data;
      var interface_a=data.interface_a;
      $("#interface_a_id").text(interface_a.id);
      $("#inter-man").text(interface_a.name);
      $("#inter-phone").text(interface_a.phone);
      $("#inter-email").text(interface_a.email);
      $("#inter-depart").text(interface_a.company);
      var interface_b=data.interface_b;
      $("#interface_b_id").text(interface_b.id);
      $("#inter-man1").text(interface_b.name);
      $("#inter-phone1").text(interface_b.phone);
      $("#inter-email1").text(interface_b.email);
      $("#inter-depart1").text(interface_b.company);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
function fnCheckClick(forObj){
  if(forObj.id=="typeselect"){
    $('#dataTypes').attr('data-click','true');
    $('#dataTypes1').attr('data-click','false');
  }else{
    $('#dataTypes1').attr('data-click','true');
    $('#dataTypes').attr('data-click','false');
  }

}

function fnValidate(forThis){
  $(forThis).attr('data','notEmpty');
  $(forThis).nextAll(".red").html("");
  if(forThis.id=="interface_a_Name"){
    $("#interface_a_Name").attr("data-flag","notEmpty");
  }else if(forThis.id=="interface_b_Name"){
    $("#interface_b_Name").attr("data-flag","notEmpty");
  }


}

function closeInputSelect(forObj) {
  if(forObj.id=='switcher'){
    $('#typeselect').removeClass('hidden');
    $('#typeinput').addClass('hidden');
    $("#addLogo").removeClass("hidden",true);
    $("#inter-phone").removeClass("hidden",true);
    $("#inter-email").removeClass("hidden",true);
    $("#inter-depart").removeClass("hidden",true);
    $("#update_phone").addClass("hidden",true);
    $("#update_email").addClass("hidden",true);
    $("#update_depart").addClass("hidden",true);
    $("#interface_a_Name").attr("data-flag","empty");
  }else{
    $('#typeselect1').removeClass('hidden');
    $('#typeinput1').addClass('hidden');

    $("#addLogo1").removeClass("hidden",true);
    $("#inter-phone1").removeClass("hidden",true);
    $("#inter-email1").removeClass("hidden",true);
    $("#inter-depart1").removeClass("hidden",true);
    $("#update_phone1").addClass("hidden",true);
    $("#update_email1").addClass("hidden",true);
    $("#update_depart1").addClass("hidden",true);
    $("#interface_b_Name").attr("data-flag","empty");

  }

}

function fnAddInterfaceUser(forObj){
  if(forObj.id=='addLogo'){
    $("#typeselect").addClass("hidden",true);
    $("#typeinput").removeClass("hidden",true);
    $("#addLogo").addClass("hidden",true);
    $("#inter-phone").addClass("hidden",true);
    $("#inter-email").addClass("hidden",true);
    $("#inter-depart").addClass("hidden",true);
    $("#update_phone").removeClass("hidden",true);
    $("#update_email").removeClass("hidden",true);
    $("#update_depart").removeClass("hidden",true);
  }else{
    $("#typeselect1").addClass("hidden",true);
    $("#typeinput1").removeClass("hidden",true);
    $("#addLogo1").addClass("hidden",true);
    $("#inter-phone1").addClass("hidden",true);
    $("#inter-email1").addClass("hidden",true);
    $("#inter-depart1").addClass("hidden",true);
    $("#update_phone1").removeClass("hidden",true);
    $("#update_email1").removeClass("hidden",true);
    $("#update_depart1").removeClass("hidden",true);

  }

}