import { z } from 'zod';

/* I was thinking about using z.merge() to append this either type 
  to avoid copy-pasting nearly identical Contribution types but it
  becomes a hastle because you still have to .transform() it to
  coalesce the two essentially optional properties, and also drop
  the original property names, which in all sacrifices a lot of legibility.
*/

export type ContributionsElem = z.infer<typeof ContributionElemSchema>;
export type ExpendituresElem = z.infer<typeof ExpenditureElemSchema>;
export type OrganizationElem = z.infer<typeof OrganizationElemSchema>;
export type AnyElem = z.infer<typeof AnyElemSchema>;
export type ContainerResponse<T extends AnyElem> = z.infer<ReturnType<typeof containerSchemaFactory<z.ZodType<T>>>>;

export type ContributionMatchElem = z.infer<typeof ContributionMatchSchema>;
export type ExpenditureMatchElem = z.infer<typeof ExpenditureMatchSchema>;
export type MatchElem = z.infer<typeof MatchElemSchema>;
export type MatchesResponse<T extends MatchElem> = z.infer<ReturnType<typeof matchSchemaFactory<z.ZodType<T>>>>;

const eitherKey = (a: string, b: string, T: any) => {
  return z.union([
    z.object({ [a]: T, [b]: z.undefined() }),
    z.object({ [b]: T, [a]: z.undefined() })]);
}

export const OrganizationElemSchema = z.object({
  id: z.coerce.number(),
  org_name: z.string(),
  ein: z.coerce.number(),
  total_contrib: z.coerce.number().nullable(),
  total_exp: z.coerce.number().nullable(),
  active: z.coerce.boolean(),
  purpose: z.string(),
})

/* Handles search and org contribution endpoints */
export const ContributionElemSchema = z.object({
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

/* Handles both expenditure endpoints */
export const ExpenditureElemSchema = z.object({
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
  
const AnyElemSchema = z.union([
    ContributionElemSchema, 
    OrganizationElemSchema, 
    ExpenditureElemSchema
]);

// This is allowing us to create specifically typed versions of the base container.
export const containerSchemaFactory = <T extends z.ZodType<AnyElem>>(elementSchema: T) => 
    z.object({
        count: z.number(),
        data: z.array(elementSchema),
});  

export const ContributionMatchSchema = z.object({
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

export const ExpenditureMatchSchema = z.object({
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

const MatchElemSchema = z.union([
    ContributionMatchSchema, 
    ExpenditureMatchSchema
]);

// This is allowing us to create specifically typed versions of the base container.
export const matchSchemaFactory = <T extends z.ZodType<MatchElem>>(elementSchema: T) => 
    z.object({
        linked: z.array(elementSchema),
        possible: z.array(elementSchema)
});
