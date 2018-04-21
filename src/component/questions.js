import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import {TYPE_MAP} from '../utils/questionType'


// antd组件部分
import { Layout, Button, Select, Input, Tag,Modal, Row, Col, Spin,Card,message,Pagination,Upload,Icon} from 'antd';
import Question from '../questionall/question/question_view/view'

const { Header, Footer, Sider, Content } = Layout;

const { CheckableTag } = Tag;
const Search = Input.Search;
const Option = Select.Option;

// 自定义组件



class ImageView extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        page:1,
        type: 'all',
        min_rate: '0.3',
        max_rate: '0.5',
        questions:[],

    }
    componentDidMount() {
        /*处理数据*/
        let token = this.getData('token')

        this.getList()

    }

    getList = ()=>{//获得图片列表
        setTimeout(()=>{
            let params={
                type: this.state.type,
                min_rate: this.state.min_rate,
                max_rate: this.state.max_rate,
                page: this.state.page,
            }

            let url = `/api/similar_questions`
            axios(url,{params})
                .then((response)=>{
                    this.setState({questions:response.data.data,pagination:response.data.pagination})
                })
                .catch((err)=>{
                    console.log(err);
                });
        },0)

    }



    pageChange =  (val)=>{
        let page = val
        this.setState({page})
        this.getList();
    }

    getData(key) {
        let cookies = window.document.cookie.split(';');
        for (let i = 0, item = cookies[i]; item; item = cookies[++i]) {
            let [name, value] = item.split('=');
            if (key == name.trim()) {
                return unescape(value);
            }
        }
        console.log(`从未设置过key为${key}的Cookie`);
    }
    createHtml = str => ({ __html: str ? str : `&nbsp;` });




    closeAudio = ()=>{
        let audios = document.querySelectorAll('audio')
        audios.forEach((audio)=>{
            if(audio!==null){
                if(audio.paused)                     {
                }else{
                    audio.pause();// 这个就是暂停
                }
            }
        })

    }
    audioOnclick = (className)=>{
        let audio = document.querySelector(`.${className}`)
            if(audio!==null){
                if(audio.paused) {
                    this.closeAudio()
                    audio.play();// 这个就是暂停
                }else{
                    audio.pause();// 这个就是暂停
                }
            }

    }
    render() {
        const {page,token,images,pagination,questions,loading,imgList} = this.state
        console.log(images)
        return (
            <div style={{minWidth:1250,margin:'0 auto',padding:'20px'}}>
                <div>
                    <Input
                        placeholder="输入关键字"
                        style={{width:220,marginRight:10}}
                        value={this.state.search}
                        onChange={(e)=>this.setState({search:e.target.value})}

                    />
                    <Button style={{fontSize: 12,marginRight:'120px'}} type="primary" onClick={this.onSearch}>搜索</Button>

                    <label style={{width:'70px',display:'inline-block'}} htmlFor="search_type">尺寸筛选 ：</label>
                    <Select value={this.state.filter} style={{ width: 120 }} onChange={this.filter} id="search_type">
                        <Option value="0">全部</Option>

                        {
                            Object.keys(TYPE_MAP).map((k)=>
                                <Option value={k}>{TYPE_MAP[k]}</Option>
                            )
                        }

                    </Select>

                </div>

                <div style={{marginTop:'50px',fontSize:'17px',color:'#888'}}>
                    {
                        this.state.questions&&this.state.questions.map((d,k)=>
                            <div key={k} style={{marginBottom:'50px'}}>
                                <div>
                                    <h3 style={{background:'#49a9ee',color:'#fff',padding:'8px 20px'}}>
                                        <span style={{marginRight:50}}>题目类型:{TYPE_MAP[d.question_1_type]}</span>
                                        <span>相似度:{d.similar_rate}</span>
                                    </h3>
                                </div>
                                <div>
                                    <Col span={12}>
                                        <Question data={d.question_1} />
                                    </Col>
                                    <Col span={12}></Col>
                                </div>

                            </div>
                        )
                    }


                </div>


                    <Footer>
                        {
                            pagination &&
                            <Pagination
                                showQuickJumper
                                pageSize={+20}
                                // showSizeChanger
                                total={pagination.total_questions}
                                onChange={ this.pageChange }
                                // onShowSizeChange = { this.onShowSizeChange }
                                current={page}
                            />
                        }

                    </Footer>
                </div>

        )
    }
}

export default ImageView