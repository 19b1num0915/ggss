import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, MenuItem } from '@mui/material';
// components
import Label from 'src/components/Label';
import { fNumber } from 'src/utils/formatNumber';
import Iconify from 'src/components/Iconify';
import { TableMoreMenu } from 'src/components/table';
import PopUp from './ActionPopUp';
import { Icon } from '@iconify/react';
import {
  Button,
  Card,
  Dialog,
  TextField,
  FormLabel,
  FormControlLabel,
  Tooltip,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import WidInput from 'src/widget/WidInput';
import { FormikProvider, Form, useFormik } from 'formik';

// ----------------------------------------------------------------------

Tablerow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function Tablerow({ row, selected, tableResponse, actionList, actionMadePop,checkResponse }) {
  const theme = useTheme();
  let dayjs = require('dayjs');
  const { email, worker_type } = row;

  // const [todoAction, setTodoAction] = useState(actions.split(','));
  const [openMenu, setOpenMenu] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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
  const actionListData = [
    {
      id: 0,
      name: 'Засах',
      icon: 'dashicons:update-alt',
      color: '#78c81e',
    },
    {
      id: 1,
      name: 'Устгах',
      icon: 'fluent:delete-16-regular',
      color: 'red',
    },
  ];
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
          checkResponse2={checkResponse2}
          open={openPop}
          popAction={(check) => popActionMade(check)}
        />
      );
    }
  };
  const checkResponse2 = num => {
    // 👇️ take parameter passed from Child component
    checkResponse(num)
    // setCount(current => current + num);
  };
  const buttonClicked = (value) => {
    setOpenPop(true);
    setDisplayModel({
      ...displayModel,
      popUpName: value.name,
      buttonColor: value.color,
      actionId: value.id,
    });
    setIsEdit(2 == 2 || 9 == 9 ? false : true);
  };
  const response2 = (value) => {
    tableResponse(value);
  };
  return (
    <TableRow hover selected={selected}>
      <TableCell align="rigth" padding="none">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {showPopUp()}
              {actionListData.map((m) => {
                return (
                  <MenuItem onClick={() => buttonClicked(m)}>
                    <Icon icon={m.icon} color={m.color} />
                    {m.name}
                  </MenuItem>
                );
              })}
            </>
          }
        />
      </TableCell>
      <TableCell align="left" padding="none">
        <Label sx={{ textTransform: 'capitalize' }}>{email}</Label>
      </TableCell>
      <TableCell align="left" padding="none">
        {worker_type === '1' ? 'User' : worker_type === '2' ? 'BA' : 'Admin'}
      </TableCell>
    </TableRow>
  );
}
