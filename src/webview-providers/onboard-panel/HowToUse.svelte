<script lang="ts">
    const MESSAGES = [
        'By default, Aderyn will automatically turn on if the root of the workspace is a Hardhat or a Foundry project.',

        "If it's a nested project, please run the <b>Aderyn: Initialize Config File</b> command to create an <b>aderyn.toml</b> file and replace the root field (if necessary)",

        'Remember to start, restart or stop the Aderyn diagnostics server as and when necessary using the commands shown above.',

        "Return to this page if any commands don't work because by opening this page, Aderyn will run a health checker that will make sure Aderyn is in a healthy and usable state.",
    ];
</script>

<div class="m-4 mt-8 p-6">
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
</div>
