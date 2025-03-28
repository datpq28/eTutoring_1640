import dayjs from "dayjs";

function formatCustomDate(dateString) {
  return dayjs(dateString).format("MMMM D, YYYY");
}

import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const formatTime = (input) => {
  const now = dayjs();
  const date = dayjs(input);

  // Nếu là hôm nay -> Hiện giờ (HH:mm)
  if (date.isToday()) {
    return date.format("HH:mm");
  }

  // Nếu là trong tuần này -> Hiện thứ (ví dụ: Friday)
  if (date.isSameOrAfter(now.subtract(6, "day"), "day")) {
    return date.format("dddd"); // Ví dụ: Monday, Tuesday
  }

  // Nếu là trong 1 tháng -> Hiện số tuần (ví dụ: 2 weeks before)
  if (date.isSameOrAfter(now.subtract(1, "month"), "day")) {
    const weeks = now.diff(date, "week");
    return `${weeks} week${weeks > 1 ? "s" : ""} before`;
  }

  // Nếu là tháng trước -> Hiện số tháng (ví dụ: 1 month before)
  const months = now.diff(date, "month");
  return `${months} month${months > 1 ? "s" : ""} before`;
};

export { formatCustomDate, formatTime };
