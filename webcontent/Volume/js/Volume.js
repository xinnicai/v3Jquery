$(document).ready(function () {
    fngetData();//获取图表
    fnGetPool();
    volumeValidator("#creatApplition");
});
function volumeValidator(obj){
    $(obj).bootstrapValidator({
        // Only disabled elements are excluded
        // The invisible elements belonging to inactive tabs must be validated
        excluded: [':disabled'],

        submitHandler: function (validator, form, submitButton) {
            if(obj=='#creatApplition'){//flag=true;
                createMenu();
            }else{
                // updateImage("0");
            }
        },
        fields:{
            slider_val: {
                validators: {
                    notEmpty: {
                        message: '此项不允许为空'
                    }
                }
            },
            fullName: {
                validators: {
                    notEmpty: {
                        message: '此项不允许为空'
                    }
                }
            },
            cluster_object:{
                validators: {
                    notEmpty: {
                        message: '此项不允许为空'
                    }
                }
            }
        }
    });
}
//***********创建菜单*************//
function createMenu() {
    $("#creatApplition").modal("hide");
    var cluster=$("#cluster_object").selectpicker("val");
    var clusterName;
    if(cluster=="sandun"){
        clusterName="三墩集群";
    }else{
        clusterName="石桥集群";
    }
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'volumes',
    headers: {token: token},
    dataType: 'json',
    data: JSON.stringify({
      "name": $("#volume_name").val(),
      "size": parseInt($("#sample-onehandle").val()),
      "remark": $("#volume_remark").val(),
        "cluster_name": clusterName
    }),
    success: function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('创建卷成功！！');
      $('#editabledatatable').bootstrapTable("refresh");

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '#/login.html';
      } else {
        $("#failmodal").modal('show');
        $("#failTitle").text('添加失败');
        $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
       /* commonAlert("#warningMsg", "#warningAlertBlock", "操作失败,原因：");*/
      }
    }
  });
}
// //*****************验证 提交表单*************//
// function volumeValidator(obj){
//
//  $("#accountForm").bootstrapValidator({
//    // Only disabled elements are excluded
//    // The invisible elements belonging to inactive tabs must be validated
//    excluded: [':disabled'],
//    feedbackIcons: {
//        valid: 'glyphicon',
//        invalid: 'glyphicon ',
//        validating: 'glyphicon'
//    },
//    submitHandler: function (validator, form, submitButton) {
//    	createMenu();
//    },
//    fields: {
//
//    	fullName: {
//            validators: {
//                notEmpty: {
//                    message: '名称不能为空'
//                }
//            }
//        },
//        remark: {
//            validators: {
//                notEmpty: {
//                    message: '备注不能为空'
//                }
//            }
//        }
//    }
// });
// }
$('#creatDataModal').on('show.bs.modal', function () {
  $("input").val('');
  getType('#dataTypes');
});
//***********get表格*************//
function fngetData() {
  $('#editabledatatable').bootstrapTable({
    url: _URL_INTERFACE+'volumes', method: 'GET', cache: false,
    ajaxOptions: {headers: {"token": token}}, search: true, dataType: 'json',
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',
    toolbar: '#btn-div',
    columns: [{
      title: '卷名称', field: 'name', searchable: true, sortable: true,
      formatter: function (val, row, idx) {
        var vo_id = row['id'];
        var cluster_name=row["cluster_name"];
        var html = '';
        html='<a href="#/webcontent/Volume/Volumelist.html?volumename='+val+'&cluster_name=' + cluster_name +'&volumeid=' + vo_id +'" >'+val+'</a>';
        return html;
      }
    }, /*{
      title: '系统名称', field: 'sys_name', sortable: true, searchable: true,

    },*/ {
        title: '所属集群', field: 'cluster_name', sortable: true, searchable: true
    },
        {
      title: '格式', field: 'file_format', sortable: true, searchable: true
    }, {
      title: '大小(GB)', field: 'size', sortable: true, searchable: true,
    }, /*{
     title: '挂载主机', field: 'value3',sortable: true, searchable: true,
     },*/{
      title: '挂载点', field: 'hostpath', sortable: true, searchable: true,
    }, {
      title: '状态', field: 'status', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if (val == "0") {
          return '<span class="label label-default label-sm">未挂载</span>';
        } else if (val == "1") {
          return '<span class="label label-success label-sm">已挂载</span>';
        }
      }
    }, {
      title: '创建时间', field: 'create_time', sortable: true, searchable: true,
    }, {
      title: '操作', field: 'name',
      formatter: function (val, row, idx) {//data-target="#krvloume"
          console.log(row);
          var name=row["name"];
          var cluster_name=row["cluster_name"];
//        	   '<a class="btn btn-sm btn-default" href="#" onclick="showupdataModal('+val+')"><i class="fa  fa-arrows"></i>扩容</a>'
        return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal(\''+name+'\',\''+cluster_name+'\')"><i class="fa fa-trash-o"></i>删除</a>';
      }
    }],
    responseHandler: function (result) {
      // if (result.msg == 'OK') {
        return result.data;
      // } else {
      //   return [];
      // }
      //return result;
    },
    onSearch: function (text) {
      console.info(text);
    },
    onLoadSuccess: function (data) {
console.log(data);
    },
    onDblClickRow: function (data) {

    }
  });
}
//***********编辑modal获取数据*************//
function showupdataModal(id) {
  $("#krvloume").modal("show");
  $("#volumeid").text(id);
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE+"volumes/" + id,
    headers: {"token": token},
    dataType: 'json',
    success: function (result) {
      var data = result.data[0];
      fndetailhandle(data);
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
function fndetailhandle(data) {
  $("#volumename").text(data.name);
  $("#now_size").text(data.size);
  $("#sample-onehandle2").val(data.size);
  $("#extend_size").val(data.size);
}
function change(obj) {
  var val = $(obj).val();
  var id = $(obj).attr("id");
  $("[name='" + id + "']").val(val);
}

//删除菜单
function showdeleteModal(name,cluster_name) {
  $("#Delvloume").modal("show");
  $("#delName").text(name);
  $("#clusterName").text(cluster_name);
}
function fnCreateVolumeList(){

  $("#creatApplition").modal("show");
}
function deleteData() {
  // var id = $("#deleteID").text();
    var name=$("#delName").text();
    var cluster_name=$("#clusterName").text();
  $.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"volumes",
    headers:{token:token},
    dataType: 'json',
      data:JSON.stringify({
          "name":name,//网络名称
          "cluster_name":cluster_name
      }),
    success: function (result) {
      $("#successmodal").modal('show');
      $("#successTitle").text('删除成功');
        $('#editabledatatable').bootstrapTable("refresh");
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#failmodal").modal('show');
        $("#failTitle").text('删除失败');
        $("#failSpan").text(JSON.parse(XMLHttpRequest.responseText).msg);
       /* commonAlert("#warningMsg", "#warningAlertBlock", '删除失败！');*/
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
$("#sample-onehandle").noUiSlider({
  range: [0, 3],
  start: 0,
  step: 1,
  handles: 1,
  connect: "lower",
  serialization: {
    to: [$("#low"), 'html']
  },
  slide: function () {
    var values = parseInt($(this).val());
    $("#slider_value").val(values);
  }

});

$("#sample-onehandle2").noUiSlider({
  range: [20, 100],
  start: 4,
  step: 20,
  handles: 1,
  connect: "lower",
  serialization: {
    to: [$("#low"), 'html']
  },
  slide: function () {
    var values = parseInt($(this).val());
    $("#extend_size").val(values);
  }
});
function fnSearch(obj) {
  var txt = $(obj).val();
  if (txt == '') {
    $("tbody tr").show();
  } else {
    $("td").parents("tbody tr").hide();
    $("td:contains('" + txt + "')").parents("tbody tr").show();
  }
}

/*
function commonAlert(msgObjectName, alertObject, msg) {
  $(msgObjectName).html(msg);
  $(alertObject).show();
}*/
document.getElementById("ResourcesPool").addEventListener("click",fnChangePool,false);
//资源池
function fnChangePool(event) {
    $("#ResourcesPool").find("a").attr('class', "btn btn-default margin-right-10");
    var clustername = '';
    if (event.target && event.target.nodeName == "A") {
        // 找到目标，输出ID!
        event.target.className = "btn btn-info margin-right-10";
        fnGetCluster(event.target.attributes.value.nodeValue);
    }
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

function fnGetCluster(code){
    var target = $("select[name='cluster_object']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"cluster/resourcedomain/"+code,
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0) {
                for (var i = 0; i < data.length; i++) {
                    target.append("<option value='" + data[i].label + "'>" + data[i].name + "</option>");
                }
                $("select[name='cluster_object']").parent().nextAll(".red").html("");
            }
            else{
                $("select[name='cluster_object']").parent().nextAll(".red").html("该资源池下没有可选集群");
            }

            target.selectpicker('refresh');
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