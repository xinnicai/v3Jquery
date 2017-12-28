/**
 配置信息
 */

if(getCookie('token')===null){
  window.location.href = './login.html';
}
if(location.href.indexOf('#')<=-1){
  history.replaceState(null,'',location.href.split("#")[0]+"#/index.html");
}

function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

  if(arr=document.cookie.match(reg))

    return (arr[2]);
  else
    return null;
}
//删除cookies
function delCookie(name)
{
  var exp = new Date();
  exp.setTime(exp.getTime() - 1000);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + '='+cval+';expires=' + exp.toGMTString();
}

function getUrlParam(id) {
  var url = decodeURIComponent(window.location+ "");
  var regstr = "/(\\?|\\&)" + id + "=([^\\&]+)/";
  var reg = eval(regstr);//eval可以将 regstr字符串转换为 正则表达式
  var result = url.match(reg);//匹配的结果是：result[0]=?sid=22 result[1]=sid result[2]=22。所以下面我们返回result[2]
  if (result && result[2]) {
    return result[2];
  }
}

//var _URL_INTERFACE = 'http://192.168.2.11:9002/v3.0/';
// var _URL_INTERFACE = 'http://icloud.zj.chinamobile.com:6060/v3.0/';
var _URL_INTERFACE = 'http://20.26.28.187:6060/v3.0/';
function POST(jsonObjData, successCallback, async) {
  if (!async) async = true;
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + '/exchange',
    contentType: 'application/json',
    dataType: 'json',
    async: async,
    data: JSON.stringify(jsonObjData),
    success: function (result) {
      var cb = $.Callbacks("once");
      cb.add(successCallback);
      cb.fire(result);
    }
  });
}
var _user ;
var token = getCookie('token');
//页面初始化
function initPage4A() {
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"login4a",
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    async:false,
    success:function (result) {
      document.cookie = 'token='+result.data.token;
      token = result.data.token;
      if (result.data.status == '0') {
        _user = result.data;
        //顶部导航和左侧菜单固定
        var arr = _user.menus;
        //console.info(arr);
        var params = parseParams(self.location.search);
        var targetMenuUri = params.target;//localStorage.getItem("target_menu_uri");
        //console.info(targetMenuUri);
        var dynamicMenu = "";
        for (var a = 0; a < arr.length; a++) {
          if (targetMenuUri == arr[a].url) {
            dynamicMenu += "<li class='active'>";
          } else if (isEmpty(targetMenuUri) && a == 0) {
            dynamicMenu += "<li class='active'>";
          } else {
            dynamicMenu += "<li>";
          }
          // dynamicMenu += "<a href='#' onclick=\"changeMenu(this, '"
          //   + arr[a].url + "')\"><i class='"
          //   + arr[a].dom_class + "'></i><span class='menu-text'> "
          //   + arr[a].name + "</span></a></li>";
          dynamicMenu += "<a onclick='setActive(this)' href='#" + arr[a].url + "' ><i class='"
            + arr[a].dom_class + "'></i><span class='menu-text'> "
            + arr[a].name + "</span></a></li>";

        }
        $(".sidebar-menu").html(dynamicMenu);
        if(location.href.indexOf('#')>0){
          var y = $('.sidebar-menu').find('li a');
          for (var i=0;i< y.length;i++){
            var z = y.eq(i).attr('href');
            if(getCookie('menuUrl') === z){
              $('.sidebar-menu').find('li').removeClass('active');
              y.eq(i).parents('li').addClass('active');
            }
          }

        }
      }
      else {
        $("#warning").text(result.data.msg);
      }

      clientSideInclude('.navbar-inner', './top.html');
      clientSideAppend('body', './notice.html');
      if (!getCookie('cmp')) $('.navbar-fixed-top').show();

      setTimeout(function () {
        noticeLoad();
        $('#top_user_name').text(_user.name);
      }, 10);

    }
  });


}
//页面初始化
function initPage() {
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"login",
    dataType: 'json',
    data:JSON.stringify({
      username:getCookie('username'),
      password:getCookie('password')
    }),
    async:false,
    success:function (result) {
      document.cookie = 'token='+result.data.token;
      token = result.data.token;
      if (result.data.status == '0') {
        _user = result.data;
        //顶部导航和左侧菜单固定
        var arr = _user.menus;
        //console.info(arr);
        var params = parseParams(self.location.search);
        var targetMenuUri = params.target;//localStorage.getItem("target_menu_uri");
        //console.info(targetMenuUri);
        var dynamicMenu = "";
        for (var a = 0; a < arr.length; a++) {
          if (targetMenuUri == arr[a].url) {
            dynamicMenu += "<li class='active'>";
          } else if (isEmpty(targetMenuUri) && a == 0) {
            dynamicMenu += "<li class='active'>";
          } else {
            dynamicMenu += "<li>";
          }
          // dynamicMenu += "<a href='#' onclick=\"changeMenu(this, '"
          //   + arr[a].url + "')\"><i class='"
          //   + arr[a].dom_class + "'></i><span class='menu-text'> "
          //   + arr[a].name + "</span></a></li>";
          dynamicMenu += "<a onclick='setActive(this)' href='#" + arr[a].url + "' ><i class='"
            + arr[a].dom_class + "'></i><span class='menu-text'> "
            + arr[a].name + "</span></a></li>";

        }
        $(".sidebar-menu").html(dynamicMenu);
        if(location.href.indexOf('#')>0){
          var y = $('.sidebar-menu').find('li a');
          for (var i=0;i< y.length;i++){
            var z = y.eq(i).attr('href');
            if(getCookie('menuUrl') === z){
              $('.sidebar-menu').find('li').removeClass('active');
              y.eq(i).parents('li').addClass('active');
            }
          }

        }
      }
      else {
        $("#warning").text(result.data.msg);
      }

      clientSideInclude('.navbar-inner', './top.html');
      clientSideAppend('body', './notice.html');
      if (!getCookie('cmp')) $('.navbar-fixed-top').show();

      setTimeout(function () {
        noticeLoad();
        $('#top_user_name').text(_user.name);
      }, 10);

    }
  });


}

function otherSetActive(forThis) {
  document.cookie = 'menuUrl='+$(forThis).attr('href');
  var y = $('.sidebar-menu').find('li a');
  for (var i=0;i< y.length;i++){
    var z = y.eq(i).attr('href');
    if($(forThis).attr('href') === z){
      $('.sidebar-menu').find('li').removeClass('active');
      y.eq(i).parents('li').addClass('active');
    }
  }
}

function setActive(forThis) {
  $(forThis).parents('ul').find('li').removeClass('active');
  $(forThis).parents('li').addClass('active');
  document.title = $(forThis).text();
  document.cookie = 'menuUrl='+$(forThis).attr('href');
}

function noticeLoad() {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + 'events/notify',
    dataType: 'json',
    headers:{token:token},
    success: function (result) {
      var data = result.data;
      if (!isEmpty(data) && data.length > 0) {
        $('#notice_tally').text(data.length);
        $('#notice_tally').show();
        var html = "";
        for (var a = 0; a < data.length; a++) {
          html += "<tr>";
          html += "<td >" + data[a].type + "</td>";
          html += "<td >" + data[a].username + "</td>";
          html += "<td style='width: 30%'>" + data[a].detail + "</td>";
          html += "<td >" + data[a].app_name + "</td>";
          html += "<td >" + data[a].create_time + "</td>";
          html += "</tr>";
        }
        $('#notice_detail').html(html);
      }
    }
  });
}
function noticeShow() {
  $('#showNotifyModal').modal('show');
  $('#notice_tally').text(0);
  $('#notice_tally').hide();
  noticeRead();
}
function noticeRead() {
  $.ajax({
    type: 'post',
    url: _URL_INTERFACE + 'events/notify',
    dataType: 'json',
    headers: {token: token},
    success: function (result) {

    }
  });
}

function changeMenu(o, uri, topage) {
  if (isEmpty(topage)) topage = uri;
  if (topage.indexOf("?") < 0) {
    window.location.href = '/iCloud-v3' + topage + "?target=" + uri;
  } else {
    window.location.href = '/iCloud-v3' + topage + "&target=" + uri;
  }
}

function fnUserPower(uriArr, domArr) {
  var mo = _user.mo;
  var mourl= [];
  if (mo.length == 0) {
    for (var a = 0; a < uriArr.length; a++) {
      $(domArr[a]).css("display", "none");
    }

  } else {
    for (var a = 0; a < uriArr.length; a++) {
      var uri = uriArr[a];

      for (var b = 0; b < mo.length; b++) {
        mourl.push(mo[b].obj);
        if (uri == mo[b].obj) {
          $(domArr[a]).css("display", "inline-block");
          break;
        } else {
          $(domArr[a]).css("display", "none");
        }
      }
    }

  }

  if(mourl.indexOf("apps/scale") < 0 && mourl.indexOf("apps/restart") < 0 && mourl.indexOf("apps/autoscale/policy") < 0){
    $("#moreAppBtn").css("display","none");
  }else{
    $("#moreAppBtn").css("display","inline-block");
  }
}

function logout() {
  // $.ajax({
  //   type: 'POST',
  //   url: 'http://icloud.zj.chinamobile.com:6060/v3.0/logout4a',
  //   dataType: 'json',
  //   xhrFields: {
  //     withCredentials: true
  //   },
  //   crossDomain: true,
  //   success: function (result) {
  //     // console.log(result);
  //     window.sessionStorage.setItem('menuUrl','');
  //     location.href = './4ALogin.html';
  //   }
  // });
  document.cookie = 'menuUrl=""';
  location.href = './login.html';
  // history.replaceState(null,'','');
}

function subscribe(dest, handler) {
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + '/common/properties',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      "type": "mq"
    }),
    success: function (result) {
      if (result.msg == 'OK') {
        var host = result.data.host;
        var port = result.data.port;
        if (!isEmpty(host) && !isEmpty(port)) {
          var clientId = "dcos-" + "-mon-"
            + (Math.floor(Math.random() * 100000)) + "-"
            + (Math.floor(Math.random() * 100000));
          see(host, port, clientId, '', '', dest, handler);
        }
      }
    }
  });
}

function clientSideInclude(selector, url) {
  $.ajax({
    type: 'get',
    url: url,
    data: {},
    dataType: 'text',
    success: function (result) {
      //console.log(result);
      $(selector).html(result);
    }
  });
}
function clientSideAppend(selector, url) {
  $.ajax({
    type: 'get',
    url: url,
    data: {},
    dataType: 'text',
    success: function (result) {
      //console.log(result);
      $(selector).append(result);
    }
  });
}

function ignore() {

}

function isEmpty(o) {
  if (null == o || o == undefined || o == '' || o == 'null' || o == 'NULL' || o == 'undefined') {
    return true;
  }
  return false;
}

function getValue(val, defValue) {
  if (isEmpty(val)) {
    return defValue;
  }
  return val;
}

function openWin(type, url) {
  if ("1" == type) {
    self.location = self.location;
  } else if ("2" == type) {
    self.location = url;
  } else if ("3" == type) {
    window.open(url);
  }
  return false;
}

function disabledTrue(strArr) {
  if (isEmpty(strArr) || strArr.length > 0) {
    for (var a = 0; a < strArr.length; a++) {
      $(strArr[a]).attr("disabled", "disabled");
    }
  }
}
function disabledFalse(strArr) {
  if (isEmpty(strArr) || strArr.length > 0) {
    for (var a = 0; a < strArr.length; a++) {
      $(strArr[a]).attr("disabled", false);
    }
  }
}

/**
 * 解析URI参数
 * @param locationSearch
 * @returns
 * @author goofus
 */
function parseParams(uri) {
  var params = {};
  if (uri.indexOf("?") != -1) {
    uri = uri.substr(1);　//去掉?号
    var strs = uri.split("&");
    for (var i = 0; i < strs.length; i++) {
      params[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
    }
  }
  return params;
}

/**
 * 选择要管理的应用
 * @param appId
 */
function menuOnClick(appId, appName) {
  window.location.href = '/iCloud/view/viewAngle/application.html?appId=' + appId + '&appName=' + appName;
  window.event ? window.event.returnValue = false : evt.preventDefault();
}

