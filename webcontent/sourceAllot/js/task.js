/**
 * Created by han on 2017/10/24.
 */
/**
 * Created by han on 2017/10/23.
 */
$(document).ready(function (){
  dataInit();
});
var modalname=getUrlParam('name');
var modalcpu=getUrlParam('cpu');
var modalmem=getUrlParam('mem');
var modaldisk=getUrlParam('disk');
var modalversion=getUrlParam('version');

//数据初始化
function dataInit(){
  $(".modalname").text(modalname);
  $('#cputext').text(modalcpu+'核');
  $('#memtext').text(modalmem+'GB');
  $('#disktext').text(modaldisk+'GB');
  $('#versiontext').text(modalversion);
}

//添加任务
function fnAddTask(){
  $("#taskname").attr('disabled',false);
  $("#creatTask").modal('show');
  $(".btntype").text('创建');
}
function AddTask(){
  $("#creatTask").modal('hide');
  var _html='<tr> <td>'+$('#taskname').val()+'</td>';
  _html+='<td><span class="status"><span class="label label-warning label-sm">暂停</span></span><span class="hidden confige">'+$("#confige").val()
    +'</span><span class="hidden runcode">'+$("#runcode").val()+'</span><span class="hidden cluster">'+$("#cluster").val()+'</span></td>';
  _html+='<td><a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="start(this)">';
  _html+='<i class="fa fa-play"></i>执行</a>';
  _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="deleteshow(\''+$('#taskname').val()+'\')">';
  _html+='<i class="fa fa-trash-o"></i>删除</a>';
  _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="editTaskModal(this)">';
  _html+='<i class="fa fa-trash-o"></i>编辑</a>';
  _html+='</td> </tr>';
  $('tbody').append(_html);
}
//编辑
function editTaskModal(obj){
  $(".btntype").text('编辑');
  $("#taskname").attr('disabled',true);
  $("#creatTask").modal('show');
  var tr=$(obj).parents('tr');
  var taskname=tr.find('td').eq('0').text();
  var runcode=tr.find('.runcode').text();
  var confige=tr.find('.confige').text();
  var cluster=tr.find('.cluster').text();
  $("#taskname").val(taskname);
  $("#runcode").val(runcode);
  $("#confige").val(confige);
  $("#cluster").val(cluster);
}
function editTask(){
  var tr=$('tbody').find('tr');
  for(var a=0;a<tr.length;a++){
    var td=tr.eq(a).find('td').eq(0);
    if(td.text()==$("#taskname").val()){
      tr.eq(a).remove();
    }
  }
  AddTask();
}
//扩缩
function fnunauto(){
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"apps/scale",
    headers: {
      "token": token
    },
    dataType: 'json',
    data:JSON.stringify({
      "app_id":'DontDelete',
      "scale":2,
      "cluster_quota":{}
    }),
    success:function (result) {
      if($("#taskname").attr('disabled')==false){
        AddTask();
      }else{
        editTask();
      }
      $("#tips").modal('show');
    },
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#failmodal').modal('show');
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
  });
}
//*****************验证 提交表单*************//
$("#creatTask").bootstrapValidator({
  // Only disabled elements are excluded
  // The invisible elements belonging to inactive tabs must be validated
  excluded: [':disabled'],
  feedbackIcons: {
    valid: 'glyphicon',
    invalid: 'glyphicon ',
    validating: 'glyphicon'
  },
  submitHandler: function (validator, form, submitButton) {
    fnunauto();

  },
  fields: {
    runcode: {
      validators: {
        notEmpty: {
          message: '安装不能为空'
        }
      }
    },
    cluster: {
      validators: {
        notEmpty: {
          message: '集群不能为空'
        }
      }
    },
    confige: {
      validators: {
        notEmpty: {
          message: '软件配置不能为空'
        }
      }
    },
    taskname: {
      validators: {
        notEmpty: {
          message: '任务名称不能为空'
        }
      }
    },
  }
});
//删除
function deleteshow(text){
  $("#deletemodal").modal('show');
  $("#deletename").text(text);
  $("#doing").text('删除');
}
function handle(){
  if($("#doing").text()=='删除'){
    deleteData();
  }else{
    doStop();
  }
}
function deleteData(){
  var tr=$('tbody').find('tr');
  for(var a=0;a<tr.length;a++){
    var td=tr.eq(a).find('td').eq(0);
    if(td.text()==$("#deletename").text()){
      tr.eq(a).remove();
    }
  }
}
//执行
function start(obj){
  var tr=$(obj).parents('tr');
  $("#startmodal").modal('show');
  var taskname=tr.find('td').eq('0').text();
  $("#running").text(taskname);
}
var flag=false;
function startSuccess(){
  flag=true;
  $("#startmodal").modal('hide');
  $("#modal-info").modal('show');
  setTimeout(function(){
    if(flag){
      var d = document.getElementById("statusslider");
      d.style.width = "100%";
      $("#modal-info").modal('hide');
      $("#tips").modal('show');
    }

  },3000);
  var tr=$('tbody').find('tr');
  for(var a=0;a<tr.length;a++){
    var td=tr.eq(a).find('td').eq(0);
    var _html='';
    _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="stop(this)">';
    _html+='<i class="fa fa-pause"></i>暂停</a>';
    _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="deleteshow(\''+$('#running').text()+'\')">';
    _html+='<i class="fa fa-trash-o"></i>删除</a>';
    _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="editTaskModal(this)">';
    _html+='<i class="fa fa-trash-o"></i>编辑</a>';
    if(td.text()==$("#running").text()){
      tr.eq(a).find('.status').html('<span class="label label-success label-sm">成功</span>');
      tr.eq(a).find('td').eq(2).html(_html);
    }
  }
}
//执行中暂停
function runStop(){
  flag=false;
  var tr=$('tbody').find('tr');
  for(var a=0;a<tr.length;a++){
    var td=tr.eq(a).find('td').eq(0);
    var _html='';
    _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="recover(this)">';
    _html+='<i class="fa fa-play"></i>恢复</a>';
    _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="deleteshow(\''+$('#running').text()+'\')">';
    _html+='<i class="fa fa-trash-o"></i>删除</a>';
    _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="editTaskModal(this)">';
    _html+='<i class="fa fa-trash-o"></i>编辑</a>';
    if(td.text()==$("#running").text()){
      tr.eq(a).find('.status').html('<span class="label label-warning label-sm">暂停</span>');
      tr.eq(a).find('td').eq(2).html(_html);
    }
  }
}
function recover(obj){
  var tr=$(obj).parents('tr');
  var taskname=tr.find('td').eq('0').text();
  $("#running").text(taskname);
  startSuccess();
}
$("#startmodal").bootstrapValidator({
  // Only disabled elements are excluded
  // The invisible elements belonging to inactive tabs must be validated
  excluded: [':disabled'],
  feedbackIcons: {
    valid: 'glyphicon',
    invalid: 'glyphicon ',
    validating: 'glyphicon'
  },
  submitHandler: function (validator, form, submitButton) {
    startSuccess();
  },
  fields: {
    host: {
      validators: {
        notEmpty: {
          message: '节点不能为空'
        }
      }
    }
  }
});
//暂停
function stop(obj){
  var tr=$(obj).parents('tr');
  var taskname=tr.find('td').eq('0').text();
  $("#deletemodal").modal('show');
  $("#deletename").text(taskname);
  $("#doing").text('暂停');
}
function doStop(){
  $("#tips").modal('show');
  var tr=$('tbody').find('tr');
  var _html='';
  _html+='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="start(this)">';
  _html+='<i class="fa fa-play"></i>执行</a>';
  _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="deleteshow(\''+$('#running').text()+'\')">';
  _html+='<i class="fa fa-trash-o"></i>删除</a>';
  _html+=' <a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="editTaskModal(this)">';
  _html+='<i class="fa fa-trash-o"></i>编辑</a>';
  for(var a=0;a<tr.length;a++){
    var td=tr.eq(a).find('td').eq(0);
    if(td.text()==$("#deletename").text()){
      tr.eq(a).find('.status').html('<span class="label label-warning label-sm">暂停</span>');
      tr.eq(a).find('td').eq(2).html(_html);
    }
  }
}

