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
export interface customToString {
    (node?: any, unionNode?: UnionNode, unionFind?: UnionFind): string;
}
export declare enum repeatExistNode {
    ignore = "ignore",
    warning = "warning",
    error = "error"
}
export declare enum unionMode {
    normal = "normal",
    height = "height",
    compress = "compress"
}
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
     * @param nodes
     * @param path
     * @param config
     */
    constructor(nodes?: any[] | Set<any>, path?: [][] | Set<any>, config?: Config);
    /**
     * @description Add an subtree
     * @param nodes
     * @param paths
     */
    addSubtree(nodes?: any[] | Set<any>, paths?: any[][] | Set<any[]>): void;
    protected _addNodes(nodes: any[] | Set<any>): void;
    protected _addPaths(path: any[][] | Set<any[]>): void;
    /**
     * @description defaultConfig
     */
    protected _defaultConfig(config: Config): void;
    /**
     * @description Change Settings
     * @param config
     */
    changeSettings(config: Config): void;
    /**
     * @description 连接两个节点
     * @param nodeA
     * @param nodeB
     */
    union(nodeA: UnionNode, nodeB: UnionNode): void;
    union(nodeA: any, nodeB: any): void;
    protected _unionNormal(nodeA: UnionNode, nodeB?: UnionNode): void;
    /**
     * @description 连接两点，新的节点将连接到根节点上
     */
    protected _unionAutoCompress(nodeA: UnionNode, nodeB: UnionNode): void;
    /**
     * @description 连接两点，新的节点将连接到轶最小的节点上
     */
    protected _unionByHeight(nodeA: UnionNode, nodeB: UnionNode): void;
    /**
     * @description 查找根节点
     * @param node
     */
    findRoot(node: UnionNode): UnionNode;
    findRoot(node: any): any;
    /**
     * @description 根据节点获取联通节点
     * @param node
     */
    getUnionNode(node: any): UnionNode | undefined;
    /**
     * @description 两个节点是否联通
     * @param nodeA
     * @param nodeB
     */
    isConnected(nodeA: UnionNode, nodeB: UnionNode): boolean;
    isConnected(nodeA: any, nodeB: any): boolean;
    /**
     * @description 压缩路径
     */
    compress(): void;
    /**
     * @description 显示为树
     */
    toString(): string;
}
//# sourceMappingURL=union-find.d.ts.map