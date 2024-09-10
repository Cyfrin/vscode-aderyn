import * as vscode from "vscode";
import { exec } from "child_process";
import { workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

const enum AderynCommands {
  RestartServer = "aderyn.restartServer",
}

let client: LanguageClient | undefined;
let configureLang: vscode.Disposable | undefined;

export async function activate(context: vscode.ExtensionContext) {
  const restartCommand = vscode.commands.registerCommand(
    AderynCommands.RestartServer,
    async () => {
      if (!client) {
        vscode.window.showErrorMessage("aderyn client not found");
        return;
      }

      try {
        if (client.isRunning()) {
          await client.restart();

          vscode.window.showInformationMessage("aderyn server restarted.");
        } else {
          await client.start();
        }
      } catch (err) {
        client.error("Restarting client failed", err, "force");
      }
    },
  );

  context.subscriptions.push(restartCommand);

  client = await createLanguageClient();
  // Start the client. This will also launch the server
  client?.start();
}

// this method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
  configureLang?.dispose();

  return client?.stop();
}

async function createLanguageClient(): Promise<LanguageClient | undefined> {
  let commandNotFound = false;
  const command = await getAderynCommand()
    .catch(() => {
      const message = `Could not resolve aderyn executable. Please ensure it is available
      on the PATH used by VS Code. Read installation guide https://github.com/cyfrin/aderyn`;
      vscode.window.showErrorMessage(message);
      commandNotFound = true;
    }) as string;

  if (commandNotFound) {
    return;
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "*" }],
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher("**/*"),
      ],
    },
  };

  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders || workspaceFolders.length == 0) {
    const message = `No workspace is open yet. Please do that and then \`Restart Aderyn Server\``;
    vscode.window.showInformationMessage(message);
    return;
  }

  const projectRootName = workspaceFolders[0].name;
  const projectRootUri = workspaceFolders[0].uri.toString().substring("file://".length);

  if (workspaceFolders.length > 1) {
    const message = `More than 1 open workspace detected. Aderyn will only run on ${projectRootName}`;
    vscode.window.showInformationMessage(message);
    return;
  }

  const getServerOptions = () => {
    if (process.env.NODE_ENV === "development") {
      let URL;
      try {
        URL = fs.readFileSync(path.join(__dirname, "../manifest"));
      } catch (ex) {
        vscode.window.showErrorMessage("File manifest not found. Read manifest.sample please!");
      }
      vscode.window.showInformationMessage(`DEBUG MODE: ${URL}`);
      return {
        command: 'cargo',
        args: ["run", "--quiet", "--manifest-path", URL, "--", projectRootUri, "--lsp", "--stdout"],
        options: {
          env: process.env
        }
      }
    } 
    return {
      command,
      args: [projectRootUri, "--lsp", "--stdout"],
      options: {
        env: process.env
      },
    };
  };

  return new LanguageClient(
    "aderyn_language_server",
    "Aderyn Language Server",
    getServerOptions() as ServerOptions,
    clientOptions,
  );
}


async function getAderynCommand(): Promise<string> {
  const findOut = new Promise<string>((resolve, reject) => {
    exec('aderyn --version', (error) => {
      if (error) {
        reject("FAILED");
      } else {
        resolve("aderyn");
      }
    });
  });
  return await findOut;
}