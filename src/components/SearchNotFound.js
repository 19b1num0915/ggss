import PropTypes from 'prop-types';
// @mui
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
      Олдсонгүй
      </Typography>
      <Typography variant="body2" align="center">
      илэрц олдсонгүй &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Үг үсгийн алдаа байгаа эсэхийг шалгах эсвэл бүрэн үг ашиглахыг оролдоно уу.
      </Typography>
    </Paper>
  );
}
