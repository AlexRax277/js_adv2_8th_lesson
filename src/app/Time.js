export default function Time(currentTime) {
  function correctData(data) {
    if (data.length < 2) {
      data = `0${data}`;
    }
    return data;
  }
  currentTime = `${correctData(String(currentTime.getHours()))}:${correctData(String(currentTime.getMinutes()))} ${correctData(String(currentTime.getUTCDate()))}.${correctData(String(currentTime.getUTCMonth() + 1))}.${String(currentTime.getFullYear())}`;
  return currentTime;
}
