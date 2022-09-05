import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import axios from '../../../utils/axios';
import { Form, FormikProvider, useFormik } from 'formik';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField } from '@mui/material';

// ----------------------------------------------------------------------

PersonnelNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function PersonnelNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();

  const NewPersonnelSchema = Yup.object().shape({
    personalNo: Yup.string().required('Бүртгэлийн дугаар оруулах шаардлагатай'),
    surName: Yup.string().required('Овог оруулах шаардлагатай'),
    givenName: Yup.string().required('Нэр оруулах шаардлагатай'),
    administration: Yup.string().required('Үндсэн захиргаа оруулах шаардлагатай'),
    nationality: Yup.string().required('Угсаа оруулах шаардлагатай'),
    degree: Yup.string().required('Цол оруулах шаардлагатай'),
    position: Yup.string().required('Албан тушаал оруулах шаардлагатай'),
    birthAt: Yup.string().required('Төрсөн огноо оруулах шаардлагатай'),
    comeDetachment: Yup.string().required('Отрядод ирсэн огноо оруулах шаардлагатай'),
    comeZastav: Yup.mixed().required('Заставт ирсэн огноо оруулах шаардлагатай'),
    outZastav: Yup.mixed().required('Заставаас явсан огноо оруулах шаардлагатай'),
    education: Yup.mixed().required('Боловсрол оруулах шаардлагатай'),
    profession: Yup.mixed().required('Мэргэжил оруулах шаардлагатай'),
    langSkill: Yup.mixed().required('Хэлний мэдлэг оруулах шаардлагатай'),
    langLevel: Yup.mixed().required('Хэлний түвшин оруулах шаардлагатай'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      personalNo: currentUser?.personalNo || '',
      surName: currentUser?.surName || '',
      givenName: currentUser?.givenName || '',
      administration: currentUser?.administration || '',
      nationality: currentUser?.nationality || '',
      degree: currentUser?.degree || '',
      position: currentUser?.position || '',
      birthAt: currentUser?.birthAt || '',
      comeDetachment: currentUser?.comeDetachment || '',
      comeZastav: currentUser?.comeZastav || '',
      outZastav: currentUser?.outZastav || '',
      education: currentUser?.education || '',
      profession: currentUser?.profession,
      langSkill: currentUser?.langSkill || '',
      langLevel: currentUser?.langLevel || '',
    },
    validationSchema: NewPersonnelSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
          try {
            const response = await axios.post('/user/post',values);
              resetForm();
              setSubmitting(false);
              enqueueSnackbar(!isEdit ? 'Амжилттай нэмэгдлээ!' : 'Амжилттай засагдлаа!');
              navigate('/dashboard/postregistration/personnel');
          } catch (error) {
            enqueueSnackbar(error.message,{ variant: 'error' });
            console.error('error',error);
            setSubmitting(false);
            setErrors(error);
          }
      } catch (error) {
        console.error('error',error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });
  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file),
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Бүртгэлийн дугаар"
                    {...getFieldProps('personalNo')}
                    error={Boolean(touched.personalNo && errors.personalNo)}
                    helperText={touched.personalNo && errors.personalNo}
                  />
                  <TextField
                    fullWidth
                    label="Овог"
                    {...getFieldProps('surName')}
                    error={Boolean(touched.surName && errors.surName)}
                    helperText={touched.surName && errors.surName}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Нэр"
                    {...getFieldProps('givenName')}
                    error={Boolean(touched.givenName && errors.givenName)}
                    helperText={touched.givenName && errors.givenName}
                  />
                  <TextField
                    // select
                    fullWidth
                    label="Үндсэн захиргаа"
                    placeholder="Үндсэн захиргаа"
                    {...getFieldProps('administration')}
                    // SelectProps={{ native: true }}
                    error={Boolean(touched.administration && errors.administration)}
                    helperText={touched.administration && errors.administration}
                  >
                    {/* <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))} */}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Угсаа"
                    {...getFieldProps('nationality')}
                    error={Boolean(touched.nationality && errors.nationality)}
                    helperText={touched.nationality && errors.nationality}
                  />
                  <TextField
                    fullWidth
                    label="Цол"
                    {...getFieldProps('degree')}
                    error={Boolean(touched.degree && errors.degree)}
                    helperText={touched.degree && errors.degree}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Албан тушаал"
                    {...getFieldProps('position')}
                    error={Boolean(touched.position && errors.position)}
                    helperText={touched.position && errors.position}
                  />
                   <TextField
                    fullWidth
                    label="Төрсөн огноо"
                    {...getFieldProps('birthAt')}
                    error={Boolean(touched.birthAt && errors.birthAt)}
                    helperText={touched.birthAt && errors.birthAt}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Хэлний мэдлэг"
                    {...getFieldProps('langSkill')}
                    error={Boolean(touched.langSkill && errors.langSkill)}
                    helperText={touched.langSkill && errors.langSkill}
                  />
                  <TextField
                    fullWidth
                    label="Хэлний түвшин"
                    {...getFieldProps('langLevel')}
                    error={Boolean(touched.langLevel && errors.langLevel)}
                    helperText={touched.langLevel && errors.langLevel}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Боловсрол"
                    {...getFieldProps('education')}
                    error={Boolean(touched.education && errors.education)}
                    helperText={touched.education && errors.education}
                  />
                  <TextField
                    fullWidth
                    label="Мэргэжил"
                    {...getFieldProps('profession')}
                    error={Boolean(touched.profession && errors.profession)}
                    helperText={touched.profession && errors.profession}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Заставт ирсэн огноо"
                    {...getFieldProps('comeZastav')}
                    error={Boolean(touched.comeZastav && errors.comeZastav)}
                    helperText={touched.comeZastav && errors.comeZastav}
                  />
                  <TextField
                    fullWidth
                    label="Заставаас явсан огноо"
                    {...getFieldProps('outZastav')}
                    error={Boolean(touched.outZastav && errors.outZastav)}
                    helperText={touched.outZastav && errors.outZastav}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Отрядод ирсэн огноо"
                    {...getFieldProps('comeDetachment')}
                    error={Boolean(touched.comeDetachment && errors.comeDetachment)}
                    helperText={touched.comeDetachment && errors.comeDetachment}
                  />
                </Stack>
               
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Шинэ бичлэг нэмэх' : 'Засах'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
