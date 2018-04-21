import {getExplain,replaceCommonJsonToTag,getParagraphForEdit,getParagraph} from '../../../utils/createRender'

let reverseParseText = data => {//解析分类题
    let obj;
    let stem = {}
    let style = {}
    let explain = {};
    let answer = [];
    let drag = {}
    let item_list = []
    obj = createRender(data,0);

    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
        }else if(v.indexOf("style") > -1) {
            /*处理段落样式*/
            style = JSON.parse(obj[v]);
        }
        else if(v.indexOf('explain') > -1) {
            /*处理解析*/
            explain = obj[v]
        }
    })
    drag = obj.drag
    answer = JSON.parse(data.answer).map(d=>d.result.split('|'))
    item_list = obj.item_list
    return {
        explain,
        answer,
        drag,
        stem,
        style,
        item_list,
    }
}
let reverseParseTextView = data => {//解析分类题
    let obj;
    obj = createRender(data);
    let stem = "";
    let item_list = [];
    let itemsMap = {};
    let answer = "";
    let explain = "";
    let stemMap = {}
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            stem += obj[val];
        } else if (val.indexOf("answer") > -1) {
            // 正确答案部分
            answer = obj[val];
        } else if (val.indexOf("explain") > -1) {
            explain = obj[val];
        }
    });

    item_list = [...obj.item_list]

    obj.drag.forEach(d=>{//拿出所有类型
        let str = d.content
        if(d.classify_type==='0'){
            d.content = /src="([\s\S]+?)"/.exec(d.content)
            d.content[1]&& (d.content = d.content[1])
            str = `<img style="max-width: 340px" src="${d.content}"/>`
        }
        stemMap[d.id] = str
        stem += `<p style="margin:10px 0"><span class="math_category_con">${str}: </span><span class="math_category_box"></span></p>`
    })
    item_list.forEach(d=>{//拿出所有元素
        let str = d.item
        if(d.classify_type==='0'){
            d.item = /src="([\s\S]+?)"/.exec(d.item)
            d.item[1]&& (d.item = d.item[1])
            str = `<img style="max-width: 170px" src="${d.item}"/>`
            d.item = str
        }
        itemsMap[d.code] = str
    })
    answer = JSON.parse(data.answer).map(d=>(Object.assign(d,{result:d.result.split('|')})))
    return {stem, item_list, itemsMap, answer, stemMap, explain};
}

function createRender(data,showType = 1) {
    if(!data.stem){
        return {}
    }
    let render = {};
    // 匹配 stem

    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    let stem = ''
    let stem2='';//分类部分数据
    let subIndex = /#{"type":"para_begin","style":"math_category"}##{"type":"drag","drag"/.exec(data.stem)
    if(!subIndex){//语文题时 少一层"type":"para_begin" 直接取出内容
        stem2 = /#{"type":"drag","drag"[\s\S]+?}#/.exec(data.stem)[0]
    }else{
        subIndex = subIndex.index
        if(subIndex){
            stem2 = data.stem.substr(subIndex)
        }
    }
    stem = data.stem.replace(stem2,'')
    stem2 = stem2.replace(`#{"type":"para_begin","style":"math_category"}##`,'').replace(`##{"type":"para_end"}#`,'').replace(/^#/,'').replace(/#$/,'')//去掉前后的para_begin para_end

    //匹配类型的选项
    let drag = [];
    let draginfo = {};
    try{
        draginfo = JSON.parse(stem2).drag;
    }catch (e){
        return "";
    }
    draginfo.forEach((d,i)=>{
        drag[i] = {}
        let content = replaceCommonJsonToTag(d.content)
        if(/#{"type":"img","src":"[\s\S]*","size":"big_category_image","id":1/.exec(d.content)){
            let c = d.content.replace(/#/g,'')
            drag[i].content = JSON.parse(c).src
            drag[i].classify_type='0'
        }else{
            drag[i].classify_type='1'

        }
        drag[i].content = content
        drag[i].id = d.id
    })
    let item_list = [...data.item_list];
    item_list.forEach(d=>{
        let item = replaceCommonJsonToTag(d.item)
        if(/#{"type":"img","src":"[\s\S]*","size":"big_category_image","id":1/.exec(d.item)){
            let c = d.item.replace(/#/g,'')
            d.item = JSON.parse(c).src
            d.classify_type='0'
        }else{
            d.classify_type='1'
        }
        d.item = item
    })
    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph,style} = getParagraphForEdit(stem,'paragraph');
            render = Object.assign({}, paragraph, style,{drag},{item_list},explain);
            break;
        case 1:
            // 匹配 stem
            var {paragraph,style} = getParagraph(stem,'paragraph');
            render = Object.assign({}, paragraph, style,{drag},{item_list},explain);
            break;
        default:
            break;
    }

    return render;
}

export {reverseParseText,reverseParseTextView}