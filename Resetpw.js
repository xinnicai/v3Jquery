$("#updatapassword").bootstrapValidator({
  excluded: [':disabled'],
  feedbackIcons: {
    valid: 'glyphicon',
    invalid: 'glyphicon ',
    validating: 'glyphicon'
  },
  submitHandler: function (validator, form, submitButton) {
    savePassword();
  },
  fields: {
    oldpassword: {
      validators: {
        notEmpty: {
          message: '原密码不能为空'
        },
        callback: {

          message: '原密码错误',//提示消息
          callback: function (value, validator, $field) {
            var flag = false;
            $.ajax({
              type: 'POST',
              url: _URL_INTERFACE + 'platform/users/password',
              headers: {
                "token": token
              },
              dataType: 'json',
              async: false,
              data: JSON.stringify({
                "username": _user.username,//用户名
                "password": $("#inputPassword1").val()//原密码
              }),
              success: function (result) {
                //flag = result.msg=='OK';
                flag = true;
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status === 401) {
                  window.location.href = '/index.html';
                } else {
                  flag = false;
                }
              }
            });
            return flag;
          }
        }

      }
    },
    newpassword: {
      validators: {
        notEmpty: {
          message: '新密码不能为空'
        },
        different: {//不能和用户名相同
          field: 'oldpassword',//需要进行比较的input name值
          message: '不能和原密码相同'
        },
        regexp:{
          regexp:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/,
          message:'密码必须在8-20个字符，必须包含至少一个大写字符，一个小写字符，和一个数字！'
        }
      }
    },
    confim: {
      validators: {
        notEmpty: {
          message: '请确认新密码'
        },
        identical: {//相同
          field: 'newpassword', //需要进行比较的input name值
          message: '两次密码不一致'
        }
      }
    }
  }
});

//保存
function savePassword() {
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE + 'platform/users/password',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({
      "username": _user.username,//用户名
      "old_password": $("#inputPassword1").val(),//原密码
      "new_password": $("#inputPassword2").val(),//新密码
    }),
    success: function (result) {
      commonAlert("#successMsg", "#successAlertBlock", "修改密码成功");
      window.location.href = "index.html";
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.status === 401) {
        window.location.href = '/index.html';
      } else {
        commonAlert("#warningMsg", "#warningAlertBlock", "修改密码失败");
      }
    }
  });
}
//重置
function fnResetPasswd() {
  $("form").find("input").val('');
}

function commonAlert(msgObjectName, alertObject, msg) {
  $(msgObjectName).html(msg);
  $(alertObject).show();
}