<script module>
    // @ts-ignore
    let clientVscode = acquireVsCodeApi();
</script>

<script lang="ts">
    let s: string = 'Inside Another Svelte';
</script>

<h3 class="happy text-orange-400">{s}</h3>
<h1>Congratulations !</h1>
<h3 class="text-teal-600 font-sans text-3xl">
    You have completed the <b>Step 1</b> in installation!
</h3>
<img
    src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
    width="300"
    alt="cat typing aggressively meme"
/>

<h3>Step 2 - You need to install aderyn CLI in your system!</h3>
<p class="space-below">It helps the extension by supplying it with diagnostics</p>

<button> Attempt auto-install </button>
Based on the tools, existing in your system we will try downloading the binary in the following
order - npm, brew, cargo binstall, curl

<div></div>

<button
    onclick={() => {
        clientVscode.postMessage({
            command: 'ping',
            value: 'Hello there! How are you?',
        });
    }}
>
    No, I'll do it manually</button
>
We will take you to a website that has all the commands documented! You can try manually

<div></div>

<style>
    .happy {
        border: 20px solid yellowgreen;
    }
</style>
