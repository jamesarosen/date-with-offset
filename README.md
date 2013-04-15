# Date With Offset

In JavaScript, all `Date`s have a local time zone. On my computer:

```javascript
var now = new Date();
// Sun Apr 14 2013 09:49:16 GMT-0700 (PDT)
```

This makes working with time zones difficult. You can represent that date in
UTC with `Date.prototype.toISOString`:

```javascript
now.toISOString();
// "2013-04-14T16:49:16.576Z"
```

Unfortunately, you can't pass around an actual `Date` in any other time zone.
Instead, create a `DateWithOffset`:

```javascript
var nowInUTC = new DateWithOffset(0);
// Sun Apr 14 2013 16:49:16 GMT+0000
```

## Creating `DateWithOffset`s

The `DateWithOffset` constructor works just like the `Date` constructor, but
the *last* argument is always the offset from UTC in minutes. Some examples:

```javascript
var nowInParis = new DateWithOffset(60);
// Sun Apr 14 2013 17:49:16 GMT+0100

var theSameTimeInMelbourne = new DateWithOffset(nowInParis, 600);
// Mon Apr 15 2013 02:49:16 GMT+1000
```

### Date Parsing

If the first argument is a String and contains an offset end with "Z",
it is treated as UTC time:

```
var newYearsGMTInBoston = new DateWithOffset("Jan 1 2013 00:00Z", -300);
// Mon Dec 31 2012 19:00:00 GMT-0500
```

If it's a String and doesn't contain an offset of end with "Z", it is treated
as local to the given offset:

```
var newYearsInBoston = new DateWithOffset("Jan 1 2013 00:00", -300);
// Tue Jan 01 2013 00:00:00 GMT-0500
```

Similarly, `DateWithOffset`s created with individual year, month, and day
(and, optionally, hours, minutes, seconds, and milliseconds) arguments are
treated as local to the given offset:

```
var newYearsInChicago = new DateWithOffset(2013, 0, 1, -360);
```

**Note** this behavior differs from that of the normal `Date` constructor,
which treats such strings as local to the *browser* (or server execution
environment).

### Rich Offset Objects

The last argument can be a `Number` (as above) or anything that responds to
`valueOf`. If you have richer time zone objects, you can pass them directly
into `new DateWithOffset`:

```javascript
var tokyo = {
  name: 'Tokyo',
  toString: function() { return 'Tokyo (GMT+0900)' },
  valueOf: function() { return 540; }
};

var nowInTokyo = new DateWithOffset(now, tokyo);
// Mon Apr 15 2013 01:49:16 GMT+0900
```
***Note***: the offset is that between *this* object and *UTC*, which means
that it is positive if the object's time zone is ahead of UTC and negative
if it is behind. This is the opposite of what
[`Date.prototype.getTimezoneOffset`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
returns.

## Compatibility with `Date`

You can use a `DateWithOffset` anywhere you use a `Date`:

```javascript
nowInUTC.getHours();                  // 16
nowInParis.getTime();                 // 1365958156000
theSameTimeInMelbourne.getTime();     // 1365958156000
newYearsInBoston.getTimezoneOffset(); // 300

newYearsInBoston.setDate(15);
newYearsInBoston;                     // Tue Jan 15 2013 00:00:00 GMT-0500
```

## Additional Features

Get back the original offset:

```
nowInBoston.offset();
// -300

nowInTokyo.offset().toString();
// "Tokyo (GMT+0900)"
```

Get a new `DateWithOffset` representing the same point in time at a
different UTC offset:

```
var nowInChicago = nowInBoston.withOffset(-300)
```

Get a plain `Date` representing the same point in time at the local offset:

```
var nowInLocal = nowInParis.date();
```

## Related Projects

[node-time](https://github.com/TooTallNate/node-time) provides very similar
functionality with a different API. It supports time zone names (not just
offsets), but only runs in Node.

If you want time zone parsing support, try
[timezone-js](https://github.com/mde/timezone-js) or
[timezone](https://npmjs.org/package/timezone).

If you want a richer library for parsing, validating, manipulating, and
formatting dates, try [Moment.js](http://momentjs.com/).

If all you need to do is map Rails time zone names to IANA ones, you'll love
[rails-timezone-js](https://github.com/davidwood/rails-timezone-js).
