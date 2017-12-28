$(document).ready(function (){
	fnGetMonitor("1h");//监控
	fnGetVolumeDetail(volumeId);
    fngetData(volumeName,cluster_name);//获取快照列表

    // fnGetkuaizhaoDetail(volumeName,cluster_name);
  fnAppListTable();

});
//var params = parseParams(self.location.search);
var volumeName = getUrlParam('volumename');//params.volumename;
var volumeId = getUrlParam('volumeid');//params.volumeid;
var cluster_name=getUrlParam('cluster_name');
/*var Volume=window.location.href.split('?')[1];
var =Volume.split("&&")[0];
var volumeId=Volume.split("&&")[1];*/

function fnGetVolumeDetail(vo_id){
	$.ajax({
		type: 'GET',
		url: _URL_INTERFACE+"volumes/"+vo_id,
		headers:{token:token},
		dataType: 'json',
		success:function (result) {
			var data=result.data[0];
			fndetailhandle(data);			
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        alert('获取失败！');
      }
    }
	});
}
function fnGetkuaizhaoDetail(volumeName,cluster_name){
    $.ajax({
        type: 'post',
        url: _URL_INTERFACE+"volumes/snapshot",
        headers:{token:token},
        dataType: 'json',
        data:JSON.stringify({
            "name":volumeName,//网络名称
            "cluster_name":cluster_name
        }),
        success:function (result) {
            var data=result.data[0];
        },
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href ='#/login.html';
            }else{
                alert('获取失败！');
            }
        }
    });
}
function fndetailhandle(data){
	$("#volumename").text(data.name);
	$("#Volumepage").text(data.name);
	if(data.status=="0"){
		$("#volumestatus").html('<span class="label label-default label-sm">未挂载</span>');
	  }else if(data.status=="1"){
		 $("#volumestatus").html('<span class="label label-success label-sm">已挂载</span>');
	  }
	$("#serviceCPU").text(data.file_format);//格式
	$("#serviceMem").text(data.size);
	$("#hostpath").text(data.hostpath);//挂载目录
	$("#vo_remark").text(data.remark);//备注
	$("#cluster_name").text(data.cluster_name);
	//$("#table_body").empty();
		// var _html='';
	// if(data.app_name=="" &&　data.vol_usage=="0%"){
	// 	_html="<tr><td colspan='7' align='center'>暂无查询数据</td></tr>";
	// }else{
	// 	_html+='<tr>';
	// 	_html+='<td>'+data.app_name+'</td>';
	// 	_html+='<td >'+data.sys_name+'</td>';
	// 	if(data.vol_usage=="0%"){
	// 		_html+='<td></td>';
	// 	}else{
	// 		_html+='<td>'+data.vol_usage+'%</td>';
	// 	}
	// 	if(data.app_status=='start'){
	// 		_html+='<td><a class="label label-success" >运行</a></td></tr>';
	// 	}else{
	// 		_html+='<td></td></tr>';
	// 	}
	// }
	//
	
	//$("#table_body").append(_html);
}
function fnAppListTable(){
  $('#table_body').bootstrapTable({
    url: _URL_INTERFACE+"volumes/"+volumeId, method: 'GET', cache: false,
    ajaxOptions:{headers: {
      "token": token
    }}, search: false,dataType: 'json',
    pagination: true, pageSize: 10,//data:"result.data",
    uniqueId: 'id',
    toolbar:'#btn-div',
    columns: [{
      title: '模块名称', field: 'app_name', searchable: true, sortable: true
    },  {
      title: '模块类型', field: 'sys_name', sortable: true, searchable: true
    },{
      title: '存储使用率', field: 'vol_usage', sortable: true, searchable: true,
      // formatter: function (val, row, idx) {
      //   if(val=='0%'){
      //     return '';
      //   }
      // }
    },{
      title: '状态', field: 'app_status', sortable: true, searchable: true,
      formatter: function (val, row, idx) {
        if(val=='start'){
          return '<a class="label label-success" >运行</a>';
        }
      }
    }],
    responseHandler: function (result) {
			if(result.data[0].app_name==''){
        return [];
			}else{
        return result.data;
			}


    },
    onSearch: function (text) {
    },
    onLoadSuccess: function (data) {
        console.log(data);
    },
    onDblClickRow:function(data){
    }
  });
}
function fngetData(volume_name,cluster_name){
	$.ajax({
		type: 'GET',
		url: _URL_INTERFACE+"volumes/snapshot/"+volume_name+"/"+cluster_name,
		headers:{token:token},
		dataType: 'json',
		success:function (result) {
            // fnGetkuaizhaoDetail(volume_name,cluster_name);
			$('#editabledatatable').empty();
			// if(result.msg=='OK'){
				var data=result.data;
				var html='';
				for(var i=0;i<data.length;i++){
					html='<tr><td >'+data[i]+'</td></tr>';
//	                    +'<td><a class="btn btn-sm btn-default" href="#" data-toggle="modal" data-target="#modal-info"><i class="fa   fa-mail-reply"></i>回滚</a>'
//	        			+'<a class="btn btn-sm btn-default" href="#" data-toggle="modal" data-target="#krvloume"><i class="fa  fa-trash-o"></i>删除</a>'
//	                    +'</td>';
	                  $('#editabledatatable').append(html);
				}
			// }
			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
        alert('获取失败！');
      }
    }
	});
//	$('#editabledatatable').bootstrapTable({
//        url: '/exchange', method: 'POST', cache: false,
//        contentType: 'application/json', search: false,dataType: 'json',
//        pagination: true, pageSize: 10,//data:"result.data",
//        //uniqueId: 'id', 
//        queryParams:  function (params) {
//            return JSON.stringify({
//            	"_uri": "volumes/snapshot/"+volume_name,
//			    "_method": "GET"
//            });
//        },
//        toolbar:'#btn-div',
//        columns: [/*{					
//          title: '快照名称', field: 'name', searchable: true, sortable: true,
//          formatter: function (val, row, idx) {
//          	  return  '<a href="Volumelist.html">'+val+'</a>';
//                  }
//        },  {
//          title: '快照容量（MB）', field: 'app_id', sortable: true, searchable: true,
//          
//        }, {
//          title: '大小(GB)', field: 'size',sortable: true, searchable: true, 
//        },{
//          title: '描述', field: 'status',sortable: true, searchable: true, 
//          formatter: function (val, row, idx) {
//        	  if(val=="0"){
//        		  return '<span class="label label-default label-sm">未挂载</span>';
//        	  }else if(val=="1"){
//        		  return '<span class="label label-success label-sm">已挂载</span>';
//        	  }
//           }
//        },*/{
//          title: '创建时间', field: 'timestamp',sortable: true, searchable: true, 
//        }, {
//          title: '操作', field: 'timestamp',formatter: function (val, row, idx) {
//  	  return  '<a class="btn btn-sm btn-default" href="#" data-toggle="modal" data-target="#krvloume"><i class="fa  fa-arrows"></i>扩容</a>'
//  	  		+'<a href="javascript:void(0)" class="btn btn-default btn-sm" onclick="showdeleteModal('+val+')"><i class="fa fa-trash-o"></i>删除</a>';
//          }
//        }],
//        responseHandler: function (result) {
//        	if (result.msg=='OK') {
//                return result.data;
//              } else {
//                return [];
//              }
//        	//return result;
//        },
//        onSearch: function (text) {
//			console.info(text);
//		},
//        onLoadSuccess: function (data) {
// 	
//        },
//        onDblClickRow:function(data){
//        	
//        }
//      });
}
//监控信息图表+"/"+type
function fnGetMonitor(d){
	var start=beforeNowtime('24');
	var nowDate=beforeNowtime('0');
	$.ajax({
		type: 'POST', 
		url:  _URL_INTERFACE+"volumes/io",
		headers:{token:token},
		dataType: 'json',
		data:JSON.stringify({
			"name":volumeName,
		    "start_time": start,
		    "end_time": nowDate,
		    "groupby": d
		}),
		success:function (result) {
			var data=result.data;
			fnMonitorEchart('monitorInfoCPU',d,data);			
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href ='#/login.html';
      }else{
        alert('设置失败！');
      }
    }
	});
}
function fnMonitorEchart(obj,type,data){
var timeX=[],io_write=[],io_read=[];
if(data && data.length!=0){
	for(var i=0;i<data.length;i++){
		var arr=data[i];
		timeX.push(arr.times);
		io_write.push(arr.io_write);
		io_read.push(arr.io_read);
	}
	
}
var t='';
if(type=="1d"){
	t="天";
}else if(type=="1h"){
	t="小时";
}else if(type=="1w"){
	t="周";
}
	//基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById(obj));

	option = {
	title: {
	text: 'I/O'
	},
	color:['#26b379','#343568'],
    legend: {
        data: ['读','写']
    },
	tooltip: {
	trigger: 'axis'
	},
	toolbox: {
	show: true,

	},
	xAxis:  {
		type: 'category',
		boundaryGap: false,
		data: timeX
	},
	yAxis: {
		type: 'value'
	},
	visualMap: {
		show: false,
		dimension: 0,
		pieces: [{
		    lte: 6,
		    color: 'green'
		}, {
		    gt: 6,
		    lte: 8,
		    color: 'green'
		}, {
		    gt: 8,
		    lte: 14,
		    color: 'green'
		}, {
		    gt: 14,
		    lte: 17,
		    color: 'red'
		}, {
		    gt: 17,
		    color: 'green'
		}]
	},
	series: [
		{
		    name:'读',
		    type:'line',
		    smooth: true,
		    data: io_read
		    
		},
		{
		    name:'写',
		    type:'line',
		    smooth: true,
		    data: io_write
		    
		}
	]
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}

//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
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