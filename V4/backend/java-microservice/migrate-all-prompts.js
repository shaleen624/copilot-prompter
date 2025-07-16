#!/usr/bin/env node
/**
 * Complete Data Migration Script
 * Extracts ALL remaining prompts from the TypeScript file using a robust parsing approach
 */

const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE = 'http://localhost:8080/api';
const USERNAME = 'admin';
const PASSWORD = 'admin123';

let fetchAPI;
let accessToken = '';

/**
 * Initialize the fetch API
 */
async function initializeFetch() {
    try {
        if (typeof fetch !== 'undefined') {
            fetchAPI = fetch;
        } else {
            const { default: fetch } = await import('node-fetch');
            fetchAPI = fetch;
        }
    } catch (error) {
        console.error('❌ Could not initialize fetch. Please install node-fetch: npm install node-fetch');
        process.exit(1);
    }
}

/**
 * Authenticate with the backend
 */
async function authenticate() {
    try {
        console.log('🔐 Authenticating with backend...');
        
        const response = await fetchAPI(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: USERNAME,
                password: PASSWORD
            })
        });

        if (!response.ok) {
            throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
        }

        const authData = await response.json();
        accessToken = authData.accessToken;
        
        console.log('✅ Authentication successful');
        return accessToken;
    } catch (error) {
        console.error('❌ Authentication failed:', error.message);
        throw error;
    }
}

/**
 * Get existing prompts from the database to avoid duplicates
 */
async function getExistingPrompts() {
    try {
        console.log('📋 Fetching existing prompts from database...');
        
        const response = await fetchAPI(`${API_BASE}/prompts?size=100`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch existing prompts: ${response.status}`);
        }
        
        const data = await response.json();
        const existingTitles = data.content.map(prompt => prompt.title);
        
        console.log(`📊 Found ${existingTitles.length} existing prompts in database`);
        return existingTitles;
        
    } catch (error) {
        console.warn('⚠️  Could not fetch existing prompts, proceeding anyway:', error.message);
        return [];
    }
}

/**
 * Extract prompts from TypeScript file using a more robust approach
 */
function extractAllPromptsFromTypeScript() {
    const filePath = path.join(__dirname, 'src', 'app', 'services', 'in-memory-data.service.ts');
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    console.log('📄 Reading TypeScript file...');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the prompts array content
    const promptsRegex = /const prompts: Prompt\[\] = \[([\s\S]*?)\];[\s\S]*?const copilotTemplates/;
    const promptsMatch = fileContent.match(promptsRegex);
    
    if (!promptsMatch) {
        throw new Error('Could not find prompts array in TypeScript file');
    }
    
    console.log('🔍 Found prompts array in TypeScript file');
    console.log('📊 Parsing individual prompt objects...');
    
    const promptsContent = promptsMatch[1];
    const prompts = [];
    
    // Split by object boundaries - look for },\n  { or },\n    {
    const objectPattern = /\{\s*id:\s*['"]([^'"]+)['"]\s*,[\s\S]*?\}/g;
    let match;
    
    while ((match = objectPattern.exec(promptsContent)) !== null) {
        const objectStr = match[0];
        
        try {
            // Extract individual fields using regex
            const id = extractField(objectStr, 'id');
            const title = extractField(objectStr, 'title');
            const prompt = extractField(objectStr, 'prompt');
            const description = extractField(objectStr, 'description');
            const tags = extractArrayField(objectStr, 'tags');
            const category = extractField(objectStr, 'category');
            const language = extractField(objectStr, 'language');
            const author = extractField(objectStr, 'author');
            
            // Only add if we have essential fields
            if (title && prompt && author) {
                prompts.push({
                    title: title,
                    prompt: prompt,
                    description: description || title,
                    tags: tags || [],
                    category: category || 'General',
                    language: language || 'Any',
                    author: author
                });
            }
        } catch (error) {
            console.warn(`⚠️  Failed to parse prompt with id ${match[1]}: ${error.message}`);
        }
    }
    
    console.log(`✅ Successfully extracted ${prompts.length} prompts from TypeScript file`);
    return prompts;
}

/**
 * Extract a single field value from a TypeScript object string
 */
function extractField(objectStr, fieldName) {
    // Handle both single and double quotes, and template literals
    const patterns = [
        new RegExp(`${fieldName}:\\s*['"]([^'"]*?)['"]`, 's'),
        new RegExp(`${fieldName}:\\s*\`([^\`]*?)\``, 's')
    ];
    
    for (const pattern of patterns) {
        const match = objectStr.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }
    
    return null;
}

/**
 * Extract array field from TypeScript object string
 */
function extractArrayField(objectStr, fieldName) {
    const pattern = new RegExp(`${fieldName}:\\s*\\[([^\\]]*?)\\]`, 's');
    const match = objectStr.match(pattern);
    
    if (match) {
        return match[1]
            .split(',')
            .map(item => item.trim().replace(/['"]/g, ''))
            .filter(item => item.length > 0);
    }
    
    return [];
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetchAPI(`${API_BASE}${endpoint}`, options);
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
}

/**
 * Export prompts to the database
 */
async function exportPrompts(prompts, existingTitles) {
    console.log('\\n📝 Exporting ALL remaining prompts to database...');
    
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        
        // Skip if already exists
        if (existingTitles.includes(prompt.title)) {
            console.log(`⏭️  Skipping existing prompt ${i + 1}/${prompts.length}: "${prompt.title}"`);
            skippedCount++;
            continue;
        }
        
        try {
            console.log(`📤 Exporting prompt ${i + 1}/${prompts.length}: "${prompt.title}"`);
            
            await apiRequest('/prompts', 'POST', prompt);
            successCount++;
            
        } catch (error) {
            console.error(`❌ Failed to export prompt "${prompt.title}": ${error.message}`);
            errorCount++;
        }
        
        // Small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\\n✅ Prompts export completed: ${successCount} new exports, ${skippedCount} skipped, ${errorCount} failed`);
    return { successCount, errorCount, skippedCount };
}

/**
 * Main migration function
 */
async function main() {
    try {
        console.log('🚀 Starting COMPLETE Data Migration');
        console.log('====================================\\n');
        
        // Step 1: Initialize fetch
        await initializeFetch();
        
        // Step 2: Authenticate
        await authenticate();

        // Step 3: Get existing prompts to avoid duplicates
        const existingTitles = await getExistingPrompts();

        // Step 4: Extract all prompts from TypeScript
        const allPrompts = extractAllPromptsFromTypeScript();
        
        console.log(`\\n📊 Migration Plan:`);
        console.log(`   📁 Total prompts in source file: ${allPrompts.length}`);
        console.log(`   📋 Existing prompts in database: ${existingTitles.length}`);
        console.log(`   📤 Prompts to migrate: ${allPrompts.filter(p => !existingTitles.includes(p.title)).length}`);

        // Step 5: Export all prompts
        const promptResults = await exportPrompts(allPrompts, existingTitles);

        // Step 6: Final Summary
        console.log('\\n🎉 COMPLETE Migration Summary');
        console.log('==============================');
        console.log(`📝 New prompts exported: ${promptResults.successCount}`);
        console.log(`⏭️  Existing prompts skipped: ${promptResults.skippedCount}`);
        console.log(`❌ Failed exports: ${promptResults.errorCount}`);
        console.log(`📊 Total prompts processed: ${allPrompts.length}`);
        
        if (promptResults.errorCount === 0) {
            console.log('\\n🎊 ALL prompts successfully migrated! Your database now contains the complete prompt library.');
        } else {
            console.log(`\\n⚠️  ${promptResults.errorCount} items failed to export. Check the error messages above.`);
        }

        // Step 7: Verification
        console.log('\\n🔍 Verification URLs:');
        console.log(`📊 Swagger UI: ${API_BASE}/swagger-ui.html`);
        console.log(`📝 Prompts API: ${API_BASE}/prompts`);
        console.log(`📋 Database should now have: ${existingTitles.length + promptResults.successCount} total prompts`);

    } catch (error) {
        console.error('💥 Migration failed:', error.message);
        console.log('\\n🔧 Troubleshooting:');
        console.log('1. Make sure the backend is running: cd backend && mvn spring-boot:run');
        console.log('2. Check if the backend is accessible at: http://localhost:8080/api');
        console.log('3. Verify admin credentials are correct');
        console.log('4. Check the TypeScript file format and structure');
        process.exit(1);
    }
}

// Run the migration
if (require.main === module) {
    main();
}

module.exports = { main, extractAllPromptsFromTypeScript };
