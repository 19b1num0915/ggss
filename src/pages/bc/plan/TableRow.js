import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, MenuItem } from '@mui/material';
// components
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';import Label from 'src/components/Label';
import { fNumber } from 'src/utils/formatNumber';
import Iconify from 'src/components/Iconify';
import { TableMoreMenu } from 'src/components/table';
import PopUp from './ActionPopUp';

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
  isDragged,
  index,
  props,
  row,
  selected,
  onSelectRow,
  actionList,
  actionMadePop,
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
  // const [todoAction, setTodoAction] = useState();
  const [todoAction, setTodoAction] = useState(actions?.split(','));
  const [openMenu, setOpenMenu] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [displayModel, setDisplayModel] = useState('');
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };
  const popActionMade = (data) => {
    setOpenMenu(null);
    setOpenPop(false);
    if (data) {
      actionMadePop(true);
    }
  };

  // useEffect(() => {
  //   setTodoAction(actions.split(','));
  // }, [actions]);
  const handleCloseMenu = () => {
    setOpenMenu(null);
  };
  const showPopUp = () => {
    if (openPop) {
      return (
        <PopUp
          data={row}
          displayModel={displayModel}
          open={openPop}
          isEdit={isEdit}
          popAction={(check) => popActionMade(check)}
        />
      );
    }
  };
  const buttonClicked = (value) => {
    setOpenPop(true);
    setDisplayModel({
      ...displayModel,
      popUpName: value.action_name,
      actionButton: value.action_name,
      buttonColor: value.color,
      execute: value.executable,
      action_id: value.id,
      order_id: order_id,
    });
    setIsEdit((value.id == 2 || value.id == 9) ? false : true);
  }
  return (
    <TableRow hover
      selected={selected}
      {...props}
      style={{ ...props?.style, textAlign: 'center', cursor: isDragged ? 'grabbing' : 'grab' }}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell padding="checkbox">{index + 1}</TableCell>
      <TableCell align="center" padding="none">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {showPopUp()}
              {todoAction?.map((y => {
                return actionList?.map(x => {
                  if (x.id == y) {
                    return <MenuItem sx={{ color: `${x.color}.main` }} onClick={() => buttonClicked(x)}>
                      <Iconify icon={x.icons} />
                      {x.action_name}
                    </MenuItem>
                  }
                })
              }))}
            </>
          }
        />
      </TableCell>
      <TableCell align="left" padding="none">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (order_status === '6' && 'success') ||
            ((order_status === '3' || order_status === '2') && 'warning') ||
            (order_status === '9' && 'error') ||
            'default'
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
      <TableCell align="left" padding="none" sx={{width: '11%'}}>
        <Box sx={{ width: '100%' }}>
      <LinearProgress variant="buffer" value={protsent ? null : 0} valueBuffer={protsent ? null : 0} />{protsent == null ? '' : '%'}
    </Box>
      </TableCell>
    </TableRow>
  );
}
