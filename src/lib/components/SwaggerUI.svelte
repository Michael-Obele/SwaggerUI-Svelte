<script lang="ts">
	import SwaggerUI from 'swagger-ui';
	import 'swagger-ui/dist/swagger-ui.css';
	import { onMount } from 'svelte';

	export let url: string;
	export let options: Record<string, any> = {};

	onMount(() => {
		SwaggerUI({
			dom_id: '#swagger-ui',
			url,
			...options
		});
	});
</script>

<div id="swagger-ui"></div>
