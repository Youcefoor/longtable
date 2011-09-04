// longtable 1.0 - a minimalistic table pager for jQuery

// Copyright 2011 Chris Forno
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).

// Requirements:
//  * jQuery >= 1.4.3

(function ($) {
  var defaults = {'perPage': 10};

  function showRows(table, offset, n) {
    // Naive and inefficient.
    table.find('tbody tr').each(function (i, row) {
      if (i >= offset && i < offset + n) {
        $(row).show();
      } else {
        $(row).hide();
      }
    });
  }

  $.fn.longtable = function (options) {
    var settings = $.extend(defaults, options || {});
    var table = this;
    var nCols = table.find('tr')[0].cells.length;
    var nRows = table.find('tbody tr').length;
    var nPages = Math.ceil(nRows / settings.perPage);

    var pagingControls = $('<th class="paging-controls" colspan="' + nCols + '"></th>');
    var prev = $('<a class="page prev" href=""></a>');
    var next = $('<a class="page next" href=""></a>');
    var leftElide = $('<span class="elide"></span>');
    var rightElide = $('<span class="elide"></span>');
    var pages = [];
    for (var i = 1; i <= nPages; i++) {
      pages.push($('<a class="page direct" href="" page="' + i + '">' + i + '</a>'));
    }

    pagingControls.append(prev).append(pages[0]).append(leftElide);
    for (var i = 2; i < nPages; i++) {
      pagingControls.append(' ').append(pages[i - 1]).append(' ');
    }
    pagingControls.append(rightElide).append(pages[pages.length - 1]).append(next);
    // Put paging controls in the tfoot.
    var tfoot = table.find('tfoot');
    if (tfoot.length === 0) {
      tfoot = $('<tfoot></tfoot>').appendTo(table);
    }
    $('<tr></tr>').append(pagingControls).appendTo(tfoot);

    table.gotoPage = function (n) {
      n = Math.max(Math.min(n, nPages), 1);
      var start = Math.max(1, Math.min(n - 2, nPages - 4));
      var end = Math.min(start + 4, nPages);
      if (n === 1) {
        prev.css('visibility', 'hidden');
      } else {
        prev.css('visibility', '').attr('page', n - 1);
      }
      if (n === nPages) {
        next.css('visibility', 'hidden');
      } else {
        next.css('visibility', '').attr('page', n + 1);
      }
      start === 1 ? leftElide.hide() : leftElide.show();
      end === nPages ? rightElide.hide() : rightElide.show();
      for (var i = 2; i < pages.length; i++) {
        i >= start && i <= end ? pages[i - 1].show() : pages[i - 1].hide();
      }
      for (var i = 0; i < pages.length; i++) {
        (i + 1) === n ? pages[i].removeAttr('href') : pages[i].attr('href', '');
      }
      showRows(table, (n - 1) * settings.perPage, settings.perPage);
      table.trigger('longtable.pageChange', [n]);
    };

    pagingControls.delegate('a', 'click', function () {
      table.gotoPage(parseInt($(this).attr('page'), 10));
      return false;
    });

    table.gotoPage(1);

    return this;
  };
})(jQuery);
