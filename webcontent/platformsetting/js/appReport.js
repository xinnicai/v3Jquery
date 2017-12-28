$(document).ready(function (){
	fnGetTableData();
});

function fnGetTableData(){
	var _userName=_user.username;
	$('#editabledatatable').bootstrapTable({
        url: _URL_INTERFACE+"monitor/report?username="+_userName, method: 'GET', cache: false,
        ajaxOptions:{headers: {
            "token": token
        }},search: true,dataType: 'json',
	       pagination: true, pageSize: 10,//data:"result.data",
	       uniqueId: 'app_id',
	       toolbar:'#btn-div',
	       striped: true, 
			columns: [
				[
				    {
				    	field: 'app_id', title: '应用ID', visible: false, searchable: false, rowspan:2, align: 'center', valign: 'middle'
					}, {
						field: 'app_name', title: '应用名称', sortable: true, rowspan:2, align: 'center', valign: 'middle'
					}, {
						field: 'day', title: '一天', colspan:4, align: 'center', valign: 'middle'
					}, {
						field: 'week', title: '一周', colspan:4, align: 'center', valign: 'middle'
					}, {
						field: 'month', title: '一月', colspan:4, align: 'center', valign: 'middle'
					}
				], [//CPU	内存	网络	IO
				    {
						field: 'ratio_cpu', title: 'CPU%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="DAY" '
								+' data-showmoretype="CPU" data-showappid="'+row['app_id']+'" onclick="showMore(\'day\', \'cpu\',\'CPU\', \''+row['app_id']+'\')">' 
								+ row['day']['ratio_cpu'] + '</a>';
						}
					}, {
						field: 'ratio_mem', title: '内存%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="DAY" '
								+' data-showmoretype="MEM" data-showappid="'+row['app_id']+'" onclick="showMore(\'day\', \'mem\',\'内存\', \''+row['app_id']+'\')">' 
								+ row['day']['ratio_mem'] + '</a>';
						}
					}, {
						field: 'io_read', title: '网络 read/write(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['day']['io_read']+'/'+row['day']['io_write'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="DAY" '
								+' data-showmoretype="NET" data-showappid="'+row['app_id']+'" onclick="showMore(\'day\', \'io\',\'网络\', \''+row['app_id']+'\')">' 
								+ val + '</a>';
						}
					}, {
						field: 'net_in', title: 'I/O read/write(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['day']['net_in']+'/'+row['day']['net_out'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="DAY" '
								+' data-showmoretype="IO" data-showappid="'+row['app_id']+'" onclick="showMore(\'day\', \'net\',\'I/O\', \''+row['app_id']+'\')">' 
								+ val + '</a>';
						}
					}, {
						field: 'ratio_cpu', title: 'CPU%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="WEEK" '
								+' data-showmoretype="CPU" data-showappid="'+row['app_id']+'" onclick="showMore(\'week\', \'cpu\',\'CPU\', \''+row['app_id']+'\')">' 
								+ row['week']['ratio_cpu'] + '</a>';
						}
					}, {
						field: 'ratio_mem', title: '内存%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="WEEK" '
								+' data-showmoretype="MEM" data-showappid="'+row['app_id']+'" onclick="showMore(\'week\', \'mem\', \'内存\',\''+row['app_id']+'\')">' 
								+ row['week']['io_read'] + '</a>';
						}
					}, {
						field: 'io_read', title: '网络 read/write(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['week']['io_read']+'/'+row['week']['io_write'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="WEEK" '
								+' data-showmoretype="NET" data-showappid="'+row['app_id']+'" onclick="showMore(\'week\', \'net\',\'网络\',\''+row['app_id']+'\')" >' 
								+ val + '</a>';
						}
					}, {
						field: 'net_in', title: 'I/O read/write(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['week']['net_in']+'/'+row['week']['net_out'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="WEEK" '
								+' data-showmoretype="IO" data-showappid="'+row['app_id']+'" onclick="showMore(\'week\', \'io\',\'I/O\', \''+row['app_id']+'\')">' 
								+ val + '</a>';
						}
					}, {
						field: 'ratio_cpu', title: 'CPU%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="MONTH" '
								+' data-showmoretype="CPU" data-showappid="'+row['app_id']+'" onclick="showMore(\'month\', \'cpu\',\'CPU\', \''+row['app_id']+'\')">' 
								+ row['month']['ratio_cpu'] + '</a>';
						}
					}, {
						field: 'ratio_mem', title: '内存%', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="MONTH" '
								+' data-showmoretype="MEM" data-showappid="'+row['app_id']+'" onclick="showMore(\'month\', \'mem\', \'内存\',\''+row['app_id']+'\')">' 
								+ row['month']['ratio_mem'] + '</a>';
						}
					}, {
						field: 'io_read', title: '网络<span class="text-blue"> read/write</span>(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['month']['io_read']+'/'+row['month']['io_write'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="MONTH" '
								+' data-showmoretype="NET" data-showappid="'+row['app_id']+'" onclick="showMore(\'month\', \'net\', \'网络\',\''+row['app_id']+'\')" >' 
								+ val + '</a>';
						}
					}, {
						field: 'net_in', title: 'I/O read/write(MB)', sortable: true, searchable: false,
						formatter: function (value, row, index) {
							var val=row['month']['net_in']+'/'+row['month']['net_out'];
							return '<a href="javascript:;" data-type="showmore" data-showmoresort="MONTH" '
								+' data-showmoretype="IO" data-showappid="'+row['app_id']+'" onclick="showMore(\'month\', \'io\', \'I/O\',\''+row['app_id']+'\')">' 
								+ val + '</a>';
						}
					}
				]
			],
	       responseHandler: function (result) {
	    	   
	       //	if (result.msg=='OK') {
	       		
	               return result.data;

	             // } else {
	             //   return [];
	             // }
	       	//return result;
	       },
	       onSearch: function (text) {
			},
	       onLoadSuccess: function (data) {
               console.log(data);
	       }
//	       onClickCell:function(a,b,c,d){
//				var sort = $(d).find("a").data('showmoresort');
//				var type = $(d).find("a").data('showmoretype');
//				var appid = $(d).find("a").data('showappid');
//				showMore(sort, type, appid);
//			}
	     });
}
function showMore(sort, type,china,appid){
	$.ajax({
        type: 'get',
        url: _URL_INTERFACE+"monitor/report/detail?app_id="+appid+"&type="+type+"&scope="+sort,
        headers: {
            "token": token
        },
		dataType: 'json',
		success:function (result) {
			$("#showMoreModal").modal("show");
			$("#moretype").text(china);
				var data=result.data;
				if(data.app_id){
					markEchart(data,type);
				}else{
					$("#moreEchart").html("暂无查询记录");
				}

		},
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                $("#showMoreModal").modal("show");
                $("#moretype").text(china);
            }
        }
	});
}
function markEchart(data,type){
	var myChart = echarts.init(document.getElementById('moreEchart'));
    var one=[],two=[],time=[],app_name=[];
    for(var i=0;i<data.value1.length;i++){//时间
    	time.push(data.value1[i].time);
    	one.push(data.value1[i].value);
    }
    if(data.value2){
    	for(var i=0;i<data.value2.length;i++){//时间
        	two.push(data.value2[i].value);
        }
    }
    
    if(type=='CPU'){
    	app_name=['CPU'];
    }else if(type=='mem'){
    	app_name=['内存'];
    }else if(type=='io'){
    	app_name=['read','write'];
    }else if(type=='net'){
    	app_name=['read','write'];
    }
    if(data.value2){
    	series=[{name:app_name[0],
            type:'line',
            stack: '总量'+[0],
            data:one},
            {name:app_name[1],
	            type:'line',
	            stack: '总量'+[1],
	            data:two}];
    }else{
    	series=[{name:app_name[0],
            type:'line',
            stack: '总量'+[0],
            data:one}
            ];
    }
    
	(function getData(data) {   
	var option = {
	    title: {
	        text: '趋势图'
	       // subtext: '纯属虚构'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:app_name,
	         bottom: 'bottom'
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: time
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: series
	};


	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
	 })();    
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