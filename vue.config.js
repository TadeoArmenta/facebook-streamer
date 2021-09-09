module.exports = {
    pluginOptions: {
      electronBuilder: {
        preload: 'electron/preload.js',
        // Or, for multiple preload files:
        // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
      }
    }
  }