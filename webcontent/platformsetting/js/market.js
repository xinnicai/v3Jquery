$(document).ready(function (){ 
  //$("#language a").attr("class", "label label-default")
	fnGetPlugin();
});



/*******初始获取插件********/
function fnGetPlugin(){
	
	$.ajax({
        type: 'GET',
        url: _URL_INTERFACE+'scripts/plugin',
        headers: {
            "token": token
        },
		dataType: 'json',

		success:function (result) {
				var data=result.data;
				fnShowIndex(data);
				fnShowPlugin(data);
		},error:function (XMLHttpRequest, textStatus, errorThrown) {
            if(XMLHttpRequest.status === 401){
                window.location.href = '#/login.html';
            }else{
                alert('获取插件失败！');//其他操作
            }
        }
		
	
	});
	
}

function fnShowIndex(data){
	$("#commindex").empty();
	
	for(key in data){
		var html='';
		html +='<a class="label label-white margin-left-5" onclick="fnClick(this)" >'+key+'</a>'
		
		$("#commindex").append(html);
	}
}
function fnClick(obj){
	var val=$(obj).text();
	$("#commuseIndex").find(".plugin").hide();
	
	$("#commuseIndex").find("[name='"+val+"']").show();
}


function fnShowPlugin(data){
	
	$("#commuseIndex").empty();
	//if(arr.length!=0){
	var html='';
	for(key in data){
		html = ''
		html += '<div class="col-sm-12 no-padding-right plugin" name="'+key+'">'
		html += '<h6 class="margin-bottom-30"><strong>'+key+'</strong></h6>'
		for(var i=0;i<data[key].length;i++){
			html += '<div class="tool-icon" >'//onclick="changeMenu(this, \'/webcontent/platformsetting/setting.html\', \'\')"
		   html += '<a href="#/webcontent/platformsetting/Plug-In/market-list.html?aaid='+data[key][i].id+'" class="tool-item-inner">'
			
			var lang=data[key][i].language;
				if(lang=='python'){
					html += '<div class="hexagon" >'
					html += '<i class="white fa fa-cogs"></i>'
				}else{
					html += '<div class="hexagon-pink" >'
					html += '<i class="white fa fa-wrench"></i>'
				}
			
			html += '</div>'
			html += '<div class="plname">'+data[key][i].filename+'</div>'
			html += '</a>'
			html += '</div>'
		}
		html += '</div>'
		$("#commuseIndex").append(html);
		}
		
	
	//	}

}


