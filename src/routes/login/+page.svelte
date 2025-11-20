<script>
    import AuthForm from "$lib/components/AuthForm.svelte";

    let { form } = $props();

    const defaultForm = {
        success: false,
        errors: [],
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    };
</script>
<svelte:head>
  <title>Masuk</title>
</svelte:head>

<AuthForm isRegistration={false} form={form ?? defaultForm} />