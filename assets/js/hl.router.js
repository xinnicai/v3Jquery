/**
 * Created by hgd56 on 2017/6/16.
 */
//应用管理


var showApplicationcreat = function () {
  clientSideInclude('.page-content', './webcontent/Application/CreatApplication.html');
};

routes['/webcontent/Application/CreatApplication.html'] = showApplicationcreat;

var showApplication = function () {
  clientSideInclude('.page-content', './webcontent/Application/Application.html');
};

routes['/webcontent/Application/Application.html'] = showApplication;

//网络管理
var shownetwork = function () {
  clientSideInclude('.page-content', './webcontent/Network/Network.html');
};

routes['/webcontent/Network/Network.html'] = shownetwork;

var shownetworklist = function () {
  clientSideInclude('.page-content', './webcontent/Network/Networklist.html');
};

routes['/webcontent/Network/Networklist.html'] = shownetworklist;

//镜像管理
var showimage = function () {
  clientSideInclude('.page-content', './webcontent/image/imagelist.html');
};

routes['/webcontent/image/imagelist.html'] = showimage;

var showimageversion = function () {
  clientSideInclude('.page-content', './webcontent/image/imageVersions.html');
};

routes['/webcontent/image/imageVersions.html'] = showimageversion;

var showharbor = function () {
  clientSideInclude('.page-content', './webcontent/image/harborlist.html');
};

routes['/webcontent/image/harborlist.html'] = showharbor;

var showharborproject= function () {
  clientSideInclude('.page-content', './webcontent/image/harborproject.html');
};

routes['/webcontent/image/harborproject.html'] = showharborproject;

//业务系统
var showtask = function () {
  clientSideInclude('.page-content', './webcontent/Application/task.html');
};

routes['/webcontent/Application/task.html'] = showtask;
var showtaskreport = function () {
  clientSideInclude('.page-content', './webcontent/Application/taskReport.html');
};

routes['/webcontent/Application/taskReport.html'] = showtaskreport;