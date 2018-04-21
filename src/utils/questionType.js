export const TYPE_SHOW_FILLIN = '20';
export const TYPE_SHOW_SELECT = '21';
export const TYPE_SHOW_BANKEDCLOZE = '22';
export const TYPE_SHOW_MAKESENTENCES = '23';
export const TYPE_SHOW_READ = '24';

export const TYPE_SHOW_JUDGE = '25';
export const TYPE_SHOW_RECITE = '26';

export const TYPE_SHOW_MULTISELECT = '27';
export const TYPE_SHOW_HOLLOW = '28';
export const TYPE_SHOW_WORDPROBLEM = '30';
export const TYPE_SHOW_LIGATURE = '31';
export const TYPE_SHOW_CLASSIFY = '32';

export const TYPE_SHOW_VERTICAL = '35';

/*************************************************/

export const TYPE_TO_NUM = {
        fillin: TYPE_SHOW_FILLIN,
        select:TYPE_SHOW_SELECT,
        judge:TYPE_SHOW_JUDGE,
        hollow:TYPE_SHOW_HOLLOW,
        wordproblem:TYPE_SHOW_WORDPROBLEM,
        ligature:TYPE_SHOW_LIGATURE,
        classify:TYPE_SHOW_CLASSIFY,
        multiSelect:TYPE_SHOW_MULTISELECT,
        bankedcloze:TYPE_SHOW_BANKEDCLOZE,//选词填空
        makeSentences:TYPE_SHOW_MAKESENTENCES,//连词成句
        read:TYPE_SHOW_READ,//朗读
        recite:TYPE_SHOW_RECITE,//背诵
        vertical:TYPE_SHOW_VERTICAL,
}
export const NUM_TO_TYPE={
    [TYPE_SHOW_FILLIN]: 'fillin',
    [TYPE_SHOW_SELECT]:'select',
    [TYPE_SHOW_JUDGE]:'judge',
    [TYPE_SHOW_HOLLOW]:'hollow',
    [TYPE_SHOW_WORDPROBLEM]:'wordproblem',
    [TYPE_SHOW_LIGATURE]:'ligature',
    [TYPE_SHOW_CLASSIFY]:'classify',
    [TYPE_SHOW_MULTISELECT]:'multiSelect',
    [TYPE_SHOW_BANKEDCLOZE]:'bankedcloze',
    // [TYPE_SHOW_MAKESENTENCES]:'makeSentences',
    [TYPE_SHOW_READ]:'read',
    [TYPE_SHOW_RECITE]:'recite',
    [TYPE_SHOW_VERTICAL]:'vertical',
}
export const TYPE_MAP = {
    [TYPE_SHOW_FILLIN]:'填空题',
    [TYPE_SHOW_SELECT]:'选择题',
    [TYPE_SHOW_JUDGE]:'判断题',
    [TYPE_SHOW_HOLLOW]:'图片挖空',//无答案 无选项
    [TYPE_SHOW_MULTISELECT]:'多选题',
    [TYPE_SHOW_WORDPROBLEM]:'应用题',//新增应用题
    [TYPE_SHOW_LIGATURE]:'连线题',
    [TYPE_SHOW_CLASSIFY]:'分类题',
    [TYPE_SHOW_BANKEDCLOZE]:'选词填空',
    [TYPE_SHOW_MAKESENTENCES]:'连词成句',
    [TYPE_SHOW_READ]:'朗读',
    [TYPE_SHOW_RECITE]:'背诵',
    [TYPE_SHOW_VERTICAL]:'竖式',

};
export const QUESTIONSTAGE = {"1": "阅读理解", "2": "推理分析", "3": "列式解答"}

export const AUTHORITY ={
    QUESTIONBOX_CHECK:11,//题盒子审题权限
    QUESTIONBOX_ENTRY : 12,//题盒子录题权限
    QUESTIONBOX_ENTRYGROUP_ADMIN : 13,//题盒子录题组管理
    QUESTIONBOX_TASK_ADMIN : 14,//题盒子任务管理
}

