import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pilotes de base de données : exécutés côté serveur uniquement, jamais bundlés.
  serverExternalPackages: ["@electric-sql/pglite", "postgres"],
};

export default nextConfig;
