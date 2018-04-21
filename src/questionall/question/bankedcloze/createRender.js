import {replaceCommonJsonToTag,getExplain,getParagraph,getParagraphForEdit} from '../../../utils/createRender'

const allOptions = ['A','B','C','D','E','F','G','H','I','J'];

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
                let audio = reading[0]?reading[0]:''
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
    let answer = {answer: getAnswer(data.answer,data.item_list)};
    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    // 匹配选项
    let options = {}
    data.item_list.forEach(v => {
        let option = replaceCommonJsonToTag(v.item);
        let p = option.split(`#{"type":"P"}#`);
        option = p.map(function(val){
            return `<p>${val}</p>`;
        });
        let code = v.code
        if(~~v.code>=1){//兼容数字是数字的情况
            code = allOptions[(~~v.code)-1]
        }
        options[`option_${code}`] = option.join('');
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

function getAnswer(answer,itemList){
    answer = JSON.parse(answer)
    let result = []
    answer.forEach((d,i)=>{
        itemList.forEach(v=>{
            if(d.combine === v.item){
                let code = v.code
                if(~~v.code>=1){//兼容数字是数字的情况
                    code = allOptions[(~~v.code)-1]
                }
                result.push(code)
            }
        })
    })
    return result
}

export {reverseParseText,reverseParseTextView}