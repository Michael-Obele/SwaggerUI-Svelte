import fs from 'fs';
import path from 'path';

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
	const handlers: Record<HttpMethod, any> = {};

	// Regular expression to match exported HTTP method functions
	const methodRegex =
		/export\s+(const|async\s+function)\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)/g;
	let match;

	while ((match = methodRegex.exec(fileContent)) !== null) {
		const method = match[2] as HttpMethod;
		console.log(`Detected ${method} handler in ${filePath}`);
		handlers[method.toLowerCase()] = {
			summary: `Handler for ${method} request`,
			requestBody:
				method === 'POST'
					? {
							content: {
								'application/json': {
									schema: { type: 'object', properties: {} }
								}
							}
						}
					: undefined,
			responses: {
				'200': { description: 'Successful response' },
				'400': { description: 'Bad request' },
				'500': { description: 'Server error' }
			}
		};
	}

	return handlers;
}

// Generate the OpenAPI specification and write it to a file
const openApiSpec = generateOpenApiSpec('src/routes');
const outputPath = path.join('static', 'openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));
console.log(`OpenAPI specification generated at ${outputPath}`);
