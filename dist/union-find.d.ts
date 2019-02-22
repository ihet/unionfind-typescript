/**
 * @class UnionNode
 */
export declare class UnionNode {
    parent: UnionNode;
    node: any;
    children: Set<UnionNode>;
    constructor(node: any);
    /**
     * Get UnionNode's rank
     */
    calculateRank(): number;
}
/************************************************************
 * Config Interface Start
 ************************************************************/
/**
 * @interface customToString
 */
export interface customToString {
    (node?: any, unionNode?: UnionNode, unionFind?: UnionFind): string;
}
/**
 * @enum repeatExistNode
 */
export declare enum repeatExistNode {
    ignore = "ignore",
    warning = "warning",
    error = "error"
}
/**
 * @enum unionMode
 */
export declare enum unionMode {
    normal = "normal",
    height = "height",
    compress = "compress"
}
/**
 * @interface Config
 */
export interface Config {
    customToString?: customToString;
    unionMode?: unionMode;
    repeatExistNode?: repeatExistNode;
    [propname: string]: any;
}
/************************************************************
 * Config Interface End
 ************************************************************/
/**
 * @class UnionFind
 */
export declare class UnionFind {
    protected _subtree: Map<any, UnionNode>;
    protected _nodes: Map<any, UnionNode>;
    protected _config: {
        unionMode: unionMode;
        repeatExistNode: repeatExistNode;
        customToString: Function;
        [propname: string]: any;
    };
    readonly nodes: Map<any, UnionNode>;
    readonly subtree: Map<any, UnionNode>;
    readonly config: {
        [propname: string]: any;
        unionMode: unionMode;
        repeatExistNode: repeatExistNode;
        customToString: Function;
    };
    /**
     * Initialize
     * @constructor
     * @param nodes Nodes Array
     * @param path Path Array
     * @param config Config Object
     */
    constructor(nodes?: any[] | Set<any>, path?: [][] | Set<any>, config?: Config);
    /**
     * @description Add  subtrees
     * @param nodes Nodes Array
     * @param paths Path Array
     */
    addSubtree(nodes?: any[] | Set<any>, paths?: any[][] | Set<any[]>): void;
    protected _addNodes(nodes: any[] | Set<any>): void;
    protected _addPaths(path: any[][] | Set<any[]>): void;
    /**
     * @description defaultConfig
     * @param config Config Object
     */
    protected _defaultConfig(config: Config): void;
    /**
     * @description Change Settings
     * @param config Config Object
     */
    changeSettings(config: Config): void;
    /**
     * @description Union two Nodes
     * @param nodeA target node
     * @param nodeB source node
     * @example <caption>Basic Usage</caption>
     * <pre>
     * let unionFind = new UnionFind(["a","b","c"],[["a","b"]]);
     * unionFind.union("b","c");// => "b" is the parent of "c"
     * </pre>
     * @example <caption>Compression Union</caption>
     * <pre>
     * let unionFind = new UnionFind(["a","b","c","d"],[["a","b","c"]],{unionMode:unionMode.compress});
     * unionFind.union("c","d");// => "a" is the parent of "d"
     * </pre>
     */
    union(nodeA: UnionNode, nodeB: UnionNode): void;
    union(nodeA: any, nodeB: any): void;
    protected _unionNormal(nodeA: UnionNode, nodeB?: UnionNode): void;
    protected _unionAutoCompress(nodeA: UnionNode, nodeB: UnionNode): void;
    protected _unionByHeight(nodeA: UnionNode, nodeB: UnionNode): void;
    /**
     * @description Find root node
     * @param node A node to find root node
     */
    findRoot(node: UnionNode): UnionNode;
    findRoot(node: any): any;
    /**
     * @description Get UnionNode
     * @param node A key node
     */
    getUnionNode(node: any): UnionNode | undefined;
    /**
     * @description Whether two nodes are connected
     * @param nodeA The first node
     * @param nodeB The second node
     */
    isConnected(nodeA: UnionNode, nodeB: UnionNode): boolean;
    isConnected(nodeA: any, nodeB: any): boolean;
    /**
     * @description Compress all path
     */
    compress(): void;
    /**
     * @description returns a string representing all subtrees
     * @return
     */
    toString(): string;
}
//# sourceMappingURL=union-find.d.ts.map