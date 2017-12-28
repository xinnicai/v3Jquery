$(document).ready(function () {
  // initPage();
  fnUserPowerClusterList(uriArr, domArr);
  fnGetClusterData();//获取集群表格
  // fnGetHostData();//获取主机表格
  // $("#e2").select2({
  //   placeholder: "输入主机IP",
  //   allowClear: true
  // });
});
// menuValidator('#_HostAddModal');

$('#_HostAddModal').bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
        hostCreate();
    },
    fields: {
        HostIp: {
            validators: {
                notEmpty: {
                    message: '主机ip不能为空'
                },
                regexp: {
                    regexp:  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
                    message: '请输入正确的ip地址'
                }
            }
        }

    }
});
//用户权限
var uriArr = fnUrlArr(),
  domArr = fnDomArr();
var mourl = [];
function fnUserPowerClusterList(uriArr, domArr) {

  var mo = _user.mo;
  for (var i = 0; i < mo.length; i++) {
    mourl.push(mo[i].obj);
  }
  for (var a = 0; a < uriArr.length; a++) {
    var uri = uriArr[a];
    if (mourl.length == 0) {
      $(domArr[a]).css("display", "none");
    } else {
      for (var b = 0; b < mourl.length; b++) {
        if (uri == mourl[b]) {
          $(domArr[a]).css("display", "inline-block");
          return;
        } else {
          $(domArr[a]).css("display", "none");
        }
      }
    }

  }
}

menuValidator1('#accountForm');//创建slave集群


//***********创建slave*************//
$("#creatApplition").on('show.bs.modal', function () {
  $("#e2").select2("val", '');
  $("#_ClusterAddLabel").val('');
  $("#_ClusterName").val('');
  $("#slaveramark").val('');
  $("#_ClusterAddResp").val('');
});
function createMenu() {
  $("#creatApplition").modal('hide');
  $("#tipsCreate").modal("show");
  var mesos_slave = [];

  var slave;
  var slaveip = $("#e2").select2("val");
  for (var i = 0; i < slaveip.length; i++) {
    slave = {
      "host": slaveip[i],
      "attributes": $("#_ClusterAddLabel").val(),
      "port": "5051"
    };
    mesos_slave.push(slave);
  }

  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + "cluster",
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({
      "cluster_name": $("#_ClusterName").val(),
      "cluster_type": "slave",
      "cluster_label": $("#_ClusterAddLabel").val(),
      "cluster_num": slaveip.length,
      "remark": $("#slaveramark").val(),
      "master_id": $("#_ClusterAddResp").val(),
      "create_user": "admin",
      "zk_str": "",
      "mesos_str": "",
      "marathon_str": "",
      "registry": "",
      "zk": [],
      "mesos-master": [],
      "marathon": [],
      "haproxy": [],
      "nginx": [],
      "mesos-slave": mesos_slave
    }),

    success: function (result) {
      $("#tipsCreate").modal("hide");
      $("#successModal").modal("show");
      $('#SucessTitle').text('添加成功！');
     /* commonAlert("#successMsg", "#successAlertBlock", "添加数据成功");*/
      fnGetClusterData();//获取图表
      location.reload();

    },

    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $('#failmodal').modal('show');
        $('#failtitle').text('添加数据失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "添加数据失败");*/
      }
    }
  });
}

function fnHostAddModal(){
  $("#_HostAddModal").modal("show");
}
function fnHostImpAddModal(){
    $("#_HostImpAddModal").modal("show");
}
//*****************验证 提交表单*************//
function menuValidator1(obj) {

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
      createMenu();
    },
    fields: {
      _ClusterName: {
        validators: {
          notEmpty: {
            message: '集群名称不能为空'
          }
        }
      },
      _ClusterAddLabel: {
        validators: {
          notEmpty: {
            message: '集群标签不能为空'
          }
        }
      },
      _ClusterAddResp: {
        validators: {
          notEmpty: {
            message: '归属集群不能为空'
          }
        }
      },
      e2: {
        validators: {
          notEmpty: {
            message: '目标主机不能为空'
          }
        }
      },
      slaveramark: {
        validators: {
          notEmpty: {
            message: '备注不能为空'
          }
        }
      }
    }
  });
}
//***********get表格*************//
function fnGetClusterData() {
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE + "cluster", method: 'GET', cache: false,
    ajaxOptions: {
      headers: {
        "token": token
      }
    },
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',

    toolbar: '#btn-div',
    columns: [{
      title: '集群名称', field: 'name', searchable: true, sortable: true,
      formatter: function (val, row, idx) {
        var html = '', cls_id = row['id'];

        html = '<a href="#/webcontent/Cluster/ClsuterMonitor.html?cluster=' + val +'&label=' + row['label'] + '&id=' + cls_id + '" >' + val + '</a>';
        //html='<a href="#" onclick="changeMenu(this, \'/webcontent/Cluster/Clusterlist.html\', \'/webcontent/Cluster/ClsuterMonitor.html?cluster='+val+'&id='+cls_id+'\')">'+val+'</a>';
        return html;

      }
    }/*, {
      title: '集群类型', field: 'type', sortable: true, searchable: true
    }*/, {
      title: '标签', field: 'label', sortable: true, searchable: true
    }, {
      title: '节点数量', field: 'host_num', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if (row['type'] == 'slave') {
          return row['host_num'];
        } else {
          return row['host_num'];
        }
      }
    }, {
      title: '所属资源池', field: 'resource_pool', sortable: true, searchable: true,
      ormatter: function (val, row, idx) {
        if (row['resource_pool']) return row['resource_pool'];
        else return val;
      }
    }, {
      title: '创建人', field: 'create_user', sortable: true, searchable: true,
    }, {
      title: '状态', field: 'run_status', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if (val == '0') {
          return '<span>集群创建中，请稍后 <i class="fa fa-spin fa-spinner"></i></span>';
        } else if (val == '2') {
          return '<span class="label label-success label-sm">运行中</span>';
        } else if (val == '1') {
          return '<span class="label label-default label-sm">失败</span>';
        }
      }
    }, {
      title: '创建时间', field: 'create_time', sortable: true, searchable: true,
    }, {
      title: '操作', field: 'name', formatter: function (val, row, idx) {
        if (mourl.length == 0) {
          return '<i class="fa fa-ban"></i>';
        } else {
          for (var i = 0; i < mourl.length; i++) {
            var html = '';
            if (mourl[i] == "cluster") {
              return html = '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\'' + val + '\')"><i class="fa fa-trash-o"></i>删除</a>';
            } else {
              html = '<i class="fa fa-ban"></i>';
            }
          }
          return html;
        }

      }
    }],
    responseHandler: function (result) {
      console.log(result);
      //if (result.msg=='OK') {
      fnSlaveBelong(result.data);
      return result.data;
      // } else {
      //   return [];
      // }
      //return result;
    },
    onSearch: function (text) {

    },
    onLoadSuccess: function (data) {

    },
    onDblClickRow: function (data) {
    }
  });
}
function showdeleteModal(data) {
  $("#DeleteData").modal("show");
  $("#modaltext").html('<span>确定要删除</span><span class="info">'+data+'</span> ?');
  $("#modaltype").text("cluster");
  $("#deleteID").text(data);
}

//获取主机表格
function fnGetHostData() {
  $('#hostdatatable').bootstrapTable({
    url: _URL_INTERFACE + "cluster/host/free", method: 'GET', cache: false,
    ajaxOptions: {
      headers: {
        "token": token
      }
    },

    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',

    toolbar: '#btn-div',
    columns: [{
      title: '主机IP', field: 'ip_addr', searchable: true, sortable: true
    }, {
      title: 'CPU(核)', field: 'cpus', sortable: true, searchable: true
    }, {
      title: '内存(GB)', field: 'mem', sortable: true, searchable: true
    }, {
      title: '磁盘空间(GB)', field: 'disk', sortable: true, searchable: true,
    }, {
      title: '创建时间', field: 'create_time', sortable: true, searchable: true,
    }, {
      title: '操作', field: 'id', formatter: function (val, row, idx) {
        var delip=row['ip_addr'];
        if (mourl.length == 0) {
          return '<i class="fa fa-ban"></i>';
        } else {
          for (var i = 0; i < mourl.length; i++) {
            if (mourl[i] == "cluster/host") {
              html = '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteHostModal(\''+val+'\',\''+delip+'\')"><i class="fa fa-trash-o"></i>删除</a>';
              return html;
            } else {
              html = '<i class="fa fa-ban"></i>';
            }
          }
          return html;
        }
      }
    }],
    responseHandler: function (result) {
      //if (result.msg=='OK') {
      fnSlaveFreeHost(result.data);
      return result.data;
      //} else {
      // return [];
      //}
      //return result;
    },
    onSearch: function (text) {
      console.info(text);
    },
    onLoadSuccess: function (data) {

    },
    onDblClickRow: function (data) {
    }
  });
}
//目标主机slave
function fnSlaveFreeHost(data) {
  $("#e2").empty();
  for (var i = 0; i < data.length; i++) {
    $("#e2").append('<option value="' + data[i].ip_addr + '">' + data[i].ip_addr + '</option>');
  }
}
//slave归属集群
function fnSlaveBelong(data) {
  $("#_ClusterAddResp").empty();
  var cluster = [];
  for (var a = 0; a < data.length; a++) {
    if (data[a].type == "master") {
      var val = {"name": data[a].name, "id": data[a].id};
      cluster.push(val);
    }
  }
  for (var i = 0; i < cluster.length; i++) {
    $("#_ClusterAddResp").append('<option value="' + cluster[i].id + '">' + cluster[i].name + '</option>');
  }
}
//创建单个主机
//验证
function hostCreate(){
    var hosts = [];
    var hostinfo = {"host": $("#HostIp").val(), "remark": $("#_Hostremark").val()};
    hosts.push(hostinfo);
    fnIp(hosts);
}
// function hostIpCheck(obj) {
//   var val = $(obj).val();
//   var reg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
//   if (!reg.test(val)) {
//     $(obj).next().text("请输入正确的ip地址");
//     $('#_HostCreate').prop("disabled", true);
//   } else {
//     $(obj).next().text("");
//     $('#_HostCreate').prop("disabled", false);
//   }
// }

function fnIp(hosts) {
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + "cluster/host",
    headers: {
      "token": token
    },

    dataType: 'json',
    data: JSON.stringify({
      "hosts": hosts
    }),
    success: function (result) {
      $("#_HostAddModal").modal("hide");
      var data = result.data,exip=[];
      for (var i = 0; i < data.length; i++) {
        if(data[i].error.host!=''){
          exip.push(data[i].error.host);
        }
      }
      if(exip.length==0){
        $("#successModal").modal("show");
        $('#SucessTitle').text('添加成功！！！');
        /*commonAlert("#successMsg", "#successAlertBlock", "添加主机成功");*/
        fnGetHostData();
        $("#hostdatatable").bootstrapTable("refresh");
        // location.reload();
      }else{
        exip = exip.join(",");
        $('#failmodal').modal('show');
        $('#failtitle').text('添加主机失败！！')
        $('#failInfo').text("ip" + exip + "访问不到");
      }
    },

    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        if (result.data) {
          var data = result.data, exip = [];
          for (var i = 0; i < data.length; i++) {
            exip.push(data[i].error.host);
          }
          exip = exip.join(",");
          $('#warningmodal').modal('show');
          $('#warningtitle').text("ip" + exip + "访问不到");
         /* commonAlert("#warningMsg", "#warningAlertBlock", "ip" + exip + "已存在");*/
        } else {
          $('#failmodal').modal('show');
          $('#failtitle').text('添加主机失败！！')
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
         /* commonAlert("#warningMsg", "#warningAlertBlock", "添加主机失败");*/
        }
      }
    }

  });
}
//主机批量上传
var ipList = [];
function upload(input) {
  //支持chrome IE10
  if (window.FileReader) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      ipList = (this.result).split(";");
      //console.log(ipList);
      //$(".uploadSuccess").text("上传成功!");
      checkedFile(file.name, this.result);
    };
    reader.readAsText(file);
      $("#mutipleUpload").attr("disabled",false);

  }
  //支持IE 7 8 9 10
  else if (typeof window.ActiveXObject != 'undefined') {
    var xmlDoc;
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    ipList = (xmlDoc.xml).split(";");
    $(".uploadSuccess").text("上传成功!");
  }
  //支持FF
  else if (document.implementation && document.implementation.createDocument) {
    var xmlDoc;
    xmlDoc = document.implementation.createDocument("", "", null);
    xmlDoc.async = false;
    xmlDoc.load(input.value);
    ipList = (xmlDoc.xml).split(";");
    $(".uploadSuccess").text("上传成功!");
  } else {
    $(".uploadSuccess").text("上传失败!");
  }

}
//验证文件内容
function checkedFile(name, content) {
  if (name.indexOf(".txt") < 0) {
    ipList = [];
    alert("请选择正确的文件类型");
    return;
  }
//	if(content.indexOf(";")<0){
//		ipList=[];
//		alert("请注意文件中ip的格式");
//		return;
//	}else{
  ipList = content.split(";");
  //}

  var reg = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[0-9]{1,2})){3}$/;
  if (ipList.length > 0) {
    for (var i = 0; i < ipList.length; i++) {
      if (!reg.test(ipList[i])) {
        alert("请注意文件中ip的格式");
        ipList = [];
        return;
      }
    }
  }

  $(".uploadSuccess").text("上传成功!");
}
function fnAddIps() {
  $(".uploadSuccess").text("");
  var hosts = [];
  for (var i = 0; i < ipList.length; i++) {
    var hostinfo = {"host": ipList[i], "remark": ''};
    hosts.push(hostinfo);
  }
  fnIp(hosts);
}
//删除主机
function showdeleteHostModal(data,delip) {
  $("#DeleteData").modal("show");
  $("#modaltext").text("确定要删除主机");
  $("#modalip").text(delip);
  $("#modaltype").text("host");
  $("#deleteID").text(data);
}
function deleteData() {
  var id = $("#deleteID").text();
  if ($("#modaltype").text() == "host") {
    fnDeleteHost(id);//删除主机
  } else if ($("#modaltype").text() == "cluster") {
    fnDeleteCluster(id);//删除集群
  }

}
//删除集群
function fnDeleteCluster(name) {
  $("#tips").modal("show");
  $.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE + "cluster/" + name,
    headers: {
      "token": token
    },
    dataType: 'json',

    success: function (result) {
      $("#tips").modal("hide");
      $("#successModal").modal("show");
      $('#SucessTitle').text('删除成功！');
      fnGetClusterData();
      fnGetHostData();//获取主机图表
        $("#editabledatatable").bootstrapTable("refresh");
      // location.reload();

    },

    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $("#tips").modal("hide");
        $('#failmodal').modal('show');
        $('#failtitle').text('集群删除失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "集群删除失败");*/
      }
    }

  });
}
//删除主机
function fnDeleteHost(id) {

  $.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE + "cluster/host/" + id,
    headers: {
      "token": token
    },
    dataType: 'json',

    success: function (result) {
      $("#successModal").modal("show");
      $('#SucessTitle').text('删除成功！');

      /*commonAlert("#successMsg", "#successAlertBlock", "主机删除成功");*/
      fnGetHostData();//获取主机图表
      $("#hostdatatable").bootstrapTable("refresh");

    },

    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $('#failmodal').modal('show');
        $('#failtitle').text('删除主机失败！！')
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "主机删除失败");*/
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

function fnSearch(obj) {
  var txt = $(obj).val();
  if (txt == '') {
    $("tbody tr").show();
  } else {
    $("td").parents("tbody tr").hide();
    $("td:contains('" + txt + "')").parents("tbody tr").show();
  }
}
function fnGetFreeHost () {
    fnGetHostData();
}
function commonAlert(msgObjectName, alertObject, msg) {
  $(msgObjectName).html(msg);
  $(alertObject).show();
}

