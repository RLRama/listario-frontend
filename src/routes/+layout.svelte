<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { accessToken, user } from '$lib/stores/auth';
	import { getProfile } from '$lib/services/api';
	import { onMount } from 'svelte';
	import { Styles } from '@sveltestrap/sveltestrap';

	onMount(() => {
		if ($accessToken && !$user) {
			getProfile();
		}
	});
</script>

<Styles />

<div class="app">
	<Navbar />
	<main class="container mt-4">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	main {
		flex-grow: 1;
	}
</style>