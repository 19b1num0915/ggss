import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Dialog, TextField, FormLabel, FormControlLabel, Checkbox, Tooltip, IconButton, DialogActions, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
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
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/Iconify';
import { mn } from "date-fns/locale";
import * as Yup from 'yup';


export default function PopUp({ popUpName, doAction, confirmModal, data, isEdit, popAction }) {
  const staticConditionData = [
    {
      id: '0',
      name: 'Нөхцөлгүй'
    },
    {
      id: '1',
      name: 'Нөхцөлийн дагуу'
    },
  ];
  const staticTypeData = [
    {
      id: 'Unitel',
      number: 320,
      name: 'Unitel'
    },
    {
      id: 'Toki',
      number: 320,
      name: 'Toki'
    },
    {
      id: 'Univision',
      number: 320,
      name: 'Univision'
    },
    {
      id: 'Voice BC',
      number: 255,
      name: 'Voice BC'
    },
    {
      id: 'Telemarketing',
      number: 320,
      name: 'Telemarketing'
    },
    {
      id: 'Other operator',
      number: 160,
      name: 'Other operator'
    },
  ];
  const staticOtherOperatorData = [
    {
      id: '131434',
      name: '131434'
    },
    {
      id: '131437',
      name: '131437'
    },
    {
      id: '131401',
      name: '131401'
    },
    {
      id: '140140',
      name: '140140'
    },
    {
      id: '131474',
      name: '131474'
    },
  ];
  let dayjs = require('dayjs');
  const [value, setValue] = useState('');
  const [test, setTest] = useState({});
  const [timeCheck, setTimeCheck] = useState(false);
  const [doActionNested, setDoActionNested] = useState();
  const [segView, setSegView] = useState();
  const [openPopNested, setOpenPopNested] = useState(false);
  const [formValidation, setFormValidation] = useState({
    textLength: 0,
  });
  const ValidationSchema = Yup.object().shape({
    sms: Yup.string()
      .required('SMS Required'),
    descr: Yup.string()
      .required('Нэмэлт тайлбар Required'),
  });

  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      isCond: data ? data.isCond : '',
      type: data ? data.type : '',
      spec_num: data ? data.spec_num : '',
      descr: data ? data.descr : '',
      sms: data ? data.sms : '',
      type: data ? data.type : '',
      checkbox: data ? data.checkbox : false,
      send_time: data ? data.send_time : '',
      time_descr: data ? data.time_descr : '',
      send_date: data ? data.send_date : '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        if (isSubmitting) {
          values['name'] = '';
          values['company'] = 'Unitel';
          values.send_date = dayjs(values.send_date).format('YYYYMMDD');
          const url = doAction === 1 ? 'bc/create-order' : 'edit';
          const res = await apiService.postMethod(`/${url}`, values).catch((error) => {
            enqueueSnackbar(error.response.data.message, { variant: 'error' });
          });
          resetForm();
          setSubmitting(false);
          res.data.msg !== 'fail'
            ? enqueueSnackbar(res.data.action_msg) && popAction(true)
            : enqueueSnackbar(res.data.action_msg, { variant: 'error' });
        }
      }
      catch (error) {
        setSubmitting(false);
        setErrors(error.message);
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
    if (name === 'type') {
      setFormValidation({ ...formValidation, textLength: staticTypeData.find(x => x.name === data)?.number });
    } else if (name === 'send_date' || name === 'send_time') {
      values[name] = dayjs(data).format('YYYY-MM-DD');
    }
    if (name !== 'count') setTest({ ...test, [name]: data });
    values[name] = data
  };
 
  const segmentChanged = (item) => {
    values.segment_worker = item.segment_worker;
    values.seg_descr = item.seg_descr;
  };
  
  const { handleSubmit, values, isSubmitting } = formik;
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
                        type="select"
                        regex="required"
                        label="Нөхцөлийн код"
                        defaultValue={data?.isCond || ''}
                        name="isCond"
                        data={staticConditionData}
                        selectField="name"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('isCond', data)}
                      />
                      {values && values.isCond === '1' && (
                        <WidInput
                          type="text"
                          regex="required"
                          label="нөхцөл"
                          maxLength={7}
                          value={values.tag}
                          name="tag"
                          disabled={isEdit}
                          dataChanged={(data) => inputChanged('tag', data)}
                        />
                      )}
                      <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                        <IconButton>
                          <Iconify icon={'ant-design:question-circle-outlined'} />
                        </IconButton>
                      </Tooltip>
                      <WidInput
                        type="select"
                        regex="required"
                        label="Төрөл"
                        data={staticTypeData}
                        selectField="name"
                        defaultValue={data?.type || ''}
                        name="type"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('type', data)}
                      />
                      <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                        <IconButton>
                          <Iconify icon={'ant-design:question-circle-outlined'} />
                        </IconButton>
                      </Tooltip>
                      {values && values.type === 'Other operator' ? (
                        <WidInput
                          type="select"
                          regex="required"
                          label="Тусгай дугаар"
                          data={staticOtherOperatorData}
                          selectField="name"
                          name="spec_num"
                          disabled={isEdit}
                          dataChanged={(data) => inputChanged('spec_num', data)}
                        />
                      ) : <WidInput
                        type="text"
                        regex="required"
                        maxLength={11}
                        label="Тусгай дугаар"
                        name="spec_num"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('spec_num', data)}
                      />}
                      <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                        <IconButton>
                          <Iconify icon={'ant-design:question-circle-outlined'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="description"
                        regex="required"
                        label="Текст"
                        maxLength={formValidation.textLength}
                        defaultValue={data?.sms || ''}
                        name="sms"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('sms', data)}
                      />
                      {values.sms.length}/{formValidation.textLength}
                      <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                        <IconButton>
                          <Iconify icon={'ant-design:question-circle-outlined'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={mn}>
                        <MobileDatePicker
                          label="Огноо"
                          ampm={false}
                          inputFormat="yyyy/MM/dd"
                          value={values.send_date}
                          onChange={(newValue) => {
                            inputChanged('send_date', newValue)
                          }}
                          renderInput={(params) => <TextField {...params} size="small" />}
                        />
                        <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                          <IconButton>
                            <Iconify icon={'ant-design:question-circle-outlined'} />
                          </IconButton>
                        </Tooltip>
                        <FormControlLabel
                          control={<Checkbox checked={timeCheck} onChange={e => { alert('Цаг сонгоход гарч ирэх анхааруулга тескт хэсэг'); setTimeCheck(e.target.checked) }} />}
                          label="Цаг"
                        />
                        {timeCheck && (
                          <>
                            <MobileTimePicker
                              label="Цаг сонгох"
                              value={value}
                              onChange={(newValue) => {
                                setValue(newValue);
                                // inputChanged('send_time', newValue.toLocaleTimeString('en-US', { hour12: false }))
                                inputChanged('send_time', newValue.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, ""))
                              }}
                              renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                              <IconButton>
                                <Iconify icon={'ant-design:question-circle-outlined'} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </LocalizationProvider>
                      <WidInput
                        type="numeric"
                        regex="required"
                        label="Илгээх хэрэглэгчдийн тоо"
                        defaultValue={values.count}
                        name="count"
                        dataChanged={(data) => inputChanged('count', data)}
                      />
                    </Stack>
                    {timeCheck && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <WidInput
                          type="description"
                          regex="required"
                          label="Цаг сонгосон тайлбар"
                          defaultValue={data?.time_descr || ''}
                          name="time_descr"
                          disabled={isEdit}
                          dataChanged={(data) => inputChanged('time_descr', data)}
                        />
                      </Stack>
                    )}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="description"
                        regex="required"
                        label="Нэмэлт тайлбар"
                        defaultValue={data?.descr || ''}
                        name="descr"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('descr', data)}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label" style={{ paddingTop: '8px' }}>Сегмент тодорхойлох</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel value="Auto" control={<Radio />} label="Auto" onClick={() => setSegView(1)} />
                        <FormControlLabel value="Manual" control={<Radio />} label="Manual" onClick={() => setSegView(2)} />
                      </RadioGroup>
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
                {doAction === 1 ? 'Нэмэх' : doAction === 2 ? 'Хадгалах' : 'Устгах'}
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
