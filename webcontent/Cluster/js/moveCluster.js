$(document).ready(function (){
  fnGetAllCluster();
  fnGetSysName();
});

var clusterName = getUrlParam('label1');//要迁的集群
var clusterlabel = getUrlParam('label2');//迁到的集群
function fnGetAllCluster(){
  $("#movecluster1").text(clusterName);
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"cluster",
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      var data = result.data;
      if(data){
        var option='';
        for (var i = 0; i < data.length; i++){
          if(data[i].label==clusterlabel){
            $("#movecluster2").text(data[i].name);
            $("#movecluster2").attr('label',data[i].label);
          }
          if(data[i].name==clusterName){
            $("#movecluster1").attr('label',data[i].label);
          }
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
//有应用的系统名称
function fnGetSysName(){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"apps/sys_with_app",
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      var data = result.data;
    $("#sysname1").empty();
      if(data){
        var option='';
        for (var i = 0; i < data.length; i++){
          if(i==0){
            option+='<li style="background-color: rgb(217, 237, 247);" ischecked="true" id="'+data[i].sys_id+'">';
            fnGetApp(data[i].sys_id);
          }else{
            option+='<li style="background-color: rgb(255, 255, 255);" ischecked="false" id="'+data[i].sys_id+'">';
          }
          option+='<a href="javascript:;">'+data[i].sys_name+'</a></li>';
        }
        $("#sysname1").append(option);
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
//应用名称
function fnGetApp(sys_id){
  $.ajax({
    type: 'GET',
    url:_URL_INTERFACE+"apps/list/min?sys_id="+sys_id,
    //url: _URL_INTERFACE+"platform/resource/"+sys_id,
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      var data=result.data;
      if(sys_id==''){
        data=[];
      }
      //var data = result.data;
      if(data){
        fnHandleCluster(data);
        fnHandleAppname(data);
      }
      fnAddBtnAttr();
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
function fnHandleAppname(data){
  var sysname=[];
  var options='',appname2=[];
  for(var a=0;a<$('#sysname1').find('[ischecked="true"]').find('a').length;a++){
    sysname.push($('#sysname1').find('[ischecked="true"]').find('a').eq(a).text());
  }
  for(var a=0;a<$('#appname2').find('li').find('a').length;a++){
    appname2.push($('#appname2').find('li').find('a').eq(a).text());
  }
  if(data.length>0){
    for(var i = 0; i < data.length; i++){
      var cluster=data[i].cluster;
      for(var j=0;j<cluster.length;j++){
        if(cluster[j].name==clusterName){
          options+='<li style="background-color: rgb(255, 255, 255);" ischecked="false" app_id="'+data[i].app_id+'">';
          options+='<a href="javascript:;">'+data[i].app_name+'</a></li>';
        }
      }
    }
  }

  $("#appname1").empty();
  if(options==''){
    $("#appname1").append('<li><a href="javascript:;">当前业务系统没有应用</a></li>');
  }else{
    $("#appname1").append(options);
    $("#appname1").find('li').eq(0).css('background-color','rgb(217, 237, 247)');
    $("#appname1").find('li').eq(0).attr('ischecked','true');
  }
}
function fnHandleCluster(data){
  for(var i=0;i<data.length;i++){
    var clusterdata=data[i].cluster;
    for(var k=0;k<clusterdata.length;k++){
      if(clusterdata[k].name==clusterName){
        $("#movecluster1").text(clusterdata[k].name);
        $("#comecluster").text(clusterdata[k].name);
        $("#movecluster1").attr('label',clusterdata[k].label);
        $("#movecluster1").attr('quota',clusterdata[k].quota);
      }
      if(clusterdata[k].label==clusterlabel){
        $("#movecluster2").text(clusterdata[k].name);
        $("#tocluster").text(clusterdata[k].name);
        $("#movecluster2").attr('label',clusterdata[k].label);
        $("#movecluster2").attr('quota',clusterdata[k].quota);
      }
    }
  }
}
function fnAddBtnAttr(){
  var syslength=$('#sysname1').find('[ischecked="true"]').length;
  var applength=$('#appname1').find('[ischecked="true"]').length;
  if(syslength>0 && applength>0){
    $(".addbtn").attr('disabled',false);
  }else{
    $(".addbtn").attr('disabled',true);
  }

  var syslength2=$('#sysname2').find('li').length;
  var applength2=$('#appname2').find('li').length;
  var syslength3=$('#sysname2').find('[ischecked="true"]').length;
  var applength3=$('#appname2').find('[ischecked="true"]').length;
  if(syslength2>0 && applength2>0){
    $(".surebtn").attr('disabled',false);
  }else{
    $(".surebtn").attr('disabled',true);
  }
  if(syslength3>0 && applength3>0){
    $(".cutbtn").attr('disabled',false);
  }else{
    $(".cutbtn").attr('disabled',true);
  }
}
//改变系统名称 onclick="fnChangeSysname()"

  $("#sysname1").delegate("li","click",function(){
    var sysid='';
    //所有业务系统都不选中
    $("#sysname1").find('li').css("background-color",'rgb(255, 255, 255)');
    $(this).attr("ischecked",'false');
    //当前点击的业务系统选中
    $(this).css("background-color",'rgb(217, 237, 247)');
    $(this).attr("ischecked",'true');
    sysid=$(this).attr("id");

    //业务系统可多选
    /*if($(this).attr("ischecked")=="false"){
      $(this).css("background-color",'rgb(217, 237, 247)');
      $(this).attr("ischecked",'true');
      sysid=$(this).attr("id");
    }else{
      $(this).css("background-color",'rgb(255, 255, 255)');
      $(this).attr("ischecked",'false');
      sysid='';
    }*/
    fnAddBtnAttr();
    fnGetApp(sysid);
  });
$("#appname1").delegate("li","click",function(){
  if($(this).attr("ischecked")=="false"){
    $(this).css("background-color",'rgb(217, 237, 247)');
    $(this).attr("ischecked",'true');
  }else{
    $(this).css("background-color",'rgb(255, 255, 255)');
    $(this).attr("ischecked",'false');
  }
  fnAddBtnAttr();
});
$("#sysname2").delegate("li","click",function(){
  if($(this).attr("ischecked")=="false"){
    $(this).css("background-color",'rgb(217, 237, 247)');
    $(this).attr("ischecked",'true');
  }else{
    $(this).css("background-color",'rgb(255, 255, 255)');
    $(this).attr("ischecked",'false');
  }
  fnAddBtnAttr();
});
$("#appname2").delegate("li","click",function(){
  if($(this).attr("ischecked")=="false"){
    $(this).css("background-color",'rgb(217, 237, 247)');
    $(this).attr("ischecked",'true');
  }else{
    $(this).css("background-color",'rgb(255, 255, 255)');
    $(this).attr("ischecked",'false');
  }
  fnAddBtnAttr();
});



/*$("#appname1").delegate("li","click",function(){
  if($(this).attr("ischecked")=="false"){
    $(this).css("background-color",'rgb(217, 237, 247)');
    $(this).attr("ischecked",'true');
  }else{
    $(this).css("background-color",'rgb(255, 255, 255)');
    $(this).attr("ischecked",'false');
  }
});*/
function addShowApp(){
  $("#sysname2").empty();
  $("#appname2").empty();
  $("#sysname1").find("[ischecked='true']").each(function(i,obj){
    $("#sysname2").append($(this).clone());
  });
  $("#appname1").find("[ischecked='true']").each(function(i,obj){
    $("#appname2").append($(this).clone());
  });
  $("#sysname2").find('li').css("background-color",'rgb(255, 255, 255)');
  $("#sysname2").find('li').attr("ischecked",'false');
  $("#appname2").find('li').attr("ischecked",'false');
  $("#appname2").find('li').css("background-color",'rgb(255, 255, 255)');
  fnAddBtnAttr();
}
function cutShowApp(){
  $("#sysname2").find("[ischecked='true']").each(function(i,obj){
    $(this).remove();
    // $("#sysname1").append(this);
  });
  $("#appname2").find("[ischecked='true']").each(function(i,obj){
    $(this).remove();
    //$(obj).attr("class",'');
  });
  fnAddBtnAttr();
}
//保存
function fnSureModal(){
  var apps=[];
  for(var i=0;i<$("#appname2").find('li').length;i++){
    apps.push($("#appname2").find('li a').eq(i).text());
  }
  $("#apps").text(apps.join(','));
  $("#MoveSureData").modal('show');
  /*if(apps.length>1){
    $("#warningmodal").modal('show');
    $("#warningtitle").text('只能迁移一个应用');
  }else{

  }*/
}
function fnSure(){
  $("#tips").modal('show');
  var trinfo=[],data={};
  for(var i=0;i<$("#appname2").find('li').length;i++){
    data={"app_id": $("#appname2").find('li').eq(i).attr('app_id'),
      "app_name": $("#appname2").find('li a').eq(i).text(),
      "cluster_name1": $("#movecluster1").text(),
      "cluster_name2": $("#movecluster2").text(),
      "weights": [{"cluster_label": $("#movecluster1").attr('label'), "weight": '0'},
        {"cluster_label": $("#movecluster2").attr('label'), "weight": '1'}]};
    trinfo.push(data);
  }
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"apps/transfer",
    headers: {
      "token": token
    },
    dataType: 'text',
    data:JSON.stringify({
      "trinfo":trinfo
    }),
    success:function (result) {
      var data=JSON.parse(result).data,is_ok=0,msg=[];
    for(var i=0;i<data.length;i++){
      is_ok+=data[i].is_ok;
      msg.push(data[i].msg);
    }
    $("#tips").modal('hide');
    $("#successModal").modal('show');
    if(is_ok==data.length){
      $("#SucessTitle").text('迁移成功！');
    }else if(is_ok==0){
      $("#SucessTitle").text('迁移失败！');
    }
    $("#Sucessmsg").text(msg.join(','));
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#tips").modal('hide');
        $("#failmodal").modal('show');
        $("#failtitle").text('迁移失败!');
        var msgdata=JSON.parse(XMLHttpRequest.responseText).data,errormsg=[];
        for(var k=0;k<msgdata.length;k++){
          errormsg.push(msgdata[k].msg);
        }
        $("#failInfo").text(errormsg.join(','));
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}
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