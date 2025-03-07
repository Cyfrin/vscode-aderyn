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

<div class="m-2 mt-6">
    <div class="mb-2">
        <h1 class="flex justify-center text-2xl font-bold">Guide</h1>
    </div>
    <div class="mb-8">
        <h2 class="font-light mt-4">
            Remember, to press
            <kbd>Cmd</kbd>
            /
            <kbd>Ctrl</kbd>
            +
            <kbd>Shift</kbd>
            +
            <kbd>P</kbd>
            <b> "Aderyn: Welcome on board" </b> to return to this guide
        </h2>
    </div>
    <div class="mt-4 flex flex-col items-center">
        <table class="table-fixed">
            <tbody>
                {#each Object.entries(commandGuide) as [command, purpose]}
                    <tr>
                        <td>Aderyn: {command}</td>
                        <th>&nbsp;&nbsp;</th>
                        <td>{@html purpose}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
