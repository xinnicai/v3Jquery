/**
 * Created by han on 2017/10/23.
 */
$(document).ready(function (){
  //fngetData();//获取图表
});

$("#addbtn").click(function(){
    $("#creatModal").modal('show');
});

function createModal(){
  $("#creatModal").modal('hide');
  var _html='';
  _html+='<div class="col-xs-12 col-sm-6 col-md-4">';
  _html+='<a href="#/webcontent/Deploy/deployTask.html?name='+$("#modalname").val()+'&&cpu='+$("#CPU").val()
    +'&&mem='+$("#mem").val()+'&&disk='+$("#disk").val()+'&&version='+$("#version").val()+'" name="mysql" >';
  _html+='<div class="plan">';
  _html+='<div class="pull-left padding-10">';
  _html+='<img  src="assets/img/img/mysql.jpg" >';
  _html+='</div>';
  _html+='<div class="box-info">';
  _html+='<h3 class="title">'+$("#modalname").val()+'</h3>';
  _html+='<p>CPU'+$("#CPU").val()+',内存'+$("#mem").val()+',磁盘'+$("#disk").val()+'</p>';
  _html+='<p class="version hidden">'+$("#version").val()+'</p>';
  _html+='</div> </div> </a> </div>';
  $(".successmodal").append(_html);
}
//*****************验证 提交表单*************//
  $("#modalForm").bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
      valid: 'glyphicon',
      invalid: 'glyphicon ',
      validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
      createModal();
    },
    fields: {
      modalname: {
           validators: {
               notEmpty: {
                   message: '模板名称不能为空'
               }
           }
       },
        CPU: {
        validators: {
          notEmpty: {
            message: 'CPU键不能为空'
          }
        }
      },
      mem:{
        validators: {
          notEmpty: {
            message: '内存不能为空'
          }
        }
      },
      disk:{
        validators: {
          notEmpty: {
            message: '磁盘不能为空'
          }
        }
      }
    }
  });
