/**
 * Created by hgd56 on 2017/6/16.
 */

var showIndexInfo = function () {
  if (_user.role_id =='1') {
    clientSideInclude('.page-content', './dashboard.html');
  } else {
    clientSideInclude('.page-content', './indexForUser.html');
  }
};
var showResetpasswordInfo = function () {
  clientSideInclude('.page-content', './Resetpassword.html');
};
var showindexForUser = function () {
  clientSideInclude('.page-content', './indexForUser.html');
};
var showCAForCMP = function () {
  clientSideInclude('.page-content', './webcontent/Application/CreatApplicationCMP.html');
};
var showapplist = function () {
  clientSideInclude('.page-content', './webcontent/Application/Applist.html');
};
var routes = {
  '/index.html': showIndexInfo,
  '/Resetpassword.html': showResetpasswordInfo,
  '/indexForUser.html': showindexForUser,
  '/webcontent/Application/CreatApplicationCMP.html': showCAForCMP,
  '/webcontent/Application/Applist.html' : showapplist
}
;
