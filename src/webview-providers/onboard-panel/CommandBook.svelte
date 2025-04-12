<script lang="ts">
    import { onMount } from 'svelte';

    let commandGuide = $state({});

    onMount(() => {
        return window.addEventListener('message', ({ data }) => {
            if (data.type == 'COMMAND_GUIDE') {
                commandGuide = JSON.parse(data.msg);
            }
        });
    });
</script>

<div class="m-4 mt-0 mb-4 rounded-lg p-6">
    <div class="mb-4">
        <h1 class="text-2xl font-bold text-center">Commands</h1>
        <div class="w-16 h-1 mx-auto mt-2"></div>
    </div>
    <div class="mt-6 flex flex-col items-center">
        <div class="w-3xl overflow-hidden">
            <table class="w-3xl border-collapse">
                <tbody>
                    {#each Object.entries(commandGuide) as [command, purpose], _i}
                        <tr>
                            <td class="py-3 px-4 border-b">
                                Aderyn: {command}
                            </td>
                            <td class="py-3 px-4 border-b">
                                {@html purpose}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
    <div class="pt-4 flex justify-center items-center">
        <p class="font-light mt-4">
            Press
            <kbd class="px-2 py-1 text-xs font-semibold rounded">Cmd</kbd>
            /
            <kbd class="px-2 py-1 text-xs font-semibold rounded">Ctrl</kbd>
            +
            <kbd class="px-2 py-1 text-xs font-semibold rounded">Shift</kbd>
            +
            <kbd class="px-2 py-1 text-xs font-semibold rounded">P</kbd>
            to access these comamnds.
        </p>
    </div>
</div>

<div class="mt-8 text-center">
    <p class="mb-2">Need more information?</p>
    <a
        href="https://cyfrin.gitbook.io/cyfrin-docs/aderyn-vs-code/what-is-aderyn-vs-code-extension"
        class="inline-flex items-center text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
    >
        View the full documentation
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
        </svg>
    </a>
</div>
