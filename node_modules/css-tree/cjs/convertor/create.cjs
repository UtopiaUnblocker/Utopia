'use strict';

const List = require('../utils/List.cjs');

function createConvertor(walk) {
    return {
        fromPlainObject: function(ast) {
            walk(ast, {
                enter: function(node) {
                    if (node.children && node.children instanceof List.List === false) {
                        node.children = new List.List().fromArray(node.children);
                    }
                }
            });

            return ast;
        },
        toPlainObject: function(ast) {
            walk(ast, {
                leave: function(node) {
                    if (node.children && node.children instanceof List.List) {
                        node.children = node.children.toArray();
                    }
                }
            });

            return ast;
        }
    };
}

exports.createConvertor = createConvertor;
