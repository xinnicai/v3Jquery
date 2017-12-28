/**
 * Created by hgd56 on 2017/6/16.
 */
//1
var showsettingInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/setting.html');
};
//2
var showroleInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/roleManage.html');
};
//3
var shownote_infoInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/note_info.html');
};
//4
var showappReportInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/appReport.html');
};
//5
var showmenuManageInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/menuManage.html');
};
//6
var showbaseDataInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/baseData.html');
};
//7
var showmodelInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/model.html');
};
//8
var showquotasInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/quotas.html');
};
//9
var showquotaslistInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/quotaslist.html');
};

//10
var showmarketInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/market.html');
};
//11
var showmarketcreatInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/market-creat.html');
};
//12
var showhistoryInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/history.html');
};
//13
var showmarket_listInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/market-list.html');
};
//14
var showhistory_listInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/history-list.html');
};
//15
var showedit_marketInfo = function () {
  clientSideInclude('.page-content', './webcontent/platformsetting/Plug-In/Edit-market.html');
};

var showcreateresult = function () {
  clientSideInclude('.page-content', './webcontent/Application/createresult.html');
};

var showupdateapplication= function () {
  clientSideInclude('.page-content', './webcontent/Application/updateApplication.html');
};

var showmovecluster= function () {
  clientSideInclude('.page-content', './webcontent/Cluster/moveCluster.html');
};

var showapppublish= function () {
  clientSideInclude('.page-content', './webcontent/Application/appPublishing.html');
};
//部署更新
var showdeploy= function () {
  clientSideInclude('.page-content', './webcontent/Deploy/Deploy.html');
};

var showdeploytask= function () {
  clientSideInclude('.page-content', './webcontent/Deploy/deployTask.html');
};
//资源调配
var showsource= function () {
  clientSideInclude('.page-content', './webcontent/sourceAllot/sourceAllot.html');
};

var showsourcetask= function () {
  clientSideInclude('.page-content', './webcontent/sourceAllot/sourceAllotTask.html');
};
//应用批量发布
var showappbatchpublish= function () {
  clientSideInclude('.page-content', './webcontent/Application/appBatchPublish.html');
};

routes['/webcontent/platformsetting/Plug-In/Edit-market.html'] = showedit_marketInfo;
routes['/webcontent/platformsetting/Plug-In/history-list.html'] = showhistory_listInfo;
routes['/webcontent/platformsetting/Plug-In/market-list.html'] = showmarket_listInfo;
routes['/webcontent/platformsetting/Plug-In/history.html'] = showhistoryInfo;
routes['/webcontent/platformsetting/Plug-In/market-creat.html'] = showmarketcreatInfo;
routes['/webcontent/platformsetting/Plug-In/market.html'] = showmarketInfo;
routes['/webcontent/platformsetting/quotaslist.html'] = showquotaslistInfo;//配额详情
routes['/webcontent/platformsetting/quotas.html'] = showquotasInfo;
routes['/webcontent/platformsetting/model.html'] = showmodelInfo;
routes['/webcontent/platformsetting/baseData.html'] = showbaseDataInfo;
routes['/webcontent/platformsetting/setting.html'] = showsettingInfo;
routes['/webcontent/platformsetting/roleManage.html'] = showroleInfo;
routes['/webcontent/platformsetting/note_info.html'] = shownote_infoInfo;
routes['/webcontent/platformsetting/appReport.html'] = showappReportInfo;
routes['/webcontent/platformsetting/menuManage.html'] = showmenuManageInfo;
routes['/webcontent/Application/createresult.html'] = showcreateresult;
routes['/webcontent/Application/updateApplication.html'] = showupdateapplication;
routes['/webcontent/Cluster/moveCluster.html'] = showmovecluster;
routes['/webcontent/Application/appPublishing.html'] = showapppublish;
routes['/webcontent/Deploy/Deploy.html'] = showdeploy;
routes['/webcontent/Deploy/deployTask.html'] = showdeploytask;
routes['/webcontent/sourceAllot/sourceAllot.html'] = showsource;
routes['/webcontent/sourceAllot/sourceAllotTask.html'] = showsourcetask;
routes['/webcontent/Application/appBatchPublish.html'] = showappbatchpublish;