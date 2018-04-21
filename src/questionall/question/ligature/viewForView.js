import React, {Component,} from 'react';
import  {findDOMNode,} from 'react-dom';

import {reverseParseTextView} from './createRender';
import {TYPE_MAP} from '../../../utils/questionType';
import {Rate} from 'antd'

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
    toggleAnswer = (val, e, id, rightAnswer) => {
        // val && cnzz.statistics('PC端作业详情页', 2, '展开答案'); /** 打点统计 */
        e.stopPropagation();
        this.setState({visible: val});

    };
    componentDidMount() {
        this.MQLoad();
        if(this.props.data.subject==='0'){
            this.setState({visible:true})  //数学题默认答案显示
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.MQLoad();
    }
    MQLoad = () => {
        const {data} = this.props;
        $('.mathquill-embedded-latex', this.refs.viewer)
            .removeAttr('style')
            .each(function (index, item) {
                // 然而, 我们这里并不是可编辑的
                MQ.StaticMath(item);
            })
        $('audio', this.refs.viewer).off();
        $('.inner_audio', this.refs.viewer) && $('.inner_audio', this.refs.viewer).off().on('click', () => {
            $('audio', this.refs.viewer)[0].play();
            $('.inner_audio', this.refs.viewer).addClass('inner-audio-play');
        });
        $('audio', this.refs.viewer) && $('audio', this.refs.viewer).bind('ended', () => {
            $('.inner_audio', this.refs.viewer).removeClass('inner-audio-play');
        });
    };
    drawLine = (id, rightAnswer, val) => {
        let c = document.getElementById(`canvas-${id}`);
        if(!c){return}
        let ctx = c.getContext("2d");
        if (val) {
            let lh = $(c).prev().outerHeight();
            let rh = $(c).next().outerHeight();
            if (lh > rh) {
                c.height = lh * 2;
                c.style.height = lh + 'px';
            } else {
                c.height = rh * 2;
                c.style.height = rh + 'px';
            }
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#00afff';
            let lele = '', rele = '';
            for (let key in rightAnswer) {
                lele = $(c).prev().find('.line-item');
                rele = $(c).next().find('.line-item');
                rightAnswer[key].forEach(item => {
                    ctx.moveTo(10, lele.eq(parseInt(key) - 1).outerHeight() + lele.eq(parseInt(key) - 1).position().top * 2);
                    ctx.lineTo(245 * 2, rele.find(`p[data-id=${item}]`).parent().outerHeight() + rele.find(`p[data-id=${item}]`).parent().position().top * 2);
                });
            }
            ctx.stroke();
        } else {
            c.height = c.height;
        }
    };

    createHtml = str => ({__html: str ? str : `&nbsp;`});


    render() {
        const {visible} = this.state;
        let originData = this.props.data;
        if(this.props.errorAnswer){originData.answer = this.props.errorAnswer}//题目检错页显示的是错的的答题答案

        let num = this.props.num;
        let data = reverseParseTextView(originData);

        const imgs = $(findDOMNode(this)).find('img');
        if (imgs.length === 0) {
            this.drawLine(originData.id, data.answer, this.state.visible);
        } else {
            imgs.load(() => {
                this.drawLine(originData.id, data.answer, this.state.visible);
            });
        }

        return (
            <div className="box-exercise ligature" ref={'viewer'}>
                <div className="exercise-content">
                    {num!=='undefined'&&<div className="exercise-num"><p className="math_text">{`${num + 1}、`}</p></div>}
                    <div className="exercise-con">
                        <div dangerouslySetInnerHTML={this.createHtml(data.stem)}/>
                        <div style={{width: '100%'}} className={'questionCore'}>
                            {
                                data.leftList && !!data.leftList.length &&
                                <div style={{width: '40%'}} className="inline-block relative">
                                    {
                                        data.leftList.map((val, key) =>
                                            <div key={key} className="line-item"
                                                 dangerouslySetInnerHTML={this.createHtml(val)}/>
                                        )
                                    }
                                </div>
                            }
                            {
                                data.leftList && !!data.leftList.length &&
                                data.rightList && !!data.rightList.length &&
                                <canvas id={`canvas-${originData.id}`} width={500} height={400}
                                        style={{width: '20%', height: 200}}/>
                            }
                            {
                                data.rightList && !!data.rightList.length &&
                                <div style={{width: '40%'}} className="inline-block relative">
                                    {
                                        data.rightList.map((val, key) =>
                                            <div key={key} className="line-item"
                                                 dangerouslySetInnerHTML={this.createHtml(val)}/>
                                        )
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="exercise-footer">
                    {
                        visible &&
                        <div className="footer-hide relative">
                            <div style={{fontSize: 14}}>{this.props.errorAnswer?'错误答案：':'正确答案：'}见蓝色连线</div>
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
                            originData.local &&
                            <span style={{fontSize: 14, marginRight: 30}}>本地正确率: {originData.local}</span>
                        }
                        {
                            originData.right &&
                            <span style={{fontSize: 14, marginRight: 30}}>本地正确率: {originData.right}</span>
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
                            originData.train &&
                            <span style={{fontSize: 14, marginRight: 30}}>练习量: {originData.train}</span>
                        }
                        {
                            (originData.rate || originData.rate == 0) && <span style={{
                                fontSize: 14,
                                marginRight: 30
                            }}>正确率: {originData.rate == '-1' ? '0' : originData.rate}%{originData.total_times?`(${originData.total_times})`:''}</span>
                        }
                        {
                            !visible ?
                                <span className="exercise-btn" onClick={(e) => this.toggleAnswer(true, e, originData.id, data.answer)}>展开答案</span> :
                                <span className="exercise-btn" onClick={(e) => this.toggleAnswer(false, e, originData.id, data.answer)}>隐藏答案</span>
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