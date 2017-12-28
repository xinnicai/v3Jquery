/**
 * Created by hgd56 on 2017/6/16.
 */

var showclusterIndexInfo = function () {
  clientSideInclude('.page-content', './webcontent/Cluster/Clusterlist.html');
};
var showclusterCreateInfo = function () {
    clientSideInclude('.page-content', './webcontent/Cluster/Clustercreast.html');
};
var showClsuterMonitor = function () {
    clientSideInclude('.page-content', './webcontent/Cluster/ClsuterMonitor.html');
};
var showServercluster = function () {
    clientSideInclude('.page-content', './webcontent/server/servercluster.html');
};
var showMysql1 = function () {
    clientSideInclude('.page-content', './webcontent/server/mysql1.html');
};
var showserverCreate = function () {
    clientSideInclude('.page-content', './webcontent/server/serverCreate.html');
};
var showmysql = function () {
    clientSideInclude('.page-content', './webcontent/server/mysql.html');
};
var showcentos = function () {
    clientSideInclude('.page-content', './webcontent/server/centos.html');
};
var showubuntu = function () {
    clientSideInclude('.page-content', './webcontent/server/ubuntu.html');
};
var showRedis = function () {
    clientSideInclude('.page-content', './webcontent/server/Redis.html');
};
var showElasticsearch = function () {
    clientSideInclude('.page-content', './webcontent/server/Elasticsearch.html');
};
var showmongodb = function () {
    clientSideInclude('.page-content', './webcontent/server/mongodb.html');
};
var showVolume = function () {
    clientSideInclude('.page-content', './webcontent/Volume/Volume.html');
};
var showVolume= function () {
    clientSideInclude('.page-content', './webcontent/Volume/Volume.html');
};
var showVolumelist = function () {
    clientSideInclude('.page-content', './webcontent/Volume/Volumelist.html');
};
var showPowerGroup= function () {
    clientSideInclude('.page-content', './webcontent/platformsetting/powerGroupManage.html');
};
routes['/webcontent/Cluster/Clusterlist.html'] = showclusterIndexInfo;
routes['/webcontent/Cluster/Clustercreast.html'] = showclusterCreateInfo;
routes['/webcontent/Cluster/ClsuterMonitor.html'] = showClsuterMonitor;
routes['/webcontent/server/servercluster.html'] = showServercluster;
routes['/webcontent/server/mysql1.html'] = showMysql1;
routes['/webcontent/server/serverCreate.html'] = showserverCreate;
routes['/webcontent/server/mysql.html'] = showmysql;
routes['/webcontent/server/centos.html'] = showcentos;
routes['/webcontent/server/ubuntu.html'] = showubuntu;
routes['/webcontent/server/Redis.html'] = showRedis;
routes['/webcontent/server/Elasticsearch.html'] = showElasticsearch;
routes['/webcontent/server/mongodb.html'] = showmongodb;
routes['/webcontent/Volume/Volume.html'] = showVolume;
routes['/webcontent/Volume/Volumelist.html'] = showVolumelist;
routes['/webcontent/platformsetting/powerGroupManage.html'] = showPowerGroup;