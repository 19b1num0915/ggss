// form

import { useEffect, useState } from 'react';
// @mui
import { Box, Stack, Button, Checkbox, Divider, TextField, Tooltip, IconButton, Typography, FormControlLabel, InputAdornment, MenuItem } from '@mui/material';
// utils
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormikProvider, Form, useFormik } from 'formik';
import Iconify from 'src/components/Iconify';
import { mn } from "date-fns/locale";
import WidInput from 'src/widget/WidInput';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

export default function InvoiceNewEditDetails({ isEdit, data, scheduleModel }) {

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

  let dayjs = require('dayjs');

  const [value, setValue] = useState(data ? data.reg_date.replace(data.reg_date.substring(11, 16), data.send_time.replace(/^(\d{2})(\d{2})/, '$1:$2:')) : '');

  const [test, setTest] = useState({});

  const [planRow, setPlanRow] = useState([
    {
      timeCheck: data?.send_time ? true : false,
      target_count: data ? data.sms_target_count : '',
      plan_date: data ? data.send_date : '',
      plan_time_fe: data ? data.reg_date.replace(data.reg_date.substring(11, 16), data.send_time.replace(/^(\d{2})(\d{2})/, '$1:$2:')) : '',
      plan_time: data ? data.send_time : '',
    }
  ]);

  // const [timeCheck, setTimeCheck] = useState(data.send_time ? true : false);
  const inputChanged = (name, data, index) => {
    if (name === 'plan_date') {
      planRow[index][name] = dayjs(data).format('YYYYMMDD');
      setTest({ ...test, [name]: data })
    } else if (name === 'plan_time') {
      planRow[index]['plan_time_fe'] = data.replace(data.substring(11, 16), data.replace(/^(\d{2})(\d{2})/, '$1:$2:'))
      planRow[index][name] = data;
    } else {
      planRow[index][name] = data
    }
    if (name !== 'target_count') setTest({ ...test, [name]: data });
  };

  useEffect(() => {
    scheduleModel(planRow);
  }, [planRow]);

  const ValidationSchema = Yup.object().shape({
    sms: Yup.string()
      .required('SMS Required'),
    descr: Yup.string()
      .required('Нэмэлт тайлбар Required'),
  });

  const handleAdd = () => {
    setPlanRow([...planRow,
    {
      timeCheck: false,
      target_count: '',
      plan_date: '',
      plan_time: '',
      plan_time_fe: ''
    }
    ]);
    // append({
    //   title: '',
    //   description: '',
    //   service: '',
    //   quantity: '',
    //   price: '',
    //   total: '',
    // });
  };
  let array = [1, 2, 3, 4];

  const handleRemove = (index) => {
    planRow.splice(index, 1);
    setTest({ ...test, 'del': index })

  };

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      target_count: data ? data.target_count : '',
      target_count: data ? data.target_count : '',
      target_count: data ? data.target_count : '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {

      }
      catch (error) {
      }
    },
  });
  const { handleSubmit, values, isSubmitting } = formik;

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Plan оруулах:
      </Typography>

      {console.log('PPPPPPP', planRow)}
      {planRow.map((item, index) => (
        <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={mn}>
              <MobileDatePicker
                label="Огноо"
                ampm={false}
                inputFormat="yyyy/MM/dd"
                value={dayjs(planRow[index].plan_date).format('YYYY-MM-DD')}
                onChange={(newValue) => {
                  inputChanged('plan_date', newValue, index)
                }}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
              <Tooltip title="Уг талбар ямар учиртай вэ гэсэн тайлбар">
                <IconButton>
                  <Iconify icon={'ant-design:question-circle-outlined'} />
                </IconButton>
              </Tooltip>
              <FormControlLabel
                control={<Checkbox checked={planRow[index].timeCheck} onChange={e => { alert('Цаг сонгоход гарч ирэх анхааруулга тескт хэсэг'); planRow[index].timeCheck = e.target.checked; setTest({ ...test, 'time': index }) }} />}
                label="Цаг"
              />
              {planRow[index].timeCheck && (
                <>
                  <MobileTimePicker
                    label="Цаг сонгох"
                    value={planRow[index].plan_time_fe}
                    onChange={(newValue) => {
                      setValue(newValue);
                      // setPlanRow([...planRow[index], {plan_time: newValue}]);
                      // inputChanged('send_time', newValue.toLocaleTimeString('en-US', { hour12: false }))
                      inputChanged('plan_time', newValue.toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, ""), index)
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
              defaultValue={planRow[index].target_count}
              name="target_count"
              dataChanged={(data) => inputChanged('target_count', data, index)}
            />
            <WidInput
              type="select"
              regex="required"
              label="Сегмент тулгаж хасуулах"
              data={staticTypeData}
              selectField="name"
              name="target_count"
              dataChanged={(data) => inputChanged('target_count', data, index)}
            />

          </Stack>

          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="eva:trash-2-outline" />}
            onClick={() => handleRemove(index)}
          >
            Remove
          </Button>
        </Stack>
      ))}

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
          Add new detail
        </Button>
      </Stack>
    </Box>
  );
}
