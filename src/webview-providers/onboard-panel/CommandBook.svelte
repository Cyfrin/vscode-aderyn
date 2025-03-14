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

<div class="m-4 mt-8 rounded-lg p-6">
    <div class="mb-4">
        <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Command Guide</h1>
        <div class="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
    </div>
    
    <div class="mb-8">
        <p class="font-light mt-4 text-gray-600 dark:text-gray-300">
            Remember, to press
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Cmd</kbd>
            /
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl</kbd>
            +
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Shift</kbd>
            
            <kbd class="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">P</kbd>
            and type <span class="font-bold text-blue-600 dark:text-blue-400">"Aderyn: Welcome on board"</span> to return to this guide.
           
        </p>
        <p> Or type one of the following commands to interact with Aderyn:</p>
    </div>
    
    <div class="mt-6 flex flex-col items-center">
        <div class="w-3xl overflow-hidden">
            <table class="w-3xl border-collapse">
                <tbody>
                    {#each Object.entries(commandGuide) as [command, purpose], i}
                        <tr class="{i % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors">
                            <td class="py-3 px-4 border-b border-gray-200 dark:border-gray-600 font-medium text-blue-600 dark:text-blue-400">
                                Aderyn: {command}
                            </td>
                            <td class="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                                {@html purpose}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>

</div>
