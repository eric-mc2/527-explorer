import { z } from 'zod';

const NodeIdSchema = z.string().or(z.number());
const NodeRoleSchema = z.enum(['O','C','R']);

const NodeSchema = z.object({
    id: NodeIdSchema,
    name: z.string(),
    role: NodeRoleSchema,
    // Other stuff ...?
});

const EdgeSchema = z.object({
    source: NodeIdSchema,
    target: NodeIdSchema,
    // Other stuff ...(value, directed)?
});

const GraphSchema = z.object({
    nodes: z.array(NodeSchema),
    links: z.array(EdgeSchema),
});

type Node = z.infer<typeof NodeSchema>;
type Edge = z.infer<typeof EdgeSchema>;


export class Graph {
    nodes: Node[];
    links: Edge[];

    get edges() {
        return this.links;
    }    
    set edges(value: any[]) {
        this.links = value;
    }

    constructor(nodes: Array<Node> = [], links: Array<Edge>= []) {
        GraphSchema.parse({nodes, links});
        this.nodes = nodes;
        this.links = links;
    }
  
    union(other: Graph): Graph {
        const nodes = new Set([...this.nodes, ...other.nodes]);
        const links = new Set([...this.links, ...other.links]);
        return new Graph([...nodes], [...links]);
    }
}