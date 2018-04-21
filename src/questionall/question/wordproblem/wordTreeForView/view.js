import React, {Component}  from 'react';

class WordProblem extends Component {
    state = {
        stemNumber:1,
        chosenQuestion:1,
        subQuestion:''
    }

    componentDidMount(){
        let svgs = document.getElementsByTagName('svg');
        for(let i = 0;i<svgs.length;i++){
            if(svgs[i].height.baseVal.value > svgs[i].parentElement.clientHeight){
                svgs[i].innerHTML = '';
            }
            if(svgs[i].parentElement.clientHeight/47 > 1 && svgs[i].getAttribute('data') != 'end'){
                svgs[i].innerHTML = `<line x1="35" y1="47" x2="35" y2="100%" style="stroke: rgb(99, 99, 99); stroke-width: 2;"></line>`
            }
        }

    }
    componentDidUpdate(){
        let svgs = document.getElementsByTagName('svg');
        for(let i = 0;i<svgs.length;i++){
            if(svgs[i].height.baseVal.value > svgs[i].parentElement.clientHeight){
                svgs[i].innerHTML = '';
            }
            if(svgs[i].parentElement.clientHeight/47 > 1 && svgs[i].getAttribute('data') != 'end'){
                svgs[i].innerHTML = `<line x1="35" y1="47" x2="35" y2="100%" style="stroke: rgb(99, 99, 99); stroke-width: 2;"></line>`
            }
        }
    }

    onChooseQuestion = (index) => {
        this.props.onSelect(index)
    }

    subQuestion = [{
        index:'1',
        type:'填空题',
        optionIndex:-1,
        children:[
            {
                index:2,
                type:'选择题',
                branch:true,
                optionIndex:-1,
                children:[
                    {
                        index:3,
                        type:'选择题',
                        branch:true,
                        optionIndex:0,
                        children:[
                            {
                                index:4,
                                type:'填空题',
                                optionIndex:0,
                                children:[
                                    {
                                        index:5,
                                        type:'填空题',
                                        optionIndex:-1,
                                        children:[
                                            {
                                                index:6,
                                                type:'填空题',
                                                optionIndex:-1,
                                                children:[]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                index:7,
                                type:'选择题',
                                branch:true,
                                optionIndex:1,
                                children:[
                                    {
                                        index:8,
                                        type:'填空题',
                                        optionIndex:0,
                                        children:[]
                                    },
                                    {
                                        index:9,
                                        type:'填空题',
                                        optionIndex:1,
                                        children:[]
                                    },
                                    {
                                        index:18,
                                        type:'填空题',
                                        optionIndex:2,
                                        children:[]
                                    },
                                    {
                                        index:19,
                                        type:'填空题',
                                        optionIndex:3,
                                        children:[]
                                    }
                                ]
                            },
                            {
                                index:12,
                                type:'选择题',
                                branch:true,
                                optionIndex:2,
                                children:[
                                    {
                                        index:13,
                                        type:'选择题',
                                        branch:true,
                                        optionIndex:0,
                                        children:[
                                            {
                                                index:22,
                                                type:'填空题',
                                                optionIndex:0,
                                                children:[]
                                            },
                                            {
                                                index:23,
                                                type:'填空题',
                                                optionIndex:1,
                                                children:[]
                                            },
                                            {
                                                index:24,
                                                type:'填空题',
                                                optionIndex:2,
                                                children:[]
                                            },
                                            {

                                            }
                                        ]
                                    },
                                    {
                                        index:14,
                                        type:'填空题',
                                        optionIndex:1,
                                        children:[]
                                    },
                                    {
                                        index:20,
                                        type:'填空题',
                                        optionIndex:2,
                                        children:[]
                                    }
                                ]
                            },
                            {
                                index:15,
                                type:'选择题',
                                branch:true,
                                optionIndex:3,
                                children:[
                                    {
                                        index:16,
                                        type:'填空题',
                                        optionIndex:0,
                                        children:[]
                                    },
                                    {
                                        index:17,
                                        type:'填空题',
                                        optionIndex:1,
                                        children:[]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        index:10,
                        type:'填空题',
                        optionIndex:1,
                        children:[
                            {
                                index:11,
                                type:'填空题',
                                optionIndex:-1,
                                children:[]
                            }
                        ]
                    }
                ]
            }
        ]
    }]
    render(){
        let getNode = (data) => {
            let result = <div style={{display:'inline-block',width:100,height:47,color: '#fff',fontSize:12,verticalAlign:'top'}}>
                            <div style={this.state.chosenQuestion == data.index?{display:'inline-block',width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'MediumBlue',textAlign:'center',lineHeight:'30px',whiteSpace:'nowrap',outline:'none',cursor:'pointer'}:{display:'inline-block',width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'MediumVioletRed',textAlign:'center',lineHeight:'30px',whiteSpace:'nowrap',outline:'none',cursor:'pointer'}} id={data.index}  onClick={()=>{this.onChooseQuestion(data.index)}}  tabIndex="0">
                                {data.index}-{data.type}
                            </div>
                            {/*<Button shape="circle" icon="plus" size={'small'} style={{marginLeft:5,marginTop:19,verticalAlign:'top'}} onClick={()=>{this.add(this.subQuestion,data.index,this.subQuestionIndex,1)}}/>*/}
                        </div>;
            if(data.children.length == 1){
                result = <div style={{display:'inline-block'}}>
                            <div style={{display:'inline-block',width:95,height:47,color: '#fff',fontSize:12,verticalAlign:'top'}}>
                                <div style={this.state.chosenQuestion == data.index?{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'MediumBlue',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none',cursor:'pointer'}:{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'#cccccc',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none',cursor:'pointer'}} id={data.index}  onClick={()=>{this.onChooseQuestion(data.index)}}  tabIndex="0">
                                    {data.index}-{data.type}
                                </div>
                                <svg xmlns={`http://www.w3.org/2000/svg`} width={30} height={47} version={`1.1`} >
                                    <defs>
                                        <marker id="arrow"
                                                markerUnits="strokeWidth"
                                                markerWidth="6"
                                                markerHeight="6"
                                                viewBox="0 0 6 6"
                                                refX="3"
                                                refY="3"
                                                orient="auto">
                                            <path d="M1,1 L5,3 L1,5 L3,3 L1,1" style={{fill:'#000000'}} />
                                        </marker>
                                    </defs>
                                    <line x1={2} y1={30} x2={25} y2={30} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}} markerEnd={`url(#arrow)`}/>
                                </svg>
                            </div>
                            {
                                getNode(data.children[0])
                            }
                        </div>
            }else if(data.branch == true){
                result = <div style={{display:'inline-block',verticalAlign:'top'}}>
                            {
                                data.children.map(
                                    (val,index)=>{
                                        let option = ['A','B','C','D','E','F','G','H','I','J'];
                                        let mark = index==data.children.length-1?'end':'';
                                        if(!val.index){
                                            return <ul style={{fontSize:0,position:'relative'}} key={index}>
                                                    <div style={{position:'absolute',height:'100%'}}>
                                                        <svg xmlns={`http://www.w3.org/2000/svg`} width="100px" height="100%" version={`1.1`} data={mark}>
                                                            <line x1={35} y1={47} x2={35} y2={'100%'} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}}/>
                                                        </svg>
                                                    </div>
                                                    <div style={{display:'inline-block',verticalAlign:'top',position:'relative'}}>
                                                        {
                                                            index === 0?
                                                                <div style={{display:'inline-block',width:95,height:47,color: '#fff',fontSize:12,verticalAlign:'top'}}>
                                                                    <div style={this.state.chosenQuestion == data.index?{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'MediumBlue',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none' ,cursor:'pointer'}:{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'SkyBlue',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none',cursor:'pointer' }}  id={data.index}  onClick={()=>{this.onChooseQuestion(data.index)}}  tabIndex="0">
                                                                        {data.index}-{data.type}
                                                                    </div>
                                                                    <svg xmlns={`http://www.w3.org/2000/svg`} width={30} height={47} version={`1.1`} >
                                                                        <defs>
                                                                            <marker id="arrow"
                                                                                    markerUnits="strokeWidth"
                                                                                    markerWidth="6"
                                                                                    markerHeight="6"
                                                                                    viewBox="0 0 6 6"
                                                                                    refX="3"
                                                                                    refY="3"
                                                                                    orient="auto">
                                                                                <path d="M1,1 L5,3 L1,5 L3,3 L1,1" style={{fill:'#000000'}} />
                                                                            </marker>
                                                                        </defs>
                                                                        <line x1={2} y1={30} x2={25} y2={30} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}} markerEnd="url(#arrow)"/>
                                                                        <text x={10} y={25} style={{fill:'green',fontSize:14}}>{option[index]}</text>
                                                                    </svg>
                                                                </div>
                                                                :
                                                                <div style={{display:'inline-block',width:95,height:47,color: '#fff',fontSize:14,verticalAlign:'top'}}>
                                                                    <div style={{width:65,height:47,display:"inline-block",verticalAlign:'top'}}>
                                                                        <svg xmlns={`http://www.w3.org/2000/svg`} width={65} height={47} version={`1.1`} >
                                                                            {
                                                                                mark != 'end'?
                                                                                    <polyline points="35,0 35,60 35,30 65,30" style={{stroke:'rgb(99,99,99)',strokeWidth:'2',fill:'#fff'}}/>
                                                                                    :
                                                                                    <polyline points="35,0 35,30 65,30" style={{stroke:'rgb(99,99,99)',strokeWidth:'2',fill:'#fff'}}/>
                                                                            }
                                                                        </svg>
                                                                    </div>
                                                                    <svg xmlns={`http://www.w3.org/2000/svg`} width={30} height={47} version={`1.1`} >
                                                                        <line x1={0} y1={30} x2={25} y2={30} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}} markerEnd="url(#arrow)"/>
                                                                        <text x={10} y={25} style={{fill:'green',fontSize:14}}>{option[index]}</text>
                                                                    </svg>
                                                                </div>
                                                        }
                                                        <div style={{display:'inline-block',width:40,height:47,color: '#fff',fontSize:12,verticalAlign:'top'}}>
                                                            {/*<Button shape="circle" icon="plus" size={'small'} style={{marginLeft:5,marginTop:19,verticalAlign:'top'}} onClick={()=>{this.add(this.subQuestion,data.index,this.subQuestionIndex,1,index)}}/>*/}
                                                        </div>
                                                    </div>
                                                </ul>
                                        }
                                        return <ul style={{fontSize:0,position:'relative'}} key={index}>
                                                    <div style={{position:'absolute',height:'100%'}}>
                                                        <svg xmlns={`http://www.w3.org/2000/svg`} width="100px" height="100%" version={`1.1`} data={mark}>
                                                            <line x1={35} y1={47} x2={35} y2={'100%'} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}}/>
                                                        </svg>
                                                    </div>
                                                    <div style={{display:'inline-block',verticalAlign:'top',position:'relative'}}>
                                                        {
                                                            index === 0?
                                                                <div style={{display:'inline-block',width:95,height:47,color: '#fff',fontSize:12,verticalAlign:'top'}}>
                                                                    <div style={this.state.chosenQuestion == data.index?{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'MediumBlue',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none',cursor:'pointer' }:{width:60,height:30,marginTop:15,marginLeft:5,border:'solid 1xp #999999',borderRadius:6,backgroundColor:'SkyBlue',textAlign:'center',lineHeight:'30px',display:"inline-block",verticalAlign:'top',whiteSpace:'nowrap',outline:'none',cursor:'pointer' }}  id={data.index} onClick={()=>{this.onChooseQuestion(data.index)}} tabIndex="0">
                                                                        {data.index}-{data.type}
                                                                    </div>
                                                                    <svg xmlns={`http://www.w3.org/2000/svg`} width={30} height={47} version={`1.1`} >
                                                                        <defs>
                                                                            <marker id="arrow"
                                                                                    markerUnits="strokeWidth"
                                                                                    markerWidth="6"
                                                                                    markerHeight="6"
                                                                                    viewBox="0 0 6 6"
                                                                                    refX="3"
                                                                                    refY="3"
                                                                                    orient="auto">
                                                                                <path d="M1,1 L5,3 L1,5 L3,3 L1,1" style={{fill:'#000000'}} />
                                                                            </marker>
                                                                        </defs>
                                                                        <line x1={2} y1={30} x2={25} y2={30} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}} markerEnd="url(#arrow)"/>
                                                                        <text x={10} y={25} style={{fill:'green',fontSize:14}}>{option[index]}</text>
                                                                    </svg>
                                                                </div>
                                                                :
                                                                <div style={{display:'inline-block',width:95,height:47,color: '#fff',fontSize:14,verticalAlign:'top'}}>
                                                                    <div style={{width:65,height:47,display:"inline-block",verticalAlign:'top'}}>
                                                                        <svg xmlns={`http://www.w3.org/2000/svg`} width={65} height={47} version={`1.1`} >
                                                                            {
                                                                                mark != 'end'?
                                                                                    <polyline points="35,0 35,60 35,30 65,30" style={{stroke:'rgb(99,99,99)',strokeWidth:'2',fill:'#fff'}}/>
                                                                                    :
                                                                                    <polyline points="35,0 35,30 65,30" style={{stroke:'rgb(99,99,99)',strokeWidth:'2',fill:'#fff'}}/>
                                                                            }
                                                                        </svg>
                                                                    </div>
                                                                    <svg xmlns={`http://www.w3.org/2000/svg`} width={30} height={47} version={`1.1`} >
                                                                        <line x1={0} y1={30} x2={25} y2={30} style={{stroke:'rgb(99,99,99)',strokeWidth:'2'}} markerEnd="url(#arrow)"/>
                                                                        <text x={10} y={25} style={{fill:'green',fontSize:14}}>{option[index]}</text>
                                                                    </svg>
                                                                </div>
                                                        }
                                                        {
                                                            getNode(val)
                                                        }
                                                    </div>
                                               </ul>
                                    }
                                )
                            }
                        </div>
            }
            return result
        }
        return(
            <div>

                <div style={{width:1024,margin:'20px auto',padding:15}}>
                    <div style={{display: 'table-cell',width:1000,padding:'20px 0',fontSize:0,borderBottom:'solid 2px green'}}>
                        <div style={{display: 'inline-block'}}>

                            {
                                getNode(this.props.treeData[0])

                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default WordProblem