import {replaceCommonJsonToTag,getExplain,getCore,getParagraphForEdit} from '../../../utils/createRender'
// import WEB_API from './../../../API/api'
import {TYPE_MAP } from './../../../utils/questionType'

let reverseParseText = (data) => {
    let obj;
    obj = createRenderWordProblems(data,0);
    let stem = {};
    let answer = obj.answer;
    let style = {};
    Object.keys(obj).forEach(v => {
        if (v.indexOf('paragraph') > -1) {
            /*处理段落部分*/
            stem[v] = obj[v];
        }else if(v.indexOf("style") > -1) {
            /*处理段落样式*/
            style = JSON.parse(obj[v]);
        }
    })
    return{
        stem,
        answer,
        style,
        sub_list: obj.sub_list
    }
}

let reverseParseTextView = data => {
    let obj;
    obj = createRenderWordProblems(data);
    let stem = "";
    let explain = "";
    let answer = "";
    let know_list = (data.know_list && data.know_list.length) ? data.know_list.concat() : [];
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            stem += obj[val];
        } else if (val.indexOf("explain") > -1) {
            // 解析部分
            explain += obj[val];
        }
    })
    answer = obj.answer
    return {
        stem,
        explain,
        answer,
        know_list,
        type_show: data.type_show,
        question_id: data.question_id,
        difficulty: data.difficulty,
        sub_list: data.sub_list
    };
}


function createRenderWordProblems(data,showType=1) {
    if(!data.stem){
        return {}
    }
    let render = {};
    // 匹配 stem

    switch (showType){
        case 0:
            // 匹配 stem
            var {paragraph,style} = getParagraphForEdit(data.stem,'paragraph');
            break;
        case 1:
            // 匹配 stem
            var {paragraph,style} = getParagraph(data.stem,'paragraph');
            break;
        default:
            break;
    }
    // 匹配answer
    let answer = parseToTreeStructureData(data);

    // 匹配解析
    let explain = {explain: getExplain(data.explain)};
    // 匹配核心部分
    let core = {core: ''};

    render = Object.assign({}, paragraph, explain, {answer}, core, style,{sub_list:data.sub_list});
    return render;
}

function getParagraph(str,paragraphKindName) {
    var result = replaceCommonJsonToTag(str),
        style = {style:{}},
        paragraph = {};
    var p = result.split(`#{"type":"P"}#`);
    result = p.map(function(val){
        return `<p>${val}</p>`;
    });
    result = result.join('');

    let pattern =/#{(.+?)}#/g;
    var block = result.match(pattern);
    let index = 0;
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = {};
        try{
            obj = JSON.parse(content)
        }catch(e) {
            return;
        }
        switch (obj.type) {
            case 'para_begin':
                style['style'][`${paragraphKindName}${index}`] = obj.style;
                index++;
                break;
            default:
                break;
        }
    });

    var reg_stem = /#\{"type":"para_begin"[^\}]*\}#(.*?)#\{"type":"para_end"\}#/ig;
    let firstRes = reg_stem.exec(result);
    if(!firstRes) return {};
    paragraph[`${paragraphKindName}0`] = '<p class="'+ style['style'][`${paragraphKindName}0`] +'">'+firstRes[1]+'</p>';
    let key = 0;
    while(reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if(!pp) break;
        key++;
        paragraph[`${paragraphKindName}${key}`] = '<p class="'+ style['style'][`${paragraphKindName}${key}`] +'">'+pp[1]+'</p>';
    }
    style['style'] = JSON.stringify(style['style']);
    //console.log('paragraph',paragraph);
    return {paragraph,style};
}



//将对接的对象转换成树
let parseToTreeStructureData = (data) =>{
    let parseTreePath = JSON.parse(data.answer);
    let treeStructureData = [];
    let loop = (path, nodearr, parentIsbranch, optionIndex, parentStage) => {
        Object.keys(path).forEach((v, i) => {
            let obj = {
                index: 1,
                type: '填空题',
                branch: false,
                optionIndex: -1,
                children: [],
            };
            let arrcache = [];
            let question = data.sub_list.filter((d) => d.number == v)[0];
            if(!question){return nodearr.push('bad')}
            let obj1 = JSON.parse(JSON.stringify(obj));
            obj1.index = ~~v;
            obj1.type = TYPE_MAP[question.type_show]; //中文
            if (parentIsbranch) {
                obj1.optionIndex = optionIndex
            }
            if (parentStage) {
                question.parentStage = parentStage;
            }
            question.stage = path[v].stage;
            if (path[v].answer) {
                //判断是否是分支题，YES：对answer字段重新排序，按选项从小到大排序。
                if (Object.keys(path[v].answer).length > 1) {
                    const optionArr = Object.keys(path[v].answer).sort();
                    const answerMap = {};
                    optionArr.forEach(item => {
                        answerMap[item] = path[v].answer[item];
                    });
                    path[v].answer = answerMap;
                }

                Object.keys(path[v].answer).forEach((v1, i1) => {
                    if (Object.keys(path[v].answer).length > 1) {
                        question.branch = '1';
                        obj1.branch = true;
                        let option = JSON.parse(question.answer)[0].choice.split('|');
                        obj1.option = option;
                        obj1.stage = path[v].stage;
                    } else {
                        question.branch = '0';
                        obj1.branch = false;
                        obj1.stage = path[v].stage;
                    }

                    if (path[v].answer[v1].path) {
                        loop(path[v].answer[v1].path, obj1.children, obj1.branch, i1, obj1.stage);
                    }

                    if (path[v].answer[v1].is_end) {
                        question.is_end = '1';
                        obj1.is_end = true;
                        obj1.stage = path[v].stage;
                    }
                });
            }
            nodearr.push(obj1)
        })
    };

    loop(parseTreePath.path, treeStructureData);
    return treeStructureData;
};


//将树转换成对接的对象
const  parseTreeStructureData = (treeStructureData,parseTreePath,wordproblem_list,sub_list,path_count=0) =>{
    let hasNullBranch = false
    let stageError = false
    let parseTree = (treeStructureData,parseTreePath,wordproblem_list,sub_list,stageState)=>{
        if(!treeStructureData.index){hasNullBranch=true; return}
        let subQuestion = {};
        let subQuestionOrigin = {};
        let d = treeStructureData
            subQuestionOrigin = wordproblem_list.find(d1=>d.index==d1.number);//找到当前树节点对应的题
            subQuestion = sub_list.find(d1=>d.index==d1.number);//找到当前树节点对应的题

            if(!parseTreePath[d.index]){
                let stage = subQuestionOrigin.stage||1
                if(stageState>stage){stageError=true}//题目阶段顺序有误时
                parseTreePath[d.index] = {
                    "stage": ''+stage,
                    "number": d.index,
                    "isbranch":0,
                    "rightanswer":subQuestion.answer,
                    "answer": {},
                }
            }

            // if(subQuestionOrigin.type == '21'&& subQuestionOrigin.branch){// 是分支题
            if(d.children.length>1){
                parseTreePath[d.index].isbranch = 1;

                subQuestionOrigin.selectAnswer.forEach((d1,i)=>{
                    let str = d1
                    // str = `[{"blank_id":1,"choice":"${str}"}]`
                    parseTreePath[d.index].answer[str] = {path:{}}
                    let obj = parseTreePath[d.index].answer[str].path;
                    if(d.children.length){
                        parseTree(d.children[i],obj,wordproblem_list,sub_list,parseTreePath[d.index].stage)
                    }
                    else{
                        parseTreePath[d.index].answer[str] = {"is_end":1}
                        path_count = path_count+1;
                    }

                })

            }
            else{//不是分支题
                let str = 'isright'

                parseTreePath[d.index].answer[str] = {path:{}}
                let obj = parseTreePath[d.index].answer[str].path;
                if(d.children.length){
                    parseTree(d.children[0],obj,wordproblem_list,sub_list,parseTreePath[d.index].stage)
                }
                else{
                    parseTreePath[d.index].answer[str] = {"is_end":1}
                    path_count = path_count+1;
                }
            }


    }
    parseTree(treeStructureData[0],parseTreePath,wordproblem_list,sub_list,1)
    return {parseTreePath,path_count,hasNullBranch,stageError}
}
export {reverseParseText,reverseParseTextView,parseTreeStructureData}