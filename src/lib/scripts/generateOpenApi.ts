import fs from 'fs';
import path from 'path';
import { parse } from 'comment-parser';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

/**
 * Generate OpenAPI specification by scanning route files.
 * @param {string} dir - Directory to scan.
 * @returns {object} OpenAPI-compliant JSON object.
 */
export function generateOpenApiSpec(dir: string) {
	const openApiSpec = {
		openapi: '3.0.0',
		info: { title: 'API Documentation', version: '1.0.0' },
		paths: {}
	};

	scanDirectory(dir, openApiSpec.paths);

	return openApiSpec;
}

/**
 * Recursively scan the directory and add routes to the OpenAPI paths.
 * @param {string} dir - Directory path to scan.
 * @param {object} paths - Paths object to populate.
 */
function scanDirectory(dir: string, paths: Record<string, any>) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			scanDirectory(filePath, paths);
		} else if (file.match(/\+server\.(ts|js)|page\.server\.(ts|js)$/)) {
			const routePath = getRoutePath(filePath);
			console.log(`Scanning route file: ${filePath}`);
			paths[routePath] = {
				...(paths[routePath] || {}),
				...parseFileForHandlers(filePath)
			};
		}
	}
}

/**
 * Convert file path to route path format for OpenAPI documentation.
 * @param {string} filePath - Path of the route file.
 * @returns {string} - Route path in OpenAPI format.
 */
function getRoutePath(filePath: string) {
	const route = filePath
		.replace(/^src\/routes/, '')
		.replace(/\+server\.(ts|js)|page\.server\.(ts|js)$/, '')
		.replace(/\[([^\]]+)\]/g, '{$1}');
	return route || '/';
}

/**
 * Parse a file to find HTTP methods and create an OpenAPI-compliant path object.
 * @param {string} filePath - Path to the file.
 * @returns {object} - OpenAPI path object for detected HTTP methods.
 */
function parseFileForHandlers(filePath: string) {
	const fileContent = fs.readFileSync(filePath, 'utf8');
	const handlers: Record<HttpMethod, any> = {
		GET: undefined,
		POST: undefined,
		PUT: undefined,
		PATCH: undefined,
		DELETE: undefined,
		OPTIONS: undefined,
		HEAD: undefined
	};

	// Regular expression to match exported HTTP method functions
	const methodRegex =
		/export\s+(const|async\s+function)\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)/g;
	let match;

	while ((match = methodRegex.exec(fileContent)) !== null) {
		const method = match[2] as HttpMethod;
		console.log(`Detected ${method} handler in ${filePath}`);
		const jsDoc: { description?: string; example?: any; responses?: Record<string, string> } =
			extractJsDoc(fileContent, match.index);
		handlers[method] = {
			summary: jsDoc.description || `Handler for ${method} request`,
			requestBody:
				method === 'POST' || method === 'PUT'
					? {
							content: {
								'application/json': {
									schema: { type: 'object', properties: { key: { type: 'string' } } },
									example: jsDoc.example || { key: 'value' }
								}
							}
						}
					: undefined,
			responses: {
				'200': {
					description: jsDoc.responses?.['200'] || 'Successful response',
					content: { 'application/json': { example: { message: 'Success' } } }
				},
				'400': {
					description: jsDoc.responses?.['400'] || 'Bad request',
					content: { 'application/json': { example: { error: 'Invalid JSON format' } } }
				},
				'500': {
					description: jsDoc.responses?.['500'] || 'Server error',
					content: { 'application/json': { example: { error: 'Internal server error' } } }
				}
			}
		};
	}

	return handlers;
}

/**
 * Extract JSDoc comments from the file content.
 * @param {string} fileContent - Content of the file.
 * @param {number} position - Position of the matched method.
 * @returns {object} - Parsed JSDoc object.
 */
function extractJsDoc(fileContent: string, position: number) {
	const lines = fileContent.substring(0, position).split('\n');
	const jsDocLines = [];
	for (let i = lines.length - 1; i >= 0; i--) {
		const line = lines[i].trim();
		if (line.startsWith('/**')) break;
		jsDocLines.unshift(line);
	}
	const jsDocContent = jsDocLines.join('\n');
	const parsed = parse(jsDocContent);
	return parsed.length ? parsed[0] : {};
}

// Generate the OpenAPI specification and write it to a file
const openApiSpec = generateOpenApiSpec('src/routes');
const outputPath = path.join('static', 'openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));
console.log(`OpenAPI specification generated at ${outputPath}`);
