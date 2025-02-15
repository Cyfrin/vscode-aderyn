import * as fs from 'fs';
import * as path from 'path';

// This will make sure that even if the user opens a subfolder of the solidity project, the server will still be started
// succesfully because we use the nearest parent that is a git folder heuristic to know where the project root is.
function findProjectRoot(projectRootUri: string): string {
    let currentDir = projectRootUri;
    while (currentDir !== path.parse(currentDir).root) {
        if (
            fs.existsSync(path.join(currentDir, '.git')) ||
            fs.existsSync(path.join(currentDir, 'foundry.toml')) ||
            fs.existsSync(path.join(currentDir, 'aderyn.toml')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.ts')) ||
            fs.existsSync(path.join(currentDir, 'hardhat.config.js'))
        ) {
            return currentDir;
        }
        currentDir = path.dirname(currentDir);
    }
    return projectRootUri;
}

export { findProjectRoot };
