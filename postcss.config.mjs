import postcssCustomMedia from 'postcss-custom-media';
import postcssGlobalData from '@csstools/postcss-global-data';

export default {
  plugins: [
    postcssGlobalData({ files: ['./tokens/generated/media.css'] }),
    postcssCustomMedia(),
  ],
};
