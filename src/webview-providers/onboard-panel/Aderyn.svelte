<script lang="ts">
    import { onMount } from 'svelte';

    type ExtensionMessage = {
        type: 'INSTALLATION_ERROR' | 'INSTALLATION_SUCCESS' | 'COMMAND_GUIDE' | null;
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
        return window.addEventListener(
            'message',
            ({ data }: { data: ExtensionMessage }) => {
                if (
                    data.type == 'INSTALLATION_ERROR' ||
                    data.type == 'INSTALLATION_SUCCESS'
                ) {
                    message = data;
                }
            },
        );
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
            message?.type == 'INSTALLATION_ERROR'
                ? 'text-red-500'
                : message?.type == 'INSTALLATION_SUCCESS'
                  ? 'text-green-500'
                  : null,
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
        {:else if message.type == 'INSTALLATION_ERROR'}
            <button onclick={tryAgainClicked}>Try again</button>
        {/if}
    </div>
</div>
