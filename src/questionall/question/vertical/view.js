import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {TYPE_MAP} from '../../../utils/questionType';

/** PERSONAL */
import {reverseParseTextView} from './createRender';
import {Rate} from 'antd'

const $ = require('$');
const MathQuill = require('MathQuill');
const MQ = MathQuill.getInterface(2);

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        this.MQLoad();
    }

    componentDidUpdate() {
        this.MQLoad();
    }

    createHtml = str => ({__html: str ? str : `&nbsp;`});

    MQLoad = () => {
        $('.mathquill-embedded-latex', this.viewer).removeAttr('style').each(function (index, item) {
            // 然而, 我们这里并不是可编辑的
            MQ.StaticMath(item);
        });
    };

    toggleAnswer = (val, e, answer) => {
        e.stopPropagation();
        this.setState({visible: val});
        const blanks = $(findDOMNode(this)).find(`span[data-id]`);
        if (val) {
            blanks.each(function() {
                const id = $(this).attr('data-id');
                $(this).html(answer[id].split('|')[0]);
            });
        } else {
            blanks.html('');
        }
    };

    render() {
        const {visible} = this.state;
        const {num} = this.props;
        let originData = this.props.data;
        if(this.props.errorAnswer){originData.answer = this.props.errorAnswer}//题目检错页显示的是错的的答题答案

        let data = reverseParseTextView(originData);

        return (
            <div className="box-exercise" ref={'viewer'}>
                <div className="exercise-content">
                    {num!=='undefined'&&<div className="exercise-num"><p className="math_text">{`${num + 1}、`}</p></div>}

                    <div className="exercise-con" dangerouslySetInnerHTML={this.createHtml(data.stem)}/>
                </div>
                <div className="exercise-footer">
                    {/*{*/}
                        {/*visible && <div className="footer-hide relative">*/}
                            {/*<div className="inline-block"><span style={{fontSize: 14}}>正确答案：</span></div>*/}
                            {/*<div className="inline-block"><span className="answer">见蓝色字体</span></div>*/}
                        {/*</div>*/}
                    {/*}*/}
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
                        {
                            !visible ?
                                <span className="exercise-btn" onClick={(e) => this.toggleAnswer(true, e, data.answer)}>展开答案</span> :
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

export default Exercise;