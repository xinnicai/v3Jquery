$(document).ready(function (){
	fnhandleupdate();
	//fnGetData();
	
});

//var params = parseParams(self.location.search);
var sysId =getUrlParam('sysid')//params.sysid ;//_local.appid;
console.log(sysId);
var sysName='';
function fnhandleupdate(){
	$.ajax({
    type: 'get',
    url: _URL_INTERFACE+"platform/resource/"+sysId,
    headers: {
      "token": token
    },
		dataType: 'json',
		success:function (result) {

			var data=result.data;
			sysName=data[0].value;
			  $("#CPU").text(data[0].value3);
			   $("#mem").text((parseInt(data[0].value4)/1024).toFixed(0));
			    $("#disk").text((parseInt(data[0].value5)/1024).toFixed(0));
			    $(".sysname").text(data[0].value);
			 //$("#syslable").val(data[0].key);
			    fnGetData(result);
		},
    error:function (XMLHttpRequest, textStatus, errorThrown) {
      if(XMLHttpRequest.status === 401){
        window.location.href = '#/login.html';
      }else{
       // alert('添加失败！（例子）');//其他操作
      }
    }
	});
}

function fnGetData(result){
	
	$("#tbodyApp").empty();
	var appname=[],cpus=[],mems=[],disks=[];
	var echartDatacpu={},echartDatamem={},echartDatadisk={};

		appname.push("剩余");
		cpus.push(result.data[0].free_resource.cpu);
		mems.push((parseInt(result.data[0].free_resource.mem)/1024).toFixed(3));
		disks.push((parseInt(result.data[0].free_resource.disk)/1024).toFixed(3));
		var data=result.data[0].apps;
		var totalCPU=parseInt(result.data[0].value3);
		var totalmem=(parseInt(result.data[0].value4)/1024).toFixed(0);
		var totaldisk=(parseInt(result.data[0].value5)/1024).toFixed(0);
		
		if(data && data.length!=0){
			for(var i=0;i<data.length;i++){
				var memG=(parseInt(data[i].mem)/1024).toFixed(3);
				var diskG=(parseInt(data[i].disk)/1024).toFixed(3);
				var html='<tr><td><a href="#/webcontent/Application/Application.html?appid='+data[i].app_id+'">'+data[i].app_name+'</a></td>'
					+'<td>'+parseFloat(data[i].cpu)+'</td>'
					+'<td>'+memG+'</td>'
					+'<td> '+diskG+'</td></tr>';
				$("#tbodyApp").append(html);
				appname.push(data[i].app_id);
				cpus.push(data[i].cpu);
				mems.push(memG);
				disks.push(diskG);
			}
	}else{
      $("#tbodyApp").append("<tr style='background-color:#fff'><td colspan='7' align='center'>暂无查无数据</td></tr>");
    }
  echartDatacpu={"appname":appname,"data":cpus,"total":totalCPU};
  echartDatamem={"appname":appname,"data":mems,"total":totalmem};
  echartDatadisk={"appname":appname,"data":disks,"total":totaldisk};
  fnMakeEchart('mainCPU',echartDatacpu);
  fnMakeEchart('mainMem',echartDatamem);
  fnMakeEchart('mainDisk',echartDatadisk);
  $("#tab2").removeClass("active");
}

function fnMakeEchart(obj,data){
	var myChart = echarts.init(document.getElementById(obj));
    var colorList = ['#59c5a7', '#51b8fe', '#fa827d'];
                 
     // 总和
     var total = {
         name: '总数',
         value: data.total
     };
     
     var originaldata={},originalData =[],dataName=[];
	for(var i=0;i<data.appname.length;i++){
		originaldata={"value":data.data[i],"name":data.appname[i]};
		originalData.push(originaldata);
		dataName.push(data.appname[i]);
	}
                 /*var originalData = [{
                     value: 55,
                     name: '模块155'
                 }, {
                     value: 70,
                     name: '模块270'
                 }, {
                     value: 25,
                     name: "模块325"
                 }];*/

     echarts.util.each(originalData, function(item, index) {
         item.itemStyle = {
             normal: {
                 color: colorList[index]
             }
         };
     });

     option = {
         title: [{
                text: total.name,
                left: '49%',
                top: '46%',
                textAlign: 'center',
                textBaseline: 'middle',
                textStyle: {
                    color: '#999',
                    fontWeight: 'normal',
                    fontSize: 16
                }
            }, {
                text: total.value,
                left: '49%',
                top: '51%',
                textAlign: 'center',
                textBaseline: 'middle',
                textStyle: {
                    color: '#666',
                    fontWeight: 'normal',
                    fontSize: 20
                }
            }],
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data:dataName
            },
         series: [{
             hoverAnimation: false, //设置饼图默认的展开样式
             radius: [50, 95],
             name: 'pie',
             type: 'pie',
             selectedMode: 'single',
             selectedOffset: 16, //选中是扇区偏移量
             clockwise: true,
             startAngle: 90,
//             label: {
//                 normal: {
//                     textStyle: {
//                         fontSize: 14,
//                         color: '#999'
//                     }
//                 }
//             },
//             labelLine: {
//                 normal: {
//                     lineStyle: {
//                         color: '#999',
//
//                     }
//                 }
//             },
             label: {
                 normal: {
                     show: false,
                     position: 'center'
                 }
             },
             data: originalData
         }]
     };
     myChart.setOption(option);
}