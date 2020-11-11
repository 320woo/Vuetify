import moment from "moment"

const REQUEST_TIMESTAMP_FORMAT = "YYYY-MM-DDTHH:mm:ss"
const REQUEST_DATE_FORMAT = "YYYY-MM-DD"
const SIMPLE_DATE_FORMAT = "YYYY.MM.DD"

export default {
  REQUEST_TIMESTAMP_FORMAT,
  REQUEST_DATE_FORMAT,
  SIMPLE_DATE_FORMAT,

  getConvertDate(date) {
    return moment(date).format("YYYY년 MM월 DD일 HH:mm")
  },
  getConvertDateFormat(date, format) {
    return moment(date).format(format)
  },

  pad(num, width) {
    num = num + ""
    return num.length >= width
      ? num
      : new Array(width - num.length + 1).join("0") + num
  },

  converterFormData(convertData, imageKey) {
    let fd = new FormData()

    Object.keys(convertData).map(key => {
      let data

      if (convertData[key] instanceof Object) {
        if (key === imageKey) {
          convertData[key].forEach(item => {
            fd.append(key, item.file)
          })
          data = null
        } else {
          data = JSON.stringify(convertData[key])
        }
      } else {
        data = convertData[key]
      }

      if (data) {
        fd.append(key, data)
      }
    })

    return fd
  },

  clone(input) {
    return JSON.parse(JSON.stringify(input))
  },

  replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  },

  isIgnoreCaseEqual(str1, str2) {
    if (str1 === null || str2 === null) return false
    return str1.toUpperCase() === str2.toUpperCase()
  }
}
