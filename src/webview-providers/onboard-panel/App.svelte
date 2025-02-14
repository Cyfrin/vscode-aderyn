<script>
    import Aderyn from './Aderyn.svelte';
    import CommandBook from './CommandBook.svelte';
    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
</script>

<div class="flex flex-col justify-between h-svh pb-8">
    <div class="flex flex-col items-center p-4">
        <Header />
        <Aderyn />
        <CommandBook />
    </div>
    <Footer />
</div>
