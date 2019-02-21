"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class UnionNode
 */
var UnionNode = /** @class */ (function () {
    function UnionNode(node) {
        this.children = new Set();
        this.parent = this;
        this.node = node;
    }
    /**
     * Get UnionNode's rank
     */
    UnionNode.prototype.calculateRank = function () {
        function find(node, rank) {
            if (node.parent === node) {
                return rank;
            }
            return find(node.parent, rank + 1);
        }
        return find(this, 0);
    };
    return UnionNode;
}());
exports.UnionNode = UnionNode;
var repeatExistNode;
(function (repeatExistNode) {
    repeatExistNode["ignore"] = "ignore";
    repeatExistNode["warning"] = "warning";
    repeatExistNode["error"] = "error";
})(repeatExistNode = exports.repeatExistNode || (exports.repeatExistNode = {}));
var unionMode;
(function (unionMode) {
    unionMode["normal"] = "normal";
    unionMode["height"] = "height";
    unionMode["compress"] = "compress";
})(unionMode = exports.unionMode || (exports.unionMode = {}));
/************************************************************
 * Config Interface End
 ************************************************************/
/**
 * @class UnionFind
 */
var UnionFind = /** @class */ (function () {
    /**
     * Initialize
     * @constructor
     * @param nodes
     * @param path
     * @param config
     */
    function UnionFind(nodes, path, config) {
        if (config === void 0) { config = {}; }
        this._defaultConfig(config);
        this._subtree = new Map();
        this._nodes = new Map();
        if (nodes) {
            this.addSubtree(nodes, path);
        }
    }
    Object.defineProperty(UnionFind.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnionFind.prototype, "subtree", {
        get: function () {
            return this._subtree;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnionFind.prototype, "config", {
        get: function () {
            return this._config;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Add an subtree
     * @param nodes
     * @param paths
     */
    UnionFind.prototype.addSubtree = function (nodes, paths) {
        if (!nodes && !paths)
            return;
        if (nodes) {
            this._addNodes(nodes);
        }
        if (paths) {
            this._addPaths(paths);
        }
    };
    UnionFind.prototype._addNodes = function (nodes) {
        var _this = this;
        if (nodes instanceof Array) {
            nodes = new Set(nodes);
        }
        else if (!(nodes instanceof Set)) {
            throw new TypeError("Nodes should be Array or Set");
        }
        nodes.forEach(function (node) {
            if (node === undefined || node === null) {
                return;
            }
            if (!_this._nodes.has(node)) {
                var unionNode = new UnionNode(node);
                _this._subtree.set(node, unionNode);
                _this._nodes.set(node, unionNode);
            }
            else {
                var msg = _this._config.customToString(node) + " already exists";
                switch (_this._config.repeatExistNode) {
                    case repeatExistNode.warning:
                        console.warn(msg);
                        break;
                    case repeatExistNode.error:
                        throw new Error(msg);
                    default:
                }
            }
        }, this);
    };
    UnionFind.prototype._addPaths = function (path) {
        var _this = this;
        if (path instanceof Array) {
            path = new Set(path);
        }
        else if (!(path instanceof Set)) {
            throw new TypeError("Path should be Array or Set");
        }
        path.forEach(function (value) {
            if (!(value instanceof Array)) {
                throw new TypeError("Path should be Array");
            }
            value.forEach(function (nodeA, index) {
                if (index < value.length - 1) {
                    _this.union(nodeA, value[index + 1]);
                }
            }, _this);
        }, this);
    };
    /**
     * @description defaultConfig
     */
    UnionFind.prototype._defaultConfig = function (config) {
        this._config = {
            unionMode: unionMode.normal,
            repeatExistNode: repeatExistNode.ignore,
            customToString: function (node) {
                return String(node);
            }
        };
        this.changeSettings(config);
    };
    /**
     * @description Change Settings
     * @param config
     */
    UnionFind.prototype.changeSettings = function (config) {
        if (typeof config === "object") {
            if (config.unionMode) {
                var modes = new Set([unionMode.height, unionMode.compress, unionMode.normal]);
                if (!modes.has(config.unionMode)) {
                    throw new TypeError("Config unionMode is illegal");
                }
            }
            if (config.repeatExistNode) {
                var modes = new Set([repeatExistNode.ignore, repeatExistNode.error, repeatExistNode.warning]);
                if (!modes.has(config.repeatExistNode)) {
                    throw new TypeError("Config repeatExistNode is illegal");
                }
            }
            if (config.customToString && typeof config.customToString != "function") {
                throw new TypeError("Config customToString is illegal");
            }
            Object.assign(this._config, config);
        }
        else {
            throw new TypeError("Config must be an Object");
        }
    };
    UnionFind.prototype.union = function (nodeA, nodeB) {
        var _nodeA = nodeA, _nodeB = nodeB;
        if (nodeB === undefined || nodeB === null)
            return;
        if (!(nodeA instanceof UnionNode)) {
            _nodeA = this._nodes.get(nodeA);
            if (_nodeA === undefined) {
                throw new TypeError("Can not connect Undefined nodes");
            }
        }
        else if (!this._nodes.has(_nodeA.node)) {
            throw new Error("Can not connect Undefined nodes");
        }
        if (!(nodeB instanceof UnionNode)) {
            _nodeB = this._nodes.get(nodeB);
            if (_nodeB === undefined) {
                throw new TypeError("Can not connect Undefined nodes");
            }
        }
        else if (!this._nodes.has(_nodeB.node)) {
            throw new Error("Can not connect Undefined nodes");
        }
        switch (this._config.unionMode) {
            case unionMode.compress:
                this._unionAutoCompress(_nodeA, _nodeB);
                break;
            case unionMode.height:
                this._unionByHeight(_nodeA, _nodeB);
                break;
            default:
                this._unionNormal(_nodeA, _nodeB);
        }
    };
    UnionFind.prototype._unionNormal = function (nodeA, nodeB) {
        var rootA = this.findRoot(nodeA);
        var rootB = this.findRoot(nodeB);
        if (rootA === rootB) {
            return;
        }
        this._subtree.delete(rootB.node);
        rootB.parent = nodeA;
        nodeA.children.add(rootB);
    };
    /**
     * @description 连接两点，新的节点将连接到根节点上
     */
    UnionFind.prototype._unionAutoCompress = function (nodeA, nodeB) {
        var rootA = this.findRoot(nodeA);
        if (nodeB === rootA) {
            rootA = nodeB;
            nodeB = nodeA;
        }
        if (nodeB.parent !== nodeB) {
            nodeB.parent.children.delete(nodeB);
        }
        else {
            this._subtree.delete(nodeB.node);
        }
        nodeB.parent = rootA;
        rootA.children.add(nodeB);
    };
    /**
     * @description 连接两点，新的节点将连接到轶最小的节点上
     */
    UnionFind.prototype._unionByHeight = function (nodeA, nodeB) {
        var rootA = this.findRoot(nodeA), minNode = rootA, minRank;
        function findMin(currentNode, rank) {
            var e_1, _a;
            if (currentNode.children.size) {
                try {
                    for (var _b = __values(currentNode.children.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var childNode = _c.value;
                        if (findMin(childNode, rank + 1)) {
                            return true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return false;
            }
            else {
                if (rank <= 1) {
                    minRank = rank;
                    minNode = currentNode;
                    return true;
                }
                else if (!minRank || minRank && rank < minRank) {
                    minRank = rank;
                    minNode = currentNode;
                    return false;
                }
            }
        }
        findMin(rootA, 0);
        this._unionNormal(minNode, nodeB);
    };
    UnionFind.prototype.findRoot = function (node) {
        if (typeof node == "undefined" || node === null) {
            throw new TypeError("Undefined and Null is illegal");
        }
        var _node = node;
        //any
        if (!(node instanceof UnionNode)) {
            _node = this._nodes.get(node);
            if (_node === undefined) {
                throw new Error("Node does not exist");
            }
        }
        //UnionNode
        else if (!this._nodes.has(_node.node)) {
            throw new Error("Node does not exist");
        }
        function find(currentNode) {
            if (currentNode.parent == currentNode) {
                if (!(node instanceof UnionNode)) {
                    return currentNode.node;
                }
                else {
                    return currentNode;
                }
            }
            else {
                return find(currentNode.parent);
            }
        }
        return find(_node);
    };
    /**
     * @description 根据节点获取联通节点
     * @param node
     */
    UnionFind.prototype.getUnionNode = function (node) {
        if (typeof node == "undefined" || node === null) {
            throw new TypeError("Undefined and Null is illegal");
        }
        return this._nodes.get(node);
    };
    UnionFind.prototype.isConnected = function (nodeA, nodeB) {
        if (nodeB === undefined || nodeA === undefined || nodeA === null || nodeB === null) {
            throw new TypeError("Undefined and Null is illegal");
        }
        var _nodeA = nodeA, _nodeB = nodeB;
        if (!(nodeA instanceof UnionNode)) {
            _nodeA = this._nodes.get(nodeA);
            if (_nodeA === undefined) {
                throw new Error("Can not connect Undefined nodes");
            }
        }
        else if (!this._nodes.has(_nodeA.node)) {
            throw new Error("Can not connect Undefined nodes");
        }
        if (!(nodeB instanceof UnionNode)) {
            _nodeB = this._nodes.get(nodeB);
            if (_nodeB === undefined) {
                throw new Error("Can not connect Undefined nodes");
            }
        }
        else if (!this._nodes.has(_nodeB.node)) {
            throw new Error("Can not connect Undefined nodes");
        }
        var rootA = this.findRoot(_nodeA);
        var rootB = this.findRoot(_nodeB);
        return rootA === rootB;
    };
    /**
     * @description 压缩路径
     */
    UnionFind.prototype.compress = function () {
        var _this = this;
        this._nodes.forEach(function (unionNode) {
            var root = _this.findRoot(unionNode);
            if (unionNode.parent !== unionNode && unionNode.parent !== root) {
                unionNode.parent.children.delete(unionNode);
                unionNode.parent = root;
            }
        }, this);
    };
    /**
     * @description 显示为树
     */
    UnionFind.prototype.toString = function () {
        var treeStr = "";
        var _self = this;
        function repeat(str, times) {
            var n = 0;
            var result = "";
            while (n < times) {
                result += str;
                n += 1;
            }
            return result;
        }
        function show(unionNode, rank) {
            var nodestr = String(_self._config.customToString(unionNode.node));
            treeStr += nodestr;
            unionNode.children.forEach(function (childNode) {
                treeStr += "\n" + repeat("|    ", rank) + "|" + repeat("-", 4);
                show(childNode, rank + 1);
            });
        }
        this._subtree.forEach(function (value) {
            show(value, 0);
            treeStr += "\n\n";
        }, this);
        return treeStr;
    };
    return UnionFind;
}());
exports.UnionFind = UnionFind;
//# sourceMappingURL=union-find.js.map