import { useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import SearchPreview from 'src/components/upload/SearchPreview';

const UploadImage = ({ name, handleClick, label, file }) => {
  const [preview, setPreview] = useState(null);
  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
    marginBottom: theme.spacing(1),
  }));
  const uploadHandler = useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      const inputFile = acceptedFiles[0];

      const ImageURL = URL.createObjectURL(inputFile);
      setPreview(ImageURL);
      handleClick(name, inputFile);
    } else {
      handleClick(name, file);
    }
  }, []);

  return (
    <div>
      <LabelStyle>{label}</LabelStyle>
      <SearchPreview onDrop={uploadHandler} file={file} preview={preview} />
    </div>
  );
};

export default UploadImage;
