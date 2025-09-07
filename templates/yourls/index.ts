import { Output, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];

  // Serviço da aplicação YOURLS, puxando do seu fork
  services.push({
    type: "app",
    data: {
      serviceName: input.appServiceName,
      source: {
        type: "git",
        url: "https://github.com/tiagomarcal55/YOURLS.git",
        branch: "master"
      },
      build: {
        builder: "nixpacks",
        config: {
          languages: { php: "8.1" },
          php: { extensions: ["mysqli", "curl", "mbstring"] }
        }
      },
      env: [
        `YOURLS_DB_HOST=$(PROJECT_NAME)_${input.databaseServiceName}`,
        `YOURLS_DB_NAME=$(PROJECT_NAME)`,
        `YOURLS_DB_USER=mysql`,
        `YOURLS_DB_PASS=${input.db_pass}`,
        `YOURLS_SITE=https://$(PRIMARY_DOMAIN)`,
        `YOURLS_USER=${input.user}`,
        `YOURLS_PASS=${input.pass}`
      ].join("\n"),
      domains: [
        { host: "$(PRIMARY_DOMAIN)", path: "/admin", port: 80 },
        { host: "$(PRIMARY_DOMAIN)", port: 80 }
      ]
    }
  });

  // Serviço de banco de dados MySQL
  services.push({
    type: "mysql",
    data: {
      serviceName: input.databaseServiceName,
      password: input.db_pass
    }
  });

  return { services };
}
