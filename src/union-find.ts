/**
 * @class UnionNode
 */
export class UnionNode{
    public parent:UnionNode;
    public node:any;
    public children:Set<UnionNode> = new Set();
    constructor(node:any){
        this.parent = this;
        this.node = node;
    }

    /**
     * Get UnionNode's rank
     */
    calculateRank():number{
        function find(node:UnionNode,rank:number):number{
            if(node.parent === node){
                return rank;
            }
            return find(node.parent,rank+1);
        }
        return find(this,0);
    }
}

/************************************************************
 * Config Interface Start
 ************************************************************/

/**
 * @interface customToString
 */
export interface customToString {
    (node?:any,unionNode?:UnionNode,unionFind?:UnionFind):string
}

/**
 * @enum repeatExistNode
 */
export enum repeatExistNode{
    ignore ="ignore",
    warning ="warning",
    error ="error",
}

/**
 * @enum unionMode
 */
export enum unionMode {
    normal = "normal",
    height = "height",
    compress = "compress"
}

/**
 * @interface Config
 */
export interface Config {
    customToString?:customToString,
    unionMode?: unionMode,
    repeatExistNode?:repeatExistNode,
    [propname:string]:any
}

/************************************************************
 * Config Interface End
 ************************************************************/

/**
 * @class UnionFind
 */
export class UnionFind{
    protected _subtree : Map<any,UnionNode>;
    protected _nodes : Map<any,UnionNode>;
    protected _config:{
        unionMode:unionMode,
        repeatExistNode:repeatExistNode,
        customToString:Function,
        [propname:string]:any
    };
    get nodes(){
        return this._nodes;
    }
    get subtree(){
        return this._subtree;
    }
    get config(){
        return this._config;
    }
    /**
     * Initialize
     * @constructor
     * @param nodes Nodes Array
     * @param path Path Array
     * @param config Config Object
     */
    constructor(nodes?: any[] | Set<any> , path?: [][] | Set<any> , config: Config = {}){
        this._defaultConfig(config);

        this._subtree = new Map();
        this._nodes = new Map();

        if(nodes){
            this.addSubtree(nodes,path);
        }
    }

    /**
     * @description Add  subtrees
     * @param nodes Nodes Array
     * @param paths Path Array
     * @example <caption>Base Usage</caption>
     * <pre>
     * let unionFind = new UnionFind(["a","b","c"]);
     * unionFind.addSubtree(
     *     ["d","e"],
     *     [ ["a","b","c"],["d","e"]]
     * );
     * // => "a","b","c" is a subtree, "d","e" is a subtree
     * </pre>
     */
    addSubtree(nodes?: any[] | Set<any>,paths?:any[][] | Set<any[]>):void{
        if(!nodes && !paths) return;
        if(nodes){
            this._addNodes(nodes);
        }
        if(paths){
            this._addPaths(paths);
        }
    }

    protected _addNodes(nodes: any[] | Set<any>):void{
        if(nodes instanceof Array){
            nodes = new Set(nodes);
        }else if( !(nodes instanceof Set)){
            throw new TypeError("Nodes should be Array or Set");
        }
        nodes.forEach( (node:any)=>{
            if(node === undefined || node === null){
                return;
            }
            if(!this._nodes.has(node)){
                let unionNode = new UnionNode(node);
                this._subtree.set(node,unionNode);
                this._nodes.set(node,unionNode);
            }else{
                let msg = this._config.customToString(node) + " already exists";
                switch (this._config.repeatExistNode) {
                    case repeatExistNode.warning:
                        console.warn(msg);break;
                    case repeatExistNode.error:
                        throw new Error(msg);
                    default:
                }
            }
        },this);
    }

    protected _addPaths(path:any[][] | Set<any[]>){
        if(path instanceof Array){
            path = new Set(path);
        }else if( !(path instanceof Set)){
            throw new TypeError("Path should be Array or Set");
        }
        path.forEach((value)=>{
            if(!(value instanceof Array)){
                throw new TypeError("Path should be Array");
            }
            value.forEach((nodeA,index)=>{
                if(index<value.length-1){
                    this.union(nodeA,value[index+1])
                }
            },this);

        },this)
    }
    /**
     * @description defaultConfig
     * @param config Config Object
     */
    protected _defaultConfig(config:Config):void{
        this._config = {
            unionMode:unionMode.normal,
            repeatExistNode:repeatExistNode.ignore,
            customToString:(node:any)=>{
                return String(node);
            }
        };
        this.changeSettings(config);
    }

    /**
     * @description Change Settings
     * @param config Config Object
     */
    changeSettings(config:Config):void{
        if(typeof config === "object"){
            if(config.unionMode){
                if(!Object.prototype.hasOwnProperty.call(unionMode,[config.unionMode])){
                    throw new TypeError("Config unionMode is illegal");
                }
            }
            if(config.repeatExistNode){
                if(!Object.prototype.hasOwnProperty.call(repeatExistNode,[config.repeatExistNode])){
                    throw new TypeError("Config repeatExistNode is illegal");
                }
            }
            if(config.customToString && typeof config.customToString != "function"){
                throw new TypeError("Config customToString is illegal")
            }
            Object.assign(this._config,config);
        }else{
            throw new TypeError("Config must be an Object");
        }
    }

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
    union (nodeA:UnionNode,nodeB:UnionNode):void;
    union (nodeA:any,nodeB:any):void
    union (nodeA,nodeB):void {
        let _nodeA = nodeA, _nodeB = nodeB;

        if(nodeB === undefined || nodeB === null) return;

        if(!(nodeA instanceof UnionNode)){
            _nodeA = this._nodes.get(nodeA);
            if(_nodeA === undefined){
                throw new TypeError("Can not connect Undefined nodes");
            }
        }else if(!this._nodes.has(_nodeA.node)){
            throw new Error("Can not connect Undefined nodes");
        }

        if(!(nodeB instanceof UnionNode)){
            _nodeB = this._nodes.get(nodeB);
            if(_nodeB === undefined){
                throw new TypeError("Can not connect Undefined nodes");
            }
        }else if(!this._nodes.has(_nodeB.node)){
            throw new Error("Can not connect Undefined nodes");
        }

        switch (this._config.unionMode) {
            case unionMode.compress:
                this._unionAutoCompress(_nodeA,_nodeB); break;
            case unionMode.height:
                this._unionByHeight(_nodeA,_nodeB);break;
            default:
                this._unionNormal(_nodeA,_nodeB)
        }

    }

    protected _unionNormal(nodeA:UnionNode,nodeB?:UnionNode):void{
        let rootA = this.findRoot(nodeA);
        let rootB = this.findRoot(nodeB);

        if(rootA === rootB){return;}

        this._subtree.delete(rootB.node);
        rootB.parent = nodeA;
        nodeA.children.add(rootB);
    }


    protected _unionAutoCompress(nodeA:UnionNode,nodeB:UnionNode):void{

        let rootA = this.findRoot(nodeA);

        if(nodeB === rootA){
            rootA = nodeB;
            nodeB = nodeA;
        }
        if(nodeB.parent !== nodeB){
            nodeB.parent.children.delete(nodeB);
        }else{
            this._subtree.delete(nodeB.node);
        }
        nodeB.parent = rootA;
        rootA.children.add(nodeB);

    }

    protected _unionByHeight(nodeA:UnionNode,nodeB:UnionNode):void{
        let rootA = this.findRoot(nodeA) , minNode = rootA, minRank;
        function findMin(currentNode:UnionNode, rank:number) {
            if(currentNode.children.size){
                for(let childNode of currentNode.children.values()){
                    if(findMin(childNode,rank+1)){
                        return true;
                    }
                }
                return false;
            }else{
                if(rank<=1){
                    minRank = rank;
                    minNode = currentNode;
                    return true;
                }else if(!minRank || minRank && rank<minRank){
                    minRank = rank;
                    minNode = currentNode;
                    return false;
                }
            }
        }
        findMin(rootA,0);
        this._unionNormal(minNode,nodeB);
    }
    /**
     * @description Find root node
     * @param node A node to find root node
     */
    findRoot(node:UnionNode):UnionNode;
    findRoot(node:any):any;
    findRoot(node):any{
        if(typeof node == "undefined" || node === null){
            throw new TypeError("Undefined and Null is illegal");
        }
        let _node = node;
        //any
        if(!(node instanceof UnionNode)){
            _node = this._nodes.get(node);
            if(_node === undefined){
                throw new Error("Node does not exist");
            }
        }
        //UnionNode
        else if(!this._nodes.has(_node.node)){
            throw new Error("Node does not exist");
        }
        function find(currentNode:UnionNode) {
            if(currentNode.parent == currentNode){
                if(!(node instanceof UnionNode)){
                    return currentNode.node;
                }else{
                    return currentNode
                }
            }else{
                return find(currentNode.parent);
            }
        }
        return find(_node);
    }

    /**
     * @description Get UnionNode
     * @param node A key node
     */
    getUnionNode(node:any):UnionNode|undefined{
        if(typeof node == "undefined" || node === null){
            throw new TypeError("Undefined and Null is illegal");
        }
        return this._nodes.get(node);
    }

    /**
     * @description Whether two nodes are connected
     * @param nodeA The first node
     * @param nodeB The second node
     */
    isConnected(nodeA:UnionNode,nodeB:UnionNode):boolean
    isConnected(nodeA:any,nodeB:any):boolean
    isConnected(nodeA,nodeB):boolean{
        if(nodeB === undefined || nodeA === undefined || nodeA === null || nodeB === null) {
            throw new TypeError("Undefined and Null is illegal")
        }
        let _nodeA = nodeA, _nodeB = nodeB;

        if(!(nodeA instanceof UnionNode)){
            _nodeA = this._nodes.get(nodeA);
            if(_nodeA === undefined){
                throw new Error("Can not connect Undefined nodes");
            }
        }else if(!this._nodes.has(_nodeA.node)){
            throw new Error("Can not connect Undefined nodes");
        }

        if(!(nodeB instanceof UnionNode)){
            _nodeB = this._nodes.get(nodeB);
            if(_nodeB === undefined){
                throw new Error("Can not connect Undefined nodes");
            }
        }else if(!this._nodes.has(_nodeB.node)){
            throw new Error("Can not connect Undefined nodes");
        }

        let rootA:any = this.findRoot(_nodeA);
        let rootB:any = this.findRoot(_nodeB);
        return rootA === rootB;
    }

    /**
     * @description Compress all path
     */
    compress():void{

        this._nodes.forEach((unionNode)=>{
            let root:UnionNode = this.findRoot(unionNode);
            if(unionNode.parent !== unionNode && unionNode.parent!== root){
                unionNode.parent.children.delete(unionNode);
                unionNode.parent = root;
            }
        },this)
    }

    /**
     * @description returns a string representing all subtrees
     * @return
     */
    toString():string{
        let treeStr = "";
        let _self = this;
        function repeat(str:string,times:number):string {
            let n:number = 0;
            let result:string ="";
            while (n<times){
                result+=str;
                n+=1;
            }
            return result;
        }
        function show(unionNode:UnionNode,rank:number):void {
            let nodestr = String(_self._config.customToString(unionNode.node));
            treeStr += nodestr;
            unionNode.children.forEach( (childNode)=>{
                treeStr +="\n"+repeat("|    ",rank) + "|"+ repeat("-",4);
                show(childNode,rank+1);
            })
        }
        this._subtree.forEach( (value)=>{
            show(value,0);
            treeStr += "\n\n" ;
        },this);
        return treeStr;
    }

}
