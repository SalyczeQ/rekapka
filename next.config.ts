import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",

  experimental: {
    authInterrupts: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "s3.dusansalay.eu",
      },
      ...(process.env.S3_ENDPOINT
        ? [
            {
              protocol: new URL(process.env.S3_ENDPOINT).protocol.replace(":", "") as "http" | "https",
              hostname: new URL(process.env.S3_ENDPOINT).hostname,
              port: new URL(process.env.S3_ENDPOINT).port || "",
            },
          ]
        : []),
    ],
  },


  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
