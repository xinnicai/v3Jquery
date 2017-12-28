/**
 * Created by cj on 2017/8/16.
 */

$(document).ready(function (){
    fngetData();//获取图表
    Selectobj();
    menuValidator('#creatDataModal');//新增菜单//
    menuValidator('#updateDataModal');//更新菜单//
});
//***********get表格*************//
function fngetData(){
    $('#editabledatatable').bootstrapTable({
        url: _URL_INTERFACE+"platform/group", method: 'GET', cache: false,
        ajaxOptions:{headers: {
            "token": token
        }}, search: true,dataType: 'json',
        pagination: true, pageSize: 10,//data:"result.data",
        uniqueId: 'id',
        toolbar:'#btn-div',
        columns: [ {
            title: '权限组名称', field: 'name', sortable: true, searchable: true
        }, {
            title: '描述', field: 'description', sortable: true, searchable: true
        }
        , {
                title: '操作', field: 'id',formatter: function (val, row, idx) {
                    if(row['name']=='超级管理员' || row['name']=='应用管理员' ||row['name']=='应用租户' ){
                        return '<i class="fa fa-ban"></i>';
                    }else{
                        return '<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
                    }


                }
            }
            ],
        responseHandler: function (result) {
            //if (result.msg=='OK') {
            return result.data;
            // } else {
            //   return [];
            // }
        },
        onSearch: function (text) {
            console.info(text);
        },
        onLoadSuccess: function (data) {
        },
        onDblClickRow:function(data){console.log(data);
            $("#updateDataModal").modal('show');
            $("#roledes_U").val(data.description);//value1
            $("#rolename_U").val(data.name);//value2
            var group= JSON.parse(data.groupmo_ids);
            $("#modal_object1").selectpicker("val",group);
            $("#basedataid").text(data.id);
            $("#createUser1").attr("disabled",false);
        }
    });
}
//*****************验证 提交表单*************//
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
            if(obj=='#creatDataModal'){
                createPower();
            }else{
                fnUpdatePower();
            }
        },
        fields: {
//    	dataType: {
//            validators: {
//                notEmpty: {
//                    message: '菜单名称不能为空'
//                }
//            }
//        },
            rolename: {
                validators: {
                    notEmpty: {
                        message: '权限组名不能为空'
                    }
                }
            },
            modal_object:{
                validators: {
                    notEmpty: {
                        message: '权限不能为空'
                    }
                }
            }
        }
    });
}
//***********创建权限组*************//
function createPower(){
    var name=$("#rolename").val();
    var description=$("#roledes").val();
    var power=$("#modal_object").selectpicker('val');
    $.ajax({
        type: 'POST',
        url: _URL_INTERFACE+"platform/group",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "name":name,
            "description":description,
            "groupmo_ids":power

        }),
        success:function (result) {
            $("#creatDataModal").modal('hide');
            $("#successmodal").modal('show');
            $("#successTitle").text('添加成功');
            /*commonAlert("#successMsg", "#successAlertBlock", "添加角色成功");*/
            $('#editabledatatable').bootstrapTable("refresh");
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href ='#/login.html';
            }else{
                $("#creatDataModal").modal('hide');
                $("#failmodal").modal('show');
                $("#failTitle").text('添加失败！！');
                $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
                /* commonAlert("#warningMsg", "#warningAlertBlock", "添加角色失败");*/
            }
        }
    });
}
function fnCreateDataModal(){
    $("#creatDataModal").modal('show');
}

//模型
function Selectobj(){
    var target = $("select[name='modal_object']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/groupmo",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    target.append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
                }
            }

            target.selectpicker('refresh');
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
function fnUpdatePower(){
    $("#updateDataModal").modal("hide");
    var name=$("#rolename_U").val();
    var description=$("#roledes_U").val();
    var power=$("#modal_object1").selectpicker('val');
    $.ajax({
        type: 'PUT',
        url: _URL_INTERFACE+"platform/group",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "id":$("#basedataid").text(),
            "name":name,
            "description":description,
            "groupmo_ids":power

        }),
        success:function (result) {
            $("#creatDataModal").modal('hide');
            $("#successmodal").modal('show');
            $("#successTitle").text('更新成功');
            /*commonAlert("#successMsg", "#successAlertBlock", "添加角色成功");*/
            $('#editabledatatable').bootstrapTable("refresh");
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href ='#/login.html';
            }else{
                $("#creatDataModal").modal('hide');
                $("#failmodal").modal('show');
                $("#failTitle").text('更新失败！！');
                $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg)
                /* commonAlert("#warningMsg", "#warningAlertBlock", "添加角色失败");*/
            }
        }
    });
}
function showdeleteModal(data){
    $("#DeleteData").modal("show");
    $("#deleteID").text(data);
}
//删除权限组
function deleteData() {
    var id = $("#deleteID").text();
    $.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE + "platform/group",
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "id": id
        }),
        success: function (result) {
            $("#successmodal").modal('show');
            $("#successTitle").text('删除成功！！');
            $('#editabledatatable').bootstrapTable("refresh");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '#/login.html';
            } else {
                $("#failmodal").modal('show');
                $("#failTitle").text('删除失败');
                $("#failSpan").modal(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}

function fnsetSelectFlag(){
    selectFlag=true;
}
var selectFlag=false;
function fnResetHeight(){
    var statusFlag=$("#selectPower .bootstrap-select").hasClass("open");
   if(statusFlag==false&&selectFlag==true){
       $("#creatDataModal").find(".modal-body").css("height","400px");
   }else{
       $("#creatDataModal").find(".modal-body").css("height","177px");
       selectFlag=false;
   }
}
function fnResetHeight1(){
    var statusFlag=$("#selectPower1 .bootstrap-select").hasClass("open");
    if(statusFlag==false&&selectFlag==true){
        $("#updateDataModal").find(".modal-body").css("height","400px");
    }else{
        $("#updateDataModal").find(".modal-body").css("height","177px");
        selectFlag=false;
    }
}


