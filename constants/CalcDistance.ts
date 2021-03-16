import { RateState } from "../store/types/rateTypes";
import { exchangeData } from "./GeoLocation";

export function addDistancePropertyToExchanges(
  data: RateState[],
  userLocation: { latitude: number; longitude: number }
) {
  const { latitude, longitude } = userLocation;
  console.log(latitude, longitude);
  for (var i in data) {
    for (var j in exchangeData) {
      if (data[i].name === exchangeData[j].name) {
        let { lat, lng } = exchangeData[j].location;
        data[i]["distance"] = calcDistance(lat, lng, latitude, longitude);
      }
    }
  }
  return data;
}
function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
