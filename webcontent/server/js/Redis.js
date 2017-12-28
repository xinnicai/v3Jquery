$(document).ready(function (){
  fnInit();
  fngetData();//获取网络、存储
  fnGetPool();
  showSysName();
  /*$("#sys_name").select2();
	fnnoUiSlider("#sample-onehandlecpu","#sys_CPU",0,100);
	fnnoUiSlider("#sample-onehandlemem","#sys_mem",0,100);
	fnnoUiSlider("#sample-onehandledisk","#sys_disk",0,100);*/
   // initResourceName();
});
function fnInit(){
  var role_id=_user.role_id;
  if(role_id != '1' && role_id != '4'){
    $(".listhide").hide();
    $(".dockerconfigure").hide();
    $(".centerconfigure").hide();
    $(".net_mode").attr('disabled',true);
  }else{
    $(".net_mode").attr('disabled',false);
    $("#con_CPU").find('select').append('<option value="">新增</option>');
    $("#con_mem").find('select').append('<option value="">新增</option>');
  }
  $("#con_CPU").find('select').select2();
  $("#con_mem").find('select').select2();
}
function closeInput(obj){
  $(obj).parents('.input-group').hide();
  $(obj).parents('.input-group').next('select').show();
  $(obj).parents('.input-group').nextAll('span').show();
}

$("#con_CPU").find('select').on("select2:close",function(e){

  if($("#con_CPU").find('select').select2('val')==''){
    $("#con_CPU").find('select').hide();
    $("#con_CPU").find('select').next('span').hide();
    $("#con_CPU").find('select').prev('.input-group').show();
  }
});
$("#con_mem").find('select').on("select2:close",function(e){

  if($("#con_mem").find('select').select2('val')==''){
    $("#con_mem").find('select').hide();
    $("#con_mem").find('select').next('span').hide();
    $("#con_mem").find('select').prev('.input-group').show();
  }
});
//资源池
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
            _html +='<a href="javascript:void(0);" class="btn btn-info" value="'+data[i].code+'" style="margin-right: 4px;">'+data[i].name+'</a>';
          }else{
            _html +='<a href="javascript:void(0);" class="btn btn-default" style="margin-right: 4px;" value="'+data[i].code+'">'+data[i].name+'</a>';
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
document.getElementById("ResourcesPool").addEventListener("click",fnChangePool,false);
function fnChangePool(event) {
  $("#ResourcesPool").find("a").attr('class', "btn btn-default margin-right-10");
  var clustername = '';
  if (event.target && event.target.nodeName == "A") {
    // 找到目标，输出ID!
    event.target.className = "btn btn-info margin-right-10";
    fnGetCluster(event.target.attributes.value.nodeValue);
  }
}

document.getElementById("cluster").addEventListener("click", function (e) {
  $("#cluster").find("a").attr('class', "btn btn-default margin-right-10");
  if (e.target && e.target.nodeName == "A") {
    // 找到目标，输出ID!
    e.target.className = "btn btn-info margin-right-10";
  }
});
function fnGetCluster(code){
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
      $("#cluster").empty();
      var _html='';
      if(data && data.length>0){
        for(var i=0;i<data.length;i++){
          if(i==0){
            _html +='<a href="javascript:void(0);" class="btn btn-info" label="'+data[i].label+'" style="margin-right: 4px;">'+data[i].name+'</a>';
          }else{
            _html +='<a href="javascript:void(0);" class="btn btn-default" label="'+data[i].label+'" style="margin-right: 4px;">'+data[i].name+'</a>';
          }

        }
      }else{
        _html='该资源池下暂无集群';
      }
      $("#cluster").html(_html);
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

$('#slave_info').on('click','a',function(){
  $("#slave_info").find("a").removeClass("btn-info");
  $("#slave_info").find("a").removeClass("cpunum");
  $("#slave_info").find("a").addClass("btn-default");
  $(this).removeClass('btn-default');
  $(this).addClass('btn-info'); $(this).addClass('cpunum');
});

//自定义容器配置
function fnSelectConfigure(obj){
  $("#con_configure").find(".con_configure").removeClass("active");
  $(obj).addClass("active");
  if($(obj).find('h6').length>0){
    $("#addConfigureModal").modal("show");
    $("#con_CPU").val('0');$("#con_mem").val('0');
    $("#sample-onehandle4").val('0');
    $("#sample-onehandle5").val('0');
  }
  var cpu=$(obj).find(".cpu_mem").text().split('/')[0];
  $(".dockerContent").find(".docker_value").eq(1).val(parseFloat(cpu)*100000);
}

//自定义容器配置
$("#createCPUmem").click(function () {
  var cpu=$("#con_CPU").find('input').val();
  var mem=$("#con_mem").find('input').val();
  if($("#con_CPU").find('.input-group').css('display')=='none'){
    cpu=$("#con_CPU").find('select').select2('val');
  }
  if($("#con_mem").find('.input-group').css('display')=='none'){
    mem=$("#con_mem").find('select').select2('val');
  }
  createCPUmem(cpu, mem);
})
function createCPUmem(cpu, mem) {
  $("#con_configure").find(".con_configure").removeClass("active");
  var html = '';
  html = '<a class="jd pull-left margin-right-10 " href="javascript:;" >';
  html += '<div class="panel panel-default con_configure active">';
  html += '<div  class="panel-heading text-center cpu_mem" onclick="fnSelectConfigure(this)">';
  html += cpu + '核/' + mem + 'GB';
  html += '</div>';
  html += '<div class="panel-body text-center  darkgray" style="padding:10px 30px">自定义配置';
  html += '</div>';
  html += '</div>';
  html += ' </a>';
  $(".con_configureX").append(html);
}

function inBusy(content){
	$('#tips span').html(content);
	$('#tips').modal('show');
}
function alertShow(title, content){
	$('#MsgAlertTitle').html(title);
	$('#MsgAlertContent').html(content);
	$('#MsgAlertModal').modal('show');
}
function notBusy(){
	$('#tips').modal('hide');
}
function fnajax(){
  var cpu_mem=$(".con_configureX").find('.active div').text().split('/');
    var cpus_text = $('#CPU').find(".cpunum").text().split('C');
    var cpus_num = parseInt(cpus_text[0]);
    inBusy("Redis服务正在创建，请稍候...");
    var vols_ids=[];
    if($("#volume").val()!=null){
        vols_ids.push($("#volume").val());    	
    }
    
    var instances_num;
    if($("#slave_info").find(".cpunum").text()=="单节点"){
    	instances_num=1;
    }else{
    	instances_num=2;
    }
    var options=$("#sys_name option:selected");
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"services/redis",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "sys_id":$("#thirdResource").select2('val').split('/')[0],
		    "sys_name":$("#thirdResource").select2('val').split('/')[1],
		    "instances_num": instances_num,
		    "version": "2.8.24",
      "cpus":parseFloat(cpu_mem[0]),
      "mem": parseFloat(cpu_mem[1])*1024,
		    "disk":parseInt($("#disk").val()),
      "cluster_label":$("#cluster").find('.btn-info').attr('label')
		}),
		success:function (result) {
			notBusy();
      /*var data=result.msg;
      $('#successmodal').modal('show');
      $("#sever_address").text(data.calico_ip.join(','));
      /!*$("#sever_user").text(data.username);
      $("#sever_Password").text(data.password);*!/
      $("#sever_id").text(data.seq_id);*/
      window.location.href = '#/webcontent/server/servercluster.html';

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      notBusy();
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       /* alertShow("提示:", "Redis服务创建失败!");*/
        $('#failmodal').modal('show');
        $('#failSpan').text(JSON.parse(XMLHttpRequest.responseText).msg);
      }
    }
	});
}
function fnHerf(){
  window.location.href = '#/webcontent/server/mysql1.html?seq_id='+$("#sever_id").text()+'&seq_type=Redis&seq_status=1';
}
//获取网络、存储
function fngetData(){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/deployment/baseconfig",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				fnnet_Volume(data);

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
function fnnet_Volume(data){
	var net=data.network;
	$("#network").empty();
	for(var i=0;i<net.length;i++){
		var html='<option value="'+net[i]+'">'+net[i]+'</option>';
		$("#network").append(html);
	}
	
	var vol=data.volume;
	$("#volume").empty();
	for(var i=0;i<vol.length;i++){
		var html='<option value="'+vol[i].id+'">'+vol[i].name+'</option>';
		$("#volume").append(html);
	}
	//系统名称
	var sys=data.sys;
	$("#sys_name").empty();
	for(var i = 0; i < sys.length; i++){
		var a=sys[i];
		$("#sys_name").append("<option value='"+a[1]+"'>"+a[0]+"</option>");
	}
}


  function change(obj){
	  var inp_val=$(obj).val();
	  $(obj).val(inp_val.replace(/[^\d.]/g,''));
    var id=$(obj).attr("id");
    $("[name='"+id+"']").val(parseInt(inp_val));
  }

  menuValidator();
  //*****************验证 提交表单*************//
  function menuValidator(){

    $("#creatSysModal").bootstrapValidator({
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
//      	dataType: {
//              validators: {
//                  notEmpty: {
//                      message: '菜单名称不能为空'
//                  }
//              }
//          },
          dataKey: {
              validators: {
                  notEmpty: {
                      message: '键不能为空'
                  }
              }
          },
          value1:{
              validators: {
                  notEmpty: {
                      message: '值1不能为空'
                  }
              }
          }
      }
  });
  }
  /*function fnnoUiSlider(obj,inputobj,start,end){
  	//$(obj).destroy();
  	return $(obj).noUiSlider({
  	    range: [start, end],
  	    start: 0,
  	    step: 1,
  	    handles: 1,
  	    connect: "lower",
  	    serialization: {
  	        to: [$("#low"), 'html']
  	    },
  	    slide: function() {
  			var values = $(this).val();
  			$(inputobj).val(parseInt(values));
  		  }
  	});
  	//$( obj ).slider( "destroy" );	
  	
  }*/

function showSysName(province, city, town) {
  var title = ['一级域', '二级域', '系统名称'];
  $.each(title, function (k, v) {
    title[k] = '<option value="">' + v + '</option>';
  })

  $('#firstResource').append(title[0]);
  $('#secondResource').append(title[1]);
  $('#thirdResource').append(title[2]);

  $("#firstResource,#secondResource,#thirdResource").select2();
  fnGetFirst();
  $("#firstResource").on("select2:close",function(e){
    $('#secondResource').empty();
    $('#secondResource').append(title[1]);
    fnGetSeond($('#firstResource').select2('val').split('/')[0]);
  });

  $('#secondResource').on("select2:close",function (e) {
    $('#thirdResource').empty();
    $('#thirdResource').append(title[2]);
    fnGetThird($('#firstResource').select2('val').split('/')[0], $('#secondResource').select2('val').split('/')[0])
  });

  /*$('#thirdResource').on("select2:close",function (e) {
    fnGetServer();
  });*/
}
//系统名称的三级联动
function fnGetFirst() {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/fastdomain?type=app_business_domain",
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (result) {
      var data = result.data;
      $("#firstResource").empty();
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $("#firstResource").append('<option value="' + data[i].code+'/'+data[i].name + '">' + data[i].name + '</option>');
        }
      }
      fnGetSeond($("#firstResource").select2('val').split('/')[0]);
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

function fnGetSeond(first) {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/fastdomain?type=app_business_subdomain&domain_code=" + first,
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (result) {
      var data = result.data;
      $("#secondResource").empty();
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $("#secondResource").append('<option value="' + data[i].code + '/'+data[i].name +'">' + data[i].name + '</option>');
        }
      }
      if($('#secondResource').select2('val')!=null){
        fnGetThird($('#firstResource').select2('val').split('/')[0], $('#secondResource').select2('val').split('/')[0]);
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

function fnGetThird(first, second) {
  $.ajax({
    type: 'get',
    url: _URL_INTERFACE + "apps/fastdomain?type=app_business_sysdomain&domain_code=" + first + "&subdomain_code=" + second,
    headers: {
      "token": token
    },
    dataType: 'json',
    success: function (result) {
      var data = result.data;
      $("#thirdResource").empty();
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          $("#thirdResource").append('<option value="' + data[i].code +'/'+data[i].name + '">' + data[i].name + '</option>');
        }
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