import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

svgLoader({
  svgoConfig: {
    multipass: true
  }
})

export default defineConfig({
  base: process.env.ELECTRON=="true" ? './' : ".",
  plugins: [vue(), svgLoader()],
})