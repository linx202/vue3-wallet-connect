import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver, ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from 'path'
import viteCompression from 'vite-plugin-compression'
import nodePolyfills from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core'],
      dts: './auto-import.d.ts',
      eslintrc: {
        enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false。否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
        filepath: './.eslintrc-auto-import.json', // 生成json文件,可以不配置该项，默认就是将生成在根目录
        globalsPropValue: true
      }
    }),
    Components({
      resolvers: [AntDesignVueResolver({ resolveIcons: true }), ElementPlusResolver()]
    }),
    viteCompression()
  ],
  server: {
    port: 3336,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      web3: 'web3/dist/web3.min.js'
    }
  },
  define: {
    'process.env': {},
    'process.versions.electron': false
    // __APP_ENV__: env.APP_ENV
  },
  optimizeDeps: {
    include: ['@vueuse/core']
  },
  build: {
    sourcemap: false,
    target: 'esnext',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue'
        },
        plugins: [
          // nodePolyfills()
        ]
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
