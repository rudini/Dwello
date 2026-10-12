import { CodedError } from './coded-error';

/** The request conflicts with existing data (HTTP 409) */
export class Conflict extends CodedError {}
