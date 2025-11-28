import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server:{
      allowedHosts: ['.localdomain', '.local', '.test', '.localhost', 'host.docker.internal' ],
  },
  optimizeDeps: {
    // Exclude OpenTelemetry packages from pre-bundling to preserve singleton MeterProvider
    exclude: [
      '@opentelemetry/api',
      '@opentelemetry/sdk-node',
      '@opentelemetry/sdk-metrics',
      '@opentelemetry/exporter-prometheus',
      '@opentelemetry/resources',
      '@opentelemetry/auto-instrumentations-node',
      '@opentelemetry/otlp-exporter-base',
      '@flagmeter/telemetry',
    ],
  },
  ssr: {
    // Don't try to bundle OpenTelemetry modules - they should remain external
    external: [
      '@opentelemetry/api',
      '@opentelemetry/sdk-node',
      '@opentelemetry/sdk-metrics',
      '@opentelemetry/exporter-prometheus',
      '@opentelemetry/resources',
      '@opentelemetry/auto-instrumentations-node',
      '@opentelemetry/otlp-exporter-base',
      '@flagmeter/telemetry',
    ],
    noExternal: [
      // Force these to be bundled even though they're workspace packages
      // This prevents issues with ESM/CJS interop
    ],
  },
  plugins: [
    // Only enable devtools in development mode
    ...(process.env.NODE_ENV !== 'production' ? [devtools()] : []),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
