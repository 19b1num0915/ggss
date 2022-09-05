import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  Dialog,
  TextField,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
} from '@mui/material';
import { apiService } from 'src/api/api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import WidInput from 'src/widget/WidInput';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// 3rd party
import { FormikProvider, Form, useFormik } from 'formik';
import Manual from './nested/tabs/Manual';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import { mn } from 'date-fns/locale';
import PopUpNested from './nested/PopUpNested';
import * as Yup from 'yup';

export default function PopUp({ popUpName, doAction, confirmModal, data, isEdit, popAction }) {
  useEffect(() => {
    getUserRoleList();
  }, []);

  const [userRoleList, setUserRoleList] = useState([]);
  const getUserRoleList = async () => {
    const response = await apiService.getMethod('/user/role/list');
    setUserRoleList(response?.data.rows);
  };

  let dayjs = require('dayjs');
  const [doActionNested, setDoActionNested] = useState();
  const [segView, setSegView] = useState();
  const [test, setTest] = useState({});
  const [openPopNested, setOpenPopNested] = useState(false);
  const [formValidation, setFormValidation] = useState({
    textLength: 0,
  });

  const { enqueueSnackbar } = useSnackbar();
  //.....huselt...//
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      mail: data ? data.mail : '',
      role: data ? data.role : '',
    },
    onSubmit: async ({ setSubmitting, resetForm, setErrors }) => {
      const datas = {
        type: values.role,
        user_email: values.mail,
        comment: '',
      };
      try {
        if (isSubmitting) {
          const url = 'user/create';
          const res = await apiService.postMethod(`/${url}`, datas).catch((error) => {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          });
          resetForm();
          setSubmitting(false);
          res.data.msg !== 'fail'
            ? enqueueSnackbar(res.data.action_msg) && popAction(true)
            : enqueueSnackbar(res.data.action_msg, { variant: 'error' });
        }
      } catch (error) {
        setSubmitting(false);
        setErrors(error.message);
      } finally {
        popAction(true);
      }
    },
  });

  const handleClose = async (reason) => {
    popAction(false);
  };
  const closeModal = () => {
    popAction(false);
  };
  const inputChanged = (name, data) => {
    values[name] = data;
    if (name === 'Role') setTest({ ...test, [name]: data });
  };
  const popUpHandler = (number) => {
    setOpenPopNested(true);
    setDoActionNested(number);
  };
  const popActionNested = (data) => {
    setOpenPopNested(false);
  };
  // const segmentChanged = (item) => {
  //   values.segment_worker = item.segment_worker;
  //   values.seg_descr = item.seg_descr;
  // };
  useEffect(() => {
    if (segView === 1) popUpHandler(1);
  }, [segView]);
  // const userAdd = async () => {
  //   const response = await apiService.postMethod('/user/create', formik.values);
  // };
  const { handleSubmit, values, isSubmitting } = formik;
  console.log('=================>', values);
  return (
    <div>
      <Dialog open={confirmModal} onClose={closeModal} sx={{ p: 5 }} maxWidth>
        <DialogTitle>{popUpName}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="text"
                        regex="email"
                        label="user "
                        name="mail"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('mail', data)}
                      />
                      <WidInput
                        type="select"
                        regex="required"
                        label="Role "
                        data={userRoleList}
                        selectField="name"
                        name="role"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('role', data)}
                      />
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit">
                {'Хаах'}
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Нэмэх
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
