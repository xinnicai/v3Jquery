$(document).ready(function (){
	//fngetData();//获取网络、存储
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
            }
//             port: {
//                 validators: {
//                     notEmpty: {
//                         message: '端口不允许为空'
//                     },
//                     regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
//                         regexp: /^[0-9]*$/,
//                         message: '只能是数字'
//                     },
//                     stringLength: {
//                         min: 4,
//                         max: 5,
//                         message: '端口长度必须在为4或5位数'
//                     }
//                 }
//             }
//            
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
    var _uri='',version='';
    if($("#typetitle").text()=="centos"){
    	inBusy("Centos服务正在创建，请稍候...");
    	_uri="services/centos";
    	version="centos-7";
    }else{
    	inBusy("Ubuntu服务正在创建，请稍候...");
    	_uri="services/ubuntu";
    	version="ubuntu-16";
    }
    
	$.ajax({
        type: 'POST',
        url: _URL_INTERFACE+_uri,
        headers: {
            "token": token
        },
		dataType: 'json',
		data:JSON.stringify({
		    "type": $("#typetitle").text(),
		    "name":$("#servername").val(),
		    "instances_num": $("#instances_num").val(),
		    "resource_name": $("#resource_name").val(),
		    "marathon_name": $("#marathon_name").val(),
		    "zk_hosts": $("#zk_hosts").val(),
		    "version":version,
		    "vol_id": $("#volume").val(),
		    "cpus": cpus_num,
		    "mem": $("#mem").val()
		}),
		success:function (result) {
			notBusy();
				$('#MsgAlertModal button').on("click", function(){
					window.location.href="#/webcontent/server/servercluster.html";
				});
				alertShow("提示:", $("#typetitle").text()+"服务创建成功!");

		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                notBusy();
                alertShow("提示:", $("#typetitle").text()+"服务创建失败!");
            }
        }
	});
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
            type: 'GET',
            url: _URL_INTERFACE+"services/marathon?name="+name,
            headers: {
                "token": token
            },
	    	dataType: 'json',
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
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status === 401){
                    window.location.href = '#/login.html';
                }else{
                    $('#marathon_name').val("");
                    $('#zk_hosts').val("");
                }
            }
	    });

	});
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'apps/deployment/baseconfig',
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
			var resources = result.data.resource;
			$('#resource_name').empty();
			for(i=0;i<resources.length;i++){
				label = resources[i].label
				name = resources[i].name
				$('#resource_name').append('<option value="'+label+'">'+name+'</option>');
			}
			$('#resource_name').change();
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                // alert('添加失败！（例子）');//其他操作
            }
        }
	});
}