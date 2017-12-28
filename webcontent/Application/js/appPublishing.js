$(document).ready(function (){
  fnDetail();
  //fnGetVersion();
});
function application(){
  window.location.href="#/webcontent/Application/Application.html?appid="+app_id;
}
var app_id=getUrlParam('app_id'),proname='';

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

function fnHandleData(data){
  proname=data.sys_id;
  fnGetNewImg();
  $("#app_name").text(data.app.model_name);
  var cluster=data.deployment.resource;
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
      reset+='<input class="inputcheck" type="checkbox" class="colored-blue" value="'+cluster[i].label+'" checked>';
      reset+='<span class="text">'+cluster[i].name+'</span>';
      reset+='</label></div></div>';
    }
    if(clusterLength>1){
      $("[name='reset_cluster']").show();
      $("[name='reset_cluster']").append(reset);
    }else{
      $("[name='reset_cluster']").append('<p value="'+cluster[0].label+'" name="'+cluster[0].name+'">当前集群为'+cluster[0].name+'</p>');
    }

  }
  var app_origintype=data.deployment.app_origin;
  if(app_origintype==''){
    $("#updatestylemodal").find('[value="jxfb"]').parent().hide();
  }else{
    $("#updatestylemodal").find('[value="'+app_origintype+'"]').parent().hide();
  }
  fnGetVersion(app_origintype);
  if(app_origintype=='bdsc'){
    $("div[name='bdsc']").removeClass("hidden");
    $("div[name='bdsc']").css("display","block");
    $("div[name='fwqxz']").addClass("hidden");
    $("div[name='jxfb']").addClass("hidden");
    $("#now_origin").text("本地上传");
    $("#current").text("本地上传");
    $("#docreate").attr('disabled',true);
  }else if(app_origintype=='fwqxz'){
    $("div[name='fwqxz']").removeClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("div[name='jxfb']").addClass("hidden");
    $("#now_origin").text("持续集成");
    $("#current").text("持续集成");
    $("#upLoadFileContainer").addClass("hidden");
    $("#docreate").attr('disabled',false);
  }else{
    $("div[name='fwqxz']").addClass("hidden");
    $("div[name='bdsc']").addClass("hidden");
    $("div[name='jxfb']").removeClass("hidden");
    $("#upLoadFileContainer").addClass("hidden");
    $("#now_origin").text("镜像发布");
    $("#current").text("镜像发布");
    $("#docreate").attr('disabled',false);
  }
}
//获取版本
function fnGetVersion(app_origin){
  $("#_ReleaseTable").bootstrapTable('destroy');//+"&app_origin="+app_origin
  $('#_ReleaseTable').bootstrapTable({
    cache: false,
    ajaxOptions:{headers: {
      "token": token
    }},
    pageNumber: 1,      //初始化加载第一页，默认第一页
    pageSize: 10,      //每页的记录行数（*）
    pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
    ajax: function (params) {
      fnPaging(params);
    },
    search: false,dataType: 'json',
    searchAlign:'left',
    pagination: true, //data:"result.data",
    uniqueId: 'version_id',
    sidePagination: "server",//服务器端分页
    queryParamsType: '',
    // clickToSelect:true,
    // checkboxHeader:true,  //列头checkall
    // maintainSelected:true,  //分页 搜索记住check
    toolbar:'#btn-div',
    singleSelect : true,
    columns: [{
      checkbox: true,
     /* formatter: function (val, row, idx) {
       if(row['is_used']=='1'){
         return {disabled:true}
       }else{
         return {disabled:false}
       }
      }*/
    },{
      title: '文件名', field: 'file', searchable: true, sortable: true,
      formatter: function (val, row, idx) {
        return val.name;
      }
    },  {
      title: '版本号', field: 'version', sortable: true, searchable: true
    },{
      title: '发布目标', field: 'released_cluster', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if(val){
          return val.join(',');
        }else{
          return val;
        }

      }
    },{
      title: '上传时间', field: 'create_time', sortable: true, searchable: true
    },{
      title: '操作者', field: 'username', sortable: true, searchable: true
    },{
      title: '状态', field: 'is_used', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if(val=='1'){
          return '<span class="label label-success label-sm status">运行中</span>';
        }else if(val=='0'){
          return '<span class="label label-default label-sm">待发布</span>';
        }
      }
    },{
      title: '备注', field: 'remark', sortable: true, searchable: true
    },{
      title: '发布方式', field: 'deploy', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if(val.app_origin=='bdsc'){
          return '本地上传';
        }else if(val.app_origin=='fwqxz'){
          return '服务器下载';
        }else{
          return '镜像发布';
        }
      }
    },{
      title: '操作', field: 'file', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        var link=encodeURIComponent(val.download_url);
        return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="fndownload('+"'"+link+"'"+')"><i class="fa fa-download"></i>下载</a>';
      }
    }],
    /*responseHandler: function (result) {
      return result.data;
    },*/
    onLoadSuccess: function (data) {
      fnChangeTableCss();
    }
  });
}
function fnPaging(params){
  var txt='';
  var josn = params.data;
  var pageSize = josn.pageSize;
  var pageNumber = josn.pageNumber;
  if(josn.searchText){
    txt=josn.searchText;
  }
  $.ajax({
    type:'GET',
    url: _URL_INTERFACE +"apps/version?page=" + pageNumber + "&pageSize=" + pageSize+'&app_id='+app_id,
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (result) {
      var data = result;
      params.success({
        total: data.total,
        rows: data.data
      });
    },
    error: function (resp) {
      alertShow("提示:", "网络异常，加载失败!")
    }
  });
}
function fndownload(link){
var highLink=decodeURIComponent(link);
    window.open('http://'+highLink);
    // window.location.href=link;
}
function fnChangeTableCss(){
  /*$("input:disabled").css("background-color","#DFF0D8");
  $("input:disabled").css("color","#119000");*/
  $(".status").parents('tr').addClass('activeVersion');
  var length=$("#_ReleaseTable").find('input[type="checkbox"]').length;
  if($("#_ReleaseTable").find('input[type="checkbox"]').eq(length-1).attr('disabled')!='disabled'){
    $("#_ReleaseTable").find('input[type="checkbox"]').eq(length-1).attr("checked",true);
  }

}
//创建新版本
function showuploadfile(){
  $('#uploadfile').modal('show');
  $('#uploadfile').find('input').val('');
  $("#uploadfilebtn").empty();
  fnupload();
}
function fnCreateVersion(){
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
      fnGetVersion();
     // fnAppVersion();
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
}
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
function publishModal(){
  var tr=$("#_ReleaseTable").find("input[type='checkbox']:checked").parents('tr');
  var val=tr.attr('data-uniqueid');
  if(val){
    /*if($("#now_origin").text()=='镜像发布'){
     fnPublishImage(val,cluster_label);
     }else{*/
    $("#publishGoal").modal('show');
    $("#versionid").text(val);
    // }
  }else{
    $('#warningmodal').modal('show');
    $('#warningtitle').text('选择要发布的版本！！')
  }

}
function publishAffirm(){
  var obj=$("[name='reset_cluster']").find("input[type='checkbox']:checked");
  var cluster_label=[];
  if(obj.length!=0){
    for(var i=0;i<obj.length;i++){
      cluster_label.push(obj.eq(i).attr('value'));
    }
  }else{
    cluster_label.push($("[name='reset_cluster']").find('p').attr('value'));
  }
  if(cluster_label.length==0){
    $("#warningmodal").modal('show');
    $("#warningtitle").text('请先选择要'+$('[hname="handlename"]').text()+'的集群');
    return;
  }
  fnPublishVal($("#versionid").text(),cluster_label);
}
function fnPublishVal(val,cluster_label){

  $("#modal-info").modal("show");
  $("#dohandle").text('发布');$("#publishing").text("正在进行发布操作，请稍后......");
  var d = document.getElementById("statusslider");d.style.width = "60%";
  $.ajax({
    type: 'POST',
    url:_URL_INTERFACE+"apps/deploy",
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

     // time(result.data);
      var successcluster='',failcluster='',failmsg='',is_ok=0;
      for(var i=0;i<data.length;i++){
          is_ok+=parseInt(data[i].is_ok);
          if(data[i].is_ok=='0'){
            successcluster+=data[i].clustername;
          }else{
            failcluster+=data[i].clustername;
            failmsg+='<p>'+data[i].clustername+'发布失败原因：'+data[i].errmsg+'</p>';
          }
      }

      d='100%';
        $("#modal-info").modal("hide");
        if(is_ok==0){
          $("#tips").modal("show");
          $("#tipsSpan").html(successcluster+'发布成功,现在可以通过此页面查看应用的详细信息！');
        }else if(is_ok!=0 && is_ok<data.length){
          $("#tips").modal("show");
          $("#tipsSpan").html(successcluster+'发布成功,<span class="danger">'+failcluster+'发布失败</span>');
          $('#tipsSpan1').html(failmsg);
        }else{
          $('#failmodal').modal('show');
          $('#failtitle').text(failcluster+'发布失败！！');
          $('#failInfo').html(failmsg);
        }
      $("#_ReleaseTable").bootstrapTable('refresh');
      /*else if(is_ok!=0){
        var d = document.getElementById("statusslider");d.style.width ="60%";
        time(resultdata);
      }*/


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
  application();
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
        /*instances+=parseInt(data[i].data.instances);
        healthy+=parseInt(data[i].data.healthy);
        staged+=parseInt(data[i].data.staged);*/
        if(resultdata.length>0){
          is_ok+=parseInt(resultdata[i].is_ok);
          if(resultdata[i].is_ok=='0'){
            successcluster+=resultdata[i].clustername;
          }else{
            failcluster+=resultdata[i].clustername;
            failmsg+='<p>'+resultdata[i].clustername+'发布失败原因：'+resultdata[i].errmsg+'</p>';
          }
        }

      }
      if(is_ok==0){
        timeout=true;
        var d = document.getElementById("statusslider");d.style.width = "100%";
        $("#modal-info").modal("hide");
        if(is_ok==0){
          $("#tips").modal("show");
          $("#tipsSpan").text(successcluster+'发布成功,现在可以通过此页面查看应用的详细信息！');
        }else if(is_ok!=0 && is_ok<data.length){
          $("#tips").modal("show");
          $("#tipsSpan").text(successcluster+'发布成功,'+failcluster+'发布失败');
          $('#tipsSpan1').html(failmsg);
        }else{
          $('#failmodal').modal('show');
          $('#failtitle').text(failcluster+'发布失败！！');
          $('#failInfo').html(failmsg);
        }
      }else if(is_ok!=0){
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
        // commonAlert("#warningMsg", "#warningAlertBlock", "应用发布失败");
        $('#failmodal').modal('show');
        $('#failtitle').text('发布失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}
var timeout = false; //启动及关闭按钮
var cleanApp1='';
function time(resultdata)
{
  if(timeout){
    return;
  }else{
    fnSetIntval(resultdata);
    cleanApp1=setTimeout(function(){time(resultdata)},5000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
  }
}

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

