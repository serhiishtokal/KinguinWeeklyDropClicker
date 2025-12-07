import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const isProduction = process.env.BUILD === 'production';

// Tampermonkey header with version from package.json
const header = `// ==UserScript==
// @name         Kinguin Kings Drop
// @namespace    https://github.com/user/kinguin-kings-drop
// @version      ${pkg.version}
// @description  Automates weekly Kinguin King's Drop subscription workflow
// @author       ${pkg.author || 'Anonymous'}
// @match        *://www.kinguin.net/new-checkout/review*
// @match        *://www.kinguin.net/category/*
// @match        *://www.kinguin.net/app/dashboard/subscription*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinguin.net
// @updateURL    https://github.com/serhiishtokal/KinguinWeeklyDropClicker/raw/refs/heads/main/dist/kinguin-kings-drop.user.js
// @downloadURL  https://github.com/serhiishtokal/KinguinWeeklyDropClicker/raw/refs/heads/main/dist/kinguin-kings-drop.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// ==/UserScript==

`;

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/kinguin-kings-drop.user.js',
    format: 'iife',
    name: 'KinguinKingsDrop',
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