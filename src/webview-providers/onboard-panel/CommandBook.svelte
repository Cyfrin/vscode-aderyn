<script>
    const COMMANDS_GUIDE = {
        'Welcome on board': 'Opens this page',
        'Start server': 'Start the diagnostics server',
        'Stop server': 'Stop the diagnostics server',
        'Restart server': 'Restart the diagnostics server',
        'Initialize sonfig file': 'For advanced use, create <b>aderyn.toml</b>',
    };
</script>

<div class="m-2 mt-6">
    <div class="mb-2">
        <h1 class="flex justify-center text-2xl font-bold">Guide</h1>
    </div>
    <div class="mb-8">
        <h2 class="font-light mt-4">
            Remember, to press
            <kbd>Cmd</kbd>
            <kbd>Shift</kbd>
            <kbd>P</kbd>
            <b> "Aderyn: Welcome on board" </b> to return to this guide
        </h2>
    </div>
    <div class="mt-4 flex flex-col items-center">
        <table class="table-fixed">
            <tbody>
                {#each Object.entries(COMMANDS_GUIDE) as [command, purpose]}
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
