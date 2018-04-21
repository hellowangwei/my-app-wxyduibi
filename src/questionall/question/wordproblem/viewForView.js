import React, {Component} from 'react';
import {reverseParseTextView} from './createRender';
import { Rate,Tabs} from 'antd';
import WordTree from './wordTreeForView/view';
import * as Types from './../../../utils/questionType';

import {view as QuestionFillinSub} from './sub_question_view/fillin';
import {view as QuestionSelectSub} from './sub_question_view/select';
import {view as QuestionJudgeSub} from './sub_question_view/judge';
import {view as QuestionHollowSub} from './sub_question_view/hollow';
// const QuestionFillinSub = asyncComponent(() => import('./sub_question_view/fillin/view'));
// const QuestionSelectSub = asyncComponent(() => import('./sub_question_view/select/view'));
// const QuestionJudgeSub = asyncComponent(() => import('./sub_question_view/judge/view'));
// const QuestionHollowSub = asyncComponent(() => import('./sub_question_view/hollow/view'));

const {TYPE_MAP}= Types

const {TabPane} = Tabs;
const $ = require('$');
const MathQuill = require('MathQuill');
const MQ = MathQuill.getInterface(2);

class Question extends Component {
    state = {
        selectSub: 'all',
        originData:false,
        iusInit:false,
    }
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }
    toggleAnswer = (val, e) => {
        // val && cnzz.statistics('PC端作业详情页', 2, '展开答案'); /** 打点统计 */
        e.stopPropagation();
        this.setState({visible: val});
    };
    componentDidMount() {
        $('.mathquill-embedded-latex', this.refs.viewer)
            .removeAttr('style')
            .each(function (index, item) {
                // 然而, 我们这里并不是可编辑的
                MQ.StaticMath(item);
            })
        $('.math_reading', this.refs.viewer).off();
        $('.inner_audio', this.refs.viewer) && $('.inner_audio', this.refs.viewer).off().on('click', () => {
            $('.math_reading', this.refs.viewer)[0].play();
            $('.inner_audio', this.refs.viewer).addClass('inner-audio-play');
        });
        $('.math_reading', this.refs.viewer) && $('audio', this.refs.viewer).bind('ended', () => {
            $('.inner_audio', this.refs.viewer).removeClass('inner-audio-play');
        });
    }


    componentDidUpdate(prevProps, prevState) {
        $('.mathquill-embedded-latex', this.refs.viewer)
            .removeAttr('style')
            .each(function (index, item) {
                // 然而, 我们这里并不是可编辑的
                MQ.StaticMath(item);
            });

        $('.math_reading', this.refs.viewer).off();
        $('.inner_audio', this.refs.viewer) && $('.inner_audio', this.refs.viewer).off().on('click', () => {
            $('.math_reading', this.refs.viewer)[0].play();
            $('.inner_audio', this.refs.viewer).addClass('inner-audio-play');
        });
        $('.math_reading', this.refs.viewer) && $('audio', this.refs.viewer).bind('ended', () => {
            $('.inner_audio', this.refs.viewer).removeClass('inner-audio-play');
        });
    }
    createHtml = str => ({__html: str ? str : `&nbsp;`});
    onSelect = (index) => {//选中
        let selectSub = index
        this.setState({selectSub})

    };
    onExpand = (index) => {//展开
        let selectSub = index
        this.setState({selectSub})

    };

    render() {
        const {visible} = this.state;
        let originData = this.props.data;
        if(this.props.errorAnswer){originData.answer = this.props.errorAnswer}//题目检错页显示的是错的的答题答案

        if(!originData) return null
        const {num, children} = this.props;
        let {selectSub} = this.state
        const childExerciseMap = {}; //子题对象。key：题号，value：题目详情。

        //题目字段转换
        !!originData.sub_list.length && originData.sub_list.map(item => {
            //子题对象。key：题号，value：题目详情。
            childExerciseMap[item.number] = item;

            return item;
        });
        if(this.state.originData != 'bad'&&originData.sub_list&&originData.sub_list.length){
            if(originData.answer==='[]'){
                this.state.originData = 'bad'
            }else{
                this.state.originData = reverseParseTextView(originData)
            }
            this.state.isInit = true;
        }
        let data =this.state.originData;
        if(!data) {return null}


        //答案和字体列表不对应 标为坏题
        const loop = (arr)=>{
            arr.forEach((d,k)=>{
                if(d==='bad'){
                    this.state.originData = 'bad'
                    data = 'bad'
                }
                if(d.children&&d.children.length){
                  loop(d.children)
                }
            })
        }
        let treeData = []
        if(data.answer){
            treeData = data.answer
            loop(treeData)
        }

        const childHtml = (exercise) => {
            return <div key={exercise.number}>
                {
                    exercise.stage !== exercise.parentStage &&
                    <p className="stage-tag">{Types.QUESTIONSTAGE[exercise.stage]}</p>
                }
                {
                    exercise.stage === exercise.parentStage &&
                    <p className="stage-tag-small">{Types.QUESTIONSTAGE[exercise.stage]}</p>
                }
                {
                    (
                        exercise.type_show == Types.TYPE_SHOW_FILLIN &&
                        <QuestionFillinSub data={exercise} num={parseInt(exercise.number) - 1}/>
                    ) || (
                        exercise.type_show == Types.TYPE_SHOW_SELECT &&
                        <QuestionSelectSub data={exercise} num={parseInt(exercise.number) - 1}/>
                    )|| (
                        exercise.type_show == Types.TYPE_SHOW_MULTISELECT &&
                        <QuestionSelectSub data={exercise} num={parseInt(exercise.number) - 1}/>
                    ) || (
                        exercise.type_show == Types.TYPE_SHOW_JUDGE &&
                        <QuestionJudgeSub data={exercise} num={parseInt(exercise.number) - 1}/>
                    ) || (
                        exercise.type_show == Types.TYPE_SHOW_HOLLOW &&
                        <QuestionHollowSub data={exercise} num={parseInt(exercise.number) - 1}/>
                    )
                }
            </div>;
        };

        const renderChildNode = (node) => {
            if (!!node.children.length) {
                if (node.branch) {
                    return <div>
                        {childHtml(childExerciseMap[node.index])}
                        <div style={{padding: 30}}>
                            <Tabs>
                                {
                                    node.children.map((n, i) =>
                                        <TabPane key={node.option[i]} tab={node.option[i]}>
                                            {renderChildNode(n)}
                                        </TabPane>
                                    )
                                }
                            </Tabs>
                        </div>
                    </div>
                }
                return <div>
                    {childHtml(childExerciseMap[node.index])}
                    {renderChildNode(node.children[0])}
                </div>;
            } else {
                return childHtml(childExerciseMap[node.index]);
            }
        };
        if(this.state.originData === 'bad'){
            return <div className="box-exercise" ref="viewer">
                <div className="exercise-content" style={{ borderBottom: '1px solid #eaedf6'}}>
                    <p style={{fontSize:'26px',textAlign:'center',marginTop:'20px'}}>此题格式错误，无法解析</p>
                </div>
            </div>
        }

        return (
            <div className="box-exercise" ref="viewer">
                <div className="exercise-content" style={{marginBottom: 20, borderBottom: '1px solid #eaedf6'}}>
                    {num!=='undefined'&&<div className="exercise-num"><p className="math_text">{`${num + 1}、`}</p></div>}
                    <div className="exercise-con" style={{width: '85%',margin: '6px 0',fontSize: '18px',lineHeight:'24px'}} dangerouslySetInnerHTML={this.createHtml(data.stem)}/>

                    <div className="footer-show relative">
                        {
                            originData.id && <span style={{fontSize: 14, marginRight: 30}}>题目ID: {originData.id}</span>
                        }
                        {
                            originData.local && <span style={{fontSize: 14, marginRight: 30}}>本地正确率: {originData.local}</span>
                        }
                        {
                            originData.right && <span style={{fontSize: 14, marginRight: 30}}>本地正确率: {originData.right}</span>
                        }
                        {
                            originData.type_show && <span style={{fontSize: 14, marginRight: 30}}>题目类型：{TYPE_MAP[originData.type_show]}</span>
                        }
                        {
                            originData.difficulty && <span style={{fontSize: 14, marginRight: 30}}>
                                难易度: <Rate count={4} value={parseInt(originData.difficulty)} disabled
                                           style={{fontSize: 14, lineHeight: "17px", verticalAlign: 'text-bottom'}}/>
                            </span>
                        }
                        {
                            originData.train && <span style={{fontSize: 14, marginRight: 30}}>练习量: {originData.train}</span>
                        }
                        {
                            (originData.rate || originData.rate == 0) && <span style={{fontSize: 14, marginRight: 30}}>正确率: {originData.rate == '-1' ? '0' : originData.rate}%{originData.total_times?`(${originData.total_times})`:''}</span>
                        }
                        {/*{*/}
                            {/*!visible ?*/}
                                {/*<span className="exercise-btn" onClick={(e) => this.toggleAnswer(true, e)}>展开答案</span> :*/}
                                {/*<span className="exercise-btn" onClick={(e) => this.toggleAnswer(false, e)}>隐藏答案</span>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*originData.knowledge && <div><span style={{fontSize: 14}}>知识点: {originData.knowledge}</span></div>*/}
                        {/*}*/}
                        {
                            (originData.know_list && originData.know_list.length) && <div><span style={{fontSize: 14}}>知识点: {originData.know_list.concat().map(d=>d.name)}</span></div>
                        }
                    </div>
                    {/*<Button onClick={() => {*/}
                    {/*this.onExpand('all')*/}
                    {/*}}>展开</Button>*/}
                    {
                        !!data.answer &&
                        <WordTree treeData={treeData} onSelect={(index) => {
                            this.onSelect(index)
                        }}/>
                    }

                </div>
                <div style={{borderLeft: '2px solid #00b1fe', marginLeft: -1}}>
                    {   data.answer&&data.answer[0]&&
                        renderChildNode(data.answer[0])
                    }
                </div>
            </div>
        )
    }
}

export default Question;