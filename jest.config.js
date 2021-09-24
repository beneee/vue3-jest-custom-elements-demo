module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@vaadin|@polymer|@lit|lit)).+\\.js$',
  ],
  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('vaadin-'),
      },
    },
  },
}
