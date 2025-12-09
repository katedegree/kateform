#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const libRoot = path.resolve(__dirname, "..");
const srcPath = path.join(libRoot, "src");

const destRoot = process.cwd();
const kateformPath = path.join(destRoot, "kateform");

// 既存 kateform フォルダ削除
if (fs.existsSync(kateformPath)) {
  fs.rmSync(kateformPath, { recursive: true, force: true });
  console.log("既存 kateform フォルダを削除しました。");
}

// コピー元 src フォルダ確認
if (!fs.existsSync(srcPath)) {
  console.error(
    `コピー元の src フォルダが存在しません。パスを確認してください: ${srcPath}`
  );
  process.exit(1);
}

// kateform フォルダ作成
fs.mkdirSync(kateformPath);

// ディレクトリコピー関数
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

// src を kateform にコピー
copyDir(srcPath, kateformPath);
console.log("src を kateform にコピーしました。");

// tsconfig.json の paths 更新
const tsconfigPath = path.join(destRoot, "tsconfig.json");
if (fs.existsSync(tsconfigPath)) {
  let content = fs.readFileSync(tsconfigPath, "utf-8");

  const pathsMatch = content.match(/(^\s*)"paths"\s*:\s*{/m);
  if (pathsMatch) {
    const indent = pathsMatch[1] || "";
    const insertIndex = pathsMatch.index! + pathsMatch[0].length;

    if (!/["@']@kateform\/\*["']/.test(content)) {
      const insertText = `\n${indent}  "@kateform/*": ["./kateform/*"],`;
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

// 依存パッケージのインストール
const packages = [
  "react",
  "react-dom",
  "zustand",
  "clsx",
  "framer-motion",
  "tailwindcss",
  "@tailwindcss/cli",
  "@tailwindcss/postcss",
  "tailwind-merge",
];

console.log("必要な依存パッケージをインストール中...");
try {
  execSync(`npm install ${packages.join(" ")}`, { stdio: "inherit" });
  console.log("依存パッケージのインストールが完了しました！");
} catch (err) {
  console.error("依存パッケージのインストール中にエラーが発生しました:", err);
}

console.log("kateform のセットアップが完了しました！");
