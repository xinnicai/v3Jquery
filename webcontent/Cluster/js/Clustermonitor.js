$(document).ready(function (){
  fnGetClusterData();//获取集群表格
  fnGetClusterDetail();//获取集群信息
  fnMoveShow();
  fnGetSlaveData();
  getEchartData();
  getZKEchartData();
  fnGetMarathon();
  fnUserPowerCluster(uriArr,domArr);
    fngetHealthHost();//获取健康主机数量
  //draw();
});
//var params = parseParams(self.location.search);
var clusterName = getUrlParam('cluster');//params.cluster;
var clusterId = getUrlParam('id');//params.id;
var clusterLabel = getUrlParam('label');//params.id;
var uriArr=fnUrlArr(),
  domArr=fnDomArr();
var mourl=[];
function fnUserPowerCluster(uriArr,domArr){

  var mo=_user.mo;
  for(var i=0;i<mo.length;i++){
    mourl.push(mo[i].obj);
  }
  for(var a=0; a<uriArr.length; a++){
    var uri = uriArr[a];
    for(var b=0; b<mourl.length; b++){
      if(uri == mourl[b]){
        $(domArr[a]).css("display","inline-block");return;
      }else{
        $(domArr[a]).css("display","none");
      }
    }
  }
}

//获取集群信息
function fnGetClusterDetail(){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"cluster/"+clusterName,
    headers: {
      "token": token
    },
    dataType: 'json',
    success:function (result) {

      var data=result.data;
      fnHandleDetail(data);
    } ,
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('获取集群信息失败');//其他操作
      }
    }
  });
}
function fnHandleDetail(data){
  $("#clustername").text(data[0].name);
  $("#clusterName").text(data[0].name);
  $("#clustertype").text(data[0].type);//集群类型
  $("#masagenodes").text(data[0].host_num);//管理节点数量
  $("#createtime").text(data[0].create_time);//创建时间
  $("#hostnum").text(data[0].host_amount);//集群主机数量
  $("#addslavelabel").text(data[0].label);//集群标签
  // $("#health_host").text(data[0].healthy_hosts_count);//健康主机
  // var unhealty=parseInt(data[0].hosts_count)-parseInt(data[0].healthy_hosts_count);
  // $("#close_host").text(unhealty);//关机主机
  // $("#unhealth_host").text(unhealty);//故障主机
    $("#marathon_image").val(data[0].autoscale_image);
    $("#packageadd").text(data[0].software_urls);
    $("#harboradd").text(data[0].registry);
    $("#warehouse").val(data[0].software_urls);
    $("#imageWareHouse").val(data[0].registry);

  if(data[0].run_status=="0"){
    $('#cluster_status').html('<span>集群创建中，请稍后 <i class="fa fa-spin fa-spinner"></i></span>');
  }else if(data[0].run_status=="1"){
    $('#cluster_status').html('<span class="label label-sm label-default margin-right-10">失败 </span>');
  }else if(data[0].run_status=="2"){
    $('#cluster_status').html('<span class="label label-sm label-success margin-right-10">运行 </span>');
  }
//	 $("#add").removeClass("hidden");
//	 $("#addtoo").addClass("hidden");
  $("#zkshow").show();
  $("#more").show();
//	 if(data[0].type=="slave"){
//		 $("#add").removeClass("hidden");
//		 $("#addtoo").addClass("hidden");
//		 $("#zkshow").hide();
//		 $("#more").hide();
//	 }else if(data[0].type=="master"){
//		 $("#add").addClass("hidden");
//		 $("#addtoo").removeClass("hidden");
//		 $("#zkshow").show();
//		 $("#more").show();
//	 }
}
//获取健康主机数量
function  fngetHealthHost(){
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"cluster/"+clusterName+'/detail',
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $("#health_host").text(data.healthy_hosts_count);//健康主机
            var unhealty=parseInt(data.hosts_count)-parseInt(data.healthy_hosts_count);
            $("#unhealth_host").text(unhealty);//故障主机
        } ,
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                //alert('获取集群信息失败');//其他操作
            }
        }
    });
}
//*****************验证 提交表单*************//
menuValidator("#addmasterform");
menuValidator("#addslaveform");
function menuValidator(obj){

  $(obj).bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
      valid: 'glyphicon',
      invalid: 'glyphicon ',
      validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {


    },
    fields: {
//    	dataType: {
//            validators: {
//                notEmpty: {
//                    message: '菜单名称不能为空'
//                }
//            }
//        },
//        dataKey: {
//            validators: {
//                notEmpty: {
//                    message: '键不能为空'
//                }
//            }
//        },
//        value1:{
//            validators: {
//                notEmpty: {
//                    message: '值1不能为空'
//                }
//            }
//        }
    }
  });
}
//添加主机slave
function createMenu(){
  $("#creatApplition").modal('hide');
  $("#tipsCreate").modal("show");
  var mesos_slave=[];
  var slave;
  var slaveip=$("#hostIpSlave").selectpicker("val");
  for(var i=0;i<slaveip.length;i++){
    slave={"host": slaveip[i],
      "attributes": $("#_ClusterAddLabel").val(),
      "port": "5051"}
    mesos_slave.push(slave);
  }
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "cluster_name": $("#_ClusterAddLabel").val(),
      "cluster_type": "slave",
      "cluster_label":clusterLabel,
      "cluster_num": slaveip.length,
      "remark": '1',
      "master_id": clusterId,
      "create_user": "admin",
      "zk_str": "",
      "mesos_str": "",
      "marathon_str": "",
      "registry": "",
      "zk":[],
      "mesos-master": [],
      "marathon":[],
      "haproxy": [],
      "nginx":[],
      "mesos-slave":mesos_slave
    }),
    success:function (result) {
      $("#tipsCreate").modal("hide");
        $("#success").modal('show');
        $("#tipsSpan").text('添加slave主机成功！');
      $('#editabledatatable').bootstrapTable("refresh");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
        $("#tipsCreate").modal("hide");
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
          $('#failmodal').modal('show');
          $('#failtitle').text('添加slave主机失败！！')
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
      }
    }
  });
}

$("#finishCreate").click(function(){
  //if(obj=="#addmasterform"){
  if($("[name='country']").val()=="marathon"){
    fnAddMarathon();
  }else if($("[name='country']").val()=="haproxy"){
    fnAddHaproxy();
  }else if($("[name='country']").val()=="nginx"){
    fnAddNginx();
  }
//	}else if(obj=="#addslaveform"){
//		fnAddSlave();
//	}
});
$("#finishSlaveCreate").click(function(){
  fnAddSlave();
});
//添加marathon组件
function fnAddMarathon(){
  var marathonArr=[];
  var marathon={
    "host":$("#hostIp").selectpicker("val"),
    "port":$("#marathonlist").find(".port").val(),
    "name":$("#marathonlist").find(".path").val(),
    "username":'dcosadmin', "password":'zjdcos01'
  };
  marathonArr.push(marathon);
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster/"+clusterName+"/nodes/marathon",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      'marathon':marathonArr,
        'cluster_label':clusterLabel
    }),
    success:function (result) {
        $("#addMasterModal").modal("hide");
      // var data=result.data;
        $("#success").modal('show');
        $("#tipsSpan").text('添加Marathon成功！');
      // commonAlert("#successMsg", "#successAlertBlock", "添加组件成功");
      $('#componentsModal').bootstrapTable("refresh");
      // }else{
      // 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
      // }


    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
          $('#failmodal').modal('show');
          $('#failtitle').text('添加Marathon失败！！')
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
        // commonAlert("#warningMsg", "#warningAlertBlock", '添加组件失败');
      }
    }
  });
}

//添加ha组件
function fnAddHaproxy(){
  var haproxyArr=[];
  var haproxy={
    'host':$("#hostIp").selectpicker("val"),
    'service_port':$("#Haproxylist").find(".port").val(),
    'port':$("#Haproxylist").find(".stat_port").val(),
    'marathon_endpoint':$("#MarathonIp").selectpicker("val").join(","),
    'username':'dcosadmin',
    'password':'zjdcos01',
    'bamboo_endpoint':$("#hostIp").selectpicker("val")+":"+$("#Haproxylist").find(".bamboo_endpoint").val(),
    'bamboo_path':$("#Haproxylist").find(".path").val()
  };
  haproxyArr.push(haproxy);
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster/"+clusterName+"/nodes/haproxy",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      'haproxy':haproxyArr,
        'cluster_label':clusterLabel
    }),
    success:function (result) {
        $("#addMasterModal").modal("hide");
      var data=result.data;
        $("#success").modal('show');
        $("#tipsSpan").text('添加Haproxy成功！');
      // commonAlert("#successMsg", "#successAlertBlock", "添加组件成功");
      $('#masterdatatable').bootstrapTable("refresh");
      // }else{
      // 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
          $("#addMasterModal").modal("hide");
          $('#failmodal').modal('show');
          $('#failtitle').text('添加Haproxy失败！！')
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
        // commonAlert("#warningMsg", "#warningAlertBlock","添加组件失败" );
      }
    }



  });
}

//添加nginx组件
function fnAddNginx(){
  var nginxArr=[];
  var nginx={
    'host':$("#hostIp").selectpicker("val"),
    'up_port':$("#Nginxlist").find(".up_port").val(),
    'down_port':$("#Nginxlist").find(".down_port").val()
  };
  nginxArr.push(nginx);
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+ "cluster/"+clusterName+"/nodes/nginx",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      'marathon':haproxyArr,
        'cluster_label':clusterLabel
    }),
    success:function (result) {
        $("#addMasterModal").modal("hide");
      var data=result.data;
        $("#success").modal('show');
        $("#tipsSpan").text('添加Nginx成功！');
      // commonAlert("#successMsg", "#successAlertBlock", "添加组件成功");
      $('#masterdatatable').bootstrapTable("refresh");
      // }else{
      // 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
      // }
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
          $("#addMasterModal").modal("hide");
          $('#failmodal').modal('show');
          $('#failtitle').text('添加Nginx失败！！')
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
        // commonAlert("#warningMsg", "#warningAlertBlock", "添加组件失败");
      }
    }
  });
}

//添加slave主机
//function fnAddSlave(){
//	var mesos_slave=[];
//	var slave;
//	var slaveip=$("#hostIpSlave").selectpicker("val");
//	for(var i=0;i<slaveip.length;i++){
//		slave={"host": slaveip[i],
//				"attributes": $("#addslavelabel").text(),
//				"port": "5051"}
//		mesos_slave.push(slave);
//	}
//
//	$("#addSlaveModal").modal("hide");
//	$.ajax({
//		type: 'POST',
//		url: '/exchange',
//		contentType: 'application/json',
//		dataType: 'json',
//		data:JSON.stringify({
//			"_uri": "cluster/"+clusterName+"/nodes/mesos-slave",
//		    "_method": "POST",
//		    'mesos-slave':mesos_slave
//		}),
//		success:function (result) {
//			if(result.msg=="OK"){
//				var data=result.data;
//				commonAlert("#successMsg", "#successAlertBlock", "添加主机成功");
//				fnGetClusterData();location.reload();
//			}else{
//				commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
//			}
//
//
//		}
//	});
//}
$('#creatDataModal').on('show.bs.modal', function () {
  $("input").val('');
});
//***********get拓扑图*************//

function draw(data) {
  var canvas = document.getElementById('canvas');
  var stage = new JTopo.Stage(canvas);
  var scene = new JTopo.Scene(stage);
  scene.alpha = 1;

  function addNode(text, name){
    var defaultNode = new JTopo.CircleNode(name);
    defaultNode.radius = 24; // 半径
    defaultNode.text = name; // 文字
    defaultNode.textPosition = 'Bottom_Center';// 文字居中
    defaultNode.textOffsetY = -8; // 文字向下偏移8个像素
    defaultNode.font = '14px 微软雅黑'; // 字体
    defaultNode.fontColor = "0,0,0";//字体颜色
    defaultNode.setLocation(300, 300); // 位置
    defaultNode.setSize(150, 30);  // 尺寸
    /*defaultNode.borderRadius = 5; // 圆角*/
    defaultNode.borderWidth = 2; // 边框的宽度
    defaultNode.borderColor = '255,255,255'; //边框颜色
    defaultNode.alpha = 0.7
    scene.add(defaultNode);

    defaultNode.mouseover(function(){
      this.text = text;
    });
    defaultNode.click(function(){
      this.text = name;
    });
    defaultNode.dbclick(function(){
      this.text = name;
      if(text.indexOf(";") == -1){
        window.open('http://'+text);
      }else{
        var ip=text.split(';');
        window.open('http://'+ip[0]);
      }
    });
    return defaultNode;
  }

  function addLink(nodeA, nodeZ){
    var link = new JTopo.FlexionalLink(nodeA, nodeZ);
    link.strokeColor = '204,204,204';
    link.lineWidth = 2;
    scene.add(link);
    return link;
  }
  var rootNode,rootTxt=[];
  for(var i=0; i<data.length; i++){
    if(data[i].service_name=='mesos-master'){
      rootTxt.push(data[i].url+":"+data[i].port);
      //break;
    }
  }
  rootNode = addNode(rootTxt.join(';'), 'zk/mesos-master:'+rootTxt.length+'个节点');
  for(var i=0; i<data.length; i++){
    if(data[i].service_name=='marathon'){
      var node = addNode(data[i].url+":"+data[i].port, 'marathon');
      addLink(rootNode, node);
      for(var a=0; a<data.length; a++){
        if(data[a].service_name=='haproxy'){
          if(data[a].v3==data[i].url+":"+data[i].port){
            var thirdNode = addNode(data[a].url+":"+data[a].port, 'haproxy');
            addLink(node, thirdNode);
          }
        }
      }
    }
  }

  // 树形布局
  scene.doLayout(JTopo.layout.TreeLayout('up', 150, 107));
}
function fnGetSlaveData(){
    $('#editabledatatable').empty();
    $('#editabledatatable').bootstrapTable({
        method: 'post',
        //toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true, //是否显示行间隔
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        sortable: false,      //是否启用排序
        sortOrder: "asc",     //排序方式
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        ajax: function (params) {
            fnPaging1(params);
        },
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber

        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        //showColumns: true, //是否显示所有的列
        //showRefresh: true, //是否显示刷新按钮
        minimumCountColumns: 2,    //最少允许的列数
        clickToSelect: true,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [ {
            title: '服务类型', field: 'service_name', searchable: true, sortable: true
        },{
            title: '标签', field: 'v1', searchable: true, sortable: true
        },   {
            title: '节点IP', field: 'url', searchable: true, sortable: true
        },{
            title: '端口', field: 'port', sortable: true, searchable: true
        },{
            title: '操作', field: 'id',formatter: function (val, row, idx) {
                if (row['service_name'] == 'mesos-master' || row['service_name'] == 'zookeeper') {
                    return '<i class="fa fa-ban"></i>';
                }else{
                    if(mourl.length==0){
                        return '<i class="fa fa-ban"></i>';
                    }else{
                        for(var i=0;i<mourl.length;i++){
                            var _html="";
                            if(mourl[i]=="cluster/host"){
                                var name=row['service_name']+"#"+val;

                                _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm deletebtn" onclick="deleteModal(\''+name+'\');">';
                                // if($("#clustertype").text()=='slave'){
                                _html+='<i class="fa fa-trash-o"></i>删除节点</a>';
                                // }
                                return _html;
                            }else{
                                _html='<i class="fa fa-ban"></i>';
                            }
                        }
                        return _html;
                    }
                }

            }
        }],
        // responseHandler: function (result) {
        //     //	if (result.msg=='OK') {
        //     return result.data;
        //
        // },
        onSearch: function (text) {
            console.info(text);
        },
        onLoadSuccess: function (data) {

        },
        onDblClickRow:function(data){
            console.log(data);

        },
        pagination: true
    });
}
function fnPaging1(params) {
    var josn = JSON.parse(params.data);
    var pageSize = josn.pageSize;
    var pageNumber = josn.pageNumber;
    var url;
    var type;
        url=_URL_INTERFACE +'cluster/slaves?page=' + pageNumber + "&pageSize=" + pageSize+"&cluster_id="+clusterId;
        type= 'GET';
    $.ajax({
        type:type,
        url: url,
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
/***程序包仓库配置***/
function fnSetProgramBar(){
    $.ajax({
        type: 'put',
        url:  _URL_INTERFACE+"cluster/"+clusterName+"/config",
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "software_urls":$("#warehouse").val()
        }),
        success:function (result) {
            var data=result.data;
            fnGetClusterDetail();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '#/login.html';
            } else {

            }
        }
    });
}


function fnSetImageBar(){
    $.ajax({
        type: 'put',
        url:  _URL_INTERFACE+"cluster/"+clusterName+"/config",
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "registry":$("#imageWareHouse").val()
        }),
        success:function (result) {
            var data=result.data;
            fnGetClusterDetail();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '#/login.html';
            } else {

            }
        }
    });
}
function fnGetSlaveLabel(result){
  var slave=result.data[0].slave_serv;
  var data=[];
  var getData=[];
  for(var i = 0; i < slave.length; i++){
    getData.push(slave[i].v1);
  }
  var json = {};
  for(var i = 0; i < getData.length; i++){
    if(!json[getData[i]]){
      data.push(getData[i]);
      json[getData[i]] = 1;
    }
  }

  $("#clusterlabel-select").empty();
  for(var i = 0; i < data.length; i++){
    var a=data[i];

    $("#clusterlabel-select").append('<option value="'+a+'">'+a+'</option>');
  }
}

//***********get表格*************//
function fnGetClusterData(){
  $('#masterdatatable').bootstrapTable({
    url:  _URL_INTERFACE+"cluster/"+clusterName+"/nodes", method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }},
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',

    toolbar:'#btn-div',
    columns: [{
      title: '服务类型', field: 'service_name', searchable: true, sortable: true
    },   {
      title: '标签名称', field: 'v1', sortable: true, searchable: true
    },{
      title: '主机IP', field: 'url', searchable: true, sortable: true
    },{
      title: '端口', field: 'port',sortable: true, searchable: true
    },{
      title: '镜像版本信息', field: 'image',sortable: true, searchable: true
    },{
      title: '操作', field: 'id',formatter: function (val, row, idx) {
        if (row['service_name'] == 'mesos-master' || row['service_name'] == 'zookeeper') {
          return '<i class="fa fa-ban"></i>';
        }else{
          if(mourl.length==0){
            return '<i class="fa fa-ban"></i>';
          }else{
            for(var i=0;i<mourl.length;i++){
              var _html="";
              if(mourl[i]=="cluster/host"){
                var name=row['service_name']+"#"+val;

                _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm deletebtn margin-right-5" onclick="deleteModal(\''+name+'\');">';
                if($("#clustertype").text()=='slave'){
                  _html+='<i class="fa fa-trash-o"></i>删除</a>';
                }else if($("#clustertype").text()=='master'){
                  _html+='<i class="fa fa-trash-o"></i>删除</a>';
                  if(row['service_name'] == 'marathon'){
                    if(row['AutoScaleInstance'] == '0'){
                      var type="start";
                      _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm deletebtn margin-right-5" onclick="fnStartStop(\''+row["v1"]+'\',\''+type+'\');"><i class="fa fa-play"></i>启动</a>';
                    }else{
                      var type="stop";
                      _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm deletebtn margin-right-5" onclick="fnStartStop(\''+row["v1"]+'\',\''+type+'\');"><i class="fa fa-pause"></i>暂停</a>';
                    }
                    _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm deletebtn margin-right-5" onclick="fnUpModal(\''+row["v1"]+'\');"><i class="fa fa-arrow-up"></i>升级</a>';
                  }
                }
                return _html;
              }else{
                _html='<i class="fa fa-ban"></i>';
              }
            }
            return _html;
          }
        }

      }
    }],
    responseHandler: function (result) {
      //if (result.msg=='OK') {
      return result.data;
      // } else {
      //return [];
      // }
      //return result;
    },
    onSearch: function (text) {
      console.info(text);
    },
    onLoadSuccess: function (data) {
      draw(data);
    },
    onDblClickRow:function(data){
    }
  });
}
//监控
//***********get监控事件图表*************//
function getEchartData(){
  var nowDate=new Date().Format("yyyy-MM-dd hh:mm:ss");
  var start=beforeNowtime('24');
  $.ajax({
    type: 'POST',
    url:  _URL_INTERFACE+"cluster/io/"+clusterName,
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "start_time": start,
      "end_time": nowDate,
      "groupby": "1h"
    }),
    success:function (result) {
      var data=result.data;
      var timeX=[],cpu=[],mem=[];
      if(data.length==0){
        timeX=[];
        cpu=[];
        mem=[];
      }else{
        for(var i=0;i<data.length;i++){
          var arr=data[i];
          timeX.push(arr.time);
          cpu.push(arr.cpu);
          mem.push(arr.mem);
        }
      }
      getControlEchart('clusterCPUused',timeX,cpu,"CPU");
      getControlEchart('memused',timeX,mem,"内存");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown){
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        //alert('添加失败！（例子）');//其他操作
      }
    }
  });
}

function getZKEchartData(){
  var nowDate=new Date().Format("yyyy-MM-dd hh:mm:ss");
  var start=beforeNowtime('24');
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster/"+clusterName+"/zkNum",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "start_time": start,
      "end_time": nowDate,
      "groupby": "1h"
    }),
    success:function (result) {
      var data=result.data;
      var timeX=[],zk=[];
      if(data.length==0){
        timeX=[];
        zk=[];
      }else{

        for(var i=0;i<data.length;i++){
          var arr=data[i];
          timeX.push(arr.time);
          zk.push(arr.zk_alive_num);
        }

      }
      getZKControlEchart('ZK',timeX,zk,"ZK连接数");


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

function getControlEchart(obj,date,data,type){

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
      type: 'value',
      axisLabel: {
        formatter: '{value} %'
      },
      max: 100,
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
        name:type+'使用率',
        type:'line',
        smooth: true,
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
        data: data,
      }
    ]
  };


  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

function getZKControlEchart(obj,date,data,type){

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
        data: data,

      }
    ]
  };


  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
//删除单个主机
var force='';
function deleteModal(val){
  var data=val.split("#");
  $("#deleteSingleCluster").modal("show");
  if(data[0]!='mesos-slave'){
    $('#returnMsg').text("确认是否要删除组件?");
  }else{
    $('#returnMsg').text("确认是否要删除节点?");
  }
  $("#deletedata").html(data[1]);
  $("#deletetype").html(data[0]);
}
function deleteCluster(){
  var val=$("#deletedata").html();
  var type=$("#deletetype").html();
  $("#deleteSingleCluster").modal("hide");
  $("#tips").modal("show");
  $("#tips").find("#tipsText").html("正在删除，请稍后");
  $.ajax({
    type: 'DELETE',
    url:  _URL_INTERFACE+"cluster/"+clusterName+"/nodes/"+type+"/"+val+"?force="+force,
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      $("#tips").modal("hide");
      var data=result.data;
      commonAlert("#successMsg", "#successAlertBlock", "删除成功");
        $('#masterdatatable').bootstrapTable("refresh");
        $('#editabledatatable').bootstrapTable("refresh");

    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $("#tips").modal("hide");
          // $('#returnMsg').text("失败原因："+result.msg );
          commonAlert("#warningMsg", "#warningAlertBlock", "删除失败");
        // if (type == "marathon") {
        //   $("#deleteSingleCluster").modal("show");
        //   $('#returnMsg').text(result.msg + ",确认是否要删除组件");
        //   force = true;
        // } else {
        //   commonAlert("#warningMsg", "#warningAlertBlock", "删除失败");
        // }
      }
    }
  });
}




//弹性扩缩升级
function fnUpModal(name){
  $("#autoscale").modal('show');
  $("#autoscale button.btn-primary").unbind();
  $("#autoscale button.btn-primary").on("click",function(){
    fnDoSure();
  });
  $('#autoscale button').on("click", function(){
    $("#autoscale").modal('hide');
  });

  $("#autoname").text(name);
}
function fnUpModalAll(name){
  $("#autoscale").modal('show');
  $("#autoscale button.btn-primary").unbind();
  $("#autoscale button.btn-primary").on("click",function(){
    fnDoSureAll();});
  $('#autoscale button').on("click", function(){
    $("#autoscale").modal('hide');
  });
  $("#autoname").text(name);
}
function fnDoSure(){
  $("#sure_again").modal('show');
  $("#sure_again button.btn-info").unbind();
  $("#sure_again button.btn-info").on("click",function(){
    fnSure();
  });
  $('#sure_again button.btn-default').on("click", function(){
    $("#sure_again").modal('hide');
  });
  $("#keywords").text("升级");
  $('#cluster_name').text($("#clustername").text());
  $("#marathon_name").text($("#autoname").text());
}
function fnDoSureAll(){
  $("#sure_again").modal('show');
  $("#sure_again button.btn-info").unbind();
  $("#sure_again button.btn-info").on("click",function(){
    fnSureAll();
  });
  $('#sure_again button.btn-default').on("click", function(){
    $("#sure_again").modal('hide');
  });
  $("#keywords").text("升级");
  $('#cluster_name').text($("#clustername").text());
  $("#marathon_name").text($("#autoname").text());
}
function fnSure(){
  var cluster_name=$('#cluster_name').text();
  var marathon_name;
  if($('#marathon_name').text()!=''){
    marathon_name=$('#marathon_name').text();
  }
  if($("#keywords").text()=="升级"){
    fnMarathonUpdate(cluster_name,marathon_name);
  }else if($("#keywords").text()=="停止"){
    fnMarathonSs(cluster_name,marathon_name,"stop");
  }else{
    fnMarathonSs(cluster_name,marathon_name,"start");
  }
}
function fnSureAll(){
  var cluster_name=$('#cluster_name').text();
	/*var marathon_name;
	 if($('#marathon_name').text()!=''){
	 marathon_name=$('#marathon_name').text();
	 }*/
  if($("#keywords").text()=="升级"){
    fnMarathonUpdateAll(cluster_name);
  }else if($("#keywords").text()=="停止"){
    fnMarathonSsAll(cluster_name,"stop");
  }else{
    fnMarathonSsAll(cluster_name,"start");
  }
}
function fnMarathonUpdate(cluster_name,marathon_name){
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"cluster/"+cluster_name+"/autoscale/"+marathon_name,
    headers: {
      "token": token
    },
    dataType: 'text',
    data: JSON.stringify({
      "image":$("#marathon_image").val()
    }),
    success:function (result) {
      //$("#tips").modal("hide");

      commonAlert("#successMsg", "#successAlertBlock", "升级成功");
      location.reload();
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        commonAlert("#warningMsg", "#warningAlertBlock", "升级失败");
      }
    }
  });
}
function fnCreateMasterModal(){
  $("#addMasterModal").modal("show");
    getIp("#hostIp");
}
function fnCreateSlaveNode(){
  $("#creatApplition").modal("show");
    getIp("#hostIpSlave");

}

function fnMarathonUpdateAll(cluster_name){
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"cluster/"+cluster_name+"/autoscale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "image":$("#marathon_image").val()
    }),
    success:function (result) {
      //$("#tips").modal("hide");
      commonAlert("#successMsg", "#successAlertBlock", "升级成功");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        commonAlert("#warningMsg", "#warningAlertBlock", "升级失败");
      }
    }
  });
}


function fnMarathonSs(cluster_name,marathon_name,type){
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster/"+cluster_name+"/autoscale/"+marathon_name,
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "type":type
    }),
    success:function (result) {
      //$("#tips").modal("hide");

      commonAlert("#successMsg", "#successAlertBlock", "操作成功！");
      //location.reload();
      $('#masterdatatable').bootstrapTable("refresh");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        commonAlert("#warningMsg", "#warningAlertBlock", "操作失败！");
      }
    }
  });
}


function fnMarathonSsAll(cluster_name,type){
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster/"+cluster_name+"/autoscale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "type":type
    }),
    success:function (result) {
      //$("#tips").modal("hide");

      commonAlert("#successMsg", "#successAlertBlock", "操作成功");
      $('#masterdatatable').bootstrapTable("refresh");
    },

    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");
      }
    }
  });
}

function fnshowpackage(){
  $('#packagehorbor').modal('show');
}

function fnshowimage(){
  $('#imagehorbor').modal('show');
}

//弹性启停
function fnStartStop(name,type){
  $("")
  $("#sure_again").modal('show');
  $("#sure_again button.btn-info").unbind();
  $("#sure_again button.btn-info").on("click",function(){
    fnSure();
  });
  $('#sure_again button.btn-default').on("click", function(){
    $("#sure_again").modal('hide');
  });
  if(type=="stop"){
    $("#keywords").text("停止");
  }else if(type=="start"){
    $("#keywords").text("启动");
  }

  $('#cluster_name').text($("#clustername").text());
  $("#marathon_name").text(name);
}
function fnStartStopAll(name,type){
  $("")
  $("#sure_again").modal('show');
  $("#sure_again button.btn-info").unbind();
  $("#sure_again button.btn-info").on("click",function(){
    fnSureAll();
    $("#sure_again").modal('hide');
  });
  $('#sure_again button.btn-default').on("click", function(){
    $("#sure_again").modal('hide');
  });
  if(type=="stop"){
    $("#keywords").text("停止");
  }else if(type=="start"){
    $("#keywords").text("启动");
  }

  $('#cluster_name').text($("#clustername").text());
  $("#marathon_name").text(name);
}
//master组件改变
function fnchangeCluster(){
  var selectVal=$("#cluster_id").find("select").val();
  if(selectVal=="marathon"){
    $("#marathonlist").show();
    $("#Haproxylist").hide();
    $("#Nginxlist").hide();
  }else if(selectVal=="haproxy"){
    $("#marathonlist").hide();
    $("#Haproxylist").show();
    $("#Nginxlist").hide();
  }else if(selectVal=="nginx"){
    $("#marathonlist").hide();
    $("#Haproxylist").hide();
    $("#Nginxlist").show();
  }
}
//get marathon
function fnGetMarathon(){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"cluster/"+clusterName+"/nodes/marathon",
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      // if(result.msg=="OK"){
      var data = result.data;
      //$("#hostIp").empty();
      if(data){
        for (var i = 0; i < data.length; i++){
          var option="<option value='"+data[i].values+"'>"+data[i].name+"</option>";
          $("#MarathonIp").append(option);
        }
        $("#MarathonIp").selectpicker('refresh');
      }else{
        var option="<option value=''>暂无数据</option>";
        $("#MarathonIp").append(option);
      }
      // }

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
//get主机ip
function getIp(obj){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"cluster/host",
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      var data = result.data;
      if(data){
        for (var i = 0; i < data.length; i++){
          //var val=data[i].id+"#"+data[i].ip_addr;
          var option="<option value='"+data[i].ip_addr+"'>"+data[i].ip_addr+"</option>";
          $(obj).append(option);
        }
        $(obj).selectpicker('refresh');
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

function closeInputSelect() {
  $('#typeselect').removeClass('hidden');
  $('#typeinput').addClass('hidden');
  $('#typeselect_U').removeClass('hidden');
  $('#typeinput_U').addClass('hidden');
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
}
//获取从现在到 beforetime 小时前的时间（beforetime 只能是整数）
function beforeNowtime(beforetime){
  var setFormat=function (x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }
  var date = new Date(); //日期对象
  date.setHours (date.getHours () - beforetime);
  var now = "";
  now = date.getFullYear()+"-"; //读英文就行了
  now = now + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';//取月的时候取的是当前月-1如果想取当前月+1就可以了
  now = now + setFormat(date.getDate())+" ";
  now = now + setFormat(date.getHours())+":";
  now = now + setFormat(date.getMinutes())+":";
  now = now + setFormat(date.getSeconds())+"";
  return now;
}
function fnSearch(obj){
  var txt = $(obj).val();
  if (txt == '') {
    $("tbody tr").show();
  } else {
    $("td").parents("tbody tr").hide();
    $("td:contains('" + txt + "')").parents("tbody tr").show();
  }
}

function commonAlert(msgObjectName,alertObject,msg)
{
  $(msgObjectName).html(msg);
  $(alertObject).show();
}
//应用列表
fnAppList();
var tableFlag;
var txt;
function fnAppList(){
    tableFlag="table";
    $('#applisttable').empty();
    $('#applisttable').bootstrapTable({
        method: 'post',
        //toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true, //是否显示行间隔
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        sortable: false,      //是否启用排序
        sortOrder: "asc",     //排序方式
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        ajax: function (params) {
            fnPaging(params);
        },
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber

        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        //showColumns: true, //是否显示所有的列
        //showRefresh: true, //是否显示刷新按钮
        minimumCountColumns: 2,    //最少允许的列数
        clickToSelect: true,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            title: '系统名称', field: 'sys_name', searchable: true, sortable: true
        },  {
            title: '应用名称', field: 'app_name', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                var value=row['app_id'];
                var html='';
                html='<a href="#/webcontent/Application/Application.html?appid='+value+'">'+val+'</a>';
                return html;
              /*'<a href="Application.html?'+value+'">'+val+'</a>';*/
            }
        },{
            title: 'CPU(核)', field: 'cpus', sortable: true, searchable: true
        },{
            title: '内存(MB)', field: 'mem', sortable: true, searchable: true
        },{
            title: '容器数', field: 'instances', sortable: true, searchable: true
        },{
            title: '扩缩容策略', field: 'autoscale_policy', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                if(val=='1'){
                    return '<span class="label label-success label-sm">开启</span>';
                }else if(val=='0'){
                    return '<span class="label label-default label-sm">关闭</span>';
                }
            }
        },{
            title: '状态', field: 'status', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                if(val=='1'){
                    return '<span class="label label-success label-sm">已发布</span>';
                }else if(val=='2'){
                    return '<span class="label label-warning label-sm">已暂停</span>';
                }else if(val=='0'){
                    return '<span class="label label-default label-sm">未发布</span>';
                }else if(val=='3'){
                    return '<span class="label label-danger label-sm">发布失败</span>';
                }
            }
        },{
            title: '创建时间', field: 'create_time', sortable: true, searchable: true
        }],
        // responseHandler: function (result) {
        //     //	if (result.msg=='OK') {
        //     return result.data;
        //
        // },
        onSearch: function (text) {
            console.info(text);
        },
        onLoadSuccess: function (data) {

        },
        onDblClickRow:function(data){
            console.log(data);
        },
        pagination: true
    });
}
function fnSearchAppList(obj){
    tableFlag = "search";
    txt = $(obj).val();
    $("#applisttable").bootstrapTable("destroy");
    $('#applisttable').bootstrapTable({
        method: 'post',
        //toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true, //是否显示行间隔
        cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,     //是否显示分页（*）
        sortable: false,      //是否启用排序
        sortOrder: "asc",     //排序方式
        pageNumber: 1,      //初始化加载第一页，默认第一页
        pageSize: 10,      //每页的记录行数（*）
        pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
        ajax: function (params) {
            fnPaging(params);
        },
        queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                             // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber

        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）
        //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        //showColumns: true, //是否显示所有的列
        //showRefresh: true, //是否显示刷新按钮
        minimumCountColumns: 2,    //最少允许的列数
        clickToSelect: true,    //是否启用点击选中行
        searchOnEnterKey: true,
        columns: [{
            title: '系统名称', field: 'sys_name', searchable: true, sortable: true
        },  {
            title: '应用名称', field: 'app_name', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                var value=row['app_id'];
                var html='';
                html='<a href="#/webcontent/Application/Application.html?appid='+value+'">'+val+'</a>';
                return html;
              /*'<a href="Application.html?'+value+'">'+val+'</a>';*/
            }
        },{
            title: 'CPU(核)', field: 'cpus', sortable: true, searchable: true
        },{
            title: '内存(MB)', field: 'mem', sortable: true, searchable: true
        },{
            title: '容器数', field: 'instances', sortable: true, searchable: true
        },{
            title: '扩缩容策略', field: 'autoscale_policy', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                if(val=='1'){
                    return '<span class="label label-success label-sm">开启</span>';
                }else if(val=='0'){
                    return '<span class="label label-default label-sm">关闭</span>';
                }
            }
        },{
            title: '状态', field: 'status', sortable: true, searchable: true,
            formatter: function (val, row, idx) {
                if(val=='1'){
                    return '<span class="label label-success label-sm">已发布</span>';
                }else if(val=='2'){
                    return '<span class="label label-warning label-sm">已暂停</span>';
                }else if(val=='0'){
                    return '<span class="label label-default label-sm">未发布</span>';
                }else if(val=='3'){
                    return '<span class="label label-danger label-sm">发布失败</span>';
                }
            }
        },{
            title: '创建时间', field: 'create_time', sortable: true, searchable: true
        }],
        // responseHandler: function (result) {
        //     //	if (result.msg=='OK') {
        //     return result.data;
        //
        // },
        onSearch: function (text) {
            console.info(text);
        },
        onLoadSuccess: function (data) {

        },
        onDblClickRow:function(data){
            console.log(data);
        },
        pagination: true
    });
}
function fnPaging(params) {
    var josn = JSON.parse(params.data);
    var pageSize = josn.pageSize;
    var pageNumber = josn.pageNumber;
    var url;
    var type;
    if(tableFlag=="table"){
        url=_URL_INTERFACE +"apps/list/paging/cluster?page=" + pageNumber + "&pageSize=" + pageSize+'&clusterlabel='+clusterLabel+'&condition=';
        type= 'GET';
    }else{
        url=_URL_INTERFACE +"apps/list/paging/cluster?page=" + pageNumber + "&pageSize=" + pageSize+'&clusterlabel='+clusterLabel+'&condition='+txt;
        type='GET';
    }
    $.ajax({
        type:type,
        url: url,
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
//应用迁移
function fnAppMove(){
  $("#movemodal").modal('show');
}
function fnMoveCluster(){
  var label=$('[name="reset_cluster"]').find("input[type='radio']:checked").attr('label');
  $("#movemodal").modal('hide');
  window.location.href = '#/webcontent/Cluster/moveCluster.html?label2='+label+'&label1='+clusterName;
}
function fnMoveShow(){
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"cluster",
    headers: {
      "token": token
    },
    dataType: 'json',

    success:function (result) {
      $('[name="reset_cluster"]').empty();
      var data = result.data;
      if(data){
        var option='';
        for (var i = 0; i < data.length; i++){
         if(data[i].id!=clusterId){
           option+='<div class="col-lg-3 col-sm-3 col-xs-3"> <div class="radio"><label>';
          // if(i==0){
             option+= '<input type="radio" name="moveclusterradio" checked class="colored-blue" label="'+data[i].label+'">';
           /*}else{
             option+= '<input type="radio" name="moveclusterradio" class="colored-blue" label="'+data[i].label+'">';
           }*/
           option+= '<span class="text">'+data[i].name+'</span> </label> </div></div>';
         }
        }
        $('[name="reset_cluster"]').append(option);
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