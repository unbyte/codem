import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { stat, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const isExpired = async (path, expireDays) => {
    const stats = await stat(path);
    const days = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    return days < expireDays;
}

const getCert = async () => {
	const certPath = join(__dirname, 'cert.pem');

	const options = {
		days: 30,
		keySize: 2048,
	};

	if (!existsSync(certPath) || await isExpired(certPath, options.days)) {
        const pem = require('selfsigned').generate(
            [{ name: 'commonName', value: 'localhost' }],
            options,
        );

        const cert = pem.private + pem.cert;

        await writeFile(certPath, cert, { encoding: 'utf-8' });
	}

    return certPath
};

const serve = async () => {
	const cert = await getCert();

    spawn('http-server', ['-p', '8080', '-S', '--cors' , '-C', cert, '-K', cert, __dirname], {
        stdio: 'inherit',
    })
}

serve()