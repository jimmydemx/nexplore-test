import { createApp, createPool } from './app';

async function bootstrap() {
  const pool = createPool();
  const app = createApp(pool);
  const port = Number(process.env.PORT ?? 3000);
  const server = app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });

  const shutdown = async () => {
    server.close();

    if (pool) {
      await pool.end();
    }
  };

  process.on('SIGINT', () => {
    void shutdown();
  });
  process.on('SIGTERM', () => {
    void shutdown();
  });
}

if (require.main === module) {
  void bootstrap();
}
