import {getExplain,getParagraph,getParagraphForEdit,replaceCommonJsonToTag} from '../../../utils/createRender'

let reverseParseText = (data) => {
    let obj = createRender(data,0);
    let stem = {};
    let answer = {};
    let explain = '';
    let core = '';
    let style = {};
    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
        }else if(v.indexOf("style") > -1) {
            /*处理段落样式*/
            style = JSON.parse(obj[v]);
        }else if(v.indexOf('explain') > -1) {
            /*处理解析*/
            explain = obj[v]
        }
        else if(v.indexOf('core') > -1) {
            /*处理解析*/
            core = obj[v]
        }
    })
    return {
        stem,
        explain,
        core,
        style,
        answer
    }
}

let reverseParseTextView = data => {
    let obj = createRender(data,1);
    let stem = "";
    let explain = "";
    let core = "";
    let answer = [];
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            if(obj[val].indexOf('inner_audio')>-1){
                let reading = obj[val].match(/<div style="margin-bottom: 10px"><div class="inner_audio"}><\/div><span>点击读题<\/span><audio class="math_reading" src=".*?"><\/audio><\/div>/g);
                let audio = reading[0]?reading[0]:''
                stem = audio + stem + obj[val].replace(audio,'');
            }else{
                stem += obj[val];
            }
        }else if (val.indexOf("explain") > -1) {
            // 解析部分
            explain += obj[val];
        }else if (val.indexOf("core") > -1) {
            // 解析部分
            core += obj[val];
        }else if (val.indexOf("answer") > -1) {
            // 答案部分
            answer.push(obj[val]);
        }
    })

    let result = {
        stem,
        explain,
        core,
        answer,
    };
    return result
}
function createRender(data,showType = 1) {//showType:0 编辑用，1 展示用
    if(!data.stem){
        return {}
    }
    let render = {};
    // 匹配answer
    let answer = getAnswer(data.answer);
    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    let core = {core: getExplain(data.core)};
    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph,style} = getParagraphForEdit(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain,core, answer, style);
            break;
        case 1:
            // 匹配 stem
            var {paragraph,style} = getParagraph(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain,core, answer, style);
            break;
        default:
            break;
    }
    return render;
}
function getAnswer(str){
    let answer = {};
    str = replaceCommonJsonToTag(str).replace(/"mathquill-embedded-latex"/g,'\\"mathquill-embedded-latex\\"');
    if(str==''){return answer['answer'] = ''}
    try{
        str = JSON.parse(str);
    }catch(e){
        str = [{content:"答案解析失败"}];
    }
    answer['answer'] = str
    return answer;
}
export {reverseParseText,reverseParseTextView}