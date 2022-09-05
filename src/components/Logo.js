import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import Image from 'src/components/Image';
// ----------------------------------------------------------------------

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.any,
};

export default function Logo({ disabledLink = false, sx }) {
  if (disabledLink) {
    return <><Image
      disabledEffect
      style={{ width: '150px', height: '150px' }}
      src={'/logo/logo1.svg'}
    /></>;
  }

  return <RouterLink to="/">{ }</RouterLink>;
}
