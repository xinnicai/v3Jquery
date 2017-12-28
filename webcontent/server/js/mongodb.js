$(document).ready(function (){
	fngetData();//获取网络、存储
    initResourceName();

     $('#accountForm').bootstrapValidator({
         // Only disabled elements are excluded
         // The invisible elements belonging to inactive tabs must be validated
         excluded: [':disabled'],
         feedbackIcons: {
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
         submitHandler: function (validator, form, submitButton) {
        	 fnajax();
         },
         fields: {
             fullName: {
                 validators: {
                     notEmpty: {
                         message: '服务名称不允许为空'
                     }
                 }
             },
             port: {
                 validators: {
                     notEmpty: {
                         message: '端口不允许为空'
                     },
                     regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                         regexp: /^[0-9]*$/,
                         message: '只能是数字'
                     },
                     stringLength: {
                         min: 4,
                         max: 5,
                         message: '端口长度必须在为4或5位数'
                     }
                 }
             }
            
         }
     });

     //$('#html5Form').bootstrapValidator();
});

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
    var cpus_text = $(".cpunum").text();
    var cpus_num = parseInt(cpus_text);
    var cpus_num = 0.5;
    inBusy("mongodb服务正在创建，请稍候...");
    var vols_ids=[];
    if($("#volume").val()!=null){
        vols_ids.push($("#volume").val());    	
    }
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "services/mongodb",
		    "_method": "POST",
		    "type": "mongodb",
		    "name":$("#servername").val(),
		    "instances_num": $("#instances_num").val(),
		    "resource_name": $("#resource_name").val(),
		    "marathon_name": $("#marathon_name").val(),
		    "zk_hosts": $("#zk_hosts").val(),
		    "version": "mongodb-single",
		    "vols_ids":vols_ids,
		    "port": $("#port").val(),
		    "cpus": cpus_num,
		    "mem": $("#mem").val()
		}),
		success:function (result) {
			notBusy();
			if(result.msg=='OK'){
				$('#MsgAlertModal button').on("click", function(){
					window.location.href="#/webcontent/server/servercluster.html";
				});
				alertShow("提示:", "mongodb服务创建成功!");
				
			}else{
				alertShow("提示:", "mongdb服务创建失败!");
				
			}
			
		}
	});
}
//获取网络、存储
function fngetData(){
	$.ajax({
		type: 'POST', 
		url: '/exchange',
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({
			"_uri": "apps/deployment/baseconfig",
		    "_method": "GET"
		}),
		success:function (result) {
			if(result.msg=='OK'){
				var data=result.data;
				fnnet_Volume(data);
			}
			
		}
	});
};
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
}

$('#CPU').on('click','a',function(){ 
	$("#CPU").find("a").removeClass("btn-info");
	$("#CPU").find("a").removeClass("cpunum");
	$("#CPU").find("a").addClass("btn-default");
    $(this).addClass('btn-info'); $(this).addClass('cpunum'); 
   // $(this).removeAttr('s'); 
 
});
$("#sample-onehandle").noUiSlider({
    range: [100, 4096],
    start: 100,
    step: 20,
    handles: 1,
    connect: "lower",
    serialization: {
        to: [$("#low"), 'html']
    },
    slide: function() {
		var values = $(this).val();
		$("#mem").val(values);
	  }
});
  function change(obj){
	  var inp_val=$(obj).val();
	  $(obj).val(inp_val.replace(/[^\d.]/g,'')); 
	  $("#sample-onehandle").val(parseInt(inp_val));
	
  }

function initResourceName(){
	$('#resource_name').change( function(){
		name = $(this).val();
	    $.ajax({
	    	type: 'POST', 
	    	url: '/exchange',
	    	contentType: 'application/json',
	    	dataType: 'json',
	    	data:JSON.stringify({
	    		"_uri": "services/marathon?name="+name,
	    	    "_method": "GET"
	    	}),
	    	success:function (result) {
	    		$('#marathon_name').val("");
	    		$('#zk_hosts').val("");
	    		try{
	    			var m_name = result.data.marathon_name;
	    		    var zk_hosts = result.data.zk_hosts;
	    		    $('#marathon_name').val(m_name);
	    		    $('#zk_hosts').val(zk_hosts);
	    		}
	    		catch(e){
	    		    	alert("marathon_name,zk_hosts Exception");
	    		}
	    	},
	    	error:function(result){
	    		$('#marathon_name').val("");
	    		$('#zk_hosts').val("");
	    	}
	    });

	});
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
			var resources = result.data.resource;
			$('#resource_name').empty();
			for(i=0;i<resources.length;i++){
				label = resources[i].label
				name = resources[i].name
				$('#resource_name').append('<option value="'+label+'">'+name+'</option>');
			}
			$('#resource_name').change();
		}
	});
}