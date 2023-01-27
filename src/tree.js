const fs = require("fs/promises");
const path = require("path");

(async (pathToDir) => {
  const dirnameByPath = path.dirname(pathToDir);
  const tree = { files: [], folders: [] };
  const growTree = async (p) => {
    const pInfo = await fs.stat(p);

    if (pInfo.isFile()) {
      tree.files.push(path.relative(dirnameByPath, p));
      return;
    }

    tree.folders.push(path.relative(dirnameByPath, p));

    try {
      const dirContents = await fs.readdir(p);

      for (const content of dirContents) {
        await growTree(`${p}\\${content}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  await growTree(pathToDir);

  return tree;
})(process.argv[2]).then((res) => console.log(res));
