const fs = require("node:fs");
const path = require("node:path");

const INCLUDE_REGEX = /#include ".*"/g;
const INCLUDE_PATH_REGEX = /".*"/;
/**
 * @param {fs.Dirent[]} contents 
 * @param {string} basePath
 */
const treeExplorder = (contents, basePath) => {
    for (const item of contents) {
        const name = item.name;
        const selfpath = path.join(item.path, item.name);
        if (item.isDirectory()) {
            const subcontents = fs.readdirSync(selfpath, { 
                withFileTypes: true
            });
            treeExplorder(subcontents, basePath);
        } else if (item.isFile()) {
            if (!(name.endsWith(".h") || name.endsWith(".hpp"))) {
                throw new Error("There was a non-header file.", { 
                    cause: new Error(item) 
                });
            }
            console.log("Found:", path.relative(basePath, selfpath));
            if (true) {
                const buffer = fs.readFileSync(selfpath, { encoding: "utf-8" });
                const modified = buffer
                .replace(INCLUDE_REGEX, (selection) => {
                    const betweenQuotes = selection
                        .match(INCLUDE_PATH_REGEX)
                        .map(el => el.slice(1, -1)).at(0);
                    if (betweenQuotes === undefined || betweenQuotes === "") {
                        throw new Error("Could not find include path.", {
                            cause: new Error(selection)
                        });
                    }
                    // The path from the include is absolute (relative to the basePath)
                    // Change it to relative.
                    // But sometimes the referenced file is already correctly placed, so detect that too.
                    const absoluteIncludePath = path.join(basePath, betweenQuotes);
                    const relativeIncludePath = path.relative(item.path, absoluteIncludePath);
                    const currentIncludePath = path.join(item.path, betweenQuotes);
                    // Some are correct. Why is it like this? Is it really that hard to use relative from the file paths?
                    // Why did you do this antlr?
                    if (fs.existsSync(currentIncludePath)) {
                        return `#include "${betweenQuotes}"`;
                    }
                    const includeStatement = `#include "${relativeIncludePath}"`;                   
                    return includeStatement;
                });
                fs.writeFileSync(selfpath, modified, {
                    encoding: "utf-8",
                });
            }
        } else {
            throw new Error("Dirent was not file or directory.");
        }
    }
}

const main = () => {
    const locationArg = process.argv.at(2);
    if (locationArg === undefined) {
        throw new Error("Did not receive location argument. Must pass the location of the vcpkg antlr4-runtime include directory.");
    }
    console.log("Provided antlr location:", locationArg);
    if (!path.isAbsolute(locationArg)) {
        console.log("The provided path is not absolute:", locationArg);
        throw new Error("Could not find specified location.");
    }
    if (!fs.existsSync(locationArg)) {
        console.log("Could not find folder:", locationArg);
        throw new Error("Could not find specified location.");
    }
    if (!locationArg.endsWith("antlr4-runtime")) {
        throw new Error("Path must end with \"antlr4-runtime\"");
    }

    throw new Error("REMOVE ME TO CONTINUE.");
    const antlr_folder = locationArg;
    const contents = fs.readdirSync(antlr_folder, { 
        withFileTypes: true,
    });
    treeExplorder(contents, antlr_folder, antlr_folder);
}

try {
    main();
} catch (e) {
    console.log(e);
    process.exit(1);
}
process.exit(0);