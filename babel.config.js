module.exports = {
  presets: [
    ["@babel/preset-env", { targets: "defaults" }],
    ["@babel/preset-typescript"],
  ],
  plugins: ["@babel/plugin-proposal-class-properties"],
};
