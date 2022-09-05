import PropTypes from 'prop-types';
// @mui
import { Box, Typography } from '@mui/material';

HeaderBreadcrumbs.propTypes = {
  links: PropTypes.array,
  action: PropTypes.node,
  heading: PropTypes.string.isRequired,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  sx: PropTypes.object,
};

export default function HeaderBreadcrumbs({ links, action, heading, subHeading, icon, moreLink = '' || [], sx, ...other }) {

  return (
    <Box sx={{ display: 'flex', mt: 1, alignItems: 'center'}}>
      <Box sx={{ flexGrow: 1 }} style={{ paddingLeft: '8px' }}>
        <Typography variant="h4" noWrap style={{ fontSize: '24px', fontStyle: 'normal', fontWeight: '600', letterSpacing: '-0.024em' }}>
          {heading}
        </Typography>
        <Typography variant="subtitle" noWrap style={{ fontSize: '13px', fontStyle: 'normal', fontWeight: '500', color: '#637381', letterSpacing: '-0.016em', marginLeft: '-46px' }}>
          {subHeading}
        </Typography>
      </Box>
      {action && <Box sx={{ flexShrink: 0, paddingRight: '10px' }}>{action}</Box>}
    </Box>
  );
}
