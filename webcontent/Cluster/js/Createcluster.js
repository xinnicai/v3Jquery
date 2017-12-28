/*$(function () {
	
	
        $('#simplewizard').wizard();
        $('#simplewizard').wizard().on('finished', function (e) {
            //Notify('Thank You! All of your information saved successfully.', 'bottom-right', '5000', 'blue', 'fa-check', true);
        });
        //$('#WiredWizard').wizard();
    });*/
//初始化加载
function initialLoad(){
	initData();
	initselect2("#e2");
	initselect2("[aimip='destination_host']");
	initselect2("[Ha_host='Ha_host']");
	initselect2("[data-host='NginxIp']");
	initselect2("[slaveIp='slaveIp']");
	initselect2("#MarathonIp");
    fnGetPool();
}
function initselect2(obj){
	$(obj).select2({
        placeholder: "输入主机IP",
        allowClear: true
    });	
}
function initData(){
	
	//获取目标主机
	getZKIp("#e2");
	getZKIp("[aimip='destination_host']");
	getZKIp("[Ha_host='Ha_host']");
	getZKIp("[data-host='NginxIp']");
	getZKIp("[slaveIp='slaveIp']");
	
	$("#cluster_name").val();//集群名称
	$("#_ClusterAddLabel").val();//集群标签
	$("#_ClusterAddMasterNum").val();//节点数量
	
	//Marathon
	$("#simplewizardstep3").find(".port").val('8080');//端口 
	$("#simplewizardstep3").find(".path").val();//path 
	//$("#simplewizardstep3").find(".user_name").val();//用户名 
	//$("#simplewizardstep3").find(".user_password").val();//密码
	
	//Haproxy
	$("#simplewizardstep4").find("[Ha_host='Ha_host']").val();//目标主机 
	$("#simplewizardstep4").find(".sever_port").val("20010");//服务端口 
	$("#simplewizardstep4").find(".state_port").val("9000");//状态端口
	$("#simplewizardstep4").find(".MarathonIp").val();//Marathon地址
	//$("#simplewizardstep4").find(".MarathonUser").val();//Marathon用户名
	//$("#simplewizardstep4").find(".MarathonPass").val();//Marathon密码
	$("#simplewizardstep4").find(".Bambooport").val("8000");//Bamboo端口
	$("#simplewizardstep4").find(".hapath").val();//path
	
	//nginx
	// $("#simplewizardstep5").find("[data-host='NginxIp']").val();//目标主机
	// $("#simplewizardstep5").find(".uploadPort").val("80");//上传端口
	// $("#simplewizardstep5").find(".loadPort").val("81");//下载端口
	
	//Slave
	$("#simplewizardstep6").find("[slaveIp='slaveIp']").val();//目标主机
	$("#simplewizardstep6").find(".slaveContrains").val();//目标主机
}
function fnGetPool(){

    $.ajax({
        type: 'get',
        url: _URL_INTERFACE+"apps/domain?type=app_resources_production_domain",
        headers: {
            "token": token
        },
        dataType: 'json',
        success:function (result) {
            var data=result.data;
            $("#ResourcesPool").empty();
            var _html='';
            _html +='<option value="">请选择资源池</option>';
            if(data && data.length>0){
                for(var i=0;i<data.length;i++){
                    _html +='<option value="'+data[i].code+'">'+data[i].name+'</option>';
                }
            }
            $("#ResourcesPool").html(_html);
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
function selectChangeaaa(){
	console.log($('#ResourcesPool').val());
}
//约束检查
function checkContrains(obj){
	var valArr=$(obj).val().split(':');
	if(valArr[0] == ''){
		$(obj).nextAll(".warning").html("该项不能为空，请输入");
	}else if(valArr.length<=1){
		$(obj).nextAll(".warning").html("请检查约束规则");
	}
}
//数据处理
var gloableData;
function handleData(){
	var cluster_name=$("#cluster_name").val();//集群名称
	var cluster_label=$("#_ClusterAddLabel").val();//集群标签
	
	var cluster_num;//节点数量
	var num=$("#_ClusterAddMasterNum").val();
	if(num!=""){
		cluster_num=parseInt(num);
	}else{
		cluster_num='';
	}
	
	var zk_and_master=$("#e2").select2("val");
	var zk_and_master_info=[],zk_str=[],zk_arr=[],mesos_arr=[];
	for(var i=0;i<zk_and_master.length;i++){
		zk_str.push(zk_and_master[i]+":2181");
		zk_and_master_info .push(zk_and_master[i]+':5050');
		var zk={"host":zk_and_master[i],"port":"2181"};
		zk_arr.push(zk);
		var mesos={"host":zk_and_master[i],"port":"5050"};
		mesos_arr.push(mesos);
  }
  zk_str=zk_str.join(",");
	zk_and_master_info=zk_and_master_info.join(",");
	$("#Master_ZK").html('');
	$("#Master_ZK").html(zk_and_master.join(","));	
	
	//marathon
	var marathon=[];
	var marathon_info='';
	$("#Marathon_info").empty();
	$(".Marathon_main").each(function(i){
		var ip=$("#simplewizardstep3").find("[aimip='destination_host']").eq(i).select2("val");
		//ip=ip.join(',');//目标主机 
		var port=$("#simplewizardstep3").find(".port").eq(i).val();//端口 
		var path=$("#simplewizardstep3").find(".path").eq(i).val();//path 
		//var username=$("#simplewizardstep3").find(".user_name").eq(i).val();//用户名 
		//var password=$("#simplewizardstep3").find(".user_password").eq(i).val();//密码
		var marathon_content = {"host":ip, "port":port, "name":path, "username":'dcosadmin', "password":'zjdcos01'};
		marathon.push(marathon_content);
		
		marathon_info='<tr><td>'+ip+'</td><td>'+port+'</td><td>'+path+'</td></tr>';
		$("#Marathon_info").append(marathon_info);
	});
	//Haproxy
	var haproxy=[];
	var Haproxy_info='';
	$("#Haproxy_info").empty();
	$(".Haproxy_main").each(function(i){
		var ip=$("#simplewizardstep4").find("[Ha_host='Ha_host']").eq(i).select2("val");
		//ip=ip.join(',');//目标主机 
		var port=$("#simplewizardstep4").find(".sever_port").eq(i).val();//服务端口 
		var stat_port=$("#simplewizardstep4").find(".state_port").eq(i).val();//状态端口
		if(i==0){
			var marathon_endpoint=$("#simplewizardstep4").find("#MarathonIp").select2("val");//Marathon地址
		}else{
			var marathon_endpoint=$("#simplewizardstep4").find("#MarathonIp"+i).select2("val");//Marathon地址
		}
		//marathon_endpoint=marathon_endpoint.join(",");
		//var username=$("#simplewizardstep4").find(".MarathonUser").eq(i).val();//Marathon用户名
		//var password=$("#simplewizardstep4").find(".MarathonPass").eq(i).val();//Marathon密码
		var ipPort=ip;
		var bamboo_endpoint=ipPort+":"+$("#simplewizardstep4").find(".Bambooport").eq(i).val();//Bamboo端口
		var path=$("#simplewizardstep4").find(".hapath").eq(i).val();//path
		var Haproxy_content={'host':ip,
	            'service_port':port,
	            'port':stat_port,
	            'marathon_endpoint':marathon_endpoint,
	            'username':'dcosadmin',
	            'password':'zjdcos01',
	            'bamboo_endpoint':bamboo_endpoint,
	            'bamboo_path':path};
		haproxy.push(Haproxy_content);
		Haproxy_info='<tr><td>'+ip+'</td><td>'+port+'</td><td>'+stat_port+'</td><td>'+bamboo_endpoint+'</td><td>'+marathon_endpoint+'</td><td>'+path+'</td></tr>';
		$("#Haproxy_info").append(Haproxy_info);
	});
	
	//nginx:
	// var nginx=[];
	// var Nginx_info='';
	// $("#Nginx_info").empty();
	// $(".Nginx_main").each(function(i){
	// 	var ip=$("#simplewizardstep5").find("[data-host='NginxIp']").eq(i).select2("val");
	// 	//ip=ip.join(',');//目标主机
	// 	var up_port=$("#simplewizardstep5").find(".uploadPort").eq(i).val();//上传端口
	// 	var down_port=$("#simplewizardstep5").find(".loadPort").eq(i).val();//下载端口
	// 	var nginx_content={'host':ip,'up_port':up_port,'down_port':down_port};
	// 	nginx.push(nginx_content);
	// 	Nginx_info='<tr><td>'+ip+'</td><td>'+up_port+'</td><td>'+down_port+'</td></tr>';
	// 	$("#Nginx_info").append(Nginx_info);
	// });
	
	//slave:
	var slave=[];
	/*$(".Slave_main").each(function(i){
		var ip=$("#simplewizardstep6").find("[slaveIp='slaveIp']").eq(i).select2("val");
		//ip=ip.join(',');//目标主机
		var attributes=$("#simplewizardstep6").find(".slaveContrains").eq(i).val();//约束
			var slave_content={'ip':ip,'attributes':attributes};
			slave.push(slave_content);
	});*/
	gloableData= JSON.stringify({
		'resource_pool':$('#ResourcesPool').val(),
		'cluster_name':cluster_name,
		"remark": "",
		"cluster_type": "master",
		"master_id": "",
		"create_user": "admin",
	    'cluster_label':cluster_label,
	    'cluster_num':cluster_num,
	    "marathon_str": "",
	    "registry": $("#imgageaddr").val(),
	    
	    "zk_str": zk_str,
	    "mesos_str": zk_and_master_info,
	    "zk": zk_arr,
	    "mesos-master":mesos_arr,

	    //'zk_and_master':zk_and_master,
	    'marathon':marathon,
	    'haproxy':haproxy,
	    // 'nginx':nginx,
	    'mesos-slave':slave
	});
	$('#master_name').html(cluster_name);
	$("#master_label").html(cluster_label);
	$("#node_num").html(cluster_num);
	$('#_NextBtn').text("创建");
	
}
function fnCreateMaster(val,wz){
	wz.wizard('next');
	$('#tips').modal({
		keyboard: false, backdrop: 'static'
	});
	$('#tips').modal('show');
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"cluster",
    headers: {
      "token": token
    },
		timeout:600000,
		dataType: 'json',
		data:val ,
		success:function (result) {
			$('#_NextBtn').replaceWith('<a href="#/webcontent/Cluster/Clusterlist.html" class="btn btn-azure " id="_NextBtn"  style="height: 32px;width: 75px;line-height: 18px;">完成</a>');
			var data=result.data;
				$('#tips').modal('hide');
				var _html='<h2 class="text-center success"><i class="glyphicon glyphicon-check"></i>集群创建成功</h2>';
				$("#simplewizardstep7").html(_html);
				wz.find('.steps li').each(function (idx, item) {
					$(this).on('click', function (e) {
						e.preventDefault();
						return false;
					});
				});
				$("#_ReturnBtn").prop('disabled',true);

		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $('#tips').modal("hide");
        var _html='<h2 class="text-center danger"><i class="glyphicon glyphicon-check"></i>集群创建失败</h2>';
        $("#simplewizardstep7").html(_html);
        $("#simplewizardstep7").append('<div class="text-center" style="font-size:16px;">原因</div>');
//				fnReturnData(data.id);
      }
    }
	});
}
//function fnReturnData(data){
//	$.ajax({
//		type: 'post', 
//		url: '/iCloud/cluster/startCluster.dox',
//		dataType: 'json',
//		//async:false,
//		data:{
//			'id':data
//		},
//		success:function (result) {
//			$('#tips').modal('hide');
//			var data = result.data;
//			if(data.success==false){
//				var _html='<h2 class="text-center danger"><i class="glyphicon glyphicon-check"></i>集群创建失败</h2>';
//				$("#simplewizardstep7").html(_html);
//				$("#simplewizardstep7").append('<div class="text-center" style="font-size:16px;">原因：'+data.msg.msg+',请联系管理员</div>');
//			}else if(data.success==true){
//				var _html='<h2 class="text-center success"><i class="glyphicon glyphicon-check"></i>集群创建成功</h2>';
//				$("#simplewizardstep7").html(_html);
//				//创建完成之后不允许再返回
//				wz.find('.steps li').each(function (idx, item) {
//					$(this).on('click', function (e) {
//						e.preventDefault();
//						return false;
//					});
//				});
//				$("#_ReturnBtn").prop('disabled',true);
//			}	
//		}
//	});
//}
//++++++Marathon   width:235px
var clickindex=1;
function addMarathon(obj){
	clickindex++;
	var Marathon_main =' <div class="row Marathon_main">'
        +'<div class="col-sm-3">'
        +'<div class="form-group">'
        +'<label for="exampleInputEmail2">目标主机</label>'
        +'<select id="Marathon'+clickindex+'" style="width: 100%;" aimip="destination_host" onfocus=""></select>'
        +'<span style="color:#858585">Marathon的主机IP</span>'
        +'<span class="warning"></span>'
        +'</div>'
        +'</div>'
        +'<span class="Marathon_spanMain">'
        +$(".Marathon_spanMain").html()
        +'</span>'
        +'<div class="col-sm-2" style="margin-top:25px">'
	    +'<div class="btn btn-default" onclick="removeElement(this)"><i class="glyphicon glyphicon-minus"></i></div>'
	    +'</div>'
        +'</div>';
	$(obj).before(Marathon_main);
	initselect2("[aimip='destination_host']");
	getZKIp("#Marathon"+clickindex);	
}
//+++Haproxy
var Haindex=0;
function addHaproxy(obj){
	Haindex++;
	clickindex++;
var Haproxy_main='<div style="border:1px solid #ddd; padding:10px;margin-bottom:10px;">'
        +'<div style="margin-top:-20px;margin-bottom:10px">'
        +'<a class="btn btn-danger btn-sm" href="javascript:void(0);" onclick="removeElement(this)">删除</a>'
        +'</div>'
        +'<div class="row Haproxy_main">'
        +'<div class="col-sm-3">'
        +'<div class="form-group">'
        +' <label for="exampleInputEmail2">目标主机</label>'
        +'<select id="Haproxy'+clickindex+'"  style="width: 100%;" Ha_host="Ha_host" ></select> '
        +'<span style="color:#858585">Haproxy的主机IP</span>'
        +'<span class="warning"></span>  '
        +'</div>'
        +'</div>'
        +'<span class="Haproxy_spanMain">'
        +' <div class="col-sm-3">'
        +'<div class="form-group">'
        +'<label for="exampleInputEmail2">服务端口</label>'
        +'  <input type="number" class="form-control checkport sever_port inputindex" onkeyup=\'this.value=this.value.replace(/\D/g,"'+""+'")\' placeholder="只能输入数字">  ' 
        +'<span style="color:#858585">Haproxy的服务端口</span>  '
        +'<span class="warning"></span>'
        +'</div>'
        +'</div>'
        +'<div class="col-sm-3">'
        +'<div class="form-group">'
        +'<label for="exampleInputName2">状态端口</label>'
        +'<input type="number" class="form-control checkport state_port inputindex" onkeyup=\'this.value=this.value.replace(/\D/g,"'+""+'")\' placeholder="只能输入数字"> '  
        +'<span style="color:#858585">Haproxy的状态查询端口</span>  '
        +'<span class="warning"></span>'
        +'</div>'
        +'</div>'
        +'<div class="col-sm-3">'
        +'<div class="form-group">'
        +'<label for="exampleInputName2">Bamboo端口</label>'
        +'<input type="number" class="form-control checkport Bambooport inputindex" onkeyup=\'this.value=this.value.replace(/\D/g,"'+""+'")\' placeholder="只能输入数字">  ' 
        +'<span style="color:#858585">Bamboo的服务端口</span>  '
        +'<span class="warning"></span>'
        +'</div>'
        +'</div>'
        +'</div>  '
        +'<div class="row Bamboomrrow">'
        +'<div class="col-sm-9">'
        +'<div class="form-group">'
        +' <label for="exampleInputName2">Marathon地址</label>'
        //+'<input type="text" class="form-control MarathonIp inputindex" >  '
        +'<select id="MarathonIp'+Haindex+'" class="MarathonIp " style="width: 100%;paddig:2px 0;"></select>'
        +'<span style="color:#858585">Haproxy的Marathon地址</span> '
        +'<span class="warning"></span> '
        +'</div>'
        +'</div>'
        +'<div class="col-sm-3">'
        +'<div class="form-group">'
        +'<label for="exampleInputName2">HaproxyID</label>'
        +'<input type="text" class="form-control hapath inputindex" > '
        +'<span style="color:#858585">Haproxy的ID</span>  '
        +'<span class="warning"></span> '
        +'</div>'
        +'</div>'
        +'</div>'
        +'</span>'
        +'</div>';
	$(obj).before(Haproxy_main);
	initselect2("[Ha_host='Ha_host']");
	initselect2("#MarathonIp"+Haindex);
	getZKIp("#Haproxy"+clickindex);
	HaMarathonIp("#MarathonIp"+Haindex);
	
	
}
//+++Nginx
function addNginx(obj){
	clickindex++;
	var Nginx_main='<div class="row"><div class="Nginx_main">' 
		+'<div class="col-sm-4">'
		+'<div class="form-group">'
		+'<label for="exampleInputEmail2">目标主机</label>'
		+'<select id="Nginx'+clickindex+'" style="width: 100%;" data-host="NginxIp"></select>'
		+'<span style="color:#858585">Nginx的主机IP</span> '
		+'<span class="warning"></span>'
		+'</div>'
		+'</div>'
		+'<span class="Nginx_spanMain">'
		+ $(".Nginx_spanMain").html()+'</span>'+'</div>'
		+'<div class="col-sm-1 no-padding-right" style="margin-top:25px">'
        +'<div class="btn btn-default" onclick="removeElement(this)"><i class="glyphicon glyphicon-minus"></i></div>' 
        +'</div>'
        +'</div>';
	$(obj).before(Nginx_main);
	initselect2("[data-host='NginxIp']");
	getZKIp("#Nginx"+clickindex);
	
	
}
//+++slave
function addSlave(obj){
	clickindex++;
	var Slave_main='<div class="row"><div class="Slave_main">'
		+'<div class="col-sm-6">'
		+'<div class="form-group">'
		+'<label>目标主机</label>'
		+'<select id="Slave'+clickindex+'" style="width: 100%;" slaveIp="slaveIp"></select>'
		+'<span class="warning"></span>'
            +'</div>'
            +'</div>'
            +'<span class="Slave_spanMain">'
		+ $(".Slave_spanMain").html()+'<span>'+'</div>'
		+'<div class="col-sm-1" style="margin-top:25px">'
        +'<button class="btn btn-default" onclick="removeElement(this)"><i class="glyphicon glyphicon-minus"></i></button>'
        +'</div></div>';
	$(obj).before(Slave_main);
	initselect2("[slaveIp='slaveIp']");
	getZKIp("#Slave"+clickindex);
}
//删除
function removeElement(obj){	
	var pObj = obj.parentNode.parentNode;
	pObj.parentNode.removeChild(pObj);
}
//获取目标主机
function getZKIp(obj){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"cluster/host/free",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data = result.data;
			var _htmlOption="<option value='请选择'>请选择</option>";
			$(obj).html(_htmlOption);
//			$("#e2").empty();
//			$("[aimip='destination_host']").html(_htmlOption);
//			$("[Ha_host='Ha_host']").html(_htmlOption);
//			$("[data-host='NginxIp']").html(_htmlOption);
//			$("[slaveIp='slaveIp']").html(_htmlOption);
			//$("[data-host='NginxIp']").empty();
			
			if(data){
				for (var i = 0; i < data.length; i++){
					//var val=data[i].id+"#"+data[i].ip_addr;
					var option="<option value='"+data[i].ip_addr+"'>"+data[i].ip_addr+"</option>";
					$(obj).append(option);
//					$("#e2").append(option);
//					$("[aimip='destination_host']").append(option);
//					$("[Ha_host='Ha_host']").append(option);
//					$("[data-host='NginxIp']").append(option);
//					$("[slaveIp='slaveIp']").append(option);
					//$("[data-host='NginxIp']").append(option);
				}
				
				//$('#e2').selectpicker('refresh');
			}
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
function modalControl(wz) {
	var target = $('.page-body');
	//target.on('hidden.bs.modal', function (e) {
		while (wz.wizard('selectedItem').step != 1) {
			wz.wizard('previous');
		}
		//$('#_ReturnBtn').show();
		$('#_NextBtn').show();
		wz.find('.steps li').each(function (idx, item) {
			$(this).off('click');
		});
	//});
}
$(function () {
	var wz = $('#simplewizard').wizard();
	modalControl(wz);
	
	// 点击下一步判断是否选择app
	$('#_NextBtn').click(function (e) {
		var step = wz.wizard('selectedItem').step;
		if (step === 1) {
			checkStep1AndGoOn(wz);
		}
		if (step === 2) {
			
			checkStep2AndGoOn(wz);
		}
		if (step === 3) {
			
			checkStep3AndGoOn(wz,"#simplewizardstep3");
		}
		if (step === 4) {
			
			checkStep3AndGoOn(wz,"#simplewizardstep4");
            // complete(wz);
		}
		if (step === 5) {
			
			// checkStep3AndGoOn(wz,"#simplewizardstep5");
            fnCreateMaster(gloableData,wz);
			//complete(wz);
		}
		// if (step === 6) {
		//
		// 	//complete(wz);
		// 	fnCreateMaster(gloableData,wz);
		// }
	});
	

	wz.find('.steps li').each(function (idx, item) {
		$(this).on('click', function (e) {
			if(idx==5){
				
					$("_NextBtn").text('创建');
				
			}else if(idx==6){
				$("_NextBtn").text('完成');
			}else{
				$("_NextBtn").text('下一步');
			}
		});
	});
});
//非空判断
function checkStep1AndGoOn(wz){
	
	var index=0;
	var inputVal=$("#simplewizardstep1").find('input');
	for(var i=0;i<inputVal.length;i++){
		var aaaa=inputVal.eq(i);
		if(aaaa.val()==''){
			aaaa.nextAll(".warning").html("该项不能为空，请输入");
			return;
		}else{
			aaaa.nextAll(".warning").html("");
		}
	}
	var cluster_num=$("#_ClusterAddMasterNum").val();//节点数量
	if( cluster_num==''){
		$("#_ClusterAddMasterNum").nextAll(".warning").html("该项不能为空，请选择");
		return;
	}else{
		$("#_ClusterAddMasterNum").nextAll(".warning").html("");
	}
	
	var english=$("#_ClusterAddLabel").val();
	var patt1=new RegExp("^[a-zA-Z]+$");
	if(!patt1.test(english)){
		$("#_ClusterAddLabel").nextAll(".warning").html("只能输入英文，请重输");
		return;
	}else{
		$("#_ClusterAddLabel").nextAll(".warning").html('');
	}
	
	wz.wizard('next');
}

var agip_port=[];
function checkStep2AndGoOn(wz){
	agip_port=[];
	var cluster_num;//节点数量
	var num=$("#_ClusterAddMasterNum").val();
	var zk_and_master=$("#e2").select2("val");
	if(zk_and_master.length && zk_and_master.length==num){
		if(zk_and_master.indexOf("请选择") >= 0 ){
			$("#e2").nextAll(".warning").html("请重新选择");

		}else{
			$("#e2").nextAll(".warning").html("");
			$.each(zk_and_master,function(i,item){
				agip_port.push(item+"#2181");
				agip_port.push(item+"#5050");
			});
			wz.wizard('next');
		}
	}else{
		$("#e2").nextAll(".warning").html("Master主机数量与配置不符，当前配置的Master节点数量为"+num+"个");

	}
}
function checkStep3AndGoOn(wz,obj){
	var flag=true;
	//非空验证
	var inputVal=$(obj).find('.inputindex');
	var selectVal=$(obj).find('select');
	
	for(var i=0;i<selectVal.length;i++){
		var bbbb=selectVal.eq(i);
	
		if(bbbb.select2('val')=='请选择'){
			bbbb.nextAll(".warning").html("该项不能为空，请选择");
			return;
		}else if(bbbb.select2('val')==''){
			bbbb.nextAll(".warning").html("该项不能为空，请选择");
			return;
		}else{
			bbbb.nextAll(".warning").html("");
		}
	}
	
	for(var i=0;i<inputVal.length;i++){
		var aaaa=inputVal.eq(i);
		if(aaaa.val()==''){
			aaaa.nextAll(".warning").html("该项不能为空，请输入");
			return;
		}else{
			aaaa.nextAll(".warning").html("");
		}
	}
	
	
	//端口验证
	var ip_port=[];
	
	if(obj=="#simplewizardstep3"){
		ip_port=agip_port;
		var globalHaMara=[];
		$(".Marathon_main").each(function(i){
			var ip=$("#simplewizardstep3").find("[aimip='destination_host']").eq(i).select2("val");
			ip=ip;
			var port=$("#simplewizardstep3").find(".port").eq(i).val();//端口 
			globalHaMara.push(ip+':'+port);	
		});
		for(var i=0;i<globalHaMara.length;i++){
				if(globalHaMara[i]==globalHaMara[i+1]){
					$("#simplewizardstep3").find(".port").eq(i+1).nextAll(".warning").html("该port已占用，请重输");
					flag=false;
					return
				}else{
					//ip_port.push(pp[j]);
					$("#simplewizardstep3").find(".port").eq(i+1).nextAll(".warning").html("");
					//flag=true;
				}
		}
		HaMarathonIp('#MarathonIp');
	}else if(obj=="#simplewizardstep4"){
		var Marathon_path=[],Haproxy_path=[];Haproxy_port=[];
		$(".Marathon_main").each(function(i){
			var ip=$("#simplewizardstep3").find("[aimip='destination_host']").eq(i).select2("val");
			var port=$("#simplewizardstep3").find(".port").eq(i).val();//端口 
			var path=$("#simplewizardstep3").find(".path").eq(i).val();//path
			ip_port.push(ip+'#'+port);
			Marathon_path.push(path);
		});

		$(".Haproxy_main").each(function(i){
			var path=$("#simplewizardstep4").find(".hapath").val();//path
			Haproxy_path.push(path);
			
			var ip=$("#simplewizardstep4").find("[Ha_host='Ha_host']").eq(i).select2("val");
			var port=$("#simplewizardstep4").find(".sever_port").eq(i).val();//服务端口 
			var stat_port=$("#simplewizardstep4").find(".state_port").eq(i).val();//状态端口
			var bamboo_endpoint=$("#simplewizardstep4").find(".Bambooport").eq(i).val();//Bamboo端口
			
			Haproxy_port.push( ip+'#'+port );
			Haproxy_port.push(ip+'#'+stat_port);
			Haproxy_port.push(ip+'#'+bamboo_endpoint);
		});
		
		for(var i=0;i<Marathon_path.length;i++){
			for(var j=0;j<Haproxy_path.length;j++){
				if(Marathon_path[i]==Haproxy_path[j]){
					$(obj).find(".hapath").eq(j).nextAll(".warning").html("该path已占用，请重输");
					flag=false;
					return
				}else{
					$(obj).find(".hapath").eq(j).nextAll(".warning").html("");
				}
			}
		}
		flag=portIsExist(obj,ip_port,Haproxy_port);
	}
    if(flag!=false){
        if(obj=="#simplewizardstep4"){
            $("#simplewizardstep7").empty();
            handleData();
        }
        wz.wizard('next');
    }
	// else if(obj=="#simplewizardstep5"){
	//
	// 	$(".Marathon_main").each(function(i){
	// 		var ip=$("#simplewizardstep3").find("[aimip='destination_host']").eq(i).select2("val");
	// 		var port=$("#simplewizardstep3").find(".port").eq(i).val();//端口
	// 		ip_port.push(ip+'#'+port);
	//
	// 	});
	// 	$(".Haproxy_main").each(function(i){
	// 		var ip=$("#simplewizardstep4").find("[Ha_host='Ha_host']").eq(i).select2("val");
	// 		var port=$("#simplewizardstep4").find(".sever_port").eq(i).val();//服务端口
	// 		var stat_port=$("#simplewizardstep4").find(".state_port").eq(i).val();//状态端口
	// 		var bamboo_endpoint=$("#simplewizardstep4").find(".Bambooport").eq(i).val();//Bamboo端口
	//
	// 		ip_port.push( ip+'#'+port );
	// 		ip_port.push(ip+'#'+stat_port);
	// 		ip_port.push(ip+'#'+bamboo_endpoint);
	//
	// 	});
	//
	// 	var ip=$(obj).find("select").select2("val");
	// 	var port=$(obj).find(".checkport");//端口
	// 	var pp=[];
	// 	for(var i=0;i<port.length;i++){
	// 		pp.push(ip+'#'+port.eq(i).val());
	// 	}
	// 	flag=portIsExist(obj,ip_port,pp);
	// 	wz.find('.steps li').each(function (idx, item) {
	// 		$(this).on('click', function (e) {
	// 			$('#_NextBtn').text("下一步");
	// 		});
	// 	});
	// }
		
		

	
}
function changeNbtn(){
	$('#_NextBtn').text("下一步");
}
function HaMarathonIp(obj){
	var globalHaMara=[];
	
	var deffpath=[];
	$(".Marathon_main").each(function(i){
		var path=$("#simplewizardstep3").find(".path").eq(i).val();//path
		deffpath.push(path);
	});
	var arr=[deffpath[0]];  
    for(var i = 1; i < deffpath.length; i++){    
        if(deffpath.indexOf(deffpath[i]) == i){  
           arr.push(deffpath[i]);  
        }  
    }  
    
	for(var j=0;j<arr.length;j++){
		var seMa='';
		$(".Marathon_main").each(function(i){
			var ip=$("#simplewizardstep3").find("[aimip='destination_host']").eq(i).select2("val");
			ip=ip;
			var port=$("#simplewizardstep3").find(".port").eq(i).val();//端口 
			var path=$("#simplewizardstep3").find(".path").eq(i).val();//path \
			
			if(path==arr[j]){
				if(seMa==''){
					seMa=ip+':'+port;
				}else{
					seMa=seMa+","+ip+':'+port;
				}
			}
		});
		globalHaMara.push(seMa);
	}
	
	$(obj).empty();
	for (var i = 0; i < globalHaMara.length; i++){
		var option="<option value='"+globalHaMara[i]+"'>"+globalHaMara[i]+"</option>";
		$(obj).append(option);
	}
	
}


function selectChange(){
	var val=$("#_ClusterAddMasterNum").val();
	$("#_ClusterAddMasterNum").nextAll(".warning").html("");
	if(val==1){
		$("#_ClusterAddMasterNum").next(".masterNote").html("初级版 1 Master，开发环境使用，适合6台主机以内使用");
	}else if(val==3){
		$("#_ClusterAddMasterNum").next(".masterNote").html("高级版 3 Masters，基础生产环境使用，适合30台主机以内使用");
	}else if(val==5){
		$("#_ClusterAddMasterNum").next(".masterNote").html("企业版 5 Masters，高容错级生产环境使用，适合30台主机以上使用");
	}else if(val==''){
		$("#_ClusterAddMasterNum").next(".masterNote").html("");
		$("#_ClusterAddMasterNum").nextAll(".warning").html("该项不能为空，请选择");
	}
}

function portIsExist(obj,a,b){
	for(var i=0;i<a.length;i++){
		for(var j=0;j<b.length;j++){
			if(a[i]==b[j]){
				$(obj).find(".checkport").eq(j).nextAll(".warning").html("该端口已占用，请重输");
				return false;
			}else{
				$(obj).find(".checkport").eq(j).nextAll(".warning").html("");
			}
		}
	}
	for(var j=0;j<b.length;j++){
		for(var k=0;k<b.length;k++){
			if(k!=j){
				if(b[k]==b[j]){
					$(obj).find(".checkport").eq(j).nextAll(".warning").html("该端口已占用，请重输");
					return false;
				}else{
					$(obj).find(".checkport").eq(j).nextAll(".warning").html("");
				}
			}
		}
	}
}

