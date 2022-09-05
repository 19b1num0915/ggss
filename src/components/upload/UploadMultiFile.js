import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// component
import BlockContent from './BlockContent';
import RejectionFiles from './RejectionFiles';
import MultiFilePreview from './MultiFilePreview';
// 3rd party
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.disabled,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export default function UploadMultiFile({ handleClick, name, setFiles, files, previewFile, setPreviewFile }) {
  const [remove, setRemove] = useState(false);
  const [newData, setNewData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: '.pdf, .docx',
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

  UploadMultiFile.propTypes = {
    error: PropTypes.bool,
    showPreview: PropTypes.bool,
    files: PropTypes.array,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    helperText: PropTypes.node,
    sx: PropTypes.object,
  };

  useEffect(() => {
    let clonedImages = [...previewFile];
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
    setPreviewFile(clonedImages);
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
        setPreviewFile(clonedImages);
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
      <LabelStyle></LabelStyle>
      <DropZoneStyle {...getRootProps()} onDrop={uploadHandler}>
        <input {...getInputProps()} />

        <BlockContent name="Бичиг баримт оруулах" text="Бичиг баримт зөөх эсвэл компьютероос оруулж болно" />
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      <MultiFilePreview
        files={newData}
        showPreview={false}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        previewImage={oldData}
      />
    </Box>
  );
}
