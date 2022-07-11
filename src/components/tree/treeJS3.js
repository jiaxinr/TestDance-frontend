import {getReportTreeById} from "@/api/tree";


const data = [
    { id: 56, parentId: 62 },
    { id: 81, parentId: 80 },
    { id: 74, parentId: null },
    { id: 76, parentId: 80 },
    { id: 63, parentId: 62 },
    { id: 80, parentId: 86 },
    { id: 87, parentId: 86 },
    { id: 62, parentId: 74 },
    { id: 86, parentId: 74 },
];

const idMapping = data.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
}, {});

let root;
data.forEach(el => {
    // 判断根节点
    if (el.parentId === null) {
        root = el;
        return;
    }
    // 用映射表找到父元素
    const parentEl = data[idMapping[el.parentId]];
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
});

console.log("root:"+JSON.stringify(root));

export const treedata = {
    "name": "Modeling Methods",
    "children": [
        {
            "name": "Classification",
            "children": [
                {
                    "name": "Logistic regression"
                },
                {
                    "name": "Linear discriminant analysis"
                },
                {
                    "name": "Rules"
                },
                {
                    "name": "Decision trees"
                },
                {
                    "name": "Naive Bayes"
                },
                {
                    "name": "K nearest neighbor"
                },
                {
                    "name": "Probabilistic neural network"
                },
                {
                    "name": "Support vector machine"
                }
            ]
        },
        {
            "name": "Consensus",
            "children": [
                {
                    "name": "Models diversity",
                    "children": [
                        {
                            "name": "Different initializations"
                        },
                        {
                            "name": "Different parameter choices"
                        },
                        {
                            "name": "Different architectures"
                        },
                        {
                            "name": "Different modeling methods"
                        },
                        {
                            "name": "Different training sets"
                        },
                        {
                            "name": "Different feature sets"
                        }
                    ]
                },
                {
                    "name": "Methods",
                    "children": [
                        {
                            "name": "Classifier selection"
                        },
                        {
                            "name": "Classifier fusion"
                        }
                    ]
                },
                {
                    "name": "Common",
                    "children": [
                        {
                            "name": "Bagging"
                        },
                        {
                            "name": "Boosting"
                        },
                        {
                            "name": "AdaBoost"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Regression",
            "children": [
                {
                    "name": "Multiple linear regression"
                },
                {
                    "name": "Partial least squares"
                },
                {
                    "name": "Multi-layer feedforward neural network"
                },
                {
                    "name": "General regression neural network"
                },
                {
                    "name": "Support vector regression"
                }
            ]
        }
    ]
}