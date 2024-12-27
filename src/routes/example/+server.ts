import type { RequestHandler } from './$types.ts';

/**
 * GET request handler for the /example endpoint.
 *
 * @description
 * Responds with a JSON message confirming the endpoint is active.
 * This is primarily used for testing purposes to ensure the endpoint is accessible.
 *
 * @returns {Response} - JSON response with a status of 200 and a greeting message.
 *
 * @example
 * // Sample GET request to this endpoint:
 * fetch('/example', {
 *   method: 'GET'
 * }).then(response => response.json())
 *   .then(data => console.log(data));
 */
export const GET: RequestHandler = async () => {
	return new Response(JSON.stringify({ message: 'Hello from GET!' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};

/**
 * POST request handler for the /example endpoint.
 *
 * @description
 * Accepts JSON data in the request body and responds with a message confirming data receipt.
 * If the JSON is improperly formatted or missing, a 400 error response is returned.
 *
 * @param {RequestEvent} event - The event object containing the request.
 * @returns {Response} - JSON response with:
 *   - status 200 and the received data if successful.
 *   - status 400 if the JSON format is invalid or missing.
 *
 * @example
 * // Sample POST request to this endpoint:
 * fetch('/example', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ key: 'value' })
 * }).then(response => response.json())
 *   .then(data => console.log(data));
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		return new Response(JSON.stringify({ message: 'Received data', data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/**
 * PUT request handler for the /example endpoint.
 *
 * @description
 * Accepts JSON data in the request body and responds with a message confirming data update.
 * If the JSON is improperly formatted or missing, a 400 error response is returned.
 *
 * @param {RequestEvent} event - The event object containing the request.
 * @returns {Response} - JSON response with:
 *   - status 200 and the updated data if successful.
 *   - status 400 if the JSON format is invalid or missing.
 *
 * @example
 * // Sample PUT request to this endpoint:
 * fetch('/example', {
 *   method: 'PUT',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ key: 'newValue' })
 * }).then(response => response.json())
 *   .then(data => console.log(data));
 */
export const PUT: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		return new Response(JSON.stringify({ message: 'Updated data', data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

/**
 * DELETE request handler for the /example endpoint.
 *
 * @description
 * Responds with a message confirming data deletion.
 *
 * @returns {Response} - JSON response with a status of 200 and a deletion confirmation message.
 *
 * @example
 * // Sample DELETE request to this endpoint:
 * fetch('/example', {
 *   method: 'DELETE'
 * }).then(response => response.json())
 *   .then(data => console.log(data));
 */
export const DELETE: RequestHandler = async () => {
	return new Response(JSON.stringify({ message: 'Deleted data' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
