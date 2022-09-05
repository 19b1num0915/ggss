import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileDatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
// 3rd party
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import NumberFormat from 'react-number-format';
// import mnLocale from 'date-fns/locale/mn';
import { useFormik } from 'formik';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function WidInput({
  isEdit,
  currentUser,
  placeholder,
  disableFuture,
  type,
  name,
  label,
  defaultValue,
  regex,
  data,
  disabled,
  dataChanged,
  selectField,
  prefix,
  maxLength
}) {
  const registerRegex = /^[А-ЯӨҮ]{2}[0-9]{8}$/;
  const carRegex = /^[0-9]{4}[А-ЯӨҮ]{3}$/;
  const phoneRegex = /^[0-9]{8}$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
  const notEmpty = /\S+/;
  const [iRegex, setIRegex] = useState('');
  const [message, setMessage] = useState('');
  const regexFunc = () => {
    switch (regex) {
      case 'register':
        setIRegex(registerRegex);
        setMessage('Регистрийн дугаар буруу');
        break;
      case 'phone':
        setIRegex(phoneRegex);
        setMessage('Утасны дугаар буруу');
        break;
      case 'email':
        setIRegex(emailRegex);
        setMessage('Емайл хаяг буруу');
        break;
      case 'car':
        setIRegex(carRegex);
        setMessage('Улсын дугаар буруу байна');
        break;
      case 'required':
        setIRegex(notEmpty);
        setMessage('Заавал бөглөнө үү');
        break;
      default:
      // code block
    }
  };

  // Number Thousand Formatter --->
  const NumberFormatCustom = (prefix) =>
    React.forwardRef(function NumberFormatCustom(props, ref) {
      const { onChange, ...other } = props;
      return (
        <NumberFormat
          {...other}
          getInputRef={ref}
          defaultValue={defaultValue ? defaultValue : 0}
          onValueChange={(values) => {
            dataChanged(values.floatValue);
            formik.values[name] = values.floatValue;
          }}
          value={formik.values[name]}
          thousandSeparator
          isNumericString
          prefix={prefix}
        />
      );
    });
  // <--- Number Thousand Formatter

  useEffect(() => {
    regexFunc();
  }, []);
  // const registerRgx = (value) => (value && !/^[А-ЯӨҮ]{2}[0-9]{8}$/i.test(value) ? 'Invalid Register' : undefined);
  // const phoneRgx = (value) => (value && !/^[0-9]{8}$/i.test(value) ? 'Invalid Phone' : undefined);
  const navigate = useNavigate();
  let selectObj = {};
  const { enqueueSnackbar } = useSnackbar();
  const ValidationDesc = Yup.object().shape({
    [name]: Yup.string().matches(iRegex, message).required('Заавал бөглөх'),
    // name: Yup.string().email('Email must be a valid email address').required('Name is required'),
  });
  const initialValues = {};
  initialValues[name] = defaultValue;
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ValidationDesc,
  });

  useEffect(() => {
    if (dataChanged) {
      dataChanged(formik.values[name]);
    }
  }, [formik.values]);
  useEffect(() => {
    if (type == 'select') {
      selectObj = data.find((item) => item[selectField] == defaultValue);
    }
  }, []);
  const { errors, touched, setFieldValue, getFieldProps } = formik;
  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <TextField
            fullWidth
            inputProps={{ maxLength: maxLength ? maxLength : null }}
            size="small"
            label={label}
            placeholder={placeholder}
            defaultValue={defaultValue}
            {...getFieldProps(name)}
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          />
        );
      case 'textCustom':
        return (
          <TextField
            inputProps={{ maxLength: maxLength ? maxLength : null }}
            size="small"
            label={label}
            placeholder={placeholder}
            defaultValue={defaultValue}
            {...getFieldProps(name)}
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            defaultValue={defaultValue}
            {...getFieldProps(name)}
            type="number"
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          />
        );
      case 'password':
        return (
          <TextField
            fullWidth
            type="password"
            label={label}
            defaultValue={defaultValue}
            {...getFieldProps(name)}
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          />
        );
      case 'description':
        return (
          <TextField
            fullWidth
            size="small"
            multiline
            inputProps={{ maxLength: maxLength ? maxLength : null }}
            maxRows={5}
            label={label}
            defaultValue={defaultValue}
            {...getFieldProps(name)}
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <TextField
            select
            size="small"
            fullWidth
            label={label}
            {...getFieldProps(name)}
            SelectProps={{ native: true }}
            error={Boolean(touched[name] && errors[name])}
            helperText={touched[name] && errors[name]}
            disabled={disabled}
          >
            <option value={defaultValue ? selectObj : 'Сонгоно уу'} />
            {data?.map((option) => {
              return (
                <option key={option.id || option.code} value={option.id || option.code}>
                  {option[selectField] || option.value || option.name || option.description}
                </option>
              );
            })}
          </TextField>
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label={label}
              disableCloseOnSelect={false}
              inputFormat="yyyy/MM/dd"
              disableFuture={disableFuture}
              value={formik.values[name] ? formik.values[name] : 'Өдөр сонгоно уу'}
              onChange={(date) => setFieldValue(name, date)}
              renderInput={(params) => <TextField {...params} size="small" fullWidth sx={{ mb: 3 }} />}
              disabled={disabled}
            />
          </LocalizationProvider>
        );
      case 'numeric':
        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumberFormatCustom(prefix),
            }}
            variant="standard"
            disabled={disabled}
          />
        );
      case 'novalid':
        return <TextField fullWidth label={label} {...getFieldProps(name)} disabled={disabled} />;
      default:
        console.log(`Undefined Type Please Insert Valid Type in WidInput`);
        return <></>;
    }
  };

  return renderInput();
}
