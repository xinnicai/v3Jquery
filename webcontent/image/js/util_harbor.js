/* 后端分页形式，页码形成函数
*/
$(document).ready(function (){
    fnGetTarget();
    fnGetCreateImgType();
    imageValidator('#creatimage');//新增镜像//
});
var project_id=getUrlParam("id");
function genPagination(count, startPage, pageSize, callBack) {
  if (!arguments[2]) pageSize = 5;

  if (!arguments[3]) callBack = "pageBtnClick";

  if (parseInt(count) < pageSize) {
    return "";
  }

  var end = parseInt(startPage) * pageSize;

  var pageSel = parseInt(startPage);
  var pageCnt = Math.ceil(count / pageSize);
  var pageSelPos = 1;
  var pageShowPos = "";
  if (parseInt(pageSel) < 5) {
    pageSelPos = parseInt(pageSel);
    pageShowPos = "before";
  }
  else if (parseInt(pageCnt) - parseInt(pageSel) < 4) {
    pageSelPos = parseInt(pageCnt) - parseInt(pageSel) + 7;
    pageShowPos = "after";
  }
  else {
    pageSelPos = 4;
    pageShowPos = "middle";
  }

  var pageBtnBuf = '';

  if (parseInt(pageSelPos) == 1) {
    pageBtnBuff = '      <li class="paginate_button previous" ><a name="pageBtnPrev" disabled="disabled">上一页</a></li> '
  }
  else {
    pageBtnBuff = '<li class="paginate_button previous" ><a name="pageBtnPrev" onclick="' + callBack + '(' + (startPage - 1) + ',' + pageSize + ')">上一页</a></li>'
  }


  if (pageCnt < 8) {

    for (i = 1; i <= pageCnt; i++) {
      pageStart = parseInt(i);
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn' + i + '" onclick="' + callBack + '(' + pageStart + ',' + pageSize + ')" >' + i + '</a></li>'
    }

  }
  else {
    if (pageShowPos == "before") {
      for (i = 1; i <= 5; i++) {
        pageStart = parseInt(i);
        pageBtnBuff += '<li class="paginate_button "><a name="pageBtn' + i + '" onclick="' + callBack + '(' + pageStart + ',' + pageSize + ')" >' + i + '</a></li>'
      }
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn6">...</a></li>';
      pageStart = 0;
      pageStart = parseInt(pageCnt);
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn7" onclick="' + callBack + '(' + pageStart + ',' + pageSize + ')" >' + pageCnt + '</a></li>';
    }
    if (pageShowPos == "after") {
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn1" onclick="' + callBack + '(1,' + pageSize + ')" >' + 1 + '</a></li>';
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn2" >...</a></li>';
      for (i = 3; i <= 7; i++) {
        pageNum = parseInt(pageCnt) + i - 7;
        pageBtnBuff += '<li class="paginate_button "><a name="pageBtn' + i + '" onclick="' + callBack + '(' + pageNum + ',' + pageSize + ')" >' + pageNum + '</a></li>'
      }
    }
    if (pageShowPos == "middle") {
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn1" onclick="' + callBack + '(1,' + pageSize + ')" >' + 1 + '</a></li>';
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn2" >...</a></li>';
      pageNum = parseInt(pageSel) - 2;
      for (i = 3; i <= 5; i++) {
        pageNum += 1;
        pageBtnBuff += '<li class="paginate_button "><a name="pageBtn' + i + '" onclick="' + callBack + '(' + pageNum + ',' + pageSize + ')" >' + pageNum + '</a></li>'
      }
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn6">...</a></li>';
      pageBtnBuff += '<li class="paginate_button "><a name="pageBtn7" onclick="' + callBack + '(' + pageCnt + ',' + pageSize + ')" >' + pageCnt + '</a></li>';
    }
  }


  if (parseInt(pageSelPos) == parseInt(pageCnt)) {
    pageBtnBuff += '      <li class="paginate_button next"><a name="pageBtnNext" disabled="disabled">下一页</a></li> '
  }
  else {
    pageStart = parseInt(pageSel) + 1;
    pageBtnBuff += '      <li class="paginate_button next"><a name="pageBtnNext" onclick="' + callBack + '(' + pageStart + ',' + pageSize + ')">下一页</a></li> '
  }

  pageSelStart = parseInt(pageSel);
  pageBtnBuff += '<input name="pageSelStart" type="hidden" value="' + pageSelStart + '"/>'

  if (end > count) {
    end = count;
  }

  buf = '  <div class="row DTTTFooter"> ' +
    '   <div class="col-sm-6"> ' +
    '    <div class="dataTables_info" name="searchable_info" role="status" aria-live="polite"> ' +
    '     Showing <span name="pageStart">' + ((parseInt(startPage - 1) * pageSize) + 1) + '</span> to <span name="pageEnd">' + end + '</span> of <span name="sumCount">' + count + '</span> entries ' +
    '    </div> ' +
    '   </div> ' +
    '   <div class="col-sm-6 text-align-right"> ' +
    '    <div class="dataTables_paginate paging_simple_numbers" name="searchable_paginate"> ' +
    '     <ul class="pagination"> ' +
    pageBtnBuff +
    '     </ul> ' +
    '    </div> ' +
    '   </div> ' +
    '  </div> '

  return buf;

}


function inBusy(content) {
  $('#tips span').html(content);
  $('#tips').modal('show');
}

function notBusy() {
  $('#tips').modal('hide');
}

function alertShow(title, content) {
  $('#MsgAlertTitle').html(title);
  $('#MsgAlertContent').html(content);
  $('#MsgAlertModal').modal('show');
}

function gotoProjPage(id, name, repo_cnt, owner_id) {
  var url = window.location.origin;
  url += "/iCloud-frontend-v3/webcontent/image/harborproject.html?id=" +
    trim(id) + "&name=" + trim(name) + "&repo_cnt=" +
    trim(repo_cnt) + "&owner_id=" + trim(owner_id);
  window.location.href = url;
}

function trim(str) {
  return str.replace(/\s+/g, "");
}

//请求项目列表的数据
function fnPaging(params) {
  var josn = JSON.parse(params.data);
  var pageSize = josn.pageSize;
  var pageNumber = josn.pageNumber;
    var url;
    var type;
    if(tableFlag=="table"){
        url=_URL_INTERFACE + "harbor/projects/search?page=" + pageNumber + "&pageSize=" + pageSize+'&condition=';
        type= 'GET';
    }else{
        url= _URL_INTERFACE + "harbor/projects/search?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt;
        type='GET';
    }
  $.ajax({
    type: type,
    url: url,
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({}),
    success: function (result) {

      var data = result.data;
      params.success({
        total: data.total,
        rows: data.rows
      });


    },
    error: function (resp) {
      alertShow("提示:", "网络异常，加载失败!")
    }
  });
}
var tableFlag
//初始化项目列表
function initProjectListTable() {
  tableFlag = "table";
  $("#project-list-table").bootstrapTable("destroy");
  $('#project-list-table').bootstrapTable({
    method: 'post',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
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
      field: 'name',
      title: '项目名称',
      align: 'left',
      formatter: function (value, row, index) {
        var content = '';
        if(row.project_id){
          content = '<a href="#/webcontent/image/harborproject.html?id=' + row.project_id + '&name=' + row.name +
          '&repo_cnt=' + row.repo_count + '&owner_id=' + row.owner_id + '">' +
          value + '</a>';
        }else{
          content = '<a href="javascript:void(0)">'+value+'</a>';
        }          
        return content;        
      }
    }, {
        field: 'business_name',
        title: '业务系统名称',
        align: 'center'
    }, {
      field: 'repo_count',
      title: '镜像数量',
      align: 'center'
    }, {
      field: 'current_user_role_id',
      title: '角色',
      align: 'center',
      formatter: function (value, row, index) {
        if (value == 1) {
          return "管理员";
        }
        else if (value == 2) {
          return "开发者";
        }
        else if (value == 3) {
          return "访客";
        }
      }
    }, {
      field: 'public',
      title: '是否公开',
      align: 'center',
      formatter: function (value, row, index) {
          if(row.project_id){
              if (value == 1) {
                  content = '<button type="button" class="btn btn-default navbar-btn btn-success btn-sm" ' +
                      ' onclick="updatePublic(\'' + row.project_id + '\',0,' + index + ');">是</button>'
                  return content;
              }
              else {
                  content = '<button name="6" type="button" class="btn btn-default navbar-btn btn-danger btn-sm" ' +
                      ' onclick="updatePublic(\'' + row.project_id + '\',1,' + index + ');">否</button>'
                  return content;
              }
          }else{
              if (value == 1) {
                  content = '<button type="button" class="btn btn-default navbar-btn btn-success btn-sm" ' +
                      ' onclick="updatePublic(\'' + row.project_id + '\',0,' + index + ');" disabled>是</button>'
                  return content;
              }
              else {
                  content = '<button name="6" type="button" class="btn btn-default navbar-btn btn-danger btn-sm" ' +
                      ' onclick="updatePublic(\'' + row.project_id + '\',1,' + index + ');" disabled>否</button>'
                  return content;
              }
          }
      }
    }, {
      field: 'update_time',
      title: '更新时间',
      align: 'center'
    }, {
      field: 'project_id',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
          // console.log(row);
          $("#deletename").text(row.business_name);
          if(value!==undefined){
              return '<a class="btn btn-sm" onclick="delProj(' + value + ')">' +
                  '<i class="fa fa-trash-o">删除</a>'
          }else{
              return'<i class="fa fa-ban"></i>'
          }

      }
    }]
  });
}
var txt;
//根据条件查询项目列表
function fnSearchProject(obj) {
    tableFlag = "search";
    txt = $(obj).val();
    $("#project-list-table").bootstrapTable("destroy");
    $('#project-list-table').bootstrapTable({
        method: 'post',
        //toolbar: '#toolbar',    //工具按钮用哪个容器
        striped: true,      //是否显示行间隔色
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
            field: 'name',
            title: '项目名称',
            align: 'left',
            formatter: function (value, row, index) {
              var content = '';
              if(row.project_id){
                content = '<a href="#/webcontent/image/harborproject.html?id=' + row.project_id + '&name=' + row.name +
                '&repo_cnt=' + row.repo_count + '&owner_id=' + row.owner_id + '">' +
                value + '</a>';
              }else{
                content = '<a href="javascript:void(0)">'+value+'</a>';
              }
                
              return content;
            }
        }, {
            field: 'business_name',
            title: '业务系统名称',
            align: 'center'
        }, {
            field: 'repo_count',
            title: '镜像数量',
            align: 'center'
        }, {
            field: 'current_user_role_id',
            title: '角色',
            align: 'center',
            formatter: function (value, row, index) {
                if (value == 1) {
                    return "管理员";
                }
                else if (value == 2) {
                    return "开发者";
                }
                else if (value == 3) {
                    return "访客";
                }
            }
        }, {
            field: 'public',
            title: '是否公开',
            align: 'center',
            formatter: function (value, row, index) {
                if (value == 1) {
                    content = '<button type="button" class="btn btn-default navbar-btn btn-success btn-sm" ' +
                        ' onclick="updatePublic(\'' + row.project_id + '\',0,' + index + ');">是</button>'
                    return content;
                }
                else {
                    content = '<button name="6" type="button" class="btn btn-default navbar-btn btn-danger btn-sm" ' +
                        ' onclick="updatePublic(\'' + row.project_id + '\',1,' + index + ');">否</button>'
                    return content;
                }
            }
        }, {
            field: 'update_time',
            title: '更新时间',
            align: 'center'
        }, {
            field: 'project_id',
            title: '操作',
            align: 'center',
            formatter: function (value, row, index) {
                if(value!==undefined){
                  return '<a class="btn btn-sm" onclick="delProj(' + value + ')">' +
                      '<i class="fa fa-trash-o">删除</a>'
                }else{
                  return'<i class="fa fa-ban"></i>'
                }

            }
        }]
    });


}
function initProjectInfo() {
  var id = getUrlParam("id");
  var name = getUrlParam("name");
  var repo_cnt = getUrlParam("repo_cnt");
  var owner_id = getUrlParam("owner_id");
  $('#info_projid').val(id);
  $('#title_projname').html(name);
  $('#header_projname').html(name);
  $('#info_repocnt').html(repo_cnt);
  var owner_names = new Array();
  owner_names[0] = "";
  owner_names[1] = "管理员";
  owner_names[2] = "开发者";
  owner_names[3] = "访客";
  $('#info_ownername').html(owner_names[owner_id])
}

function loadImageInfos(filter, page, pageSize) {
  if (!arguments[1]) page = 1;
  if (!arguments[2]) pageSize = 5;
  var proj_id = getUrlParam("id");
  var url = "harbor/images";
  if (!arguments[0]) {
    url += "?project_id=" + proj_id + "&page=" + page + "&pageSize=" + pageSize;
  }
  else {
    url += "?project_id=" + proj_id + "&imgname_filter=" + filter + "&page=" + page + "&pageSize=" + pageSize;
  }
  $.ajax({
    type: 'GET',
    url: _URL_INTERFACE + url,
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (resp) {
      // if(resp.msg=='OK'){
      var imgs_tags = resp.data.imgs_tags;
      var count = resp.data.count;
      var host = resp.data.host;
      dealImageInfos(count, page, pageSize, imgs_tags, host);

    },
    error: function (resp) {
      alertShow("提示:", "网络异常，加载失败!");
    }
  });
}

function showimageCreat(imgName) {
    fnGetCreateImgType();
    selectProject();
  $('#creatimage').modal('show');
    $("#myLargeModalLabel").text("创建镜像");
    $("#imageCreateButton").text("创建");
  $('#create_img_name').val(imgName.split('/',2)[1]);
  $("#select_project").val(imgName.split('/',1)[0]);
  console.log($("#select_project").val());
  $('#create_img_name').attr('disabled',true);
  $('#select_project').attr('disabled',true);
    $("#uploadfilebtn").empty();
    $("#uploadfilejb").empty();
    fnupload_jb();
    fnupload();

}

function fnGetCreateImgType() {
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + "apps/images?type=common",
        headers: {
            "token": token
        },
        Type: 'json',
        success: function (result) {
            $("#create_image_si").empty();
            var data = result.data.repos;
            var _html = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    _html += '<option value="' + data[i] + '">' + data[i] + '</option>';
                }
            }
            $("#create_image_si").append(_html);
            fnGetCreateImgVer();
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
function fnGetCreateImgVer(){
    var image=$("#create_image_si").val();
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
            editor1='FROM '+$("#comImgVer").val();
            // $("#create_img_dockerfile").val(editor1);
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
function selectProject(){
    var target = $("select[name='select_project']").empty();

    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"harbor/projects",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data.rows;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    target.append("<option value='"+data[i].name+"'>"+data[i].name+"</option>");
                }
            }
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href ='#/login.html';
            }else{
                //alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function dealImageInfos(count, page, pageSize, imgs, host) {
  var images_content = "";

  var img_name = "";
  for (var i = 0; i < imgs.length; i++) {
    img_name = imgs[i].image_name;
    var image_title = '<div class="panel-heading bg-whitesmoke" style="border-bottom:1px solid #ddd"> ' +
      '	<li class="lightcarbon" style="list-style: none;"> ' +
      '		<i class="fa fa-book padding-right-10"></i> ' +
      '		<span class="padding-right-10">' + img_name + '</span> ' +
      '		<span class="badge" style="margin-top:-5px"> ' +
      '		  <a href="javascript:toggle_version_show(\'' + img_name + '\');">' +
      imgs[i].tags.length + '</a> ' +
      '		</span>'+
        // '<a href="javascript:void(0)" onclick="showimageCreat('+'\''+img_name+'\''+')" style="float: right">创建新版本</a> ' +
      '	</li> ' +
      '</div> '
    var itags = imgs[i].tags;
    var tags = '<div class="panel-body" name="' + img_name + '" style="display:none"> ' +
      '	<table class="table table-hover"> ' +
      '      <thead> ' +
      '        <tr> ' +
      '            <th>版本号</th> ' +
      '            <th>pull命令</th> ' +
      '            <th>操作</th> ' +
      '        </tr> ' +
      '      </thead> ' +
      '      <tbody> '

    for (j = 0; j < itags.length; j++) {
      tags += '         <tr> ' +
        '           <td>' + itags[j] + '</td> ' +
        '           <td>docker pull ' + host + '/' + img_name + ':' + itags[j] + '</td> ' +
        '           <td><a class="btn btn-sm btn-default" href="javascript:fnUpdateImgInfo(\'' + host + '/' + img_name + ':' + itags[j] + '\'' + ')"><i class="fa fa-plus">创建镜像</i></a>' +
        '           <a class="btn btn-sm btn-default" href="javascript:fnGetApplicationList(\'' + host + '/' + img_name + '\'' + ',' + '\'' + itags[j] + '\'' + ')"><i class="fa fa-file-o">查看应用</i></a>' +
        '           <a class="btn btn-default btn-sm" href="javascript:delEdgeImageVer(\'' + host + '/' + img_name + '\'' + ',' + '\'' + itags[j] + '\'' + ')"><i class="fa fa-trash-o">删除</i></a></td> '+
        '         </tr> '

    }

    tags += '      </tbody> ' +
      '    </table> ' +
      '</div> '


    images_content += image_title + tags;

  }

  pagination = genPagination(count, page, pageSize, "clickImagePage");
  $("div#images-infos").attr("style", "display:none");
  $("div#images-infos").empty();
  $("div#images-infos").append(images_content);
  $("div#images-infos").append(pagination);
  $("div#images-infos").attr("style", "");
}

function fnNewModal() {
  $("#creatApplition").modal('show');
}


//获取项目的应用列表
function fnGetApplicationList (name,version) {
  var image_url=name+':'+version;
  $("#searchapplication").modal("show");
  $("#searchapplicationtable").bootstrapTable('destroy');  //销毁表格 --在初始化table之前，要将table销毁，否则会保留上次加载的内容
  $('#searchapplicationtable').bootstrapTable({

    method: 'GET',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    ajaxOptions:{headers: {
      "token": token
    }},
    // pagination: true,     //是否显示分页（*）
    sortable: false,      //是否启用排序
    // sortOrder: "asc",     //排序方式
    // pageNumber: 1,      //初始化加载第一页，默认第一页
    // pageSize: 10,      //每页的记录行数（*）
    pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
    url: _URL_INTERFACE + "apps/list?image_url="+image_url,//这个接口需要处理bootstrap table传递的固定参数
    queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                         // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
    /*queryParams: policyListParams,*///前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
    sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
    //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    //showColumns: true, //是否显示所有的列
    //showRefresh: true, //是否显示刷新按钮
    minimumCountColumns: 2,    //最少允许的列数
    clickToSelect: true,    //是否启用点击选中行
    searchOnEnterKey: true,
    columns: [{
      field: 'sys_name',
      title: '系统名称',
      align: 'center'
    }, {
      field: 'app_name',
      title: '应用名称',
      align: 'center'
    }, {
      field: 'status',
      title: '状态',
      align: 'center',
      formatter: function (value, row, index) {
        if(value=='1'){
          return '<span class="label label-success label-sm">已发布</span>';
        }else if(value=='2'){
          return '<span class="label label-warning label-sm">已暂停</span>';
        }else if(value=='0'){
          return '<span class="label label-default label-sm">未发布</span>';
        }else if(value=='3'){
          return '<span class="label label-danger label-sm">发布失败</span>';
        }
      }
    }, {
      field: 'app_id',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
        var content = "";        
        content += '<a class="btn btn-default btn-sm margin-right-5" onclick="fnGotoEditApp(\''+value+'\')" ><i class="fa  fa-edit"></i>编辑</a>'
        
        return content;
      }
    }]
  });  
}

//转到编辑应用页面
function fnGotoEditApp (app_id) {
  $(".modal-backdrop").remove();
  $("#searchapplication").modal("hide");
  window.location.href="#/webcontent/Application/updateApplication.html?app_id="+app_id;  
}

function delEdgeImageVer(name, version) {
  var m = $('#DelAlertModal1');
  $(m).modal('show');
  $(m).find('#delete-btn').on("click", function () {
    $.ajax({
      type: 'DELETE',
      url: _URL_INTERFACE + 'harbor/images',
      headers: {
        "token": token
      },
      dataType: 'json',
      data: JSON.stringify({
        "image": name,
        "tag": version
      }),
        success:function (result) {
            $('#successModal').modal('show');
            $('#tipsSpan').text('镜像删除成功！！');
            loadImageInfos();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $('#failmodal').modal('show');
                $('#failtitle').text('镜像删除失败！！')
                $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }

    });

  });
}

function clickImagePage(page, pageSize) {
  var pageSel = $('#images-infos-page').val();
  if (page == pageSel) {
    return;
  }
  if (parseInt(page) < 1) {
    page = 1;
  }

  loadImageInfos("", page)
  $('#images-infos-page').val(page);
}

function toggle_version_show(img_name) {
  var tags = $('div[name="' + img_name + '"]');
  if (tags.attr("style") == "display:none") {
    tags.attr("style", "");
  } else {
    tags.attr("style", "display:none");
  }
}


/*function policyListParams(){
    var proj_id = $('#info_projid').val();
	return {"_uri": "harbor/projects/policies?project_id="+proj_id,
            "_method": "GET"}
}*/

function loadPolicyInfos() {
  var proj_id = $('#info_projid').val();
  $('#policy-list-table').bootstrapTable({

    method: 'GET',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    ajaxOptions:{headers: {
      "token": token
    }},
    pagination: true,     //是否显示分页（*）
    sortable: false,      //是否启用排序
    sortOrder: "asc",     //排序方式
    pageNumber: 1,      //初始化加载第一页，默认第一页
    pageSize: 10,      //每页的记录行数（*）
    pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
    url: _URL_INTERFACE + "harbor/projects/policies?project_id=" + proj_id,//这个接口需要处理bootstrap table传递的固定参数
    queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                         // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
    /*queryParams: policyListParams,*///前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
    sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
    //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    //showColumns: true, //是否显示所有的列
    //showRefresh: true, //是否显示刷新按钮
    minimumCountColumns: 2,    //最少允许的列数
    clickToSelect: true,    //是否启用点击选中行
    searchOnEnterKey: true,
    columns: [{
      field: 'name',
      title: '名称',
      align: 'center'
    }, {
      field: 'description',
      title: '描述',
      align: 'center'
    }, {
      field: 'target_name',
      title: '目标',
      align: 'center'
    }, {
      field: 'start_time',
      title: '上次起始时间',
      align: 'center'
    }, {
      field: 'enabled',
      title: '活动状态',
      align: 'center',
      formatter: function (value, row, index) {
        if (value == 1) {
          return '<span class="label label-sm label-success">已启用</span>';
        }
        else {
          return '<span class="label label-sm label-danger">已停用</span>';
        }
      }
    }, {
      field: 'id',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
        var content = "";
        if (row.enabled == 1) {
          content += '<a class="btn btn-default btn-sm margin-right-5" onclick="fnstopPilicy('+row.id+')"><i class="fa   fa-minus-square-o"></i>停用</a>'
        }
        else {
          content += '<a class="btn btn-default btn-sm margin-right-5" onclick="fnstartPilicy('+row.id+')"><i class="fa  fa-play-circle-o"></i>启用</a>'
        }
        content += '<a class="btn btn-default btn-sm margin-right-5" onclick="fnUpdateinfo('+row.id+')" ><i class="fa  fa-edit"></i>修改</a>'
        content += '<a class="btn btn-default btn-sm margin-right-5" onclick="fnDeletePilicy('+row.id+')"><i class="fa  fa-trash-o"></i>删除</a>'

        return content;
      }
    }],
    pagination: true
  });

}
 function fnstartPilicy(id){
  var policy_id=id;
     $.ajax({
         type: 'PUT',
         url: _URL_INTERFACE+"harbor/policies/enablement",
         dataType: 'json',
         headers: {
             "token": token
         },
         data:JSON.stringify({
             "policy_id": policy_id,
             "enabled": 1
         }),
         success:function (result) {
             $('#successModal').modal('show');
             $('#tipsSpan').text('策略启用成功！');
             $("#policy-list-table").bootstrapTable("refresh");
         },
         error:function (XMLHttpRequest, textStatus, errorThrown) {
             if(XMLHttpRequest.status === 401){
                 window.location.href = '#/login.html';
             }else{
                 $("#failmodal").modal("show");
                 $("#failtitle").text("策略启用失败！");
                 $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
                 //alert('添加失败！（例子）');//其他操作
             }
         }
     });
 }
function fnstopPilicy(id){
    var policy_id=id;
    $.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+"harbor/policies/enablement",
        dataType: 'json',
        headers: {
            "token": token
        },
        data:JSON.stringify({
            "policy_id": policy_id,
            "enabled": 0
        }),
        success:function (result) {
            $('#successModal').modal('show');
            $("#tipsSpan").text("策略停止成功！");
            $("#policy-list-table").bootstrapTable("refresh");
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                //alert('添加失败！（例子）');//其他操作
                $("#failmodal").modal("show");
                $("#failtitle").text("策略停止失败！");
                $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}
function fnDeletePilicy(id){
    var policy_id=id;
    $.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE+"harbor/projects/policies",
        dataType: 'json',
        headers: {
            "token": token
        },
        data:JSON.stringify({
            "policy_id": policy_id,

        }),
        success:function (result) {
            $('#successModal').modal('show');
            $("#tipsSpan").text("策略删除成功！");
            $("#policy-list-table").bootstrapTable("refresh");
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                //alert('添加失败！（例子）');//其他操作
                $("#failmodal").modal("show");
                $("#failtitle").text("策略删除失败！");
                $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}
var policy_id;
function fnUpdateinfo(id){
    $("#myModalLabel1").text("编辑策略");
    $("#addPolicy").text("编辑");
    var proj_id = $('#info_projid').val();
    $('#ADDtactics').modal('show');
    policy_id=id;
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"harbor/projects/policies?project_id=" + proj_id+"&policy_id="+policy_id,
        dataType: 'json',
        headers: {
            "token": token
        },
        success:function (result) {
            var data=result.data;
            $("input[name='policy_name']").val(data.name);
            $("#policy_desc").text(data.description);
            if(data.enabled==1){
              $("#is_enabled").attr("checked",true);
            }else{
              $("#is_enabled").attr("checked",false);
            }
            $('#target_name option:selected').text(data.target_name);
            var target = $('#target_name option:selected').text();
            fnFullInfoUpdate(target);
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
function fnFullInfoUpdate(target){
    var data;
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + 'harbor/targets?target_name='+target,
        headers: {
            "token": token
        },
        dataType: 'json',
        success: function (result) {
            data=result.data;
                    $("input[name='target_url']").val(data.endpoint);
                    $("input[name='target_username']").val(data.username);
                    $("input[name='target_password']").val(data.password);
                    $("input[name='target_url']").next("span").text(data.id);


        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {

                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });

}

function fnSelectMethod(){
  var method=$("#addPolicy").text();
  if(method=="新增"){
      fnAddPolicy();
  }else{
      fnUpdatePilicy();
  }
}

/*function memberListParams(){
    var proj_id = $('#info_projid').val();
	return {"_uri": "harbor/projects/members?project_id="+proj_id,
            "_method": "GET"}
}*/

function loadMemberInfos() {
  var proj_id = $('#info_projid').val();
  $('#member-list-table').bootstrapTable({
    method: 'GET',
    //toolbar: '#toolbar',    //工具按钮用哪个容器
    striped: true,      //是否显示行间隔色
    cache: false,      //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
    ajaxOptions: {
      headers: {
        "token": token
      }
    },
    pagination: true,     //是否显示分页（*）
    sortable: false,      //是否启用排序
    sortOrder: "asc",     //排序方式
    pageNumber: 1,      //初始化加载第一页，默认第一页
    pageSize: 10,      //每页的记录行数（*）
    pageList: [10, 25, 50, 100],  //可供选择的每页的行数（*）
    url: _URL_INTERFACE + "harbor/projects/members?project_id=" + proj_id,//这个接口需要处理bootstrap table传递的固定参数
    queryParamsType: '', //默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort
                         // 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
    /*queryParams: memberListParams,*///前端调用服务时，会默认传递上边提到的参数，如果需要添加自定义参数，可以自定义一个函数返回请求参数
    sidePagination: "client",   //分页方式：client客户端分页，server服务端分页（*）
    //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
    strictSearch: true,
    //showColumns: true, //是否显示所有的列
    //showRefresh: true, //是否显示刷新按钮
    minimumCountColumns: 2,    //最少允许的列数
    clickToSelect: true,    //是否启用点击选中行
    searchOnEnterKey: true,
    columns: [{
      field: 'username',
      title: '用户',
      align: 'center'
    }, {
      field: 'role_id',
      title: '角色',
      align: 'center',
      formatter: function (value, row, index) {
        if (value == 1) {
          return "管理员";
        }
        else if (value == 2) {
          return "开发者";
        }
        else if (value == 3) {
          return "访客";
        }
      }
    }, {
      field: 'user_id',
      title: '操作',
      align: 'center',
      formatter: function (value, row, index) {
        if (row.current_user == value) {
          return '<a href="#"><span class="glyphicon glyphicon-ban-circle gray"></span></a>';
        }
        else {
          var content = '<a class="btn btn-default btn-sm" ' +
            'href="javascript:updateMember(' + value + ',' + row.role_id + ', \'' + row.username + '\');">' +
            '<i class="fa  fa-edit"></i>修改</a>';
          content += '<a class="btn btn-default btn-sm" ' +
            'href="javascript:delMember(' + value + ', \'' + row.username + '\');">' +
            '<i class="fa  fa-trash-o"></i>删除</a>';
          return content;
        }
      }
    }],
    pagination: true
  });

}

function bindTabsBtns() {
  $('a[href="#tab1"]').on("click", function () {
    loadImageInfos();
  });
  $('a[href="#tab2"]').on("click", function () {
    loadPolicyInfos();
  });
  $('a[href="#tab3"]').on("click", function () {
    loadMemberInfos()
  });
}

function createProject() {
  var name = $('#create-proj-name').val();
  var public = 0;
  if ($('#create-proj-public').is(':checked')) {
    public = 1;
  }
  inBusy("项目创建中,请稍候...");
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'harbor/projects',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({
      "name": name,
      "public": public
    }),
    success: function (result) {
      notBusy();
        $('#successModal').modal('show');
        $('#tipsSpan').text('项目创建成功！');
      $('#project-list-table').bootstrapTable('refresh');


    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      notBusy();
        $("#failmodal").modal("show");
        $("#failtitle").text("项目创建异常，请检查网络状态!");
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      $('#project-list-table').bootstrapTable('refresh');
    }
  });
}

function updatePublic(proj_id, public, index) {
  var id = parseInt(proj_id);
  $.ajax({
    type: 'PUT',
    url: _URL_INTERFACE + 'harbor/projects',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({

      "project_id": id,
      "public": public
    }),
    success: function (result) {

      t = $('#project-list-table tr')[index + 1];
      td = $(t).find('td')[4];
      if (public == 1) {
        content = '<button type="button" class="btn btn-default navbar-btn btn-success btn-sm" ' +
          ' onclick="updatePublic(\'' + id + '\',0,' + index + ');">是</button>'
        $(td).html(content);
      }
      else {
        content = '<button name="6" type="button" class="btn btn-default navbar-btn btn-danger btn-sm" ' +
          ' onclick="updatePublic(\'' + id + '\',1,' + index + ');">否</button>'
        $(td).html(content);
      }


    }
  });
}

function bindCreateProjBtn() {
  $('#create-proj-btn').on("click", function () {
    createProject();
  });
}

function delProj(proj_id) {
  var m = $('#DelAlertModal')
  $(m).modal('show');
  $(m).find('#delete-btn').on("click", function () {
    inBusy("项目删除中,请稍候...");
    $.ajax({
      type: 'DELETE',
      url: _URL_INTERFACE + 'harbor/projects',
      headers: {
        "token": token
      },
      dataType: 'json',
      data: JSON.stringify({

        "project_id": proj_id
      }),
      success: function (result) {
        notBusy();
          $('#successModal').modal('show');
          $('#tipsSpan').text('项目删除成功！');
        $('#project-list-table').bootstrapTable('refresh');


      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notBusy();
          $("#failmodal").modal("show");
          $("#failtitle").text("删除项目失败!");
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
        $('#project-list-table').bootstrapTable('refresh');
      }
    });
  });
}

function addUser2Proj() {
  var proj_id = $('#info_projid').val();
  var username = $('input[name="user_name"]').val();
  var role_id = $('input[name="role_select"]:checked').val();
  $.ajax({
    type: 'POST',
    url: _URL_INTERFACE + 'harbor/projects/members',
    headers: {
      "token": token
    },
    dataType: 'json',
    data: JSON.stringify({


      "project_id": parseInt(proj_id),
      "membername": username,
      "role": parseInt(role_id)
    }),
    success: function (result) {
        $('#successModal').modal('show');
        $('#tipsSpan').text('用户添加成功！');
      $('#member-list-table').bootstrapTable('refresh');


    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("#failmodal").modal("show");
        $("#failtitle").text("用户添加异常,请检查网络状态!");
        $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
      $('#member-list-table').bootstrapTable('refresh');
    }
  });
}

function updateMember(user_id, role_id, name) {
  var m = $('#UpdateMemberModal')
  $(m).find('input[name="update-user-name"]').val(name);
  var role_sel = $(m).find('input[name="update-role-select"]')[role_id - 1];
  $(role_sel).attr("checked", true);
  $(m).modal('show');
  $(m).find('#update-user-2proj').on("click", function () {
    var proj_id = $('#info_projid').val();
    var role_id = $('input[name="update-role-select"]:checked').val();
    $.ajax({
      type: 'PUT',
      url: _URL_INTERFACE + 'harbor/projects/members',
      headers: {
        "token": token
      },
      dataType: 'json',
      data: JSON.stringify({


        "project_id": parseInt(proj_id),
        "user_id": user_id,
        "role_id": parseInt(role_id)
      }),
      success: function (result) {
          $('#successModal').modal('show');
          $('#tipsSpan').text('用户修改成功！');
        $('#member-list-table').bootstrapTable('refresh');


      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          $("#failmodal").modal("show");
          $("#failtitle").text("用户修改异常,请检查网络状态!");
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
        $('#member-list-table').bootstrapTable('refresh');
      }
    });

  });
}

function delMember(user_id, username) {
  var m = $('#DelAlertModal')
  $(m).find('#DelAlertTitle').html("删除成员确认");
  $(m).find('#DelAlertMsg').html("是否准备删除成员:" + username + " ?");
  $(m).modal('show');
  $(m).find('#delete-btn').on("click", function () {
    var proj_id = $('#info_projid').val();
    $.ajax({
      type: 'DELETE',
      url: _URL_INTERFACE + 'harbor/projects/members',
      headers: {
        "token": token
      },
      dataType: 'json',
      data: JSON.stringify({
        "project_id": parseInt(proj_id),
        "user_id": user_id
      }),
      success: function (result) {
          $('#successModal').modal('show');
          $('#tipsSpan').text('删除用户成功！');
        $('#member-list-table').bootstrapTable('refresh');


      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
          $("#failmodal").modal("show");
          $("#failtitle").text("删除用户异常,请检查网络状态!");
          $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
        $('#member-list-table').bootstrapTable('refresh');
      }
    });

  });
}

function bindProjOpsBtns() {
  $('#add-user-2proj').on("click", function () {
    addUser2Proj();
  });
}
function fnGetTarget(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + 'harbor/targets',
        headers: {
            "token": token
        },
        dataType: 'json',
        success: function (result) {
            var data=result.data;
            $("#target_name").empty();
            var html='';
            for(var i=0;i<data.length;i++){
                html+='<option value="'+data[i].id+'">'+data[i].name+'</option>';
            }
            $("#target_name").append(html);
            $("input[name='target_url']").val(data[0].endpoint);
            $("input[name='target_username']").val(data[0].username);
            $("input[name='target_password']").val(data[0].password);
            $("input[name='target_url']").next("span").text(data[0].id);


        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {

                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });
}
function fnselect(){

    if($("input[name='is_new_target']").is(':checked'))
    {
        $("input[name='target_url']").val("");
        $("input[name='target_url']").attr("disabled",false);
        $("input[name='target_username']").val("");
        $("input[name='target_username']").attr("disabled",false);
        $("input[name='target_password']").val("");
        $("input[name='target_password']").attr("disabled",false);
    }else{

        $("input[name='target_url']").attr("disabled",true);
        $("input[name='target_username']").attr("disabled",true);
        $("input[name='target_password']").attr("disabled",true);
    }
}

function fnFullInfo(){
  var target = $('#target_name option:selected').text();
  var data;
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + 'harbor/targets',
        headers: {
            "token": token
        },
        dataType: 'json',
        success: function (result) {
            data=result.data;
            for(var i=0;i<data.length;i++){
              if(data[i].name==target){
                  $("input[name='target_url']").val(data[i].endpoint);
                  $("input[name='target_username']").val(data[i].username);
                  $("input[name='target_password']").val(data[i].password);
                  $("input[name='target_url']").next("span").text(data[i].id);
              }
            }

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {

                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });

}

function fnPingTest(){
    $.ajax({
        type: 'post',
        url: _URL_INTERFACE + 'harbor/targets/ping',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "target_id":$("input[name='target_url']").next("span").text()
        }),
        success: function (result) {
          if(result.msg=="ok"){
              $("#ping_target").next('p').empty();
              var html='<span class="green">连接测试成功！</span>';
              $("#ping_target").next('p').append(html);
          }

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {
                    $("#ping_target").next('p').empty();
                    var html='<span class="red">连接测试失败！</span>';
                    $("#ping_target").next('p').append(html);
                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });
}

function fnAddPolicy(){
    var policy_name=$("input[name='policy_name']").val();
    var policy_enabled;
    var is_new_target;
    var target_id;
    if($("#is_enabled").is(':checked')){
        policy_enabled=1;
    }else{
        policy_enabled=0;
    }
    if($("input[name='is_new_target']").is(':checked')){
        is_new_target=1;
        target_id=-1;
    }else{
        is_new_target=0;
        target_id=parseInt($("input[name='target_url']").next("span").text());
    }
    if(is_new_target==1){

    }else{

    }
    $.ajax({
        type: 'post',
        url: _URL_INTERFACE + 'harbor/projects/policies',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "project_id": parseInt(project_id),
            "policy_name": policy_name,
            "policy_desc": $("#policy_desc").val(),
            "policy_enabled": policy_enabled,
            "is_new_target":is_new_target,
            "target_id":target_id,
            "target_name": $('#target_name option:selected').text(),
            "target_url":$("input[name='target_url']").val(),
            "target_username": $("input[name='target_username']").val(),
            "target_password": $("input[name='target_password']").val(),
        }),
        success: function (result) {
            $('#successModal').modal('show');
           $("#tipsSpan").text("新增策略成功！");
           $("#policy-list-table").bootstrapTable("refresh");

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {
                    $("#failmodal").modal("show");
                    $("#failtitle").text("新增策略失败！");
                    $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });
}

function fnUpdatePilicy() {
    var policy_name=$("input[name='policy_name']").val();
    var policy_enabled;
    var is_new_target;
    var target_id;
    if($("#is_enabled").is(':checked')){
        policy_enabled=1;
    }else{
        policy_enabled=0;
    }
    if($("input[name='is_new_target']").is(':checked')){
        is_new_target=1;
        target_id=-1;
    }else{
        is_new_target=0;
        target_id=parseInt($("input[name='target_url']").next("span").text());
    }
    if(is_new_target==1){

    }else{

    }
    $.ajax({
        type: 'PUT',
        url: _URL_INTERFACE + 'harbor/projects/policies',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "policy_id":policy_id,
            "project_id": parseInt(project_id),
            "policy_name": policy_name,
            "policy_desc": $("#policy_desc").val(),
            "policy_enabled": policy_enabled,
            "is_new_target":is_new_target,
            "target_id":target_id,
            "target_name": $('#target_name option:selected').text(),
            "target_url":$("input[name='target_url']").val(),
            "target_username": $("input[name='target_username']").val(),
            "target_password": $("input[name='target_password']").val(),
        }),
        success: function (result) {
            $('#successModal').modal('show');
            $("#tipsSpan").text("修改策略成功！");
            $("#policy-list-table").bootstrapTable("refresh");

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                {
                    $("#failmodal").modal("show");
                    $("#failtitle").text("修改策略失败！");
                    $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg);
                    // commonAlert("#warningPwd", "#warningPwdBlock", "操作失败");
                }
            }
        }
    });
}

function imageValidator(obj){
    $(obj).bootstrapValidator({
        // Only disabled elements are excluded
        // The invisible elements belonging to inactive tabs must be validated
        excluded: [':disabled', ':hidden', ':not(:visible)'],
        feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon ',
            validating: 'glyphicon'
        },
        submitHandler: function (validator, form, submitButton) {
            if(obj=='#creatimage'){//flag=true;
                $("#creatimage").modal('hide');
                createImage();
                // $("#creatimage").data('bootstrapValidator').resetForm();
                // $('#creatimage').bootstrapValidator("resetForm",true);
                // createImage();
            }else{
            //     $("#updateimage").modal('hide');
            //     // $("#creatimage").data('bootstrapValidator').resetForm();
            //     $('#creatimage').bootstrapValidator("resetForm",true);
            }
        },
        fields: {
            create_img_name: {
                validators: {
                    notEmpty: {
                        message: '镜像名称不能为空'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z\u4e00-\u9fa5_]+$/,
                        message: '用户名只能包含大写、小写、汉字'
                    }
                }
            },
            select_project: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            },
            create_img_dockerfile: {
                validators: {
                    notEmpty: {
                        message: 'dockerfile不能为空'
                    }

                }
            }
        }
    });
}
//没改之前的创建镜像
function createImage() {
    var proj = $('#create_img_proj').find('option:selected').val();
    // var repo = $('#repo_host').val();
    var name = $('#create_img_name').val();
    var base_image = $("#comImgVer").val();
    // var imgPath = trim(repo) + "/" + trim(proj) + "/" + trim(imgName);
    // var environment = $('#create_img_environment').find('option:selected').val();
    var dockerfile = $('#create_img_dockerfile').val();
    var description = $('#create_img_info').val();
    var config_info = $('#create_img_config').val();
    inBusy("镜像正在创建，请稍候...");
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE + 'harborimages',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "name": name,
            "base_image": base_image,
            "dockerfile": dockerfile,
            "description": description,
            "config_info": config_info,
            "package_urls": packageUrls,
            'business_sysdomain':$("#select_project").val()
        }), success: function (result) {
            setTime(result.data.img_name);
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                notBusy();
              /*alertShow("提示:", "镜像创建异常，请检查网络状态!");*/
                $("#failmodal").modal('show');
                $("#failTitle").text('镜像创建失败！！');
                $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg);
                $('#image-list-table').bootstrapTable('refresh');
            }
        }
    });
}
var timeout=false,times=0;
function setTime(name)
{
    if(timeout){
        // fnGetNewImg();
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
            $("#failInfo").empty();
            $("#failButton").attr('onclick',"$('#updateimage').modal('show')");
            if(status!='1'){
                timeout=true;
                $('#successModal').modal('hide');
                if(status=='0'){
                    notBusy();
                    $('#successModal').modal('show');
                    $("#tipsSpan").text('镜像创建成功');
                    loadImageInfos();
                }else{
                    notBusy();
                    $("#failmodal").modal('show');
                    $("#failTitle").text('镜像创建失败');
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
                $("#failTitle").text('镜像创建失败');
                $("#failSpan").append('<p>创建超时,请联系管理员</p>');
                $("#failButton").attr('onclick',"");
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
var img_name_update;
function fnUpdateImgInfo(name){
  $("#updateimage").modal("show");
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + "harborimages?image_name="+name,
        headers: {
            "token": token
        },
        //async:false,
        dataType: 'json',
        success: function (result) {
            var data=result.data;
            $("#select_project_U").val(data.sys_code);
            $("#create_img_name_u").val(data.img_name.split("/")[2].split(":")[0]);
            if(data.docfile==""){
                $("#create_img_dockerfile").text(editor1);
            }else{
                $("#create_img_dockerfile").text(data.docfile);
            }
            $("#create_img_info_u").text(data.description);
            $("#create_img_config_u").text(data.config_info);
            img_name_update=data.img_name;

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
function fnUpdateImage(){
  $("#updateimage").modal("hide");
    inBusy("镜像正在创建，请稍候...");
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE + "harborimages",
        headers: {
            "token": token
        },
        //async:false,
        dataType: 'json',
        data:JSON.stringify({
            "name": $("#create_img_name_u").val(),
            "base_image": $("#comImgVer").val(),
            "package_urls": packageUrls,
            'business_sysdomain':$("#select_project_U").val(),
            "dockerfile":$("#create_img_dockerfile").val(),
            "description":$("#create_img_info_u").val(),
            "config_info":$("#create_img_config_u").val()

        }),
        success: function (result) {
            setTime(result.data.img_name);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '#/login.html';
            } else {
                notBusy();
                $("#failmodal").modal('show');
                $("#failTitle").text('镜像创建失败！！');
                $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
    });
}
function fnGetNewImg(name){
  var proname=name.split("/")[1];
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE + "harbor/images?project_name="+proname,
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success: function (result) {
            //$("#add_image").hide();
            var data=result.data;

            //$("#showaddimg").show();
            //$("#show_img").val();
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
