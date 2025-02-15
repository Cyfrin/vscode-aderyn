<script lang="ts">
    import { onMount } from 'svelte';

    type ExtensionMessage = {
        type: 'Error' | 'Success' | 'CommandGuide' | null;
        msg: string;
    };

    /**
     * Loading state is represented by a null message
     */
    let message = $state<ExtensionMessage | null>(null);

    /**
     *  @description Report progress in the installation process to the frontend
     */
    onMount(() => {
        return window.addEventListener('message', ({ data }) => {
            if (data.type == 'Error' || data.type == 'Success') {
                message = data;
            }
        });
    });

    /**
     *
     * @description Backend will be requested to retry installation process
     * when `Try Again` button is clicked
     *
     */
    function tryAgainClicked() {
        // @ts-ignore
        const vscode = acquireVsCodeApi();

        message = null;
        vscode.postMessage({
            command: 'retry',
            value: 'Retrying Aderyn CLI installation',
        });
    }
</script>

<div class="m-2 mt-6">
    <h1
        class={[
            'm-1 font-bold',
            message?.type == 'Error' ? 'text-red-500' : 'text-green-500',
        ]}
    >
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
