import {getExplain} from '../../../utils/createRender'


let reverseParseTextView = data => {
    let obj = createRender(data, 1);
    let stem = "";
    let explain = "";
    let answer;
    Object.keys(obj).forEach(val => {
        if (val.indexOf("paragraph") > -1) {
            // 题干部分
            if (obj[val].indexOf('inner_audio') > -1) {
                let reading = obj[val].match(/<div class="audio-box" style="margin-bottom: 10px"><div class="inner_audio"}><\/div><span>点击读题<\/span><audio class="math_reading" src=".*?"><\/audio><\/div>/g);
                let audio = reading[0] ? reading[0] : ''
                stem = audio + stem + obj[val].replace(audio, '');
            } else {
                stem += obj[val];
            }
        } else if (val.indexOf("explain") > -1) {
            // 解析部分
            explain += obj[val];
        } else if (val.indexOf("answer") > -1) {
            // 答案部分
            answer = obj[val];
        }
    });

    let result = {
        stem,
        explain,
        answer,
    };
    return result
};

function createRender(data, showType = 1) {//showType:0 编辑用，1 展示用
    if (!data.stem) {
        return {}
    }
    let render = {};
    // 匹配answer
    let answer = '';
    data.answer && (answer = getAnswer(data.answer));

    // 匹配解析
    let explain = '';
    data.explain && (explain = {explain: getExplain(data.explain)});

    const stem = data.stem.replace(/(?=(blank\d))/g, '#').replace(/(?=(}#"))/g, '#').replace(/(#{#)|(#}#)/g, '');
    // 匹配 stem
    let {paragraph, style} = getParagraph(stem, 'paragraph');
    render = Object.assign({}, paragraph, explain, answer, style);

    return render;
}

function getParagraph(str, paragraphKindName) {
    let result = replaceCommonJsonToTag(str),
        style = {style: {}},
        paragraph = {};

    let pattern = /#{(.+?)}#/g;
    let block = result.match(pattern);
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

    let reg_stem = /#{"type":"para_begin"[^}]*}#(.*?)#{"type":"para_end"}#/ig;
    let firstRes = reg_stem.exec(result);
    if (!firstRes) return {};
    let p = firstRes[1].split(`#{"type":"P"}#`);
    firstRes[1] = p.map(function (val) {
        return '<p class="' + style['style'][`${paragraphKindName}0`] + '">' + val + '</p>';
    });
    paragraph[`${paragraphKindName}0`] = firstRes[1].join("");
    let key = 0;
    while (reg_stem.lastIndex) {
        let pp = reg_stem.exec(result);
        if (!pp) break;
        key++;
        let p = pp[1].split(`#{"type":"P"}#`);
        pp[1] = p.map(function (val) {
            return '<p class="' + style['style'][`${paragraphKindName}${key}`] + '">' + val + '</p>';
        });
        pp[1] = pp[1].join('');
        paragraph[`${paragraphKindName}${key}`] = pp[1];
    }
    style['style'] = JSON.stringify(style['style']);
    return {paragraph, style};
}

function getAnswer(str) {
    let answer = {answer: {}};
    str = replaceCommonJsonToTag(str).replace(/"mathquill-embedded-latex"/g, '\\"mathquill-embedded-latex\\"');
    try {
        str = JSON.parse(str);
    } catch (e) {
        str = [{content: "答案解析失败"}];
    }

    str.forEach((val) => {
        answer.answer[val.blank_id] = val.content;
    });

    return answer;
}


function replaceCommonJsonToTag(str) {
    if (!str) return '';
    var result = str;
    let pattern = /#{(.+?)}#/g;
    var block = result.match(pattern);
    block && block.forEach(function (val) {
        let content = val.replace(/(#)/g, "");
        let obj = {};
        try {
            obj = JSON.parse(content);
        } catch (error) {
            return ''
        }
        switch (obj.type) {
            case 'latex':
                let pattern1 = /{"type":"blank".*?}\\/g;
                var block1 = obj.content.match(pattern1);
                block1 && block1.forEach((val) => {
                    obj.content = obj.content.replace(val, `left[\\right]`);
                });
                result = result.replace(val, `<span class="mathquill-embedded-latex">${obj.content}</span>`);
                break;
            case 'blank':
                switch (obj.size) {
                    case 'express':
                        result = result.replace(val, `<span class="member-blank-stem" data-id="${obj.id}"></span>`);
                        break;
                    case 'letter':
                        result = result.replace(val, `<img src="http://knowapp.b0.upaiyun.com/ss/pcSide/edu_fillin_word.png" class="img_fillin_letter"/>`);
                        break;
                    case 'line':
                        result = result.replace(val, `<img src="http://knowapp.b0.upaiyun.com/ss/pcSide/edu_fillin_line.png" class="img_fillin_line"/>`);
                        break;
                    case 'fillin':
                        result = result.replace(val, `blank`);
                        break;
                    default:
                        break;
                }
                break;
            case 'img':
                switch (obj.size) {
                    case 'small_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-smaller-image"/>`);
                        break;
                    case 'mid_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-middle-image"/>`);
                        break;
                    case 'big_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-bigger-image"/>`);
                        break;
                    case 'choice_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-middle-image"/>`);
                        break;
                    case 'small_category_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-small-category-image"/>`);
                        break;
                    case 'mid_category_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-mid-category-image"/>`);
                        break;
                    case 'big_category_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-big-category-image"/>`);
                        break;
                    case 'small_match_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-small-match-image"/>`);
                        break;
                    case 'mid_match_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-mid-match-image"/>`);
                        break;
                    case 'big_match_image':
                        result = result.replace(val, `<img name="question" data-src="${obj.src}" class="box-exercise-big-match-image"/>`);
                        break;
                    default:
                        break;
                }
                break;
            case 'audio':
                switch (obj.style) {
                    case 'math_reading':
                        result = result.replace(val, `<div class="audio-box" style="margin-bottom: 10px"><div class="inner_audio"}></div><span>点击读题</span><audio class="math_reading" src="${obj.src}" style="display:none"></audio></div>`);
                        break;
                    default:
                        result = result.replace(val, `<audio src="${obj.src}">您的浏览器不支持</audio>`);
                        break;
                }
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
    result = result.replace(/#{"type":"under_begin"}#/g, '<u>').replace(/#{"type":"under_end"}#/g, '</u>');
    return result;
}

export {reverseParseTextView}