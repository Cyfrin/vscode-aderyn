<div class="m-4 mt-8  shadow-md p-6">
    <div class="mb-4">
        <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">How to Use</h1>
        <div class="w-16 h-1 mx-auto mt-2"></div>
    </div>
    
    <div class="flex justify-center">
        <ul class="space-y-4 mt-6 w-3xl">
            {#each [
                "Aderyn will start automatically on commonly recognized project structures i.e when a <b>foundry.toml</b> or <b>hardhat.config.ts</b> or <b>aderyn.toml</b> is found in the root of the workspace",
                "If the project's framework config file is nested in some directory or is using a custom build pipeline, please create an <b>aderyn.toml</b> using the initialize config command that is listed above and fill in the relevant details to help aderyn compile the project",
                "Remember to use the commands to start or restart or stop the Aderyn diagnostics server as and when necessary.",
                "If there are multiple parallel solidity projects in the same workspace it will not be supported. Two instances of the editor vscode must be opened and treated as separate projects.",
                "Remember to return to this page if any commands don't work because by opening this page, Aderyn will run a health checker that will make sure Aderyn is in a healthy and usable state."
            ] as step, i}
                <li class="flex items-start p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex-shrink-0 mr-4">
                        <div class="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold">
                            {i + 1}
                        </div>
                    </div>
                    <div class="text-gray-700 dark:text-gray-300">
                        {@html step}
                    </div>
                </li>
            {/each}
        </ul>
    </div>
     <div class="mt-8 text-center">
        <p class="text-gray-600 dark:text-gray-300 mb-2">Need more information?</p>
        <a 
            href="https://cyfrin.gitbook.io/cyfrin-docs/aderyn-vs-code/what-is-aderyn-vs-code-extension" 
            class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            View the full documentation
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
    </div>
</div>
