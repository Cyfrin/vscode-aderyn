<script module>
    // @ts-ignore
    let clientVscode = acquireVsCodeApi();
</script>

<div class="flex flex-col justify-between h-svh pb-8">
    <div class="flex flex-col items-center p-4">
        <div class="mb-2">
            <h1 class="m-1 text-2xl font-bold">Congratulations!</h1>
        </div>
        <div class="mb-8">
            <h2 class="m-1 italic">
                You have indeed made a good call by installing the Aderyn extension.
            </h2>
        </div>
        <img
            src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
            width="300"
            alt="cat typing aggressively meme"
        />
        <div class="m-2 mt-6">
            <h1 class="m-1 font-bold">
                Please wait patiently while we ensure you have the latest Aderyn CLI
                (unlike the cat above)...
            </h1>
            <div class="flex justify-center mt-4">
                <div
                    class="w-8 h-8 animate-spin border-4 border-[var(--vscode-button-background)] border-l-[var(--vscode-button-foreground)] rounded-full"
                ></div>
            </div>
        </div>
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
                    <b> "Aderyn: Welcome Onboard" </b> to return to this guide
                </h2>
            </div>
            <div class="mt-4 flex flex-col items-center">
                <table class="table-fixed">
                    <tbody>
                        <tr>
                            <td>Aderyn: Welcome Onboard</td>
                            <th>&nbsp;&nbsp;</th>
                            <td>Opens this page</td>
                        </tr>
                        <tr>
                            <td>Aderyn: Start Server</td>
                            <th>&nbsp;&nbsp;</th>
                            <td>Start the diagnostics server</td>
                        </tr>
                        <tr>
                            <td>Aderyn: Stop Server</td>
                            <th>&nbsp;&nbsp;</th>
                            <td>Stop the diagnostics server</td>
                        </tr>
                        <tr>
                            <td>Aderyn: Restart Server</td>
                            <th>&nbsp;&nbsp;</th>
                            <td>Restart the diagnostics server</td>
                        </tr>
                        <tr>
                            <td>Aderyn: Initialize Config file</td>
                            <th>&nbsp;&nbsp;</th>
                            <td>For advanced use, create <b>aderyn.toml</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="flex justify-center">
        If the installation does not work, please consider opening an issue on &nbsp;
        <a href="http://github.com/cyfrin/aderyn"> Github </a>. You can also try
        installing manually.
    </div>
</div>
