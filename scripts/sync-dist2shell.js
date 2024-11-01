import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 源文件夹路径，这里假设是当前目录下的dist文件夹
const sourceDir = path.join(__dirname, "../dist");
// 目标文件夹路径
const targetDir = path.join(__dirname, "../android-shell/app/src/main/assets");

// 创建目标文件夹（如果不存在）
const createTargetDir = (dirPath) => {
  const parts = dirPath.split(path.sep);
  let currentPath = "";

  for (let part of parts) {
    currentPath += path.sep + part;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

// 复制文件或文件夹的函数
const copy = (source, target) => {
  if (fs.statSync(source).isDirectory()) {
    createTargetDir(target);
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      console.log("---> " + curSource);
      copy(curSource, curTarget);
    });
  } else {
    fs.copyFileSync(source, target);
  }
};

// 先创建目标文件夹（如果不存在）
createTargetDir(targetDir);

// 执行复制操作
copy(sourceDir, targetDir);

console.log("复制成功！");
