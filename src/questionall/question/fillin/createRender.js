import {getExplain,getParagraph,getParagraphForEdit,replaceCommonJsonToTag} from '../../../utils/createRender'

let reverseParseText = (data) => {
    let obj = createRender(data,0);
    let stem = {};
    let answer = {};
    let explain = '';
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
            answer[v] = `<p>${obj[v]}</p>`;;
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
    let obj = createRender(data,1);
    let stem = "";
    let explain = "";
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
        }else if (val.indexOf("answer") > -1) {
            // 答案部分
            answer.push(obj[val]);
        }
    })

    let result = {
        stem,
        explain,
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
    return render;
}
function getAnswer(str){
    let answer = {};
    str = replaceCommonJsonToTag(str).replace(/"mathquill-embedded-latex"/g,'\\"mathquill-embedded-latex\\"');
    try{
        str = JSON.parse(str);
    }catch(e){
        str = [{content:"答案解析失败"}];
    }
    if (str.length > 1){
        str.forEach((val)=>{
            answer[`answer_${val.blank_id - 1}`] = val.content;
        });
    }else{
        if(str[0].content || str[0].content === ''){
            answer['answer_0'] = str[0].content;
        }else{
            answer['answer'] = JSON.stringify(str);
        }
    }
    return answer;
}
export {reverseParseText,reverseParseTextView}