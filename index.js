(function(window, undefined) {

  var slice = Array.prototype.slice,
      MILLISECONDS_PER_MINUTE = 60 * 1000,
      OFFSET_SUFFIX = /(((GMT)?[\+\-]\d\d:?\d\d)|Z)(\s*\(.+\))?$/;

  function isNumber(x) { return typeof(x) === 'number'; }

  function isFunction(x) { return typeof(x) === 'function'; }

  function isOffset(x) {
    if (x == null) { return false; }
    if (isFunction(x.valueOf)) {
      x = x.valueOf();
    }
    return isNumber(x);
  }

  function applyOffset(date, offset) {
    date.setTime( date.getTime() + MILLISECONDS_PER_MINUTE * offset );
    return date;
  }

  function buildDate(args, offset) {
    if (args.length === 0) { return new Date(); }

    if (args.length === 1 && args[0] instanceof Date) { return args[0]; }
    if (args.length === 1 && isNumber(args[0]))       { return new Date(args[0]); }

    if (args.length > 1) {
      args[3] = args[3] || null;
      args[4] = args[4] || null;
      args[5] = args[5] || null;
      args[6] = args[6] || null;

      date = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      return applyOffset( date, -date.getTimezoneOffset() - offset );
    }

    var string            = args[0].toString(),
        date              = new Date(string),
        isYYYYmmdd        = /\d\d\d\d-\d\d-\d\d/.test(string),
        isOffsetSpecified = OFFSET_SUFFIX.test(string),
        isLocal           = !isYYYYmmdd && !isOffsetSpecified;

    if (isLocal) {
      date = applyOffset(date, -date.getTimezoneOffset() - offset);
    }

    return date;
  }

  function setTime(date) {
    this.date = function() { return new Date(date); };
    return this;
  }

  function formattedOffset(offsetInMinutes) {
    var sign    = offsetInMinutes >= 0 ? '+' : '-';
    offsetInMinutes = Math.abs(offsetInMinutes);
    var hours   = Math.floor(offsetInMinutes / 60),
        minutes = offsetInMinutes - 60 * hours;
    if (hours < 10)   { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    return 'GMT' + sign + hours + minutes;
  }

  function DateWithOffset() {
    var args = slice.call(arguments, 0),
        offset = args.pop();

    if ( !isOffset(offset) ) {
      throw new TypeError('DateWithOffset requires an offset');
    }

    setTime.call(this, buildDate(args, offset));
    this.offset = function() { return offset; };
  }

  DateWithOffset.prototype = {

    // A Date whose UTC time is the local time of this object's real time.
    // That is, it is incorrect by `offset` minutes. Used for `getDate` et al.
    localDate: function() {
      return applyOffset(this.date(), this.offset());
    },

    withOffset: function(offset) {
      return new DateWithOffset(this.getTime(), offset);
    },

    getTime:            function() { return this.date().getTime(); },
    getTimezoneOffset:  function() { return -this.offset(); },
    toISOString:        function() { return this.date().toISOString(); },
    valueOf:            function() { return this.getTime(); },

    toString: function() {
      var localDate = this.localDate(),
          plusBrowserOffset = applyOffset(localDate, localDate.getTimezoneOffset()),
          asString = plusBrowserOffset.toString();
      return asString.replace(OFFSET_SUFFIX, formattedOffset(this.offset()));
    },

    getYear: function() {
      return this.localDate().getUTCFullYear() - 1900;
    },

    setYear: function(year) {
      return this.setFullYear(1900 + year);
    },

    setTime: setTime

  };

  function addGetters(property) {
    DateWithOffset.prototype['get' + property] = function() {
      return this.localDate()['getUTC' + property]();
    };

    DateWithOffset.prototype['getUTC' + property] = function() {
      return this.date()['getUTC' + property]();
    };
  }

  function addSetters(property) {
    DateWithOffset.prototype['set' + property] = function(newValue) {
      var localDate = this.localDate();
      localDate['setUTC' + property](newValue);
      return this.setTime( applyOffset(localDate, -this.offset()) );
    };

    DateWithOffset.prototype['setUTC' + property] = function(newValue) {
      var date = this.date();
      date['setUTC' + property](newValue);
      return this.setTime(date);
    };
  }

  addGetters('Date');           addSetters('Date');
  addGetters('Day');            // can't set day of week
  addGetters('FullYear');       addSetters('FullYear');
  addGetters('Hours');          addSetters('Hours');
  addGetters('Milliseconds');   addSetters('Milliseconds');
  addGetters('Minutes');        addSetters('Minutes');
  addGetters('Month');          addSetters('Month');
  addGetters('Seconds');        addSetters('Seconds');

  if (typeof(module) !== 'undefined') {
    module.exports = DateWithOffset;
  }

  if (typeof(window) !== 'undefined') {
    window.DateWithOffset = DateWithOffset;
  }

}(this));
