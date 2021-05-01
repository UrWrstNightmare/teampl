import React, {useContext} from 'react';

import {Toast} from "primereact/toast";
import {OverlayPanel} from "primereact/overlaypanel";
import {Tooltip} from "primereact/tooltip";
import {Card} from 'primereact/card';
import {Button} from "primereact/button";
import { Dialog } from 'primereact/dialog';
import {Menu} from 'primereact/menu';
import {InputText} from 'primereact/inputtext';
import {UpdatesScroll} from '../components/updatesScroll';
import {Messages} from "primereact/messages";

import {firebaseAuth} from "../providers/UserProvider";

import {Ripple} from "primereact/ripple";
import { ToggleButton } from 'primereact/togglebutton';
import PremiumGift from '../img/graphics/premiumGift.jpg';
import loginRequired from '../img/graphics/loginBanner.png';
import teamplLogo from '../img/icons/teampl-logo-black-small.png';
import GetFileMetadata from '../components/fileGetComponent';
import GetFileToView from '../components/fileGetComponent';

import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
import workplace from '../img/graphics/workplace.jpg';
import success from '../img/graphics/success.webp';

import {Gift, Bell, User,Key, Mail, RefreshCw, HelpCircle, LogOut} from "react-feather";
import SignUp from "../components/SignUpComponent";
import SignIn from "../components/SignInComponent";

import '../css/login.css';
import {StyleSheet, css} from "aphrodite";
import {fadeIn, fadeOut, headShake} from "react-animations";
import {Redirect, useHistory} from 'react-router-dom';
import {Input} from "antd";
import {authMethods} from "../firebase/authMethods";
import { FileUpload } from 'primereact/fileupload';
import {UserContext} from "../providers/UserProvider";
import firebase from "firebase";

import FileViewer from "react-file-viewer/src/components/file-viewer";

let user = null;
let userName = null;

const ItemPutter = (props) => {
    const {metadata, setMetadata} = useContext(firebaseAuth);
    if(metadata.loading || !("storeData" in metadata.data)){
        return "Refreshing from Server...";
    }
    let finalOut = [<div className={"p-col-6 p-md-4 p-lg-3"}>
                       <Card
                           style={{border: "dotted blue 2px", }}
                           footer={<span style={{
                               width: "109px",
                               margin: "auto",
                               display: "block",}}>
                               <Button label="Upload" icon="pi pi-cloud-upload" className="p-button-primary"
                               onClick={()=>props.modalOpen()}
                               /></span>}
                       ><div style={{width: "109px", margin:"auto", textAlign: "center", height: "82px"}}>
                           Free Plan<br/>{Math.round(metadata.data.storeData.usedStorage/1e4)/100}MB/{Math.round(metadata.data.storeData.allowedStorage/1e6)}MB
                       </div></Card>
                     </div>];
    for(let i =  metadata.data.storeData.fileList.length-1; i >=0; i--){
        let filename = metadata.data.storeData.fileList[i];
        let storeData = metadata.data.storeData;
        finalOut.push(<div className={"p-col-6 p-md-4 p-lg-3"}>
                        <Card
                            title={storeData.fileName[filename]}
                            footer={<div>
                                <div style={{
                                width: "100%",
                                margin: "auto",
                                display: "block",
                                whiteSpace: "nowrap",
                                    overflow: "scroll"}}>
                               <Button label="Open" icon="pi pi-file" className="p-button-primary"
                                       onClick={()=>props.fileViewerOpen(filename)}/>
                               <Button label="" icon="pi pi-trash" className="p-button-danger" style={{float: "right"}}
                                         onClick={()=>props.fileViewerOpen(filename)}/>
                                </div></div>}>
                            <div style={{height: "75px", marginTop: "-40px"}}>
                                <p style={{width: "100%", color: "rgba(0,0,0,0.7)"}}>
                                    ({Math.round(metadata.data.storeData.fileSize[filename]/1e4)/100}MB)
                                </p>
                                <p style={{marginTop:"5px",whiteSpace: "wrap", height: "66px", overflowWrap: "break-word", overflow:"scroll"}}>{storeData.fileDesc[filename]}</p>
                            </div>
                        </Card>
                     </div>);
    }
    return finalOut;
};

const homeMenuItems = [
    {
        label: 'My Files',
        items: [
            {label: 'My Files', icon: 'pi pi-file-o'},
            {label: 'Team+ Projects', icon: 'pi pi-chart-line', command: ()=>alert('projects')},
        ]
    },
    {
        label: 'My Tasks',
        items: [
            {label: 'Pending Tasks', icon: 'pi pi-check-square', command: ()=>alert('todo')},
            {label: 'Completed Tasks', icon: 'pi pi-chart-line', command: ()=>alert('completed')},
        ]
    }
];

const SignOutButton = (props) => {
    const {setErrors, setToken, token, errors} = useContext(firebaseAuth);
    return( <LogOut  style={{float: 'right'}}
        id={"button-logout"} size={25} strokeWidth={1.2} onClick={()=>authMethods.signout(setErrors, setToken)}/>)
};

const ValidateUser = (props) => {
    firebase.auth().onAuthStateChanged(function(u){
        if(u) user = firebase.auth().currentUser;
        if(user === null){
            alert('[Team+] Invalid access! Please Login First' + user);
            window.location.replace('/login.js');
        }
        else console.log(user);
        firebase.database().ref('users/'+user.uid).on("value", function(snapshot){
            console.log(snapshot.val());
            userName = snapshot.name;
            props.onLoad(snapshot.val());
        })
    });
    return null;
};
const styles = StyleSheet.create({
    load: {
        animationName: fadeIn,
        animationDuration: '1s'
    },
    unload: {
        animationName: fadeOut,
        animationDuration: '1s'
    },
    bounce: {
        animationName: headShake,
        animationDuration: '0.7s'
    }
});

export class UserHome extends React.Component {
    constructor(props) {
        super(props);
        this.myInput = React.createRef();
        console.log('login');
        this.state = {
            'giftHover': '',
            'bellHover': '',
            'loginButton': 'Register',
            'displaySignUp': false,
            'displayUpload': false,
            'SignUpSuccess': false,
            'displaySignIn': false,
            'SignInSuccess': false,
            'snapshot' : {username: 'loading', createdDate: 'loading', userLv: 0, name: 'loading'},
            'validated' : false,
            'metaUpdateRequested': false,
            'displayFileViewer': false,
            'selectedFile': null,
            'selectedFileFullName': '',
            'dlFileForView': false,
            'openFileViewer': false,
            'viewFilePath': ''
        };
        this.clickLogin = this.clickLogin.bind(this);
        this.handler = this.handler.bind(this);
        this.userDataValidated = this.userDataValidated.bind(this);
        this.showUploadModal = this.showUploadModal.bind(this);
        this.showFileViewer = this.showFileViewer.bind(this);
    }

    componentDidMount() {
        this.toast.show([
            {severity: "success", summary: 'Login Success', detail: 'Welcome to TeamPl!', life: 5000}
        ]);
        return(<div>
            <ValidateUser onLoad={this.userDataValidated}/>
        </div>);
    }

    handler(){
        console.log("handler call");
        this.setState({
           displaySignUp: false,
            SignUpSuccess: true
        });
    }

    handlerSignIn(){
        console.log("handler call");
        this.setState({
            displaySignUp: false,
            SignUpSuccess: true
        });
    }

    teamplPremium = {
        header: <img src={PremiumGift} alt={"Card"} className={"premium-gift-img"} style={{width: "197px", marginBottom: "-10px"}}/>,
        footer: <span><Button label="Purchase" icon="pi pi-check" style={{width: "100%"}} className="p-ripple p-d-flex"
                              onClick={()=>this.setState({
                                  displayBasic: true
                              })}
        /></span>
    };
    teamplLogin = {
        header: <img src={loginRequired} alt={"Card"} className={"premium-login-img"} style={{}}/>,
        footer: <span><Button label="Login" icon="pi pi-check" style={{width: "100%"}} className="p-ripple p-d-flex"
        /></span>
    };
    userDataValidated(snapshot){
        this.setState({
            snapshot: snapshot,
            validated: true,
            metaUpdateRequested: true
        })
    }
    render(){
        return(
            <div id={"login"} className={css(styles.load)}>
                {(this.state.validated)?null:<ValidateUser onLoad={this.userDataValidated}/>}
                {(this.state.metaUpdateRequested)?<GetFileMetadata username={this.state.snapshot.username} onLoad={()=>this.setState({metaUpdateRequested: false})}/>:null}
                <div id={"messages"}>
                    <Toast ref={(el) => this.toast = el}/>
                </div>
                <div id={"login-flex"} className={"p-grid"}>
                    <div id={"login-left"} className={"p-col-4"}>
                        <div id={"login-left-inner"} className={"p-shadow-5"}>
                            <div id={"login-left-navbar"} >
                                <Gift id={"button-gift"} size={25} strokeWidth={1.2} className={this.state.giftHover}
                                      onMouseEnter={()=>this.setState({giftHover: 'featherIcon-hover'})}
                                      onMouseLeave={()=>this.setState({giftHover: ''})}
                                      onClick={(e)=>this.opPremium.toggle(e)}
                                />
                                <Bell id={"button-bell"} size={25} strokeWidth={1.2} className={this.state.bellHover}
                                      onMouseEnter={()=>this.setState({bellHover: 'featherIcon-hover'})}
                                      onMouseLeave={()=>this.setState({bellHover: ''})}
                                      onClick={(e)=>this.opNotification.toggle(e)}
                                />
                                <SignOutButton/>
                            </div>
                            <div id={"teampl-logo-div"} style={{marginBottom: "20px"}} >
                                <div id={'teampl-logo'} className={'teampl-logo-div'} style={{marginTop: '5vh'}}>
                                    <img src={teamplLogo} className={'teampl-logo-img'}/>
                                </div>
                                <div id={'teampl-logo-text'}>
                                    <h2>Welcome, {this.state.snapshot.username}!</h2>
                                </div>
                            </div>
                            <div id={"teampl-home-menu-div"} style={{width: "200px", margin: "auto"}}>
                                <Menu model={homeMenuItems}/>
                            </div>
                        </div>
                    </div>
                    <div id={"login-right"} className={"p-col-8"}>
                        <div id={"login-right-inner"} className={"p-shadow-5"}>
                            <div id={"login-right-navbar"} >
                                    <RefreshCw
                                        id={"button-refresh"} size={20} strokeWidth={2.5} className={this.state.refreshHover}
                                        onMouseEnter={()=>this.setState({refreshHover: 'pi-spin'})}
                                        onMouseLeave={()=>this.setState({refreshHover: ''})}
                                    />
                                <h2 style={{display: 'inline-block',
                                    margin: '-5px 14px 8px 16px',
                                    fontSize: '20px',
                                    transform: 'translate(-4px, -3px)'
                                }}>My Files</h2>
                                <HelpCircle
                                    id={"button-info"} size={20} strokeWidth={2.5} className={this.state.infoHover}
                                    style={{float: 'right'}}
                                    onMouseEnter={()=>this.setState({infoHover: 'featherIcon-hover'})}
                                    onMouseLeave={()=>this.setState({infoHover: ''})}
                                    onClick={(e)=>this.setState({displayInfo: true})}
                                />
                            </div>
                            <div id={"homeApplet"}></div>
                            {this.state.snapshot.username === null ? 'Loading...' :
                                <div id={"fileView"} className={"p-grid"} style={{overflow: "scroll",
                                height: "65vh"}}>
                                <ItemPutter itemCnt={30} modalOpen={this.showUploadModal} fileViewerOpen={this.showFileViewer}/>
                            </div>

                            }

                        </div>
                    </div>
                </div>
                <OverlayPanel ref={(el)=>this.opPremium = el} showCloseIcon={true} style={{top: "19vh"}} id={'opPremium'}>
                    <Card footer={this.teamplPremium.footer} header={this.teamplPremium.header} title={"Team+ Premium"} subTitle={"Team+ 프리미엄 멤버십을 경험해 보세요"}>
                    </Card>
                </OverlayPanel>
                <OverlayPanel ref={(el)=>this.opNotification = el} showCloseIcon={true} style={{top: "19vh"}} id={'opNotification'}>
                    <Card footer={this.teamplLogin.footer} header={this.teamplLogin.header} title={"Login Required"} subTitle={"로그인이 필요한 서비스입니다."}>
                    </Card>
                </OverlayPanel>
                <Dialog header="아직 지원하지 않는 기능입니다" visible={this.state.displayBasic} style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideModal()} />
                </div>} onHide={() => this.hideModal()}>
                    <p>Thank you for taking interest in Team+. We're sorry to inform you that out project is currently in development and this functionality  is not ready yet.
                        In the final version, you will be able to support the devs by purchasing a  subscription to Team+. When the option to subscribe  is available,  please donate then.
                        With Love,
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog visible={this.state.displayInfo} header="About Team+"  style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideInfo()} />
                </div>} onHide={() => this.hideInfo()}>
                    <p>Team+은 혁신적인 팀 관리 소프트웨어로, 연구의 시작, 계획, 분담, 결론 작성까지 자동으로 관리합니다.
                    </p>
                    <p>
                        Team+ Dev Team
                    </p>
                </Dialog>
                <Dialog visible={this.state.displayUpload} header="Team+ File Upload"  style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideUploadModal()} />
                </div>} onHide={() => this.hideUploadModal()}>
                    <FileUpload name={"fileUpload[]"}
                                url={"https://api.gbshs.kr/tmpl/uploads.php?user="+this.state.snapshot.username} multiple/>
                </Dialog>
                <Dialog visible={this.state.displayFileViewer} header="Team+ File Viewer"  style={{ width: '50vw' }} footer={<div>
                    <Button label="닫기" icon="pi pi-check" onClick={()=> this.hideFileViewer()} />
                </div>} onHide={() => this.setState({displayFileViewer: false})}>
                    {(this.state.dlFileForView ? <GetFileToView
                        onLoad={()=>this.setState({dlFileForView: false})}
                        filePath={(path)=>this.setState({viewFilePath: path, openFileViewer: true})} username={this.state.snapshot.username} fileName={this.state.selectedFile}/>: null)}
                    {(this.state.openFileViewer ? <FileViewer filePath={this.state.viewFilePath} fileType={this.state.selectedFileFullName.substr(this.state.selectedFileFullName.lastIndexOf('.')+1)}/>:'Loading...')}
                </Dialog>
        </div>
        );
    }
    showFileViewer(file){
        this.setState({
            displayFileViewer: true,
            selectedFile: file,
            dlFileForView: true
        })
    }
    hideFileViewer(file){
        this.setState({
            displayFileViewer: false
        })
    }
    showUploadModal(){
        this.setState({
          displayUpload: true
        })
    }
    hideUploadModal(){
        this.setState({
            displayUpload: false
        })
    }
    hideModal(){
        this.setState({
            displayBasic: false
        })
    }
    hideInfo(){
        this.setState({
            displayInfo: false
        })
    }

    clickLogin(){
        console.log('button prewss');
        if(this.state.loginButton === 'Register'){
            this.setState({displaySignUp: true});
        }else if(this.state.loginButton === 'Login'){
            this.setState({displaySignIn: true});
        }
    }

    getInputValue(ev){
        if(ev.target.value === '') this.setState({loginButton: 'Register'});
        else this.setState({loginButton: 'Login'});
        this.setState({loginValue: ev.target.value});
    }
    getInputUpdate(ev){
        console.log(ev.key);
        if(ev.key === 'Enter') this.clickLogin();
        if(ev.key === 'Backspace' && ev.target.value === '' && !this.state.hasAnimated) {
            this.setState({loginBounce: true, hasAnimated: true});
        }
        else this.setState({loginBounce: false, hasAnimated: false});
    }
}

