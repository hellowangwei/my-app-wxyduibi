import React, {Component} from 'react';
import {TYPE_MAP} from '../../../utils/questionType';
import {reverseParseTextView} from './createRender';
import {Rate} from 'antd';

const $ = require('$');
const MathQuill = require('MathQuill');

const MQ = MathQuill.getInterface(2);

class Question extends Component {

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
        if(this.props.data.subject==='0'){
            this.setState({visible:true})  //数学题默认答案显示
        }
    }

    componentDidUpdate() {
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

    render() {
        const {visible} = this.state;
        let originData = this.props.data;
        if(this.props.errorAnswer){originData.answer = this.props.errorAnswer}//题目检错页显示的是错的的答题答案

        const {num, children} = this.props;
        let data = reverseParseTextView(originData);
        return (
            <div className="box-exercise" ref={'viewer'}>
                <div className="exercise-content">
                    {num!=='undefined'&&<div className="exercise-num"><p className="math_text">{`${num + 1}、`}</p></div>}
                    <div className="exercise-con" dangerouslySetInnerHTML={this.createHtml(data.stem)}/>
                    {
                        data.item_list && !!data.item_list.length &&
                        <div className="exercise-options">
                            {
                                data.item_list.map((val, key) =>
                                    <div key={key} className="exercise-option">
                                        <div className="exercise-option-code">{val.code}、</div>
                                        <div className="exercise-option-item" dangerouslySetInnerHTML={this.createHtml(val.item)}/>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
                <div className="exercise-footer">
                    {
                        visible &&
                        <div className="footer-hide relative">
                            <div>
                                <div className="inline-block"><span style={{fontSize: 14}}>{this.props.errorAnswer?'错误答案：':'正确答案：'}</span></div>
                                <div className="inline-block" style={{width: '80%'}}>
                                    <span style={{fontSize: 14}}  dangerouslySetInnerHTML={this.createHtml(data.answer.join('、 '))}/>
                                </div>
                            </div>
                            {
                                data.explain && <div>
                                    <div className="inline-block"><span style={{fontSize: 14}}>答案解析：</span></div>
                                    <div className="inline-block">
                                        <span style={{fontSize: 14}} dangerouslySetInnerHTML={this.createHtml(data.explain)}/>
                                    </div>
                                </div>
                            }
                        </div>
                    }
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
                            (originData.rate || originData.rate == 0) &&
                            <span style={{fontSize: 14, marginRight: 30}}>正确率: {originData.rate == '-1' ? '0' : originData.rate}%{originData.total_times?`(${originData.total_times})`:''}</span>
                        }
                        {
                            !visible ?
                                <span className="exercise-btn" onClick={(e) => this.toggleAnswer(true, e)}>展开答案</span> :
                                <span className="exercise-btn" onClick={(e) => this.toggleAnswer(false, e)}>隐藏答案</span>
                        }
                        {/*{*/}
                        {/*originData.knowledge && <div><span style={{fontSize: 14}}>知识点: {originData.knowledge}</span></div>*/}
                        {/*}*/}
                        {
                            (originData.know_list && originData.know_list.length>0) && <div><span style={{fontSize: 14}}>知识点: {originData.know_list.concat().map(d=>d.name)}</span></div>
                        }
                        {
                            (originData.issue_list && originData.issue_list.length>0) && <div><span style={{fontSize: 14}}>考点: {originData.issue_list.concat().map(d=>d.name)}</span></div>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default Question;