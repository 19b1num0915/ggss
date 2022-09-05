import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell } from '@mui/material';
// components
import Label from 'src/components/Label';
import { fNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

Tablerow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function Tablerow({
  row,
  selected,
  onSelectRow,
  actionList,
}) {
  const theme = useTheme();
  let dayjs = require('dayjs');
  const {
    order_descr,
    order_id,
    order_status,
    order_type,
    plan_date,
    segment_count,
    segment_worker,
    plan_time,
    sms_text,
    seg_descr,
    status_name,
    spec_num,
    status,
    sms_sent_count,
    sms_target_count,
    actions,
    protsent
  } = row;
  const [openMenu, setOpenMenu] = useState(null);
  
  // useEffect(() => {
  //   setTodoAction(actions.split(','));
  // }, [actions]);
 
  return (
    <TableRow hover
      selected={selected}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left" padding="none">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (order_status === '6' && 'success') ||
            ((order_status === '3' || order_status === '2') && 'warning') ||
            (order_status === '9' && 'error') ||
            'success'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>
      <TableCell align="left" padding="none">
        {dayjs(plan_date).format('YYYY-MM-DD')}
      </TableCell>
      <TableCell align="center" padding="none">
        {plan_time ? plan_time.replace(/^(\d{2})(\d{2})/, '$1:$2:') : ''}
      </TableCell>
      <TableCell align="left" padding="none">
        {sms_text}
      </TableCell>
      <TableCell align="left" padding="none">
        {seg_descr}
      </TableCell>
      <TableCell align="center" padding="none">
        {fNumber(sms_target_count)}
      </TableCell>
      <TableCell align="center" padding="none">
        {fNumber(sms_sent_count)}
      </TableCell>
    </TableRow>
  );
}
