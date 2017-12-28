$(document).ready(function (){
    // $("#Containsetting").modal("show");
    showSysName();
    // showOwnerName();
    showOwnerName1();
    fnGetBusinessTable();
    releaseCreate();
    fnControlAddButton();
    // fnReleaseButton();

});

var sysId=getUrlParam('sysid')||'';
var sysName =getUrlParam('sysname')||'';
if(sysId){
    sessionStorage.setItem("sysId", sysId);
}
if(sysName){
    sessionStorage.setItem("sysName", sysName);    
}
if(sessionStorage.getItem("sysName")){
    sysName = sessionStorage.getItem("sysName");
    $('#sys-search-input').val(sysName);
    $("#sys-search-input").attr("readonly","true");
}
var flag2
$('.firstResourceDomain').on("select2:close",function (e) {
    var selectVal = $("#creatproject").find("[name='selectcheck']");
        if (selectVal.val() == null) {
            selectVal.nextAll(".red").html("该项不能为空，请选择");
            flag2=false;
            return;
        } else {
            selectVal.nextAll(".red").html("");
            flag2=true;
        }
    fnReleaseButton();
});
var flag3=true;
$('.secondResourceDomain').on("select2:close",function (e) {
    var selectVal = $("#creatproject").find("[name='selectcheck']");
    if (selectVal.val() == null) {
        selectVal.nextAll(".red").html("该项不能为空，请选择");
        flag3=false;
        return;
    } else {
        selectVal.nextAll(".red").html("");
        flag3=true;
    }
    fnReleaseButton();
});
var flag4;
$('.ownerDomian').on("select2:close",function (e) {


});
var flag5;
function fnAppNameNotEmpty(){
    var bussName=$("#businessName").val();
    if (bussName == "") {
        $("#businessName").nextAll(".red").html("该业务系统名称不能为空，请重新输入！");
        flag5=false;
    } else {
        $("#businessName").nextAll(".red").html("");
        flag5=true;
    }
    fnReleaseButton();
}
var flag1;
/* 验证业务系统名称是否唯一*/
function fnAppNameUnique() {
    var returnvalue='true';
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/domain/system/"+$("#businessName").val(),
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success: function (result) {
            var data = result.data;
            if(result.msg=="ok") {
                returnvalue=true;
                $("#businessName").nextAll(".red").html("");
            }else{
                returnvalue=false;
                $("#businessName").nextAll(".red").html("该业务系统名称已存在，请重新输入！");
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
    fnCheckName(returnvalue);
    flag1=returnvalue;
    fnReleaseButton();
    return returnvalue;
}
/* 验证更新时业务系统名称是否唯一*/
function fnUpdateNameUnique() {
    var returnvalue='true';
    $.ajax({
        type: 'get',
        url:_URL_INTERFACE+"apps/domain/system/"+$("#businessName1").val()+'?sys_base_id='+$("#saveIdSpan").text(),
        headers: {
            "token": token
        },
        async:false,
        dataType: 'json',
        success: function (result) {
            var data = result.data;
            if(result.msg=="ok") {
                returnvalue=true;
                $("#updateButton").attr("disabled",false);
                $("#businessName1").nextAll(".red").html("");
            }else{
                returnvalue=false;
                $("#updateButton").attr("disabled",true);
                $("#businessName1").nextAll(".red").html("该业务系统名称已存在，请重输");
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
    fnCheckName(returnvalue);
    return returnvalue;
}
function fnReleaseButton(){
    if(flag1&&flag2&&flag3&&flag4&&flag5&&cpuFlag&&memFlag&&diskFlag){
        $("#createButton").attr("disabled",false);
    }else{
        $("#createButton").attr("disabled",true);
    }
}
function fnStopEnter(){
    var ev = (typeof event!= 'undefined') ? window.event : e;
    if(ev.keyCode == 13 && document.activeElement.id == "accountForm") {
        return false;//禁用回车事件
    }
}
function fnCheckName(flag) {
    if(flag==true){
        $("#businessNameCheck").removeClass("hidden");
        $("#businessNameCheck1").removeClass("hidden");
    }else{
        $("#businessNameCheck").addClass("hidden");
        $("#businessNameCheck1").addClass("hidden");
    }
}
/*****创建时获取业务系统一级域和二级域*****/
function showSysName(province , city ) {
    var title	= ['一级域' , '二级域' ];
    $.each(title , function(k , v) {
        title[k]	= '<option value="">'+v+'</option>';
    })

    $('#firstResourceDomain').append(title[0]);
    $('#secondResourceDomain').append(title[1]);

    $(".firstResourceDomain,.secondResourceDomain").select2();
    fnGetFirstDomain();

    $(".firstResourceDomain").on("select2:close",function(e){
        $('.secondResourceDomain').empty();
        $('.secondResourceDomain').append(title[1]);
        fnGetSeondDomain($('[showorhide="show"]').find('.firstResourceDomain').select2('val'));
    });

}
//甲方人员下拉框初始化
// function showOwnerName(province , city ) {
//     var title	= ['甲方人员'  ];
//     $.each(title , function(k , v) {
//         title[k]= '<option value="">'+v+'</option>';
//     })
//     $('#selectpick').append(title[0]);
//     $(".ownerDomian").select2();
//     // fnGetOwner();
//
// }
function showOwnerName1(province , city ) {
    var title	= ['甲方人员'  ];
    $.each(title , function(k , v) {
        title[k]= '<option value="">'+v+'</option>';
    })
    $('#selectpick1').append(title[0]);
    $(".ownerDomian").select2();
    // fnGetOwner();

}
//创建业务系统modal框初始化
function fnCreateBusiness(){
    $("#creatproject").modal("show");
    $("#businessNameCheck").addClass("hidden");
    $("#businessName").nextAll(".red").html("");
    $("#creatproject").attr("showorhide","show");
    $("#updateproject").attr("showorhide","hide");
    $("#businessName").val('');
    $(".firstResourceDomain").val('');$(".firstResourceDomain").select2();
    $(".secondResourceDomain").val('');$(".secondResourceDomain").select2();
    $(".ownerDomian").val('');$(".ownerDomian").select2();
    $("#myLargeModalLabel").text("创建业务系统");
    $("#createButton").attr("disabled",true);
    flag1=false;flag2=false;flag4=false;
    // fnGetOwner();
    getInterface();
}
function fnGetFirstDomain1(){
    var flag = true;
    $.ajax({
        type: 'GET',
        url: _URL_INTERFACE+"apps/domain/system/积分联盟",
        headers: {
            "token": token
        },
        dataType: 'json',
        async:false,
        success:function (result) {
                flag=true;
        },error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('检查插件名失败！');//其他操作
            }
        }
    });
    return flag;
}
var cpuCurrent;
var memCurrent;
var diskCurrent;
var cpuAddMax;
var memAddMax;
var diskAddMax;
//获取一级域
function fnGetFirstDomain(){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/fastdomain?type=app_business_domain",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $(".firstResourceDomain").empty();
            if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    $(".firstResourceDomain").append('<option value="'+data[i].code+'">'+data[i].name+'</option>');
                }
            }
            var mesos_usage=result.mesos_usage;
            cpuCurrent=mesos_usage.cpu.used;
            memCurrent=Math.ceil(mesos_usage.mem.used/1024);
            diskCurrent=Math.ceil(mesos_usage.disk.used/1024);
            cpuAddMax=parseFloat(mesos_usage.cpu.total)-parseFloat(cpuCurrent);
            memAddMax=Math.floor((mesos_usage.mem.total-mesos_usage.mem.used)/1024);
            diskAddMax=Math.floor((mesos_usage.disk.total-mesos_usage.disk.used)/1024);
            fnnoUiSlider("#sample-onehandle","#CPU",0,mesos_usage.cpu.use_rate,cpuCurrent);
            $("#sample-onehandle").next("p").text("cpu已使用"+cpuCurrent+"核,最多还可使用"+cpuAddMax+"核");
            fnnoUiSlider("#sample-onehandle2","#mem",0,mesos_usage.mem.use_rate,memCurrent);
            $("#sample-onehandle2").next("p").text("内存已使用"+memCurrent+"GB,最多还可使用"+memAddMax+"GB");
            fnnoUiSlider("#sample-onehandle3","#disk",0,mesos_usage.disk.use_rate,diskCurrent);
            $("#sample-onehandle3").next("p").text("磁盘已使用"+diskCurrent+"GB,最多还可使用"+diskAddMax+"GB");
            // $("#CPU").attr("max",cpuAddMax);
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                //alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
//滑动条初始化
function fnnoUiSlider(obj,inputobj,start,use_rate,corrent){
    $(obj).empty();
    var size= parseInt(use_rate);
 var html='<div class="progress " style="border-radius: 0px;"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: '+size+'%;border-Radius:0px;"><span>'+corrent+'</span></div></div>';
 $(obj).append(html);

}
var cpuFlag=true,memFlag=true,diskFlag=true;
function change(obj){
    var inp_val=$(obj).val();
    var add_val;
    var use_rate;
    if(inp_val === '')add_val=0;
    if(obj.id=="CPU"||obj.id=="CPU1"){
        add_val=cpuCurrent+parseFloat(inp_val);
        if(inp_val==""){
            use_rate=(cpuCurrent/(cpuAddMax+cpuCurrent))*100;
            fnnoUiSlider("#sample-onehandle",obj,0,use_rate,cpuCurrent);
            fnnoUiSlider("#sample-onehandle1",obj,0,use_rate,cpuCurrent);
            $(obj).next("span").text('');
            cpuFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }else if(add_val>cpuAddMax+cpuCurrent){
            $(obj).next("span").text("最多可分配cpu为"+cpuAddMax+"核！");
            cpuFlag=false;
            fnReleaseButton();
            $("#updateButton").addClass("disabled",true);
            return;
        }else{
            use_rate=(add_val/(cpuAddMax+cpuCurrent))*100;
            fnnoUiSlider("#sample-onehandle",obj,0,use_rate,add_val);
            fnnoUiSlider("#sample-onehandle1",obj,0,use_rate,add_val);
            $(obj).next("span").text('');
            cpuFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }

    }else if(obj.id=="mem"||obj.id=="mem1"){
        add_val=memCurrent+parseFloat(inp_val);
        if(inp_val==""){
            use_rate=(memCurrent/(memAddMax+memCurrent))*100;
            fnnoUiSlider("#sample-onehandle2",obj,0,use_rate,memCurrent);
            fnnoUiSlider("#sample-onehandle21",obj,0,use_rate,memCurrent);
            $(obj).next("span").text('');
            memFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }else if(add_val>memAddMax+memCurrent){
            $(obj).next("span").text("最多可分配内存为"+memAddMax+"GB！");
            memFlag=false;
            $("#updateButton").addClass("disabled",true);
            fnReleaseButton();
            return;
        }else{
            use_rate=(add_val/(memAddMax+memCurrent))*100;
            fnnoUiSlider("#sample-onehandle2",obj,0,use_rate,add_val);
            fnnoUiSlider("#sample-onehandle21",obj,0,use_rate,add_val);
            $(obj).next("span").text('');
            memFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }

    }else{
        add_val=diskCurrent+parseFloat(inp_val);
        if(inp_val==""){
            use_rate=(diskCurrent/(diskAddMax+diskCurrent))*100;
            fnnoUiSlider("#sample-onehandle3",obj,0,use_rate,diskCurrent);
            fnnoUiSlider("#sample-onehandle31",obj,0,use_rate,diskCurrent);
            $(obj).next("span").text('');
            diskFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }else if(add_val>diskAddMax+diskCurrent){
            $(obj).next("span").text("最多可分配磁盘为"+diskAddMax+"GB！");
            diskFlag=false;
            $("#updateButton").addClass("disabled",true);
            fnReleaseButton();
            return;
        }else{
            use_rate=(add_val/(diskAddMax+diskCurrent))*100;
            fnnoUiSlider("#sample-onehandle3",obj,0,use_rate,add_val);
            fnnoUiSlider("#sample-onehandle31",obj,0,use_rate,add_val);
            $(obj).next("span").text('');
            diskFlag=true;
            $("#updateButton").removeClass("disabled",true);
            fnReleaseButton();
        }

    }
    $(obj).val(inp_val.replace(/[^\d.]/g,''));
    var id=$(obj).attr("id");
    $("[name='"+id+"']").val(add_val);

}
//获取二级域
function fnGetSeondDomain(first){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/fastdomain?type=app_business_subdomain&domain_code="+first,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $(".secondResourceDomain").empty();
            if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    $(".secondResourceDomain").append('<option value="'+data[i].code+'">'+data[i].name+'</option>');
                }
            }
            var mesos_usage=result.mesos_usage;
            cpuCurrent=mesos_usage.cpu.used;
            memCurrent=Math.ceil(mesos_usage.mem.used/1024);
            diskCurrent=Math.ceil(mesos_usage.disk.used/1024);
            cpuAddMax=parseFloat(mesos_usage.cpu.total)-parseFloat(cpuCurrent);
            memAddMax=Math.floor((mesos_usage.mem.total-memCurrent)/1024);
            diskAddMax=Math.floor((mesos_usage.disk.total-diskCurrent)/1024);
            fnnoUiSlider("#sample-onehandle1","#CPU1",0,mesos_usage.cpu.use_rate,cpuCurrent);
            $("#sample-onehandle1").next("p").text("cpu已使用"+cpuCurrent+"核,最多还可使用"+cpuAddMax+"核");
            fnnoUiSlider("#sample-onehandle21","#mem1",0,mesos_usage.mem.use_rate,memCurrent);
            $("#sample-onehandle21").next("p").text("内存已使用"+memCurrent+"GB,最多还可使用"+memAddMax+"GB");
            fnnoUiSlider("#sample-onehandle31","#disk1",0,mesos_usage.disk.use_rate,diskCurrent);
            $("#sample-onehandle31").next("p").text("磁盘已使用"+diskCurrent+"GB,最多还可使用"+diskAddMax+"GB");
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                //alert('添加失败！（例子）');//其他操作
            }
        }
    });
}
var tableFlag;
//获取业务系统列表
function fnGetBusinessTable(){
    tableFlag="table";
    $('#businessTable').empty();
    $('#businessTable').bootstrapTable({
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
            field: 'sysdomain_name',
            title: '业务系统',
            align: 'left',
            formatter:function(value,row,index){
                var id=row['sysdomain_code'];
                var b='<a href="#/webcontent/Application/taskReport.html?sys_id='+id+'&sys_name='+value+'"> '+value+'</a>';
                return b
            }

        },{
            field: 'domain_name',
            title: '一级域',
            /*  align: 'center'*/
        }, {
            field: 'subdomain_name',
            title: '二级域',
            /*align: 'center'*/
        }, {
            field: 'sysdomain_name',
            title: 'cpu用量',
            align: 'left',
            formatter:function(value,row,index){
                var num=parseInt(row['cpu_usage_rate']*100);
                var c;
                if(num<50){
                    c='<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else if(num>=50&&num<80){
                    c='<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else{
                    c='<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }
                return c
            }

        },{
            field: 'sysdomain_name',
            title: '内存用量',
            align: 'left',
            formatter:function(value,row,index){
                var num=parseInt(row['mem_usage_rate']*100);
                var c;
                if(num<50){
                    c='<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else if(num>=50&&num<80){
                    c='<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else{
                    c='<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }
                return c
            }

        },{
            field: 'sysdomain_name',
            title: '磁盘用量',
            align: 'left',
            formatter:function(value,row,index){
                var num=parseInt(row['disk_usage_rate']*100);
                var c;
                if(num<50){
                    c='<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else if(num>=50&&num<80){
                    c='<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }else{
                    c='<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: '+num+'%"><span>'+num+'%</span></div></div>'
                }
                return c
            }

        },
            {
                field: 'id',
                title: '操作',
                /* align: 'center',*/
                width:'320px',
                formatter:function(value,row,index){
                    var name=row['sysdomain_name'];
                    var sys_id=row['sysdomain_code'];
                    var sysbuscode=row['sysdomain_code']+'/'+name;
                    var first=row['domain_code']+'/'+row['domain_name'];
                    var second=row['subdomain_code']+'/'+row['subdomain_name'];
                    var content='';
                    var group_mo=row['groupmo'];
                    content += '<a href="#/webcontent/platformsetting/quotaslist.html?sysid='+sys_id+'"  class="btn btn-default btn-xs" ><i class="fa fa-file-o info padding-right-5"></i>查看</a>';
                    for(var i=0;i<group_mo.length;i++){
                        if(group_mo[i].groupmo_name=="创建应用"){
                            content += '<a href="#/webcontent/Application/CreatApplication.html?domain_code='+first+'&subdomain_code='+second+'&sysdomain_code='+sysbuscode+'" class="btn btn-default btn-xs">' +
                                '<i class="fa fa-plus info padding-right-5"></i>创建应用</a> ';
                        }
                    }
                    for(var i=0;i<group_mo.length;i++){
                       if(group_mo[i].groupmo_name=="增删业务系统管理员"){
                            content += '<a href="javascript:;" class="btn btn-default btn-xs" onclick="showAddModal(\''+sys_id+'\',\''+name+'\')"><i class="fa fa-plus info padding-right-5"></i>管理维护人</a>';
                        }
                    }
                        if(_user.role_id == '1'){
                            content += '<a href="javascript:;" class="btn btn-default btn-xs" onclick="showDeleteModal(\''+value+'\',\''+sys_id+'\',\''+name+'\')"><i class="fa fa-trash red padding-right-5"></i>删除</a>';
                        }

                    return content;
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

            var group_mo=data.groupmo;
            for(var i=0;i<group_mo.length;i++){
                if(group_mo[i].groupmo_name=="修改业务系统"){
                    $("#updateproject").modal('show');
                    $("#businessNameCheck1").addClass("hidden");
                    $("#updateproject").attr("showorhide", "show");
                    $("#creatproject").attr("showorhide", "hide");
                    $("#businessName1").nextAll(".red").html("");
                    //fnGetOwner1(data.sysdomain_code);
                    fnFilledData(data);
                }

            }

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

    if(sessionStorage.getItem("sysName")){
        txt = sessionStorage.getItem("sysName");
        url=_URL_INTERFACE +"apps/domain/search?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt;
        type='GET';
    }else{
        if(tableFlag=="table"){
            url=_URL_INTERFACE +"apps/domain/search?page=" + pageNumber + "&pageSize=" + pageSize+'&condition=';
            type= 'GET';
        }else{
            url=_URL_INTERFACE +"apps/domain/search?page=" + pageNumber + "&pageSize=" + pageSize+'&condition='+txt;
            type='GET';
        }
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
//业务系统更新modal数据填充
function fnFilledData(data){
    console.log(data);
    $("#saveIdSpan").text(data.id);
    // fnUpdateModal(data.id);
    $("#businessName1").val(data.sysdomain_name);

    $(".firstResourceDomain").val(data.domain_code);$(".firstResourceDomain").select2();
    setTimeout(function() {
        $(".secondResourceDomain").val(data.subdomain_code);
        $(".secondResourceDomain").select2();

    },200);
    fnGetSeondDomain(data.domain_code);
    fnGetOwner1(data.sysdomain_code);
    setTimeout(function(){
        $("#dataTypei").val(data.sys_owner_name);
    },300);

    $("#CPU1").val(data.cpu_total);
    $("#mem1").val(parseInt(data.mem_total/1024));
    $("#disk1").val(parseInt(data.disk_total/1024));
}

function closeInputSelect() {
    $('#typeSelect').removeClass('hidden');
    $('#typeInput').addClass('hidden');
}
function closeSelect() {
    $('#typeInput').removeClass('hidden');
    $('#typeSelect').addClass('hidden');
}
var updateNameFlag,updateOwnerFlag;
//修改业务系统验证
function fnUpdateCheck(){
    if(updateNameFlag==true||updateOwnerFlag==true){
        $("#updateButton").remove("disabled",true);
        fnUpdateData();
    }else{
        $("#updateButton").addClass("disabled",true);
    }
}
function fnUpdateCheckNotempty(){
    var bussName=$("#businessName1").val();
    if (bussName == "") {
        $("#businessName").nextAll(".red").html("该业务系统名称不能为空，请重新输入！");
        $("#updateButton").addClass("disabled",true);
        updateNameFlag=false;
    } else {
        $("#businessName").nextAll(".red").html("");
        $("#updateButton").removeClass("disabled",true);
        updateNameFlag=true;
    }
}
function fnUpdateCheckOwner(){
    var owner=$("#selectpick1").val();
    if (owner== null) {
        $("#selectpick1").nextAll(".red").html("该项不能为空，请选择");
        updateOwnerFlag=false;
        return;
    } else {
        $("#selectpick1").nextAll(".red").html("");
        updateOwnerFlag=true;
    }
}
//更新业务系统
function fnUpdateData() {
    $("#updateproject").modal('hide');
    var id=$("#saveIdSpan").text();
    var businessName = $("#businessName1").val();
    var firstResourceDomain = $('#updateproject').find(".firstResourceDomain").select2('val');
    var secondResourceDomain = $('#updateproject').find(".secondResourceDomain").select2('val');
    // var admin=$("#admin_object1").selectpicker('val');
    $.ajax({
        type: 'put',
        url: _URL_INTERFACE + 'apps/domain',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "id":id,
            "domain_code": firstResourceDomain,
            "subdomain_code": secondResourceDomain,
            "sys_name": businessName,
            "cpu":$("#CPU1").val(),
            "mem":$("#mem1").val()*1024,
            "disk":$("#disk1").val()*1024,
            // "sys_admin":admin,
            "sys_owner":updateOwner
        }),
        success: function (result) {
            $("#successmodal").modal('show');
            $("#successmodal").find(".title1").text("业务系统修改成功");
            $('#businessTable').bootstrapTable("refresh");
            $('#typeInput').removeClass('hidden');
            $('#typeSelect').addClass('hidden');
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                $("#failmodal").modal('show');
                $('#failtitle').text('业务系统修改失败！！');
                $("#failInfo").text(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}
//创建业务系统
function fnCreateBusinessSys() {
    $("#creatproject").modal('hide');
    var businessName = $("#businessName").val();
    var firstResourceDomain = $('#creatproject').find(".firstResourceDomain").select2('val');
    var secondResourceDomain = $('#creatproject').find(".secondResourceDomain").select2('val');
    // var admin=$("#admin_object").selectpicker('val');
    // var owner=$("#selectpick").val();
    $.ajax({
        type: 'post',
        url: _URL_INTERFACE + 'apps/domain',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "type":"app_business_sysdomain",
            "domain_code": firstResourceDomain,
            "subdomain_code": secondResourceDomain,
            "sys_name": businessName,
            "cpu":$("#CPU").val(),
            "mem":$("#mem").val()*1024,
            "disk":$("#disk").val()*1024,
            // "sys_admin":admin,
            "sys_owner":createowner
        }),
        success: function (result) {
            var data=result.data;
            // $("#successmodal").modal('show');
            window.location.href="#/webcontent/Application/taskReport.html?sys_id="+data.sysdomain_code+'&sys_name='+data.sysdomain_name;
            $('#businessTable').bootstrapTable("refresh");
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                $("#failmodal").modal('show');
                $('#failtitle').text('业务系统创建失败！！')
                $("#failInfo").text(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}
/*****删除业务系统*****/
function showDeleteModal(data,sys_id,name){
    deletemodal(data,sys_id,name);

}
function deletemodal(id,sys_id,name){
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/fastlist?sys_id="+sys_id,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            $("#DeletBusiness").modal("show");
            $("#deleteID").text(id);
            $("#deletename").text(name);
            var data=result.data;
            $("#deleteapp").empty();
            $("#appList").empty();
            if(data.length!=0){
                $("#deleteapp").append('该业务系统下的<span id="appList" class="danger"></span>应用将会被删除！');
                var html='';
                var app_name=[];
                for(var i=0;i<data.length;i++){
                    app_name.push(data[i].app_name);
                }
                html+='<span>【'+app_name.toString()+'】</span>'
                $("#appList").append(html);
            }
            else{
                $("#deleteapp").text("该业务系统下没有应用！");
                return
            }

        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{

            }
        }
    });
}
function fnDeleteSys(){
    var id=$("#deleteID").text();
    $("#DeletBusiness").modal("hide");
    $.ajax({
        type: 'DELETE',
        url: _URL_INTERFACE+"apps/domain",
        headers: {
            "token": token
        },
        dataType: 'json',
        data:JSON.stringify({
            "id":id
        }),
        success:function (result) {
            $('#tips').modal('show');
            $('#tipsSpan').text('删除成功！！')
            $('#businessTable').bootstrapTable("refresh");
            // }else{
            // 	commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
            // }
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '/index.html';
            }else{
                $('#failmodal').modal('show');
                $('#failtitle').text('删除失败！')
                $('#failInfo').text(JSON.parse(XMLHttpRequest.responseText).msg)
            }
        }
    });
}
/*****添加业务系统维护人*****/
function showAddModal(data,name){
    $("#Containsetting").modal("show");
    $("#saveSysid").text(data);
    fnGroupinfo();
    SelectAdmin();
    fnloadAdmin();
    fnloadGroup();

}
function commonAlert(msgObjectName, alertObject, msg) {
    $(msgObjectName).html(msg);
    $(alertObject).show();
}
//获取甲方人员信息
// function fnGetOwner(){
//     var target = $("select[name='selectpick']").empty();
//     // target.selectpicker('refresh');
//     $.ajax({
//         type: 'get',
//         url: _URL_INTERFACE+"platform/users",
//         headers: {
//             "token": token
//         },
//         dataType: 'json',
//         success:function (result) {
//             var data=result.data;
//             if(data.length != 0){
//                 for (var i = 0; i < data.length; i++){
//                     target.append("<option value='"+data[i].id+"'>"+data[i].name+"</option>");
//                 }
//             }
//             // target.selectpicker('refresh');
//         },
//         error:function (XMLHttpRequest, textStatus, errorThrown) {
//             if(XMLHttpRequest.status === 401){
//                 window.location.href = '#/login.html';
//             }else{
//                 // alert('添加失败！（例子）');//其他操作
//             }
//         }
//     });
// }
var ajaxFlag;
function getInterface(){
    ajaxFlag='create';
    $(".ownerDomian").select2({
        placeholder: "选择一个接口人",
        ajax: {
            url:  _URL_INTERFACE+"platform/users",
            headers: {
                "token": token
            },
            dataType: 'json',
            delay: 500,
            data: function (params) {
                return {
                    condition: params.term, // search term
                    page: params.page || 1,
                    pageSize:100000000
                };
            },
            // processResults: function (data, page) {
            //     // parse the results into the format expected by Select2.
            //     // since we are using custom formatting functions we do not need to
            //     // alter the remote JSON data
            //     console.log("ajax返回的对象是:")
            //     console.log(data.items)
            //     return {
            //         results: data.items
            //     };
            // },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            console.debug(markup)
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,  //至少输入多少个字符后才会去调用ajax
        maximumInputLength: 20, //最多能输入多少个字符后才会去调用ajax
        minimumResultsForSearch: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });
}

function formatRepo (repo) {
    if (repo.loading) return repo.text;
    repo.text = repo.name
    repo.id = repo.id
    var markup = '<div class="clearfix">' +
        '<div class="col-sm-20">' + repo.name + '</div>' +
        '</div>';

    return markup;
}

function formatRepoSelection (repo) {
    repo.selected = true;
    repo.code = repo.id
    repo.name = repo.text
    if(repo.code == null || repo.code == ""){
        repo.text = '请选择一个甲方接口人'
        repo.name = repo.text
    }
    if(ajaxFlag=='update'){
        $(".ownerDomian1").val(repo.name);
    }else{
        $(".ownerDomian").val(repo.name);
    }
    console.debug(repo);
    return repo.name ;
}
var createowner;
$(".ownerDomian").on("change",function (e){
    var selectVal = $("#creatproject").find("[name='selectpick']");
    createowner=$(".ownerDomian").val();
    if ($(".ownerDomian").val() == null) {
        selectVal.nextAll(".red").html("该项不能为空，请选择");
        flag4=false;
        return;
    } else {
        selectVal.nextAll(".red").html("");
        flag4=true;
    }
    fnReleaseButton();
});
var updateOwner;
$(".ownerDomian1").on("change",function (e){
    updateOwner=$(".ownerDomian1").val();
    if ($(".ownerDomian1").val()== null) {
        $("#selectpick1").nextAll(".red").html("该项不能为空，请选择");
        updateOwnerFlag=false;
        return;
    } else {
        $("#selectpick1").nextAll(".red").html("");
        updateOwnerFlag=true;
    }
});
//获取修改时甲方人员信息
function fnGetOwner1(sys_id){
    ajaxFlag='update';
    $(".ownerDomian1").select2({
        placeholder: "选择一个接口人",
        ajax: {
            url: _URL_INTERFACE+"platform/users/domain?sys_id="+sys_id,
            headers: {
                "token": token
            },
            dataType: 'json',
            delay: 500,
            data: function (params) {
                return {
                    condition: params.term, // search term
                    page: params.page || 1,
                    pageSize:100000000
                };
            },
            // processResults: function (data, page) {
            //     // parse the results into the format expected by Select2.
            //     // since we are using custom formatting functions we do not need to
            //     // alter the remote JSON data
            //     console.log("ajax返回的对象是:")
            //     console.log(data.items)
            //     return {
            //         results: data.items
            //     };
            // },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.data
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            console.debug(markup)
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,  //至少输入多少个字符后才会去调用ajax
        maximumInputLength: 20, //最多能输入多少个字符后才会去调用ajax
        minimumResultsForSearch: 1,
        templateResult: formatRepo,
        templateSelection: formatRepoSelection,
    });

    // target.selectpicker('refresh');
}
//获取维护人信息
function SelectAdmin(){
    var target = $("select[name='admin_object']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/users",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    target.append("<option value='"+data[i].id+"'>"+data[i].username+"</option>");
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
/* 控制创建业务系统权限*/
function releaseCreate() {
    if(_user.role_id != '1') {
    $("#createBuiness").attr("hidden",true);
    $("#bussinessSearchBar").addClass("warningcontainer",true);
    }else{
        $("#createBuiness").removeClass("hidden",true);
        $("#bussinessSearchBar").addClass("warningcontainer",true);
    }
}
var txt;
/*  搜索业务系统名称*/
function fnSearch(obj) {
    tableFlag = "search";
    txt = $(obj).val();
        $("#businessTable").bootstrapTable("destroy");
        $('#businessTable').bootstrapTable({
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
                field: 'sysdomain_name',
                title: '业务系统',
                align: 'left',
                formatter: function (value, row, index) {
                    var id = row['sysdomain_code'];
                    var b = '<a href="#/webcontent/Application/taskReport.html?sys_id=' + id + '&sys_name=' + value + '"> ' + value + '</a>';
                    return b
                }

            }, {
                field: 'domain_name',
                title: '一级域',
                /*  align: 'center'*/
            }, {
                field: 'subdomain_name',
                title: '二级域',
                /*align: 'center'*/
            }, {
                field: 'sysdomain_name',
                title: 'cpu用量',
                align: 'left',
                formatter: function (value, row, index) {
                    var num = parseInt(row['cpu_usage_rate'] * 100);
                    var c;
                    if (num < 50) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else if (num >= 50 && num < 80) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else {
                        c = '<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    }
                    return c
                }

            }, {
                field: 'sysdomain_name',
                title: '内存用量',
                align: 'left',
                formatter: function (value, row, index) {
                    var num = parseInt(row['mem_usage_rate'] * 100);
                    var c;
                    if (num < 50) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else if (num >= 50 && num < 80) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else {
                        c = '<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    }
                    return c
                }

            }, {
                field: 'sysdomain_name',
                title: '磁盘用量',
                align: 'left',
                formatter: function (value, row, index) {
                    var num = parseInt(row['disk_usage_rate'] * 100);
                    var c;
                    if (num < 50) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-success" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else if (num >= 50 && num < 80) {
                        c = '<div class="progress "><div class="progress-bar progress-bar-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    } else {
                        c = '<div class="progress "><div class="progress-bar progress-bar-danger" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style="width: ' + num + '%"><span>' + num + '%</span></div></div>'
                    }
                    return c
                }

            },
                {
                    field: 'id',
                    title: '操作',
                    /* align: 'center',*/
                    width:'320px',
                    formatter:function(value,row,index){
                        console.log(row);
                        var name=row['sysdomain_name'];
                        var sys_id=row['sysdomain_code'];
                        var sysbuscode=row['sysdomain_code']+'/'+name;
                        var first=row['domain_code']+'/'+row['domain_name'];
                        var second=row['subdomain_code']+'/'+row['subdomain_name'];
                        var content='';
                        var group_mo=row['groupmo'];

                        // content += '<a href="#/webcontent/Application/Applist.html?sys_id='+sys_id+'"  class="btn btn-default btn-xs" ><i class="fa fa-file-o info padding-right-5"></i>查看</a>';
                        content += '<a href="#/webcontent/platformsetting/quotaslist.html?sysid='+sys_id+'"  class="btn btn-default btn-xs" ><i class="fa fa-file-o info padding-right-5"></i>查看</a>';
                        for(var i=0;i<group_mo.length;i++){
                            if(group_mo[i].groupmo_name=="创建应用"){
                                content += '<a href="#/webcontent/Application/CreatApplication.html?domain_code='+first+'&subdomain_code='+second+'&sysdomain_code='+sysbuscode+'" class="btn btn-default btn-xs">' +
                                    '<i class="fa fa-plus info padding-right-5"></i>创建应用</a> ';
                            }
                        }
                        for(var i=0;i<group_mo.length;i++){
                            if(group_mo[i].groupmo_name=="增删业务系统管理员"){
                                content += '<a href="javascript:;" class="btn btn-default btn-xs" onclick="showAddModal(\''+sys_id+'\',\''+name+'\')"><i class="fa fa-plus info padding-right-5"></i>添加维护人</a>';
                            }
                        }
                            if(_user.role_id == '1'){
                                content += '<a href="javascript:;" class="btn btn-default btn-xs" onclick="showDeleteModal(\''+value+'\',\''+sys_id+'\',\''+name+'\')"><i class="fa fa-trash red padding-right-5"></i>删除</a>';
                            }

                        return content;
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
                console.log(data);
            },
            onDblClickRow: function (data) {
                console.log(data);
                var group_mo=data.groupmo;
                for(var i=0;i<group_mo.length;i++){
                    if(group_mo[i].groupmo_name=="修改业务系统"){
                        $("#updateproject").modal('show');
                        $("#businessNameCheck1").addClass("hidden");
                        $("#updateproject").attr("showorhide", "show");
                        $("#creatproject").attr("showorhide", "hide");
                        $("#businessName1").nextAll(".red").html("");
                        // fnGetOwner1(data.sysdomain_code);
                        fnFilledData(data);

                    }

                }


            },
            pagination: true
        });


}
//select2添加搜索框
$.fn.modal.Constructor.prototype.enforceFocus = function () {};

//控制甲方人员与维护人不唯一
function fnselectAfter(forObj){
    var selected;
    if(forObj.id=='selectpick'){
        selected= $("#selectpick").val();
    }else{
        selected= $("#selectpick1").val();
    }
    var target = $("select[name='admin_object']").empty();
    target.selectpicker('refresh');
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/users",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    if(data[i].id!=selected){
                        target.append("<option value='"+data[i].id+"'>"+data[i].username+"</option>");
                    }
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
//获取维护人列表
function fnloadAdmin(){
    //系统名称
    var sysid=$("#saveSysid").text();
    $("#sysname").empty();
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/users?sys_id="+sysid,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                        $("#sysname").append(' <li onclick="changeSysColor(this)"><a href="javascript:;" data_id="'+data[i].id+'">'+data[i].name+'</a></li>');
                }
            }
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
//获取权限组列表
function fnloadGroup(){
    //系统名称
    $("#appname").empty();
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/group",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    $("#appname").append(' <li onclick="changeGroupColor(this)"><a href="javascript:;" data_id="'+data[i].id+'">'+data[i].name+'</a></li>');
                }
            }
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
//获取现有维护人及权限信息
function fnGroupinfo(){
    //系统名称
    var sysid=$("#saveSysid").text();
    $("#showapp").empty();
    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"platform/groupop?sys_id="+sysid,
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            var html="";
            if(data.length != 0){
                for (var i = 0; i < data.length; i++){
                    // $("#showapp").append(' <li onclick="changeGroupColor(this)"><a href="javascript:;" data_id="'+data[i].id+'">'+data[i].name+'</a></li>');
                    html +='<li onclick="changeaddColor(this)" class="" style="background-color: rgb(255, 255, 255);"><a href="javascript:;" class="checkedsys" data_id="'+data[i].user_id+'">'+data[i].name+'</a><br>'
                    html +='<a href="javascript:;" class="checkedapp" data_id="'+data[i].group_id+'">'+data[i].group_info.name+'</a></li>';
                }
                $("#showapp").append(html);
            }else{
                $("#showapp").append("<li id='notice'>当前业务系统没有分配维护人</li>");
            }

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
function changeSysColor(obj){
    $("#sysname").find('li').css("background-color",'rgb(255, 255, 255)');
    if($(obj).css("background-color")=="rgb(255, 255, 255)"){
        $("#sysname").find('li').css("background-color",'#rgb(255, 255, 255)').attr("class",'');
        $(obj).css("background-color",'#d9edf7').attr("class",'checkedsys')
        // sysNameApp(obj);
    }
    fnControlAddButton();
}
function changeGroupColor(obj){
    $("#appname").find('li').css("background-color",'rgb(255, 255, 255)');
    if($(obj).css("background-color")=="rgb(255, 255, 255)"){
        $("#appname").find('li').css("background-color",'#rgb(255, 255, 255)').attr("class",'');
        $(obj).css("background-color",'#d9edf7').attr("class",'checkedapp')
        // sysNameApp(obj);
    }
    fnControlAddButton();
}
function changeaddColor(obj){
    $("#showapp").find('li').css("background-color",'rgb(255, 255, 255)');
    if($(obj).css("background-color")=="rgb(255, 255, 255)"){
        $("#showapp").find('li').css("background-color",'#rgb(255, 255, 255)').attr("class",'');
        $(obj).css("background-color",'#d9edf7').attr("class",'checkedremove')
        // sysNameApp(obj);
    }
}
//添加按钮
function addShowGroup(){
    $("#showapp").find('li').css("background-color",'rgb(255, 255, 255)').attr("class",'');
    var html='';
    var sysname=$("#sysname").find(".checkedsys").text();
    var sysnameId=$("#sysname").find(".checkedsys a").attr('data_id');
    var appname= $("#appname").find(".checkedapp").text();
    var appnameId=$("#appname").find(".checkedapp a").attr('data_id');
    $("#showapp").find("#notice").remove();
    $("#sysname").find(".checkedsys").each(function(i,obj){
        $(obj).remove();
        html += ' <li onclick="changeaddColor(this)" class="checkedremove" style="background-color: rgb(217, 237, 247);"><a href="javascript:;" class="checkedsys" data_id="'+sysnameId+'">'+sysname+'</a></br>';
    });

        $("#appname").find(".checkedapp").each(function(i,obj){
            html += '<a href="javascript:;" class="checkedapp" data_id="'+appnameId+'">'+appname+'</a></li>';
        });
    $("#showapp").append(html);
    $("#addButton").attr("disabled",true);
    fnloadGroup();
}
//删除按钮
function cutShowGroup(){
    $("#sysname").find('li').css("background-color",'rgb(255, 255, 255)').attr("class",'');
    var html='';
    var admin=$("#showapp").find(".checkedremove a.checkedsys").text();
    $("#showapp").find(".checkedremove").each(function(i,obj){
        $(obj).remove();
        html +='<li onclick="changeSysColor(this)" class="checkedsys" style="background-color: rgb(217, 237, 247);"><a href="javascript:;">'+admin+'</a></li>'
        $("#sysname").append(html);
        $(obj).attr("class",'');
    });

}
//更新维护人权限组信息
function fnPostAdminData(){
    $("#Containsetting").modal("hide");
    var info=[];
    for(var i=0;i<$("#showapp").find("li").length;i++){
        var user_id=$("#showapp").find("li").eq(i).find("a.checkedsys").attr("data_id");
        var group_id=$("#showapp").find("li").eq(i).find("a.checkedapp").attr("data_id");
        var arr={
            "group_id": group_id,
            "user_id": user_id
        }
        info.push(arr);
    }
    $.ajax({
        type: 'PUT',
        url: _URL_INTERFACE + 'platform/groupop',
        headers: {
            "token": token
        },
        dataType: 'json',
        data: JSON.stringify({
            "sys_id": $("#saveSysid").text(),
            "info":info
        }),
        success: function (result) {
            var data=result.data;
            $("#successmodal").modal('show');
            $("#successmodal").find(".title1").text("维护人更新成功");
            fnGroupinfo();
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status === 401) {
                window.location.href = '/index.html';
            } else {
                $("#failmodal").modal('show');
                $('#failtitle').text('维护人更新失败！！');
                $("#failInfo").text(JSON.parse(XMLHttpRequest.responseText).msg);
            }
        }
    });
}
//添加按钮验证
function fnControlAddButton(){
    var adminLength=$("#sysname").find(".checkedsys").length;
    var groupLength=$("#appname").find(".checkedapp").length;
    if(adminLength==1&&groupLength==1){
        $("#addButton").attr("disabled",false);
    }else{
        $("#addButton").attr("disabled",true);
    }
}
//维护人搜索框
function fnSearch1(obj,goal){
    var txt = $(obj).val();
    if (txt == '') {
        $(goal).find("li").show();
    } else {
        $(goal).find("li").hide();
        $(goal).find("li:contains('" + txt + "')").show();
    }
}
