import { encrypt } from 'eciesjs';
import { ec } from 'elliptic';
const EC = new ec('secp256k1');
import sha256 from 'sha256';
import { Object } from './typedef';

/**
 * Convert HTTP query from object
 * @param {Object} query HTTP query
 * @returns {string}
 */
export const joinQuery = (query: Object = {}): string => {
    return Object.keys(query)
        .reduce((prev: Array<string>, cur: string) => {
            if (!query[cur] || query[cur].length < 1) return prev;

            prev.push(`${cur}=${encodeURIComponent(query[cur])}`);
            return prev;
        }, [])
        .join('&');
};

/**
 * Join HTTP path with query
 * @param {string} path HTTP path
 * @param {Object} query HTTP query
 * @returns {string} HTTP path with query
 */
export const joinPath = (path: string, query: Object = {}): string => {
    const queryStr: string = joinQuery(query);
    if (queryStr.length < 1) return path;
    if (path.indexOf('?') < 0) return `${path}?${queryStr}`;
    return `${path}&${queryStr}`;
};

/**
 * Generate new EC private key
 * @returns {string} EC private key in hex
 */
export const generateECPrivateKey = (): string => {
    const ecKey = EC.genKeyPair();
    return ecKey.getPrivate().toString('hex');
};

/**
 * Get EC public key from private key
 * @param {string} privateKey EC private key in HEX
 * @param {boolean} [compact] Get compact key (default = true)
 * @returns {string} EC public key in HEX
 */
export const getECPublicKey = (privateKey: string, compact: boolean = true): string => {
    if (privateKey.toLowerCase().startsWith('0x')) privateKey = privateKey.slice(2);
    const ecKey = EC.keyFromPrivate(privateKey, 'hex');
    return ecKey.getPublic(compact, 'hex');
};

/**
 * EC sign message
 * @param {string} message message to be signed
 * @param {string} privateKey EC private key in HEX
 * @returns {string} signature in HEX
 */
export const ecSign = (message: string, privateKey: string): string => {
    if (privateKey.toLowerCase().startsWith('0x')) privateKey = privateKey.slice(2);
    const ecKey = EC.keyFromPrivate(privateKey, 'hex');
    return ecKey.sign(message).toDER('hex');
};

/**
 * Verify EC signature by public key
 * @param {string} message raw message
 * @param {string} signature signature
 * @param {string} publicKey EC public key in HEX
 * @returns {boolean} EC verify result
 */
export const ecVerify = (message: string, signature: string, publicKey: string): boolean => {
    const ecKey = EC.keyFromPublic(publicKey, 'hex');
    return ecKey.verify(message, signature);
};

/**
 * ECIES encryption
 * @param {Buffer} message raw message as Buffer
 * @param {string} masterKey ECIES master key
 * @returns {string} ECIES encrypted message in Base64
 */
export const eciesEncrypt = (message: Buffer, masterKey: string): string => {
    return encrypt(masterKey, message).toString('base64');
};
