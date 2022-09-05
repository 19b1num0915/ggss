import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// components
import Image from '../Image';
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';
// 3rd party
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import isString from 'lodash/isString';
let imageUrl = process.env.REACT_APP_TEST_IMAGE;

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

SearchPreview.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function SearchPreview({ error = false, file, preview, helperText, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    ...other,
  });
  useEffect(() => {
  }, [preview]);
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(file && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        <BlockContent name="Зураг оруулах" text=" Зураг зөөх эсвэл компьютероос оруулж болно" />
        {preview ? (
          <Image
            alt="file preview"
            src={preview}
            sx={{
              top: 8,
              left: 8,
              borderRadius: 1,
              position: 'absolute',
              width: 'calc(100% - 16px)',
              height: 'calc(100% - 16px)',
            }}
          />
        ) : (
          <Image
            alt="file preview"
            src={`data:image/png;base64, ${file}`}
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
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  );
}
