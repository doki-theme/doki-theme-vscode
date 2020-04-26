import https from 'https';
import { Transform as Stream } from 'stream';

export const performGet = (url: string): Promise<Stream> => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      timeout: 10000,
    }, (res) => {
      const inputStream = new Stream();
      res.on('data', (d) => {
        inputStream.push(d);
      });
      res.on('end', () => {
        resolve(inputStream);
      });
    }).on('error', (e) => {
      reject(e);
    }).end();
  });
};