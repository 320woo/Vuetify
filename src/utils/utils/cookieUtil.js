export default {
  setCookie(cookie_name, value, days = 365) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    // 설정 일수만큼 현재시간에 만료값으로 지정

    value = JSON.stringify(value)
    let cookie_value = encodeURIComponent(value) + ((days == null) ? '' : ';    expires=' + date.toUTCString());
    document.cookie = cookie_name + '=' + cookie_value;
  },

  getCookie(cookie_name) {
    let x, y;
    let val = document.cookie.split(';');

    console.log("[getCookie] val", val);

    let returnData;
    val.forEach((item) => {
      x = item.substr(0, item.indexOf('='));
      y = item.substr(item.indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
      console.log("[x] " + x);
      console.log("[y] " + y);
      if (x === cookie_name) {
        console.log("[decodeURIComponent(y)] ", JSON.parse(decodeURIComponent(y)));
        returnData = JSON.parse(decodeURIComponent(y)); // unescape로 디코딩 후 값 리턴;
      }
    });

    return returnData;
  }
}
