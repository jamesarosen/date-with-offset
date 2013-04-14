var assert = require("assert"),
    DateWithOffset = require('../');

function assertSameInstant(actual, expected) {
  actual   = new Date(actual);
  expected = new Date(expected);

  assert.equal(
    +actual,
    +expected,
    "expected " + actual.toISOString() +
    " to be the same time as " + expected.toISOString()
  );
}

describe('DateWithOffset', function() {
  var halfNoonUTC = new Date("2008-12-31T12:30Z"),
      chatham = {
        toString: function() { return 'Chatham (+12:45)'; },
        valueOf: function() { return 765; }
      },
      inChatham;

  beforeEach(function() {
    inChatham = new DateWithOffset(halfNoonUTC, chatham);
  });

  describe('#toString', function() {
    it('returns a Date string in the correct offset', function() {
      var expected = 'Thu Jan 01 2009 01:15:00 GMT+1245';
      assert.equal(inChatham.toString(), expected);
    });
  });

  describe('#valueOf', function() {
    it('returns the same moment in time', function() {
      assertSameInstant(inChatham, halfNoonUTC);
    });
  });

  describe('#offset', function() {
    it('returns the original offset', function() {
      assert.strictEqual(inChatham.offset(), chatham);
    });
  });

  describe('#getTimezoneOffset', function() {
    it('returns the inverse of the value of the supplied offset', function() {
      assert.equal(inChatham.getTimezoneOffset(), -765);
    });
  });

  describe('#withOffset', function() {
    it('returns a new DateWithOffset representing the same time with the given offset', function() {
      var inParis = inChatham.withOffset(60);
      assert.ok(inParis instanceof DateWithOffset, 'expected ' + inParis + ' to be a DateWithOffset');
      assertSameInstant(inParis, inChatham);
      assert.equal(inParis.offset(), 60);
      assert.equal(inParis.getHours(), 13);
    });
  });

  function assertGetter(property, expectedValue) {
    describe('#get' + property, function() {
      it('returns the correct value', function() {
        var actual = inChatham['get' + property]();
        assert.equal(actual, expectedValue);
      });
    });
  }

  assertGetter('Date',          1);
  assertGetter('Day',           4);
  assertGetter('FullYear',      2009);
  assertGetter('Hours',         1);
  assertGetter('Milliseconds',  0);
  assertGetter('Minutes',       15);
  assertGetter('Month',         0);
  assertGetter('Seconds',       0);
  assertGetter('Year',          109);

  assertGetter('Time', halfNoonUTC.getTime());

  assertGetter('UTCDate',         halfNoonUTC.getUTCDate());
  assertGetter('UTCDay',          halfNoonUTC.getUTCDay());
  assertGetter('UTCFullYear',     halfNoonUTC.getUTCFullYear());
  assertGetter('UTCHours',        halfNoonUTC.getUTCHours());
  assertGetter('UTCMilliseconds', halfNoonUTC.getUTCMilliseconds());
  assertGetter('UTCMinutes',      halfNoonUTC.getUTCMinutes());
  assertGetter('UTCMonth',        halfNoonUTC.getUTCMonth());
  assertGetter('UTCSeconds',      halfNoonUTC.getUTCSeconds());

  function assertSetter(property, newValue, expectedNewISOString) {
    describe('#set' + property, function() {
      it('updates the date', function() {
        inChatham['set' + property](newValue);
        assertSameInstant(inChatham, expectedNewISOString);
      });
    });
  }

  assertSetter('Date',         4,    '2009-01-04T01:15:00+1245');
  assertSetter('FullYear',     2010, '2010-01-01T01:15:00+1245');
  assertSetter('Hours',        17,   '2009-01-01T17:15:00+1245');
  assertSetter('Milliseconds', 230,  '2009-01-01T01:15:00.230+1245');
  assertSetter('Minutes',      44,   '2009-01-01T01:44:00+1245');
  assertSetter('Month',        7,    '2009-08-01T01:15:00+1245');
  assertSetter('Seconds',      19,   '2009-01-01T01:15:19+1245');
  assertSetter('Year',         102,  '2002-01-01T01:15:00+1245');

  assertSetter('Time', (new Date('2017-03-15T11:52:18+1245')).getTime(), '2017-03-15T11:52:18+1245');

  assertSetter('UTCDate',         4,    '2008-12-04T12:30:00.000Z');
  assertSetter('UTCFullYear',     2010, '2010-12-31T12:30:00.000Z');
  assertSetter('UTCHours',        17,   '2008-12-31T17:30:00.000Z');
  assertSetter('UTCMilliseconds', 230,  '2008-12-31T12:30:00.230Z');
  assertSetter('UTCMinutes',      44,   '2008-12-31T12:44:00.000Z');
  assertSetter('UTCMonth',        7,    '2008-08-31T12:30:00.000Z');
  assertSetter('UTCSeconds',      19,   '2008-12-31T12:30:19.000Z');

});
