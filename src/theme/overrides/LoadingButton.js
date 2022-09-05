// ----------------------------------------------------------------------

export default function LoadingButton() {
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          'color': 'white',
          '&.MuiButton-text': {
            '& .MuiLoadingButton-startIconPendingStart': {
              marginLeft: 0
            },
            '& .MuiLoadingButton-endIconPendingEnd': {
              marginRight: 0
            }
          }
        }
      }
    }
  };
}
