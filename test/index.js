
const UnionFind = require( "../dist/union-find").UnionFind;
const UnionNode = require( "../dist/union-find").UnionNode;
const expect = require("chai").expect;


describe("Start UnionFind Test",()=>{

    describe("#UnionFind",()=>{
        describe("#constructor()",()=>{
            it("Should be properly initialized with Array",function () {
                let union_find;
                let nodes = ["a","b","c","d","e","f","g"];
                let path = [["a","b","c"],["d","e"],["g","a"]];

                expect(function(){
                    union_find = new UnionFind(nodes,path);
                }).to.not.throw();

                union_find = new UnionFind(nodes,path);
                expect(union_find.nodes.size).to.be.equal(nodes.length);
                expect(union_find.subtree.size).to.be.equal(3);
                expect(union_find.getUnionNode("c").calculateRank()).to.be.equal(3);
                expect(union_find.findRoot("c")).to.be.equal("g");
            });
            it("Should ignore Undefined and null",function () {
                expect(function () {
                    new UnionFind(["a","b","c","d",null,undefined])
                }).to.be.not.throw();
            });
            it("Should be properly initialized with Set",function () {
                let union_find,nodes,path;
                nodes = new Set(["a","b","c","d","e","f"]);
                path = new Set([["a","b","c"],["d","e"]]);
                expect(function(){
                    union_find = new UnionFind(nodes,path);
                }).to.not.throw();
                union_find = new UnionFind(nodes,path);
                expect(union_find.nodes.size).to.be.equal(nodes.size);
                expect(union_find.subtree.size).to.be.equal(3);
            });
            it("Should be properly initialized with no arguments",function () {
                let union_find;
                expect(function(){
                    union_find = new UnionFind();
                }).to.not.throw();
                union_find = new UnionFind();
                expect(union_find.nodes.size).to.be.equal(0);
                expect(union_find.subtree.size).to.be.equal(0);
            });
            it("Should be properly initialized with config",function () {
                let union_find,nodes,path,config;
                nodes = ["a","b","c","d","e","f"];
                path = [
                    ["a","b","c"],["d","e"]
                ];
                config = {
                    repeatExistNode:"error",
                    unionMode:"compress",
                    customToString:function (node) {
                        return "<" + node + ">";
                    }
                };
                expect(function(){
                    union_find = new UnionFind(nodes,path,config);
                }).to.not.throw();

                union_find = new UnionFind(nodes,path,config);
                let addSubtree = function(){
                    union_find.addSubtree(["a","b"])
                };
                expect(addSubtree).to.be.throw();
                union_find.nodes.forEach((node)=>{
                    expect(node.calculateRank()).to.be.most(1);
                });
                let str = union_find.config.customToString("a");
                expect(str).to.be.equal("<a>");
            });
            it("An error should be throw when the type does not match",function () {
                function illegalNodes(){
                    new UnionFind("abc");
                }
                expect(illegalNodes).to.be.throw(TypeError);
                
                function illegalPath(){
                    new UnionFind(["a","b"],"test");
                }
                expect(illegalPath).to.be.throw(TypeError);
                
                function illegalConfig() {
                    new UnionFind(["a","b"],null,"test");
                }
                expect(illegalConfig).to.be.throw(TypeError);
                function illegalConfig1() {
                    new UnionFind(["a","b"],null,{repeatExistNode:"test"});
                }
                expect(illegalConfig1).to.be.throw(TypeError);
                function illegalConfig2() {
                    new UnionFind(["a","b"],null,{customToString:true});
                }
                expect(illegalConfig2).to.be.throw(TypeError);
                function illegalConfig3() {
                    new UnionFind(["a","b"],null,{unionMode:123});
                }
                expect(illegalConfig3).to.be.throw(TypeError);
                expect(function () {
                    new UnionFind(["a","b"],[["a","b"],"test"]);
                }).to.be.throw(TypeError)
            })
        });
        describe("#addSubtree()",function () {
            let union_find = new UnionFind();
            it("Should run correctly with Array",function () {
                function add() {
                    let nodes = ["a","b","c"];
                    let paths = [["a","b"]];
                    union_find.addSubtree(nodes,paths)
                }
                expect(add).to.be.not.throw();
                function add2() {
                    let nodes = null;
                    let paths = [["a","b"]];
                    union_find.addSubtree(nodes,paths)
                }
                expect(add2).to.be.not.throw();
                function add3() {
                    let nodes = ["a","b","c"];
                    let paths = null;
                    union_find.addSubtree(nodes,paths)
                }
                expect(add3).to.be.not.throw();
                function add4() {
                    let nodes = null;
                    let paths = null;
                    union_find.addSubtree(nodes,paths)
                }
                expect(add4).to.be.not.throw();
            });
            it("Should run correctly with Set",function () {
                function add() {
                    let nodes,paths;
                    nodes = new Set(["a","b","c"]);
                    paths = new Set([["a","b"]]);
                    union_find.addSubtree(nodes,paths)
                }
                expect(add).to.be.not.throw();
            });
            it("An error should be throw when the type does not match",function () {
                function testNodes() {
                    union_find.addSubtree("test")
                }
                expect(testNodes).to.be.throw(TypeError);
                function testPaths() {
                    union_find.addSubtree(["a","b","c"],true)
                }
                expect(testPaths).to.be.throw(TypeError);
            })
        });
        
        describe("#changeSetting()",function () {
            let union_find = new UnionFind(["a","b","c"],[["a","b","c"]]);
            it("Should run correctly",function () {
                union_find.changeSetting(
                    {
                        unionMode:"compress",
                        repeatExistNode:"error",
                        customToString:function (node) {
                            return "<" + String(node) + ">";
                        }
                    }
                );
                union_find.addSubtree(["d"],[["b","d"]]);
                expect(union_find.getUnionNode("d").parent).to.be.equal(union_find.getUnionNode("a"));
                expect(function(){union_find.addSubtree(["a"])}).to.be.throw();
                expect(union_find.config.customToString("d")).to.equal("<d>");
                union_find.changeSetting({
                    unionMode:"height",
                    repeatExistNode:"ignore"
                });
                union_find.addSubtree(["e"],[["c","e"]]);
                expect(union_find.getUnionNode("e").parent).to.be.equal(union_find.getUnionNode("d"));
            });
            it("An error should be throw when the type does not match",function () {
                function changeConfig() {
                    union_find.changeSetting({
                        unionMode:123
                    });
                }
                expect(changeConfig).to.be.throw(TypeError);
                function changeConfig2() {
                    union_find.changeSetting({
                        repeatExistNode:"test"
                    });
                }
                expect(changeConfig2).to.be.throw(TypeError);
                function changeConfig3() {
                    union_find.changeSetting({
                        customToString:{"name":"a"}
                    });
                }
                expect(changeConfig3).to.be.throw(TypeError);
            })
        });
        
        describe("#union()",function () {
            let union_find = new UnionFind(["a","b","c","d","e"]);
            it("Should run correctly",function () {
                union_find.union("a", "b");
                expect(union_find.getUnionNode("b").parent.node).to.be.equal("a");
                union_find.union(union_find.getUnionNode("b"), union_find.getUnionNode("c"));
                expect(union_find.findRoot("c")).to.be.equal("a");
                expect(function () {
                    union_find.union("a",null)
                }).to.be.not.throw();
            });

            it("Should throw an Error when node does not exist",function () {
                function union() {
                    union_find.union("a","z");
                }
                expect(union).to.be.throw(Error);
                function union2() {
                    union_find.union("g","a");
                }
                expect(union2).to.be.throw(Error);
                expect(function () {
                    union_find.union(new UnionNode("h"),"a");
                }).to.be.throw();
                expect(function () {
                    union_find.union("a",new UnionNode("i"));
                }).to.be.throw();
            });
            it("Should throw an error  when target's type does not match",function () {
                expect(function () {
                    union_find.union(null,"a");
                }).to.be.throw(TypeError);
                expect(function () {
                    union_find.union(undefined,"g");
                }).to.be.throw(TypeError);
            })
        });
        describe("#_unionAutoCompress()",function () {
            let union_find = new UnionFind(
                ["a","b","c","d","e"],[["a","b","c"]]
            );
            it("Should run correctly",function () {
                union_find.changeSetting({unionMode:"compress"});
                union_find.union("c","a");
                expect(union_find.getUnionNode("c").parent.node).to.be.equal("a");
            })
        });
        describe("#findRoot()",function () {
            let union_find = new UnionFind(["a","b","c","d","e"],[["a","b","c"],["e","a"]]);
            it("Should run correctly",function () {
                expect(union_find.findRoot("a")).to.equal("e");
                expect(union_find.findRoot("e")).to.equal("e");
                expect(union_find.findRoot("d")).to.equal("d");
            });
            it("Should throw an Error when node does not exist",function () {
                expect(function () {
                    union_find.findRoot("g")
                }).to.be.throw();
                expect(function () {
                    union_find.findRoot(new UnionNode("g"))
                }).to.be.throw();
            });
            it("Should throw an error  when the type does not match",function () {
                expect(function () {
                    union_find.findRoot(null)
                }).to.be.throw(TypeError);
                expect(function () {
                    union_find.findRoot(undefined)
                }).to.be.throw(TypeError);
            })
        });
        
        describe("#getUnionNode()",function () {
            let testNode = {name:"test"};
            let union_find = new UnionFind(
                ["a",123,true,testNode,function () {}],
                [["a",123]])
            ;
            it("Should run correctly",function () {
                let node = union_find.getUnionNode("a");
                expect(node.node).to.be.equal("a");
                node = union_find.getUnionNode(123);
                expect(node.node).to.be.equal(123);
                node = union_find.getUnionNode(true);
                expect(node.node).to.be.equal(true);
                node = union_find.getUnionNode(testNode);
                expect(node.node).to.be.equal(testNode);
                expect(node.node).to.be.deep.equal({name:"test"});
            });
            it("Should return Undefined when node does not exist",function () {
                expect(union_find.getUnionNode("b")).to.be.undefined;
            });
            it("Should throw an error  when the type does not match",function () {
                expect(function () {
                    union_find.getUnionNode(null);
                }).to.be.throw(TypeError);
                expect(function () {
                    union_find.getUnionNode(undefined);
                }).to.be.throw(TypeError);
            })
        });
        describe("#isConnected()",function () {
            let union_find = new UnionFind(["a","b","c","d","e"],[["a","b","c"],["e","a"]]);
            it("Should run correctly",function () {
                expect(union_find.isConnected("a","e")).to.be.true;
                expect(union_find.isConnected("a","d")).to.be.false;
            });
            it("Should throw an error when node does not exist",function () {
                expect(function () {
                    union_find.isConnected("a","g")
                }).to.be.throw();
            });
            it("Should throw an error  when the type does not match",function () {
                expect(function () {
                    union_find.isConnected("a",null)
                }).to.be.throw(TypeError);
                expect(function () {
                    union_find.isConnected(undefined,"g")
                }).to.be.throw(TypeError);
            })
        });
        describe("#compress()",function () {
            let union_find = new UnionFind(["a","b","c","d","e"],[["a","b","c"],["e","a"]]);
            it("Should run correctly",function () {
                union_find.compress();
                union_find.nodes.forEach((node)=>{
                    expect(node.calculateRank()).to.be.most(1);
                });
                expect(union_find.isConnected("a","e")).to.be.true;
            });
        });
        describe("#toString()",function () {
            let union_find = new UnionFind(["a","b","c","d","e"],[["a","b","c"],["e","a"]]);
            it("Should run correctly",function () {
                expect(typeof union_find.toString()).to.be.equal("string");
            });
        })
    })

});