import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker  } from '@mui/x-date-pickers';
import moment from 'moment';
import dayjs from 'dayjs';

export default function Calendar({date, setDate, GetSchedule}) {
const minDate = new Date(new Date().getTime() + 86400000);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker 
        date={date} 
        onChange={(newDate) => {
          setDate(moment(newDate.$d).format('YYYY-MM-DD'))
          GetSchedule({"schedule_date": moment(newDate.$d).format('YYYY-MM-DD')})
        }} 
        disablePast
        sx={{borderRadius: 2}}
        minDate={dayjs(minDate)}
      />
    </LocalizationProvider>
  );
}
