import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Dialog,
  FormLabel,
  Checkbox,
  Tooltip,
  IconButton,
  FormControlLabel,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { FormikProvider, Form, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import WidInput from 'src/widget/WidInput';
import { mn } from 'date-fns/locale';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Manual from './nested/tabs/Manual';
import AddPlan from './nested/tabs/AddPlan';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Iconify from 'src/components/Iconify';
import { apiService } from 'src/api/api';

export default function PermissionPopUp({ data, displayModel, open, popAction, checkResponse2 }) {
  const { enqueueSnackbar } = useSnackbar();
  const [test, setTest] = useState({});
  useEffect(() => {
    getUserRoleList();
  }, [userRoleList]);
  const [userRoleList, setUserRoleList] = useState([]);
  const getUserRoleList = async () => {
    const response = await apiService.getMethod('/user/role/list');
    setUserRoleList(response?.data.rows);
  };
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      id: data ? data.id : '',
      mail: data ? data.mail : '',
      role: data ? data.role : '',
    },

    onSubmit: async ({ setSubmitting, resetForm, setErrors }) => {
      
      if (displayModel.actionId === 0) {
        const datas = {
          id: values.id,
          type: values.role,
          user_email: values.mail,
          comment: '',
        };
        try {
          const url = '/user/edit';
          const res = await apiService.postMethod(`/${url}`, datas).catch((error) => {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          });
          checkResponse2(100)
          resetForm();
          setSubmitting(false);
          res.data.msg !== 'fail'
            ? enqueueSnackbar(res.data.action_msg) && popAction(true)
            : enqueueSnackbar(res.data.action_msg, { variant: 'error' });
        } catch (error) {
          setSubmitting(false);
          setErrors(error.message);
        } finally {
          popAction(true);
        }
      } else if (displayModel.actionId === 1) {
        const datas = {
          id: values.id,
        };
        try {
          const url = '/user/delete';
          const res = await apiService.postMethod(`/${url}`, datas).catch((error) => {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          });
          checkResponse2(100)
          resetForm();
          setSubmitting(false);
          res.data.msg !== 'fail'
            ? enqueueSnackbar(res.data.action_msg) && popAction(true)
            : enqueueSnackbar(res.data.action_msg, { variant: 'error' });
        } catch (error) {
          setSubmitting(false);
          setErrors(error.message);
        } finally {
          popAction(true);
        }
      }
    },
  });
  // console.log('ddddddaaaaaaaaataaaa', data);
  const handleClose = async (reason) => {
    popAction(false);
  };
  const closeModal = () => {
    popAction(false);
  };

  const inputChanged = (name, data) => {
    console.log('input: ', name, data);
    values[name] = data;
    if (name === 'Role') setTest({ ...test, [name]: data });
    console.log('VALUL:  IN', values);
  };
  // console.log('displayModel: ', displayModel);
  const { handleSubmit, values } = formik;
  let userRoleName = '';
  if (data.worker_type === '3') {
    userRoleName = 'Admin';
  } else if (data.worker_type === '2') {
    userRoleName = 'BA';
  } else if (data.worker_type === '1') {
    userRoleName = 'User';
  }
  let modal;
  if (displayModel.actionId === 0) {
    modal = (
      <Dialog open={open} onClose={closeModal} sx={{ p: 5 }} maxWidth>
        <DialogTitle>{displayModel.popUpName}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="text"
                        regex="email"
                        label="email "
                        name="mail"
                        defaultValue={data.email}
                        // disabled={isEdit}
                        dataChanged={(data) => inputChanged('mail', data)}
                      />
                      {/* <WidInput
                        type="text"
                        regex="text"
                        // disabled={disabled}
                        label="Old role"
                        name="role"
                        defaultValue={userRoleName}
                      /> */}
                      <WidInput
                        type="select"
                        regex="text"
                        label="New role"
                        data={userRoleList}
                        name="role"
                        defaultValue={userRoleName}
                        // disabled={isEdit}
                        dataChanged={(data) => inputChanged('role', data)}
                      />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit">
                Хаах
              </Button>{' '}
              <Button type="submit" variant="contained" >
                {displayModel.popUpName}
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    );
  } else if (displayModel.actionId === 1) {
    modal = (
      <Dialog open={open} onClose={closeModal} sx={{ p: 5 }} maxWidth>
        <DialogTitle>{displayModel.popUpName}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="text"
                        regex="email"
                        label="email "
                        name="mail"
                        defaultValue={data.email}
                        // disabled={isEdit}
                        dataChanged={(data) => inputChanged('mail', data)}
                      />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit" >
                Хаах
              </Button>
              <Button type="submit" variant="contained" >
                {displayModel.popUpName}
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    );
  }
  return <div>{modal}</div>;
}
