module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // ... các plugin khác nếu có ...
    ['@babel/plugin-transform-private-methods', { loose: true }],
    'react-native-reanimated/plugin', // PHẢI LÀ DÒNG CUỐI CÙNG
  ],
};