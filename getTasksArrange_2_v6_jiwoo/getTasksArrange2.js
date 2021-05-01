const memberCountInputForm = document.querySelector("#how-many-members-form");
const memberCountInput = document.querySelector(".how-many-members");
const memberCountShow = document.querySelector("#member-count-show");
const memberInfoInputForm = document.querySelector("#memberinfoinput");
const memberInfoInputFormId = document.querySelector("#member-id-input");
const memberInfoInputFormName = document.querySelector("#member-name-input");
const memberInfoInputFormColor = document.querySelector("#member-color-input");
const memberInfoInputFormBtn = document.querySelector("#add-member-info-btn");
const memberInfoShow = document.querySelector("#member-info");
const taskInputForm = document.querySelector("#task-input-form");
const taskInput = document.querySelector(".add-task");
const addTaskButton = document.querySelector(".add-task-button");
const notYetOrderedTaskGroup = document.querySelector("#not-yet-ordered-task-group");
const taskInputEndSubmitForm = document.querySelector('#task-input-end-submit-form');
const taskInputEndSubmitBtn = document.querySelector('#task-input-end-submit-btn');
const taskGroupsContainer = document.querySelector("#task-groups-container");
const taskGroups = document.querySelectorAll('.task-box');
const eachTaskDifficulty = document.querySelector('#each-task-difficulty');
const enteredAllDifficultyForm = document.querySelector('#entered-all-difficulty-form');
const enteredAllDifficultyBtn = document.querySelector('#entered-all-difficulty-btn');
const forGetTaskBox = document.getElementsByClassName('for-get-task');
const getDDayForm = document.getElementById('get-D-day');
const getDDayInput = document.getElementById('get-D-day-input');
const ShowWhoWillDoTask = document.getElementById('show-who-will-do-task');

let memberCount = 0;
let memberInputCount = 0;
let dDay;



class memberInfos{
    constructor(id, name, color){
        this.id = id;
        this.name = name;
        this.color = color;

    }
}

var memberArray = new Array(101);


function memberCountFunc(){ //memberCount에 총 멤버수 입력하는 함수
    if(event.keyCode == 13){
        event.preventDefault();
        memberCount = memberCountInput.value;
        if(memberCount>0){
            memberInfoInputForm.classList.add("undim"); //어둡게 하는거 사라지게 (멤버수 입력하면)
            memberInfoInputForm.classList.remove("dim"); //어둡게 하는거 사라지게 (멤버수 입력하면)
        }
        else{
            memberInfoInputForm.classList.remove("undim");
            memberInfoInputForm.classList.add("dim");
        }
        // console.log(memberCount);
        memberCountInput.value="";
        memberCountShow.innerHTML="Your team has " + memberCount + " members. " + "<br>" + "Now enter each team member's Team+ account ID, name, and select color.";
    }
}
//

memberInfoInputFormBtn.addEventListener('click',addToMemberShow);

function addToMemberShow(){ //폼에서 입력한거 빈칸 아니면 아래에 나열식으로 누구누구 입력됐는지 보여줌
    event.preventDefault();
    if(memberInfoInputFormId!="" && memberInfoInputFormName!="" && memberInputCount<memberCount){
        const memberInfoDiv = document.createElement('div');
        const id = memberInfoInputFormId.value;
        const name = memberInfoInputFormName.value;
        const color = memberInfoInputFormColor.value;
        memberArray[memberInputCount] = new memberInfos();
        memberArray[memberInputCount].id=id; //구조체에 팀원 정보 입력
        memberArray[memberInputCount].name=name;
        memberArray[memberInputCount].color=color;//
        memberInputCount++;
        if(memberInputCount==memberCount){
            memberCountInputForm.classList.remove('undim'); //다 입력하면 안보이게
            memberCountInputForm.classList.add('dim'); //다 입력하면 안보이게
            memberInfoInputForm.classList.remove('undim');//다 입력되면 다시 안보이게
            memberInfoInputForm.classList.add('dim');//다 입력되면 다시 안보이게
            memberCountShow.innerHTML="Your team has " + memberCount + " members. " + "<br>" + "You entered every team member's Team+ account ID, name, and select color.";
            taskInputForm.classList.add('undim'); //안보이게 했던거 보이게
            taskInputForm.classList.remove('dim'); //안보이게 했던거 보이게
            taskGroupsContainer.classList.add('undim'); //안보이게 했던거 보이게
            taskGroupsContainer.classList.remove('dim'); //안보이게 했던거 보이게
            taskInputEndSubmitForm.classList.add('undim');
            taskInputEndSubmitForm.classList.remove('dim');
        }
        memberInfoInputFormId.value="";
        memberInfoInputFormName.value="";
        memberInfoDiv.innerHTML = `ID: ${id} name: ${name} color: ${color}`;
        memberInfoShow.appendChild(memberInfoDiv);
    }
}





let currentDroppable = null;
let goto = null;
let z = 100;
function dragStart(ev){
    if(ev.target.classList[0] === 'task-erase-button') return;
    let shiftX = event.clientX - ev.target.getBoundingClientRect().left;
    let shiftY = event.clientY - ev.target.getBoundingClientRect().top;
    
    ev.target.style.position = 'absolute';
    ev.target.style.zIndex = 1000;
    // document.body.append(ev.target);
    
    moveAt(event.pageX, event.pageY);
    
    function moveAt(pageX, pageY) {
        ev.target.style.left = pageX - shiftX + 'px';
        ev.target.style.top = pageY - shiftY + 'px';
    }
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        ev.target.style.zIndex = z++;
        ev.target.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        ev.target.hidden = false;
        
        if (!elemBelow) return;
        if(elemBelow.classList[0] === 'task-box') goto = elemBelow;
        if(elemBelow.classList[0] === 'tasks') goto = elemBelow.parentElement;
        // let droppableBelow = elemBelow.closest('.droppable');
        // if (currentDroppable != droppableBelow) {
            //     if (currentDroppable) { // null when we were not over a droppable before this event
            //         leaveDroppable(currentDroppable);
            //     }
            //     currentDroppable = droppableBelow;
            //     if (currentDroppable) { // null if we're not coming over a droppable now
            //         // (maybe just left the droppable)
            //         enterDroppable(currentDroppable);
            //     }
            // }
        }
        
        document.addEventListener('mousemove', onMouseMove);
        
        ev.target.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            ev.target.onmouseup = null;
            goto.appendChild(ev.target);
            ev.target.style.position = 'relative';
            ev.target.style.left = '0px';
            ev.target.style.top =  '0px';
        };
        
    }
    
    
    //드래그 시작하면 div 복사해서 마우스 위치 따라 이동하고 원래 div는 삭제하고 이동한 div의 dragover를 저장해두고 가장 마지막에 닿은 곳에 복사해서 이동하고 마우스 따라 이동하던 div는 삭제
    
    
    
    
    //여기서부터 일 추가 함수들
    addTaskButton.addEventListener("click", addTask); //일 추가 버튼 눌리거나 일 쓰고 엔터치면 addTask 함수 실행
    
    function addTask(ev){ //일 추가 함수
        ev.preventDefault();
    const newTaskDiv = document.createElement('div');
    const task = document.createElement('p');
    task.classList.add('no-click'); //마우스 오버할 때 내부 p가 아니라 그 div를 선택할 수 있게 p는 선택 안되게 해주는거
    task.innerText = taskInput.value; //새로운 div에 넣을 p에 내용 넣기
    taskInput.value=""; //인풋 빈칸에 쓰였던 내용 초기화
    newTaskDiv.appendChild(task); //아까 만든 새로운 div에 내가 썼던 일 입력
    newTaskDiv.onmousedown = dragStart;
    newTaskDiv.ondragstart = function(){
        return false;
    };
    // newTaskDiv.addEventListener('mousedown', moveWithMouseStart);
    
    // 할일 잘못 입력했을 때 지울 수 있는 버튼 추가
    const eraseThisTaskButton = document.createElement('button');
    eraseThisTaskButton.classList.add("task-erase-button");
    eraseThisTaskButton.innerHTML="eraseBtn";
    eraseThisTaskButton.addEventListener("click", eraseTask);
    newTaskDiv.appendChild(eraseThisTaskButton);
    //
    
    //입력한 일정 표시
    newTaskDiv.classList.add("tasks");
    notYetOrderedTaskGroup.appendChild(newTaskDiv);
    //
}


//일정 입력한거 지우고 싶을 때 지우는 기능 (일정 만들 때 erase 버튼 만들고 클릭 시 이 함수 호출하는 기능 넣어둠)
function eraseTask(ev){
    const clicked = ev.target;
    const clickedDiv = clicked.parentElement;
    clickedDiv.remove();
}
//

//일정 배열 끝나고 버튼 클릭하면 입력했던거 쭉 보여주고 개인 부담률 작성 칸 보여주기
taskInputEndSubmitForm.addEventListener('click', showArrangedTasks);
function showArrangedTasks(ev){
    ev.preventDefault();
    var x = document.getElementById('not-yet-ordered-task-group').childElementCount;
    if(x>0){alert('모든 일을 할당해줘용');return;} //아직 배열하지 않은 일 있으면 (net-yet-ordered-task-group)에 있으면 다시 하라 하기
    let explain = document.createElement('p');
    explain.innerHTML = '<br>각 일을 본인이 한다고 생각했을 때 예상되는 난이도를 1이상 10이하의 정수로 입력해주십시오<br>';
    eachTaskDifficulty.appendChild(explain);
    eachTaskDifficulty.classList.remove('dim');
    eachTaskDifficulty.classList.add('undim');
    taskGroupsContainer.classList.remove('undim');
    taskGroupsContainer.classList.add('dim');
    taskInputForm.classList.remove('undim');
    taskInputForm.classList.add('dim');
    taskInputEndSubmitForm.classList.remove('undim');
    taskInputEndSubmitForm.classList.add('dim');
    // enteredAllDifficultyForm.classList.remove('dim');
    // enteredAllDifficultyForm.classList.add('undim');

    getDDayForm.classList.add('undim');
    getDDayForm.classList.remove('dim');
    
    for(let i = 0; i < forGetTaskBox.length ; i++){
        let bigDiv = document.createElement('div');
        bigDiv.classList.add('for-difficulty-input-big-div');
        for(let j = 1; j< forGetTaskBox[i].childNodes.length; j++){
            // console.log(forGetTaskBox[i].childNodes[j].firstChild.innerText);
            const div = document.createElement('div');
            // const getHowLongInput = document.createElement('input');
            let taskName = document.createElement('p');
            const getDifficultyInputSmallDiv = document.createElement('div');
            div.classList.add('for-difficulty-input-div');
            getDifficultyInputSmallDiv.classList.add('get-difficulty-input-small-div');
            // getHowLongInput.placeholder = '이 일의 예상 소요일을 작성해주세요.';
            for(let k = 0; k< memberCount ;k++){
                const getDifficultyInput = document.createElement('input');
                getDifficultyInput.autocomplete='off';
                getDifficultyInput.placeholder = `${memberArray[k].name}의 예상 난이도`;
                getDifficultyInput.style.color = memberArray[k].color;
                getDifficultyInput.id = `difficulty-${i}-${j}-${k}`; //각 일의 사용자 개인 난이도 input id 는 difficulty-박스번호-박스안 일 번호-멤버번호
                getDifficultyInput.classList.add('difficulty-input-box');
                getDifficultyInput.onkeydown = ()=>{if(event.keyCode ==13)event.preventDefault();};
                getDifficultyInputSmallDiv.appendChild(getDifficultyInput);
            }
            const howLongItWillTake = document.createElement('input');
            howLongItWillTake.autocomplete = 'off';
            howLongItWillTake.placeholder = '예상되는 소요일을 작성해주세요';
            howLongItWillTake.id = `how-long-${i}-${j}`;
            howLongItWillTake.classList.add('difficulty-input-box');
            getDifficultyInputSmallDiv.appendChild(howLongItWillTake);
            
            taskName.innerHTML = `${forGetTaskBox[i].childNodes[j].firstChild.innerText}`;
            div.appendChild(taskName);
            div.appendChild(getDifficultyInputSmallDiv);
            bigDiv.appendChild(div);
        }
        eachTaskDifficulty.appendChild(bigDiv);
    }
}




function arrangeTasktoMember(){
    if(event.keyCode ==13){
        event.preventDefault();
        for(let i = 0; i < forGetTaskBox.length ; i++){ //난이도 모두 제대로 입력되어 있는지 확인하는 for문
            for(let j = 1; j< forGetTaskBox[i].childNodes.length; j++){ //j==0은 각 박스의 이름 들어있는 <p> ex) 연구과정
                for(let k = 0; k< memberCount ;k++){
                    let forCheck = document.getElementById(`difficulty-${i}-${j}-${k}`).value;
                    if(forCheck>0 && forCheck <=10){
                    }
                    else{ // 양의 정수 아니면(문자나 0이나 음수)
                        // console.log(forCheck);
                        alert("난이도를 올바르게 입력했는지 확인해주세요.");
                        return;
                    }
                }
            }
        }
        let sum = parseInt(0), dd = parseInt(document.getElementById('get-D-day-input').value); //여기서부터 아래까지는 일 예상 소요일 합보다 디데이로 남은 일수가 더 작을 때 다시 입력하라고 경고하는 거
        for(let i = 0; i < forGetTaskBox.length ; i++){
            for(let j = 1; j< forGetTaskBox[i].childNodes.length; j++){ //j==0은 각 박스의 이름 들어있는 <p> ex) 연구과정
                let a = document.getElementById(`how-long-${i}-${j}`).value;
                sum+=parseInt(a);
            }
        }
        if(sum > dd){
            alert('예상되는 일의 소요 시간 또는 그 합이 너무 많습니다! D-day를 늘이거나 예상 소요 시간을 줄이십시오.');
            return;
        }
        else if(dd > 0 && sum <= dd){

        }
        else{
            alert('양의 정수로 D-day를 입력해주세요');
            return;
        }
        eachTaskDifficulty.classList.remove('undim');
        eachTaskDifficulty.classList.add('dim');
        getDDayForm.classList.add('dim');
        getDDayForm.classList.remove('undim');
        showTasksBeforeTellWhoWilldoIt();
    }
}


function showTasksBeforeTellWhoWilldoIt(){ //아직 각 일을 누가 할지 정하기 전에 박스에 일 div 넣는 함수
    ShowWhoWillDoTask.classList.remove('dim');
    ShowWhoWillDoTask.classList.add('undim');
    for(let i = 0; i < forGetTaskBox.length ; i++){
        let bigDiv = document.createElement('div');
        bigDiv.classList.add('big-categories');
        for(let j = 1; j< forGetTaskBox[i].childNodes.length; j++){
            const div = document.createElement('div');
            div.classList.add('task-div');
            let taskName = document.createElement('p');
            taskName.innerHTML = `${forGetTaskBox[i].childNodes[j].firstChild.innerText}`; //task 같은 순서로 넣기
            div.appendChild(taskName);
            bigDiv.appendChild(div);
        }
        ShowWhoWillDoTask.appendChild(bigDiv);
    }
    arrange(); //이제 확률에 맞춰서 일을 멤버에 할당하는 함수 호출
}


const bigCategories = document.getElementsByClassName('big-categories');

let forChoose = [], forChooseTmp = [], forCompare = Infinity, howManyTasksCount, howManyTasks; // forchoose는 일 순서대로 그 일 할 사람 저장해두는 배열이고, forChooseTmp는 forCompare로 비교했을 때 더 이득인 경우 forChoose에 넣어주려고 임시로 저장해두는거 forCompare는 표준편차 또는 분산 저장해두는거 howManyTask는 각 일마다 할 사람 저장해두려고 task 번호 매기는거
let sum1 = parseInt(0), sum2 = parseInt(0), who, forDistribution =[];
let mean1 = parseFloat(0), mean2 = parseFloat(0);

function arrange(){ //여기는 이제 각 일 별로 확률적으로 일 맡기고, 이렇게 하는거 g 반복문에서 몇번 반복해서 표준편차 가장 작은거 채택할거임
    for(let g = 0; g< 100; g++){
        for(let k = 0 ; k< memberCount ; k++){
                    forDistribution[k]=parseInt(0); //이전에 더한 값 남을 수 있으므로 초기화
        }
        howManyTasksCount = parseInt(0); //이거 1씩 증가시키면서 forChooseTmp 배열 인덱스에 접근해서 일 멤버 배열의 최종 분산이 더 작을 경우 forChoose에 넣어줄거임
        for(let i=0;i<bigCategories.length;i++){ //큰 일 덩어리에 접근
            for(let j = 1;j<= bigCategories[i].childNodes.length;j++){ //task에 접근
                sum1 = parseInt(0);
                sum2 = parseInt(0);
                for(let k = 0 ; k< memberCount ; k++){
                    // forDistribution[k]=parseInt(0); //이전에 더한 값 남을 수 있으므로 초기화
                    sum1+=11-parseInt(document.getElementById(`difficulty-${i}-${j}-${k}`).value); //난이도를 쉬움도로 바꿔서 더하기
                    // console.log("1 "+i+" "+j+" "+k+" "+sum1);
                }
                let ran = Math.random();
                for(let k = 0; k< memberCount ; k++){
                    sum2+=11-parseInt(document.getElementById(`difficulty-${i}-${j}-${k}`).value); //여기도 난이도를 쉬움도로 바꿔서 더하기
                    if(sum2/sum1>=ran){ //확률적으로 난이도를 낮게 생각한 사람이 더 잘 걸리게
                        // console.log("2 "+i+" "+j+" "+k+" "+sum2+" "+ran);
                        // who = k;
                        forChooseTmp[howManyTasksCount] = k;
                        forDistribution[k]+=parseInt(document.getElementById(`difficulty-${i}-${j}-${k}`).value);
                        // console.log("3   "+forChooseTmp[howManyTasksCount]+" "+forDistribution[k]+" "+parseInt(document.getElementById(`difficulty-${i}-${j}-${k}`).value));
                        break;
                    }
                }
                howManyTasksCount++;
                
            }
            howManyTasks = howManyTasksCount;
        } // 여기까지 forDistribution 배열 각각에 멤버별 총 체감 난이도 합
        
        mean1 = parseFloat(0);
        mean2 = parseFloat(0);
        for(let k=0; k<memberCount; k++){ //각자가 느끼는 총 부담량 평균 구하기
            mean1+= forDistribution[k]/memberCount;
        }
        
        for(let k=0; k<memberCount; k++){ //분산 계산
            mean2+= (forDistribution[k]-mean1)*(forDistribution[k]-mean1)/memberCount;
        }
        // console.log("mean2 "+ mean2);
        if(mean2 < forCompare){
            forCompare = mean2;
            for(let k=0; k<howManyTasksCount; k++){
                forChoose[k] = forChooseTmp[k]; //만약 이전까지 최소였던 분산을 가지는 배열보다 더 작은 분산이 나오면 넣기 (비교는 다 분산으로 함 위엔 표준편차라 쓰긴 했는데 그게 그거니까)
            }   
            // console.log("forCompare "+forCompare);
        }
        
    }
    showWho();
}



function showWho(){
    // console.log("a");
    let taskC = parseInt(0);
    for(let i=0;i<bigCategories.length;i++){ //표준편차 가장 작은 거 대입
        for(let j = 0;j<bigCategories[i].childNodes.length;j++){
            const who = document.createElement('p');
            who.innerHTML = `${memberArray[forChoose[taskC]].name}`;
            taskC++;
            // bigCategories[i].childNodes[bigCategories[i].childNodes.length-1].removeChild();
            bigCategories[i].childNodes[j].appendChild(who);
        }
    }
    
    let showResultDiv = document.createElement('div');
    showResultDiv.id = 'show-result-div';
    let distri = document.createElement('p');
    distri.innerHTML = `난이도의 분산은 ${forCompare} 입니다.`
    showResultDiv.appendChild(distri);
    ShowWhoWillDoTask.appendChild(showResultDiv);

    getInfo();
}



class TaskAndMember{
    constructor(taskType, task, member){
        this.taskType = taskType; //연구전인지 연구과정인지 연구결과인지
        this.task = task; //일 이름
        this.member = member; //그 일 하는 사람 이름
    }
}
let TaskMemberLink = new Array(501);
let count = parseInt(0);
function getInfo(){
    for(let i=0;i<bigCategories.length;i++){ //표준편차 가장 작은 거 대입
        for(let j = 0;j<bigCategories[i].childNodes.length;j++){
            let t = bigCategories[i].childNodes[j].childNodes[0];
            let m = bigCategories[i].childNodes[j].childNodes[1];
            TaskMemberLink[count] = TaskAndMember;
            if(i==0) TaskMemberLink[count].taskType = `beforeResearch`; //"연구전"박스에 쓴거
            if(i==1) TaskMemberLink[count].taskType = `duringResearch`; //"연구과정"박스에 쓴거
            if(i==2) TaskMemberLink[count].taskType = `afterResearch`; //"연구결과"박스에 쓴거
            TaskMemberLink[count].task = t;
            TaskMemberLink[count].member = m;
            count++;
        }
    }
}



//---------------------------
//멤버 정보: 32번줄 즈음의 memberInfo클래스  //정보는 memberArray에 있음 (인덱스:0 ~ memberCount-1 )
//일 각각을 하는 멤버: 클래스: 418번줄의 TaskAndMember 클래스 // 정보는 TaskMemberLink에 있음 (인덱스: 0 ~ howManyTasks-1 )