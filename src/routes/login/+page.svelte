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

<AuthForm isRegistration={false} form={form ?? defaultForm} />