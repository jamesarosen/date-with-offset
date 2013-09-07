var assert = require("assert"),
    DateWithOffset = require('../');

describe('DateWithOffset, with an offset that changes over time', function() {

  "use strict";

  var zone = function(utcDate) {
    // DST April 1 through October 31
    var month = utcDate.getMonth();
    return (month < 3 || month > 9) ? 0 : +60;
  };

  it('adjusts the local time for daylight-savings', function() {
    var standard = new DateWithOffset(new Date("2011-02-12T18:00Z"), zone);
    assert.equal(standard.getTimezoneOffset(), 0);
    assert.equal(standard.toString(), 'Sat Feb 12 2011 18:00:00 GMT+0000');

    var daylight = new DateWithOffset(new Date("2011-07-12T18:00Z"), zone);
    assert.equal(daylight.getTimezoneOffset(), -60);
    assert.equal(daylight.toString(), 'Tue Jul 12 2011 19:00:00 GMT+0100');
  });

  it('adjusts when the date is moved', function() {
    var date = new DateWithOffset(new Date("2011-02-12T18:00Z"), zone);
    date.setMonth(6);
    assert.equal(date.getTimezoneOffset(), -60);
    assert.equal(date.toString(), 'Tue Jul 12 2011 19:00:00 GMT+0100');
  });

});
