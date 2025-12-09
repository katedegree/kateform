#!/usr/bin/env node
import fs from "fs";
import path from "path";

const libRoot = path.resolve(__dirname, "..");
const srcPath = path.join(libRoot, "src");

const destRoot = process.cwd();
const kateformPath = path.join(destRoot, "kateform");

if (fs.existsSync(kateformPath)) {
  fs.rmSync(kateformPath, { recursive: true, force: true });
  console.log("既存 kateform フォルダを削除しました。");
}

if (!fs.existsSync(srcPath)) {
  console.error(
    `コピー元の src フォルダが存在しません。パスを確認してください: ${srcPath}`
  );
  process.exit(1);
}

fs.mkdirSync(kateformPath);

function copyDir(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcEntry = path.join(src, entry.name);
    const destEntry = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destEntry)) fs.mkdirSync(destEntry);
      copyDir(srcEntry, destEntry);
    } else {
      fs.copyFileSync(srcEntry, destEntry);
    }
  });
}

copyDir(srcPath, kateformPath);
console.log("src を kateform にコピーしました。");

const tsconfigPath = path.join(destRoot, "tsconfig.json");
if (fs.existsSync(tsconfigPath)) {
  let content = fs.readFileSync(tsconfigPath, "utf-8");

  const pathsMatch = content.match(/(^\s*)"paths"\s*:\s*{/m);
  if (pathsMatch) {
    const indent = pathsMatch[1] || ""; // "paths": { の前のスペース
    const insertIndex = pathsMatch.index! + pathsMatch[0].length;

    if (!/["@']@kateform\/\*["']/.test(content)) {
      const insertText = `\n${indent}  "@kateform/*": ["./kateform/*"],`; // インデント + 半角スペース2個
      content =
        content.slice(0, insertIndex) + insertText + content.slice(insertIndex);
      fs.writeFileSync(tsconfigPath, content, "utf-8");
      console.log(
        'tsconfig.json に "@kateform/*": ["./kateform/*"] を追加しました'
      );
    } else {
      console.log('"@kateform/*" は既に存在します');
    }
  } else {
    console.log("tsconfig.json に paths が見つかりません");
  }
}

console.log("kateform のセットアップが完了しました！");
