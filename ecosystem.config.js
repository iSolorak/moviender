module.exports = {
  apps: [
    {
      name: "movieinder",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3007,
      },
    },
  ],
};
