$(document).ready(function (){
	//获取启停事件图表
	fnGetData();
	fnGetEchartData('24');
	//获取监控事件图表
	fnGetControlData();
	getEchartData('24');
	fngetUserData();
	alarmScope();
	aa();
	$("#startTime").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss'
	});
	$("#endTime").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
//		startDate:"2017-04-18 12:11:33"
	});
	$("#start").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss'
	});
	$("#end").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
//		startDate:"2017-04-18 12:11:33"
	});
	  /* $('#startTime').datetimepicker({
	        format: "dd MM yyyy - hh:ii",
	        autoclose: true,
	        todayBtn: true,
	        startDate: "2013-02-14 10:00",
	        minuteStep: 10
	    });*/
	/*$('#startTime')
	.datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss'
	})
	.on('changeDate', function(e){
	    //startDate
		//$("#endTime").datetimepicker('setStartDate', '2017-04-18');
	});*/
});


function aa(){
	$('#showMonitor_table').bootstrapTable({
    url: _URL_INTERFACE+"apps/list",
    method: 'POST', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: true,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'id', 
	       queryParams:  function(params){
	    	   return JSON.stringify({"app_ids":app_ids})
	       },
	       
	       toolbar:'#btn-div',
	       columns: [{					
	         title: '#', field: 'app_name', searchable: true, sortable: true,
	         formatter: function (val, row, idx) {
	        	  index = (idx+1);
	        	  return index;
	         }
	       }, {					
	         title: '应用名称', field: 'app_name', searchable: true, sortable: true,
	      
	       },  {
	         title: '系统名称', field: 'sys_name', sortable: true, searchable: true
	       }],
	       responseHandler: function (result) {
	       //	if (result.msg=='OK') {
	       		
	       		var data=result.data;
	       		$("#appnum").text(data.length);
	               return data;
	             // } else {
	             //   return [];
	             // }
	       	//return result;
	       },
	     
	     
	       });
}

menuValidator('#creatDataModal');//新增用户//
menuValidator('#updateDataModal');//更新用户//

//***********get启停事件表格*************//
function fnGetData(data){
	
 $('#editabledatatable').bootstrapTable({
   url: _URL_INTERFACE+"monitor/marathon/eventlog",
   method: 'POST', cache: false,
   ajaxOptions:{headers: {
     "token": token
   }}, search: true,dataType: 'json',
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'id', 
       queryParams:  function (params) {
           return JSON.stringify({
			    "start_time": start,
			    "end_time": nowDate
           });
       },
       toolbar:'#btn-div',
       columns: [{					
         title: '应用ID', field: 'app_id', searchable: true, sortable: true
       },  {
         title: '容器ID', field: 'cnt_id', sortable: true, searchable: true
       },{
         title: '主机IP', field: 'ip_addr', sortable: true, searchable: true
       },{
         title: '端口', field: 'port_info', sortable: true, searchable: true
       },{
         title: '事件类型', field: 'evt_desc', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	 if(val=="stop"){
           		  return '<span class="label label-sm label-azure">停止</span>';
           	  }else if(val=="start"){
           		  return '<span class="label label-sm label-success">启动</span>';
           	  }
            }
       },{
         title: '创建时间', field: 'evt_time', sortable: true, searchable: true
       }],
       responseHandler: function (result) {
       	//if (result.msg=='OK') {
               return result.data;
          //    } else {
          //      return [];
          //    }
       	// //return result;
       },
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (result) {
       },
       onDblClickRow:function(data){	   
       }
     });
 }
//***********get启停事件图表*************//
var nowDate='';
var start='';
function fnGetEchartData(hour){

	if(hour=="111"){
		nowDate=$("#endTime").val();
		start=$("#startTime").val();
	}else{
		nowDate=new Date().Format("yyyy-MM-dd hh:mm:ss");//当前时间
		start=beforeNowtime(hour);
	}
	
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"monitor/marathon/eventcount",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "start_time": start,
		    "end_time": nowDate
       }),
		success:function (result) {
				var data=result.data;
				if(data.length==0){
					data=[];	
				}
					getStopStartEchart('main',data);
					$('#editabledatatable').bootstrapTable("refresh");
			
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
function getStopStartEchart(obj,data){
var timeX=[],start_count=[],stop_count=[];
	if(data.length!=0){
		for(var i=0;i<data.length;i++){
			var arr=data[i];
			timeX.push(arr.time);
			start_count.push(arr.start_count);
			stop_count.push(arr.stop_count);
		}
	}else{
		var time=new Date().Format("yyyy-MM-dd hh:mm:ss");
		timeX.push(time);start_count=[0];start_count=[0];
	}
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(obj));
    // 指定图表的配置项和数据
	option = {
	    title: {
	        text: '容器启停事件统计'
	        //subtext: '数据纯属虚构'
	    },
	    tooltip: {
	    	 trigger: 'axis',
	    	 axisPointer: {
		        type: 'shadow'
	    	 }
	    },
	    color:['#26b379','#343568'],
	    legend: {
	        data: ['容器启动','容器停止']
	    },
	     toolbox: {
		    
		},
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, 0.01]
	    },
	   xAxis: {
	        type: 'category',
	        axisLabel : {
                show:true,
                interval: 0,    // {number}
                rotate: 65,
                margin: 8,
               
                textStyle: {
                    
                    fontFamily: 'sans-serif',
                    fontSize: 11,
                    fontStyle: 'italic',
                   
                }
            },
	        data: timeX
	    },
	    grid: { // 控制图的大小，调整下面这些值就可以，
            x:40,
            x2: 0,
            y2: 5,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
	    series: [
	        {
	            name: '容器启动',
	            type: 'bar',
	            barWidth: '20%',
	            data: start_count
	        },
	        {
	            name: '容器停止',
	            type: 'bar',
	            barWidth: '20%',
	            data: stop_count
	        }
	    ]
	};

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
//获取当前时间
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//获取从现在到 beforetime 小时前的时间（beforetime 只能是整数）
function beforeNowtime(beforetime){
	var setFormat=function (x) {
		  if (x < 10) {
		    x = "0" + x;
		  }
		  return x;
		 }
    var date = new Date(); //日期对象
    date.setHours (date.getHours () - beforetime);
    var now = "";
    now = date.getFullYear()+"-"; //读英文就行了
    now = now + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';//取月的时候取的是当前月-1如果想取当前月+1就可以了
    now = now + setFormat(date.getDate())+" ";
    now = now + setFormat(date.getHours())+":";
    now = now + setFormat(date.getMinutes())+":";
    now = now + setFormat(date.getSeconds())+"";
    return now;
}
//***********get监控事件表格*************//
function fnGetControlData(){
	 $('#controlTable').bootstrapTable({
     url: _URL_INTERFACE+"monitor/alarm/log",
     method: 'GET', cache: false,
     ajaxOptions:{headers: {
       "token": token
     }}, search: true,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'id',
	       toolbar:'#btn-div',
	       columns: [{					
	           title: '应用名称', field: 'itemname', searchable: true, sortable: true
	         },  {
	           title: '告警级别', field: 'state', sortable: true, searchable: true,
	           formatter: function (val, row, idx) {
	          	 if(val=="OK"){
	           		  return '<span class="success">恢复</span>';
	           	  }else if(val=="WARNING"){
	           		  return '<span class="darkorange">严重</span>';
	           	  }else if(val=='CRITICAL'){
	           		 return '<span class="azure">关注</span>';
	        		}
	             }
	         },{
	           title: '告警主机', field: 'hostname', sortable: true, searchable: true
	         },{
	           title: '告警内容', field: 'message', sortable: true, searchable: true
	         },{
	           title: '告警时间', field: 'date', sortable: true, searchable: true
	         }],
	       responseHandler: function (result) {

	               return result.data;
	             // } else {
	             //   return [];
	             // }
               //
	       },
	       onSearch: function (text) {
				console.info(text);
			},
	       onLoadSuccess: function (result) {
	    	   
	       },
	       onDblClickRow:function(data){
	    	   
	       }
	     });
	 }
//***********get监控事件图表*************//
function getEchartData(hour){
	var nowDate='';
	var start='';
	if(hour=="222"){
		nowDate=$("#end").val();
		start=$("#start").val();
		
	}else{
		nowDate=new Date().Format("yyyy-MM-dd hh:mm:ss");//当前时间
		start=beforeNowtime(hour);
	}

	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"monitor/alarm/count",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "start_time": start,
		    "end_time": nowDate
       }),
		success:function (result) {
				var data=result.data;
				if(data.length==0){
					data=[];
				}
					getControlEchart('alarm',data);
			
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
function fnCreateMonitor(){
    $("#creatDataModal").modal('show');
}
function getControlEchart(obj,data){
	var timeX=[],serious=[],concern=[],recover=[];
	if(data.length!=0){
		for(var i=0;i<data.length;i++){
			var arr=data[i];
			timeX.push(arr.time);
			serious.push(arr.WARNING);
			concern.push(arr.CRITICAL);
			recover.push(arr.OK);
		}
	}else{
		var time=new Date().Format("yyyy-MM-dd hh:mm:ss");
		timeX.push(time);serious=[0];concern=[0];recover=[0];
	}
	
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(obj));
    // 指定图表的配置项和数据
	option = {
	    title: {
	        text: '监控告警事件统计'
	        //subtext: '数据纯属虚构'
	    },
	    tooltip: {
	    	 trigger: 'axis',
	    	 axisPointer: {
		        type: 'shadow'
	    	 }
	    },
	    color:['#c84118','#384459','#26b379'],
	    legend: {
	        data: ['严重','关注','恢复']
	    },
	     toolbox: {
		    show : true,
		    feature : {
		        dataView : {show: true, readOnly: false},
		        saveAsImage : {show: true}
		    }
		},
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, 0.01]
	    },
	   xAxis: {
	        type: 'category',
	        axisLabel : {
                show:true,
                interval: 0,    // {number}
                rotate: 65,
                margin: 8,
               
                textStyle: {
                    
                    fontFamily: 'sans-serif',
                    fontSize: 11,
                    fontStyle: 'italic',
                   
                }
            },
	        data: timeX
	    },
	    grid: { // 控制图的大小，调整下面这些值就可以，
            x:40,
            x2: 0,
            y2: 5,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
	    series: [
	        {
	            name: '严重',
	            type: 'bar',
	            barWidth: '20%',
	            data: serious
	        },
	        {
	            name: '关注',
	            type: 'bar',
	            barWidth: '20%',
	            data: concern
	        },
	        {
	            name: '恢复',
	            type: 'bar',
	            barWidth: '20%',
	            data: recover
	        }
	    ]
	};

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function alarmScope(){
	var target = $("select[name='alarmScope']").empty();
	  target.selectpicker('refresh');
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"apps/list",
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
				var data=result.data;
				if(data.length != 0){
					for (var i = 0; i < data.length; i++){
						target.append("<option value='"+data[i].id+"' app_id='"+data[i].app_id+"'>"+data[i].app_name+"("+data[i].sys_name+")</option>"); 
					}
				}
			 target.selectpicker('refresh');
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
function commonAlert(msgObjectName,alertObject,msg)
{
	$(msgObjectName).html(msg);
	$(alertObject).show();
}

//***********创建用户*************//
function createUser(){
	
	$.ajax({
    type: 'POST',
    url: _URL_INTERFACE+"monitor/alarm/user",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "status":"0",//键
		    "username":$("#username").val(),//用户名
		    "mobile_phone":$("#telephone").val(),//手机号
		    "app_ids":$("#alarmScope").selectpicker('val'),
		    
		}),
		success:function (result) {
			$("#creatDataModal").modal('hide');
				commonAlert("#successMsg", "#successAlertBlock", "联系人添加成功");
				$('#handle_table').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#creatDataModal").modal('hide');
        commonAlert("#warningMsg", "#warningAlertBlock", "联系人添加失败");
      }
    }
	});   	  
}

//***********更新用户*************//
function updateUser(status){
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"monitor/alarm/user",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":"update",
		    "id":$("#basedataid").text(),
		    "username":$("#name_U").val(),//用户名
		    "mobile_phone":$("#telephone_U").val(),//手机号
		    "app_ids":$("#alarmScope_U").selectpicker('val'),
		    
		}),
		success:function (result) {
			$("#updateDataModal").modal('hide');
				commonAlert("#successMsg", "#successAlertBlock", "联系人更新成功");
				$('#handle_table').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#updateDataModal").modal('hide');
        commonAlert("#warningMsg", "#warningAlertBlock", "联系人更新失败");
      }
    }
	});   	  
}
var appnum="";
//***********get维护人信息表格*************//
function fngetUserData(){
	 $('#handle_table').bootstrapTable({
     url: _URL_INTERFACE+"monitor/alarm/user",
     method: 'GET', cache: false,
     ajaxOptions:{headers: {
       "token": token
     }}, search: true,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'id', 

	       toolbar:'#btn-div',
	       columns: [{					
	         title: '姓名', field: 'username', searchable: true, sortable: true
	       },  {
	         title: '联系电话', field: 'mobile_phone', sortable: true, searchable: true
	       },{
	         title: '告警状态', field: 'status', sortable: true, searchable: true,
	         formatter: function (val, row, idx) {
	          	  if(val=='0'){
	          		  return '<span class="label label-success label-sm">开通</span>';
	          	  }else{
	          		  return '<span class="label label-sm label-darkorange">关闭</span>';
	          	  }
	            }
	       },{
	         title: '操作', field: 'id', sortable: true, searchable: true,
	         formatter: function (val, row, idx) {
	        	 var handle='';
	        	 var username=row['username'];
//	        	 var appnum=row['app_ids'].length;
	        	  if(row['status'] == '0'){
	        		  handle='<a href="javascript:void(0)" class="btn btn-default btn-sm margin-right-5" onclick="showclockModal('+val+')"><i class="fa fa-bell-o"></i>关闭告警</a>';  
	        	  }else{
	        		  handle='<a href="javascript:void(0)" class="btn btn-default btn-sm margin-right-5" onclick="showunclock('+val+')"><i class="fa fa-bell-slash-o"></i>开通告警</a>';  
	        	  }
	        	  handle+='<a href="javascript:void(0)" class="btn btn-default btn-sm margin-right-5" onclick="Watchlramuser(\''+val+'\',\''+username+'\',\''+appnum+'\')"><i class="fa fa-keyboard-o"></i>查看信息</a>';
	        	  handle+='<a href="javascript:void(0)" class="btn btn-default btn-sm margin-right-5" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
	        	  handle += '<input type="hidden" name="'+val+'" value="'+String(row.app_ids)+'">'
	        	  return handle;
	            }
	       }],
	       responseHandler: function (result) {
	       	//if (result.msg=='OK') {
	               return result.data;
	            // } else {
	             //   return [];
	             // }
	       	//return result;
	       },
	       onSearch: function (text) {
				console.info(text);
			},
	       onLoadSuccess: function (result) {
	    	   //getEchart('main',result);
	       },
	       onDblClickRow:function(data){
	       	var id=data.id;
	       	$("#updateDataModal").modal('show');
	       	//getType('#dataTypes_U');
	       	fnhandleupdate(id);
	    	   
	       }
	     });
	 }
//***********编辑modal获取数据*************//
function fnhandleupdate(id){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"monitor/alarm/user?id="+id,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {
			var data=result.data;
			$("#name_U").val(data.username),//用户名
		    $("#telephone_U").val(data.mobile_phone),//手机号
		    $("#alarmScope_U").selectpicker('val',data.app_ids)//模型
		    $("#basedataid").text(data.id);
			
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

//***********切换告警状态************//
function fnUpdatestatus(status,obj){	
	$.ajax({
    type: 'PUT',
    url: _URL_INTERFACE+"monitor/alarm/user",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "type":status,//键	
		    "id":$("#basedataid").text()
		}),
		success:function (result) {
			$(obj).modal('hide');
				commonAlert("#successMsg", "#successAlertBlock", "操作成功");
				$('#handle_table').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $(obj).modal('hide');
        commonAlert("#warningMsg", "#warningAlertBlock", "操作失败");
      }
    }
	});   	  
}
//查看监控
function Watchlramuser(id,username,appnum){
	
	$("#Watchlramuser").modal("show");
	$("#username_m").text(username);
	$("#appnum").text(appnum);
	fngetmonitorData(id);
}
var app_ids="";
function fngetmonitorData(id){
//	fnhandleupdate(id);
//	var app_ids= $("#alarmScope_U").selectpicker('val');
	var s = $('#handle_table input[name="'+id+'"]').val();
	 app_ids=s.split(',');
	$('#showMonitor_table').bootstrapTable('refresh');
	 
	 
}

//开通告警
function showclockModal(data){
	$("#lockUser").modal("show");
	$("#basedataid").text(data);
}
function lock(){
	fnUpdatestatus("close","#lockUser");
}
//关闭告警
function showunclock(data){
	$("#unlockUser").modal("show");
	$("#basedataid").text(data);
}
function unlock(){
	fnUpdatestatus("open","#unlockUser");
}

//删除菜单
function showdeleteModal(data){
	$("#DeleteUser").modal("show");
	$("#deleteID").text(data);
}
function deleteData(){
	var id=$("#deleteID").text();
	$.ajax({
    type: 'DELETE',
    url: _URL_INTERFACE+"monitor/alarm/user",
    headers: {
      "token": token
    },
		dataType: 'json',
		data:JSON.stringify({
		    "id":id
		}),
		success:function (result) {
			$("#DeleteUser").modal("hide");
				commonAlert("#successMsg", "#successAlertBlock", "联系人删除成功");
				$('#handle_table').bootstrapTable("refresh");
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        $("#DeleteUser").modal("hide");
        commonAlert("#warningMsg", "#warningAlertBlock",'联系人删除失败');
      }
    }
	});
}

//维护人表单验证
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
      		createUser();
      	}else{
      		updateUser("0");
      	}	  
      },
      fields: {
         name: {
              validators: {
                  notEmpty: {
                      message: '用户名不能为空'
                  }
//                  regexp: {
//                      regexp: /^[a-zA-Z\u4e00-\u9fa5_]+$/,
//                      message: '用户名只能包含大写、小写、汉字'
//                  }
              }
          },
          telephone: {
              validators: {
                  notEmpty: {
                      message: '电话不能为空'
                  },
                  regexp: {
                    regexp: /^1[0-9]{10}$/,
                    message: '电话格式有误，请重输'
                }
              }
          }
        
      }
  });
	}

$('#creatDataModal').on('show.bs.modal', function () {
	  $("input").val('');
	  //$('#creatApplition').modal({backdrop: 'static', keyboard: false});
	});
function fnUpdate(){
	$("#updateDataModal").modal('show');
	
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