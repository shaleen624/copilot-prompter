#!/usr/bin/env ts-node
import { config } from './src/config/config';

console.log('🔍 Debug Configuration:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API_DOCS_ENABLED env var:', process.env.API_DOCS_ENABLED);
console.log('config.api.docsEnabled:', config.api.docsEnabled);
console.log('config.api.docsPath:', config.api.docsPath);
console.log('Type of API_DOCS_ENABLED:', typeof process.env.API_DOCS_ENABLED);
console.log('Strict equality test:', process.env.API_DOCS_ENABLED === 'true');
