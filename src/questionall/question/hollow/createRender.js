import {replaceCommonJsonToTag,getParagraph,getParagraphForEdit,getExplain} from '../../../utils/createRender'
// import WEB_API from './../../../API/api'

let reverseParseText = (data) => {
    let obj;
    obj = createRender(data,0);
    let stem={}
    let stemAfter={}
    let stemStyle = {};
    let stemAfterStyle = {};
    let imgBlankAnswer={}
    let answer={}
    let imgData;
    let imgURL;
    let imgWidth ;
    let imgHeight;
    let explain='';

    Object.keys(obj).forEach(v => {
        if (v.indexOf('beforeImgParagraph') > -1) {
            /*处理图前段落部分*/
            stem[v] = obj[v];
        }
        if (v.indexOf('afterImgParagraph') > -1) {
            /*处理图后段落部分*/
            stemAfter[v] = obj[v];
        }else if(v.indexOf("stemStyle") > -1) {
            /*处理段落样式*/
            stemStyle = obj[v];
        }else if(v.indexOf("stemAfterStyle") > -1) {
            /*处理图后段落样式*/
            stemAfterStyle = obj[v];
        }else if(v.indexOf('imgBlankAnswer') > -1) {
            /*处理图空答案*/
            imgBlankAnswer[v] = obj[v];
        }else if(v.indexOf('answer') > -1) {
            /*处理答案*/
            answer[v] = `<p>${obj[v]}</p>`;
        }else if(v.indexOf('explain') > -1) {
            /*处理解析*/
            explain = obj[v]
        }else if(v.indexOf('imgData') > -1) {
            imgData = JSON.parse(obj[v]);
        }else if(v.indexOf('imgInfo') > -1) {
            let imgInfo = JSON.parse(obj[v]);
            // imgURL = imgInfo.src.replace([WEB_API.QINIU_DOMAIN], "");
            imgWidth = imgInfo.width.replace(/px/g, "");
            imgHeight = imgInfo.height.replace(/px/g, "");
        }
    })
    return {
        stem,
        stemAfter,
        stemStyle,
        stemAfterStyle,
        imgBlankAnswer,
        answer,
        explain,
        imgData,
        imgURL,
        imgWidth,
        imgHeight,

    }
}


let reverseParseTextView = data => {
    let obj;
    obj = createRender(data);
    let stem = "";
    let beforeImgParagraph = "";
    let afterImgParagraph = "";
    let imgBlankAnswer = [];
    let imgQuestion_img = "";
    let answer = [];
    let explain = '';
    // let know_list = (data.know_list && data.know_list.length) ? data.know_list.concat() : [];
    Object.keys(obj).forEach(val => {
        if (val.indexOf("beforeImgParagraph") > -1) {
            // 题干部分
            beforeImgParagraph += obj[val];
        } else if (val.indexOf("afterImgParagraph") > -1) {
            // 题干部分
            afterImgParagraph += obj[val];
        } else if (val.indexOf("imgBlankAnswer") > -1) {
            // 题干部分
            imgBlankAnswer.push(obj[val]);
        } else if (val.indexOf("answer") > -1) {
            //答案部分
            answer.push(obj[val]);
        } else if (val.indexOf("imgInfo") > -1) {
            let info = JSON.parse(obj[val]);
            imgQuestion_img +=`<canvas name="questionFillImage" class="mis_bigger_image" width="${info.width}" height="${info.height}" data-image="${info.src}" data-answer="${obj.blankArr}" data-position=${obj.imgData.replace(/\\"/,'\'')}></canvas>`;
        }else if(val.indexOf('explain') > -1) {
            /*处理解析*/
            explain = obj[val]
        }
    })
    stem = beforeImgParagraph + imgQuestion_img + afterImgParagraph;
    return  {
        stem:stem,
        answer,
        explain
    };
}
/*
*  创建图片挖空题的render
* */
function createRender(data,showType=1) {
    let render = {};
    // 图片信息获取
    let {imgInfo,imgData,imgParagraph,imgStyle,blankCountBefore,blankCountImg} = getImgData(data.stem,showType);
    // 匹配answer
    let answer = ''
    if(data.answer){
        answer = getAnswer(data.answer,blankCountBefore,blankCountImg);
    }
    let explain = ''
    if(data.explain){
        explain = {explain: getExplain(data.explain)};
    }
    render = Object.assign({}, answer,imgInfo,imgData,imgParagraph,imgStyle,explain);
    return render;
}

/*
*  解析图片挖空的答案
* */
function getAnswer(str,blankCountBefore,blankCountImg){

        str = JSON.parse(str)
        str.forEach((val)=>{
            val.content = replaceCommonJsonToTag(val.content);
        });
        let answer = {};
        answer.blankArr = [];
        str.forEach((val,index)=>{
            if(index >= blankCountBefore&&index <(blankCountBefore+blankCountImg)){
                answer[`imgBlankAnswer_${val.blank_id -blankCountBefore-1}`] = `<p>${val.content}</p>`;
                answer.blankArr.push(val.content)
            }else{
                if(index <blankCountBefore){
                    answer[`answer_${val.blank_id - 1}`] = `${val.content}`;
                }else{
                    answer[`answer_${val.blank_id - blankCountImg - 1}`] = `${val.content}`;
                }

            }
        });
        return answer;
}


function getImgData(str,showType) {
    /*
    *  获取图片挖空的信息及paragraph，分别将图片挖空的图片前后的paragraph解析出来
    * */
    let result = replaceCommonJsonToTag(str),
        imgInfo = {
            imgInfo:""
        },
        imgParagraph = {},
        imgStyle = {
            stemStyle:{},
            stemAfterStyle:{}
        };
    let reg_stem = /#\{"type":"para_begin","style":"math_fill_image"\}#(.*?)#\{"type":"para_end"\}#/ig;
    let firstRes = reg_stem.exec(result);
    if(!firstRes) return {};
    imgInfo['imgInfo'] = firstRes[1].replace(/(#)/g, "");
    let par = str.split(`#{"type":"para_begin","style":"math_fill_image"}#${firstRes[1]}#{"type":"para_end"}#`);

    let blankCountBefore = 0,blankCountImg = 0
    let blankCountMatch = imgInfo['imgInfo'].match(/\{"type":"blank","id":/ig)//记录图前段落有几个空
    if(blankCountMatch&&blankCountMatch.length){
        blankCountImg =  blankCountMatch.length
    }

    if(par[0].length > 1){
        let blankCountMatchStem = par[0].match(/\{"type":"blank","id":/ig)//记录图前段落有几个空
        if(blankCountMatchStem&&blankCountMatchStem.length){
            blankCountBefore =  blankCountMatchStem.length
        }

        if(showType===0) {// 匹配 stem
            let {paragraph,style} = getParagraphForEdit(par[0], 'beforeImgParagraph');
            Object.assign(imgParagraph,paragraph);
            Object.assign(imgStyle['stemStyle'],JSON.parse(style['style']));
        }else{
            let {paragraph,style} = getParagraph(par[0],'beforeImgParagraph');
            Object.assign(imgParagraph,paragraph);
            Object.assign(imgStyle['stemStyle'],JSON.parse(style['style']));
        }
    }
    if(par[1].length > 1){
        if(showType===0) {// 匹配 stem
            let {paragraph,style} = getParagraphForEdit(par[1], 'afterImgParagraph');
            Object.assign(imgParagraph,paragraph);
            Object.assign(imgStyle['stemAfterStyle'],JSON.parse(style['style']));
        }else{
            let {paragraph,style} = getParagraph(par[1],'afterImgParagraph');
            Object.assign(imgParagraph,paragraph);
            Object.assign(imgStyle['stemAfterStyle'],JSON.parse(style['style']));
        }
    }
    /*
    *  解析图片挖空坐标、段落等
    * */
    let imgData = {
        imgData : {}
    };
    let o = JSON.parse(imgInfo['imgInfo']);
    o.blanklist.forEach((val,index)=>{
        let v = val;
        v.x_pos = Math.round(parseFloat(v.x_pos) * parseInt(o.width) /100);
        v.y_pos = Math.round(parseFloat(v.y_pos) * parseInt(o.height) /100);
        imgData['imgData'][`imgBlankAnswer${index}`] = v;
    });
    imgData['imgData'] = JSON.stringify(imgData['imgData']);



    return {imgInfo,imgData,imgParagraph,imgStyle,blankCountBefore,blankCountImg};
}


export {reverseParseText,reverseParseTextView}