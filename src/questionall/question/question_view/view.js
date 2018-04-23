import React, {Component} from 'react';
import {Tag} from 'antd';
import audiojs from 'audiojs';
import * as Types from './../../../utils/questionType'
import './style.css'

//......各种类型的题
import QuestionFillin from '../../question/fillin/viewForView';
import QuestionSelect from '../../question/select/viewForView';
import QuestionJudge from '../../question/judge/viewForView';
import QuestionHollow from '../../question/hollow/viewForView';
import QuestionMatch from '../../question/ligature/viewForView';
import QuestionClassify from '../../question/classify/viewForView';
import QuestionWordProblem from '../../question/wordproblem/viewForView';
import QuestionBankedCloze from '../../question/bankedcloze/viewForView';
import QuestionVertical from '../../question/vertical/view';

import QuestionRead from '../../question/read/viewForView';
import QuestionRecite from '../../question/recite/viewForView';

class Question extends Component {
    state = {
        selectQuestions: [],
    }

    componentDidUpdate() {
        audiojs.createAll();
    }
    render() {

        const {data = {},num=1,errorAnswer} = this.props;
        data.id = data.question_id;
        data.rate = data.right_rate
        let page = this.props.current
        if(!page){page = 1}
        let v = data
        v.type_show=v.show_type
        v.stem=v.question
        v.answer=v.right_answer
        v.item_list=[]
        return (
            <div>


                                    {/*填空题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_FILLIN &&
                                    <QuestionFillin data={v} num={num} errorAnswer={errorAnswer}/>
                                    }

                                    {/*选择题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_SELECT &&
                                    <QuestionSelect data={v} num={num} errorAnswer={errorAnswer}/>
                                    }

                                    {/*/!*判断题展示*!/*/}
                                    {v.type_show == Types.TYPE_SHOW_JUDGE &&
                                    <QuestionJudge data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*/!*图片挖空题展示*!/*/}
                                    {v.type_show == Types.TYPE_SHOW_HOLLOW &&
                                    <QuestionHollow data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*/!*连线题展示*!/*/}
                                    {v.type_show == Types.TYPE_SHOW_LIGATURE &&
                                    <QuestionMatch data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*分类题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_CLASSIFY &&
                                    <QuestionClassify data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*应用题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_WORDPROBLEM &&
                                    <QuestionWordProblem data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*选词填空题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_BANKEDCLOZE &&
                                    <QuestionBankedCloze data={v} num={num} errorAnswer={errorAnswer}/>
                                    }

                                    {/*连词成句题展示*/}
                                    {/*{v.type_show == Types.TYPE_SHOW_BANKEDCLOZE &&*/}
                                    {/*<QuestionBankedCloze data={v} num={num} />*/}
                                    {/*}*/}
                                    {/*朗读题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_READ &&
                                    <QuestionRead data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*背诵题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_RECITE &&
                                    <QuestionRecite data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*竖式题展示*/}
                                    {v.type_show == Types.TYPE_SHOW_VERTICAL &&
                                    <QuestionVertical data={v} num={num} errorAnswer={errorAnswer}/>
                                    }
                                    {/*不支持题展示*/}
                                    {
                                        !Types.NUM_TO_TYPE[v.type_show]&&
                                        <div className="box-exercise" ref={(el) => {this.viewer = el}}>
                                            <div className="exercise-content">
                                                {num!=='undefined'&&<div className="exercise-num"><p className="math_text">{`${num}、`}</p></div>}
                                                <div style={{fontSize:'18px',textAlign:'center'}}>暂不支持该题型</div>
                                            </div>
                                        </div>

                                    }
            </div>
        )
    }
}

export default Question