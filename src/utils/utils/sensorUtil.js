
const LATITUDE = {
  value: 0x20,
  decimal_place: 5,
  name: "위도"
};

const LONGITUDE = {
  value: 0x21,
  decimal_place: 5,
  name: "경도"
};

const ALTITUDE = {
  value: 0x22,
  decimal_place: 0,
  name: "고도"
};

function swap16(val) {
  return ((val & 0xFF) << 8)
    | ((val >> 8) & 0xFF);
}

function swap32(val) {
  return ((val & 0xFF) << 24)
    | ((val & 0xFF00) << 8)
    | ((val >> 8) & 0xFF00)
    | ((val >> 24) & 0xFF);
}

function calcExponentiation(number, exponentiation) {
  return (Number)(number+"e"+"-"+exponentiation);
}

const GPS_DATA = {
  lat: 0.0,
  lon: 0.0,
  alt: 0,
};

const DATA_TYPE_SIZE = 2;
const DATA_LENGTH_SIZE = 2;

export default {

  getGPSInfo(infoData) {
    let gpsData = GPS_DATA;

    let dummyData = infoData;

    while (dummyData.length) {
      let length = 0;
      let dataType = parseInt(dummyData.substring(0, length+=DATA_TYPE_SIZE), 16);
      let dataLength = parseInt(dummyData.substring(length, length+=DATA_LENGTH_SIZE), 16);
      let data = parseInt(dummyData.substring(length, length+=(dataLength * 2)), 16);
      let endianData;
      if (dataLength === 2) {
        endianData = swap16(data);
      } else {
        endianData = swap32(data);
      }
      console.log("[getGPSInfo] dataType : " + dataType + ", dataLength : " + dataLength + ", data : " + data + ", endianData : " + endianData);

      switch (dataType) {
        case LATITUDE.value:
          gpsData.lat = calcExponentiation(endianData, LATITUDE.decimal_place);
          break;
        case LONGITUDE.value:
          gpsData.lon = calcExponentiation(endianData, LONGITUDE.decimal_place);
          break;
        case ALTITUDE.value:
          gpsData.alt = calcExponentiation(endianData, ALTITUDE.decimal_place);
          break;
      }

      dummyData = dummyData.slice(length, dummyData.length);
    }
    console.log("[getGPSInfo] gpsData : ", gpsData);
    return gpsData;
  }
}
