$(document).ready(function (){
	fnUrlArr();
});
var uriArr=[];
var params = parseParams(self.location.search);
var target = params.target;

function fnUrlArr(){
	if(target=="/webcontent/Application/Applist.html"){
		uriArr=["apps/deployment/config"];
	}
	if(target=="/webcontent/Application/Applist.html" && params.appid){
		uriArr=["apps/deployment","apps/undeployment","apps/scale/stop","apps/scale/auto","apps/restart","apps/autoscale/policy"];
	}
	
	if(target=="/webcontent/Cluster/Clusterlist.html"){
		uriArr=["cluster"];
	}
	if(target=="/webcontent/Cluster/Clusterlist.html" && params.cluster){
		uriArr=["cluster/clustername/nodes"];
	}
	return uriArr;
}

var domArr=[];
function fnDomArr(){
	if(target=="/webcontent/Application/Applist.html"){
		domArr=[];
	}
	if(target=="/webcontent/Application/Applist.html" && params.appid){
		domArr=["[data-target='#Release']","#undeployment","#appStop","#doScaleAppBtn","#RestartapplicationBtn","#autoApplitionBtn"];
	}
	if(target=="/webcontent/Cluster/Clusterlist.html"){
		domArr=[];
	}
	if(target=="/webcontent/Cluster/Clusterlist.html" && params.cluster){
		domArr=[".deletebtn"];
	}
	return domArr;
}