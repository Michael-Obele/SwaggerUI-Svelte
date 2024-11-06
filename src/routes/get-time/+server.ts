import type { RequestHandler } from './$types.ts';

/**
 * GET request handler for /get-time route.
 * Returns the current server time in JSON format.
 */
export const GET: RequestHandler = async () => {
	const currentTime = new Date().toISOString();

	return new Response(JSON.stringify({ message: 'Current server time', time: currentTime }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

/**
 * POST request handler for /get-time route.
 * Accepts a time zone in the request body and returns the time in that zone.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { timeZone } = await request.json();

		// Validate and format the time zone
		const currentTimeInZone = new Date().toLocaleString('en-US', { timeZone });

		return new Response(
			JSON.stringify({
				message: `Current time in ${timeZone}`,
				time: currentTimeInZone
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ message: 'Invalid request. Please provide a valid time zone.' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
