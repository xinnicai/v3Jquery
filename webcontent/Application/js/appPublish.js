$(document).ready(function (){
	fnBaseConfig();
	initImageSelect();//镜像
	fnPageType();
	
	fnnoUiSlider("#sample-onehandle","#sys_CPU",0,100);
	fnnoUiSlider("#sample-onehandle2","#sys_mem",0,100);
	fnnoUiSlider("#sample-onehandle3","#sys_disk",0,100);
	
	fnnoUiSlider("#sample-onehandle4","#con_CPU",0,100);
	fnnoUiSlider("#sample-onehandle5","#con_mem",0,100);
	fnnoUiSlider("#sample-onehandle6","#con_disk",0,100);
});

var params = parseParams(self.location.search);
var pagetype = params.pagetype;
var appId = params.app_id;

function fnPageType(){
	if(pagetype=='create' && appId==''){
		fnInitValue();//初始化数据
	}else{
		fnCloneUpdate(appId);
	}
}
//***********更新*************//
function fnCloneUpdate(d){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/detail?app_id="+d,
		    "_method": "GET",
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				fnUpdataApp(data);
				//fnIfEmpty("#cluster_master");
			}
		}
	});
}
function fnUpdataApp(result){
	$("#createappbtn").text("更新");
	$("#appid").text(result.app_id);
	var deployment=result.deployment;
	//$("#evn").find("input[value='"+deployment.env+"']").prop("checked",true);
	$("#deployMode").val(deployment.deploy_mode);
	$("#app_origin").val(deployment.app_origin);
	var app_origin_detail=deployment.app_origin_detail;
	if(deployment.app_origin=="fwqxz"){
		$("#fwqxz").show();
		$("#ftp_ip").val(app_origin_detail.ftp_ip);
		$("#ftp_port").val(app_origin_detail.ftp_port);
		$("#ftp_passwd").val(app_origin_detail.ftp_passwd);
		$("#filename").val(app_origin_detail.filename);
	    $("#ftp_username").val(app_origin_detail.ftp_username);
	    $("#path").val(app_origin_detail.path);
	}else{
		$("#fwqxz").hide();
		$("#ftp_ip").val('');
		$("#ftp_port").val('');
		$("#ftp_passwd").val('');
		$("#filename").val('');
	    $("#ftp_username").val('');
	    $("#path").val('');
	}
	
	var resource=deployment.resource;
	$("#cluster_master a").attr("class","btn btn-default");
	$("#cluster_master a").each(function(i,obj){
		$.each(resource,function(k,item){
			if($(obj).text()==item.name){
				$(obj).attr("class","btn btn-info margin-right-10");
			}
		});
	});
	
    var app=result.app;
    $("#sys_name").prop("disabled",true);
    $("#sys_name").val(result.sys_id);
    $("#model_name").val(app.model_name);
    $("#dns_route").val(app.dns_route);
    
  var container=result.container;
//    $("#CPU").val(container.cpu);
//    $("#mem").val(container.mem);
    if(container.cpu=='2' || container.cpu/1000=='4'){
    	if(container.mem/1000=='4' || container.mem/1000=='8' || container.mem/1000=='16'){
    		var objconfigure=$("#con_configure").find(".con_configure");
    		objconfigure.removeClass("active");
    		$(objconfigure).each(function(i,obj){
    			var cpu_mem=$(obj).find('.cpu_mem').text().split('/');
			    var cpu=parseInt(cpu_mem[0]);
			    var mem=parseInt(cpu_mem[1]);
    				if(cpu==container.cpu && mem==container.mem/1000){
    					$(obj).attr("class","panel panel-default con_configure active");

    				}else{
    					$(obj).attr("class","panel panel-default con_configure");
    				}
    		
    		});
    	}else{
    		createCPUmem(container.cpu,container.mem/1000);
    	}
    }else{
    	createCPUmem(container.cpu,container.mem/1000);
    }
//    $("#disk").val(container.disk);
    var diskobj=$("#selectdiskX").find('a'),diskarr=['40','50','65','70','80','85','90','95','100','105'];
    if($.inArray(container.disk/1000, diskarr)==-1){
    	createDisk(container.disk/1000);
    }else{
    	$(diskobj).each(function(i,obj){
    		if($(obj).text()==container.disk/1000+'G'){
    			$(obj).attr("class","btn btn-info margin-right-10");

    		}else{
    			$(obj).attr("class","btn btn-default margin-right-10");
    		}
    	
    	});
    }
    
    
    $("#instance").val(container.instance);
    $("#image").val(container.image);
    $("#cmd").val(container.cmd);
    $("#cluster_cons").selectpicker('val',container.constraint);//约束

    
    var docker=container.docker_params;//docker
    if(docker.length > $(".dockerContent").length){
		for(var i =0;i<docker.length-1;i++){
			var portMappingsContent = "<div class=\"dockerContent\">" + $(".dockerContent").html() + "<\/div>";
			$("#docker").append(portMappingsContent);
        }
    } else {
		$(".dockerContent").each(function(i,obj){
    		if(i <= docker.length-1 && docker.length >= 1){
    			$(obj).find("[name='key']").val('');
				$(obj).find("[name='value']").val('');
    		} else if(docker.length == 0 && i == 0){
    			$(obj).find("[name='key']").val('');
				$(obj).find("[name='value']").val('');
    		} else {
    			obj.remove();
    		}
    	});
    }
    $(".dockerContent").each(function(i,obj){
		$.each(docker,function(k,item){
			if(i==k){
				$(obj).find("[name='key']").val(item.key);
				$(obj).find("[name='value']").val(item.val);
			}
		});
	});
    
    var objenv=container.env;//环境变量
    if(objenv.length > $(".envContent").length){
		for(var i =0;i<objenv.length-1;i++){
			var portMappingsContent = "<div class=\"envContent\">" + $(".envContent").html() + "<\/div>";
			$(".envContentX").append(portMappingsContent);
        }
    } else {
		$(".envContent").each(function(i,obj){
    		if(i <= objenv.length-1 && objenv.length >= 1){
    			$(obj).find("[name='env_key']").val('');
				$(obj).find("[name='env_value']").val('');
    		} else if(objenv.length == 0 && i == 0){
    			$(obj).find("[name='env_key']").val('');
				$(obj).find("[name='env_value']").val('');
    		} else {
    			obj.remove();
    		}
    	});
    }
    $(".envContent").each(function(i,obj){
		$.each(objenv,function(k,item){
			if(i==k){
				$(obj).find("[name='env_key']").val(item.key);
				$(obj).find("[name='env_value']").val(item.val);
			}
		});
	});
    
    var network=result.network;
   // $("#net_type").find("input[value='"+network.type+"']").prop("checked",true);
    $("#net_type").val(network.type);
    var net_detail=network.detail;
    if(net_detail.length > $(".netContent").length){
		for(var i =0;i<volume.length-1;i++){
			var portMappingsContent = "<div class=\"netContent\">" + $(".netContent").html() + "<\/div>";
			$(".netContentX").append(portMappingsContent);
        }
    } else {
		$(".netContent").each(function(i,obj){
    		if(i <= net_detail.length-1 && net_detail.length >= 1){
    			$(obj).find("[name='container_port']").val('');
				$(obj).find("input[name='host_port']").val('');
				$(obj).find("[name='net_http']").val('');
				$(obj).find("[name='network']").selectpicker('val','');
    		} else if(net_detail.length == 0 && i == 0){
    			$(obj).find("[name='container_port']").val('');
				$(obj).find("input[name='host_port']").val('');
				$(obj).find("[name='net_http']").val('');
				$(obj).find("[name='network']").selectpicker('val','');
    		} else {
    			obj.remove();
    		}
    	});
    }
    $(".netContent").each(function(i,obj){
		$.each(net_detail,function(k,item){
			if(i==k){
				$(obj).find("[name='container_port']").val(item.c_port);
				$(obj).find("input[name='host_port']").val(item.h_port);
				$(obj).find("[name='net_http']").val(item.protocol);
				$(obj).find("[name='network']").selectpicker('val',item.name);
			}
		});
	});
    if(network.type=="USER"){
    	$(".netContent").find(".host_port").addClass("hidden");
    	$(".netContent").find(".network").removeClass("hidden");
    	
    }else{
    	$(".netContent").find(".network").addClass("hidden");
    	$(".netContent").find(".host_port").removeClass("hidden");
    }
    
    
    var volume=result.volume;//存储
    if(volume.length > $(".volumesContent").length){
		for(var i =0;i<volume.length-1;i++){
			var portMappingsContent = "<div class=\"volumesContent\">" + $(".volumesContent").html() + "<\/div>";
			$("#tab5").append(portMappingsContent);
        }
    } else {
		$(".volumesContent").each(function(i,obj){
    		if(i <= volume.length-1 && volume.length >= 1){
    			$(obj).find("[name='host_path']").val('');
				$(obj).find("input[name='container_path']").val('');
				$(obj).find("[name='rw_mode']").val('');
				$(obj).find(".volume_type").val('');
    		} else if(volume.length == 0 && i == 0){
    			$(obj).find("[name='host_path']").val('');
				$(obj).find("input[name='container_path']").val('');
				$(obj).find("[name='rw_mode']").val('');
				$(obj).find(".volume_type").val('');
    		} else {
    			obj.remove();
    		}
    	});
    }
    $(".volumesContent").each(function(i,obj){
		$.each(volume,function(k,item){
			if(i==k){
				$(obj).find("[name='host_path']").val(item.h_path);
				$(obj).find("input[name='container_path']").val(item.c_path);
				$(obj).find("[name='rw_mode']").val(item.rw_mode);
				$(obj).find(".volume_type").val(item.type);
			}
		});
	});
    
    var health=result.health;//健康检测
    if(health.length > $(".healthContent").length){
		for(var i =0;i<health.length-1;i++){
			var portMappingsContent = "<div class=\"healthContent\">" + $(".healthContent").html() + "<\/div>";
			$(".healthContentX").append(portMappingsContent);
        }
    } else {
		$(".healthContent").each(function(i,obj){
    		if(i <= health.length-1 && health.length >= 1){
    			$(obj).find("select[name='healthChecks']").val('');
				$(obj).find("input[name='command']").val('');
				$(obj).find("[name='http_path']").val('');
				$(obj).find("[name='gracePeriodSeconds']").val('');
				$(obj).find("[name='interval']").val('');
				$(obj).find("[name='timeout']").val('');
				$(obj).find("[name='max_failures']").val('');
				$(obj).find("[name='port_index']").val('');
				$(obj).find("[name='port_type']").val('');
    		} else if(health.length == 0 && i == 0){
    			$(obj).find("select[name='healthChecks']").val('');
				$(obj).find("input[name='command']").val('');
				$(obj).find("[name='http_path']").val('');
				$(obj).find("[name='gracePeriodSeconds']").val('');
				$(obj).find("[name='interval']").val('');
				$(obj).find("[name='timeout']").val('');
				$(obj).find("[name='max_failures']").val('');
				$(obj).find("[name='port_index']").val('');
				$(obj).find("[name='port_type']").val('');
    		} else {
    			obj.remove();
    		}
    	});
    }
    $(".healthContent").each(function(i,obj){
		$.each(health,function(k,item){
			if(i==k){
				$(obj).find("select[name='healthChecks']").val(item.protocol);
				$(obj).find("input[name='command']").val(item.command);
				$(obj).find("[name='http_path']").val(item.path);
				$(obj).find("[name='gracePeriodSeconds']").val(item.grace_period);
				$(obj).find("[name='interval']").val(item.interval);
				$(obj).find("[name='timeout']").val(item.timeout);
				$(obj).find("[name='max_failures']").val(item.max_failures);
				$(obj).find("[name='port_index']").val(item.port_index);
				$(obj).find("[name='port_type']").val(item.typort_typepe);
			}
		});
	});
    
    var interfaces=result.interface;
    if(interfaces){
    	$("#joggle_name").val(interfaces.name);
        $("#joggle_phone").val(interfaces.phone);
        $("#joggle_email").val(interfaces.email);
        $("#developer").val(interfaces.other);
    }else{
    	$("#joggle_name").val('');
        $("#joggle_phone").val('');
        $("#joggle_email").val('');
        $("#developer").val('');
    }
    
    
    var sys_conf=result.sys_conf;
    if(sys_conf){
    	$("#domain_name").val(sys_conf.domain);
        $("#pub_ip").val(sys_conf.pub_ip);
        $("#pri_ip").val(sys_conf.pri_ip);
        $("#bamboo").val(sys_conf.bamboo);
        $("#enable_firewalll").val(sys_conf.enable_firewalll);
        $("#health_addr").val(sys_conf.health_addr);
        $("#ha_type").val(sys_conf.ha_type);
        $("#ha_addr").val(sys_conf.ha_addr);
    }else{
    	$("#domain_name").val('');
        $("#pub_ip").val('');
        $("#pri_ip").val('');
        $("#bamboo").val('');
        $("#enable_firewalll").val('');
        $("#health_addr").val('');
        $("#ha_type").val('');
        $("#ha_addr").val('');
    }

}
function fnInitValue(){
	$("#createappbtn").text("创建");
//	$("#cluster_master").selectpicker('val','');
//	$(".cluster_ratio").find("[label='cluster']").text('');
//	$(".cluster_ratio").find("[name='cluster']").text('');
//	$(".cluster_ratio").find("[name='cluster_weight']").val('');
//	$(".cluster_ratio").find("[name='marathon']").val('');
	$("#deployMode").val('jxsc');
	$("#app_origin").val('bdsc');
	$("#ftp_ip").val('');
	$("#ftp_port").val('');
	$("#ftp_passwd").val('');
	$("#filename").val('');
    $("#ftp_username").val('');
    $("#path").val('');
    
    $("#sys_name").prop("disabled",false);
//    $("#sys_name").find("option").eq(0).prop("select",true);
    $("#model_name").val('');
    $("#dns_route").val('');
    
//    $("#CPU").val('0.5');
//    $("#mem").val('2500');
//    $("#disk").val('3000');
//    $("#instance").val('1');
//    $("#image").val('');
    $("#cmd").val('sh/app/bin/startServer.sh');
    $(".envContent").find("[name='env_key']").eq(0).val('JAVA_HOME');
    $(".envContent").find("[name='env_value']").eq(0).val('/app/jdk');
    $(".envContent").find("[name='env_key']").eq(1).val('APPNAME');
    $(".envContent").find("[name='env_value']").eq(1).val('demo.war');
    $(".dockerContent").find("[name='key']").eq(0).val('user');
    $(".dockerContent").find("[name='value']").eq(0).val('dcos');
    $(".dockerContent").find("[name='key']").eq(1).val('cpu-quota');
    $(".dockerContent").find("[name='value']").eq(1).val('50000');
    
 // $("#net_type").find("input[value='BRIDGE']").prop("checked",true);
    $("#net_type").val('BRIDGE');
    $(".netContent").find("[name='container_port']").val('7001');
    $(".netContent").find("[name='host_port']").val('0');
    $(".netContent").find("[name='net_http']").val('tcp');
    $(".netContent").find("[name='network']").selectpicker('val','');
    
    $(".volumesContent").find("[name='host_path']").val('');
    $(".volumesContent").find("input[name='container_path']").val('');
    $(".volumesContent").find("select[name='rw_mode']").val('RW');
    $(".volumesContent").find(".volume_type").text('local');
    
    $(".healthContent").find("select[name='healthChecks']").val('COMMAND');
    $(".healthContent").find("[name='command']").val('ls');
    $(".healthContent").find("[name='http_path']").val('');
    $(".healthContent").find("[name='gracePeriodSeconds']").val('300');
    $(".healthContent").find("[name='interval']").val('60');
    $(".healthContent").find("[name='timeout']").val('20');
    $(".healthContent").find("[name='max_failures']").val('3');
    $(".healthContent").find("[name='port_index']").val('');
    $(".healthContent").find("[name='port_type']").val('');
    
    $("#joggle_name").val('');
    $("#joggle_phone").val('');
    $("#joggle_email").val('');
    $("#developer").val('');
    
    $("#domain_name").val('');
    $("#pub_ip").val('');
    $("#pri_ip").val('');
    $("#bamboo").val('');
    $("#enable_firewalll").val('');
    $("#health_addr").val('');
    $("#ha_type").val('');
    $("#ha_addr").val('');
}
appValidator();
function fnHandleCreateData(){
	
	var deployment={};
	//var evn1=$('#evn').find("input[type='radio']:checked").val();
	var evn1="生产";
	var resource=[];
	var clusterlabel=$("#cluster_master").find(".btn-info").text();
	resource=[{"name":clusterlabel, "quota":'', "marathon":'',"label":clusterlabel}];
//	$(".cluster_ratio").each(function(i){
//		var label="";
//		var name="";
//		var marathon="";
//		var quota="";
//		label= $(this).find("[label='cluster']").text();
//		name = $(this).find("[name='cluster']").text();
//		quota = $(this).find("[name='cluster_weight']").val();
//		marathon=$(this).find("[name='marathon']").val();
//		var arr = {"name":name, "quota":quota, "marathon":marathon,"label":label};
//		resource.push(arr);
//	});

	var deploy_mode=$("#deployMode").val();
	var app_origin=$("#app_origin").val();
	if(app_origin=="fwqxz"){
		var ftp_ip=$("#ftp_ip").val();
		var ftp_port=$("#ftp_port").val();
	    var ftp_passwd=$("#ftp_passwd").val();
	    var filename=$("#filename").val();
	    var ftp_username=$("#ftp_username").val();
	    var path=$("#path").val();
	}else{
		var ftp_ip='';
		var ftp_port='';
	    var ftp_passwd='';
	    var filename='';
	    var ftp_username='';
	    var path='';
	}
	
    var app_origin_detail={"ftp_ip":ftp_ip,"ftp_port":ftp_port,"ftp_passwd":ftp_passwd,"filename":filename,"ftp_username":ftp_username,"path":path,};
    deployment={"env":evn1,"resource":resource,"deploy_mode":deploy_mode,"app_origin":app_origin,"app_origin_detail":app_origin_detail};
  
 /////***************************************************************************///////////
	var app={};
    var sys_name='',sys_id='';

    sys_id=$("#sys_name").val();
    
    var model_name=$("#model_name").val();
    var dns_route=$("#dns_route").val();
    app={"sys_name":sys_name,"sys_id":sys_id,"model_name":model_name,"dns_route":dns_route};

/////***************************************************************************///////////
    var container={};
    var cpu_mem=$("#con_configure").find('.active .cpu_mem').text().split('/');
    var cpu=parseInt(cpu_mem[0]);
    var mem=parseInt(cpu_mem[1])*1000;
    
    var disktext=$("#selectdisk").find(".btn-info").text().split('G');
    var disk=disktext[0]*1000;
    var instance=$("#instance").val();
    var image=$("#image").val();
    var cmd=$("#cmd").val();
    var env2=[];
    $(".envContent").each(function(i){
		var key = "";
		var val = "";
		
		key = $(this).find("[name='env_key']").val();
		val = $(this).find("[name='env_value']").val();

		var arr = {"key":key, "val":val};
		env2.push(arr);
	});
    
    var docker_params=[];
    $(".dockerContent").each(function(i){
		var key = "";
		var val = "";
		
		key = $(this).find("[name='key']").val();
		val = $(this).find("[name='value']").val();

		var arr = {"key":key, "val":val};
		docker_params.push(arr);
	});
    var constraint=[];
    if($("#cluster_cons").selectpicker('val')){
    	constraint=$("#cluster_cons").selectpicker('val');
    }
    container={"cpu":cpu,"mem": mem,
    	    "disk": disk,
    	    "instance": instance,
    	    "image": image,
    	    "cmd": cmd,
    	    "env":env2,
    	    "docker_params":docker_params,
    	    "constraint":constraint,};
    
    var network={};
   // var nettype=$("#net_type").find("input[type='radio']:checked").val();
     var nettype=$("#net_type").val();
    var netdetail=[];
    $(".netContent").each(function(i){
    	var c_port= "";
    	var h_port="";
    	var protocol= "";
    	var name=[];
		
    	c_port = $(this).find("[name='container_port']").val();
    	h_port = $(this).find("[name='host_port']").val();
    	protocol = $(this).find("[name='net_http']").val();
    	name=$(this).find("[name='network']").selectpicker('val');
    	
		var arr = {"c_port":c_port, "h_port":h_port,"protocol":protocol,"name":name};
		netdetail.push(arr);
	});
    network={"type":nettype,"detail":netdetail};
    
    var volume=[];
    $(".volumesContent").each(function(i){
    	var vtype= "";//local、share
    	var c_path="";
    	var h_path= "";
    	var rw_mode="";
		
    	vtype = $(this).find(".volume_type").text();
    	h_path = $(this).find("[name='host_path']").val();
    	c_path = $(this).find("input[name='container_path']").val();
    	rw_mode=$(this).find("select[name='rw_mode']").val();
    	
		var arr = {"type":vtype, "h_path":h_path,"c_path":c_path,"rw_mode":rw_mode};
		volume.push(arr);
	});
    
    var health=[];
    $(".healthContent").each(function(i){
    	var protocol= "user";
    	var command="";
    	var grace_period= "";
    	var interval="";
    	var timeout="";
    	var max_failures="";
    	var path="";
    	var port_index="";
    	var port_type="";
		
    	protocol = $(this).find("select[name='healthChecks']").val();
    	command = $(this).find("[name='command']").val();
    	path = $(this).find("[name='http_path']").val();
    	grace_period= $(this).find("[name='gracePeriodSeconds']").val();
    	interval=$(this).find("[name='interval']").val();
    	timeout=$(this).find("[name='timeout']").val();
    	max_failures=$(this).find("[name='max_failures']").val();
    	port_index=$(this).find("[name='port_index']").val();
    	port_type=$(this).find("[name='port_type']").val();
    	
		var arr = {"protocol": protocol,
			    "command": command,
			    "grace_period": grace_period,
			    "interval": interval,
			    "timeout": timeout,
			    "max_failures": max_failures,
			    "path": path,
			    "port_index": port_index,
			    "port_type": port_type};
		health.push(arr);
	});
    
    var interfaces={};
    var name=$("#joggle_name").val();
    var phone=$("#joggle_phone").val();
    var email=$("#joggle_email").val();
    var other=$("#developer").val();
    interfaces={
    		"name": name,
    	    "phone":phone,
    	    "email":email,
    	    "other": other
    };
    
    var sys_conf={};
    var domain=$("#domain_name").val();
    var pub_ip=$("#pub_ip").val();
    var pri_ip=$("#pri_ip").val();
    var bamboo=$("#bamboo").val();
    var enable_firewalll=$("#enable_firewalll").val();
    var health_addr=$("#health_addr").val();
    var ha_type=$("#ha_type").val();
    var ha_addr=$("#ha_addr").val();
    sys_conf={"domain": domain,
    	    "pub_ip": pub_ip,
    	    "pri_ip": pri_ip,
    	    "bamboo": bamboo,
    	    "enable_firewalll": enable_firewalll,
    	    "health_addr": health_addr,"ha_type":ha_type,"ha_addr":ha_addr};
    var creatData;
    if(pagetype=="update"){
    	creatData=JSON.stringify({"_uri": "apps/deployment/config", "_method": "PUT","app_id":appId,
        	"deployment":deployment,"app":app,"container":container,"network":network,
        		"volume":volume,"health":health,"sys_conf":sys_conf,"interface":interfaces,});
    }else{
    	creatData=JSON.stringify({"_uri": "apps/deployment/config", "_method": "POST",
        	"deployment":deployment,"app":app,"container":container,"network":network,
        		"volume":volume,"health":health,"sys_conf":sys_conf,"interface":interfaces,});
    }
    
    fnCreateApp(creatData);
}
function fnCreateApp(data){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:data,
		success:function (result) {
			if(result.msg=="OK"){
				commonAlert("#successMsg", "#successAlertBlock", "创建应用成功");
				changeMenu(this, '/webcontent/Application/Applist.html');
			}else{
				commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
			}
			
		}
	});
}
//*****************验证 提交表单*************//
function appValidator(){

  $("#createApp").bootstrapValidator({
    // Only disabled elements are excluded
    // The invisible elements belonging to inactive tabs must be validated
    excluded: [':disabled'],
    feedbackIcons: {
        valid: 'glyphicon',
        invalid: 'glyphicon ',
        validating: 'glyphicon'
    },
    submitHandler: function (validator, form, submitButton) {
    	fnHandleCreateData();
    },
    fields: {
//    	dataType: {
//            validators: {
//                notEmpty: {
//                    message: '菜单名称不能为空'
//                }
//            }
//        },
    	model_name: {
            validators: {
                notEmpty: {
                    message: '系统名称不能为空'
                }
            }
        },
        instance:{
            validators: {
                notEmpty: {
                    message: '实例数不能为空'
                }
            }
        }
    }
});
}
//***********获取网络、资源池等基本信息*************//
function fnBaseConfig(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/deployment/baseconfig",
		    "_method": "GET",
		}),
		success:function (result) {
			fnHandleBasefig(result.data);
		}
	});
}
function fnHandleBasefig(data){
	var evn=data.evn;
	var network=data.network;
	var resource=data.resource;
	var volume=data.volume;
	//环境
	$("#evn").empty();
	for(var i=0;i<evn.length;i++){
		var _html='';
		_html+='<div class="col-lg-2 col-sm-4 col-xs-4">';
		_html+='<label>';
		_html+='<input name="form-field-radio" type="radio"  class="colored-blue" value="'+evn[i]+'">';
		_html+='<span class="text">'+evn[i]+'</span></label></div>';
		$("#evn").append(_html);
	}
	//网络
	var target = $("select[name='network']").empty();
	for (var i = 0; i < network.length; i++){
		target.append("<option value='"+network[i]+"'>"+network[i]+"</option>"); 
	}
	target.selectpicker('refresh');
	//资源池
	var master = $("#cluster_master").empty();
	for (var i = 0; i < resource.length; i++){
		if(i==0){
			master.append("<a class='btn btn-info margin-right-10'>"+resource[i].name+"</a>"); 
		}else{
			master.append("<a class='btn btn-default margin-right-10'>"+resource[i].name+"</a>");
		}
		
	}
	master.selectpicker('refresh');
	//volum
	var container_path = $("select[name='container_path']").empty();
	container_path.append("<option value=''>请选择</option>");
	for (var i = 0; i < volume.length; i++){
		container_path.append("<option value='"+volume[i].hostpath+"'>"+volume[i].hostpath+"</option>"); 
	}
	
	//发布构建方式
	var deploy_mode=data.deploy_mode;
	$("select[name='deployMode']").empty();
	for(var i = 0; i < deploy_mode.length; i++){
		var a=deploy_mode[i];
		$("select[name='deployMode']").append("<option value='"+a[1]+"'>"+a[0]+"</option>");
	}
	//程序包来源
	var app_origin=data.app_origin;
	$("select[name='app_origin']").empty();
	for(var i = 0; i < app_origin.length; i++){
		var a=app_origin[i];
		if(a[1]=="bdsc"){
			$("select[name='app_origin']").append("<option selected value='"+a[1]+"'>"+a[0]+"</option>");
		}else{
			$("select[name='app_origin']").append("<option value='"+a[1]+"'>"+a[0]+"</option>");
		}
		
	}
	//系统名称
	var sys=data.sys;
	$("#sys_name").empty();
	for(var i = 0; i < sys.length; i++){
		var a=sys[i];
		$("#sys_name").append("<option value='"+a[1]+"'>"+a[0]+"</option>");
	}
}
//获取镜像
function initImageSelect(){
	$('#image').empty();
	$.ajax({
  		type: 'POST', 
  		url: '/exchange',
  		contentType: 'application/json',
  		dataType: 'json',
  		data:JSON.stringify({
  			"_uri": "himage/user/imagenames",
  		    "_method": "GET"
  		}),
  		success:function (result) {
  			try{
  				var data= result.data;
  				for(i=0;i<data.length;i++){
  					$('#image').append('<option value="'+data[i]+'" >'+data[i]+'</option>')
  				}
  			}
  			catch(err){
  				console.log(err);
  			}
  		},
  		error:function(result){
  			console.log("获取镜像列表异常，请检查网络状态！");
  		}
  	});
}
//创建系统
function fnCreateSys(){
	$("#creatSysModal").modal("show");
	$("#creatSysModal").find("input").val('');
}
function createMenu(){
	$("#creatSysModal").modal('hide');
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "platform/resource",
		    "_method": "POST",
		    "cpu": $("#sys_CPU").val(),
		    "mem": parseInt($("#sys_mem").val())*1024,
		    "disk": parseInt($("#sys_disk").val())*1024,
		    "sys_name": $("#sys_sysname").val(),
		    "sys_id": $("#sys_syslable").val()
		}),
		success:function (result) {
			if(result.msg=='OK'){
				//commonAlert("#successMsg", "#successAlertBlock", "添加成功");
				fnBaseConfig();
			}else{
				//commonAlert("#warningMsg", "#warningAlertBlock", "操作失败,原因："+result.msg);
			}
			
		}
	});   	  
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
//    	dataType: {
//            validators: {
//                notEmpty: {
//                    message: '菜单名称不能为空'
//                }
//            }
//        },
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
function fnnoUiSlider(obj,inputobj,start,end){
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
	
}
function fnToggle(){
	$("#theHighest").toggle();
}
//资源池改变事件
function clusterChange(){
	var clusterMaster=$("#cluster_master").selectpicker('val');
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/deployment/baseconfig",
		    "_method": "POST",
		    "filter":clusterMaster
		}),
		success:function (result) {
			if(clusterMaster && clusterMaster.length>0){
				var data=result.data;
				if($("#btn_type").text()!="update"){
					fnresourcePool(data);
				}
				fncluster(data,clusterMaster,selected);
			}else{
				$(".master_allot").addClass("hidden");
				$(".master_allot").empty();
			}
			
		}
	});
}
$("#app_origin").change(function() {
	var select=$("#app_origin").val();
	if(select=="fwqxz"){
		$("#fwqxz").show();
	}else{
		$("#fwqxz").hide();
	}
});
$("#net_type").change(function(){
	//var networkselect = $("#net_type").find("input[name='form-net-radio']:checked").val();
	var networkselect = $("#net_type").val();
	if(networkselect=='USER'){
		$(".netContent").find(".network").removeClass("hidden");
		$(".netContent").find(".network").find("select").attr("data-value","empty");
		$(".netContent").find(".host_port").addClass("hidden");
		$(".netContent").find(".host_port").find("input").attr("data-value","");
	}else{
		$(".netContent").find(".host_port").removeClass("hidden");
		$(".netContent").find(".host_port").find("input").attr("data-value","empty");
		$(".netContent").find(".network").addClass("hidden");
		$(".netContent").find(".network").find("select").attr("data-value","");
	}
	
	if(networkselect=='HOST'){
		$(".netContent").find("input[name='container_port']").prop('disabled',true);
		$(".netContent").find("input[name='host_port']").prop('disabled',true);
		$(".netContent").find("input[name='container_port']").val('');
		$(".netContent").find("input[name='host_port']").val('');
		$(".netContent").find("input[name='container_port']").attr("data-value","");
		$(".netContent").find("input[name='host_port']").attr("data-value","");
	}else{
		$(".netContent").find("input[name='container_port']").prop('disabled',false);
		$(".netContent").find("input[name='host_port']").prop('disabled',false);
		$(".netContent").find("input[name='container_port']").val('7001');
		$(".netContent").find("input[name='host_port']").val('0');
		$(".netContent").find("input[name='container_port']").attr("data-value","empty");
		if(networkselect=='BRIDGE'){
			
			$(".netContent").find("input[name='host_port']").attr("data-value","empty");
		}
	}
	//fnBaseConfig();
});

function fnSelectConfigure(obj){
	$("#con_configure").find(".con_configure").removeClass("active");
	$(obj).addClass("active");
	if($(obj).find('h6').length>0){
		$("#addConfigureModal").modal("show");
		$("#con_CPU").val('0');$("#con_mem").val('0');
		("#sample-onehandle4").val('0');
		("#sample-onehandle5").val('0');
	}
}

//找到父元素，添加监听器...
document.getElementById("selectdisk").addEventListener("click",function(e) {
	$("#selectdisk").find("a").attr('class',"btn btn-default margin-right-10");
	if(e.target && e.target.nodeName == "A") {
		// 找到目标，输出ID!
		e.target.className="btn btn-info margin-right-10";
		//console.log("List item ",e.target.id.replace("post-")," was clicked!");
	}else{
		
	}
});
//增加健康检测
function fnaddhealth(){
	var healthContent = "<div class=\"healthContent\" style='border-bottom: 1px dashed rgba(0,0,0,.2);'>" + $(".healthContent").eq(0).html() + "<\/div>";
	$(".healthContentX").append(healthContent);
}
function fnAddnetwork(){
	//var networkselect = $("#net_type").find("input[name='form-net-radio']:checked").val();
	var networkselect = $("#net_type").val();
	if(networkselect=="BRIDGE"){
		var netContent = "<div class=\"netContent\">" + $(".netContent").html() + "<\/div>";
		$(".netContentX").append(netContent);
	}
	
}
function fnCutnetwork(obj){
	var divs = $(".netContent");
	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
	}
}
function fnAddvolume(){
	var volumesContent = "<div class=\"volumesContent\">" + $(".volumesContent").html() + "<\/div>";
	$(".volumesContentX").append(volumesContent);
}
function fnCutvolume(obj){
	var divs = $(".volumesContent");
	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
	}
}

function fnAdddocker(){
	var dockerContent = "<div class=\"dockerContent\">" + $(".dockerContent").html() + "<\/div>";
	$("#docker").append(dockerContent);
}
function fnCutdocker(obj){
	var divs = $(".dockerContent");
	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
	}
}

function fnAddenv(){
	var envContent = "<div class=\"envContent\">" + $(".envContent").html() + "<\/div>";
	$(".envContentX").append(envContent);
}
function fnCutenv(obj){
	var divs = $(".envContent");
	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
	}
}

function add1(obj){
	var value=$(obj).prevAll('input').val();
	if(value!=''){
		value++;
	}
	
	$(obj).prevAll('input').val(value);
}
function drop1(obj){
	var value=$(obj).next('input').val();
	if(value>="1"){
		value--;
	}
	
	$(obj).next('input').val(value);
}
//自定义容器配置
$("#createCPUmem").click(function (){
	createCPUmem($("#con_CPU").val(),$("#con_mem").val());
});
function createCPUmem(cpu,mem){
	$("#con_configure").find(".con_configure").removeClass("active");
	var html='';
	html='<a class="jd pull-left margin-right-10 " href="javascript:;" >';
	html+='<div class="panel panel-default con_configure active">';
	html+='<div  class="panel-heading text-center cpu_mem" onclick="fnSelectConfigure(this)">';
	html+=cpu+'核/'+mem+'GB';
		html+='</div>';
			html+='<div class="panel-body text-center  darkgray" style="padding:10px 30px">标准配置';
		html+='</div>';
			html+='</div>';
				html+=' </a>';	
	$(".con_configureX").append(html); 
}

//自定义磁盘
$("#createDisk").click(function(){
	createDisk($("#con_disk").val());
});
function createDisk(disk){
	$("#selectdisk").find("a").attr("class",'btn btn-default margin-right-10');
	var html='';
	html='<a class="btn btn-info margin-right-10">'+disk+'G</a>';
		
	$(".selectdiskX").append(html); 
}

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}