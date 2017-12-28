$(document).ready(function (){
	//获取图表
	fngetData();
	//get 用户
	getSelectUser();
	//get事件
	getSelectEvent();
	
	fnUserEchart();
	$("#startTime").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss'
	});
	$("#endTime").datetimepicker({
		format : 'YYYY-MM-DD HH:mm:ss',
//		startDate:"2017-04-18 12:11:33"
	});
});
function fnUserEchart(){
  var data;
	if(_user.username=="admin"){
		var username=_user.username;
		data=JSON.stringify({
			"_uri": "log/event/count?",
		    "_method": "GET"
		});
	}else{
		var t_type='';
		var username=_user.username;
		var type=$("#select_event").selectpicker('val');
		data=JSON.stringify({
			"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
		    "_method": "GET"
		});
  }
  getEchartData(data);
}
//***********get表格*************//
function fngetData(){
//	var username=$("#select_user").selectpicker('val');
//	var type=$("#select_event").selectpicker('val');
  $("#editabledatatable").bootstrapTable('destroy');
  $('#editabledatatable').bootstrapTable({
       url: _URL_INTERFACE+"log/event?username="+$("#select_user").selectpicker('val')+"&type="+$("#select_event").selectpicker('val')+"&t_type="+t_type+"&start_time="+start+"&end_time="+nowDate,
	 method: 'get', cache: false,
       ajaxOptions:{headers:{"token": token}}, search: true,dataType: 'json',
   contentType: "application/x-www-form-urlencoded",
       pagination: true, pageSize: 10,//data:"result.data",
       uniqueId: 'id',
       toolbar:'#btn-div',
       columns: [{					
         title: '应用名称', field: 'app_id', searchable: true, sortable: true
       },  {
         title: '操作事件类型', field: 'type', sortable: true, searchable: true
       },{
         title: '操作结果', field: 'result', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  if(val=='0'){
          		  return '<span class="label label-success label-sm">成功</span>';
          	  }else{
          		  return '<span class="label label-sm label-darkorange">失败</span>';
          	  }
            }
       },{
         title: '结果描述', field: 'detail', sortable: true, searchable: true
       },{
         title: '操作人', field: 'username', sortable: true, searchable: true
       },{
         title: '创建时间', field: 'create_time', sortable: true, searchable: true
       }],
       responseHandler: function (result) {
       	// if (result.msg=='OK') {
               return result.data;
             // } else {
             //   return [];
		},
       onLoadSuccess: function (result) {
    	   //getEchart('main',result);
       },
       onDblClickRow:function(data){
//       	var id=data.id;
//       	$("#updateDataModal").modal('show');
//       	getType('#dataTypes_U');
//       	fnhandleupdate(id);
       }
     });
 }

//***********get图表data*************//
function getEchartData(data){
	data = JSON.parse(data);
	$.ajax({
		type: data._method,
		url: _URL_INTERFACE+data._uri,
		headers:{token:token},
		dataType: 'json',
		data:data,
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				
					getEchart("main",data);

			// }
			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert('获取失败！');//其他操作
      }
    }
	});
}
var t_type='';
function fnhour(){
	t_type='h';
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	var data=JSON.stringify({
		"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
	    "_method": "GET"
	});
	getEchartData(data);
  fngetData();
	//$('#editabledatatable').bootstrapTable("refresh");
}
function fnday(){
	t_type='d';
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	var data=JSON.stringify({
		"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
	    "_method": "GET"
	});
	getEchartData(data);
  fngetData();
  //$('#editabledatatable').bootstrapTable("refresh");
}
function fnmonth(){
	t_type='m';
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	var data=JSON.stringify({
		"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
	    "_method": "GET"

	});
	getEchartData(data);
  fngetData();
  //$('#editabledatatable').bootstrapTable("refresh");
}
var nowDate='';
var start='';
function fndefine(){
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	nowDate=$("#endTime").val();
	start=$("#startTime").val();
	var data=JSON.stringify({
		"_uri": "log/event/count?username="+username+"&type="+type+"&start_time="+start+"&end_time="+nowDate,
	    "_method": "GET"
	});
	getEchartData(data);
  fngetData();
  //$('#editabledatatable').bootstrapTable("refresh");
}

$("#select_user").on('changed.bs.select', function (e, idx, newVal, oldVal){//debugger;
	var t_type='';
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	var data=JSON.stringify({
		"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
	    "_method": "GET"
	});
	getEchartData(data);

  fngetData();
	//$('#editabledatatable').bootstrapTable("refresh");
});
$("#select_event").on('changed.bs.select', function (e, idx, newVal, oldVal){//debugger;
	var t_type='';
	var username=$("#select_user").selectpicker('val');
	var type=$("#select_event").selectpicker('val');
	var data=JSON.stringify({
		"_uri": "log/event/count?t_type="+t_type+"&username="+username+"&type="+type,
	    "_method": "GET",

	});
	getEchartData(data);
  fngetData();
  //$('#editabledatatable').bootstrapTable("refresh");
});
//获取用户
function fnUser(){
	
}
//get用户角色
function getSelectUser(){
	var target = $("#select_user").empty();
	  target.selectpicker('refresh');
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'platform/users',
		headers:{token:token},
		dataType: 'json',
		success:function (result) {
			// if(result.msg=='OK'){
				if(_user.username!="admin"){
					target.append("<option value='"+_user.username+"'>"+_user.username+"</option>"); 
					target.prop("disabled",true);
					target.selectpicker('val',_user.username);
				}else{
					target.prop("disabled",false);
					var data=result.data;
					if(data.length != 0){
						for (var i = 0; i < data.length; i++){
							target.append("<option value='"+data[i].username+"'>"+data[i].username+"</option>"); 
						}
					}
				}
				
			// }
			 target.selectpicker('refresh');
		},
		error:function (XMLHttpRequest, textStatus, errorThrown) {
    if(XMLHttpRequest.status === 401){
      window.location.href = '#/login.html';
    }else{
      alert('获取失败！');//其他操作
    }
  }
	});
}
function getSelectEvent(){
	var target = $("#select_event").empty();
	  target.selectpicker('refresh');
	$.ajax({
		type: 'get',
		url: _URL_INTERFACE+'log/event/type',
    headers:{token:token},
		dataType: 'json',
		success:function (result) {
			// if(result.msg=='OK'){
				var data=result.data;
				if(data.length != 0){
					for (var i = 0; i < data.length; i++){
						target.append("<option value='"+data[i]+"'>"+data[i]+"</option>"); 
					}
				}
			// }
			 target.selectpicker('refresh');
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert('获取失败！');//其他操作
      }
    }
	});
}
function getEchart(obj,data){
	var timeX=[],success=[],fail=[];
	
	if(data.length=="0"){
		
	}else{
		for(var i=0;i<data.length;i++){
			var arr=data[i];
			timeX.push(arr[0]);
			fail.push(arr[1]);
			success.push(arr[2]);
		}
	}
	
	
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(obj));
    // 指定图表的配置项和数据
	option = {
	    title: {
	        text: '平台日志统计',
//	        subtext: '数据纯属虚构'
	    },
	    tooltip: {
	    	 trigger: 'axis',
	    	 axisPointer: {
		        type: 'shadow'
	    	 }
	    },
	    color:['#26b379','#384459'],
	    legend: {
	        data: ['成功', '失败']
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
	            name: '成功',
	            type: 'bar',
	            barWidth: '30%',
	            data: success
	        },
	        {
	            name: '失败',
	            type: 'bar',
	            barWidth: '30%',
	            data: fail
	        }
	    ]
	};

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
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