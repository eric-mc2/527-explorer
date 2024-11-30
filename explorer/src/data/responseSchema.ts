import { z } from 'zod';

/* I was thinking about using z.merge() to append this either type 
  to avoid copy-pasting nearly identical Contribution types but it
  becomes a hastle because you still have to .transform() it to
  coalesce the two essentially optional properties, and also drop
  the original property names, which in all sacrifices a lot of legibility.
*/

export type ContributionsResponse = z.infer<typeof ContributionsSchema>;
export type ExpendituresResponse = z.infer<typeof ExpendituresSchema>;
type ContributionMatchesResponse = z.infer<typeof ContributionMatchesSchema>;
type ExpenditureMatchesResponse = z.infer<typeof ExpenditureMatchesSchema>;
export type OrganizationsResponse = z.infer<typeof OrganizationsSchema>;
export type Response = (ContributionsResponse | ExpendituresResponse | 
    ContributionMatchesResponse | ExpenditureMatchesResponse |
    OrganizationsResponse);


const eitherKey = (a: string, b: string, T: any) => {
  return z.union([
    z.object({ [a]: T, [b]: z.undefined() }),
    z.object({ [b]: T, [a]: z.undefined() })]);
}

const OrganizationSchema = z.object({
  id: z.coerce.number(),
  org_name: z.string(),
  ein: z.coerce.number(),
  total_contrib: z.coerce.number().nullable(),
  total_exp: z.coerce.number().nullable(),
  active: z.coerce.boolean(),
  purpose: z.string(),
})

export const OrganizationsSchema = z.object({
  // TODO: I think it's ok for this to be empty.
  // Also look into how to filter out error objects
  count: z.number(),
  data: z.array(OrganizationSchema)
})

/* Handles search and org contribution endpoints */
const ContributionSchema = z.object({
  /* Transaction */
  id: z.number(),
  agg_contrib_ytd: z.coerce.number(),
  date: z.string().date(),
  amt: z.coerce.number(),
  link: z.coerce.number(), // This is the REST id for match/contributions
  /* Source */
  contributor: z.number().nullable(),
  certainty: z.number().nullable(), 
  name: z.string(),
  /* Target */
  org_name: z.string(),
  ein: z.coerce.number(),
  /* Unknown */
  form8872_data_id: z.coerce.number(), // ?
});

export const ContributionsSchema = z.object({
    // TODO: I think it's ok for this to be empty.
    // Also look into how to filter out error objects
    count: z.number(),
    data: z.array(ContributionSchema)
})  

/* Handles both expenditure endpoints */
const ExpenditureSchema = z.object({
    /* Transaction */
    id: z.number(),
    amt: z.coerce.number(),
    date: z.string().date(),
    is_political_contribution: z.boolean(),
    link: z.coerce.number(), // This is the REST id for match/expenditures
    /* Source */
    org_name: z.string(),
    ein: z.coerce.number(),
    /* Target */
    name: z.string(),
    certainty: z.number().nullable(),
    recipient: z.number().nullable(),
  })
  
export const ExpendituresSchema = z.object({
    // TODO: I think it's ok for this to be empty.
    // Also look into how to filter out error objects
    count: z.number(),
    data: z.array(ExpenditureSchema)
})

const ContributionMatchSchema = z.object({
  /* Transaction level */
  agg_contrib_ytd: z.coerce.number(),
  contrib_date: z.string().date(),
  contribution_amt: z.coerce.number(),
  /* Target Info */
  org_name: z.string(),
  ein: z.coerce.number(),
  /* Source Info */
  contributor: z.number(),
  certainty: z.number(), 
  contributor_name: z.string(),
  /* Unknown */
  form8872_data_id: z.coerce.number(),
  schedule_a_id: z.coerce.number(), // ?
});

export const ContributionMatchesSchema = z.object({
  linked: z.array(ContributionMatchSchema),
  possible: z.array(ContributionMatchSchema),
})

const ExpenditureMatchSchema = z.object({
  /* Transaction */
  expenditure_amt: z.coerce.number(),
  expenditure_date: z.string().date(),
  link: z.coerce.number().optional(), // This is the REST id for match/expenditures. Dont want it to be optional :(
  /* Source */
  org_name: z.string(),
  ein: z.coerce.number(),
  /* Target */
  certainty: z.number().nullable(),
  recipient: z.number().nullable(),
  recipient_name: z.string(),
  /* Unknown */
  form8872_data_id: z.coerce.number(), // ?
  schedule_b_id: z.coerce.number(), // ?
})

export const ExpenditureMatchesSchema = z.object({
  linked: z.array(ExpenditureMatchSchema),
  possible: z.array(ExpenditureMatchSchema),
})