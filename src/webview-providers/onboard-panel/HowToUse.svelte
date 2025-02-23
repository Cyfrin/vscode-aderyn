<div class="m-2 mt-6">
    <div class="mb-2">
        <h1 class="flex justify-center text-2xl font-bold">How to Use</h1>
    </div>
    <div class="mb-8 flex justify-center font-light">
        <ul class="list-disc mt-4 max-w-[60%] space-y-2">
            <li>
                Aderyn will start automatically on commonly recognized project structures
                i.e when a <b>foundry.toml</b> or <b>hardhat.config.ts</b> or
                <b>aderyn.toml</b> is found in the root of the workspace
            </li>
            <li>
                If the project's framework config file is nested in some directory or is
                using a custom build pipeline, please create an <b>aderyn.toml</b> using the
                initialize config command that is listed above and fill in the relevant details
                to help aderyn compile the project
            </li>
            <li>
                Remember to use the commands to start or restart or stop the Aderyn
                diagnostics server as and when necessary.
            </li>
            <li>
                If there are multiple parallel solidity projects in the same workspace it
                will not be supported. Two instances of the editor vscode must be opened
                and treated as separate projects.
            </li>
            <li>
                Remember to return to this page if any commands don't work because by
                opening this page, Aderyn will run a health checker that will make sure
                Aderyn is in a healthy and usable state.
            </li>
        </ul>
    </div>
</div>
