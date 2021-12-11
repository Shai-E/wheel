(()=>{
    const canvas = document.querySelector("#myCanvas")
    const context = canvas.getContext('2d');
    let numberOfSpins = 0;
    
    let colors = {
        red: "#e74c3c",
        blue: "#085387"
    }
    
    const initOptions = {
        customColorsArr: [],
        maxSpins: 1,
        container: {
            width: 300,
            display: true,
            backgroundColor: "#0A4260",
            textColor: "#fff",
            fontSize: 16,
            borderRadius: 25,
            displayPointer: true,
            checkboxRequired: true,
        },
        radius: 200,
        dataArr: ["Almost!", "SEO Audit", "Sorry, try again!", "Kickstart Money Course", "Next time!", "Content Audit", "So close!", "SEO Call With My Team"],
        buttonText: "Try My Luck",
        buttonBgColor: "#53B753",
        buttonTextColor: "#fff",
        allowCustomInputs: false,
        pointerDegrees: 45,
    }
    
    const setColor = (i ,cc) => {
    
        if(!cc || cc.length === 0){
            if(i%2===0) {
                return colors.red
            } else {
                return colors.blue
            }
        } else{
            for(let cci = cc.length ; cci >0; cci--)
            if(i%cci===0) {
                return cc[cci-1]
            }
        }
    }
    
    const createContainer = ({container:{displayPointer, display, borderRadius, width, backgroundColor, checkboxRequired}, radius, buttonBgColor, buttonTextColor, pointerDegrees, allowCustomInputs, maxSpins}) => {
        const pointerContainer = document.querySelector('.pointer-container');
        const formContainer = document.querySelector('.form-container');
        const mainContainer = document.querySelector(".main-container");
    
        pointerContainer.style.display = displayPointer ? "flex" : "none";
        pointerContainer.style.setProperty("--pointerDegrees", pointerDegrees)
        formContainer.style.display = display ? "flex" : "none";
        mainContainer.style.setProperty("--width", display ? width : 0);
        mainContainer.style.setProperty("--borderRadius", display ? borderRadius : radius);
        formContainer.style.setProperty("--width", width);
        const inner = document.querySelector(".inner");
        if(!display) {
            inner.innerHTML = "spin";
            inner.onclick = ()=>spin(inner, maxSpins)
        } else if (checkboxRequired) {
            const terms = document.querySelector("#terms");
            const mainContainerBtn = document.querySelector(".btn");
            terms.addEventListener("click", (e) => {
                const {target: {checked}} = e;
                !checked ? mainContainerBtn.setAttribute("disabled", true) : mainContainerBtn.removeAttribute("disabled");
            })
        }
    
        
        mainContainer.style.setProperty("--backgroundColor", backgroundColor);
        const mainContainerBtn = document.querySelector(".btn");
        mainContainerBtn.style.setProperty("--btnBackgroundColor", buttonBgColor);
        mainContainerBtn.style.setProperty("--btnTextColor", buttonTextColor);
        const inputs = document.querySelector("#inputs");
        inputs.style.display = allowCustomInputs ? "flex" : "none";
    
    }
    
    const createWheelSlice = (i, radius, dataArr, customColorsArr) => {
        context.fillStyle = setColor(i, customColorsArr);
            context.strokeStyle = i%2===0?"black":"white";
            const portion = (Math.PI*2)/dataArr.length;
            context.beginPath();
            context.moveTo(radius, radius);
            context.stroke();
            context.arc(radius,radius,radius,Math.PI/2+(i*portion), Math.PI/2+(i+1)*portion, false); 
            context.fill();
            
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.className = `text`;
            span.className = `text-span`;
            const degrees = 360/dataArr.length;
            div.style.setProperty("--portion", degrees);
            div.style.setProperty("--half", dataArr.length%2===0?degrees/2:degrees);
            div.style.setProperty("--rotation", i);
            div.style.setProperty("--radius", radius);
            span.innerHTML = dataArr[i];
            span.style.setProperty("--radius", radius);
            div.append(span);
            const info = document.querySelector(".info")
            info.style.setProperty("--radius", radius);
            info.append(div);
    }
    
    const createWheel=(options)=>{
        let formattedOptions = {...initOptions, ...options,container:{ ...initOptions.container, ...options?.container }}
        localStorage.setItem("wheel-preferences",JSON.stringify(formattedOptions))
        createContainer( formattedOptions )
        document.querySelector("#spinBtn").innerHTML = formattedOptions.buttonText;
    
        const { radius, container: {display}, maxSpins, dataArr, customColorsArr } = formattedOptions;
        const mainContainer = document.querySelector(".main-container");
        const wheelContainer = document.querySelector(".wheel-container");
        const canvasContainer = document.querySelector(".canvas-container");
        const inner = document.querySelector(".inner");
        const spinning = document.querySelector(".spinning");
        mainContainer.style.setProperty("--radius", radius);
        wheelContainer.style.setProperty("--radius", radius);
        canvasContainer.style.setProperty("--radius", radius);
        inner.style.setProperty("--radius", radius);
        spinning.style.setProperty("--radius", radius);
        canvas.width = radius*2;
        canvas.height = radius*2;
        context.clearRect(0,0,radius*2, radius*2);
        document.querySelector(".info").innerHTML = "";
        const btn = document.querySelector(".btn");
        unlimitWheel(display ? btn : inner, maxSpins);
        dataArr.forEach((_dataItem, i)=>createWheelSlice(i, radius, dataArr, customColorsArr))
    }
    
    document.querySelector("#inputs")?.addEventListener("keyup", (e)=>{
        const arr = e.target.value.split("\n");
        const options = JSON.parse(localStorage.getItem("wheel-preferences"));
        createWheel({...options, dataArr: arr});
    });
    
    let spinTaps = 0;
    const randNumOfSpins = () => Math.floor(Math.random()*10000);
    
    const limitSpins=(element, limitNumberOfSpins) =>{
        if(numberOfSpins>=limitNumberOfSpins){
            element.onclick = "";
            element.classList.toggle("disabled");
        }
    };
    const unlimitWheel = (element, limit)=> {
        element.onclick = ()=>spin(element, limit);
        element.classList.remove("disabled");
        numberOfSpins = 0;
    }
    const increaseNumberOfSpins = () => {
        numberOfSpins++;
    };
    
    function spin (element ,limit) {
        increaseNumberOfSpins();
        const rand = spinTaps+randNumOfSpins();
        document.querySelector(".spinning").style.setProperty("--random", rand);
        spinTaps=rand;
        limitSpins(element, limit);
    };
    
    createWheel()
    // createWheel({ dataArr: [0,0,0,0,0,0],radius:180, container: {width: 300, display: false, displayPointer:true, backgroundColor: 'gray'}, buttonBgColor: 'yellow', buttonTextColor:"red", pointerDegrees: 0, allowCustomInputs: false})
})()