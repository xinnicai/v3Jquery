$(document).ready(function (){ 
	
	fngetData();
	fndetail();
	// hljs.initHighlightingOnLoad();
	

});
var params = parseParams(self.location.search);
var id =params.id ;//_local.id;


//***********get历史记录表格*************//
function fngetData(){
 $('#editabledatatable').bootstrapTable({
     url: _URL_INTERFACE+"scripts/plugin/result", method: 'GET', cache: false,
     ajaxOptions:{headers: {
         "token": token
     }}, search: true,dataType: 'json',
       pagination: true, pageSize: 8,//data:"result.data",
       uniqueId: 'id',
       toolbar:'#btn-div',					
       columns: [   {
         title: '最近执行的插件', field: 'tool_info', sortable: true, searchable: true,
         formatter: function (val, row, index) {
          	  var toid=row['id'];
          	  var html='';
          	  html='<a href="#" onclick="changeMenu(this, \'/webcontent/platformsetting/setting.html\', \'/webcontent/platformsetting/Plug-In/history-list.html?id='+toid+'\')">'+row['tool_info']['filename']+'</a>';
            	  return html;
  			}
       },  {
         title: '结果', field: 'result', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  if(val=='0'){
          		  return '<span class="success"><i class="fa fa-check-circle-o padding-right-5"></i>成功</span>';
          	  }else if(val=='1'){
          		  return '<span class="darkorange"><i class="fa  fa-minus-square-o padding-right-5"></i>失败</span>';
          	  }
            }
       },{
         title: '插件类型', field: 'tool_info', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
          	  return row['tool_info']['type'];
            	}
       },{
         title: '执行开始的时间', field: 'tool_info', sortable: true, searchable: true,
         formatter: function (val, row, idx) {
         	  return row['tool_info']['create_time'];
           	}
         
       },{
         title: '耗时', field: 'cost_time', sortable: true, searchable: true
       } ],
       responseHandler: function (result) {

               return result.data;

       	//return result;
       },
       onSearch: function (text) {
			console.info(text);
		},
       onLoadSuccess: function (data) {
	
       },
		 onDblClickRow:function(data){
	        	
	        }
       
     });
 }


//历史记录详情js
////获取id值///////
function fndetail(){
		$.ajax({
            type: 'GET',
            url: _URL_INTERFACE+"scripts/plugin/result?id="+id,
            headers: {
                "token": token
            },
			dataType: 'json',

			success:function (result) {
					var data=result.data[0];
					fnhandleData(data);
					//fnShowdetail(data);
			},error:function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status === 401){
                    window.location.href = '#/login.html';
                }else{
                    alert('获取id失败！');//其他操作
                }
            }
		});
	}
	function fnhandleData(data){
		$("#filename_h").text(data.tool_info.filename);//插件名
		$("#creattime_h").text(data.tool_info.create_time);//开始时间
		if(data.result=="0"){
			$("#result_h").html('<span class="label label-success label-sm">成功</span>');
		  }else if(data.result=="1"){
			 $("#result_h").html('<span class="label label-darkorange label-sm">失败</span>');
		  }
		
		$("#target_h").text(data.target);//目标主机
		$("#cost_time_h").text(data.cost_time);//耗时
//		$("#detail_h").text(data.detail)//详情描述
		
		fnShowdetail(data.detail,data.target);

	}
	function fnShowdetail(data,str){
		var targetarr=str.split(",");
		$("#detail_h").empty();
		if(data.length==0){
			$("#detail_h").text("暂无执行结果");
		}else{
			for(var i=0;i<data.length;i++){
				var detail=targetarr[i];
				html='<h6>'+targetarr[i]+'</h6>';
				html+='<pre>'
				html+='<code>'+data[i][detail].stdout+data[i][detail].changed+data[i][detail].failed+data[i][detail].rc+data[i][detail].stdout_lines+'</code>'
				html+='</pre>'
				$("#detail_h").append(html);
			}
		}
	
		
	}
