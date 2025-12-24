// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	build: {
		inlineStylesheets: 'never',
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: 'assets/[name].[ext]',
					chunkFileNames: 'assets/[name].js',
					entryFileNames: 'assets/[name].js'
				}
			}
		}
	}
});
