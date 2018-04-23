/*
* @str 解析字符串
* @paragraphKindName 输出的paragraph名称 例如：paragraph0，beforeImgParagraph0...
* return: paragraph 和 paragraph的style
* */
function getParagraph(str,paragraphKindName) {
    let result = replaceCommonJsonToTag(str),
        style = {style:{}},
        paragraph = {};
    let pattern =/#{(.+?)}#/g;
    let block = result.match(pattern);
    let index = 0;

    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = {}
        try{
            obj=JSON.parse(content);
        }catch (e){
            console.log(content)
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

    let reg_stem = /#{"type":"para_begin"[^}]*}#(.*?)#{"type":"para_end"}#/ig;
    let firstRes = reg_stem.exec(result);
    if(!firstRes) return {};
    let p = firstRes[1].split(`#{"type":"P"}#`);
    firstRes[1] = p.map(function(val){
        return '<p class="'+ style['style'][`${paragraphKindName}0`] +'">'+val+'</p>';
    });
    paragraph[`${paragraphKindName}0`] = '<p class="'+ style['style'][`${paragraphKindName}0`] +'">'+firstRes[1].join("")+'</p>';
    let key = 0;
    while(reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if(!pp) break;
        key++;
        let p = pp[1].split(`#{"type":"P"}#`);
        pp[1] = p.map(function(val){
            return '<p class="'+ style['style'][`${paragraphKindName}${key}`] +'">'+val+'</p>';
        });
        pp[1] = pp[1].join('');
        paragraph[`${paragraphKindName}${key}`] = '<p class="'+ style['style'][`${paragraphKindName}${key}`] +'">'+pp[1]+'</p>';
    }
    style['style'] = JSON.stringify(style['style']);
    return {paragraph,style};
}
function getParagraphForEdit(str,paragraphKindName) {
    let result = replaceCommonJsonToTag(str,'edit'),
        style = {style:{}},
        paragraph = {};
    let pattern =/#{(.+?)}#/g;
    let block = result.match(pattern);
    let index = 0;
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = {};
        try{
            obj = JSON.parse(content);
        }catch (e){
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

    let reg_stem = /#{"type":"para_begin"[^}]*}#(.*?)#{"type":"para_end"}#/ig;
    let firstRes = reg_stem.exec(result);
    if(!firstRes) return {};
    let p = firstRes[1].split(`#{"type":"P"}#`);
    firstRes[1] = p.map(function(val){
        return '<p>'+val+'</p>';
    });
    paragraph[`${paragraphKindName}0`] = '<p>'+firstRes[1].join("")+'</p>';
    let key = 0;
    while(reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if(!pp) break;
        key++;
        let p = pp[1].split(`#{"type":"P"}#`);
        pp[1] = p.map(function(val){
            return '<p>'+val+'</p>';
        });
        paragraph[`${paragraphKindName}${key}`] = '<p>'+pp[1].join('')+'</p>';
    }
    style['style'] = JSON.stringify(style['style']);
    return {paragraph,style};
}
/*
* 替换 #{...}# 包围的样式种类
*
* */
function replaceCommonJsonToTag (str,edit) {
    if(!str)return '';
    str = str.replace(/</g,'&lt;');
    str = str.replace(/>/g,'&gt;');
    str = str.replace(/\n/g,'#{"type":"P"}#');
    var result = str;
    let pattern =/#{(.+?)}#/g;
    var block = result.match(pattern);
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        // let content = val.replace(/(#)/g, "");
        let obj = {}
        try{
            obj = JSON.parse(content);
        }catch(error) {
            return ''
        }
        switch (obj.type) {
            case 'latex':
                let pattern1 =/{"type":"blank".*?}\\/g;
                var block1 = obj.content.match(pattern1);
                block1&&block1.forEach((val)=>{
                    obj.content = obj.content.replace(val,`left[\\right]`);
                })
                result = result.replace(val,`<span class="mathquill-embedded-latex">${obj.content}</span>`);
                break;
            case 'blank':
                switch (obj.size){
                    case 'express':
                        result = result.replace(val,`<img src="./static/img/edu_fillin_express.png" class="img_fillin_express"/>`);
                        break;
                    case 'letter':
                        result = result.replace(val,`<img src="./static/img/edu_fillin_word.png" class="img_fillin_letter"/>`);
                        break;
                    case 'line':
                        result = result.replace(val,`<img src="./static/img/edu_fillin_line.png" class="img_fillin_line"/>`);
                        break;
                    case 'fillin':
                        result = result.replace(val,`blank`);
                        break;
                    default:
                        break;
                };
                break;
            case 'img':
                switch (obj.size){
                    case 'small_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_smaller_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'mid_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_middle_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'big_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_bigger_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'choice_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_bigger_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'small_category_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_smaller_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'big_category_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_bigger_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'small_match_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_smaller_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    case 'big_match_image':
                        result = result.replace(val, `<img src="${obj.src}" class="mis_bigger_image" width="${'px'+obj.width}" height="${'px'+obj.height}"/>`);
                        break;
                    default:
                        break;
                };
                break;
            case 'audio':
                switch (obj.style){
                    case 'math_reading':
                        if(edit){
                            result = result.replace(val,`<audio class="math_reading" src="${obj.src}"  controls="controls">您的浏览器不支持</audio>&nbsp;`);
                        }else{
                            result = result.replace(val,`<div style="margin-bottom: 10px"><div class="inner_audio"}></div><span>点击读题</span><audio class="math_reading" src="${obj.src}" style="display:none"></audio></div>`);
                        }
                        break;
                    default:
                        result = result.replace(val,`<audio src="${obj.src}" controls="controls">您的浏览器不支持</audio>&nbsp;`);
                        break;
                };
                break;
            case 'shushi':
                const content = obj.content;
                const divide_pair = obj.divide_pair;
                const quotient = obj.quotient;
                let con = '';

                /** 除法(左部分) */
                if (!!divide_pair) {
                    con += '<span style="display: inline-block; text-align: right;vertical-align: top;">';
                    if (quotient && quotient.length > 0) {
                        con += '<span style="display: block; margin-bottom: 6px;">';
                        quotient.forEach(blank => {
                            con += `<span class="member-blank" style="border: 0; background: transparent;"></span>`;
                        });
                        con += '</span>';
                    }
                    con += '<span style="display: block; position: relative;">';
                    divide_pair[1].forEach((item, i) => {
                        con += `<span class="member">${item}</span>`;
                        if (i === divide_pair[1].length - 1) {
                            con += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="12" height="42">' +
                                '<path d="M 12 0 q 0 28 -12 42" stroke="#333" stroke-width="1" fill="none"></path>' +
                                '</svg>';
                        }
                    });
                    con += '</span>';
                    con += '</span>';
                }

                con += '<span style="display: inline-block; text-align: right;">';

                /** 除法(右部分) */
                if (!!divide_pair) {
                    if (quotient && quotient.length > 0) {
                        con += '<span style="display: block; margin-bottom: 6px;">';
                        quotient.forEach(blank => {
                            if (blank.indexOf('blank') > -1) {
                                con += `<span class="member-blank" data-id="${blank.replace(/(blank)/g, '')}"></span>`;
                            } else {
                                con += `<span class="member-blank" style="border: 0; background: transparent;"></span>`;
                            }
                        });
                        con += '</span>';
                    }
                    con += '<span style="display: block; position: relative;border-top: 1px solid #333;">';
                    // divide_pair.forEach(item => {
                    //     con += '<span style="display: block;">';
                    //     item.forEach(val => {
                    //         con += `<span class="member">${val}</span>`;
                    //     });
                    //     con += '</span>';
                    // });
                    divide_pair[0].forEach(item => {
                        con += `<span class="member">${item}</span>`;
                    });
                    con += '</span>'
                }

                /** 非除法 */
                content.forEach((item, i) => {
                    con += '<span style="display: block; position: relative;">';

                    /** 分割线 */
                    if (!!divide_pair && i !== 0) {
                        con += '<span style="margin: 6px 0; height: 1px; width: 100%; background: #333333; display: block;"></span>';
                    } else if (!divide_pair && i !== 0) {
                        con += '<span style="margin: 6px 0; height: 1px; width: 100%; background: #333333; display: block;"></span>';
                    }

                    /** 借位 */
                    if (item.borrow_flag && !!item.borrow_flag.length) {
                        con += '<span style="display: block;">';
                        item.borrow_flag.forEach(flag => {
                            if (flag.indexOf('blank') > -1) {
                                con += `<span class="member" style="height: auto; line-height: 0;"><span class="member-blank-carry" data-id="${flag.replace(/(blank)/g, '')}" style="margin: auto;"></span></span>`;
                            } else {
                                con += `<span class="member" style="height: auto; line-height: 0;"><span class="member-blank-carry" style="border: 0; background: transparent; margin: auto;"></span></span>`;
                            }
                        });
                        con += '</span>';
                    }

                    /** 主体 */
                    item.members.forEach((member, i) => {
                        con += '<span style="display: block;margin: 6px 0;">';
                        member.value.forEach(val => {
                            if (val && val.toString().indexOf('blank') > -1) {
                                con += `<span class="member-blank" data-id="${val.replace(/(blank)/g, '')}"></span>`;
                            } else {
                                con += `<span class="member">${val}</span>`;
                            }
                        });
                        con += '</span>';
                    });

                    /** 进位 */
                    if (item.carry_flag && !!item.carry_flag.length) {
                        con += '<span style="display: block; position: absolute; right: 0; bottom: 0;">';
                        item.carry_flag.forEach(flag => {
                            if (flag.indexOf('blank') > -1) {
                                con += `<span class="member-blank-carry" data-id="${flag.replace(/(blank)/g, '')}"></span>`;
                            } else {
                                con += `<span class="member-blank-carry" style="border: 0; background: transparent;"></span>`;
                            }
                        });
                        con += '</span>';
                    }

                    con += '</span>';
                });

                con += '</span>';
                result = result.replace(val, con);
                break;
            default:
                break;
        }

    });
    result = result.replace(/#{"type":"under_begin"}#/g,'<u>').replace(/#{"type":"under_end"}#/g,'</u>');
    return result;
}

/*
* 解析的解析
*
* */
function getExplain(str) {
    if(!str){
        return '';
    }
    if(str.length < 1){
        return '';
    }
    str = str.replace(/\s/g,'&nbsp;');
    var result = replaceCommonJsonToTag(str);
    var block = result.split(`#{"type":"P"}#`);
    let explain = block.map(function(val){
        return `<p>${val}</p>`;
    });
    return explain.join('');
}
/*
* 核心解析
*
* */
function getCore(str){
    if(str.length < 2){
        return '';
    }
    var result = replaceCommonJsonToTag(str);
    var block = result.split(`#{"type":"P"}#`);
    let core = block.map(function(val){
        return `<p>${val}</p>`;
    });
    return core.join('');
}

export {replaceCommonJsonToTag,getExplain,getCore,getParagraph,getParagraphForEdit}