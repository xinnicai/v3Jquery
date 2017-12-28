$(document).ready(function (){ 
	initPage();fnUserPowerApplist(uriArr,domArr);
	//formValidator();
	fnGetData();//获取表ge
	fnBaseConfig();
	initImageSelect();
});
//用户权限
var uriArr=fnUrlArr(),
domArr=fnDomArr();
var mourl=[];
function fnUserPowerApplist(uriArr,domArr){
	
	var mo=JSON.parse(_user.mo);
	for(var i=0;i<mo.length;i++){
		mourl.push(mo[i].obj);
	}
	for(var a=0; a<uriArr.length; a++){
		var uri = uriArr[a];
		if(mourl.length==0){
			$(domArr[a]).css("display","none");
		}else{
			for(var b=0; b<mourl.length; b++){
				if(uri == mourl[b]){
					$(domArr[a]).css("display","inline-block");return;
				}else{
					$(domArr[a]).css("display","none");
				}
			}
		}
		
	}
}

function initImageSelect(){
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
  					$('#image-select').append('<option value="'+data[i]+'" >'+data[i]+'</option>')
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

//***********get表格*************//
function fnGetData(){
 $('#editabledatatable').bootstrapTable({
       url: '/exchange', method: 'POST', cache: false,
       contentType: 'application/json', search: false,dataType: 'json',
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'app_id', 
       queryParams:  function (params) {
           return JSON.stringify({
           	"_uri": "apps/list",
			    "_method": "GET"
           });
       },
       toolbar:'#btn-div',
       columns: [{					
         title: '系统名称', field: 'sys_name', searchable: true, sortable: true
       },  {
         title: '模块名称', field: 'app_name', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
        	 var value=row['app_id'];
        	 var html='';
        	 html='<a href="#" onclick="changeMenu(this, \'/webcontent/Application/Applist.html\', \'/webcontent/Application/Application.html?appid='+value+'\')">'+val+'</a>';
         	  return html;
         			  /*'<a href="Application.html?'+value+'">'+val+'</a>';*/
           }
       },{
         title: 'CPU(核)', field: 'cpus', sortable: true, searchable: true
       },{
         title: '内存', field: 'mem', sortable: true, searchable: true
       },{
         title: '容器数', field: 'instances', sortable: true, searchable: true
       },{
         title: '扩缩容策略', field: 'autoscale_policy', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  if(val=='1'){
          		  return '<span class="label label-success label-sm">开启</span>';
          	  }else if(val=='0'){
          		  return '<span class="label label-warning label-sm">关闭</span>';
          	  }
            }
       },{
         title: '状态', field: 'status', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
       	  if(val=='1'){
       		  return '<span class="label label-success label-sm">已发布</span>';
       	  }else if(val=='2'){
       		  return '<span class="label label-warning label-sm">已暂停</span>';
       	  }else if(val=='0'){
       		  return '<span class="label label-default label-sm">未发布</span>';
       	  }else if(val=='3'){
       		  return '<span class="label label-danger label-sm">发布失败</span>';
       	  }
         }
       },{
         title: '创建时间', field: 'create_time', sortable: true, searchable: true
       },{
         title: '操作', field: 'app_id',formatter: function (val, row, idx) {
        	 for(var i=0;i<mourl.length;i++){
        		 var html='';
         		if(mourl[i]=="apps/deployment/config"){
         			html='<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showDeleteModal(\''+val+'\')"><i class="fa fa-trash-o padding-right-5"></i>删除应用</a>';	
         			return html;
         		}else{
         			html= '<i class="fa fa-ban"></i>';
         		}
         		
         	}
        	 return html;
//       	   '<a class="btn btn-default btn-sm" href="javascript:void(0);" onclick="showAppCloneModal(\''+val+'\')"><i class="fa fa-copy padding-right-5"></i>配置克隆</a>'
        	 
         }
       }],
       responseHandler: function (result) {
       	if (result.msg=='OK') {
               return result.data;
             } else {
               return [];
             }
       	//return result;
       },
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (data) {
	
       },
       onDblClickRow:function(data){
       	var id=data.app_id;
       	fnCloneUpdate(id);
       	$("#creatApplition").modal('show');
       //	$("#myLargeModalLabelText").text("编辑应用");
       	$('#creatApplition a:first').tab('show');
       	
       }
     });
 }
//删除
function showDeleteModal(data){
	$("#Delvloume").modal("show");
	$("#deleteID").text(data);
}
function deleteData(){
	$("#Delvloume").modal("hide");
	var id=$("#deleteID").text();
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/deployment/config",
		    "_method": "DELETE",
		    "app_id":id
		}),
		success:function (result) {
			if(result.msg=='OK'){
				commonAlert("#successMsg", "#successAlertBlock", "应用删除成功");
				$('#editabledatatable').bootstrapTable("refresh");
			}else{
				commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
			}
		}
	});
}
//克隆
function showAppCloneModal(d){
	$("#Appclone").modal("show");
	$("#clonid").text(d);
	fnCloneUpdate(d);
}
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
				fnIfEmpty("#cluster_master");
			}
		}
	});
}
//***********创建*************//
$("#createmodal").click(function(){
	fnSelectChange();
	$('#creatApplition a:first').tab('show');
	$("#creatApplition").modal('show');$(".master_allot").addClass("hidden");
	$("#myLargeModalLabelText").text("创建应用");
	$("#create-updata").text("创建");
	$('#cluster_master').prop("disabled",false);
	$("#btn_type").text("create");
	$("#appid").text("");
	$("#evn").find("input[value='生产']").prop("checked",true);
	$("#cluster_master").selectpicker('val','');
	$(".cluster_ratio").find("[label='cluster']").text('');
	$(".cluster_ratio").find("[name='cluster']").text('');
	$(".cluster_ratio").find("[name='cluster_weight']").val('');
	$(".cluster_ratio").find("[name='marathon']").val('');
	$("#deployMode").val('jxsc');
	$("#app_origin").val('bdsc');
	$("#ftp_ip").val('');
	$("#ftp_port").val('');
	$("#ftp_passwd").val('');
	$("#filename").val('');
    $("#ftp_username").val('');
    $("#path").val('');
    
    $("#sys_name").val('手机营业厅');
    $("#model_name").val('');
    $("#dns_route").val('');
    
    $("#CPU").val('0.5');
    $("#mem").val('2500');
    $("#disk").val('3000');
    $("#instance").val('1');
    $("#image").val('');
    $("#cmd").val('');
    $(".envContent").find("[name='env_key']").eq(0).val('JAVA_HOME');
    $(".envContent").find("[name='env_value']").eq(0).val('/app/jdk');
    $(".envContent").find("[name='env_key']").eq(1).val('APPNAME');
    $(".envContent").find("[name='env_value']").eq(1).val('demo.war');
    $(".dockerContent").find("[name='key']").eq(0).val('user');
    $(".dockerContent").find("[name='value']").eq(0).val('dcos');
    $(".dockerContent").find("[name='key']").eq(1).val('cpu-quota');
    $(".dockerContent").find("[name='value']").eq(1).val('50000');
    
  $("#net_type").find("input[value='BRIDGE']").prop("checked",true);
    $(".netContent").find("[name='container_port']").val('7001');
    $(".netContent").find("[name='host_port']").val('0');
    $(".netContent").find("[name='net_http']").val('tcp');
    $(".netContent").find("[name='network']").selectpicker('val','');
    
    $(".volumesContent").find("[name='host_path']").val('');
    $(".volumesContent").find("input[name='container_path']").val('');
    $(".volumesContent").find("select[name='rw_mode']").val('RW');
    $(".volumesContent").find(".volume_type").text('local');
    
    $(".healthContent").find("select[name='healthChecks']").val('');
    $(".healthContent").find("[name='command']").val('');
    $(".healthContent").find("[name='http_path']").val('');
    $(".healthContent").find("[name='gracePeriodSeconds']").val('');
    $(".healthContent").find("[name='interval']").val('');
    $(".healthContent").find("[name='timeout']").val('');
    $(".healthContent").find("[name='max_failures']").val('');
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
});

//volume类型onchange="this.parentNode.nextSibling.value=this.value"
function hostPath(obj){
	var input=$(obj).parent("span").next("input[name='host_path']");
	input.val($(obj).val());
	input.next(".volume_type").text("share");fnIfEmpty(obj);
}
function fnvolume_type(obj){
	$(obj).next(".volume_type").text("local");
	fnIfEmpty(obj);
}
function fnhandleCreateData(){
	
	var deployment={};
	var evn1=$('#evn').find("input[type='radio']:checked").val();
	var resource=[];

	$(".cluster_ratio").each(function(i){
		var label="";
		var name="";
		var marathon="";
		var quota="";
		label= $(this).find("[label='cluster']").text();
		name = $(this).find("[name='cluster']").text();
		quota = $(this).find("[name='cluster_weight']").val();
		marathon=$(this).find("[name='marathon']").val();
		var arr = {"name":name, "quota":quota, "marathon":marathon,"label":label};
		resource.push(arr);
	});

	var deploy_mode=$("#deployMode").val();
	var app_origin=$("#app_origin").val();
	var ftp_ip=$("#ftp_ip").val();
	var ftp_port=$("#ftp_port").val();
    var ftp_passwd=$("#ftp_passwd").val();
    var filename=$("#filename").val();
    var ftp_username=$("#ftp_username").val();
    var path=$("#path").val();
    var app_origin_detail={"ftp_ip":ftp_ip,"ftp_port":ftp_port,"ftp_passwd":ftp_passwd,"filename":filename,"ftp_username":ftp_username,"path":path,};
    deployment={"env":evn1,"resource":resource,"deploy_mode":deploy_mode,"app_origin":app_origin,"app_origin_detail":app_origin_detail};
    //"cluster_ratio":cluster_ratio,"marathon":marathon,
    var app={};
    var sys_name='';
    if($("input[name='sys_name']").val()==''){
    	sys_name=$("#sys_name").val();
    }else{
    	sys_name=$("input[name='sys_name']").val();
    }
    var model_name=$("#model_name").val();
    var dns_route=$("#dns_route").val();
    app={"sys_name":sys_name,"model_name":model_name,"dns_route":dns_route};

    var container={};
    var cpu=$("#CPU").val();
    var mem=$("#mem").val();
    var disk=$("#disk").val();
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
    var nettype=$("#net_type").find("input[type='radio']:checked").val();
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
    if($("#btn_type").text()=="update"){
    	creatData=JSON.stringify({"_uri": "apps/deployment/config", "_method": "PUT","app_id":$("#appid").text(),
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
				commonAlert("#successMsg", "#successAlertBlock", "操作成功");
				$('#editabledatatable').bootstrapTable("refresh");
			}else{
				commonAlert("#warningMsg", "#warningAlertBlock", result.msg);
				
			}
			
		}
	});
}

//***********更新*************//
function fnUpdataApp(result){
	$("#myLargeModalLabelText").text("编辑应用");
	$("#create-updata").text("更新");
	$("#btn_type").text("update");
	$("#appid").text(result.app_id);
	var deployment=result.deployment;
	$("#evn").find("input[value='"+deployment.env+"']").prop("checked",true);
	$("#deployMode").val(deployment.deploy_mode);
	$("#app_origin").val(deployment.app_origin);
	var app_origin_detail=deployment.app_origin_detail;
	if(app_origin_detail){
		$("#ftp_ip").val(app_origin_detail.ftp_ip);
		$("#ftp_port").val(app_origin_detail.ftp_port);
		$("#ftp_passwd").val(app_origin_detail.ftp_passwd);
		$("#filename").val(app_origin_detail.filename);
	    $("#ftp_username").val(app_origin_detail.ftp_username);
	    $("#path").val(app_origin_detail.path);
	}else{
		$("#ftp_ip").val('');
		$("#ftp_port").val('');
		$("#ftp_passwd").val('');
		$("#filename").val('');
	    $("#ftp_username").val('');
	    $("#path").val('');
	}
	
	var resource=deployment.resource;
	var clustername=[];
	$(".master_allot").empty();
	if(resource.length>1){
		for(var i =0;i<resource.length-1;i++){
			var _html='';
			_html+='<div class="col-sm-4 no-padding-left cluster_ratio hidden">';
			_html+='<div class="form-group" >';
			_html+='<label><span name="cluster">'+resource[i].name+'</span><span label="cluster" class="hidden">'+resource[i].label;
			_html+='</span><a href="javascript:;" class="silver" title="修改marathon" onclick="fnMarathon(\''+resource[i].name+'\')">';
			_html+='<i class="glyphicon glyphicon glyphicon-cog padding-left-5"></i></a>';
			_html+='</label><input type="number" class="form-control" name="cluster_weight">'+resource[i].quota+'</div>';
		
			_html+='<div data-cluster="'+resource[i].name+'" style="display:none;">';
			_html+='<div class="form-group">';
			_html+='<label>'+resource[i].name+'<i class="fa fa-long-arrow-right padding-left-5"></i> marathon3</label>';
			_html+='<input class="form-control" name="marathon">'+resource[i].marathon+'</div>';
			_html+='</div></div>';
			$(".master_allot").append(_html);
        }
    } else if(resource.length=1){
    		var _html='';
			_html+='<div class="col-sm-4 no-padding-left cluster_ratio" style="display:none">';
			_html+='<div class="form-group" >';
			_html+='<label><span name="cluster">'+resource[0].name+'</span><span label="cluster" class="hidden">'+resource[0].label;
			_html+='</span><a href="javascript:;" class="silver" title="修改marathon" onclick="fnMarathon(\''+resource[0].name+'\')">';
			_html+='<i class="glyphicon glyphicon glyphicon-cog padding-left-5"></i></a>';
			_html+='</label><input type="number" class="form-control" data-value="empty" onkeyup="fnIfEmpty(this)" value="'+resource[0].quota+'" name="cluster_weight">';
			_html+='<p class="red hidden alertmsg"></p></div>';
			
			_html+='<div data-cluster="'+resource[0].name+'" style="display:none;">';
			_html+='<div class="form-group">';
			_html+='<label>'+resource[0].name+'<i class="fa fa-long-arrow-right padding-left-5"></i> marathon3</label>';
			_html+='<input class="form-control" name="marathon" id="input" value="'+resource[0].marathon+'"></div>';
			_html+='</div></div>';
			$(".master_allot").append(_html);
    	
    }else{
		$(".master_allot").empty();
	}
	$.each(resource,function(k,item){
		clustername.push(item.name);
		$(".cluster_ratio").find("[label='cluster']").eq(k).text(item.label);
		$(".cluster_ratio").find("[name='cluster']").eq(k).text(item.name);
		$(".cluster_ratio").find("[name='cluster_weight']").eq(k).val(item.quota);
	});
	$("#cluster_master").selectpicker('val',clustername);
	  var container=result.container;
	clusterChange(container.constraint);
	$('#cluster_master').prop("disabled",true);
	
    var app=result.app;
    $("input[name='sys_name']").val(app.sys_name);
    $("#model_name").val(app.model_name);
    $("#dns_route").val(app.dns_route);
    
  
    $("#CPU").val(container.cpu);
    $("#mem").val(container.mem);
    $("#disk").val(container.disk);
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
    $("#net_type").find("input[value='"+network.type+"']").prop("checked",true);
    var net_detail=network.detail;
    if(net_detail.length > $(".netContent").length){
		for(var i =0;i<volume.length-1;i++){
			var portMappingsContent = "<div class=\"netContent\">" + $(".netContent").html() + "<\/div>";
			$("#tab5").append(portMappingsContent);
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
    
};

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
	var master = $("select[name='cluster_master']").empty();
	for (var i = 0; i < resource.length; i++){
		master.append("<option value='"+resource[i].name+"'>"+resource[i].name+"</option>"); 
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
		$("select[name='app_origin']").append("<option value='"+a[1]+"'>"+a[0]+"</option>");
	}
	//系统名称
	var sys=data.sys;
	$("#sys_name").empty();
	for(var i = 0; i < sys.length; i++){
		var a=sys[i];
		$("#sys_name").append("<option value='"+a+"'>"+a+"</option>");
	}
}
//***********健康检测改变事件*************//
function fnchangehealth(obj){
	var val=$(obj).val();
	var parents=$(obj).parents(".healthContent");
	if(val=="COMMAND"){
		parents.find(".COMMANDdiv").removeClass("hidden");
		parents.find(".COMMANDdiv").find("input").attr("data-value","empty");
		parents.find(".Pathdiv").addClass("hidden");
		parents.find(".Pathdiv").find("input").attr("data-value","");
		parents.find(".port_indexdiv").addClass("hidden");
		parents.find(".port_typediv").addClass("hidden");
		parents.find(".port_indexdiv").find("input").attr("data-value","");
		parents.find(".port_typediv").find("input").attr("data-value","");
	}else if(val=="HTTP"){
		parents.find(".COMMANDdiv").addClass("hidden");
		parents.find(".COMMANDdiv").find("input").attr("data-value","");
		parents.find(".Pathdiv").removeClass("hidden");
		parents.find(".Pathdiv").find("input").attr("data-value","empty");
		parents.find(".port_indexdiv").removeClass("hidden");
		parents.find(".port_typediv").removeClass("hidden");
		parents.find(".port_indexdiv").find("input").attr("data-value","empty");
		parents.find(".port_typediv").find("input").attr("data-value","empty");
	}else if(val=="TCP"){
		parents.find(".COMMANDdiv").addClass("hidden");
		parents.find(".COMMANDdiv").find("input").attr("data-value","");
		parents.find(".Pathdiv").addClass("hidden");
		parents.find(".COMMANDdiv").find("input").attr("data-value","");
		parents.find(".port_indexdiv").removeClass("hidden");
		parents.find(".port_typediv").removeClass("hidden");
		parents.find(".port_indexdiv").find("input").attr("data-value","empty");
		parents.find(".port_typediv").find("input").attr("data-value","empty");
	}
	//fnIfEmpty(this);
}
//增加健康检测
function fnaddhealth(){
	var healthContent = "<div class=\"healthContent\" style='border-bottom: 1px dashed rgba(0,0,0,.2);'>" + $(".healthContent").eq(0).html() + "<\/div>";
	$(".healthContentX").append(healthContent);
}
//***********所选资源池改变事件*************//

fnSelectChange();
function fnSelectChange(){
	$("#cluster_master").on('changed.bs.select', function (e, idx, newVal, oldVal){
		
		clusterChange("[]");
		
	});
	
}
function clusterChange(selected){
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
function fnresourcePool(data){
	if(data!=""){
		$(".master_allot").removeClass("hidden");
		$(".master_allot").empty();
		for(var i=0;i<data.length;i++){
			var _html='';
			_html+='<div class="col-sm-4 no-padding-left cluster_ratio">';
			_html+='<div class="form-group" >';
			_html+='<label><span name="cluster">'+data[i].name+'</span><span label="cluster" class="hidden">'+data[i].label;
			_html+='</span><a href="javascript:;" class="silver" title="修改marathon" onclick="fnMarathon(\''+data[i].name+'\')">';
			_html+='<i class="glyphicon glyphicon glyphicon-cog padding-left-5"></i></a>';
			_html+='</label><input type="number" class="form-control" data-value="empty" onkeyup="fnIfEmpty(this)" name="cluster_weight"><p class="red hidden alertmsg"></p></div>';
		
			_html+='<div data-cluster="'+data[i].name+'" style="display:none;">';
			_html+='<div class="form-group">';
			_html+='<label>'+data[i].name+'<i class="fa fa-long-arrow-right padding-left-5"></i> marathon3</label>';
			_html+='<select class="form-control" name="marathon"></select></div>';
			_html+='</div></div>';
			$(".master_allot").append(_html);
		}
	}
}
function fnMarathon(da){
	$("div[data-cluster='"+da+"']").toggle();
}
function fncluster(data,cluster,selected){
	//$("select[name='cluster_cons']").empty();
	//$("select[name='cluster_cons']").selectpicker('refresh');
	var sel_ = $("select[name='cluster_cons']");
	sel_.empty();
	for(var i=0;i<data.length;i++){
		var cluster=data[i].cluster;
		for(var a=0;a<cluster.length;a++){
//			var attribute=cluster[a].attribute.split(":");
//			var attr=attribute[0]+":LIKE:"+attribute[1];
			sel_.append("<option value='"+cluster[a].attribute+"'>"+cluster[a].name+"</option>");
		}
		sel_.selectpicker('val',selected);
		var marathon=data[i].marathon;
		$("[name='marathon']").eq(i).empty();
		$("[name='marathon']").eq(i).append("<option value=''>请选择</option>")
		for(var b=0;b<marathon.length;b++){
			$("select[name='marathon']").eq(i).append("<option value='"+marathon[b].name+"'>"+marathon[b].name+"</option>");
		}
	}
	sel_.selectpicker('refresh');
}

//$("select[name='cluster_cons']").on('changed.bs.select', function (e, idx, newVal, oldVal){
//	$("select[name='cluster_cons']").selectpicker('refresh');
//	if(idx=="0"){
//		var clusterAttr=$("select[name='cluster_cons']").selectpicker('val');
//		if(clusterAttr){
//			$("select[name='cluster_cons']").append("<option value='GROUP_BY'>GROUP_BY</option>");
//			$("select[name='cluster_cons']").append("<option value='UNIQUE'>UNIQUE</option>");
//		}
//	}
//	
//	
//});
$("#app_origin").change(function() {
	var select=$("#app_origin").val();
	if(select=="fwqxz"){
		$("#fwqxz").removeClass("hidden");
		$("#fwqxz").find("input").attr("data-value","empty");
	}else{
		$("#fwqxz").addClass("hidden");
		$("#fwqxz").find("input").attr("data-value","");
	}
});
$("#clicklook").click(function(){
	  $("#jobInfo").toggle();
});
$("#net_type").change(function(){
	var networkselect = $("#net_type").find("input[name='form-net-radio']:checked").val();
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

//验证
function fnIfEmpty(obj){
	var val;
	if($(obj).val() || $(obj).val()==''){
		val=$(obj).val();
	}else{
		val=$(obj).selectpicker('val');
	}
	if(val==""){
		$(obj).nextAll(".alertmsg").text("该项不能为空");
		$(obj).nextAll(".alertmsg").removeClass("hidden");
		$("#create-updata").prop("disabled",true);
		return false;
	}else{
		$(obj).nextAll(".alertmsg").text("");
		$(obj).nextAll(".alertmsg").addClass("hidden");
		var objArr=$("[data-value='empty']");
		for(var i=0;i<objArr.length;i++){
			var objval='',objThis=objArr.eq(i);
			if(objThis[0].nodeName=="INPUT"){
				objval=objArr.eq(i).val();
			}else{
				if(objArr.eq(i).selectpicker('val')){
					objval=objArr.eq(i).selectpicker('val');
				}
			}
			if(objval==""){
				objArr.eq(i).nextAll(".alertmsg").text("该项不能为空");
				objArr.eq(i).nextAll(".alertmsg").removeClass("hidden");
				$("#create-updata").prop("disabled",true);
				return;
			}else{
				objArr.eq(i).nextAll(".alertmsg").text("");
				objArr.eq(i).nextAll(".alertmsg").addClass("hidden");
				$("#create-updata").prop("disabled",false);
				
			}
		}
		
	}
}
function fnAddnetwork(){
	var networkselect = $("#net_type").find("input[name='form-net-radio']:checked").val();
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
function fnAddvolume(){
	var volumesContent = "<div class=\"volumesContent\">" + $(".volumesContent").html() + "<\/div>";
	$("#tab5").append(volumesContent);
}
function fnCutvolume(obj){
	var divs = $(".volumesContent");
	if (divs.length > 1){
		var pObj = obj.parentNode.parentNode;
		pObj.parentNode.removeChild(pObj);
	}
}

function add1(obj){
	var value=$(obj).prev('input').val();
	if(value!=''){
		value++;
	}
	
	$(obj).prev('input').val(value);
}
function drop1(obj){
	var value=$(obj).next('input').val();
	if(value>="1"){
		value--;
	}
	
	$(obj).next('input').val(value);
}
//search
function fnSearch(obj){
var txt = $(obj).val();
if (txt == '') {
	$("tbody tr").show();
} else {
	$("td").parents("tbody tr").hide();
	$("td:contains('" + txt + "')").parents("tbody tr").show();
}
}

function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}