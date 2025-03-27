import dayjs from "dayjs";

function formatCustomDate(dateString) {
  return dayjs(dateString).format("MMMM D, YYYY");
}

export { formatCustomDate };
