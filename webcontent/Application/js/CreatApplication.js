
$(document).ready(function (){
    //inputInit();
  fnGetPool();//资源池
  fnGetServer();
    showSysName();
  setTimeout(fnPretermit(),400);
 // fnGetConstraint();
  //fnGetImageVersion();
  fnGetNetwork();
/*  fngetInterfaceUser('#dataTypes');
  fngetInterfaceUser('#dataTypes1');*/
});
var editor1;
function fnaddimageshow(){
  $('#creatDataModal').modal('show');
  $("#img_remark").val('');
  $('#creatDataModal').find('input').val('');
  $('#creatDataModal').find('textarea').val('');
  $("#uploadfilebtn").empty();
  $("#uploadbtn").empty();
  fnGetCreateImgType();
  fnupload('#uploadfilebtn');
  fnupload('#uploadbtn');
}

function uuid(){
  return 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    var r=Math.random()*16|0,
      v=c=='x'?r:(r&0x3|0x8);
    return v.toString(16)
  }).toLowerCase()
}
var jsUuid=uuid().substr(0,10);
var maxinstances=1;
//页面跳转
function fnCancelUrl(str){
  $("#"+str).modal('hide');
  //window.history.go(-1);
  if(str=='failmodal'){
    window.location.href="#/webcontent/Application/Applist.html";
  }else if(str=='successmodal'){
    window.location.href="#/webcontent/Application/Application.html?appid="+$("#app_id").val();
  }
}
//初始化
var appID='';
function fnPretermit(){
  var role_id=_user.role_id;
  if(role_id != '1' && role_id != '4'){
    $(".listhide").hide();
    $(".dockerconfigure").hide();
    $(".centerconfigure").hide();
    $(".net_mode").attr('disabled',true);
  }else{
    $(".net_mode").attr('disabled',false);
    $("#con_CPU").find('select').append('<option value="">新增</option>');
    $("#con_mem").find('select').append('<option value="">新增</option>');
  }
  if(getUrlParam('domain_code')){
    $(".sys_select").hide();
    $(".sys_input").show();
    var titlename=getUrlParam('sysdomain_code').split('/')[1];
    $("#titleName").html('<span>'+titlename+'</span>');
    $("#firstinput").attr('updatedata',getUrlParam('domain_code'));
    $("#firstinput").val(getUrlParam('domain_code').split('/')[1]);
    $("#secondinput").attr('updatedata',getUrlParam('subdomain_code'));
    $("#secondinput").val(getUrlParam('subdomain_code').split('/')[1]);
    $("#thirdinput").attr('updatedata',getUrlParam('sysdomain_code'));
    $("#thirdinput").val(titlename);
  }else{
    $(".sys_select").show();
    $(".sys_input").hide();
    $("#titleName").html('<a href="#/webcontent/Application/Applist.html">应用列表</a>');
  }
   /* $("#titleName").html('<a href="#/webcontent/Application/Applist.html">应用列表</a>');*/
    $("#pageType").text('创建应用');
    $("#_NextBtn").attr('data-last','创建');
    $("span[name='create']").text('创建');
    fnCreateInit();
    fnGetImgType('special');
}
var oldData='',createData;
function fnCreateData(oldData){
  var resources_production_domain='';
  resources_production_domain={'code':$("#ResourcesPool").find('.btn-info ').attr('value'),
  'name':$("#ResourcesPool").find('.btn-info ').text()};
  var business_domain='',business_subdomain='',business_sysdomain='';
 if($(".sys_input").css('display')=='block'){
   business_domain=$("#firstinput").attr('updatedata').split('/');
   business_subdomain=$("#secondinput").attr('updatedata').split('/');
   business_sysdomain=$("#thirdinput").attr('updatedata').split('/');
 }else{
   business_domain=$("#firstResource").select2('val').split('/');
   business_subdomain=$("#secondResource").select2('val').split('/');
    business_sysdomain=$("#thirdResource").select2('val').split('/');

 }

  var domain={
    "business_domain": {'code':business_domain[0],
                      'name':business_domain[1]},
      "business_subdomain": {'code':business_subdomain[0],
                        'name':business_subdomain[1]},
      "business_sysdomain": {'code':business_sysdomain[0],
                          'name':business_sysdomain[1]}
  };

  var name=$("#app_name").val();
  //var ciinput=$("#ci").find('[checked="checked"]').attr('value');
  var ci;
  if($("#ci").find('input[value="true"]').is(':checked')){
    ci=1;
  }else if($("#ci").find('input[value="false"]').is(':checked')){
    ci=0;
  }else{
    ci=2;
  }
  //if(ciinput==true) {


 var image_type=$("#image").find('.btn-info').attr('value');
  var image_name,image_version;
  if(image_type=='private'){
    image_name='';
    image_version=$("#image_version").val();
  }else{
    image_name=$("#image_name").val();
    image_version=$("#image_version").val();
  }
  var image={
    "name": image_name,
      "version": image_version
  };
  var image_settings= {
    "min_thread": $("#img_min_thread").val(),
      "max_thread": $("#img_max_thread").val(),
      "queue_length": $("#img_acceptCount").val(),
      "time_out": $("#img_timeout").val(),
      "min_heap": $("#imgXms").val(),
      "max_heap": $("#imgXmx").val(),
      "min_not_heap": $("#img_PermSize").val(),
      "max_not_heap": $("#img_MaxPermSize").val()
  };

    var interface_a_id;
    if($("#interface_a_Name").attr('data-flag')=="notEmpty"){
        interface_a_id=-1;
    }else{
        interface_a_id=$("#saveIdBlock").text();
    }

    var interfaceAname;
    if(interface_a_id==-1){
        interfaceAname=$("#interface_a_Name").val();
    }else{
        interfaceAname=$("#dataTypes option:selected").text();
    }
  /*var interface_a={
          "id":interface_a_id,
          "name": interfaceAname,
          "phone": $("#interface_a_Tel").val(),
          "email": $("#interface_a_Email").val(),
          "company": $("#interfaceDepart").val()
  };*/
  var interface_a={"id":'', "name": '', "phone": '', "email": '', "company": ''};
  var interface_b={"id":'', "name": '', "phone": '', "email": '', "company": ''};
    /*var interface_b_id;
    if($("#interface_b_Name").attr('data-flag')=="notEmpty"){
        interface_b_id=-1;
    }else{
        interface_b_id=$("#saveIdBlock1").text();
    }

    var interfaceBname;
    if(interface_b_id==-1){
        interfaceBname=$("#interface_b_Name").val();
    }else{
        interfaceBname=$("#dataTypes1 option:selected").text();
    }

    var interface_b={
        "id":interface_b_id,
        "name": interfaceBname,
        "phone": $("#interface_b_Tel").val(),
        "email": $("#interface_b_Email").val(),
        "company": $("#interface_b_Depart").val()
    };*/
  var cpu_mem=$(".con_configureX").find('.active div').text().split('/');
  var container_spec={
    "cpu": parseFloat(cpu_mem[0]),
      "mem": parseFloat(cpu_mem[1])*1024,
    "disk":3*1024
  };
  var instance=$("#instances").val();

  var env=[];
  if(appID ==''){
   // env=[{"key":'APPNAME', "val":'ROOT.war'},{"key":'TZ', "val":'Asia/Shanghai'},{"key":'JAVA_HOME', "val":'/app/jdk'}];
  }
  $(".envContent ").each(function(i){
    var key= $(this).find(".env_key").val();//local、share
    var value=$(this).find(".env_value").val();

    var arr = {"key":key, "val":value};
    env.push(arr);
  });

  var command=$("#start_command").val();
    var lb='';//$("#loadBalance").find('input:radio:checked').attr('value');
  if($("#loadBalance").find('input[value="1"]').is(':checked')){
    lb=1;
  }else {
    lb=0;
  }
    var lb_url='';
    if(lb == 1){
      lb_url=$("#loadbalancetext").find('input').val()+$("#lburl_type").val();
    }else{
      $("#loadbalancetext").find('input').val('');
    }


    var volume= [];
  $(".volumesContent").each(function(i){
   var  path = $(this).find(".volume_url").val();
    var auth = $(this).find(".volume_auth").val();

    var arr = {"path":path, "mode":auth};
    volume.push(arr);
  });

    var service=[];//服务集成
  $("[ischecked='0']").each(function(i){
    var  id = $(this).attr('server_id');
    service.push(parseInt(id));
  });
  var port_mapping=[];//端口配置
  $(".netContent").each(function(i){
    var  port = $(this).find(".net_port").val();
    if(port==null){
      port='';
    }
    var protocol = $(this).find(".protocol").val();
    var net_mode = $(this).find(".net_mode").val();
    var net_id= $(this).find(".network").val();

    var arr = {"port":port,"protocol":protocol,"net_id": net_id,"net_mode":net_mode};
    port_mapping.push(arr);
  });

  var volume_mapping=[{"container_path":"/app/pkg", "host_path":"/data/apps/"+$("#app_id").val(), "mode":"RW"},
    {"container_path":"/app/logs", "host_path":"/data/logs/"+$("#app_id").val(), "mode":"RW"}];//docker
  $(".listContent").each(function(i){
    var key= $(this).find(".list_key").val();//local、share
    var value=$(this).find(".list_value").val();
    var mode=$(this).find(".list_auth").val();

    var arr = {"container_path": key,
      "host_path": value,
      "mode": mode};
    volume_mapping.push(arr);
  });

  var docker_args=[];//docker
  $(".dockerContent").each(function(i){
    var key= $(this).find(".docker_key").val();//local、share
    var value=$(this).find(".docker_value").val();

    var arr = {"key":key, "val":value};
    docker_args.push(arr);
  });

  var data_center=[];
  $("#dataCenterTable tbody").find("tr").each(function(i){
    var name= $(this).find('td').eq(1).text();//local、share
    var label=$(this).attr("data-uniqueid");
    $(this).find(".constraint ").select();
    var constraint=$(this).find(".constraint").select2('val');
    var  marathon_id=$(this).find(".marathon").val();
      if(constraint==null){
        constraint=[];
      }

    var clp=$(this).find('.clp').val();
    var quota=parseInt($(this).find('[name="quota"]').val());
      if($(this).find('[name="quota"]').val()==''){
        quota=null;
      }
    var arr = {"name":name, "label":label,"quota":quota,"marathon_id":marathon_id,"constraint":constraint,'clp':clp};
      if($(this).find('[type="checkbox"]').is(':checked')){
      data_center.push(arr);
    }

  });

  // if(data_center.length==0){
  //   $("#data_center").find('[type="checkbox"]').each(function(i){
  //     var arr = {"name":$(this).next("span").text(),
  //       "label":$(this).attr("label"),
  //       "quota":null,
  //       "marathon_id":'',
  //       "constraint":[]};
  //     data_center.push(arr);
  //   });
  // }

  var health_check=[];//健康检测
  $(".healthContent").each(function(i){
    var protocol= $(this).find("[name='hprotocol']").val();//local、share
    var grace_period=$(this).find("[name='gracePeriodSeconds']").val();
    var interval=$(this).find("[name='interval']").val();
    var htimeout=$(this).find("[name='timeout']").val();
    var max_failure=$(this).find("[name='max_failures']").val();
    var command=$(this).find("[name='command']").val();
    var url=$(this).find("[name='http_path']").val();
    var port_index=$(this).find("[name='port_index']").val();
    var port_type=$(this).find("[name='port_type']").val();

    if(protocol=='HTTP'){
      command='';
    }
    if(protocol=='COMMAND'){
      url='';port_index='';port_type='';
    }
    if(protocol=='TCP'){
      command='';
      url='';
    }

    var arr = {"protocol":protocol,
      "grace_period": grace_period,
      "interval": interval,
      "timeout": htimeout,
      "max_failure": max_failure,
      "url": url,
      "command":command,
    "port_index":port_index,
    "port_type":port_type};
    health_check.push(arr);
  });

  var app_id=$("#app_id").val();
  createData={
    "resources_production_domain":resources_production_domain,
    "domain":domain, "name":name,
    "ci":ci, "image_type":image_type,
    "image":image, "image_settings":image_settings,
    "container_spec":container_spec, "instance":instance,
    "env":env, "command": command,
    "lb": lb, "lb_url": lb_url, "volume":volume,
    "service": service, "port_mapping":port_mapping,
    "docker_args":docker_args, "data_center": data_center,
    "app_id":app_id, "health_check":health_check,
    "volume_mapping":volume_mapping,'interface_a':interface_a,
      "interface_b":interface_b,
    'package_path':$("#package_path").val(),
    'package_name':$("#package_name").val()
  };//JSON.stringify(

  if(data_center.length==0){
    $("#failmodal").modal('show');
    $("#failmgs").text('没有可用集群，无法进行应用创建');
    $("#failnone").attr('onclick',"");
    return;
  }else{
      fnCreate(JSON.stringify(createData));
  }
}
function fnReCreate(){
  $("[role='form']").show();
  $("#createResult").hide();
  jsUuid=uuid().substr(0,10);
  $("#app_id").val(jsUuid);
  $("#createslider").find('.progress-bar').css('width',20+'%');
  $("#createslider").find('span').text('已完成20%');
}
function fnHref(){
  window.location.href = '#/webcontent/Application/Application.html?appid='+$("#app_id").val();
}
//获取接口人信息
function fnCreate(data){
  /*$("#_NextBtn").attr('disabled',true);*/
  //$("#createkey").hide();
  $("[role='form']").hide();
  $("#createResult").show();
  $("#applogTitle").text('创建应用日志');

    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"apps/create",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:data,
        success:function (result) {
          $("#_NextBtn").text('创建');
          //$("#_prevBtn").text('取消');
          //$("#_prevBtn").attr('disabled',true);
          //fnCreateAppLog();
          fnsetTime();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
         /* $("#_NextBtn").text('确定');
          $("#_prevBtn").text('取消');*/
          $("#recreatebtn").attr('disabled',false);
          $("#createslider").find('h6').text('创建失败');
          $("#operating").hide();
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
              $("#_NextBtn").attr('disabled',false);
             // $("#failmodal").modal('show');
              //$("#failnone").attr('onclick',"fnCancelUrl('failmodal')");
              $("#resultlog").text('创建失败');
              $('#resultlog').append('<p>失败原因'+JSON.parse(XMLHttpRequest.responseText).msg+'</p>');
            }
        }
    });
};
/*$('#showCreateModal').on('hide.bs.modal', function () {
  appLog=true;
  window.location.href = '#/webcontent/Application/Application.html?appid='+$("#app_id").val();
})*/
var appLog=false,logtimes=0;
function fnsetTime()
{
  if(appLog) return;
  fnCreateAppLog();
  cleanApp=setTimeout(function(){
    fnsetTime()},1000); //time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
}
function fnCreateAppLog(){
  logtimes++;
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/event/log?app_id="+$("#app_id").val()+"&level=5",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      if(logtimes<4){
        $("#createslider").find('.progress-bar').css('width',logtimes*20+'%');
        $("#createslider").find('span').text('已完成'+logtimes*20+'%');
      }else{
        logtimes=0;
        appLog=true;
        $("#_NextBtn").attr('disabled',false);
        $("#createslider").find('.progress-bar').css('width','100%');
        $("#createslider").find('span').text('已完成100%');
        $("#createslider").find('h6').text('创建成功');
        $("#operating").show();
        $("#filename").text($("#package_name").val());
        $("#ftp_path").text($("#package_path").val());
        fnGetIclouda();
        fnGetArray();
      }
      var _html='';
      for(var i=0;i<result.data.length;i++){
        _html+='<p>'+result.data[i].create_time+':'+result.data[i].detail+'</p>';
      }
      $("#resultlog").html(_html);
      $("#resultlog").scrollTop(230);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
      }
    }
  });
}
//创建初始化
function fnCreateInit(){
    /*$(".sys_input").hide();
    $(".sys_select").show();*/
  $("#app_name").val('');
  $("#app_name").attr('disabled',false);//应用名称
  $("#package_path").val('');//持续集成路径
  $("#package_name").val('');//持续集成包名

  $("#img_min_thread").val('300');//最小线程数
  $("#img_max_thread").val('800');//最大线程数
  $("#img_acceptCount").val('1000');//请求队列长度
  $("#img_timeout").val('20000');//连接超时
  $("#imgXms").val('2048');//堆内存最小值
  $("#imgXmx").val('2048');//堆内存最大值
  $("#img_PermSize").val('128');//非堆内存最小值
  $("#img_MaxPermSize").val('128');//非堆内存最大值

  $("#instances").val('1');$("#instances").attr('disabled',false); //实例数
  $("#start_command").val('sh /app/bin/startServer.sh');//启动命令
  //环境变量
  var env=[{"key":'APPNAME', "val":'ROOT.war'},{"key":'TZ', "val":'Asia/Shanghai'},{"key":'JAVA_HOME', "val":'/app/jdk'},{"key":'', "val":''}]
  $(".envContent").each(function(i,obj){
    $.each(env,function(k,item){
      if(i==k){
        $(obj).find(".env_key").val(item.key);
        $(obj).find(".env_value").val(item.val);
      }
    });
  });

  //负载均衡
  $("#loadbalancetext").val('');

  //共享目录/app/data/share
  $(".volumesContent").find('.volume_url').val('');

  //docker参数
  $(".dockerContent").find(".docker_key").eq(0).val('user');
  $(".dockerContent").find(".docker_value").eq(0).val('dcos');
  $(".dockerContent").find(".docker_key").eq(1).val('cpu-quota');
  $(".dockerContent").find(".docker_value").eq(1).val('50000');

  //端口配置
  $(".netContent").find('.net_mode').val('BRIDGE');
  //fnImageVer();
 $('.netContent').find(".protocol").val('TCP');
//应用ID
  $("#app_id").val(jsUuid);
  //$("#app_id").attr('disabled',true);
 //健康检测
  $(".healthContent").find("[name='healthChecks']").val('HTTP');
  $(".healthContent").find("[name='http_path']").val('/test/');
  $(".healthContent").find("[name='command']").val('ls');
  $(".healthContent").find("[name='gracePeriodSeconds']").val('300');
  $(".healthContent").find("[name='interval']").val('60');
  $(".healthContent").find("[name='timeout']").val('20');
  $(".healthContent").find("[name='max_failures']").val('3');
  $(".healthContent").find("[name='port_index']").val('0');
  $(".healthContent").find("[name='port_type']").val('port_index');
}

var by = function(name,minor){
  return function(o,p){
    var a,b;
    if(o && p && typeof o === 'object' && typeof p ==='object'){
      a = o[name];
      b = p[name];
      if(a === b){
        return typeof minor === 'function' ? minor(o,p):0;
      }
      if(typeof a === typeof b){
        return a < b ? -1:1;
      }
      return typeof a < typeof b ? -1 : 1;
    }else{
      thro("error");
    }
  }
}
function NumAscSort(a,b)
{
  return a - b;
}
function fnGetUpdateData(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/create?app_id="+appID,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      oldData=result.data;
      fnUpdateInit();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{

      }
    }
  });
}
var cleanCreateApp1,cleanCreateApp2;
function fnImageVer(){
  var value='';
  if($("#image_name").val()){
    value=$("#image_name").val();
  }
  if(value.indexOf('tomcat')!=-1){
    $('.netContent').find(".net_port").val('8080');
  }else if(value=='weblogic'){
    $('.netContent').find(".net_port").val('7001');
  }
}
//镜像类型
function fnGetImgType(type){
  $("#com_spe").show();
 // var type=$("#image").find('.btn-info').attr('value');
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/images?type="+type,
    headers: {
      "token": token
    },
    //async:false,
    Type: 'json',
    success:function (result){
      $("#image_name").empty();
      var data=result.data.repos;
      var _html='';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++) {
          _html+='<option value="'+data[i]+'">'+data[i]+'</option>';
        }
      }
      $("#image_name").append(_html);
      fnImageVer();
      fnGetImageVersion();
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
function fnGetCreateImgType(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/images?type=common",
    headers: {
      "token": token
    },
    Type: 'json',
    success:function (result){
      $("#common_image").empty();
      var data=result.data.repos;
      var _html='';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++) {

          _html+='<option value="'+data[i]+'">'+data[i]+'</option>';
        }
      }
      $("#common_image").append(_html);
      fnGetCreateImgVer();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#com_spe").hide();
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}
function fnGetCreateImgVer(){
  var image=$("#common_image").val();
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/images?type=common&middleware="+image,
    headers: {
      "token": token
    },
    // async:false,
    Type: 'json',
    success:function (result){
      $("#comImgVer").empty();
      var data=result.data.images;
      var _html='';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++) {
          var dataval=data[i];
          _html+='<option value="'+result.data.registry+'/'+dataval+'">'+dataval.split(':')[1]+'</option>';
        }
      }
      $("#comImgVer").append(_html);
      //editor1.replaceSelection('FROM '+$("#comImgVer").val()+'\n');
      editor1='FROM '+$("#comImgVer").val()+'\n';
      $("#img_remark").val(editor1);
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
function fnChangeImgName(){
  var type=$("#image").find('.btn-info').attr('value');
  if(type=='special'){
    fnGetImageVersion();
  }else if(type=='private'){
    fnGetSpecialImg();
  }
}
//镜像版本
function fnGetImageVersion(){
  var type=$("#image").find('.btn-info').attr('value');
  var image=$("#image_name").val();
  //http://192.168.2.11:9002/v3.0/
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/images?type="+type+"&middleware="+image,
    headers: {
      "token": token
    },
    // async:false,
  Type: 'json',
    success:function (result){
    $("#image_version").empty();
    var data=result.data.images;
    var _html='';
    if(data && data.length>0){
      for(var i=0;i<data.length;i++) {
        var dataval=data[i];
        _html+='<option value="'+result.data.registry+'/'+dataval+'">'+dataval.split(':')[1]+'</option>';
      }
    }
      $("#image_version").append(_html);
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
//获取网络
function fnGetNetwork(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"network",
    headers: {
      "token": token
    },
    Type: 'json',
    success:function (result){
      $(".network").empty();
      var data=result.data;
      var _html='<option value="">请选择</option>';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++) {
          _html+='<option value="'+data[i].net_id+'">'+data[i].name+'</option>';
        }
      }
      $(".network").append(_html);
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
//服务绑定
function fnGetServer(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"services",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      $("#serverinfo").empty();
      var _html='',severname='';
      if(appID==''){
        severname=$("#thirdResource").select2('val').split('/')[1];
      }else{
        severname=$('#thirdinput').val();
      }
      if(data && data.length>0){
        for(var i=0;i<data.length;i++){
          if(data[i].sys_name==severname){
            var str=data[i].name.substring(0,6);
            _html+='<div class="col-sm-4 no-padding-left" server_id="'+data[i].id+'" server_name="'+data[i].type+'-'+str+'" isChecked="1" onclick="fnCheckedSer(this)">'
              +'<div class="databox radius-bordered" style="border:1px solid #ddd">'
              +'<div class="databox-left" style="border-right:1px solid #ddd">'
              +'<div class="databox-piechart">'
              +'<img src="assets/img/img/'+data[i].type+'1.png" style="padding-top:5px;height:45px">'
              +'</div>'
              +'</div>'
              +'<div class="databox-right">'
              +'<div class="databox-text darkgray padding-top-10 padding-left-5">'+data[i].type+'-'+str+'<span class="blue icon-sever" style="display:none;"><i class="fa fa-check" style="font-size:18px"></i></span>'
              +'</div></div></div></div>';
          }
        }
        $("#serverinfo").html(_html);
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
function fnCheckedSer(obj){
  var checked=$(obj).attr('isChecked');
  var id=$(obj).attr('server_id');
  if(checked == '1'){
    $(obj).attr('isChecked','0');
    $(obj).find('span').css('display','inline-block');
    fnServerDetail(id);
  }else{
    $(obj).attr('isChecked','1');
    $(obj).find('span').css('display','none');
    fnServerCut(id);
  }
}
function fnServerCut(id){
  var tr=$("#serverdetail").find('tr');
  if(tr.length!=0){
    for(var i=0;i<tr.length;i++){
      var tr_id= tr.eq(i).attr('id');
      if(tr_id==id){
        tr.eq(i).remove();
        if(tr.length-1==0){
          $(".sever-dash").show();
        }
      }
    }
  }
}
function fnServerDetail(id){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"services",
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      var _html='';$(".sever-dash").hide();
      if(data && data.length>0){
        for(var i=0;i<data.length;i++){
          if(data[i].id==id){
            _html+='<tr id="'+id+'"><th>'+data[i].username+'</th><th>'+data[i].password+'</th><th>http://'+data[i].zk_hosts+'</th></tr>';
          }
        }
        $("#serverdetail").append(_html);
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
function fnGetPool(){

  $.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/domain?type=app_resources_production_domain",
    headers: {
      "token": token
    },
    async:false,
    dataType: 'json',
    success:function (result) {
      var data=result.data;
      $("#ResourcesPool").empty();
      var _html='';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++){
          if(i==0){
            _html +='<a href="javascript:void(0);" class="btn btn-info" value="'+data[i].code+'">'+data[i].name+'</a>';
          }else{
            _html +='<a href="javascript:void(0);" class="btn btn-default" value="'+data[i].code+'">'+data[i].name+'</a>';
          }

        }
      }
      $("#ResourcesPool").html(_html);
      var code=$("#ResourcesPool").find('.btn-info').attr('value');
      $("#dataCenterTable").bootstrapTable('destroy');
      fnGetCluster(code);
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

function fnSelectConfigure(obj){
  $("#con_configure").find(".con_configure").removeClass("active");
  $(obj).addClass("active");
  if($(obj).find('h6').length>0){
    $("#addConfigureModal").modal("show");
    $('#con_CPU').find('select').select2();
    $('#con_mem').find('select').select2();
    $('#con_CPU').find('.input-group').css('display','none');
    $('#con_mem').find('.input-group').css('display','none');
  }else{
    var max=$(obj).attr('data-val').split('/');
    maxinstances=parseInt(parseFloat(max[0])*parseFloat(max[1]));
  }
  var cpu=$(".active").find(".cpu_mem").text().split('/')[0];
  $(".dockerContent").find(".docker_value").eq(1).val(parseFloat(cpu)*100000);
}
function showcongig() {
  $('#config').toggle();
  }

  function Showmore() {
    $('#more').toggle();
  }

//负载均衡
function fnLoadBalance(obj){
  var text=$(obj).find('span').text();
  if(text=='是'){
    $("#loadbalancetext").show();
  }else{
    $("#loadbalancetext").hide();
  }
}

//发布方式
document.getElementById("ci").addEventListener("click", function (e) {
  //$("#loadBalance").find("a").attr('class',"btn btn-default margin-right-10");
  if (e.target && e.target.nodeName == "SPAN") {
    if(e.target.childNodes[0].data == "持续集成"){
      fnGetCiFtp();
      $(".ci_detail").show();
      $(".ci_detail").find('input').attr('data','Isempty');
    }else{
      $(".ci_detail").hide();
      $(".ci_detail").find('input').attr('data','');
    }
  }
});

//资源池
function fnChangePool(event) {
  $("#ResourcesPool").find("a").attr('class', "btn btn-default margin-right-10");
  var clustername = '';
  if (event.target && event.target.nodeName == "A") {
    // 找到目标，输出ID!
    event.target.className = "btn btn-info margin-right-10";
    $("#dataCenterTable").bootstrapTable('destroy');
    fnGetCluster(event.target.attributes.value.nodeValue);
  }
}
  document.getElementById("ResourcesPool").addEventListener("click",fnChangePool,false);

function fnGetCluster(code){
  $('#dataCenterTable').bootstrapTable({
    url:  _URL_INTERFACE+"cluster/all?resource_pool="+code, method: 'get', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }},async:false,
    search: false,dataType: 'json',pagination: true, pageSize: 10,
    uniqueId: 'cluster_label',
    toolbar:'#btn-div',
    columns: [{
      title: '', field: 'cluster_label', searchable: true,
      formatter: function (val, row, idx) {
        var html='';
        html='<div class="checkbox"> <label> <input type="checkbox" checked> <span class="text"></span> </label> </div>';
        return html;
      }
    },  {
      title: '集群名称', field: 'cluster_name',searchable: true,
      formatter: function (val, row, idx) {
        var html='<p style="line-height:36px">'+val+'</p>';
        return html;
      }
    },{
      title: '权重', field: '',  searchable: true,
      formatter: function (val, row, idx) {//
        var html='<input type="text" name="quota" class="form-control pull-left" style="width:80%" ' +
          'onkeyup="value=value.replace(/[^\\d.]/g,\'\')" data_auto="auto" onblur="fnAutoValue(this)">' +
          '<span class="pull-left padding-top-5 padding-left-5" style="width:20%;font-size:16px;margin:4px 0;">%</span><p class="red"></p>'
        return html;
      }
    },{
      title: 'marathon配置', field: 'marathon',  searchable: true,width:'150px',
      formatter: function (val, row, idx) {
        var html='<select class="form-control marathon" name="marathon" data-value="empty">' +
          '<option value="">请选择</option>';
        for(var i=0;i<val.length;i++){
          if(i== val.length-1){
            html+='<option value="'+val[i].marathon_name+'">'+val[i].marathon_name+'</option></select>';
          }else{
            html+='<option value="'+val[i].marathon_name+'">'+val[i].marathon_name+'</option>';
          }
        }
        return html;
      }
    },{
      title: '约束条件', field: 'slave',  searchable: true,width:'150px',
      formatter: function (val, row, idx) {
        var html='';
        html='<select  name="" multiple="multiple" class="constraint" style="width:100%"> ';
        for(var i=0;i<val.length;i++){
          if(i== val.length-1){
            html+='<option value="'+val[i].constrain+'">'+val[i].constrain+'</option></select>';
          }else{
            html+='<option value="'+val[i].constrain+'">'+val[i].constrain+'</option>';
          }
        }
        return html;
      }
    },
      {
        title: '容器编排策略', field: 'name',  searchable: true,
        formatter: function (val, row, idx) {
          var html='<select class="clp"><option value="">请选择</option><option value="GROUP_BY">GROUP_BY</option><option value="UNIQUE">UNIQUE</option></select> ';

          return html;
        }
      }],
    responseHandler: function (result) {
      if(result.data){
        return result.data;
      }else{
        return [];
      }

    },
    onSearch: function (text) {
    },
    onLoadSuccess: function (data) {
      $("#dataCenterTable tbody").find(".constraint").select2();
    },
    onDblClickRow:function(data){
    }
  });
}

//镜像
  document.getElementById("image").addEventListener("click", function (e) {
    $("#image").find("a").attr('class', "btn btn-default margin-right-10");
    if (e.target && e.target.nodeName == "A") {
      // 找到目标，输出ID!
      e.target.className = "btn btn-info margin-right-10";
  }

    if(e.target.innerText=='自有镜像'){
      $("#com_spe").hide();
        //$("#showaddimg").show();
        $("#add_image").show();
        $("#config").hide();
      $("#com_spe").show();
      $("#img_config").hide();
      $("[name='hprotocol']").eq(0).val('COMMAND');
      fnGetNewImg();
    }else{
      $("#add_image").hide();
      $("#showaddimg").hide();
      $("#com_spe").show();
      $("#img_config").show();
      var type='';
      type=e.target.attributes[2].value;
      $("[name='hprotocol']").eq(0).val('HTTP');
      fnGetImgType(type);
    }
    fnchangehealth("[name='hprotocol']");
  });

  $(".net_mode").change(function(){
    var networkselect = $(".net_mode").val();
    if (networkselect != "USER") {
      $("[name='port']").show();
      $("[name='network']").hide();
      if(networkselect == "HOST"){
        $(".net_port").attr('disabled',true);
      }else{
        $(".net_port").attr('disabled',false);
      }
    }else{
      $("[name='port']").hide();
      $("[name='network']").show();
      $(".net_port").attr('disabled',false);
    }
  });
  function fnnoUiSlider(obj, inputobj, start, end) {
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
      slide: function () {
        var values = $(this).val();
        $(inputobj).val(parseInt(values)/10);
      }
    });
    //$( obj ).slider( "destroy" );
  }
function change(obj,str){
  var inp_val=$(obj).val();
  $(obj).val(inp_val.replace(/[^\d.]/g,''));
  if((parseFloat(inp_val)*10)>parseFloat(str)){
    inp_val=0;$(obj).val('0');
  }
  var id=$(obj).attr("id");
  $("[name='"+id+"']").val(inp_val*10);

  // if(obj.id=="slider_value"){
  //   inp_val=parseInt(inp_val);
  //   if(inp_val > 10){
  //     $("#HMdo").prop("disabled",true);
  //   }else{
  //     $("#HMdo").prop("disabled",false);
  //   }
  // }
}

//自定义容器配置
  $("#createCPUmem").click(function () {
      var cpu=parseFloat($("#con_CPU").find('input').val());
      var mem=parseFloat($("#con_mem").find('input').val());
    if($("#con_CPU").find('.input-group').css('display')=='none'){
        cpu=parseFloat($("#con_CPU").find('select').select2('val'));
    }
    if($("#con_mem").find('.input-group').css('display')=='none'){
      mem=parseFloat($("#con_mem").find('select').select2('val'));
    }
    var cpuNum=cpu.toFixed(2);
    var memNum=mem.toFixed(2);
    createCPUmem(cpuNum, memNum);
  })
  function createCPUmem(cpu, mem) {
    $("#con_configure").find(".con_configure").removeClass("active");
    var val=cpu+'/'+mem;
    var html = '';
    html = '<a class="jd pull-left margin-right-10 " href="javascript:;" >';
    html += '<div class="panel panel-default con_configure active" data-val="'+val+'" onclick="fnSelectConfigure(this)">';
    html += '<div  class="panel-heading text-center cpu_mem">';
    html += cpu + '核/' + mem + 'GB';
    html += '</div>';
    html += '<div class="panel-body text-center  darkgray" style="padding:10px 30px">自定义配置';
    html += '</div>';
    html += '</div>';
    html += ' </a>';
    maxinstances=parseInt(parseFloat(cpu)*parseFloat(mem));
    if(maxinstances<1){
      maxinstances=1;
    }
    if($(".con_configureX").find('a').length>3){
      var ele=$(".con_configureX").find('a').eq(3);
      ele.find('.con_configure').attr('data-val',val);
      ele.find('.con_configure').addClass('active');
      ele.find('.cpu_mem').text(cpu + '核/' + mem + 'GB');
    }else{
      $(".con_configureX").append(html);
    }
  }

  function fnAddenv() {

    var envContent = "<div class=\"col-sm-12 envContent no-padding-right\" style=\"margin-top:10px;\">" + $(".envContent").eq(3).html() + "<\/div>";
    $(".envContentX").append(envContent);
  }

  function fnCutenv(obj) {
    var divs = $(".envContent");
    if (divs.length > 4) {
      var pObj = obj.parentNode.parentNode;
      pObj.parentNode.removeChild(pObj);
    }
  }

  function fnAddvolume() {
    var volumesContent = "<div class=\"col-sm-12 volumesContent\"  style=\"margin-top:10px;\">" + $(".volumesContent").html() + "<\/div>";
    $(".volumesContentX").append(volumesContent);
  }

  function fnCutvolume(obj) {
    var divs = $(".volumesContent");
    if (divs.length > 1) {
      var pObj = obj.parentNode.parentNode;
      pObj.parentNode.removeChild(pObj);
    }
  }

  function fnAddnetwork() {
    //var networkselect = $("#net_type").find("input[name='form-net-radio']:checked").val();
    var networkselect = $(".net_mode").val();
    if (networkselect == "BRIDGE") {
      var netContent = "<div class=\"netContent\" >" + $(".netContent").html() + "<\/div>";
      $(".netContentX").append(netContent);
    }

  }

  function fnCutnetwork(obj) {
    var divs = $(".netContent");
    if (divs.length > 1) {
      var pObj = obj.parentNode.parentNode;
      pObj.parentNode.removeChild(pObj);
    }
  }


  function fnAdddocker() {
    var dockerContent = "<div class=\"dockerContent\" >" + $(".dockerContent").html() + "<\/div>";
    $(".dockerContentX").append(dockerContent);
  }

  function fnCutdocker(obj) {
    var divs = $(".dockerContent");
    if (divs.length > 1) {
      var pObj = obj.parentNode.parentNode;
      pObj.parentNode.removeChild(pObj);
    }
  }

function fnAddvolumn() {
  var dockerContent = "<div class=\"listContent\" >" + $(".listContent").html() + "<\/div>";
  $(".listContentX").append(dockerContent);
}

function fnCutvolumn(obj) {
  var divs = $(".listContent");
  if (divs.length > 1) {
    var pObj = obj.parentNode.parentNode;
    pObj.parentNode.removeChild(pObj);
  }
}

//增加健康检测
function fnaddhealth(){
  var healthContent = "<div class=\"healthContent\">" + $(".healthContent").eq(0).html() + "<\/div>";
  $(".healthContentX").append(healthContent);
}
function fnCutHealth(obj){
  var divs = $(".healthContent");
  if (divs.length > 1) {
    var pObj = obj.parentNode.parentNode.parentNode;
    pObj.parentNode.removeChild(pObj);
  }
}
function fnchangehealth(obj){
  var value=$(obj).val();
  var parent=$(obj).parents('.healthContent');
  if(value=='COMMAND'){
    parent.find(".COMMANDdiv").show();
    parent.find(".Pathdiv").hide();
    parent.find(".port_indexdiv").hide();
    parent.find(".port_typediv").hide();
  }
  if(value=='HTTP'){
    parent.find(".COMMANDdiv").hide();
    parent.find(".Pathdiv").show();
    parent.find(".port_indexdiv").show();
    parent.find(".port_typediv").show();
  }
  if(value=='TCP'){
    parent.find(".COMMANDdiv").hide();
    parent.find(".Pathdiv").hide();
    parent.find(".port_indexdiv").show();
    parent.find(".port_typediv").show();
  }
}
function fnChangePortType(obj){
  var value=$(obj).val();
  if(value=='portIndex'){
    $(".port_indexdiv").find('label').text('端口索引');
  }else{
    $(".port_indexdiv").find('label').text('端口号');
  }
}
$("[name='port_type']").change(function(){

});
//系统名称的三级联动
  function fnGetFirst() {
    $.ajax({
      type: 'get',
      url: _URL_INTERFACE + "apps/fastdomain?type=app_business_domain&create_app=true",
      headers: {
        "token": token
      },
      dataType: 'json',
      success: function (result) {
        var data = result.data;
        $("#firstResource").empty();
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $("#firstResource").append('<option value="' + data[i].code+'/'+data[i].name + '">' + data[i].name + '</option>');
          }
        }
        fnGetSeond($("#firstResource").select2('val').split('/')[0]);
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

  function fnGetSeond(first) {
    $.ajax({
      type: 'get',
      url: _URL_INTERFACE + "apps/fastdomain?type=app_business_subdomain&create_app=true&domain_code=" + first,
      headers: {
        "token": token
      },
      dataType: 'json',
      success: function (result) {
        var data = result.data;
        $("#secondResource").empty();
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $("#secondResource").append('<option value="' + data[i].code + '/'+data[i].name +'">' + data[i].name + '</option>');
          }
        }
        if($('#secondResource').select2('val')!=null){
          fnGetThird($('#firstResource').select2('val').split('/')[0], $('#secondResource').select2('val').split('/')[0]);
        }
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

  function fnGetThird(first, second) {
    $.ajax({
      type: 'get',
      url: _URL_INTERFACE + "apps/fastdomain?type=app_business_sysdomain&create_app=true&domain_code=" + first + "&subdomain_code=" + second,
      headers: {
        "token": token
      },
      dataType: 'json',
      success: function (result) {
        var data = result.data;
        $("#thirdResource").empty();
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            $("#thirdResource").append('<option value="' + data[i].code +'/'+data[i].name + '">' + data[i].name + '</option>');
          }
        }
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

  function showSysName(province, city, town) {
    var title = ['一级域', '二级域', '系统名称'];
    $.each(title, function (k, v) {
      title[k] = '<option value="">' + v + '</option>';
    })

    $('#firstResource').append(title[0]);
    $('#secondResource').append(title[1]);
    $('#thirdResource').append(title[2]);

    $("#firstResource,#secondResource,#thirdResource").select2();
    fnGetFirst();
    $("#firstResource").on("select2:close",function(e){
      $('#secondResource').empty();
      $('#secondResource').append(title[1]);
      fnGetSeond($('#firstResource').select2('val').split('/')[0]);
    });

    $('#secondResource').on("select2:close",function (e) {
      $('#thirdResource').empty();
      $('#thirdResource').append(title[2]);
      fnGetThird($('#firstResource').select2('val').split('/')[0], $('#secondResource').select2('val').split('/')[0])
    });

    $('#thirdResource').on("select2:close",function (e) {
      fnGetServer();
    });
  }

  function modalControl(wz) {
    var target = $('.page-body');
    //target.on('hidden.bs.modal', function (e) {
    while (wz.wizard('selectedItem').step != 1) {
      wz.wizard('previous');
    }
    //$('#_ReturnBtn').show();
    $('#_NextBtn').show();
    wz.find('.steps li').each(function (idx, item) {
      $(this).off('click');
    });
    //});
  }

  $(function () {
    var wz = $('#WiredWizard').wizard();
    modalControl(wz);
    wz.find('.steps li').each(function (idx, item) {
      $(this).on('click', function (e) {
        e.preventDefault();
        return false;
      });
    });

    $('#_NextBtn').click(function (e) {
      if($("#package_name").val()!=''){
        $(".envContent ").each(function(i){
          var key= $(this).find(".env_key").val();
          if(key=='APPNAME'){
            $(this).find(".env_value").val($("#package_name").val());
          }
        });

      }

     var step = wz.wizard('selectedItem').step;
      var fl=checkEmpty(wz, "#wiredstep"+step ,step);
      if(step=='2' && $("#wiredstep3").attr('class')=="step-pane active"){
        $('#_NextBtn').text('创建');
      }else if(step=='3'){
        $('#_NextBtn').text('创建');
      }else{
        $('#_NextBtn').text('下一步');
      }

      if(step=='3' && fl==true && $("#_prevBtn").text()!='取消'){
        $('#_NextBtn').text('创建');
        fnCreateData(oldData);
      }else{
        /*if($('#_prevBtn').text()=='取消'){
          if($("#createslider").find('h6').text()=='创建成功'){
            window.location.href = '#/webcontent/Application/Application.html?appid='+$("#app_id").val();
          }else{
            $("#appfailmodal").modal('show');
          }
        }*/
      }
    })
$("#updateconfige").click(function(){
  $("#createResult").hide();
  $("#createkey").show();
  jsUuid=uuid().substr(0,10);
  $("#app_id").val(jsUuid);
  $('#_NextBtn').text('创建');
  $('#_prevBtn').text('上一步');
  $('#resultlog').html('');
})
    $("#_prevBtn").click(function(){
      var step = wz.wizard('selectedItem').step;
      $('#_NextBtn').text('下一步');
      if($("#_prevBtn").text()=='取消'){
        $("#createResult").hide();
        $("#createkey").show();
        jsUuid=uuid().substr(0,10);
        $("#app_id").val(jsUuid);
        $('#resultlog').html('');
        if(step=='3'){
          $('#_NextBtn').text('创建');
        }else{
          $('#_NextBtn').text('下一步');
        }
        $('#_prevBtn').text('上一步');
      }else{
        wz.wizard('previous');
      }
    });
  });
function fnGetIclouda(){
  /*if($("#ci").find('input[value="true"]').is(':checked')){
    //fnGetCiFtp();
    $("#ci_detail").show();
    $("#ci_detail").find('input').attr('data','Isempty');
  }else{
    $("#ci_detail").hide();
    $("#ci_detail").find('input').attr('data','');
  }*/
}
function fnGetCiFtp() {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/ftp",
    headers: {
      "token": token
    },
    //async:false,
    dataType: 'json',
    success: function (result) {
      var deploy = result.data;
      $('#ftp_ip').text(deploy.ftp_ip);
      $('#ftp_port').text(deploy.ftp_port);
      $('#ftp_username').text(deploy.ftp_username);
      $('#ftp_passwd').text(deploy.ftp_passwd);
      /*$('#filename').text(deploy.filename);
      $('#ftp_path').text(deploy.path);*/
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  })
}
function fnGetArray(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/detail?app_id="+$("#app_id").val(),
    headers: {
      "token": token
    },
    //async:false,
    dataType: 'json',
    success: function (result) {
     /* $("#success").hide();*/
      var data = result.data;
      if(data.dnsname!=''){
        $("#lbinfo").show();
        $("#handle_url").text(data.dnsname);
        if(data.vip==''){
          $("#handle_ip").html('<a >当前没有可用的VIP</a>');
        }else{
          $("#handle_ip").html('<a onclick="window.open('+data.vip+')">'+data.vip+'</a>');
        }

      }else{
        if($("#ci").find('input[value="true"]').is(':checked')){
          $("#lbinfo").hide();
        }else{
          $("#operating").hide();
          $('#success').css('width','100%');
          $('.border-right').css('border-right','none');
        }
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  })
}
/*$("#appdetailbtn").click(function(){
  window.location.href = '#/webcontent/Application/Application.html?&appid='+app_id;
})*/
//应用名称的去重 0--成功 1--失败
  function fnAppNameUnique() {
    var returnvalue='true';
    $.ajax({
      type: 'POST',
      url: _URL_INTERFACE + "apps/check_app_name",
      headers: {
        "token": token
      },
     async:false,
      dataType: 'json',
      data:JSON.stringify({
        'app_name':$("#app_name").val()
      }),
      success: function (result) {
        if(result.return_code==1){
          $("#app_name").nextAll(".red").html("该应用名称已存在，请重输");
          returnvalue='false';
        }else{
          $("#app_name").nextAll(".red").html("");
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status === 401) {
          window.location.href = '#/login.html';
        }
        if(XMLHttpRequest.responseJSON.return_code==1 && XMLHttpRequest.status === 400){
          $("#app_name").nextAll(".red").html("该应用名称已存在，请重输");
          returnvalue='false';
        }
      }
    });
    return returnvalue;
  }

//非空验证验证
  function checkEmpty(wz, obj,step) {
    var createflag=true;
    var inputVal = $(obj).find("[data='Isempty']"),flag,telFlag1,telFlag2,emailFlag1,emailFlag2;
    for (var i = 0; i < inputVal.length; i++) {
      var aaaa = inputVal.eq(i);
      if (aaaa.val() == '') {
        aaaa.nextAll(".red").html("该项不能为空，请输入");
        return;
      } else {
        if(aaaa.attr('id')!='undefined'  && appID==''){
          if(aaaa[0].id== "app_name" ){
            flag=fnAppNameUnique();
          }
          /*if(aaaa[0].id== "instances" && aaaa.val()>maxinstances){
            aaaa.nextAll(".red").html("最大实例数不能超过"+maxinstances+"，请重输");
            return;
          }else{
            aaaa.nextAll(".red").html("");
          }*/
        }
        aaaa.nextAll(".red").html("");
      }
    }
      telFlag1=fnCheckTel("#interface_a_Tel");
      telFlag2=fnCheckTel("#interface_b_Tel");

      emailFlag1=fnCheckEmailFlag("#interface_a_Email");
      emailFlag2=fnCheckEmailFlag("#interface_b_Email");
    if(flag=='false'){
      $("#app_name").nextAll(".red").html("该应用名称已存在，请重输");
      return;
    }else if($("#app_name").val().length>20){
      $("#app_name").nextAll(".red").html("应用名称不能超过20字，请重输");
      return;
    }else{
      $("#app_name").nextAll(".red").html("");
    }

    var voquota=0;
    var checkedTr=$(obj).find("#dataCenterTable").find('input:checked').parents('tr');
    checkedTr.find("[name='quota']").each(function(i){
      if(checkedTr.find("[name='quota']").eq(i).val()!=''){
        voquota=voquota+parseFloat(checkedTr.find("[name='quota']").eq(i).val());
      }

      if(checkedTr.find("[name='quota']").eq(i+1).val() ==undefined){
        $(this).nextAll(".red").html("");
      }else {
        if ($(this).val() == '' && checkedTr.find("[name='quota']").eq(i + 1).val() == '') {
          $(this).nextAll(".red").html("");
          checkedTr.find("[name='quota']").eq(i + 1).nextAll(".red").html("");
        } else if ($(this).val() != '' && checkedTr.find("[name='quota']").eq(i + 1).val() != '') {
          $(this).nextAll(".red").html("");
          checkedTr.find("[name='quota']").eq(i + 1).nextAll(".red").html("");
        } else {
          $(this).nextAll(".red").html("所选集群的权重需都填或者都不填");
          checkedTr.find("[name='quota']").eq(i + 1).nextAll(".red").html("所选集群的权重需都填或者都不填");
          createflag = false;
        }
      }
    });

      if(voquota!=100 && voquota!=0){
        checkedTr.find("[name='quota']").nextAll(".red").html("所选集群的权重相加需为100%");
        createflag = false;
      }else{
        checkedTr.find("[name='quota']").nextAll(".red").html("");
      }

    var selectVal = $(obj).find("[name='selectcheck']");
    for (var i = 0; i < selectVal.length; i++) {
      var bbbb = selectVal.eq(i);
      if(selectVal.select2('val') && selectVal.select2('val')==''){
        bbbb.nextAll(".red").html("该项不能为空，请选择");
        return;
      }else{
        bbbb.nextAll(".red").html("");
      }
      if (bbbb.val() == '') {
        bbbb.nextAll(".red").html("该项不能为空，请选择");
        return;
      } else {
        bbbb.nextAll(".red").html("");
      }
    }
    if(step=='3'){

      return createflag;
    }
    if((telFlag1&&telFlag2)&&(emailFlag1&&emailFlag2)==true){
        wz.wizard('next');
    }
}
function closeInput(obj){
  $(obj).parents('.input-group').hide();
  $(obj).parents('.input-group').next('select').show();
  $(obj).parents('.input-group').nextAll('span').show();
}

$("#con_CPU").find('select').on("select2:close",function(e){

  if($("#con_CPU").find('select').select2('val')==''){
    $("#con_CPU").find('select').hide();
    $("#con_CPU").find('select').next('span').hide();
    $("#con_CPU").find('select').prev('.input-group').show();
  }
});
$("#con_mem").find('select').on("select2:close",function(e){

  if($("#con_mem").find('select').select2('val')==''){
    $("#con_mem").find('select').hide();
    $("#con_mem").find('select').next('span').hide();
    $("#con_mem").find('select').prev('.input-group').show();
  }
});

function fnAutoValue(obj){
  var center_tr=$('#dataCenterTable').find('input:checked').parents('tr');
  var a;
  if($(obj).val()!=''){
    if(parseFloat($(obj).val())>100){
      $(obj).val('100');
    }
    $(obj).attr('data_auto','');
    a=100-parseFloat($(obj).val());
  }
  center_tr.find('[data_auto="auto"]').val(a);
}
/*function fnGetCiFtp(){
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/ftp",
    headers: {
      "token": token
    },
    //async:false,
    dataType: 'json',
    success: function (result) {
      var deploy=result.data;
      $('#ftp_ip').text(deploy.ftp_ip);
      $('#ftp_port').text(deploy.ftp_port);
      $('#filename').text(jsUuid);
      $('#ftp_username').text(deploy.ftp_username);
      $('#ftp_passwd').text(deploy.ftp_passwd);
      $('#ftp_path').text(deploy.path);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}*/
var img_package=[];
function fnupload(obj){
  $(obj).empty();
  $(obj).Huploadify({
    auto:true,
    fileTypeExts:'*.*',
    multi:true,
    formData:null,
    fileSizeLimit:1024000000,
    showUploadedPercent:true,//是否实时显示上传的百分比，如20%
    showUploadedSize:true,
    removeTimeout:9999999,
    uploader: _URL_INTERFACE+'apps/minio/upload/'+jsUuid,
    headers: {"token": token},
    onUploadStart:function(){;
    },
    onInit:function(){
    },
    onUploadComplete:function(file){
    },
    onUploadSuccess:function(file,data,response){
       var info=JSON.parse(data);
      img_package.push({'raw_filename':info.raw_filename,'url':encodeURIComponent(info.url)});
      if(obj=='#uploadbtn'){
        //editor1.replaceSelection('ADD '+info.raw_filename+' /app/bin/startServer.sh\n');
        editor1+='ADD '+info.url+' /app/bin/startServer.sh\n';
        $("#img_remark").val(editor1);
      }else{
        editor1+='ADD '+info.url+' /app/pkg/'+info.raw_filename+'\n';
        $("#img_remark").val(editor1);
      }
    },
    onCancel:function(file){
      for(var i=0;i<img_package.length;i++){
        if(img_package[i].raw_filename==file.name){
          img_package.splice(i,1);
          return;
        }
      }
    }
  });
}
function checkImg(){
  if($("#createImg").val()==''){
    $("#create_btn").attr('disabled',true);
    $("#createImg").next().text('镜像名称不能为空');
  }else{
    $("#createImg").next().text('');
    $("#create_btn").attr('disabled',false);
  }
}
$("#create_btn").click(function(){
  var business_sysdomain='';
  if(getUrlParam('sysdomain_code')){
    business_sysdomain=getUrlParam('sysdomain_code').split('/')[0];
  }else{
    business_sysdomain=$('#thirdResource').val().split('/')[0];
  }

  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + "harborimages",
    headers: {
      "token": token
    },
    //async:false,
    dataType: 'json',
    data:JSON.stringify({
      "dockerfile":$("#img_remark").val(),
      "base_image":$("#comImgVer").val(),
      "name":$("#createImg").val(),
      "description": $("#img_remark1").val(),
      "config_info": $("#img_remark1").val(),
      "package_urls":img_package,
      "business_sysdomain": business_sysdomain
    }),
    success: function (result) {
      $("#tips").modal('show');
      setTime(result.data.img_name);
      $("#image_name").empty();
      $("#image_version").empty();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
});
var timeout=false,img_name_new='',add_img='',times=0;
function setTime(name) {
  if(timeout){
    fnGetNewImg();
  }else{
    var cleanApp;
    fnCreateImgStatus(name);
    cleanApp=setTimeout(function(){setTime(name);clearTimeout(cleanApp);},5000);//time是指本身,延时递归调用自己,100为间隔调用时间,单位毫秒
  }
  timeout=false;
}
function fnCreateImgStatus(name){
  times++;
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "harborimages?image_name="+name,
    headers: {
      "token": token
    },
    //async:false,
    dataType: 'json',
    success: function (result) {
      var status=result.data.status;
      $("#failSpan").empty();
      $("#failnone").attr('onclick',"$('#creatDataModal').modal('show')");
      $("#failmgs").text('');
      if(status!='1'){
        timeout=true;
        $('#tips').modal('hide');
        if(status=='0'){
          img_name_new=result.data.img_name;
          add_img=result.data.img_name.split('/')[1]+'/'+result.data.img_name.split('/')[2].split(':')[0];
          $("#successmodal").modal('show');
          $("#success_msg").text('创建成功');
          $("#btntext").attr('onclick',"");
        }else{
          img_name_new='';
          add_img='';
          $("#failmodal").modal('show');
          $("#failmgs").text('创建失败');

          for(var i=0;i<result.data.log.length;i++){
            $("#failSpan").append('<p style="text-align: left;padding-left: 10px;">'+result.data.log[i]+'</p>');
          }
          document.getElementById("failSpan").style.textAlign = "left";
        }
      }else if(status==1 && times>20){
          timeout=true;
          times=0;
          $('#tips').modal('hide');
          img_name_new='';
          add_img='';
          $("#failmodal").modal('show');
          $("#failmgs").text('创建失败');
          $("#failSpan").append('<p>创建超时,请联系管理员</p>');
          $("#failnone").attr('onclick',"");
      }
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
function fnGetNewImg(){
  var proname='';
  if(getUrlParam('domain_code')){
    proname=getUrlParam('sysdomain_code').split('/')[0];
  }else{
    proname=$('#thirdResource').val().split('/')[0];
  }

  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "harbor/projects/repo?project_name="+proname,
    headers: {
      "token": token
    },
    async:false,
    dataType: 'json',
    success: function (result) {
      //$("#
      $("#image_name").empty();
      var data=result.data;

      //$("#showaddimg").show();
      var _html='';
      if(data.length==0){
          $("#com_spe").hide();
      }else{
        $("#com_spe").show();
        for(var i=0;i<data.length;i++){
          _html+='<option value="'+data[i]+'">'+data[i].split("/")[1]+'</option>'
        }
        $("#image_name").append(_html);
        if(add_img!=''){
          $("#image_name").val(add_img);
        }else{
          $("#image_name").val(data[0]);
        }
        setTimeout('fnGetSpecialImg()',200);
      }
      //$("#show_img").val();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $("#com_spe").hide();
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
      //$("#
      $("#image_version").empty();
      var data=result.data;
      var _html='';
      var value=result.host+'/'+result.repo,value2=result.repo.split('/')[1];
      for(var i=0;i<data.length;i++){
        _html+='<option value="'+value+':'+data[i]+'">'+data[i]+'</option>'
      }
      $("#image_version").append(_html);
       if(img_name_new!=''){
       $("#image_version").val(img_name_new);
       }
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

function fnCheckTel(obj) {
    var returnvalue=true;
    /*var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var mobile=$(obj).val();
    if(mobile.length!=11)
    {
        $(obj).nextAll(".red").html("请输入正确格式的11位手机号！");
        returnvalue = false;
    }else if(!myreg.test(mobile))
    {
        $(obj).nextAll(".red").html("请输入正确格式的11位手机号！");
        returnvalue = false;
    }else {
        $(obj).nextAll(".red").html("");
    }*/
    return returnvalue;
}

function fnCheckEmailFlag(obj){
    var emailFlag=true;
   /* var email=$(obj).val();
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(!re.test(email)){
        $(obj).nextAll(".red").html("请输入正确格式的邮箱！");
        emailFlag=false;
    }else{
        $(obj).nextAll(".red").html("");
    }*/
    return emailFlag;
}
/*function fngetInterfaceUser(obj){
    $(obj).select2({
      tags:'true',
      language : "zh-CN",// 指定语言为中文，国际化才起效
      ajax: {
        type: 'GET',
        url: _URL_INTERFACE+'apps/interface4a',
        headers: {
          "token": token
        },
          async:false,
        dataType: 'json',
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
          formatRepoSelection1(formatRepoSelection);
        }else{
          formatRepoSelection2(formatRepoSelection);
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
  if($("#dataTypes1").attr('data-click')=='false'){
    fnfullInput(repo);
  }else{
    $("#saveIdBlock1").text(repo.id);
    $("#interface_b_Tel").val(repo.phone);
    $("#interface_b_Email").val(repo.email);
    $("#interface_b_Depart").val(repo.company);
    $("#interface_b_Depart").attr('data','notEmpty');
    $("#interface_b_Depart").nextAll(".red").html("");
  }



}
function fnfullInput(repo){
  if(getUrlParam('app_id')){
    var interface_b=oldData.interface_b;
    $("#selectOption1").text(interface_b.name);
    $("#saveIdBlock1").text(interface_b.id);
    $("#interface_b_Tel").val(interface_b.phone);
    $("#interface_b_Email").val(interface_b.email);
    $("#interface_b_Depart").val(interface_b.company);

  }
}

function formatRepoSelection1 (repo) {
  repo.selected = true;
  repo.code = repo.id
  repo.name = repo.text
  if($("#dataTypes").attr('data-click')=='false'){
    fnfullInput1(repo);
  }else{
    $("#saveIdBlock").text(repo.id);
    $("#interface_a_Tel").val(repo.phone);
    $("#interface_a_Email").val(repo.email);
    $("#interfaceDepart").val(repo.company);
    $("#interfaceDepart").attr('data','notEmpty');
    $("#interfaceDepart").nextAll(".red").html("");
  }


}
function fnfullInput1(repo){
  if(getUrlParam('app_id')){
    var interface_a=oldData.interface_a;
    $("#selectOption").text(interface_a.name);
    $("#saveIdBlock").text(interface_a.id);
    $("#interface_a_Tel").val(interface_a.phone);
    $("#interface_a_Email").val(interface_a.email);
    $("#interfaceDepart").val(interface_a.company);

  }
}
function fnAddInterfaceUser(forObj){
    if(forObj.id=='addLogo'){
        $("#typeselect").addClass("hidden",true);
        $("#typeinput").removeClass("hidden",true);
        $("#addLogo").addClass("hidden",true);
        $("#interface_a_Tel").attr("disabled",false);
        $("#interface_a_Email").attr("disabled",false);
        $("#interfaceDepart").attr("disabled",false);

    }else{
        $("#typeselect1").addClass("hidden",true);
        $("#typeinput1").removeClass("hidden",true);
        $("#addLogo1").addClass("hidden",true);
        $("#interface_b_Tel").attr("disabled",false);
        $("#interface_b_Email").attr("disabled",false);
        $("#interface_b_Depart").attr("disabled",false);
    }

}
function inputInit(){
    if(_user.role_id != '1' && _user.role_id!= '4') {
        $("#interface_a_Tel").attr("disabled", true);
        $("#interface_a_Email").attr("disabled", true);
        $("#interfaceDepart").attr("disabled", true);

        $("#interface_b_Tel").attr("disabled", true);
        $("#interface_b_Email").attr("disabled", true);
        $("#interface_b_Depart").attr("disabled", true);
    }
}

function fnCheckClick(forObj){
  if(forObj.id=="typeselect"){
    $('#dataTypes').attr('data-click','true');
    $('#dataTypes1').attr('data-click','false');
  }else{
    $('#dataTypes1').attr('data-click','true');
    $('#dataTypes').attr('data-click','false');
  }

}*/