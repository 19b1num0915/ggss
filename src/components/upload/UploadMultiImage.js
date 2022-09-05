import { useCallback, useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import BlockContent from './BlockContent';
import RejectionFiles from './RejectionFiles';
import MultiImagePreview from './MultiImagePreview';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.disabled,
  marginBottom: theme.spacing(1),
}));

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${(props) => getColor(props)};`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

const getColor = (props) => {
  if (props.isDragActive) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const UploadMultiImage = ({ handleClick, name, setFiles, files, label, previewImage, setPreviewImage }) => {
  const [remove, setRemove] = useState(false);
  const [newData, setNewData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, isFocused, fileRejections } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      let cloned = [...newData];
      acceptedFiles.map((file) => {
        cloned.push(file);
      });
      cloned.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setNewData(cloned);
    },
  });

  UploadMultiImage.propTypes = {
    files: PropTypes.array,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
  };

  useEffect(() => {
    let clonedImages = [...previewImage];
    setOldData(clonedImages);
    setUpdatedData(clonedImages);
    let cloned = [...files];
    setNewData(cloned);
  }, []);

  useEffect(() => {
    handleClick(name, files);
  }, [files, remove]);
  useEffect(() => {
    setFiles(newData);
  }, [newData]);

  const uploadHandler = useCallback((acceptedFiles) => {
    if (acceptedFiles) {
      let cloned = [...newData];
      cloned.push(acceptedFiles);
      setNewData(cloned);
    }
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
    setOldData([]);
    setNewData([]);

    let clonedImages = [...updatedData];
    clonedImages?.map((image) => {
      image['isDeleted'] = 1;
    });
    setPreviewImage(clonedImages);
  };

  const handleRemove = (file) => {
    if (file.ID) {
      let cloned = [...oldData];
      const index = cloned?.indexOf(file);
      if (index > -1) {
        cloned?.splice(index, 1);
        setOldData(cloned);
      }
      let clonedImages = [...updatedData];
      const indexImage = clonedImages?.indexOf(file);
      if (indexImage) {
        clonedImages?.map((image) => {
          if (image.ID === file.ID) {
            image['isDeleted'] = 1;
          }
        });
        setPreviewImage(clonedImages);
      }
    } else {
      let cloned = [...newData];
      const index = cloned?.indexOf(file);
      if (index > -1) {
        cloned?.splice(index, 1);
        setNewData(cloned);
        setFiles(cloned);
        setRemove(!remove);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <LabelStyle>{label}</LabelStyle>
      <DropZoneStyle {...getRootProps({ isFocused, isDragActive, isDragReject })}>
        <input {...getInputProps()} onDrop={uploadHandler} />
        <BlockContent name="Зураг оруулах " text=" Зураг зөөх эсвэл компьютероос оруулж болно" />
      </DropZoneStyle>
      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      <MultiImagePreview
        files={newData}
        showPreview={true}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        previewImage={oldData}
      />
    </Box>
  );
};

export default UploadMultiImage;
