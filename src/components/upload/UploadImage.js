import { useState, useCallback } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { UploadSingleFile, UploadBanner } from 'src/components/upload';

const UploadImage = ({ name, handleClick, label, file, avatar, profile, staticPreview }) => {
  const [preview, setPreview] = useState(null);
  const [icon, setIcon] = useState(false);
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
      setIcon(true);
      handleClick(name, inputFile);
    } else {
      handleClick(name, file);
    }
  }, []);
  return (
    <div>
      <>
        {!avatar === true ? (
          <>
            <LabelStyle>{label}</LabelStyle>
            {profile ? (
              <UploadSingleFile file={file} disabled={true} />
            ) : (
              <UploadSingleFile onDrop={uploadHandler} file={preview === null ? file : preview} />
            )}
          </>
        ) : (
          <div>
            <UploadBanner onDrop={uploadHandler} file={preview === null ? file : preview} icon={icon} />
          </div>
        )}
      </>
    </div>
  );
};

export default UploadImage;
