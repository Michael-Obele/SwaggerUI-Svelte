# Swagger UI Svelte

> 🚨 **DEPRECATED** 🚨
>
> This repository is deprecated in favour of a new and improved project: [sveltekit-api-gen](https://github.com/Michael-Obele/sveltekit-api-gen).
>
> Please migrate to the replacement package: [sveltekit-openapi-generator](https://www.npmjs.com/package/sveltekit-openapi-generator) and visit the [project homepage](https://sveltekit-openapi-generator.netlify.app/).
>
> For migration instructions and continued updates, see the new project's GitHub repository.

## Migration Guide

This project has been superseded by a more robust and automated solution. The new project uses a Vite plugin to automatically generate OpenAPI specs from SvelteKit server endpoints using JSDoc `@swagger` annotations, offering features like Hot Module Replacement, TypeScript support, SvelteKit-native route handling, shared schemas, and seamless Swagger UI integration.

### Key Differences
- **Automation**: No need for manual generation scripts; the plugin auto-generates specs during development and build.
- **Annotations**: Document endpoints directly in your server files with `@swagger` JSDoc blocks.
- **Integration**: Better support for SvelteKit features like route parameters, groups, and optional segments.
- **Modern Features**: Includes HMR, virtual modules, and build-time output.

### How to Migrate
1. Install the new package: `npm install -D sveltekit-openapi-generator`.
2. Configure the Vite plugin in your `vite.config.js` (see the [new project's README](https://github.com/Michael-Obele/sveltekit-api-gen) for details).
3. Replace manual generation with `@swagger` annotations in your `+server.ts/js` files.
4. Remove old dependencies and scripts related to this library.

For full instructions, visit the [new project's GitHub repository](https://github.com/Michael-Obele/sveltekit-api-gen).

A Svelte library that auto-generates OpenAPI (Swagger) documentation for HTTP handlers in SvelteKit projects. This library scans your project’s routes to create a dynamic, accessible Swagger UI page that documents your API endpoints.

## Installation

Install the package via npm:

```bash
npm install @obele-michael/swagger-ui-svelte
```

## Usage

After installing the library, you can start using it by configuring your SvelteKit routes and initializing the OpenAPI generator.

### Step 1: Setup HTTP Handlers

Define HTTP method handlers (e.g., `GET`, `POST`) in your SvelteKit route files (`+server.ts/js`). Here’s an example:

```typescript
// src/routes/example/+server.ts

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify({ message: 'Hello from GET!' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	return new Response(JSON.stringify({ message: 'Received data', data }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
```

### Step 2: Generate OpenAPI JSON

Run the OpenAPI generator script to scan your routes and create the `openapi.json` file. The `openapi.json` is generated in the `static` folder of your project:

```bash
bun run generate:openapi
```

This command will create or update `static/openapi.json`, documenting all detected endpoints in your project.

### Step 3: Import and Display Swagger UI

In your SvelteKit app, import and display Swagger UI using the provided component from `@obele-michael/swagger-ui-svelte`:

```svelte
<script lang="ts">
	import { SwaggerUI } from '@obele-michael/swagger-ui-svelte';
</script>

<SwaggerUI url="/openapi.json" />
```

### Step 4: Accessing Swagger Documentation

After setting up, visit your app to view the Swagger UI, which will render the documentation for your API endpoints based on `openapi.json`.

## Features

- **Automatic Route Scanning**: Automatically detects and documents `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, and `OPTIONS` handlers in SvelteKit.
- **OpenAPI-Compliant**: Generates an OpenAPI JSON file compatible with Swagger UI.
- **Customizable UI**: Displays a Swagger UI page to interact with API endpoints.

## Example Project Structure

Here’s a sample project structure to help illustrate the usage:

```plaintext
project-root/
├── src/
│   ├── lib/
│   │   ├── index.ts        # Entry point for the library
│   │   ├── script/
│   │   │   └── generateOpenApi.ts  # Script for OpenAPI generation
│   ├── routes/
│   │   ├── example/
│   │   │   └── +server.ts  # Route file with HTTP handlers
│   └── app.svelte          # Svelte app file
└── static/
    └── openapi.json        # Generated OpenAPI specification
```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/Michael-Obele/swagger-ui-svelte/issues) if you have any suggestions or run into problems.

## License

This project is licensed under the MIT License.
