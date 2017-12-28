/**
 * Created by hgd56 on 2017/6/16.
 */

var showAlarmInfo = function () {
  clientSideInclude('.page-content', './webcontent/Alarm/Alarmlist.html');
};

var showPlatformlog = function () {
  clientSideInclude('.page-content','./webcontent/Platformlog/Platformlog.html');
}

var showWarningInfo = function () {
  clientSideInclude('.page-content','./webcontent/appwarning/warninglist.html');
}


routes['/webcontent/Alarm/Alarmlist.html'] = showAlarmInfo;

routes['/webcontent/Platformlog/Platformlog.html'] = showPlatformlog;

routes['/webcontent/appwarning/warninglist.html'] = showWarningInfo;