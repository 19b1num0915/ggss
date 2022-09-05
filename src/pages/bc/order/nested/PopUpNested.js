import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormikProvider, Form, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { apiService } from 'src/api/api';
import Automat from './tabs/Automat';

export default function PopUpNested({ popUpName, doAction, confirmModal, data, popAction }) {

  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      accountId: data?.ID,
      fullName: data?.LAST_NAME + ' ' + data?.FIRST_NAME,
      REGISTER_NUMBER: data?.REGISTER_NUMBER,
      CREATED_DATE: data?.CREATED_DATE,
      BALANCE: data?.BALANCE,
      MOBILE_NUMBER: data?.MOBILE_NUMBER,
      LOAN: data?.LOAN,
      description: '',
      isExtension: true,
      totalSpcCount: '',
      totalSpcAmount: '',
      outAmount: '',
      userId: '',
      type: '',
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const obj = {
          invoiceId: data?.ID,
        };
        const url = doAction === 1 ? 'invoice/zeroPayment' : 'invoice/zeroLoss';
        const res = await apiService.postMethod(`/lend-admin/${url}`, obj).catch((error) => {
          enqueueSnackbar(error.response.data.message, { variant: 'error' });
        });
        resetForm();
        setSubmitting(false);
        res.data.status !== 'Failed'
          ? enqueueSnackbar(
            doAction === 2 || doAction === 1
              ? 'Амжилттай тэглэсэн'
              : doAction === 4
                ? 'Амжилттай ангилал солигдлоо'
                : 'Амжилттай цуцлагдлаа'
          ) && popAction(true)
          : enqueueSnackbar(res.data.msgList[0].code, { variant: 'error' });
      } catch (error) {
        setSubmitting(false);
        setErrors(error.message);
      }
    },
  });
  const handleClose = async (reason) => {
    popAction(false);
  };
  const { handleSubmit, isSubmitting } = formik;
  return (
    <div>
      <Dialog open={confirmModal} sx={{ p: 5 }} fullScreen>
        <DialogTitle>{popUpName}</DialogTitle>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogContent>
              <Automat />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()} color="inherit">
                {'Хаах'}
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {'Болсон'}
              </LoadingButton>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </div>
  );
}
