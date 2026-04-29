import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

function parseEnvLine(line: string) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
        return undefined;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
        return undefined;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (!key || process.env[key] !== undefined) {
        return undefined;
    }

    return { key, value };
}

export function loadEnv() {
    const envFilePath = path.resolve(__dirname, '../../../.env');

    if (!existsSync(envFilePath)) {
        return;
    }

    const fileContents = readFileSync(envFilePath, 'utf8');

    for (const line of fileContents.split(/\r?\n/)) {
        const entry = parseEnvLine(line);

        if (!entry) {
            continue;
        }

        process.env[entry.key] = entry.value;
    }
}