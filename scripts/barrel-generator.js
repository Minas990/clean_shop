
import { readFile, readdir, writeFile } from "fs/promises";
import { join, relative } from "path";
import { createInterface } from "readline";
import inquirer from "inquirer";

async function getDirectories(path)
{
    try
    {
        const entries = await readdir(path, { withFileTypes: true });

        return entries
            .filter(entry => entry.isDirectory())
            .map(entry => entry.name)
            .sort();
    }
    catch
    {
        return [];
    }
}

async function showMatches(matches)
{
    if (matches.length <= 10)
    {
        console.log("\n" + matches.map(match => `  ${match}`).join("\n"));
        return;
    }

    const { show } = await inquirer.prompt([
        {
            type: "confirm",
            name: "show",
            message: `There are ${matches.length} matching directories. Show them?`,
            default: false
        }
    ]);

    if (show)
        console.log("\n" + matches.map(match => `  ${match}`).join("\n"));
}

async function promptDirectory(message, basePath)
{
    return new Promise((resolve) =>
    {
        let value = "";

        process.stdout.write(`${message}: `);

        process.stdin.setRawMode(true);
        process.stdin.resume();

        const onData = async (data) =>
        {
            const key = data.toString();

            if (key === "\u0003")
            {
                cleanup();
                process.exit();
            }

            if (key === "\r" || key === "\n")
            {
                cleanup();

                console.log();
                resolve(value);
                return;
            }

            if (key === "\u007f")
            {
                if (value.length > 0)
                {
                    value = value.slice(0, -1);

                    process.stdout.write("\b \b");
                }

                return;
            }

            if (key === "\t")
            {
                await autocomplete();
                return;
            }

            if (key.length === 1 && key >= " ")
            {
                value += key;
                process.stdout.write(key);
            }
        };

        process.stdin.on("data", onData);

        function cleanup()
        {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener("data", onData);
        }

        async function autocomplete()
        {
            const normalized = value.replace(/\\/g, "/");

            const lastSlash = normalized.lastIndexOf("/");

            const parent = lastSlash === -1
                ? ""
                : normalized.slice(0, lastSlash + 1);

            const prefix = lastSlash === -1
                ? normalized
                : normalized.slice(lastSlash + 1);

            const parentPath = join(basePath, parent);

            const directories = await getDirectories(parentPath);

            const matches = directories.filter(directory =>
                directory.toLowerCase().startsWith(prefix.toLowerCase())
            );

            if (matches.length === 0)
                return;

            if (matches.length === 1)
            {
                value = parent + matches[0] + "/";

                process.stdout.write("\r\x1b[K");
                process.stdout.write(`${message}: ${value}`);

                return;
            }

            await showMatches(matches);

            process.stdout.write(`\n${message}: ${value}`);
        }
    });
}


async function getHandlerFiles(directoryPath)
{
    const handlers = [];

    async function scan(currentPath)
    {
        const entries = await readdir(currentPath, {
            withFileTypes: true
        });

        for (const entry of entries)
        {
            const fullPath = join(currentPath, entry.name);

            if (entry.isDirectory())
            {
                await scan(fullPath);
                continue;
            }

            if (
                !entry.isFile() ||
                !entry.name.endsWith("handler.ts") ||
                entry.name === "index.ts"
            )
            {
                continue;
            }

            const content = await readFile(fullPath, "utf-8");

            const match = content.match(
                /export\s+class\s+([A-Za-z_$][\w$]*)/
            );

            if (!match)
                continue;

            handlers.push({
                className: match[1],
                filePath: fullPath
            });
        }
    }

    await scan(directoryPath);

    return handlers;
}

function getImportPath(directoryPath, filePath)
{
    let importPath = relative(directoryPath, filePath);

    importPath = importPath
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");

    if (!importPath.startsWith("."))
        importPath = "./" + importPath;

    return importPath;
}

async function main()
{
    const srcPath = join(process.cwd(), "src");

    const { moduleName } = await inquirer.prompt([
        {
            type: "input",
            name: "moduleName",
            message: "Module name:",
            validate: value =>
                value.trim()
                    ? true
                    : "Module name is required"
        }
    ]);

    const modulePath = join(srcPath, moduleName);

    const directory = await promptDirectory(
        "Directory inside the module",
        modulePath
    );

    const { arrayName } = await inquirer.prompt([
        {
            type: "input",
            name: "arrayName",
            message: "Array name:",
            validate: value =>
                value.trim()
                    ? true
                    : "Array name is required"
        }
    ]);

    const directoryPath = join(modulePath, directory);

    const handlers = await getHandlerFiles(directoryPath);

    handlers.sort((a, b) =>
        a.className.localeCompare(b.className)
    );

    if (handlers.length === 0)
    {
        console.log("\nNo handler.ts files found.");
        return;
    }

    const imports = handlers
        .map(handler =>
            `import { ${handler.className} } from "${getImportPath(
                directoryPath,
                handler.filePath
            )}";`
        )
        .join("\n");

    const array = handlers
        .map(handler => handler.className)
        .join(",\n    ");

    const output = `${imports}

export const ${arrayName} = [
    ${array}
];
`;

    const indexPath = join(directoryPath, "index.ts");

    await writeFile(indexPath, output);

    console.log(
        `\nGenerated: ${relative(process.cwd(), indexPath)}`
    );

    console.log(`Found ${handlers.length} handlers.`);
}

main().catch(error =>
{
    if (process.stdin.isTTY)
        process.stdin.setRawMode(false);

    console.error(error);
    process.exit(1);
});

