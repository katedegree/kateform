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

function findNearestFile(startDir: string, fileName: string): string | null {
  let currentDir = startDir;

  while (true) {
    const filePath = path.join(currentDir, fileName);

    if (fs.existsSync(filePath)) {
      return filePath;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

// tsconfig.json の paths 更新
const tsconfigPath = findNearestFile(destRoot, "tsconfig.json");
const kateformDir = path.join(destRoot, "kateform");
if (!tsconfigPath) {
  console.error("tsconfig.json が見つかりません。");
  process.exit(1);
}
if (!fs.existsSync(kateformDir)) {
  console.log("kateform ディレクトリが見つかりません");
  process.exit(0);
}
const tsconfigDir = path.dirname(tsconfigPath);
let relativePath = path.relative(tsconfigDir, kateformDir);

if (fs.existsSync(tsconfigPath)) {
  let content = fs.readFileSync(tsconfigPath, "utf-8");

  const pathsMatch = content.match(/(^\s*)"paths"\s*:\s*{/m);
  if (pathsMatch) {
    const indent = pathsMatch[1] || "";
    const insertIndex = pathsMatch.index! + pathsMatch[0].length;

    if (!/["@']@kateform\/\*["']/.test(content)) {
      const insertText = `\n${indent}  "@kateform/*": ["./${relativePath}/*"],`;
      content =
        content.slice(0, insertIndex) + insertText + content.slice(insertIndex);
      fs.writeFileSync(tsconfigPath, content, "utf-8");
      console.log("Add @kateform/*: [./kateform/*] to tsconfig.json.");
    }
  } else {
    console.log("No paths found in tsconfig.json");
  }
}

// package.json から依存パッケージを取得
const pkgPath = findNearestFile(destRoot, "package.json");
if (!pkgPath) {
  console.error("package.json が見つかりません。");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

// kateform 用に必要な依存パッケージ
const kateformPackages = [
  "react",
  "react-dom",
  "clsx",
  "framer-motion",
  "tailwindcss",
  "@tailwindcss/cli",
  "@tailwindcss/postcss",
  "tailwind-merge",
];

// 既存 dependencies / devDependencies をまとめる
const installedDeps = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
};

const toInstall: string[] = [];

kateformPackages.forEach((name) => {
  const requiredVersion =
    pkg.dependencies?.[name] || pkg.devDependencies?.[name];

  if (!installedDeps?.[name]) {
    // 未インストール
    toInstall.push(requiredVersion ? `${name}@${requiredVersion}` : name);
    if (!requiredVersion) {
      console.warn(
        `${name} は package.json に存在しないため最新バージョンをインストールします。`
      );
    }
  } else if (requiredVersion && installedDeps[name] !== requiredVersion) {
    // バージョン違い（上書きしない）
    console.warn(
      `${name} は既に ${installedDeps[name]} がインストールされています（要求: ${requiredVersion}）`
    );
  }
});

if (toInstall.length > 0) {
  console.log("不足している依存パッケージをインストールします:", toInstall);
  try {
    execSync(`npm install ${toInstall.join(" ")}`, { stdio: "inherit" });
    console.log("依存パッケージのインストールが完了しました！");
  } catch (err) {
    console.error("依存パッケージのインストール中にエラーが発生しました:", err);
  }
} else {
  console.log("依存パッケージはすべて既にインストールされています。");
}

console.log("kateform のセットアップが完了しました！");
