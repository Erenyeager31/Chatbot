export const formatTo12Hour = (dateString:Date) => {
  const date = dateString
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour time
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad minutes and seconds with leading zeros if needed
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  const strTime = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  return strTime;
};
