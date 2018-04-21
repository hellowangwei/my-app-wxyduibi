import {replaceCommonJsonToTag,getExplain,getParagraph,getParagraphForEdit} from '../../../utils/createRender'

let reverseParseText = (data) => {
    let obj = createRender(data,0);
    let stem = {};
    let answer = {};
    let explain = {};
    let style = {};
    let options = [];
    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
        }else if(v.indexOf("style") > -1) {
            /*处理段落样式*/
            style = JSON.parse(obj[v]);
        }else if(v.indexOf("option") > -1) {
            /*处理选择题*/
            options.push({
                code: v.replace("option_", ""),
                item: obj[v]
            })
        }else if(v.indexOf('answer') > -1) {
            /*处理答案*/
            answer = obj.answer
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
        options,
    }
}

let reverseParseTextView = data => {
    let obj;
    obj = createRender(data);
    let stem = "";
    let item_list = [];
    let explain = "";
    let answer = "";
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            if(obj[val].indexOf('inner_audio')>-1){
                let reading = obj[val].match(/<div style="margin-bottom: 10px"><div class="inner_audio"}><\/div><span>点击读题<\/span><audio class="math_reading" src=".*?"><\/audio><\/div>/g);
                let audio = reading?reading[0]?reading[0]:'':''
                stem = audio + stem + obj[val].replace(audio,'');
            }else{
                stem += obj[val];
            }
        } else if (val.indexOf("option") > -1) {
            // 选项部分
            item_list.push({
                code: val.replace("option_", ""),
                item: obj[val]
            })
        } else if (val.indexOf("explain") > -1) {
            // 解析部分
            explain = obj[val];
        } else if (val.indexOf("answer") > -1) {
            // 答案部分
            answer = obj[val];
        }
    })


    let result = {
        stem,
        item_list,
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
    let answer = {answer: getAnswer(data.answer,data.type_show)};
    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    // 匹配选项
    let options = {}
    data.item_list.forEach(v => {
        options[`option_${v.code}`] = replaceCommonJsonToTag(v.item);
        var p = options[`option_${v.code}`].split(`#{"type":"P"}#`);
        options[`option_${v.code}`] = p.map(function(val){
            return `<p>${val}</p>`;
        });
        options[`option_${v.code}`] = options[`option_${v.code}`].join('');
    });
    // 匹配 stem
    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph,style} = getParagraphForEdit(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain, answer, style,options);
            break;
        case 1:
            // 匹配 stem
            var {paragraph,style} = getParagraph(data.stem,'paragraph');
            render = Object.assign({}, paragraph, explain, answer, style,options);
            break;
        default:
            break;
    }
    return render;
}

function getAnswer(str,type){
    if(type==='27'){
        return JSON.parse(str)[0].choice.split('')
    }
    return JSON.parse(str)[0].choice.split('|')
}

export {reverseParseText,reverseParseTextView}