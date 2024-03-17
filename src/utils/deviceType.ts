import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();

// eslint-disable-next-line import/prefer-default-export
export const deviceType = () => {
  const obj = {
    isDesktop: false,
    isMobile: false,
    isTablet: false,
  };

  if (width.value >= 1024) {
    obj.isDesktop = true;
  } else if (width.value < 1024 && width.value > 640) {
    obj.isTablet = true;
  } else {
    obj.isMobile = true;
  }

  return obj;
};
