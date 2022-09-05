import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { PageNotFoundIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="Хуудас олдсонгүй">
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
              Уучлаарай, хуудас олдсонгүй!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
            Уучлаарай, бид таны хайж буй хуудсыг олж чадсангүй. Магадгүй та URL хаягаа буруу оруулсан байх? Үг үсгийн алдаагаа шалгахаа мартуузай.
            </Typography>

            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </m.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
            Нүүр хуудас руу очно уу!
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
