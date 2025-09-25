<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Action } from '@sveltejs/kit';
	import type { ActionData as LoginActionData } from '../../routes/login/$types';

	type ActionData = LoginActionData & {
		name?: string;
		email?: string;
		password?: string;
		passwordConfirmation?: string;
	};

	interface ComponentsProps {
		isRegistration: boolean;
		form: ActionData;
	}

	let { isRegistration, form }: ComponentsProps = $props();
</script>

<div class="flex w-full items-center justify-between">
	<div class="flex w-1/2 justify-center">
		<h1 class="text-primary text-8xl font-semibold">RenzMart</h1>
	</div>
	<div class="flex w-1/2 justify-center">
		<form action="" method="POST">
			{#if form && form.errors?.length}
				{#each form.errors as error}
					<h2 class="flex justify-center items-center text-xl font-normal w-full h-[40px] rounded-lg bg-red-500 text-gray-100">{error}</h2>
				{/each}
			{/if}
			<div
				class="flex max-w-[400px] min-w-[400px] flex-col rounded-lg border-t-2 border-t-blue-700 px-8 py-8 shadow-2xl"
			>
				<h1 class="text-center text-3xl font-normal">{isRegistration ? 'Register' : 'Login'}</h1>
				<div class="flex flex-col items-center pt-8">
					<div class="flex w-full flex-col justify-center pb-12">
						{#if isRegistration}
							<label for="Name" class="font-base text-xl">Name</label>
							<input 
                                type="text" 
                                name="name"
                                value={form?.name || ""} 
                                class="input-field" 
                                placeholder="Name..." />
						{/if}
						<label for="Email">Email</label>
						<input 
                            type="email" 
                            name="email"
                            value={form?.email || ""} 
                            class="input-field" 
                            placeholder="Email..." />
						<label for="Password">Password</label>
						<input
							type="password"
							name="password"
							value={form?.password || ''}
							class="input-field"
							placeholder="Password..."
						/>
						{#if isRegistration}
							<label for="Password">Confirm Password</label>
							<input
								type="password"
								name="passwordConfirmation"
                                value={form?.passwordConfirmation || ""}
								class="input-field"
								placeholder="Password..."
							/>
						{/if}
					</div>
					<div class="flex w-full flex-col items-center pb-2">
						<Button isSubmit={true} type="submit">{isRegistration ? 'Register' : 'Login'}</Button>
					</div>
					<div class="flex flex-row justify-center gap-1 pt-2">
						{#if isRegistration}
							<p class="text-base font-normal">Already have account?</p>
							<a href="/login" class="text-primary">Log in</a>
						{:else}
							<p class="text-base font-normal">Don't have account?</p>
							<a href="/register" class="text-primary">Sign up</a>
						{/if}
					</div>
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.text-primary {
		color: #0443f2;
	}

	input:focus {
		outline: #42b549;
		box-shadow: none;
	}

	.input-field {
		font-size: 16px;
		padding: 6px 12px 6px 12px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
	}

	label {
		padding: 12px 0;
	}
</style>
