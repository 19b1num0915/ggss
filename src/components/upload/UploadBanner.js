import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
//
import Image from '../Image';
import Iconify from '../Iconify';
import RejectionFiles from './RejectionFiles';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
}));

const DropZoneStyle = styled('div')({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
});

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  // transition: theme.transitions.create('opacity', {
  //   easing: theme.transitions.easing.easeInOut,
  //   duration: theme.transitions.duration.shorter,
  // }),
}));

// ----------------------------------------------------------------------

UploadBanner.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function UploadBanner({ error, file, icon, helperText, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <>
      <RootStyle
        sx={{
          ...((isDragReject || error) && {
            borderColor: 'error.light',
          }),
          ...sx,
        }}
      >
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(file && {
              padding: '12% 0',
            }),
          }}
        >
          <input disabled {...getInputProps()} />

          {file && (
            <Image
              alt="file preview"
              src={isString(file) ? file : file.preview}
              sx={{
                top: 8,
                left: 8,
                borderRadius: 1,
                position: 'absolute',
                width: 'calc(100% - 16px)',
                height: 'calc(100% - 16px)',
              }}
            />
          )}
          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0.1,
                color: 'common.white',
                bgcolor: 'grey.900',
              }),
            }}
          >
            {!icon && <Iconify icon={'ic:round-add-a-photo'} sx={{ width: 36, height: 36, mb: 1 }} />}
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {helperText && helperText}

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
    </>
  );
}
