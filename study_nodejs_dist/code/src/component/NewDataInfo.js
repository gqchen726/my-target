import React from 'react'
import {CarouselMap} from "../contains/CarouselMap";
import {Card} from "antd";
import {Button, notification} from "antd/es";
import PropTypes from 'prop-types'
import {MyDescriptions} from "./MyDescriptions";
import {
    Link,
    withRouter
} from "react-router-dom";
import axios from "axios";
import {urlsUtil} from "../public/ApiUrls/UrlsUtil";
import {UpLoadFile} from "./UpLoadFile";
import Image from "antd/es/image";


const localContext = require('../cache/LocalContext');
export class NewDataInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: true,
            isLoading: false,
            newData: props.newData
        }
    }


    onClickHandler = () => {
        let {fileList} = this.state;
        this.setFileResources(fileList);
        let {isEditMode} = this.state;
        let {newData} = this.state;

        if (isEditMode) {
            if (!newData) {
                return ;
            }
            this.setState({
                isLoading: true
            })
            axios.post(urlsUtil.product.addUrl,newData).then((response) => {
                let responseBody = response.data;
                console.log(response)

                this.changeEditMode();
                if (!responseBody.code) {
                    this.setState({
                        newData : responseBody.body,
                    })
                    this.changeEditMode();
                }
                notification.open({
                    message: 'save info tips',
                    description: responseBody.message
                });
            }).catch((error) => {
                console.log(error)
                notification.open({
                    message: 'save info tips',
                    description: error.toString()
                });
            })
            this.setState({
                isLoading: false
            })
        } else {
            this.changeEditMode();
        }
    }

    getFileList = (fileList) => {
        this.setState({
            fileList:fileList
        })
    }
    setFileResources = (fileList) => {
            let resources;
            if (Array.isArray(fileList)) {
                fileList.forEach((value, index) => {
                    let reSource = value.response.body;
                    console.log(value)
                    if (index === 0) {
                        resources = reSource;
                    } else {
                        resources += `;${reSource}`
                    }
                })
            }
            let {newData} = this.state;
            newData.resources = resources;
            this.setState({
                newData:newData
            })
        }

    changeEditMode = () => {
        this.setState({
            isEditMode:!this.state.isEditMode,
        })
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    returnMode = (user,isAdminSpecific,isEditMode) => {
        if (!isAdminSpecific) {
            return (!user)?
                null:<Button type={"primary"} onClick={this.onClickHandler} >{isEditMode ? "??????":"?????? "}</Button>
        } else if (isAdminSpecific) {
            return (!user || !user.admin === "admin")?
                null:<Button type={"primary"} onClick={this.onClickHandler} >{isEditMode ? "??????":"?????? "}</Button>
        }
    }

    saveNewDescriptered = (newDescriptered) => {
        this.setState({
            newDescriptered : newDescriptered
        })
    }

    renderImages = (data) => {
        let {resources} = data;
        let resourceArr = resources.split(";");
        let ImageArr = resourceArr.map((value,index) => {
            return <Image key={index} src={value} />;
        })
        return ImageArr;
    }

    renderCarouselMap = (isEditMode,newData) => {
        if (isEditMode) {
            return null;
        } else {
            return (
                // <CarouselMap autoPlay={true}>
                //     {this.renderImages(newData)}
                // </CarouselMap>
                <CarouselMap data={newData} />
            );
        }
    }

    renderUpLoadFile = (isEditMode) => {
        if (isEditMode) {
            return (
                <div>
                    <br />
                    <br />
                    <span>
                        ??????????????????
                    </span>
                    <UpLoadFile
                        action={urlsUtil.image.upload}
                        getFileList={this.getFileList}
                        isEditMode={this.state.isEditMode}
                    />
                </div>
            );
        } else {
            return null;
        }

    }


    render() {

        let {newData} = this.state;
        let {user} = this.props;
        let {isAdminSpecific} = this.props;
        let {isEditMode} = this.state;

        if (!newData) {
            return null;
        }
        // let columns = ["name","age","gender","birth","mobileNumber","email","address","registerCode"];
        return (
            <div className='dataInfo'>
                {/*??????????????????????????????*/}
                <Card
                    title={newData.name}
                    extra={
                        this.returnMode(user,isAdminSpecific,isEditMode)
                    }
                >
                    {/*?????????*/}
                    {this.renderCarouselMap(isEditMode,newData)}

                    <MyDescriptions
                        title={"????????????"}
                        layout={"horizontal"}
                        bordered={true}
                        descriptered={newData}
                        isAdminSpecific={true}
                        isEditMode={this.state.isEditMode}
                        saveNewDescriptered={this.saveNewDescriptered}
                    />
                    {
                        this.renderUpLoadFile(isEditMode)
                    }
                </Card>
                {/*??????????????????*/}
                {/*<Card>*/}
                {/*    <Button*/}
                {/*        style={{width:'10%'}}*/}
                {/*        onClick={this.search}*/}
                {/*    >*/}
                {/*        <span*/}
                {/*            style={{font:{size:'11px'}}}*/}
                {/*        >*/}
                {/*            <Link to={`/result${404}`} >??????</Link>*/}
                {/*        </span>*/}
                {/*    </Button>*/}
                {/*    <Button*/}
                {/*        style={{width:'10%'}}*/}
                {/*        onClick={this.search}*/}
                {/*    >*/}
                {/*        <span*/}
                {/*            style={{font:{size:'11px'}}}*/}
                {/*        >*/}
                {/*            <Link to={`/orderGenerate/${key}`} >??????</Link>*/}
                {/*        </span>*/}
                {/*    </Button>*/}
                {/*</Card>*/}
            </div>
        );
    }
}
export const NewDataInfoW =  withRouter(NewDataInfo);

NewDataInfoW.propTypes = {
    data:PropTypes.any,
    isAdminSpecific: PropTypes.bool,
    user: PropTypes.object
}
NewDataInfoW.defaultProps = {
    newData: {
        category: "????????????",
        description: "????????????????????????",
        ex: "????????????",
        price: "??????",
        productCode: "????????????",
        productName: "????????????",
    }
}
