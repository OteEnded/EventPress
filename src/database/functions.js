import { sql } from 'drizzle-orm';

// custom lower function
export function lower(values) {
    return sql`lower(${values})`;
}

export default {
    lower
};