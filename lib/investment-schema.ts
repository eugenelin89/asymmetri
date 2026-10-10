/** Server-side named DTO validation; the pinned contract is never edited or fetched. */
import { Ajv2020 } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import schema from '@/receiver/vendor/investment/v1/schema.json';
const ajv = new Ajv2020({ strict: true, allErrors: false });
addFormats(ajv);
ajv.addSchema(schema);
export function validArchiveDto(name: string, value: unknown): boolean {
  const validator = ajv.getSchema(`${schema.$id}#/$defs/${name}`);
  return !!validator?.(value);
}
