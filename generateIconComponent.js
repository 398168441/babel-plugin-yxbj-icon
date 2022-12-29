const fetch = require("sync-fetch");
const path = require("path");
const fs = require("fs-extra");

const NATIVE_SUFFIX = "Native";
const ICON_SUFFIX = "Icon";

function genIconPath(componentName, iconServer) {
  let theme = "fill";
  let suffix = ICON_SUFFIX;
  if (componentName.endsWith(NATIVE_SUFFIX)) {
    suffix = ICON_SUFFIX + NATIVE_SUFFIX;
    theme = "native";
  }
  const type = componentName.slice(0, componentName.length - suffix.length);
  return `${iconServer}?type=${type}&theme=${theme}`;
}

function isAccessable(path) {
  let accessable = false;
  try {
    fs.accessSync(path);
    accessable = true;
  } catch (error) {
    accessable = false;
  }
  return accessable;
}

function isExpired(componentPath, cacheExpired) {
  if (!cacheExpired) {
    return false;
  }

  const now = Date.now();
  const stats = fs.statSync(componentPath);
  return now - stats.mtime.getTime() > cacheExpired;
}

function loadIcon(iconUrl, componentPath) {
  const response = fetch(iconUrl);
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const res = response.json();
  if (!res || res.code !== 200) {
    throw new Error(res.message);
  }
  fs.outputFileSync(
    componentPath,
    `import React from 'react';
    export default (props) => React.cloneElement(${res.data}, {...props})`
  );
}
module.exports = function (componentName, opts) {
  const componentPath = path.resolve(opts.cacheDir, `${componentName}.jsx`);
  const iconUrl = genIconPath(componentName, opts.iconServer);
  if (
    !isAccessable(componentPath) ||
    isExpired(componentPath, opts.cacheExpired)
  ) {
    console.log(`\nloadIcon----- ${componentName}`);
    loadIcon(iconUrl, componentPath);
  }
  return componentPath;
};
