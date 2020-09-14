var moment = require("moment")

export function formatDate(dateStr: string) {
  return moment(dateStr).format("MMM DD YYYY")
}
