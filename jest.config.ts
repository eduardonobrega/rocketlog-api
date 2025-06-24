import type { Config } from "jest"

const config: Config = {
    bail: true, // Para execução dos testes na primeira falha
    clearMocks: true, // Limpa os mocks automaticamente entre os testes
    coverageProvider: "v8", // Usa o mecanismo de cobertura de testes do V8 (mais rápido)
    preset: "ts-jest", // Usa ts-jest para transpilar TypeScript durante os testes
    testEnvironment: "node", // Define o ambiente de teste como Node.js
    testMatch: ["<rootDir>/src/**/*.test.ts"], // Executa todos os arquivos .test.ts dentro de /src
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1" // Permite usar @ como atalho para /src nos imports
    }
}

export default config
