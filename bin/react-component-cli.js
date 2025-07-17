#!/usr/bin/env node

const { createReactCLI } = require("../src/react-component/lib/cli-command");

if (require.main === module) {
  (async () => {
    createReactCLI("");
  })();
}

module.exports = {
  createReactCLI,
};
