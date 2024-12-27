# Swagger UI Svelte

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
