/*
 * jQuery OrgChart Plugin
 * https://github.com/dabeng/OrgChart
 *
 * Demos of jQuery OrgChart Plugin
 * http://dabeng.github.io/OrgChart/local-datasource/
 * http://dabeng.github.io/OrgChart/ajax-datasource/
 * http://dabeng.github.io/OrgChart/ondemand-loading-data/
 * http://dabeng.github.io/OrgChart/option-createNode/
 * http://dabeng.github.io/OrgChart/export-orgchart/
 * http://dabeng.github.io/OrgChart/integrate-map/
 *
 * Copyright 2016, dabeng
 * http://dabeng.github.io/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
'use strict';

(function(factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'), window, document);
  } else {
    factory(jQuery, window, document);
  }
}(function($, window, document, undefined) {
  $.fn.orgchart = function(options) {
    var defaultOptions = {
      'nodeTitle': 'name',
      'nodeId': 'id',
      'nodeChildren': 'children',
      'toggleSiblingsResp': false,
      'depth': 999,
      'chartClass': '',
      'exportButton': false,
      'exportFilename': 'OrgChart',
      'parentNodeSymbol': 'fa-users',
      'draggable': false,
      'direction': 't2b',
      'pan': false,
      'zoom': false
    };

    switch (options) { 
      
      default: // initiation time
        var opts = $.extend(defaultOptions, options);
    }

    // build the org-chart
    var $chartContainer = this;
    var data = opts.data;
    var $chart = $('<div>', {
      'data': { 'options': opts },
      'class': 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''),
      'click': function(event) {
        if (!$(event.target).closest('.node').length) {
          $chart.find('.node.focused').removeClass('focused');
        }
      }
    });
    if ($.type(data) === 'object') {
      if (data instanceof $) { // ul datasource
        buildHierarchy($chart, buildJsonDS(data.children()), 0, opts);
      } else { // local json datasource
        buildHierarchy($chart, opts.ajaxURL ? data : attachRel(data, '00'), 0, opts);
      }
    } else {
      $.ajax({
        'url': data,
        'dataType': 'json',
        'beforeSend': function () {
          $chart.append('<i class="fa fa-circle-o-notch fa-spin spinner"></i>');
        }
      })
     
    }
    $chartContainer.append($chart);
    return $chartContainer;
  };

  function attachRel(data, flags) {
    data.relationship = flags + (data.children ? 1 : 0);
    if (data.children) {
    data.children.forEach(function(item) {
      attachRel(item, '1' + (data.children.length > 1 ? 1 :0));
    });
    }
    return data;
  }

  // create node
  function createNode(nodeData, level, opts) {
    var dtd = $.Deferred();
    // construct the content of node
    var $nodeDiv = $('<div' + (opts.draggable ? ' draggable="true"' : '') + (nodeData[opts.nodeId] ? ' id="' + nodeData[opts.nodeId] + '"' : '') + '>')
      .addClass('node ' + (nodeData.className || '') +  (level >= opts.depth ? ' slide-up' : ''))
      .append('<div class="title">' + nodeData[opts.nodeTitle] + '</div>')
      .append(typeof opts.nodeContent !== 'undefined' ? '<div class="content">' + (nodeData[opts.nodeContent] || '') + '</div>' : '');
    // append 4 direction arrows
    var flags = nodeData.relationship || '';
    $nodeDiv.on('mouseenter mouseleave', function(event) {
      var $node = $(this), flag = false;
      var $topEdge = $node.children('.topEdge');
      var $rightEdge = $node.children('.rightEdge');
      var $bottomEdge = $node.children('.bottomEdge');
      var $leftEdge = $node.children('.leftEdge');
      if (event.type === 'mouseenter') {
        if ($topEdge.length) {
          flag = getNodeState($node, 'parent').visible;
          $topEdge.toggleClass('fa-chevron-up', !flag).toggleClass('fa-chevron-down', flag);
        }
        if ($bottomEdge.length) {
          flag = getNodeState($node, 'children').visible;
          $bottomEdge.toggleClass('fa-chevron-down', !flag).toggleClass('fa-chevron-up', flag);
        }
        if ($leftEdge.length) {
          switchHorizontalArrow($node);
        }
      } else {
        $node.children('.edge').removeClass('fa-chevron-up fa-chevron-down fa-chevron-right fa-chevron-left');
      }
    });
  
    // allow user to append dom modification after finishing node create of orgchart 
    if (opts.createNode) {
      opts.createNode($nodeDiv, nodeData);
    }
    dtd.resolve($nodeDiv);
    return dtd.promise();
  }
  // recursively build the tree
  function buildHierarchy ($appendTo, nodeData, level, opts, callback) {
    var $table;
    // Construct the node
    var $childNodes = nodeData[opts.nodeChildren];
    var hasChildren = $childNodes ? $childNodes.length : false;
    if (Object.keys(nodeData).length > 1) { // if nodeData has nested structure
      $table = $('<table>');
      $appendTo.append($table);
      $.when(createNode(nodeData, level, opts))
      .done(function($nodeDiv) {
        $table.append($nodeDiv.wrap('<tr><td' + (hasChildren ? ' colspan="' + $childNodes.length * 2 + '"' : '') + '></td></tr>').closest('tr'));
        if (callback) {
          callback();
        }
      })
      .fail(function() {
        console.log('Failed to creat node')
      });
    }
    // Construct the inferior nodes and connectiong lines
    if (hasChildren) {
      if (Object.keys(nodeData).length === 1) { // if nodeData is just an array
        $table = $appendTo;
      }
      var isHidden = level + 1 >= opts.depth ? ' hidden' : '';
      // draw the line close to parent node
      $table.append('<tr class="lines' + isHidden + '"><td colspan="' + $childNodes.length * 2 + '"><div class="down"></div></td></tr>');
      // draw the lines close to children nodes
      var linesRow = '<tr class="lines' + isHidden + '"><td class="right">&nbsp;</td>';
      for (var i=1; i<$childNodes.length; i++) {
        linesRow += '<td class="left top">&nbsp;</td><td class="right top">&nbsp;</td>';
      }
      linesRow += '<td class="left">&nbsp;</td></tr>';
      $table.append(linesRow);
      // recurse through children nodes
      var $childNodesRow = $('<tr class="nodes' + isHidden + '">');
      $table.append($childNodesRow);
      $.each($childNodes, function() {
        var $td = $('<td colspan="2">');
        $childNodesRow.append($td);
        buildHierarchy($td, this, level + 1, opts, callback);
      });
    }
  }


}));
