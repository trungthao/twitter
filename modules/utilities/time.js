const moment = require('moment'),

convertTime = (time) => {
  let hour = moment().hour() - moment.unix(time).hour();
  if (hour > 0) {
    return moment().subtract(hour, 'hours').fromNow();
  } else {
    let minute = moment().minute() - moment.unix(time).minute();
    if (minute > 0) {
      return moment().subtract(minute, 'minutes').fromNow();
    } else {
      let second = moment().second() - moment.unix(time).second();
      return moment().subtract(second, 'seconds').fromNow();
    }
  }
}

module.exports = {
  convertTime
}
