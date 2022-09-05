import { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';

import { TextField } from '@mui/material';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangePickerComp = (dateRange) => {
  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);
  // open close
  const [open, setOpen] = useState(false);
  // get the target element to toggle
  const refOne = useRef(null);

  useEffect(() => {
    // event listeners
    document.addEventListener('keydown', hideOnEscape, true);
    document.addEventListener('click', hideOnClickOutside, true);
  }, []);

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Hide dropdown on outside click
  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <>
      <TextField
        value={`${format(range[0].startDate, 'MM/dd/yyyy')} to ${format(range[0].endDate, 'MM/dd/yyyy')}`}
        fullWidth
        size="small"
        className="inputBox"
        onClick={() => setOpen((open) => !open)}
      />

      <div ref={refOne}>
        {open && (
          <DateRangePicker
            onChange={(item) => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            // style={style.wrapElement}
            direction="horizontal"
            // className="calendarElement"
          />
        )}
      </div>
    </>
  );
};

export default DateRangePickerComp;
