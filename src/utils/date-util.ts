import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const dateFormat = (dataStr: string | number, pattern = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(dataStr).format(pattern);
};

export const dateFormatNow = (dataStr: string | number) => {
  return dayjs(dataStr).fromNow();
};
