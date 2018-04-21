export const SOURCE = "source";
export const TARGET = "target";
export const KNOW = 21;
export const ISSUE = 122;
export const PAPER = 2;
export const ASSIST = 101;
export const ASSISTKNOW = 1001;
export const KNOWLEDGEWITHISSUE = 26;
export const ALLOWTYPE = {
    [KNOW] : "知识点",
    [ISSUE] : "考点",
    [PAPER] : "试卷",
    [ASSIST] : "章节",
    [KNOWLEDGEWITHISSUE] : "知识点及考点",
}

export const QUESTIONFILTER = [
    {type:"difficult", name:"难度"},
    {type:"systemtype", name:"题目类型"},
    {type:"hot", name:"热度"},
    {type:"rightrate", name:"正确率"},
    {type:"onlinestatus", name:"上线状态"},
]

export const KOTM = [
    {value:"editionList", name:"教材"},
    {value:"bookList", name:"课本"},
    {value:"bookAssistList", name:"教辅"},
    {value:"sectionKnowList", name:"关联关系树"},
]

export const GRADE = {
    PRIMARY:'10',//小学
    JUNIOR:'20',//初中
    SENIOR:'30',//高中
}

export const GRADE_PART = {
    [GRADE.PRIMARY]:'小学',
    [GRADE.JUNIOR]:'初中',
    // [GRADE.SENIOR]:'高中',
}

export const SUBJECT = {
    MATH: '0',
    CHINESE:'1',
    ENGLISH:'2',
    PHYSICS:'3',
    CHEMISTRY:'4',
    BIOLOGY:'5',
    HISTORY:'6',
    GEOGRAPHY:'7',
    POLITICAL:'8',
    IT:'9',
    SCIENCE:'10'
}

export const SUBJECT_PART = {
    [SUBJECT.MATH]: '数学',
    [SUBJECT.CHINESE]: '语文',
    [SUBJECT.ENGLISH]: '英语',
    // [SUBJECT.PHYSICS]: '物理',
    // [SUBJECT.CHEMISTRY]: '化学',
    // [SUBJECT.BIOLOGY]: '生物',
    // [SUBJECT.HISTORY]: '历史',
    // [SUBJECT.GEOGRAPHY]: '地理',
    // [SUBJECT.POLITICAL]: '政治',
    // [SUBJECT.IT]: '信息技术',
    [SUBJECT.SCIENCE]: '科学',

}
export const SUBJECT_PART_TO_STRING = {
    [SUBJECT.MATH]: 'math',
    [SUBJECT.CHINESE]: 'chinese',
    [SUBJECT.ENGLISH]: 'english',
    // [SUBJECT.PHYSICS]: '物理',
    // [SUBJECT.CHEMISTRY]: '化学',
    // [SUBJECT.BIOLOGY]: '生物',
    // [SUBJECT.HISTORY]: '历史',
    // [SUBJECT.GEOGRAPHY]: '地理',
    // [SUBJECT.POLITICAL]: '政治',
    // [SUBJECT.IT]: '信息技术',
    [SUBJECT.SCIENCE]: 'science',

}
export const SUBJECT_STEM_STYLE = {
    [SUBJECT.MATH]: [
        {"type_name": "引导语", "type_style": "math_guide"},
        {"type_name": "题干文字", "type_style": "math_text"},
        {"type_name": "题干图片", "type_style": "math_picture"},
        {"type_name": "题干音频", "type_style": "math_audio"},
        {"type_name": "题干提示文字", "type_style": "math_tiptext"},
    ],
    [SUBJECT.CHINESE]: [
        {"type_name": "引导语", "type_style": "chinese_guide"},
        {"type_name": "题干文字", "type_style": "chinese_text"},
        {"type_name": "题干图片", "type_style": "chinese_picture"},
        {"type_name": "题干音频", "type_style": "chinese_audio"},
        {"type_name": "题干提示文字", "type_style": "chinese_tiptext"},
        {"type_name": "朗读题题干", "type_style": "chinese_read"},
        {"type_name": "背诵题题干", "type_style": "chinese_recite"},
        {"type_name": "带拼音朗读题", "type_style": "chinese_read_pinyin"},
        {"type_name": "带拼音背诵题", "type_style": "chinese_recite_pinyin"},
    ],
    [SUBJECT.ENGLISH]: [
        {"type_name": "引导语", "type_style": "english_guide"},
        {"type_name": "题干文字", "type_style": "english_text"},
        {"type_name": "题干图片", "type_style": "english_picture"},
        {"type_name": "题干音频", "type_style": "english_audio"},
        {"type_name": "题干提示文字", "type_style": "english_tiptext"},
        {"type_name": "单词挖空", "type_style": "english_blank"},
        {"type_name": "单词全拼", "type_style": "english_spell"},
        {"type_name": "连词成句输入区", "type_style": "english_sentence"},
        {"type_name": "朗读题题干", "type_style": "english_read"},
        {"type_name": "背诵题题干", "type_style": "english_recite"},
    ],
    [SUBJECT.SCIENCE]: [
        {"type_name": "引导语", "type_style": "science_guide"},
        {"type_name": "题干文字", "type_style": "science_text"},
        {"type_name": "题干图片", "type_style": "science_picture"},
        {"type_name": "题干音频", "type_style": "science_audio"},
        {"type_name": "题干提示文字", "type_style": "science_tiptext"},
    ],
}



export const EXPLAIN_TASK_STAGE_MAP = {
    '0':'pre_assign',
    '10':'img_explain',
    '20':'pre_img_explain_check',
    '30':'img_explain_check',
    '32':'img_explain_rework',
    '100':'pre_text_explain',
    '110':'text_explain',
    '120':'pre_text_explain_check',
    '130':'text_explain_check',
    '132':'text_explain_rework',
    '200':'text_explain_pass',
    '1003':'text_explain_onlineing',
    '1001':'text_explain_online_success',
    '1002':'text_explain_online_fail',
}

export const TOOLBARS = {
    mathFormula:[
        'formula',
        'insert_vertical','|', 'underline','|',
    ],
    mathAnswer:[
        'insert_gt', 'insert_lt','|',
        'insert_add','insert_minus','insert_multiply','insert_divide','insert_equal',
    ],
    blankImgAudio:[
        'fillin_line','fillin_letter','fillin_express', '|', 'image','audition_upload','audiogenerator',
    ],

}
export const getToolbars = (subject,type)=>{
    let arr = [];
    if(type==='stem'){
        arr.push(...TOOLBARS.mathFormula)
    }
    if(type==='stem'||type==='answer'){
        arr.push(...TOOLBARS.mathAnswer)
    }
    if(type==='stem'){
        arr.push(...TOOLBARS.blankImgAudio)
    }
    return arr
}


export const ONLINE_STATUS_NOTONLINE = 0;
export const ONLINE_STATUS_WAITONLINE = 1;
export const ONLINE_STATUS_ONLINED = 2;
export const ONLINE_STATUS_WAITOFFLINE = 3;
export const ONLINE_STATUS_OFFLINE = 4;

export const ONLINESTATUS = {
    [ONLINE_STATUS_NOTONLINE]:'不上线',
    [ONLINE_STATUS_WAITONLINE]:'待上线',
    [ONLINE_STATUS_ONLINED]:'已上线',
    [ONLINE_STATUS_WAITOFFLINE]:'待下线',
    [ONLINE_STATUS_OFFLINE]:'已下线'
};