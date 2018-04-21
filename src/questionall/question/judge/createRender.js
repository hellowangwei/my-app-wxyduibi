import {getExplain,getParagraph,getParagraphForEdit,replaceCommonJsonToTag} from '../../../utils/createRender'
let reverseParseText = (data) => {
    let obj = createRender(data,0);
    let stem = {};
    let answer = {};
    let explain = {};
    let style = {};
    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
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
        answer
    }
}

let reverseParseTextView = data => {
    let obj = createRender(data);
    let stem = "";
    let explain = "";
    let answer = "";
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            stem += obj[val];
        }else if (val.indexOf("explain") > -1) {
            // 解析部分
            explain += obj[val];
        }else if (val.indexOf("answer") > -1) {
            answer = JSON.parse(data.answer) == 0 ? "×" : "√";
        }
    })


    let result ={
        stem,
        explain,
        answer,
    };
    return result
}
function createRender(data,showType = 1) {
    if(!data.stem){
        return {}
    }
    let render = {};
    // 匹配answer
    let answer = getAnswer(data.answer);
    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    // 匹配 stem
    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph,style} = getParagraphForEdit(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain, answer, style);
            break;
        case 1:
            // 匹配 stem
            var {paragraph,style} = getParagraph(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain, answer, style);
            break;
        default:
            break;
    }
    //render = Object.assign({}, paragraph, explain, answer, style);
    return render;
}
function getAnswer(str){
    if (str == "\"1\"" || str == "1"){
        return {answer:"1"};
    }else if (str == "\"0\"" || str == "0"){
        return {answer:"0"};
    }
}

export {reverseParseText,reverseParseTextView}