import { css } from 'styled-components/macro';

const fonts = css`
  @font-face {
    font-family: 'Pixelfy';
    src: url('../fonts/PixelifySans-Regular.ttf') format('ttf');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Pixelfy';
    src: url('../fonts/PixelifySans-SemiBold.ttf') format('ttf');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Pixelfy';
    src: url('../fonts/PixelifySans-Bold.ttf') format('ttf');
    font-weight: 900;
    font-style: normal;
  }
`;

export default fonts;