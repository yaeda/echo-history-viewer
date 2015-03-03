$(function () {
  var dataString = null;
  var dataList = [];
  var selectedIndex = 0; // 0: STREAM, 1: UTTERANCE

  var domTemplate = [
    '<li>',
    '  <span class="activity-summary">%s</span>',
    '  <span class="activity-number">%s</span>',
    '  <span class="activity-status">%s</span>',
    '  <span class="activity-time">%s</span>',
    '  <span class="activity-download"><a href="%s" download="%s"><i class="fa fa-download"></i></a></span>',
    '  <span class="activity-audio">',
    '   <audio controls>',
    '    <source src="%s" type="audio/wav"/>',
    '   </audio>',
    '  </span>',
    '</li>'
  ].join('');

  var urlTemplate = 'https://pitangui.amazon.com/api/utterance/audio/data?id=%s';

  // Event Handling
  $textArea = $('#text_area').on('keyup', function () {
    var text = $textArea.val();
    if (dataString !== text) {
      dataString = text;
      dataList = parseData();
      showData();
    }
  });

  $typeSelection = $('.type-selection').on('change', function (e) {
    selectedIndex = e.currentTarget.selectedIndex;
    showData();
  });

  //
  // [{
  //    status: <String>,
  //    summary: <String>,
  //    time: <Number>,
  //    streamId: <String>,
  //    utteranceId: <String>
  // }, ...]
  //
  var parseData = function () {
    var dataObj = null;
    try {
      dataObj = JSON.parse(dataString);
    } catch (err) {
      return [];
    }

    var result = [];
    var activities = dataObj.activities;
    for (var i = 0, l = activities.length; i < l; i++) {
      var activity = activities[i];
      var status = activity.activityStatus;
      var time = activity.creationTimestamp;

      var description = JSON.parse(activity.description);
      var summary = description.summary;
      var streamId = description.firstStreamId;
      var utteranceId = description.firstUtteranceId;

      result.push({
        status: status,
        time: time,
        summary: summary,
        streamId: streamId,
        utteranceId: utteranceId
      });
    }

    return result;
  };

  var showData = function () {
    if (dataList.length === 0) {
      return;
    }

    $dataList = $('#data_list').empty();
    for (var i = 0, l = dataList.length; i < l; i++) {
      var data = dataList[i];
      var domstr = domTemplate;
      domstr = domstr.replace('%s', data.summary);
      domstr = domstr.replace('%s', i);
      domstr = domstr.replace('%s', data.status);
      var timeStr = generateTimeString(data.time);
      domstr = domstr.replace('%s', timeStr);

      var audioSourceUrl = urlTemplate.replace('%s', data.streamId);
      switch (selectedIndex) {
        case 0: // STREAM
          audioSourceUrl = urlTemplate.replace('%s', data.streamId);
          break;
        case 1:
          audioSourceUrl = urlTemplate.replace('%s', data.utteranceId);
          break;
      }
      var downloadName = timeStr;// + '_' + data.summary.replaceAll(' ', '-');
      domstr = domstr.replace('%s', audioSourceUrl);
      domstr = domstr.replace('%s', downloadName);
      domstr = domstr.replace('%s', audioSourceUrl);

      $domstr = $(domstr);
      $domstr.find('.activity-status').addClass(
        data.status === 'SUCCESS' ? 'status-success' : 'status-invalid'
      );

      $dataList.append($domstr);
    }
  }

  var generateTimeString = function(millis) {
    var date = new Date(millis);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return [
      year,
      month   < 10 ? '0' + month   : month,
      day     < 10 ? '0' + day     : day,
      hour    < 10 ? '0' + hour    : hour,
      minutes < 10 ? '0' + minutes : minutes,
      seconds < 10 ? '0' + seconds : seconds
    ].join('-');
  }

});
