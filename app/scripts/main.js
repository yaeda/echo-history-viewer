$(function () {
  var dataString = null;

  var domTemplate = [
    '<li>',
    '  <span class="activity-number">%s</span>',
    '  <span class="activity-status">%s</span>',
    '  <span class="activity-time">%s</span>',
    '  <span class="activity-summary">%s</span>',
    //'  <span class="activity-audio"><a href="%s" target="_blank">%s</a></span>',
    '  <span class="activity-audio">',
    '   <audio controls>',
    '    <source src="%s" type="audio/wav"/>',
    '   </audio>',
    '  </span>',
    '</li>'
  ].join('');

  //var urlTemplate = 'https://pitangui.amazon.com/api/utterance/audio/data?id=AB72C64C86AW2:1.0/2015/02/27/23/B0F00712447400GD/58:55::TNIH_2V.8da1a801-b01b-4431-b480-f8b32657780dZXV'
  var urlTemplate = 'https://pitangui.amazon.com/api/utterance/audio/data?id=%s';

  $textArea = $('#text_area').on('keyup', function () {
    var text = $textArea.val();
    if (dataString !== text) {
      dataString = text;
      var dataList = parseData();
      showData(dataList);
    }
  });

  //
  // [{
  //    status: <String>,
  //    summary: <String>,
  //    time: <String>,
  //    streamId: <String>,
  //    utteranceId: <String>
  // }, ...]
  //
  var parseData = function () {
    var dataObj = null;
    try {
      dataObj = JSON.parse(dataString);
    } catch (err) {
      return;
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

      console.log(activity);
      console.log(description);

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

  'https://pitangui.amazon.com/api/utterance/audio/data?id=AB72C64C86AW2:1.0/2015/02/27/23/B0F00712447400GD/58:55::TNIH_2V.8da1a801-b01b-4431-b480-f8b32657780dZXV'
  var showData = function (dataList) {
    $dataList = $('#data_list').empty();
    for (var i = 0, l = dataList.length; i < l; i++) {
      var data = dataList[i];
      var domstr = domTemplate;
      domstr = domstr.replace('%s', i);
      domstr = domstr.replace('%s', data.status);
      var timeStr = generateTimeString(data.time);
      domstr = domstr.replace('%s', timeStr);
      domstr = domstr.replace('%s', data.summary);
      var url = urlTemplate.replace('%s', data.streamId);
      domstr = domstr.replace('%s', url);
      //domstr = domstr.replace('%s', data.streamId);

      $domstr = $(domstr);
      $domstr.find('.activity-status').addClass(
        data.status === 'SUCCESS' ? 'status-success' : 'status-invalid'
      );

      $dataList.append($domstr);
    }
  }

  var generateTimeString = function(millis) {
    var date = new Date(millis);
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].join('-');
  }

});
