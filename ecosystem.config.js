module.exports = {
  apps: [
    {
      name: "movieinder",
      cwd: "/home/solorak/pickflix",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3007,
      },
    },
  ],
};
