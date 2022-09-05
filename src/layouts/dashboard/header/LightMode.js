// components
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
import useSettings from '../../../hooks/useSettings';

// ----------------------------------------------------------------------
export default function LightMode() {
  const { themeMode, onToggleMode } = useSettings();
  return (
    <>
      <IconButtonAnimate onClick={onToggleMode} size="large">
          <Iconify icon={themeMode === 'dark' ? "noto:light-bulb" : 'tabler:bulb-off'} width={30} height={30} />
      </IconButtonAnimate>
    </>
  );
}
