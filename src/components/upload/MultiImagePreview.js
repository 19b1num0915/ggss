import { useEffect } from 'react';
import PropTypes from 'prop-types';
import isString from 'lodash/isString';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import { List, Stack, Button, IconButton, ListItemText, ListItem } from '@mui/material';
// utils
import { fData } from 'src/utils/formatNumber';
//
import Image from '../Image';
import Iconify from '../Iconify';
import { varFade } from '../animate';
let imageUrl = process.env.REACT_APP_TEST_CARIMAGE;

// ----------------------------------------------------------------------

const getFileData = (file) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  files: PropTypes.array,
  showPreview: PropTypes.bool,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
};

export default function MultiFilePreview({ showPreview, files, onRemove, onRemoveAll, previewImage }) {
  useEffect(() => {}, [files, previewImage]);
  const hasFile = files?.length > 0;
  const hasPreview = previewImage?.length > 0;

  const showRemoveButton = () => {
    if (hasPreview) {
      return (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Оруулсан бүх зураг устгах
          </Button>
        </Stack>
      );
    } else if (hasFile) {
      return (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={onRemoveAll}>
            Оруулсан бүх зураг устгах
          </Button>
        </Stack>
      );
    }
  };

  return (
    <>
      <List disablePadding sx={{ ...(hasPreview && { my: 3 }), ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {previewImage?.map((file, index) => {
            if (showPreview) {
              return (
                <ListItem
                  key={index}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Image alt="preview" src={`${imageUrl}/${file.IMAGE_PATH}`} ratio="1/1" />
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={index}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify icon={'eva:file-fill'} sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }} />

                <ListItemText
                  primary={file}
                  secondary={''}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {files?.map((file) => {
            const { key, name, size, preview } = getFileData(file);

            if (showPreview) {
              return (
                <ListItem
                  key={key}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    p: 0,
                    m: 0.5,
                    width: 80,
                    height: 80,
                    borderRadius: 1.25,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'inline-flex',
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Image alt="preview" src={preview} ratio="1/1" />
                  <IconButton
                    size="small"
                    onClick={() => onRemove(file)}
                    sx={{
                      top: 6,
                      p: '2px',
                      right: 6,
                      position: 'absolute',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Iconify icon={'eva:close-fill'} />
                  </IconButton>
                </ListItem>
              );
            }

            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  px: 2,
                  py: 0.75,
                  borderRadius: 0.75,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Iconify icon={'eva:file-fill'} sx={{ width: 28, height: 28, color: 'text.secondary', mr: 2 }} />

                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />

                <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                  <Iconify icon={'eva:close-fill'} />
                </IconButton>
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>

      {showRemoveButton()}
    </>
  );
}
