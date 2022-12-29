const generateIconComponent = require("./generateIconComponent");

module.exports = function ({ types }) {
  return {
    visitor: {
      ImportDeclaration: function (path, state) {
        const source = path.node.source.value;
        if (source === state.opts.libraryName) {
          var transforms = [];
          var memberImports = path.node.specifiers.filter(function (specifier) {
            return specifier.type === "ImportSpecifier";
          });
          memberImports.forEach(function (memberImport) {
            var replace = generateIconComponent(
              memberImport.imported.name,
              state.opts
            );
            var newImportSpecifier = types.importDefaultSpecifier(
              types.identifier(memberImport.local.name)
            );
            transforms.push(
              types.importDeclaration(
                [newImportSpecifier],
                types.stringLiteral(replace)
              )
            );
          });
          if (transforms.length > 0) {
            path.replaceWithMultiple(transforms);
          }
        }
      },
    },
  };
};
