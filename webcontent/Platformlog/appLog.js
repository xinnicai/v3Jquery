$(document).ready(function () {
  //formValidator();
  fnGetConfig();//

});

function fnOnSearch() {

  var end = '';
  var start = '';
  if ($("#searchtime").val() != '') {
    end = beforeNowtime('0');
    start = beforeNowtime($("#searchtime").val());
  }
  //var es_cluster=$("#selectCluster").val().split("#");es_cluster[0]es_cluster[1]
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'log/_search',
    dataType: 'json',
    headers: {
      "token": token
    },
    data: JSON.stringify({
      "start_time": start,
      "end_time": end,
      "app_name": $("#appName").val(),
      "keyword": $("#keywods").val(),
      "es_cluster": [{
        "host": '192.168.2.22',
        "port": '9200'
      }]
    }),
    success: function (result) {
      var hits = result.data.hits.hits;
      fnHandleLogCon(hits);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       // alert('获取失败！');//其他操作
      }
    }
  });
}
function fnHandleLogCon(data) {
  $("#applog").empty();
  if (data.length == 0) {
    $("#applog").text("暂无日志记录");
  } else {
    for (var i = 0; i < data.length; i++) {
      var _source = data[i]._source;
      var html = '<div class="logcontent" style="width:100%;height:100px;overflow:hidden;" onclick="fnLogDetail(\'' + _source.path + '\')">'
        + '<span style="display:inline-block;margin-right:20px;">' + _source.timestamp + '</span>'
        + '	<span>' + _source.source + '</span>'
        + '	<p>' + _source.message + '</p>'
        + '</div><hr>';
      $("#applog").append(html);
    }
  }

}

function fnLogDetail(getdata) {
  $("#threaddown_log").modal("show");
  var end = beforeNowtime('0');
  var start = beforeNowtime($("#searchtime").val());
  if ($("#searchtime").val() == '') {
    end = '';
    start = '';
  }
  var es_cluster = $("#selectCluster").val().split("#");
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+'/log/_search',
    dataType: 'json',
    headers: {
      "token": token
    },
    data: JSON.stringify({
      "start_time": start,
      "end_time": end,
      "app_name": $("#appName").val(),
      "keyword": $("#keywods").val(),
      "es_cluster": [{
        "host": es_cluster[0],
        "port": es_cluster[1]
      }]
    }),
    success: function (result) {
        var hits = result.data.hits.hits;
        for (var i = 0; i < hits.length; i++) {
          var _source = hits[i]._source;
          if (getdata == _source.path) {
            $("#logPath").text(_source.path);
            $("#message").text(_source.message);
            return;
          }
        }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert('获取失败！');//其他操作
      }
    }
  });

}
$("#downLog").click(function () {
  $("#threaddown_log").modal("hide");
  downloadFile($("#logPath").text(), $("#logPath").text());
});
function fnGetConfig() {
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+'log/esconfig',
    dataType: 'json',
    headers: {
      "token": token
    },
    success: function (result) {
        fnHandleEsconfig(result.data);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert('获取失败！');//其他操作
      }
    }
  });

}

function fnHandleEsconfig(data) {
//	var cluster=data.es_clusters;//集群
//	$("#selectCluster").empty();
//	for(var i=0;i<cluster.length;i++){
//		$("#selectCluster").append('<option value="'+cluster[i].address[0].host+'#'+cluster[i].address[0].port+'">'+cluster[i].name+'</option>');
//	}

  var app_list = data.app_list;//应用
  $("#appName").empty();
  for (var a = 0; a < app_list.length; a++) {
    $("#appName").append('<option value="' + app_list[a] + '">' + app_list[a] + '</option>');
  }

//	var instance_list=data.instance_list;//实例名
//	$("#instanceName").empty();
//	for(var i=0;i<instance_list.length;i++){
//		$("#instanceName").append('<option value="'+instance_list[i].name+'">'+instance_list[i].name+'</option>');
//	}
//	
//	var log_dir=data.log_dir;//日志目录
//	$("#logMenu").empty();
//	for(var i=0;i<log_dir.length;i++){
//		$("#logMenu").append('<option value="'+log_dir[i].name+'">'+log_dir[i].name+'</option>');
//	}
  fnOnSearch();
}

function downloadFile(fileName, content) {//文件名、路径
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/firefox/) != null) {
    window.open(content);
  }
  else if (ua.match(/chrome/) != null) {
    var aLink = document.createElement("a");
    aLink.download = fileName;
    aLink.href = content;
    aLink.click();
  } else if (ua.match(/msie/) != null) {
    window.open(content);
  }
}
//获取从现在到 beforetime 小时前的时间（beforetime 只能是整数）
function beforeNowtime(beforetime) {
  var setFormat = function (x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }
  var date = new Date(); //日期对象
  date.setHours(date.getHours() - beforetime);
  var now = "";
  now = date.getFullYear() + "-"; //读英文就行了
  now = now + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';//取月的时候取的是当前月-1如果想取当前月+1就可以了
  now = now + setFormat(date.getDate()) + " ";
  now = now + setFormat(date.getHours()) + ":";
  now = now + setFormat(date.getMinutes()) + ":";
  now = now + setFormat(date.getSeconds()) + "";
  return now;
}