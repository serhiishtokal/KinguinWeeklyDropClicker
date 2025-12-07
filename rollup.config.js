import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isProduction = process.env.BUILD === 'production';

// Tampermonkey header with version from package.json
const header = `// ==UserScript==
// @name         Kinguin Auto-Clicker
// @namespace    https://github.com/user/kinguin-clicker
// @version      ${pkg.version}
// @description  Automates Kinguin.net checkout, game pages, and dashboard subscriptions
// @author       ${pkg.author || 'Anonymous'}
// @match        https://www.kinguin.net/checkout*
// @match        https://www.kinguin.net/category/*/product/*
// @match        https://www.kinguin.net/category/*
// @match        https://www.kinguin.net/dashboard/subscriptions*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinguin.net
// @grant        none
// @run-at       document-idle
// ==/UserScript==

`;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/kinguin-clicker.user.js',
    format: 'iife',
    name: 'KinguinClicker',
    banner: header,
    sourcemap: !isProduction ? 'inline' : false,
  },
  plugins: [
    resolve(),
    commonjs(),
    isProduction && terser({
      format: {
        comments: function(node, comment) {
          return comment.value.includes('==UserScript==') || 
                 comment.value.includes('==/UserScript==') ||
                 comment.value.startsWith(' @');
        }
      },
      mangle: false,
      compress: {
        drop_console: false,
      }
    }),
  ].filter(Boolean),
  watch: {
    include: 'src/**',
    clearScreen: false,
  }
};