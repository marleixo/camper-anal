import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const directory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: directory });
const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')];
const config = [
	{ ignores: ['.next/**', 'node_modules/**', 'coverage/**'] },
	...eslintConfig,
	{ files: ['next-env.d.ts'], rules: { '@typescript-eslint/triple-slash-reference': 'off' } },
];
export default config;