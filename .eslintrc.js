module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    "semi": 0,
    "quotes":0,
    "quote-props":0,
    "no-undef":0
  }
}
