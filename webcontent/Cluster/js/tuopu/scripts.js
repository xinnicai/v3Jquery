'use strict';

(function($){

  $(function() {

    var datascource = {
      'name': '集群1',
      'title': '资源池',
      'children': [
        
        { 'name': 'sla1', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla2', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla13', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla14', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla14', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla14', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla14', 'title': 'slaver集群', 'className': 'middle-level'},
        { 'name': 'sla14', 'title': 'slaver集群', 'className': 'middle-level'},
        
      ]
    };

    $('#chart-container').orgchart({
      'data' : datascource,
      'nodeContent': 'title'
    });

  });

})(jQuery);