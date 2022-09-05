import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Tooltip, Container, Typography } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';
import { logo, logoBlack } from 'src/config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  return (
    <Page title="Нэвтрэх">
      <RootStyle style={{ backgroundImage: 'url(/logo/bg-4.jpg)' }}>
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image disabledEffect src={logoBlack} />
                </>
              </Tooltip>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Нэвтрэх
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Нэвтрэх нэр болон нууц үгээ оруулан нэвтэрнэ үү.
                </Typography>
              </Box>
            </Stack>

            <LoginForm />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
