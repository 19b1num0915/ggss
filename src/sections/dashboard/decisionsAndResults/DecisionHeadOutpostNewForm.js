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
    outside: Yup.string().required('Бүртгэлийн дугаар оруулах шаардлагатай'),
    inside: Yup.string().required('Овог оруулах шаардлагатай'),
    conclusion: Yup.string().required('Нэр оруулах шаардлагатай'),
    decision: Yup.string().required('Үндсэн захиргаа оруулах шаардлагатай')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
        outside: currentUser?.personalNo || '',
        inside: currentUser?.surName || '',
        conclusion: currentUser?.givenName || '',
        decision: currentUser?.administration || '',
    },
    validationSchema: NewPersonnelSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
          try {
            const response = await axios.post('/decisionHeadBorderpost/post',values);
              resetForm();
              setSubmitting(false);
              enqueueSnackbar(!isEdit ? 'Амжилттай нэмэгдлээ!' : 'Амжилттай засагдлаа!');
              navigate('/dashboard/decision/headoutpost');
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
                    label="Гадаад"
                    {...getFieldProps('outside')}
                    error={Boolean(touched.outside && errors.outside)}
                    helperText={touched.outside && errors.outside}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Дотоод"
                    {...getFieldProps('inside')}
                    error={Boolean(touched.inside && errors.inside)}
                    helperText={touched.inside && errors.inside}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Дүгнэлт"
                    {...getFieldProps('conclusion')}
                    error={Boolean(touched.conclusion && errors.conclusion)}
                    helperText={touched.conclusion && errors.conclusion}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Шийдвэр"
                    {...getFieldProps('decision')}
                    error={Boolean(touched.decision && errors.decision)}
                    helperText={touched.decision && errors.decision}
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
