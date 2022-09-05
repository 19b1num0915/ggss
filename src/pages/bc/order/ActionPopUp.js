import { useEffect, useState } from 'react';
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
import DropDownTestTemplate from './DropDownTestTemplate';
export default function PermissionPopUp({ data, displayModel, open, isEdit, popAction, userRoleList }) {
  const { enqueueSnackbar } = useSnackbar();
  const [timeCheck, setTimeCheck] = useState(data.send_time ? true : false);
  const [value, setValue] = useState(
    data
      ? data.reg_date?.replace(data.reg_date.substring(11, 16), data.send_time.replace(/^(\d{2})(\d{2})/, '$1:$2:'))
      : ''
  );
  const [test, setTest] = useState({});
  const [scheduleModel, setScheduleModel] = useState([]);
  const [templateData, setTemplateData] = useState('');

  const [segView, setSegView] = useState(data.segment_worker ? 2 : '');
  const [formValidation, setFormValidation] = useState({
    textLength: 0,
  });
  useEffect(() => {
    testTemplate();
  }, []);

  const staticData = [
    {
      ID: 0,
      name: 'Үгүй',
    },
    {
      ID: 1,
      name: 'Тийм',
    },
  ];
  const staticConditionData = [
    {
      id: 'Нөхцөлгүй',
      name: 'Нөхцөлгүй',
    },
    {
      id: 'Нөхцөлийн дагуу',
      name: 'Нөхцөлийн дагуу',
    },
  ];
  const staticTypeData = [
    {
      id: 'Unitel',
      number: 320,
      name: 'Unitel',
    },
    {
      id: 'Toki',
      number: 320,
      name: 'Toki',
    },
    {
      id: 'Univision',
      number: 320,
      name: 'Univision',
    },
    {
      id: 'Voice BC',
      number: 255,
      name: 'Voice BC',
    },
    {
      id: 'Other operator',
      number: 160,
      name: 'Other operator',
    },
  ];
  const staticOtherOperatorData = [
    {
      id: '131434',
      name: '131434',
    },
    {
      id: '131437',
      name: '131437',
    },
    {
      id: '131401',
      name: '131401',
    },
    {
      id: '140140',
      name: '140140',
    },
    {
      id: '131474',
      name: '131474',
    },
  ];
  let dayjs = require('dayjs');

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      isCond: data ? data.isCond : '',
      order_type: data ? data.order_type : '',
      spec_num: data ? data.spec_num : '',
      tag: data ? data.order_tag : '',
      order_descr: data ? data.order_descr : '',
      sms_text: data ? data.sms_text : '',
      send_date: data ? data.send_date : '',
      send_time: data ? data.send_time : '',
      checkbox: data ? data.checkbox : false,
      sms_target_count: data ? data.sms_target_count : '',
      time_descr: data ? data.time_descr : '',
      segment_worker: data ? data.segment_worker : '',
      seg_descr: data ? data.seg_descr : '',
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        values['name'] = '';
        values['company'] = 'Unitel';
        values.send_date = dayjs(values.send_date).format('YYYYMMDD');
        let item = new FormData();
        item.append('action_id', displayModel.action_id);
        item.append('order_id', displayModel.order_id);
        if (displayModel.action_id === 3 || displayModel.action_id === 6 || displayModel.action_id === 8) {
          item.append('json', JSON.stringify({ comment: values.comment }));
        } else if (displayModel.action_id === 2) {
          item.append(
            'json',
            JSON.stringify({
              descr: values.order_descr,
              sms: values.sms_text,
              sms_count: values.userCount,
              send_date: values.send_date,
              send_time: values.send_time,
              segment_worker: values.segment_worker,
              seg_descr: values.seg_descr,
              spec_num: values.spec_num,
              sms_count: values.sms_target_count,
              time_descr: values.time_descr,
              type: values.order_type,
              tag: values.tag,
            })
          );
        } else if (displayModel.action_id == 12) {
          // item.append('json', JSON.stringify(scheduleModel));
          let json = {};
          json.rows = scheduleModel;
          item.append('json', JSON.stringify(json));
        } else {
          item.append('json', JSON.stringify({}));
        }
        const res = await apiService.postMethod(`/bc/on`, item).catch((error) => {
          enqueueSnackbar(error.response.data.action_msg, { variant: 'error' });
        });
        if (res.status === 200 && res.data.status === 'success') {
          enqueueSnackbar(res.data.action_msg);
          closeModal(true);
        }
        resetForm();
        setSubmitting(false);
      } catch (error) {
        setSubmitting(false);
        setErrors(error.message);
      }
    },
  });

  const handleClose = async (reason) => {
    popAction(false);
  };

  const testTemplate = async () => {
    const response = await apiService.getMethod('/test-user-list ');
    setTemplateData(response?.data);
    console.log('dddaaasss', response?.data);
  };
  const closeModal = (action) => {
    action ? popAction(action) : popAction(false);
  };
  const segmentChanged = (item) => {
    values.segment_worker = item.segment_worker;
    values.seg_descr = item.seg_descr;
  };
  const inputChanged = (name, data) => {
    if (name === 'send_time') {
      setTest({ ...test, [name]: data });
    } else if (name === 'order_type') {
      setFormValidation({ ...formValidation, textLength: staticTypeData.find((x) => x.name === data)?.number });
    }
    if (name === 'ROLE_SELECT_ID') {
      values[name] = userRoleList.find((x) => x.DESCRIPTION === data)?.ID;
    } else if (name === 'IS_REDUCE') {
      values[name] = staticData.find((x) => x.name === data)?.ID;
    } else {
      values[name] = data;
    }
    if (name === 'send_date' || name !== 'sms_target_count') setTest({ ...test, [name]: data });
  };
  console.log('displayModel', displayModel)
  const { handleSubmit, values } = formik;
  return (
    <div>
      <Dialog open={open} onClose={closeModal} sx={{ p: 5 }} maxWidth>
        <DialogTitle>{displayModel.popUpName}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <Grid item xs={12} md={12}>
                {displayModel.action_id == 12 && (
                  <Card sx={{ p: 3, mb: 2 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <AddPlan data={data} scheduleModel={(value) => setScheduleModel(value)} />
                    </Stack>
                  </Card>
                )}
                <Card sx={{ p: 3, mb: 2 }}>
                  <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <WidInput
                        type="select"
                        regex="required"
                        label="Нөхцөлийн код"
                        defaultValue={data.order_tag ? staticConditionData[1].name : staticConditionData[0].name}
                        name="isCond"
                        data={staticConditionData}
                        selectField="name"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('isCond', data)}
                      />
                      {values && (values.tag || values.isCond === 'Нөхцөлийн дагуу') && (
                        <WidInput
                          type="text"
                          regex="required"
                          label="нөхцөл"
                          maxLength={7}
                          defaultValue={values.tag}
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
                        defaultValue={data?.order_type || ''}
                        name="order_type"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('order_type', data)}
                      />
                      <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                        <IconButton>
                          <Iconify icon={'ant-design:question-circle-outlined'} />
                        </IconButton>
                      </Tooltip>
                      {values && values.orderType === 'Other operator' ? (
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
                      ) : (
                        <WidInput
                          type="text"
                          regex="required"
                          maxLength={11}
                          defaultValue={values.spec_num}
                          label="Тусгай дугаар"
                          name="spec_num"
                          disabled={isEdit}
                          dataChanged={(data) => inputChanged('spec_num', data)}
                        />
                      )}
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
                        defaultValue={data?.sms_text || ''}
                        name="sms_text"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('sms_text', data)}
                      />
                      {data.sms_text.length}/{formValidation.textLength}
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
                          disabled={isEdit}
                          value={dayjs(values?.send_date).format('YYYY-MM-DD')}
                          onChange={(newValue) => {
                            inputChanged('send_date', newValue);
                          }}
                          renderInput={(params) => <TextField {...params} size="small" />}
                        />
                        <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                          <IconButton>
                            <Iconify icon={'ant-design:question-circle-outlined'} />
                          </IconButton>
                        </Tooltip>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={timeCheck}
                              onChange={(e) => {
                                alert('Цаг сонгоход гарч ирэх анхааруулга тескт хэсэг');
                                setTimeCheck(e.target.checked);
                              }}
                            />
                          }
                          label="Цаг"
                          disabled={isEdit}
                        />
                        {timeCheck && (
                          <>
                            <MobileTimePicker
                              label="Цаг сонгох"
                              value={value}
                              disabled={isEdit}
                              onChange={(newValue) => {
                                setValue(newValue);
                                inputChanged(
                                  'send_time',
                                  newValue.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '')
                                );
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
                        disabled={isEdit}
                        defaultValue={values.sms_target_count}
                        name="sms_target_count"
                        dataChanged={(data) => inputChanged('sms_target_count', data.toString())}
                      />
                    </Stack>
                    {timeCheck && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <WidInput
                          type="description"
                          regex="required"
                          label="Цаг сонгосон тайлбар"
                          defaultValue={values.time_descr || ''}
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
                        defaultValue={values?.order_descr || ''}
                        name="order_descr"
                        disabled={isEdit}
                        dataChanged={(data) => inputChanged('order_descr', data)}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <FormLabel id="demo-row-radio-buttons-group-label" style={{ paddingTop: '8px' }}>
                        Сегмент тодорхойлох
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                      >
                        <FormControlLabel
                          value="Auto"
                          disabled={isEdit}
                          checked={segView === 1}
                          control={<Radio />}
                          label="Auto"
                          onClick={() => setSegView(1)}
                        />
                        <FormControlLabel
                          value="Manual"
                          disabled={isEdit}
                          checked={segView === 2}
                          control={<Radio />}
                          label="Manual"
                          onClick={() => setSegView(2)}
                        />
                      </RadioGroup>
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {segView === 2 ? (
                        <Manual
                          row={data}
                          isEdit={isEdit}
                          displayModel={displayModel}
                          segment={(data) => segmentChanged(data)}
                        />
                      ) : (
                        ''
                      )}
                    </Stack>
                  </Stack>
                </Card>
                {(displayModel.action_id === 3 ||
                  displayModel.action_id === 6 ||
                  displayModel.action_id === 8 ||
                  displayModel.action_id === 7) && (
                  <Card sx={{ p: 3, backgroundColor: '#a6f0b7' }}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <WidInput
                          type="description"
                          regex="required"
                          label={`${displayModel.actionButton} шалтгаан`}
                          defaultValue={data?.comment || ''}
                          name="comment"
                          dataChanged={(data) => inputChanged('comment', data)}
                        />
                      </Stack>
                    </Stack>
                  </Card>
                )}
                {displayModel.action_id === 13 && (
                  <Card sx={{ p: 3, mb: 2 }}>
                    <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                        <WidInput
                          type="description"
                          regex="required"
                          label={`${displayModel.actionButton} шалтгаан`}
                          defaultValue={data?.comment || ''}
                          name="comment"
                          dataChanged={(data) => inputChanged('comment', data)}
                        />
                      </Stack>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
                        <DropDownTestTemplate />
                      </Stack>
                    </Stack>
                  </Card>
                )}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit">
                {'Хаах'}
              </Button>
              <Button type="submit" variant="contained" color={displayModel.buttonColor}>
                {displayModel.actionButton}
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
