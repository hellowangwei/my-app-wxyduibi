import {replaceCommonJsonToTag,getExplain,} from '../../../utils/createRender'
// import WEB_API from './../../../API/api'
import {SUBJECT_PART_TO_STRING} from '../../../utils/questionManageType'
let reverseParseText = (data) => {
    let obj = createRender(data,0);
    let stem = {};
    let answer = {};
    let explain = '';
    let style = {};
    let leftList = [];
    let rightList = [];
    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
        }else if (v.indexOf("left") > -1) {
            // 左侧列表
            leftList = obj[v];
        }else if (v.indexOf("right") > -1) {
            // 右侧列表
            rightList = obj[v];
        }else if(v.indexOf("style") > -1) {
            /*处理段落样式*/
            style = JSON.parse(obj[v]);
        }else if(v.indexOf('answer') > -1) {
            /*处理答案*/
            // 填空题，选择题答案格式不同
            answer = obj[v];
        }else if(v.indexOf('explain') > -1) {
            /*处理解析*/
            explain = obj[v]
        }
    })
    return {
        stem,
        explain,
        style,
        answer,
        leftList,
        rightList
    }
}

let reverseParseTextView = data => {
    let obj;
    obj = createRender(data);
    let stem = "";
    let leftList = [];
    let rightList = [];
    let answer = "";
    let explain = '';
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            stem += obj[val];
        } else if (val === 'left') {
            // 左侧列表
            leftList = obj[val];
        } else if (val === 'right') {
            // 右侧列表
            rightList = obj[val];
        } else if (val === 'answer') {
            answer = obj[val];
        }else if(val === 'explain') {
            /*处理解析*/
            explain = obj[val]
        }
    });
    return {
        stem,
        leftList,
        rightList,
        answer,
        explain
    };
}

function createRender(data,showType = 1) {
    if (!data.stem) {
        return {};
    }
    let render = {};
    //匹配左右的选项
    let left = [];
    let right = [];
// 匹配解析
    let explain = {explain: getExplain(data.explain)};
    let answer = {answer: {}};
    if (data.answer) {
        answer['answer'] = JSON.parse(data.answer).match;
        if(!answer['answer']){
            var aa = JSON.parse(data.answer)
            JSON.parse(data.answer)[0]&&(answer['answer'] = JSON.parse(data.answer)[0].content);
        }
    }
// 匹配题干
    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph, style, result1} = getParagraphLigatureForEdit(data, 'paragraph');
            var arrRight = JSON.parse(result1).right;
            var arrLeft = JSON.parse(result1).left;
            arrLeft.forEach((d, i) => {
                let result = parseLeftRightForEdit(d.content, d.id);
                left.push(result)
            });
            arrRight.forEach((d, i) => {
                let result = parseLeftRightForEdit(d.content, d.id);
                right.push(result)
            });
            render = Object.assign({}, paragraph, style, {left}, {right}, answer,explain);
            break;
        case 1:
            // 匹配 stem
            var {paragraph, style, result1} = getParagraphLigature(data, 'paragraph');
            var arrRight = JSON.parse(result1).right;
            var arrLeft = JSON.parse(result1).left;
            arrLeft.forEach((d, i) => {
                let result = parseLeftRight(d.content, d.id);
                left.push(result)
            });
            arrRight.forEach((d, i) => {
                let result = parseLeftRight(d.content, d.id);
                right.push(result)
            });
            render = Object.assign({}, paragraph, style, {left}, {right}, answer,explain);
            break;
        default:
            break;
    }
    return render;
}

function getParagraphLigature(data, paragraphKindName) {
    let str = data.stem
    let subject = SUBJECT_PART_TO_STRING[data.subject]
    let reg = new RegExp(`#{"type":"para_begin","style":"${subject}_matching"}##{"type":"match","left"`,"gi")
    let subIndex = reg.exec(str).index
    let result1 = '';//连线部分数据
    if (subIndex || subIndex === 0) {
        result1 = str.substr(subIndex)
        str = str.replace(result1, '')
    }
    var result = '',
        style = {style: {}},
        paragraph = {};
    if (str === '') {
        result = '"#{"type":"para_begin","style":"math_guide"}##{"type":"para_end"}#"';
    } else {
        result = replaceCommonJsonToTag(str);
    }

    var p = result.split(`#{"type":"P"}#`);
    result = p.map(function (val) {
        return `<p>${val}</p>`;
    });
    result = result.join('');
    let pattern = /#{(.+?)}#/g;
    var block = result.match(pattern);
    let index = 0;
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = JSON.parse(content);
        switch (obj.type) {
            case 'para_begin':
                style['style'][`${paragraphKindName}${index}`] = obj.style;
                index++;
                break;
            default:
                break;
        }
    });
    result1 = result1.replace(`#{"type":"para_begin","style":"${subject}_matching"}##`, '')
    result1 = result1.replace(`##{"type":"para_end"}#`, '')

    var reg_stem = /#\{"type":"para_begin"[^\}]*\}#(.*?)#\{"type":"para_end"\}#/ig;
    let firstRes = reg_stem.exec(result);
    if (!firstRes) return {};
    paragraph[`${paragraphKindName}0`] = '<p class="' + style['style'][`${paragraphKindName}0`] + '">' + firstRes[1] + '</p>';
    let key = 0;
    while (reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if (!pp) break;
        key++;
        paragraph[`${paragraphKindName}${key}`] = '<p class="' + style['style'][`${paragraphKindName}${key}`] + '">' + pp[1] + '</p>';
    }
    style['style'] = JSON.stringify(style['style']);
    return {paragraph, style, result1};
}
function getParagraphLigatureForEdit(data, paragraphKindName) {
    let str = data.stem
    let subject = SUBJECT_PART_TO_STRING[data.subject]
    let reg = new RegExp(`#{"type":"para_begin","style":"${subject}_matching"}##{"type":"match","left"`,"gi")
    let subIndex = reg.exec(str).index
    let result1 = '';//连线部分数据
    if (subIndex || subIndex === 0) {
        result1 = str.substr(subIndex)
        str = str.replace(result1, '')
    }
    var result = '',
        style = {style: {}},
        paragraph = {};
    if (str === '') {
        result = '"#{"type":"para_begin","style":"math_guide"}##{"type":"para_end"}#"';
    } else {
        result = replaceCommonJsonToTag(str,'edit');
    }

    var p = result.split(`#{"type":"P"}#`);
    result = p.map(function (val) {
        return `<p>${val}</p>`;
    });
    result = result.join('');
    let pattern = /#{(.+?)}#/g;
    var block = result.match(pattern);
    let index = 0;
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = JSON.parse(content);
        switch (obj.type) {
            case 'para_begin':
                style['style'][`${paragraphKindName}${index}`] = obj.style;
                index++;
                break;
            default:
                break;
        }
    });
    result1 = result1.replace(`#{"type":"para_begin","style":"${subject}_matching"}##`, '')
    result1 = result1.replace(`##{"type":"para_end"}#`, '')

    var reg_stem = /#\{"type":"para_begin"[^\}]*\}#(.*?)#\{"type":"para_end"\}#/ig;
    let firstRes = reg_stem.exec(result);
    if (!firstRes) return {};
    paragraph[`${paragraphKindName}0`] = '<p>' + firstRes[1] + '</p>';
    let key = 0;
    while (reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if (!pp) break;
        key++;
        paragraph[`${paragraphKindName}${key}`] = '<p>' + pp[1] + '</p>';
    }
    style['style'] = JSON.stringify(style['style']);
    return {paragraph, style, result1};
}
function parseLeftRight(obj, id) {
    let result = obj;
    result = replaceCommonJsonToTag(result);
    return `<p data-id="${id}">${result}</p>`;
}
function parseLeftRightForEdit(obj) {
    let result = obj;
    result = replaceCommonJsonToTag(result);
    return `<p>${result}</p>`;
}
export {reverseParseText,reverseParseTextView}