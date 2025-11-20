<script lang="ts">
    import AuthForm from "$lib/components/AuthForm.svelte";

    let { form } = $props();
</script>

<svelte:head>
  <title>Daftar</title>
</svelte:head>

<AuthForm isRegistration={true} {form}/>