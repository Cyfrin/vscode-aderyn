<script lang="ts">
    const MESSAGES = [
        'By default, Aderyn will automatically turn on if the root of the workspace is a Hardhat/Foundry/Soldeer project.',

        "If it's a nested project, please run the <b>Aderyn: Initialize Config File</b> command to create an <b>aderyn.toml</b> file and replace the root field (if necessary)",

        'Remember to start, restart or stop the Aderyn diagnostics server as and when necessary using the commands shown below.',

        "Return to this page if any commands don't work because by opening this page, Aderyn will run a health checker that will make sure Aderyn is in a healthy and usable state.",
    ];
</script>

<div class="mb-8">
    <p class="font-light mt-4">
        Press
        <kbd class="px-2 py-1 text-xs font-semibold rounded">Cmd</kbd>
        /
        <kbd class="px-2 py-1 text-xs font-semibold rounded">Ctrl</kbd>
        +
        <kbd class="px-2 py-1 text-xs font-semibold rounded">Shift</kbd>
        +
        <kbd class="px-2 py-1 text-xs font-semibold rounded">P</kbd>
        and choose
        <span class="font-bold">"Aderyn: Welcome on board"</span> to return to this guide.
    </p>
</div>

<div class="m-4 mt-4 mb-4 p-6">
    <div class="mb-4">
        <h1 class="text-2xl font-bold text-center">How to Use</h1>
        <div class="w-16 h-1 mx-auto mt-2"></div>
    </div>

    <div class="flex justify-center">
        <ul class="space-y-4 mt-6 w-3xl">
            {#each MESSAGES as step, i}
                <li class="flex items-start p-4 hover:shadow-md transition-shadow">
                    <div class="flex-shrink-0 mr-4">
                        <div
                            class="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold"
                        >
                            {i + 1}
                        </div>
                    </div>
                    <div class="">
                        {@html step}
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>
