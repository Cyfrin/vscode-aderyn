<script lang="ts">
    import { onMount } from 'svelte';

    // @ts-ignore
    const vscode = acquireVsCodeApi();

    // NOTE - Redifining types as found in message.ts
    type PostMessage = {
        type: 'Error' | 'Success' | null;
        msg: string;
    };

    let message = $state<PostMessage | null>(null);

    let red = $derived(message?.type == 'Error' ? 'text-red-500' : 'text-green-500');

    onMount(() => {
        return window.addEventListener('message', ({ data }) => {
            message = data;
        });
    });

    function tryAgainClicked() {
        message = null;
        setTimeout(() => {
            vscode.postMessage({
                command: 'retry',
                value: 'Retrying Aderyn CLI installation',
            });
        }, 1000); // 1 second for breathing-space
    }
</script>

<div class="m-2 mt-6">
    <h1 class={['m-1 font-bold', red]}>
        {#if !message}
            Please wait patiently while we ensure you have the latest Aderyn CLI (unlike
            the cat above)...
        {:else}
            {message.msg}
        {/if}
    </h1>
    <div class="flex justify-center mt-4">
        {#if !message}
            <div
                class="w-8 h-8 animate-spin border-4 border-[var(--vscode-button-background)] border-l-[var(--vscode-button-foreground)] rounded-full"
            ></div>
        {:else if message.type == 'Error'}
            <button onclick={tryAgainClicked}>Try again</button>
        {/if}
    </div>
</div>
