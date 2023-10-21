const { ESLint } = require('eslint');

/**
 * 把要忽略的文件都过滤掉
 * @param {string[]} files
 * @returns
 */
const removeIgnoreFiles = async (files) => {
  const eslint = new ESLint();
  const ignoreFiles = await Promise.all(
    files.map((file) => eslint.isPathIgnored(file)),
  );
  const filterFiles = files.filter((_, index) => !ignoreFiles[index]);
  return filterFiles.join(' ');
};

module.exports = {
  // 这里的 files 是被 lint-staged 检测到的文件
  '*': async (files) => {
    const filesToLint = await removeIgnoreFiles(files);
    return [`eslint ${filesToLint} --ext .ts,.js,.json --max-warnings=0 --fix`];
  },
};
