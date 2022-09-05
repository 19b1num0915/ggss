import PropTypes from 'prop-types';
import { Stack, TextField, Box, MenuItem, Button, FormControl, IconButton } from '@mui/material';
// components
import Iconify from 'src/components/Iconify';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

Tablehead.propTypes = {
  filterService: PropTypes.string,
  onStatusSelect: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  statusList: PropTypes.arrayOf(PropTypes.string),
};

export default function Tablehead({
  statusList,
  filterService,
  onStatusSelect,
  onFilterStartDate,
  range,
  download,
  loader,
}) {
  let dayjs = require('dayjs');
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(dayjs(new Date().now).startOf('week').add(1, 'day').format('YYYY-MM-DD')),
      endDate: new Date(dayjs(new Date().now).endOf('week').add(1, 'day').format('YYYY-MM-DD')),
      key: 'selection'
    }
  ]);
  useEffect(() => {
    range(state[0]);
  }, [state]);
  const arrowClicked = (value) => {
    const now = new Date(dayjs(state[0]?.startDate).startOf('week').add(value==='left' ? -6 : 8, 'day').format('YYYY-MM-DD'));
    setState([{ startDate: now,
    endDate: new Date(dayjs(now).endOf('week').add(1, 'day').format('YYYY-MM-DD'))}]);
  };
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2, px: 1 }}>
      <FormControl fullWidth>
        <TextField
          size="small"
          fullWidth
          select
          label="Статусаар шүүх"
          value={filterService}
          onChange={onStatusSelect}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            textTransform: 'capitalize',
          }}
        >
          {statusList.length !== 0 && statusList.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.status}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      {open && (
        <DateRangePicker
          onChange={item => {
            onFilterStartDate([item.selection ? item.selection : item.range1]);
            setOpen(false);
            setState([item.selection ? item.selection : item.range1])
          }
          }
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
        />
      )}
      {!open && (
        <>
          <FormControl fullWidth>
            <div style={{ display: 'flex' }}>
              <IconButton
                onClick={() => {
                  arrowClicked('left');
                }}
              >
                <Iconify icon={'bx:left-arrow-alt'} color="blue" />
              </IconButton>
              <TextField
                value={`${dayjs(state[0]?.startDate).format('MM/DD/YYYY')} - ${dayjs(state[0]?.endDate).format('MM/DD/YYYY')}`}
                fullWidth
                size="small"
                style={{minWidth: '202px'}}
                className="inputBox"
                onClick={() => setOpen((open) => !open)}
              />
              <IconButton
                onClick={() => {
                  arrowClicked('right');
                }}
              >
                <Iconify icon={'bx:right-arrow-alt'} color="blue" />
              </IconButton>
            </div>
          </FormControl>
          <FormControl fullWidth>
            <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
              <Button
                style={{ color: 'white' }}
                variant="contained"
                disabled={loader}
                startIcon={<Iconify icon={'vscode-icons:file-type-excel'} />}
                onClick={() => download()}
              >
                Татаж авах
              </Button>
            </Box>
          </FormControl>
        </>
      )}
    </Stack>
  );
}
